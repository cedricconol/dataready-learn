import { CUSTOMERS_CSV, ORDERS_CSV, PRODUCTS_CSV } from "./pythonData";

/**
 * Python source that runs once, right after Pyodide and pandas finish loading.
 *
 * It writes the sample CSVs to the virtual filesystem, builds the preloaded
 * DataFrames, and defines two entry points the React components call:
 *
 *   _dr_run(code)             -> JSON: {stdout, result, error}
 *   _dr_check(code, solution) -> JSON: {stdout, result, error, passed, message}
 *
 * Every call runs in a fresh namespace seeded with copies of the DataFrames, so
 * one run can never leak state into the next. That mirrors the SQL playground,
 * where each query always runs against the pristine database.
 */
export const SEED_PYTHON = `
import ast
import contextlib
import io
import json
import sys
import traceback
import warnings

import numpy as np
import pandas as pd

_CUSTOMERS_CSV = """${CUSTOMERS_CSV}"""
_PRODUCTS_CSV = """${PRODUCTS_CSV}"""
_ORDERS_CSV = """${ORDERS_CSV}"""

for _name, _text in (
    ("customers.csv", _CUSTOMERS_CSV),
    ("products.csv", _PRODUCTS_CSV),
    ("orders.csv", _ORDERS_CSV),
):
    with open(_name, "w") as _f:
        _f.write(_text)

_BASE = {
    "customers": pd.read_csv(io.StringIO(_CUSTOMERS_CSV), parse_dates=["signup_date"]),
    "products": pd.read_csv(io.StringIO(_PRODUCTS_CSV)),
    "orders": pd.read_csv(io.StringIO(_ORDERS_CSV), parse_dates=["order_date"]),
}

_MAX_ROWS = 60
_MAX_COLS = 30


def _dr_namespace():
    ns = {"pd": pd, "np": np, "__name__": "__main__"}
    for _key, _frame in _BASE.items():
        ns[_key] = _frame.copy()
    return ns


def _dr_is_na(value):
    try:
        result = pd.isna(value)
    except (TypeError, ValueError):
        return False
    return result is True or result is np.True_


def _dr_cell(value):
    """Format one value the way pandas would print it, or None for missing."""
    if value is None or _dr_is_na(value):
        return None
    if isinstance(value, (bool, np.bool_)):
        return "True" if value else "False"
    if isinstance(value, (int, np.integer)):
        return str(int(value))
    if isinstance(value, (float, np.floating)):
        text = "{:.10g}".format(float(value))
        if "." not in text and "e" not in text and "n" not in text:
            text += ".0"
        return text
    if isinstance(value, pd.Timestamp):
        if value.hour == 0 and value.minute == 0 and value.second == 0 and value.microsecond == 0:
            return str(value.date())
        return str(value)
    return str(value)


def _dr_label(value):
    text = _dr_cell(value)
    return "NaN" if text is None else text


def _dr_display(value):
    if value is None:
        return {"kind": "none"}

    if isinstance(value, pd.Index):
        value = pd.Series(list(value), name=value.name)

    if isinstance(value, pd.Series):
        total = len(value)
        shown = value.iloc[:_MAX_ROWS]
        return {
            "kind": "series",
            "name": "" if shown.name is None else str(shown.name),
            "dtype": str(value.dtype),
            "index": [_dr_label(i) for i in shown.index],
            "indexName": "" if value.index.name is None else str(value.index.name),
            "values": [_dr_cell(v) for v in shown],
            "length": total,
            "truncated": total > _MAX_ROWS,
        }

    if isinstance(value, pd.DataFrame):
        rows, cols = value.shape
        shown = value.iloc[:_MAX_ROWS, :_MAX_COLS]
        return {
            "kind": "dataframe",
            "columns": [str(c) for c in shown.columns],
            "dtypes": [str(t) for t in shown.dtypes],
            "index": [_dr_label(i) for i in shown.index],
            "indexName": "" if value.index.name is None else str(value.index.name),
            "rows": [[_dr_cell(v) for v in row] for row in shown.itertuples(index=False, name=None)],
            "shape": [rows, cols],
            "truncated": rows > _MAX_ROWS or cols > _MAX_COLS,
        }

    # numpy scalars repr as np.float64(3.5), which is noise for a beginner.
    text = str(value) if isinstance(value, np.generic) else repr(value)
    return {"kind": "text", "text": text}


def _dr_error():
    lines = traceback.format_exception_only(*sys.exc_info()[:2])
    return "".join(lines).strip()


def _dr_exec(code, ns):
    """Run code and return the value of its final expression, if it has one."""
    tree = ast.parse(code, mode="exec")
    if not tree.body:
        return None
    last = tree.body[-1]
    if isinstance(last, ast.Expr):
        head = ast.Module(body=tree.body[:-1], type_ignores=[])
        exec(compile(head, "<cell>", "exec"), ns)
        return eval(compile(ast.Expression(body=last.value), "<cell>", "eval"), ns)
    exec(compile(tree, "<cell>", "exec"), ns)
    return None


def _dr_warnings(caught):
    """Pandas says useful things through warnings, so surface them like output."""
    lines = []
    for entry in caught:
        lines.append("{}: {}".format(entry.category.__name__, str(entry.message).strip()))
    return "\\n".join(lines)


def _dr_run(code):
    ns = _dr_namespace()
    buffer = io.StringIO()
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        try:
            with contextlib.redirect_stdout(buffer):
                value = _dr_exec(code, ns)
        except Exception:
            return json.dumps(
                {"stdout": buffer.getvalue(), "result": {"kind": "none"}, "error": _dr_error()}
            )
        printed = buffer.getvalue()
        warned = _dr_warnings(caught)
    if warned:
        printed = (printed + "\\n" if printed and not printed.endswith("\\n") else printed) + warned
    return json.dumps({"stdout": printed, "result": _dr_display(value), "error": None})


# --- Answer checking ------------------------------------------------------


def _dr_kind(value):
    if isinstance(value, pd.DataFrame):
        return "DataFrame"
    if isinstance(value, pd.Series):
        return "Series"
    if isinstance(value, pd.Index):
        return "Index"
    return "value"


def _dr_index_matters(index):
    """Keep the index in the comparison only when it carries information.

    A groupby or resample result stores the answer in its index, so it has to be
    compared. A plain unnamed integer index (what filtering or sorting leaves
    behind) is just row numbering, so it is dropped.
    """
    if isinstance(index, pd.MultiIndex):
        return True
    if index.name is not None:
        return True
    return index.dtype.kind not in "iu"


def _dr_frame(value):
    if isinstance(value, pd.Index):
        value = pd.Series(list(value), name=value.name)
    if isinstance(value, pd.Series):
        value = value.to_frame(name="value" if value.name is None else value.name)
    frame = value.copy()
    if _dr_index_matters(frame.index):
        frame = frame.reset_index()
    else:
        frame = frame.reset_index(drop=True)
    frame.columns = [str(c) for c in frame.columns]
    return frame


def _dr_key(value):
    if value is None or _dr_is_na(value):
        return None
    if isinstance(value, (bool, np.bool_)):
        return bool(value)
    if isinstance(value, (int, np.integer, float, np.floating)):
        return round(float(value), 6)
    if isinstance(value, pd.Timestamp):
        return str(value)
    return str(value)


def _dr_rows(frame, columns, ordered=False):
    rows = [tuple(_dr_key(row[c]) for c in columns) for _, row in frame.iterrows()]
    if not ordered:
        rows.sort(key=lambda row: [(item is None, str(item)) for item in row])
    return rows


def _dr_rows_match(rows_actual, rows_expected):
    for row_a, row_e in zip(rows_actual, rows_expected):
        for item_a, item_e in zip(row_a, row_e):
            if isinstance(item_a, float) and isinstance(item_e, float):
                if abs(item_a - item_e) >= 1e-6:
                    return False
            elif item_a != item_e:
                return False
    return True


def _dr_scalar_match(actual, expected):
    a, e = _dr_key(actual), _dr_key(expected)
    if isinstance(a, float) and isinstance(e, float):
        return abs(a - e) < 1e-6
    return a == e


def _dr_compare(actual, expected, ordered=False):
    if actual is None:
        return False, "Your code did not return anything. Make the last line the value you want checked."

    kind_actual, kind_expected = _dr_kind(actual), _dr_kind(expected)

    if kind_expected == "value":
        if kind_actual != "value":
            return False, "Expected a single value, but your last line returned a " + kind_actual + "."
        if _dr_scalar_match(actual, expected):
            return True, "Correct!"
        return False, "That is not the expected value."

    if kind_actual == "value":
        return False, "Expected a " + kind_expected + ", but your last line returned a single value."

    frame_actual, frame_expected = _dr_frame(actual), _dr_frame(expected)

    # The name attached to a Series is incidental: groupby(...).size() and
    # groupby(...)["order_id"].count() are the same answer. When either side is a
    # Series, compare the values rather than the label of the value column, which
    # also lets a one-column DataFrame stand in for a Series.
    series_involved = "Series" in (kind_actual, kind_expected) or "Index" in (kind_actual, kind_expected)
    if series_involved and len(frame_actual.columns) == len(frame_expected.columns):
        frame_actual = frame_actual.rename(columns={frame_actual.columns[-1]: "value"})
        frame_expected = frame_expected.rename(columns={frame_expected.columns[-1]: "value"})

    if len(frame_actual.columns) != len(frame_expected.columns):
        message = "Expected {} column(s), got {}.".format(
            len(frame_expected.columns), len(frame_actual.columns)
        )
        if kind_expected in ("Series", "Index") and kind_actual == "DataFrame":
            message += " Selecting one column with single brackets, like df['a'], gives a Series."
        if kind_expected == "DataFrame" and kind_actual == "Series":
            message += " Double brackets, like df[['a']], keep it a DataFrame."
        return False, message

    for column in frame_expected.columns:
        if column not in list(frame_actual.columns):
            return False, 'Missing column "{}" in your result.'.format(column)

    if len(frame_actual) != len(frame_expected):
        return False, "Expected {} row(s), got {}.".format(len(frame_expected), len(frame_actual))

    columns = list(frame_expected.columns)

    if _dr_rows_match(
        _dr_rows(frame_actual, columns, ordered),
        _dr_rows(frame_expected, columns, ordered),
    ):
        return True, "Correct!"

    if ordered and _dr_rows_match(
        _dr_rows(frame_actual, columns), _dr_rows(frame_expected, columns)
    ):
        return False, "Right rows, wrong order. This question depends on the sort order."

    return False, "The values do not match. Check your result against the question."


def _dr_check(code, solution, ordered=False):
    buffer = io.StringIO()
    try:
        with contextlib.redirect_stdout(buffer):
            actual = _dr_exec(code, _dr_namespace())
    except Exception:
        return json.dumps(
            {
                "stdout": buffer.getvalue(),
                "result": {"kind": "none"},
                "error": _dr_error(),
                "passed": False,
                "message": "Your code raised an error.",
            }
        )

    expected = _dr_exec(solution, _dr_namespace())
    passed, message = _dr_compare(actual, expected, ordered)
    return json.dumps(
        {
            "stdout": buffer.getvalue(),
            "result": _dr_display(actual),
            "error": None,
            "passed": passed,
            "message": message,
        }
    )
`;

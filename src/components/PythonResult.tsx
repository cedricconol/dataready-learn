import React from "react";
import styles from "./PythonResult.module.css";
import type { Cell, ResultView } from "./pythonRuntime";

function Value({ cell }: { cell: Cell }): React.ReactElement {
  if (cell === null) return <span className={styles.na}>NaN</span>;
  return <>{cell}</>;
}

function shapeLabel(rows: number, columns: number): string {
  const rowWord = rows === 1 ? "row" : "rows";
  const columnWord = columns === 1 ? "column" : "columns";
  return `${rows} ${rowWord} × ${columns} ${columnWord}`;
}

/**
 * Renders whatever the last line of a cell evaluated to: a DataFrame, a Series,
 * or a plain value, plus anything the code printed.
 */
export default function PythonResult({
  stdout,
  result,
}: {
  stdout: string;
  result: ResultView;
}): React.ReactElement | null {
  const printed = stdout.replace(/\n+$/, "");

  const body = (() => {
    if (result.kind === "dataframe") {
      return (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.indexHead}>{result.indexName}</th>
                {result.columns.map((column, i) => (
                  <th key={`${column}-${i}`}>
                    {column}
                    <span className={styles.dtype}>{result.dtypes[i]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, ri) => (
                <tr key={ri}>
                  <td className={styles.indexCell}>{result.index[ri]}</td>
                  {row.map((cell, ci) => (
                    <td key={ci}>
                      <Value cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.meta}>
            {shapeLabel(result.shape[0], result.shape[1])}
            {result.truncated ? " (showing the first rows)" : ""}
          </div>
        </div>
      );
    }

    if (result.kind === "series") {
      return (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.indexHead}>{result.indexName}</th>
                <th>
                  {result.name || "Series"}
                  <span className={styles.dtype}>{result.dtype}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {result.values.map((value, i) => (
                <tr key={i}>
                  <td className={styles.indexCell}>{result.index[i]}</td>
                  <td>
                    <Value cell={value} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.meta}>
            Series of {result.length} value{result.length === 1 ? "" : "s"}
            {result.truncated ? " (showing the first rows)" : ""}
          </div>
        </div>
      );
    }

    if (result.kind === "text") {
      return <pre className={styles.text}>{result.text}</pre>;
    }

    return null;
  })();

  if (!printed && body === null) return null;

  return (
    <>
      {printed && <pre className={styles.stdout}>{printed}</pre>}
      {body}
    </>
  );
}

import React, { useEffect, useRef, useState } from "react";
import type { Database } from "sql.js";
import styles from "./SqlExercise.module.css";
import { useAutoResizeTextarea } from "./useAutoResizeTextarea";

const SEED_SQL = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name        TEXT,
  email       TEXT,
  city        TEXT,
  country     TEXT
);
INSERT INTO customers VALUES
  (1,'Alice Johnson','alice@example.com','New York','USA'),
  (2,'Bob Smith','bob@example.com','London','UK'),
  (3,'Carol White','carol@example.com','Sydney','Australia'),
  (4,'Dave Brown','dave@example.com','Toronto','Canada'),
  (5,'Eve Davis','eve@example.com','New York','USA'),
  (6,'Frank Lee','frank@example.com',NULL,'USA');

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  name       TEXT,
  category   TEXT,
  price      REAL
);
INSERT INTO products VALUES
  (1,'Laptop','Electronics',999.00),
  (2,'Mouse','Electronics',29.99),
  (3,'Desk','Furniture',349.00),
  (4,'Chair','Furniture',199.00),
  (5,'Notebook','Stationery',4.99);

CREATE TABLE orders (
  order_id     INTEGER PRIMARY KEY,
  customer_id  INTEGER,
  product_id   INTEGER,
  order_date   TEXT,
  quantity     INTEGER,
  total_amount REAL,
  status       TEXT
);
INSERT INTO orders VALUES
  (1,1,1,'2024-01-05',1,999.00,'completed'),
  (2,1,2,'2024-01-10',2,59.98,'completed'),
  (3,2,3,'2024-01-15',1,349.00,'completed'),
  (4,3,4,'2024-02-01',4,796.00,'completed'),
  (5,4,5,'2024-02-10',10,49.90,NULL),
  (6,1,3,'2024-03-01',1,349.00,'cancelled'),
  (7,2,1,'2024-03-15',1,999.00,'completed'),
  (8,5,2,'2024-04-01',3,89.97,'completed'),
  (9,3,1,'2024-04-10',1,999.00,'pending'),
  (10,4,5,'2024-05-01',5,24.95,'pending');
`;

const SCHEMA = [
  {
    table: "customers",
    columns: [
      { name: "customer_id", type: "INTEGER", note: "PK" },
      { name: "name",        type: "TEXT" },
      { name: "email",       type: "TEXT" },
      { name: "city",        type: "TEXT" },
      { name: "country",     type: "TEXT" },
    ],
  },
  {
    table: "products",
    columns: [
      { name: "product_id", type: "INTEGER", note: "PK" },
      { name: "name",       type: "TEXT" },
      { name: "category",   type: "TEXT" },
      { name: "price",      type: "REAL" },
    ],
  },
  {
    table: "orders",
    columns: [
      { name: "order_id",     type: "INTEGER", note: "PK" },
      { name: "customer_id",  type: "INTEGER", note: "FK" },
      { name: "product_id",   type: "INTEGER", note: "FK" },
      { name: "order_date",   type: "TEXT" },
      { name: "quantity",     type: "INTEGER" },
      { name: "total_amount", type: "REAL" },
      { name: "status",       type: "TEXT" },
    ],
  },
];

type Cell = string | number | null;

interface Expected {
  columns: string[];
  rows: Cell[][];
}

interface Props {
  expected: Expected;
  tables?: string[];
}

function rowKey(row: Cell[]): string {
  return row.map(c => (c === null ? "\x00" : String(c))).join("\x01");
}

function check(
  actual: { columns: string[]; rows: Cell[][] },
  expected: Expected
): { passed: boolean; message: string } {
  if (expected.rows.length === 0) {
    return actual.rows.length === 0
      ? { passed: true, message: "Correct! No rows returned." }
      : { passed: false, message: `Expected 0 rows, got ${actual.rows.length}.` };
  }

  if (actual.columns.length !== expected.columns.length) {
    return {
      passed: false,
      message: `Expected ${expected.columns.length} column(s), got ${actual.columns.length}.`,
    };
  }

  // Map each expected column to its index in the actual result (order-independent)
  const colMap: number[] = [];
  for (const expCol of expected.columns) {
    const idx = actual.columns.findIndex(c => c.toLowerCase() === expCol.toLowerCase());
    if (idx === -1) {
      return { passed: false, message: `Missing column "${expCol}" in your result.` };
    }
    colMap.push(idx);
  }

  if (actual.rows.length !== expected.rows.length) {
    return {
      passed: false,
      message: `Expected ${expected.rows.length} row(s), got ${actual.rows.length}.`,
    };
  }

  // Reorder each actual row to match expected column order before comparing
  const reordered = actual.rows.map(row => colMap.map(i => row[i]));
  const ak = reordered.map(rowKey).sort();
  const ek = expected.rows.map(rowKey).sort();
  for (let i = 0; i < ek.length; i++) {
    if (ak[i] !== ek[i]) {
      return { passed: false, message: "Row values don't match. Check your results." };
    }
  }

  return { passed: true, message: "Correct!" };
}

function ResultTable({ columns, rows }: { columns: string[]; rows: Cell[][] }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>
                  {cell === null
                    ? <span className={styles.null}>NULL</span>
                    : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.rowCount}>
        {rows.length} row{rows.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default function SqlExercise({ expected, tables = [] }: Props): React.ReactElement {
  const dbRef = useRef<Database | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = useState("-- Write your query here\n");

  useAutoResizeTextarea(editorRef, query);
  const [actual, setActual] = useState<{ columns: string[]; rows: Cell[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [verdict, setVerdict] = useState<{ passed: boolean; message: string } | null>(null);
  const [schemaOpen, setSchemaOpen] = useState(false);

  const schemaToShow = SCHEMA.filter(s => tables.includes(s.table));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const initSqlJs = (await import("sql.js")).default;
        const SQL = await initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
        if (cancelled) return;
        const db = new SQL.Database();
        db.run(SEED_SQL);
        dbRef.current = db;
        setReady(true);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function run(withCheck: boolean) {
    if (!dbRef.current) return;
    setError(null);
    setActual(null);
    if (withCheck) setVerdict(null);
    try {
      const raw = dbRef.current.exec(query);
      if (raw.length === 0) {
        const result = { columns: [], rows: [] };
        setActual(result);
        if (withCheck) setVerdict(check(result, expected));
      } else {
        const r = raw[0];
        const result = { columns: r.columns, rows: r.values as Cell[][] };
        setActual(result);
        if (withCheck) setVerdict(check(result, expected));
      }
    } catch (e) {
      setError(String(e).replace(/^Error: /, ""));
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run(false);
    }
  }

  return (
    <div className={styles.exercise}>
      {/* Header with schema toggle */}
      {schemaToShow.length > 0 && (
        <div className={styles.header}>
          <button
            className={styles.schemaToggle}
            onClick={() => setSchemaOpen(o => !o)}
            aria-expanded={schemaOpen}
          >
            {schemaOpen ? "▾" : "▸"} Schema
          </button>
        </div>
      )}

      {/* Collapsible schema */}
      {schemaOpen && (
        <div className={styles.schema}>
          {schemaToShow.map(({ table, columns }) => (
            <div key={table} className={styles.schemaTable}>
              <div className={styles.schemaTableName}>{table}</div>
              <div className={styles.schemaColumns}>
                {columns.map(({ name, type, note }) => (
                  <div key={name} className={styles.schemaColumn}>
                    <span className={styles.schemaColName}>{name}</span>
                    <span className={styles.schemaColType}>{type}</span>
                    {note && <span className={styles.schemaColNote}>{note}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <textarea
        ref={editorRef}
        className={styles.editor}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={4}
      />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button className={styles.runBtn} onClick={() => run(false)} disabled={!ready}>
          {ready ? "▶ Run" : "Loading…"}
        </button>
        <span className={styles.shortcut}>⌘ / Ctrl + Enter to run</span>
        {verdict && (
          <span className={verdict.passed ? styles.pass : styles.fail}>
            {verdict.passed ? `✓ ${verdict.message}` : `✗ ${verdict.message}`}
          </span>
        )}
        <button className={styles.submitBtn} onClick={() => run(true)} disabled={!ready}>
          Submit
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Output */}
      {actual && actual.columns.length > 0 && (
        <div className={styles.output}>
          <div className={styles.outputLabel}>Output</div>
          <ResultTable columns={actual.columns} rows={actual.rows} />
        </div>
      )}
      {actual && actual.columns.length === 0 && !error && (
        <div className={styles.empty}>Query ran — no rows returned.</div>
      )}
    </div>
  );
}

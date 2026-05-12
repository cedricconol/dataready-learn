import React, { useEffect, useRef, useState } from "react";
import type { Database } from "sql.js";
import styles from "./SqlPlayground.module.css";

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
  (5,'Eve Davis','eve@example.com','New York','USA');

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
  (5,4,5,'2024-02-10',10,49.90,'pending'),
  (6,1,3,'2024-03-01',1,349.00,'cancelled'),
  (7,2,1,'2024-03-15',1,999.00,'completed'),
  (8,5,2,'2024-04-01',3,89.97,'completed'),
  (9,3,1,'2024-04-10',1,999.00,'pending'),
  (10,4,5,'2024-05-01',5,24.95,'pending');
`;

const DEFAULT_QUERY = "SELECT * FROM orders LIMIT 5;";

type QueryResult = {
  columns: string[];
  rows: (string | number | null)[][];
};

export default function SqlPlayground(): React.ReactElement {
  const dbRef = useRef<Database | null>(null);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [results, setResults] = useState<QueryResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

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

  function run() {
    if (!dbRef.current) return;
    setError(null);
    setResults(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = dbRef.current.exec(query);
      setResults(
        raw.map((r) => ({
          columns: r.columns,
          rows: r.values as (string | number | null)[][],
        }))
      );
    } catch (e) {
      setError(String(e));
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  }

  return (
    <div className={styles.playground}>
      <div className={styles.header}>
        <span className={styles.title}>SQL Playground</span>
        <span className={styles.hint}>Tables: <code>orders</code>, <code>customers</code>, <code>products</code></span>
      </div>

      <textarea
        className={styles.editor}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={5}
      />

      <div className={styles.toolbar}>
        <button
          className={styles.runBtn}
          onClick={run}
          disabled={!ready}
        >
          {ready ? "▶ Run" : "Loading…"}
        </button>
        <span className={styles.shortcut}>or ⌘ / Ctrl + Enter</span>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error.replace(/^Error: /, "")}
        </div>
      )}

      {results !== null && results.length === 0 && (
        <div className={styles.empty}>Query ran successfully — no rows returned.</div>
      )}

      {results && results.map((result, i) => (
        <div key={i} className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {result.columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{cell === null ? <span className={styles.null}>NULL</span> : String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.rowCount}>{result.rows.length} row{result.rows.length !== 1 ? "s" : ""}</div>
        </div>
      ))}
    </div>
  );
}

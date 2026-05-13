import React from "react";
import styles from "./SchemaCard.module.css";

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

interface Props {
  tables: string[];
}

export default function SchemaCard({ tables }: Props): React.ReactElement {
  const toShow = SCHEMA.filter(s => tables.includes(s.table));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.tag}>Schema</span>
      </div>
      <div className={styles.body}>
        {toShow.map(({ table, columns }) => (
          <div key={table} className={styles.table}>
            <div className={styles.tableName}>{table}</div>
            <div className={styles.columns}>
              {columns.map(({ name, type, note }) => (
                <div key={name} className={styles.column}>
                  <span className={styles.colName}>{name}</span>
                  <span className={styles.colType}>{type}</span>
                  {note && <span className={styles.colNote}>{note}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

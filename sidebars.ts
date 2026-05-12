import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  sqlSidebar: [
    {
      type: "doc",
      id: "sql/sql",
      label: "Overview",
    },
    {
      type: "category",
      label: "Lessons",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Getting Started",
          collapsed: false,
          items: [
            "sql/intro-to-sql",
          ],
        },
        {
          type: "category",
          label: "Your First Query",
          collapsed: false,
          items: [
            "sql/sql-select",
            "sql/sql-from",
            "sql/sql-where",
            "sql/sql-and-or",
          ],
        },
        {
          type: "category",
          label: "Filtering Techniques",
          collapsed: false,
          items: [
            "sql/sql-in",
            "sql/sql-between",
            "sql/sql-like",
            "sql/sql-is-null",
          ],
        },
        {
          type: "category",
          label: "Shaping Results",
          collapsed: false,
          items: [
            "sql/sql-as",
            "sql/sql-distinct",
            "sql/sql-order-by",
            "sql/sql-limit",
          ],
        },
        {
          type: "category",
          label: "Joining Tables",
          collapsed: false,
          items: [
            "sql/sql-join",
            "sql/sql-on",
            "sql/sql-left-join",
          ],
        },
        {
          type: "category",
          label: "Aggregating Data",
          collapsed: false,
          items: [
            "sql/sql-aggregate-functions",
            "sql/sql-group-by",
            "sql/sql-having",
          ],
        },
        {
          type: "category",
          label: "How SQL Thinks",
          collapsed: false,
          items: [
            "sql/sql-execution-order",
          ],
        },
        {
          type: "category",
          label: "Writing Cleaner Queries",
          collapsed: false,
          items: [
            "sql/sql-case-when",
            "sql/sql-with-cte",
          ],
        },
        {
          type: "category",
          label: "Window Functions",
          collapsed: false,
          items: [
            "sql/sql-window-functions",
            "sql/sql-rank",
            "sql/sql-lag-lead",
            "sql/sql-running-totals",
          ],
        },
        {
          type: "category",
          label: "Set Operations & Subqueries",
          collapsed: false,
          items: [
            "sql/sql-subqueries",
            "sql/sql-union",
            "sql/sql-exists",
          ],
        },
        {
          type: "category",
          label: "Useful Functions",
          collapsed: false,
          items: [
            "sql/sql-coalesce",
            "sql/sql-date-functions",
          ],
        },
      ],
    },
  ],

  dbtSidebar: [
    {
      type: "doc",
      id: "dbt/dbt",
      label: "Overview",
    },
    {
      type: "category",
      label: "Lessons",
      collapsed: false,
      items: ["dbt/intro-to-dbt"],
    },
  ],

  warehouseSidebar: [
    {
      type: "doc",
      id: "data-warehouse/data-warehouse",
      label: "Overview",
    },
    {
      type: "category",
      label: "Lessons",
      collapsed: false,
      items: ["data-warehouse/intro-to-data-warehouse"],
    },
  ],

  biSidebar: [
    {
      type: "doc",
      id: "bi-tools/bi-tools",
      label: "Overview",
    },
    {
      type: "category",
      label: "Lessons",
      collapsed: false,
      items: ["bi-tools/intro-to-bi-tools"],
    },
  ],
};

export default sidebars;

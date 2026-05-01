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
      items: ["sql/intro-to-sql"],
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

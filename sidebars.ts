import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  // The SQL, Python, Terminal, and Git tracks moved to Menthoro. Their docs are
  // excluded from the build (see docusaurus.config.ts), so they have no sidebars.
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

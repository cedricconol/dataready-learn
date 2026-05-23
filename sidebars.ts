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
    {
      type: "category",
      label: "Practice Exams",
      collapsed: false,
      items: [
        "sql/sql-exam-01-basic-select",
        "sql/sql-exam-02-where",
        "sql/sql-exam-03-filter-techniques",
        "sql/sql-exam-04-shaping",
        "sql/sql-exam-05-joins",
        "sql/sql-exam-06-aggregation",
        "sql/sql-exam-07-subqueries",
        "sql/sql-exam-08-case-cte",
        "sql/sql-exam-09-window-functions",
        "sql/sql-exam-10-mixed",
      ],
    },
  ],

  terminalSidebar: [
    {
      type: "doc",
      id: "terminal/terminal",
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
            "terminal/terminal-setup",
            "terminal/intro-to-terminal",
          ],
        },
        {
          type: "category",
          label: "Orientation",
          collapsed: false,
          items: [
            "terminal/terminal-pwd",
            "terminal/terminal-ls",
            "terminal/terminal-ls-flags",
            "terminal/terminal-cd",
            "terminal/terminal-navigation",
            "terminal/terminal-orientation-capstone",
          ],
        },
        {
          type: "category",
          label: "Files & Directories",
          collapsed: false,
          items: [
            "terminal/terminal-touch",
            "terminal/terminal-mkdir",
            "terminal/terminal-mkdir-p",
            "terminal/terminal-cp",
            "terminal/terminal-mv",
            "terminal/terminal-rm",
            "terminal/terminal-rm-rf",
          ],
        },
        {
          type: "category",
          label: "Reading Files",
          collapsed: false,
          items: [
            "terminal/terminal-cat",
            "terminal/terminal-head",
            "terminal/terminal-tail",
            "terminal/terminal-wc",
          ],
        },
      ],
    },
  ],

  gitSidebar: [
    {
      type: "doc",
      id: "git/git",
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
          items: ["git/git-setup"],
        },
        {
          type: "category",
          label: "Your First Repo",
          collapsed: false,
          items: ["git/git-init", "git/git-add-commit"],
        },
        "git/git-checkpoint-1",
        {
          type: "category",
          label: "Working with GitHub",
          collapsed: false,
          items: ["git/git-github"],
        },
        "git/git-checkpoint-2",
        {
          type: "category",
          label: "The Everyday Loop",
          collapsed: false,
          items: ["git/git-diff", "git/git-amend"],
        },
        {
          type: "category",
          label: "Branches & Pull Requests",
          collapsed: false,
          items: ["git/git-branch", "git/git-pull-request"],
        },
        "git/git-checkpoint-3",
        {
          type: "category",
          label: "Collaboration",
          collapsed: false,
          items: ["git/git-clone"],
        },
        {
          type: "category",
          label: "When Things Go Wrong",
          collapsed: false,
          items: ["git/git-conflict", "git/git-undo"],
        },
        "git/git-checkpoint-4",
        {
          type: "category",
          label: "Rebasing & History",
          collapsed: false,
          items: ["git/git-rebase"],
        },
        {
          type: "category",
          label: "GitHub Workflows",
          collapsed: false,
          items: ["git/git-workflows"],
        },
        {
          type: "category",
          label: "Portfolio Polish",
          collapsed: false,
          items: ["git/git-portfolio"],
        },
        "git/git-checkpoint-final",
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

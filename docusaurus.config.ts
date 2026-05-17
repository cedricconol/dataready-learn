import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "DataReady",
  tagline: "The open-source data analytics curriculum.",
  favicon: "img/favicon.svg",

  future: {
    v4: true,
    faster: {
      rspackBundler: false,
      rspackPersistentCache: false,
    },
  },

  url: "https://learndataready.byconol.com",
  baseUrl: "/",

  organizationName: "cedricconol",
  projectName: "dataready-learn",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  markdown: {
    mdx1Compat: {
      admonitions: true,
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/cedricconol/dataready-learn/edit/main/",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/dataready-social-card.png",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "",
      logo: {
        alt: "DataReady Logo",
        src: "img/logo-light.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "sqlSidebar",
          position: "left",
          label: "SQL",
        },
        {
          href: "https://github.com/cedricconol/dataready-learn",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Curriculum",
          items: [
            { label: "SQL", to: "/sql" },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub Issues",
              href: "https://github.com/cedricconol/dataready-learn/issues",
            },
            {
              label: "Contributing",
              href: "https://github.com/cedricconol/dataready-learn/blob/main/CONTRIBUTING.md",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "byconol.com",
              href: "https://byconol.com",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DataReady. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["sql", "bash", "yaml"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

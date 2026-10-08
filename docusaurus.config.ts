import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import * as dotenv from "dotenv";
import { MENTHORO_COURSES } from "./src/lib/menthoro";

dotenv.config({ path: ".env.local" });

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

  customFields: {
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  },

  // Sends old SQL/Python/Terminal/Git lesson URLs to Menthoro before render.
  scripts: [{ src: "/menthoro-redirect.js", async: false }],

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
          // These tracks moved to Menthoro; their URLs redirect there.
          exclude: ["sql/**", "python/**", "terminal/**", "git/**"],
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
          href: MENTHORO_COURSES.sql,
          label: "SQL",
          position: "left",
          target: "_self",
        },
        {
          href: MENTHORO_COURSES.terminal,
          label: "Terminal",
          position: "left",
          target: "_self",
        },
        {
          href: MENTHORO_COURSES.git,
          label: "Git",
          position: "left",
          target: "_self",
        },
        {
          href: MENTHORO_COURSES.python,
          label: "Python",
          position: "left",
          target: "_self",
        },
        {
          type: "custom-user",
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
            { label: "SQL", href: MENTHORO_COURSES.sql, target: "_self" },
            { label: "Terminal", href: MENTHORO_COURSES.terminal, target: "_self" },
            { label: "Git", href: MENTHORO_COURSES.git, target: "_self" },
            { label: "Python", href: MENTHORO_COURSES.python, target: "_self" },
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

/**
 * Swizzled DocItem/Layout.
 * - Reads `youtube_url` from frontmatter and renders a YouTube embed above content.
 * - Renders an interactive SQL Playground below content on all SQL lesson pages.
 */
import React from "react";
import Layout from "@theme-original/DocItem/Layout";
import type LayoutType from "@theme/DocItem/Layout";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import YouTubeEmbed from "@site/src/components/YouTubeEmbed";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SqlPlayground from "@site/src/components/SqlPlayground";

type Props = WrapperProps<typeof LayoutType>;

export default function DocItemLayout(props: Props): JSX.Element {
  const { frontMatter, metadata } = useDoc();
  const youtubeUrl = (frontMatter as Record<string, unknown>)[
    "youtube_url"
  ] as string | undefined;

  const isSqlLesson =
    metadata.id.startsWith("sql/") && metadata.id !== "sql/sql";

  return (
    <>
      {youtubeUrl && <YouTubeEmbed url={youtubeUrl} />}
      <Layout {...props} />
      {isSqlLesson && (
        <BrowserOnly>{() => <SqlPlayground />}</BrowserOnly>
      )}
    </>
  );
}

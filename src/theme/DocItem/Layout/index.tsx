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
// SqlPlayground is injected via DocItem/Footer swizzle (renders before pagination)
type Props = WrapperProps<typeof LayoutType>;

export default function DocItemLayout(props: Props): JSX.Element {
  const { frontMatter } = useDoc();
  const youtubeUrl = (frontMatter as Record<string, unknown>)[
    "youtube_url"
  ] as string | undefined;

  return (
    <>
      {youtubeUrl && <YouTubeEmbed url={youtubeUrl} />}
      <Layout {...props} />
    </>
  );
}

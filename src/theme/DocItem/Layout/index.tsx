/**
 * Swizzled DocItem/Layout.
 * Reads `youtube_url` from page frontmatter and renders an embedded YouTube
 * player above the doc content when the field is populated.
 */
import React from "react";
import Layout from "@theme-original/DocItem/Layout";
import type LayoutType from "@theme/DocItem/Layout";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import YouTubeEmbed from "@site/src/components/YouTubeEmbed";

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

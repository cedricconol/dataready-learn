/**
 * Swizzled DocItem/Paginator.
 * Injects the SQL Playground immediately before the prev/next pagination
 * on all SQL lesson pages.
 */
import React from "react";
import Paginator from "@theme-original/DocItem/Paginator";
import type PaginatorType from "@theme/DocItem/Paginator";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SqlPlayground from "@site/src/components/SqlPlayground";

type Props = WrapperProps<typeof PaginatorType>;

export default function DocItemPaginator(props: Props): JSX.Element {
  const { metadata } = useDoc();

  const isSqlLesson =
    metadata.id.startsWith("sql/") &&
    metadata.id !== "sql/sql" &&
    !metadata.id.includes("exam");

  return (
    <>
      {isSqlLesson && (
        <BrowserOnly>{() => <SqlPlayground />}</BrowserOnly>
      )}
      <Paginator {...props} />
    </>
  );
}

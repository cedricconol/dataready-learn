/**
 * Swizzled DocItem/Paginator.
 * Injects the SQL Playground and MarkCompleteButton immediately before the prev/next pagination.
 * - Playground: all SQL lesson pages (not exams)
 */
import React from "react";
import Paginator from "@theme-original/DocItem/Paginator";
import type PaginatorType from "@theme/DocItem/Paginator";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SqlPlayground from "@site/src/components/SqlPlayground";
import TerminalPlayground from "@site/src/components/TerminalPlayground";
import MarkCompleteButton from "@site/src/components/MarkCompleteButton";

type Props = WrapperProps<typeof PaginatorType>;

function isOverviewPage(id: string): boolean {
  const parts = id.split("/");
  return parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2];
}

export default function DocItemPaginator(props: Props): JSX.Element {
  const { metadata, frontMatter } = useDoc();
  const { id } = metadata;

  const isSqlLesson =
    id.startsWith("sql/") &&
    id !== "sql/sql" &&
    !id.includes("exam");

  const terminalLessonId = (frontMatter as Record<string, unknown>)[
    "terminal_lesson_id"
  ] as string | undefined;

  const showMarkComplete = !isOverviewPage(id);

  return (
    <>
      {isSqlLesson && (
        <BrowserOnly>{() => <SqlPlayground />}</BrowserOnly>
      )}
      {terminalLessonId && (
        <BrowserOnly fallback={<div style={{ padding: "2rem", color: "#4b6080" }}>Loading terminal…</div>}>
          {() => <TerminalPlayground lessonId={terminalLessonId} />}
        </BrowserOnly>
      )}
      {showMarkComplete && (
        <BrowserOnly fallback={<div style={{ height: "3rem" }} />}>
          {() => <MarkCompleteButton lessonId={id} />}
        </BrowserOnly>
      )}
      <Paginator {...props} />
    </>
  );
}

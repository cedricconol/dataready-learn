/**
 * Swizzled DocItem/Paginator.
 * Injects the playgrounds and MarkCompleteButton immediately before the prev/next pagination.
 * - SQL Playground: all SQL lesson pages (not exams)
 * - Python Playground: all Python lesson pages (not exams)
 */
import React from "react";
import Paginator from "@theme-original/DocItem/Paginator";
import type PaginatorType from "@theme/DocItem/Paginator";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SqlPlayground from "@site/src/components/SqlPlayground";
import PythonPlayground from "@site/src/components/PythonPlayground";
import TerminalPlayground from "@site/src/components/TerminalPlayground";
import MarkCompleteButton from "@site/src/components/MarkCompleteButton";

type Props = WrapperProps<typeof PaginatorType>;

function isOverviewPage(id: string): boolean {
  const parts = id.split("/");
  return parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2];
}

/**
 * sidebar_position of python/pandas-read-csv, the lesson that teaches read_csv.
 * Only the lessons after it start the playground with the import and read_csv
 * calls written out. Reading data itself is excluded, so its playground stays
 * blank of the very calls the lesson asks the learner to write.
 * Keep this in step with the frontmatter if the Python lessons are renumbered.
 */
const READING_DATA_POSITION = 8;

export default function DocItemPaginator(props: Props): JSX.Element {
  const { metadata, frontMatter } = useDoc();
  const { id } = metadata;

  // Opt-out for lessons that discuss pandas rather than ask the reader to run it.
  const hidePlayground = Boolean(
    (frontMatter as Record<string, unknown>)["hide_playground"],
  );

  const isSqlLesson =
    id.startsWith("sql/") &&
    id !== "sql/sql" &&
    !id.includes("exam") &&
    !hidePlayground;

  const isPythonLesson =
    id.startsWith("python/") &&
    id !== "python/python" &&
    !id.includes("exam") &&
    !hidePlayground;

  const terminalLessonId = (frontMatter as Record<string, unknown>)[
    "terminal_lesson_id"
  ] as string | undefined;

  const sidebarPosition = Number(
    (frontMatter as Record<string, unknown>)["sidebar_position"] ?? 0,
  );

  const showMarkComplete = !isOverviewPage(id);

  return (
    <>
      {isSqlLesson && (
        <BrowserOnly>{() => <SqlPlayground />}</BrowserOnly>
      )}
      {isPythonLesson && (
        <BrowserOnly>
          {() => (
            <PythonPlayground
              withSetup={sidebarPosition > READING_DATA_POSITION}
            />
          )}
        </BrowserOnly>
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

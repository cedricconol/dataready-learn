/**
 * Swizzled DocItem/Paginator.
 * Injects the SQL Playground and CoursePromo immediately before the prev/next pagination.
 * - Playground: all SQL lesson pages (not exams)
 * - CoursePromo: pages with show_course_promo: true in frontmatter
 */
import React from "react";
import Paginator from "@theme-original/DocItem/Paginator";
import type PaginatorType from "@theme/DocItem/Paginator";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import BrowserOnly from "@docusaurus/BrowserOnly";
import SqlPlayground from "@site/src/components/SqlPlayground";
import CoursePromo from "@site/src/components/CoursePromo";

type Props = WrapperProps<typeof PaginatorType>;

export default function DocItemPaginator(props: Props): JSX.Element {
  const { metadata, frontMatter } = useDoc();

  const isSqlLesson =
    metadata.id.startsWith("sql/") &&
    metadata.id !== "sql/sql" &&
    !metadata.id.includes("exam");

  const showCoursePromo = (frontMatter as Record<string, unknown>)[
    "show_course_promo"
  ] === true;

  return (
    <>
      {isSqlLesson && (
        <BrowserOnly>{() => <SqlPlayground />}</BrowserOnly>
      )}
      {showCoursePromo && <CoursePromo />}
      <Paginator {...props} />
    </>
  );
}

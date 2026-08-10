import React from "react";
import OriginalTOCDesktop from "@theme-original/DocItem/TOC/Desktop";
import type TOCDesktopType from "@theme/DocItem/TOC/Desktop";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import CoursePromo from "@site/src/components/CoursePromo";
import DocFeedback from "@site/src/components/DocFeedback";

type Props = WrapperProps<typeof TOCDesktopType>;

/**
 * The pinned slot under the table of contents. Every doc gets the feedback
 * note there; the course promo joins it only where the frontmatter asks.
 */
export default function TOCDesktop(props: Props): JSX.Element {
  const { frontMatter } = useDoc();
  const showCoursePromo = (frontMatter as Record<string, unknown>)["show_course_promo"] === true;

  return (
    <div className="toc-with-promo">
      <OriginalTOCDesktop {...props} />
      <div className="toc-promo-pin">
        {showCoursePromo && <CoursePromo />}
        <DocFeedback />
      </div>
    </div>
  );
}

import React from "react";
import OriginalTOCDesktop from "@theme-original/DocItem/TOC/Desktop";
import type TOCDesktopType from "@theme/DocItem/TOC/Desktop";
import type { WrapperProps } from "@docusaurus/types";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import CoursePromo from "@site/src/components/CoursePromo";

type Props = WrapperProps<typeof TOCDesktopType>;

export default function TOCDesktop(props: Props): JSX.Element {
  const { frontMatter } = useDoc();
  const showCoursePromo = (frontMatter as Record<string, unknown>)["show_course_promo"] === true;

  if (!showCoursePromo) {
    return <OriginalTOCDesktop {...props} />;
  }

  return (
    <div className="toc-with-promo">
      <OriginalTOCDesktop {...props} />
      <div className="toc-promo-pin">
        <CoursePromo />
      </div>
    </div>
  );
}

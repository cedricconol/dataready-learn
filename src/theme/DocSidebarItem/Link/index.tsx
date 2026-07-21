import React from "react";
import OriginalDocSidebarItemLink from "@theme-original/DocSidebarItem/Link";
import type DocSidebarItemLinkType from "@theme/DocSidebarItem/Link";
import type { WrapperProps } from "@docusaurus/types";
import { useProgress } from "@site/src/context/ProgressContext";

type Props = WrapperProps<typeof DocSidebarItemLinkType>;

export default function DocSidebarItemLink(props: Props): JSX.Element {
  const { isComplete } = useProgress();
  const docId = (props.item as Record<string, unknown>).docId as string | undefined;
  const done = docId ? isComplete(docId) : false;

  return (
    <div className={`sidebar-item-wrapper${done ? " sidebar-item-wrapper--done" : ""}`}>
      <OriginalDocSidebarItemLink {...props} />
      {done && <span className="sidebar-completion-dot" aria-hidden="true">✓</span>}
    </div>
  );
}

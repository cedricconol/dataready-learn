import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const ISSUES_URL = "https://github.com/cedricconol/dataready-learn/issues/new";

/**
 * Quiet note pinned under the table of contents, inviting a GitHub issue when a
 * lesson is wrong or unclear. The link pre-fills the issue with the page title
 * and URL, so a report arrives with the context already attached.
 */
export default function DocFeedback(): JSX.Element {
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();

  const title = `Feedback: ${metadata.title}`;
  const body = [
    `Page: ${siteConfig.url}${metadata.permalink}`,
    "",
    "What is wrong, unclear, or missing?",
    "",
  ].join("\n");

  const href = `${ISSUES_URL}?title=${encodeURIComponent(
    title,
  )}&body=${encodeURIComponent(body)}`;

  return (
    <aside className="doc-feedback">
      <p className="doc-feedback__eyebrow">Found a problem?</p>
      <p className="doc-feedback__text">
        If anything here is wrong, unclear, or hard to follow, tell us and we
        will fix it.
      </p>
      <a
        className="doc-feedback__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open an issue on GitHub →
      </a>
    </aside>
  );
}

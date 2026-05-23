import React, { useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

const MODULES = [
  {
    icon: "🗄️",
    title: "SQL",
    description:
      "Master the language of data. Learn to query, filter, aggregate, and join data in any relational database.",
    href: "/sql",
  },
  {
    icon: "⬛",
    title: "Terminal",
    description:
      "Get comfortable with the command line. Navigate the filesystem, manipulate files, and chain commands together.",
    href: "/terminal",
  },
  {
    icon: "🌿",
    title: "Git & GitHub",
    description:
      "Version control from the ground up. Create repos, branch, push, open pull requests, and contribute to open source.",
    href: "/git",
  },
];

const GITHUB_NEW_ISSUE =
  "https://github.com/cedricconol/dataready-learn/issues/new";

function ReportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="report-modal-title" className={styles.modalTitle}>
            Report an issue
          </h2>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className={styles.modalIntro}>
          Found a mistake, a broken exercise, or something confusing? Open a
          GitHub issue and we'll fix it. Good reports get resolved faster —
          here's what to include.
        </p>

        <ol className={styles.modalSteps}>
          <li>
            <strong>A clear title.</strong> Start with the lesson name and
            briefly describe the problem. For example:{" "}
            <span className={styles.example}>
              "Incorrect output in the `ls -l` lesson"
            </span>{" "}
            or{" "}
            <span className={styles.example}>
              "Playground doesn't accept valid `mkdir -p` command"
            </span>
            .
          </li>
          <li>
            <strong>The lesson page URL.</strong> Copy the address from your
            browser and paste it in. This tells us exactly where to look.
          </li>
          <li>
            <strong>What's wrong.</strong> Describe what you expected versus
            what you saw. One or two sentences is enough.
          </li>
          <li>
            <strong>A screenshot.</strong> If the issue is visual — wrong
            output, broken layout, unexpected error — drag a screenshot
            directly into the GitHub issue text box.
          </li>
          <li>
            <strong>Your suggested fix (optional but welcome).</strong> If you
            know what the correct answer or wording should be, include it. Pull
            requests are even better.
          </li>
        </ol>

        <Link
          href={GITHUB_NEW_ISSUE}
          className={styles.modalCta}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          Open an issue on GitHub →
        </Link>
      </div>
    </div>
  );
}

function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="hero--dataready hero">
        <div className="container">
          <h1 className="hero__title">
            Learn the Modern Data Stack - for free.
          </h1>
          <p className="hero__subtitle">
            DataReady is an open-source curriculum for aspiring data analysts
            and engineers. Go from zero to production-ready, one lesson at a
            time.
          </p>
          <div className="hero-cta-row">
            <button
              className="button button--secondary button--lg"
              onClick={() => setModalOpen(true)}
            >
              Report an issue
            </button>
          </div>
        </div>
      </header>
      {modalOpen && <ReportModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

function CurriculumCards() {
  return (
    <section className={styles.curriculumSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Curriculum</h2>
        <div className="row">
          {MODULES.map(({ icon, title, description, href }) => (
            <div
              key={title}
              className="col col--6"
              style={{ marginBottom: "1.5rem" }}
            >
              <div className="curriculum-card">
                <div className="curriculum-card__icon">{icon}</div>
                <div className="curriculum-card__title">{title}</div>
                <div className="curriculum-card__desc">{description}</div>
                <Link to={href} className="curriculum-card__cta">
                  Start now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Open-source data analytics curriculum. Learn SQL, dbt, Data Warehouses, and BI Tools."
    >
      <Hero />
      <main>
        <CurriculumCards />
      </main>
    </Layout>
  );
}

import React, { useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import {
  ArrowRight,
  ChartLineUp,
  Check,
  CursorClick,
  Database,
  Exam,
  GitBranch,
  GithubLogo,
  PencilSimpleLine,
  TerminalWindow,
} from "@phosphor-icons/react";
import Reveal from "@site/src/components/home/Reveal";
import HeroVisual from "@site/src/components/home/HeroVisual";
import styles from "./index.module.css";

const GITHUB_REPO = "https://github.com/cedricconol/dataready-learn";
const GITHUB_NEW_ISSUE =
  "https://github.com/cedricconol/dataready-learn/issues/new";

type Track = {
  icon: React.ReactNode;
  title: string;
  count: string;
  description: string;
  topics: string[];
  href: string;
};

const FLAGSHIP_TRACK: Track = {
  icon: <Database weight="duotone" />,
  title: "SQL",
  count: "31 lessons + 10 practice exams",
  description:
    "The language every data job runs on. Start from your first SELECT and build all the way to window functions.",
  topics: [
    "SELECT & WHERE",
    "Joins",
    "Aggregation",
    "Window functions",
    "CTEs & subqueries",
    "Date functions",
    "10 practice exams",
  ],
  href: "/sql",
};

const TRACKS: Track[] = [
  {
    icon: <TerminalWindow weight="duotone" />,
    title: "Terminal",
    count: "19 lessons",
    description:
      "Get comfortable on the command line: move around, manage files, and chain commands like a pro.",
    topics: ["Navigation", "Files & directories", "Reading files", "Capstone"],
    href: "/terminal",
  },
  {
    icon: <GitBranch weight="duotone" />,
    title: "Git & GitHub",
    count: "19 lessons",
    description:
      "Version control from scratch to your first merged pull request on a real open-source project.",
    topics: [
      "Commits",
      "Branches & PRs",
      "Merge conflicts",
      "Rebasing",
      "Open-source workflow",
    ],
    href: "/git",
  },
];

const FEATURES = [
  {
    icon: <CursorClick weight="duotone" />,
    title: "A live editor in every lesson",
    description:
      "Write real SQL and shell commands and run them in your browser. Nothing to install, nothing to configure.",
  },
  {
    icon: <PencilSimpleLine weight="duotone" />,
    title: "Hands-on exercises",
    description:
      "Each concept comes with practice tasks that check your answer against real data as you type.",
  },
  {
    icon: <Exam weight="duotone" />,
    title: "Practice exams",
    description:
      "Ten timed-style SQL exams let you prove the skills stuck before you move on.",
  },
  {
    icon: <ChartLineUp weight="duotone" />,
    title: "Progress that follows you",
    description:
      "Sign in to track completed lessons across devices and pick up exactly where you left off.",
  },
];

const TRUST_ITEMS = [
  "Free forever",
  "Runs in your browser",
  "No account needed to start",
  "MIT + CC BY 4.0",
];

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
          GitHub issue and we'll fix it. Good reports get resolved faster, so
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
            <strong>A screenshot.</strong> If the issue is visual (wrong output,
            broken layout, unexpected error) drag a screenshot directly into the
            GitHub issue text box.
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
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <span className={styles.heroBadge}>
            <Check weight="bold" aria-hidden="true" />
            100% free &amp; open source
          </span>
          <h1 className={styles.heroTitle}>
            Learn data analytics{" "}
            <span className={styles.accentText}>for free</span>.
          </h1>
          <p className={styles.heroSubtitle}>
            Learn by doing: interactive SQL, Terminal, and Git lessons that run
            right in your browser. Start with the fundamentals every analyst
            needs, with more advanced tracks on the way.
          </p>
          <div className={styles.heroCtaRow}>
            <Link to="/sql" className={styles.btnPrimary}>
              Start with SQL
              <ArrowRight weight="bold" aria-hidden="true" />
            </Link>
            <Link
              href={GITHUB_REPO}
              className={styles.btnGhost}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubLogo weight="bold" aria-hidden="true" />
              View on GitHub
            </Link>
          </div>
        </div>
        <div className={styles.heroArt}>
          <HeroVisual />
        </div>
      </div>
    </header>
  );
}

function TrustStrip() {
  return (
    <section className={styles.trust} aria-label="Why DataReady is different">
      <div className={styles.trustInner}>
        {TRUST_ITEMS.map((item) => (
          <span key={item} className={styles.trustItem}>
            <Check weight="bold" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function LearnByDoing() {
  return (
    <section className={styles.section}>
      <div className={styles.split}>
        <Reveal className={styles.splitCopy}>
          <h2 className={styles.sectionTitle}>Run real queries, not slides.</h2>
          <p className={styles.sectionLead}>
            Every lesson has a live editor. Write SQL, run it on real tables, and
            see the results instantly. The same hands-on approach runs through
            Terminal and Git.
          </p>
          <Link to="/sql/intro-to-sql" className={styles.textLink}>
            Try your first query
            <ArrowRight weight="bold" aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal className={styles.codePanel} delay={80}>
          <div className={styles.codeBar}>
            <span className={styles.codeDot} />
            <span className={styles.codeBarLabel}>SQL editor</span>
          </div>
          <pre className={styles.code}>
            <code>
              <span className={styles.kw}>SELECT</span> category,{"\n"}
              {"       "}
              <span className={styles.fn}>SUM</span>(revenue){" "}
              <span className={styles.kw}>AS</span> total{"\n"}
              <span className={styles.kw}>FROM</span> sales{"\n"}
              <span className={styles.kw}>GROUP BY</span> category{"\n"}
              <span className={styles.kw}>ORDER BY</span> total{" "}
              <span className={styles.kw}>DESC</span>;
            </code>
          </pre>
          <div className={styles.resultTable}>
            <div className={styles.resultHead}>
              <span>category</span>
              <span>total</span>
            </div>
            {[
              ["electronics", "48,920"],
              ["home & garden", "31,540"],
              ["sports", "22,180"],
            ].map(([cat, total]) => (
              <div key={cat} className={styles.resultRow}>
                <span>{cat}</span>
                <span className={styles.num}>{total}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrackCard({ track, flagship }: { track: Track; flagship?: boolean }) {
  return (
    <Link
      to={track.href}
      className={`${styles.trackCard} ${flagship ? styles.trackCardFlagship : ""}`}
    >
      <div className={styles.trackHeader}>
        <span className={styles.trackIcon}>{track.icon}</span>
        <div>
          <div className={styles.trackTitle}>{track.title}</div>
          <div className={styles.trackCount}>{track.count}</div>
        </div>
      </div>
      <p className={styles.trackDesc}>{track.description}</p>
      <div className={styles.topicRow}>
        {track.topics.map((topic) => (
          <span key={topic} className={styles.topicChip}>
            {topic}
          </span>
        ))}
      </div>
      <span className={styles.trackCta}>
        Start {track.title}
        <ArrowRight weight="bold" aria-hidden="true" />
      </span>
    </Link>
  );
}

function Curriculum() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>
          A clear path from zero to job-ready.
        </h2>
        <p className={styles.sectionLead}>
          Three tracks, sequenced so each lesson builds on the last. Start
          anywhere, finish everything.
        </p>
      </Reveal>

      <div className={styles.trackGrid}>
        <Reveal>
          <TrackCard track={FLAGSHIP_TRACK} flagship />
        </Reveal>
        <div className={styles.trackGridLower}>
          {TRACKS.map((track, i) => (
            <Reveal key={track.title} delay={i * 80}>
              <TrackCard track={track} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyDifferent() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Built to make the skills stick.</h2>
        <p className={styles.sectionLead}>
          Reading about SQL is not the same as writing it. DataReady is built
          around doing.
        </p>
      </Reveal>

      <div className={styles.featureGrid}>
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 70} className={styles.feature}>
            <span className={styles.featureIcon}>{feature.icon}</span>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDesc}>{feature.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ onReport }: { onReport: () => void }) {
  return (
    <section className={styles.finalCta}>
      <Reveal className={styles.finalCtaInner}>
        <h2 className={styles.finalCtaTitle}>Start learning today. It's free.</h2>
        <p className={styles.finalCtaLead}>
          Open the first lesson and run your first query in the next two minutes.
        </p>
        <Link to="/sql" className={styles.btnOnDark}>
          Start with SQL
          <ArrowRight weight="bold" aria-hidden="true" />
        </Link>
        <p className={styles.reportLine}>
          Found a problem in a lesson?{" "}
          <button className={styles.reportLink} onClick={onReport}>
            Report an issue
          </button>
        </p>
      </Reveal>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Layout
      title={siteConfig.title}
      description="Open-source data analytics curriculum. Learn SQL, Terminal, and Git by doing, free and in your browser."
    >
      <div className={styles.homepageRoot}>
        <Hero />
        <main>
          <TrustStrip />
          <LearnByDoing />
          <Curriculum />
          <WhyDifferent />
          <FinalCta onReport={() => setModalOpen(true)} />
        </main>
      </div>
      {modalOpen && <ReportModal onClose={() => setModalOpen(false)} />}
    </Layout>
  );
}

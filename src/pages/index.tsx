import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import {
  ArrowRight,
  ChartLineUp,
  Check,
  Code,
  CursorClick,
  Database,
  Exam,
  GitBranch,
  PencilSimpleLine,
  TerminalWindow,
} from "@phosphor-icons/react";
import Reveal from "@site/src/components/home/Reveal";
import HeroVisual from "@site/src/components/home/HeroVisual";
import { MENTHORO_COURSES } from "@site/src/lib/menthoro";
import styles from "./index.module.css";

type Track = {
  icon: React.ReactNode;
  title: string;
  count: string;
  description: string;
  topics: string[];
  href: string;
  comingSoon?: boolean;
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
  href: MENTHORO_COURSES.sql,
};

const TRACKS: Track[] = [
  {
    icon: <TerminalWindow weight="duotone" />,
    title: "Terminal",
    count: "19 lessons",
    description:
      "Get comfortable on the command line: move around, manage files, and chain commands like a pro.",
    topics: ["Navigation", "Files & directories", "Reading files", "Capstone"],
    href: MENTHORO_COURSES.terminal,
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
    href: MENTHORO_COURSES.git,
  },
  {
    icon: <Code weight="duotone" />,
    title: "Python",
    count: "42 lessons + 10 practice exams",
    description:
      "Pandas from the ground up: load a messy CSV, clean it, reshape it, and answer the question your spreadsheet could not.",
    topics: [
      "Python basics",
      "Series & DataFrames",
      "Filtering",
      "merge & groupby",
      "Reshaping",
      "Rolling & time series",
      "10 practice exams",
    ],
    href: MENTHORO_COURSES.python,
  },
];

const FEATURES = [
  {
    icon: <CursorClick weight="duotone" />,
    title: "A live editor in every lesson",
    description:
      "Write real SQL, Python, and shell commands and run them in your browser. Nothing to install, nothing to configure.",
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
      "Ten timed-style exams per track let you prove the skills stuck before you move on.",
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
            Learn by doing: interactive SQL, Python, Terminal, and Git lessons that run
            right in your browser. Start with the fundamentals every analyst
            needs, with more advanced tracks on the way.
          </p>
          <div className={styles.heroCtaRow}>
            <Link href={MENTHORO_COURSES.sql} className={styles.btnPrimary}>
              Start with SQL
              <ArrowRight weight="bold" aria-hidden="true" />
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
          <Link href={MENTHORO_COURSES.sql} className={styles.textLink}>
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
  const { comingSoon } = track;
  return (
    <Link
      href={track.href}
      className={`${styles.trackCard} ${flagship ? styles.trackCardFlagship : ""} ${
        comingSoon ? styles.trackCardSoon : ""
      }`}
    >
      <div className={styles.trackHeader}>
        <span className={styles.trackIcon}>{track.icon}</span>
        <div>
          <div className={styles.trackTitle}>
            {track.title}
            {comingSoon && <span className={styles.soonBadge}>Coming soon</span>}
          </div>
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
        {comingSoon ? "Take a peek" : `Start ${track.title}`}
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

function FinalCta() {
  return (
    <section className={styles.finalCta}>
      <Reveal className={styles.finalCtaInner}>
        <h2 className={styles.finalCtaTitle}>Start learning today. It's free.</h2>
        <p className={styles.finalCtaLead}>
          Open the first lesson and run your first query in the next two minutes.
        </p>
        <Link href={MENTHORO_COURSES.sql} className={styles.btnOnDark}>
          Start with SQL
          <ArrowRight weight="bold" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Open-source data analytics curriculum. Learn SQL, Python, Terminal, and Git by doing, free and in your browser."
    >
      <div className={styles.homepageRoot}>
        <Hero />
        <main>
          <TrustStrip />
          <LearnByDoing />
          <Curriculum />
          <WhyDifferent />
          <FinalCta />
        </main>
      </div>
    </Layout>
  );
}

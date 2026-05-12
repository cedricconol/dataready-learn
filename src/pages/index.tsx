import React from "react";
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
    icon: "⚙️",
    title: "dbt",
    description:
      "Transform data with engineering best practices. Write modular SQL, run tests, and ship production pipelines.",
    href: "/dbt",
  },
  {
    icon: "🏛️",
    title: "Data Warehouse",
    description:
      "Understand how cloud warehouses work. Design schemas, load data, and optimize analytical queries.",
    href: "/data-warehouse",
  },
  {
    icon: "📊",
    title: "BI Tools",
    description:
      "Turn warehouse data into dashboards and decisions. Covers Metabase, Looker, Tableau, and more.",
    href: "/bi-tools",
  },
];

function Hero() {
  return (
    <header className="hero--dataready hero">
      <div className="container">
        <h1 className="hero__title">
          Learn the Modern Data Stack - for free.
        </h1>
        <p className="hero__subtitle">
          DataReady is an open-source curriculum for aspiring data analysts and
          engineers. Go from zero to production-ready, one lesson at a time.
        </p>
        <div className="hero-cta-row">
          <Link className="button button--primary button--lg" to="/sql">
            Start with SQL →
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/cedricconol/dataready-learn"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
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
              <Link
                to={href}
                className="curriculum-card"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div className="curriculum-card__icon">{icon}</div>
                <div className="curriculum-card__title">{title}</div>
                <div className="curriculum-card__desc">{description}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
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

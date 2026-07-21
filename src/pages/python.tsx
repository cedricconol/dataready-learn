import React from "react";
import Link from "@docusaurus/Link";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import { ArrowLeft, ForkKnife } from "@phosphor-icons/react";
import styles from "./python.module.css";

function CookingAnimation() {
  return (
    <BrowserOnly fallback={<div className={styles.animFallback} />}>
      {() => {
        // Loaded lazily and client-side only: lottie-react touches the DOM.
        const Lottie = require("lottie-react").default;
        const cookingAnimation = require("@site/src/assets/cooking.json");
        return (
          <Lottie
            animationData={cookingAnimation}
            loop
            className={styles.anim}
          />
        );
      }}
    </BrowserOnly>
  );
}

export default function Python(): React.JSX.Element {
  return (
    <Layout
      title="Python — Coming Soon"
      description="A hands-on Python track for data analytics is on the way. Learn Python in your browser, lesson by lesson."
    >
      <div className={styles.wrap}>
        <div className={styles.inner}>
          <CookingAnimation />
          <span className={styles.badge}>
            <ForkKnife weight="bold" aria-hidden="true" />
            Coming soon
          </span>
          <h1 className={styles.title}>
            The <span className={styles.accent}>Python</span> track is cooking.
          </h1>
          <p className={styles.lead}>
            We're building a hands-on Python track for data analytics: the same
            learn-by-doing approach as SQL, Terminal, and Git, with a live
            editor in every lesson. It's not ready yet, but it's on the stove.
          </p>
          <div className={styles.ctaRow}>
            <Link to="/sql" className={styles.btnPrimary}>
              Start with SQL
            </Link>
            <Link to="/" className={styles.btnGhost}>
              <ArrowLeft weight="bold" aria-hidden="true" />
              Back home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

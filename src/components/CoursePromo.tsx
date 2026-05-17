import React from "react";
import Link from "@docusaurus/Link";

export default function CoursePromo(): JSX.Element {
  return (
    <div className="course-promo">
      <div className="course-promo__content">
        <div className="course-promo__eyebrow">Live Cohort</div>
        <div className="course-promo__heading">Ready to go further?</div>
        <div className="course-promo__body">
          Join the DataReady live course — 6 sessions over 3 weeks, max 10
          students. Built for beginners and career switchers.
        </div>
      </div>
      <Link href="https://dataready.byconol.com" className="course-promo__cta">
        Learn more →
      </Link>
    </div>
  );
}

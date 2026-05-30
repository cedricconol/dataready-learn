import React from "react";
import Link from "@docusaurus/Link";

export default function CoursePromo(): JSX.Element {
  return (
    <div className="course-promo">
      <div className="course-promo__eyebrow">Live Cohort</div>
      <div className="course-promo__heading">Ready to go further?</div>
      <div className="course-promo__body">
        6 sessions, max 10 students. Built for career switchers.
      </div>
      <Link href="https://dataready.byconol.com" className="course-promo__cta">
        Learn more →
      </Link>
    </div>
  );
}

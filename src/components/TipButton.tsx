import React from "react";
import styles from "./TipButton.module.css";

// Lemon Squeezy "pay what you want" checkout. Clicking redirects to the hosted
// checkout page (intentional — no overlay).
const TIP_CHECKOUT_URL =
  "https://store.byconol.com/checkout/buy/b525d1bf-ad1e-44e6-ac06-ec0113c34ef9";

export default function TipButton(): JSX.Element {
  return (
    <a
      href={TIP_CHECKOUT_URL}
      className={styles.tipButton}
      aria-label="Donate to this project"
    >
      <span className={styles.tipIcon} aria-hidden="true">
        ❤️
      </span>
      <span className={styles.tipLabel}>Donate to this project</span>
    </a>
  );
}

import React from "react";
import styles from "./HeroVisual.module.css";

/**
 * Abstract data motif for the homepage hero: a result-table card and a small
 * chart card in the brand blue-to-cyan range, tuned for a light background.
 * This is a single intentional geometric mark rendered as inline SVG (no neon
 * glow, reduced-motion safe via HeroVisual.module.css).
 *
 * To swap in a real generated raster later, replace the <svg> below with an
 * <img> at the same aspect ratio (5 / 4) inside the same wrapper.
 */
export default function HeroVisual(): JSX.Element {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox="0 0 480 384"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hvAccent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="hvBar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="hvShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="18"
              stdDeviation="24"
              floodColor="#1e3a6e"
              floodOpacity="0.18"
            />
          </filter>
        </defs>

        {/* Result-table card */}
        <g className={styles.tableCard} filter="url(#hvShadow)">
          <rect x="40" y="40" width="268" height="220" rx="18" fill="#ffffff" />
          <rect
            x="40"
            y="40"
            width="268"
            height="220"
            rx="18"
            fill="none"
            stroke="#e2e8f0"
          />
          {/* Header bar */}
          <rect x="40" y="40" width="268" height="44" rx="18" fill="#f1f5f9" />
          <rect x="40" y="66" width="268" height="18" fill="#f1f5f9" />
          <circle cx="64" cy="62" r="5" fill="#3b82f6" />
          <rect x="80" y="57" width="86" height="10" rx="5" fill="#cbd5e1" />
          <rect x="206" y="57" width="64" height="10" rx="5" fill="#cbd5e1" />

          {/* Rows */}
          <g className={styles.accentRow}>
            <rect x="40" y="100" width="268" height="30" fill="#eff6ff" />
            <rect x="64" y="110" width="96" height="10" rx="5" fill="#93c5fd" />
            <rect
              x="206"
              y="110"
              width="58"
              height="10"
              rx="5"
              fill="url(#hvAccent)"
            />
          </g>
          <rect x="64" y="146" width="120" height="10" rx="5" fill="#cbd5e1" />
          <rect x="206" y="146" width="44" height="10" rx="5" fill="#cbd5e1" />
          <rect x="64" y="180" width="104" height="10" rx="5" fill="#cbd5e1" />
          <rect x="206" y="180" width="60" height="10" rx="5" fill="#cbd5e1" />
          <rect x="64" y="214" width="132" height="10" rx="5" fill="#cbd5e1" />
          <rect x="206" y="214" width="40" height="10" rx="5" fill="#cbd5e1" />
        </g>

        {/* Chart card, overlapping bottom-right */}
        <g className={styles.chartCard} filter="url(#hvShadow)">
          <rect
            x="246"
            y="180"
            width="194"
            height="158"
            rx="18"
            fill="#0f1623"
          />
          <rect x="270" y="206" width="84" height="9" rx="4.5" fill="#334155" />
          {/* Bars */}
          <rect
            className={`${styles.bar} ${styles.b1}`}
            x="270"
            y="266"
            width="22"
            height="44"
            rx="5"
            fill="url(#hvBar)"
          />
          <rect
            className={`${styles.bar} ${styles.b2}`}
            x="302"
            y="250"
            width="22"
            height="60"
            rx="5"
            fill="url(#hvBar)"
          />
          <rect
            className={`${styles.bar} ${styles.b3}`}
            x="334"
            y="234"
            width="22"
            height="76"
            rx="5"
            fill="url(#hvBar)"
          />
          <rect
            className={`${styles.bar} ${styles.b4}`}
            x="366"
            y="252"
            width="22"
            height="58"
            rx="5"
            fill="url(#hvBar)"
          />
          <rect
            className={`${styles.bar} ${styles.b5}`}
            x="398"
            y="228"
            width="22"
            height="82"
            rx="5"
            fill="url(#hvBar)"
          />
        </g>

        {/* Floating accent chips */}
        <g className={styles.chip}>
          <rect
            x="300"
            y="92"
            width="118"
            height="40"
            rx="12"
            fill="#ffffff"
            filter="url(#hvShadow)"
          />
          <circle cx="324" cy="112" r="10" fill="url(#hvAccent)" />
          <rect x="342" y="107" width="60" height="10" rx="5" fill="#cbd5e1" />
        </g>
        <g className={`${styles.chip} ${styles.chipB}`}>
          <rect
            x="28"
            y="276"
            width="150"
            height="44"
            rx="12"
            fill="#ffffff"
            filter="url(#hvShadow)"
          />
          <rect x="48" y="290" width="30" height="16" rx="8" fill="#dbeafe" />
          <rect x="88" y="293" width="72" height="10" rx="5" fill="#cbd5e1" />
        </g>
      </svg>
    </div>
  );
}

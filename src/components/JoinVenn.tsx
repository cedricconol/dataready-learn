import React, { useId } from "react";

import styles from "./JoinVenn.module.css";

/** Which part of the picture gets shaded. */
type JoinKind = "inner" | "left" | "right" | "outer" | "left-only";

type JoinVennProps = {
  /** The `how=` value being illustrated, or `left-only` for the anti-join. */
  kind: JoinKind;
  /** Name of the left table. */
  left: string;
  /** Name of the right table. */
  right: string;
  /** Optional line of explanation under the diagram. */
  caption?: string;
};

const WIDTH = 300;
const HEIGHT = 160;
const RADIUS = 58;
const CENTER_Y = 72;
const LEFT_X = 112;
const RIGHT_X = 188;

const DESCRIPTIONS: Record<JoinKind, (left: string, right: string) => string> = {
  inner: (l, r) => `Venn diagram: only the overlap between ${l} and ${r} is shaded.`,
  left: (l, r) => `Venn diagram: the whole ${l} circle is shaded, including its overlap with ${r}.`,
  right: (l, r) => `Venn diagram: the whole ${r} circle is shaded, including its overlap with ${l}.`,
  outer: (l, r) => `Venn diagram: both the ${l} and ${r} circles are fully shaded.`,
  "left-only": (l, r) =>
    `Venn diagram: the part of ${l} outside its overlap with ${r} is shaded.`,
};

/**
 * Two overlapping circles with the kept rows shaded. Used in the merge lessons
 * so `how=` is something you can see rather than something you memorise.
 */
export default function JoinVenn({
  kind,
  left,
  right,
  caption,
}: JoinVennProps): JSX.Element {
  // useId returns colons, which are awkward inside url(#...) references.
  const uid = useId().replace(/:/g, "");
  const overlapClip = `${uid}-overlap`;
  const notRightMask = `${uid}-not-right`;

  const fillsLeftCircle = kind === "left" || kind === "outer";
  const fillsRightCircle = kind === "right" || kind === "outer";

  return (
    <figure className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={DESCRIPTIONS[kind](left, right)}
      >
        <defs>
          <clipPath id={overlapClip}>
            <circle cx={LEFT_X} cy={CENTER_Y} r={RADIUS} />
          </clipPath>
          <mask id={notRightMask}>
            <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="white" />
            <circle cx={RIGHT_X} cy={CENTER_Y} r={RADIUS} fill="black" />
          </mask>
        </defs>

        {/* The opacity lives on the group, so `outer`'s two overlapping circles
            shade evenly instead of doubling up where they cross. */}
        <g className={styles.fill}>
          {fillsLeftCircle ? <circle cx={LEFT_X} cy={CENTER_Y} r={RADIUS} /> : null}

          {fillsRightCircle ? <circle cx={RIGHT_X} cy={CENTER_Y} r={RADIUS} /> : null}

          {kind === "inner" ? (
            <circle
              cx={RIGHT_X}
              cy={CENTER_Y}
              r={RADIUS}
              clipPath={`url(#${overlapClip})`}
            />
          ) : null}

          {kind === "left-only" ? (
            <circle
              cx={LEFT_X}
              cy={CENTER_Y}
              r={RADIUS}
              mask={`url(#${notRightMask})`}
            />
          ) : null}
        </g>

        <circle className={styles.outline} cx={LEFT_X} cy={CENTER_Y} r={RADIUS} />
        <circle className={styles.outline} cx={RIGHT_X} cy={CENTER_Y} r={RADIUS} />

        <text className={styles.tableLabel} x={LEFT_X - RADIUS} y={HEIGHT - 18} textAnchor="middle">
          {left}
        </text>
        <text
          className={styles.tableLabel}
          x={RIGHT_X + RADIUS}
          y={HEIGHT - 18}
          textAnchor="middle"
        >
          {right}
        </text>
      </svg>

      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}

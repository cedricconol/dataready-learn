import React from "react";

import styles from "./FunctionDiagram.module.css";

type FunctionDiagramProps = {
  /** The function name, shown inside the box. */
  name: string;
  /** One pill per input, e.g. `price = 4.99`. */
  inputs: string[];
  /** The value the function hands back. */
  output: string;
  /**
   * Show the small "inputs" / "function" / "output" captions. Turn these off
   * for the generic version of the diagram, where the pills already say
   * "input" and "output" and the captions would just repeat them.
   */
  showLabels?: boolean;
  /** Optional line of explanation under the diagram. */
  caption?: string;
};

/**
 * Inputs in, box, output out. Used in the functions lesson to show that a
 * function is a reusable machine whose output depends on what you feed it.
 */
export default function FunctionDiagram({
  name,
  inputs,
  output,
  showLabels = true,
  caption,
}: FunctionDiagramProps): JSX.Element {
  const description = `${inputs.join(" and ")} go into the function ${name}, which gives back ${output}.`;

  return (
    <figure className={styles.wrap}>
      <div className={styles.diagram} role="img" aria-label={description}>
        <div className={styles.side}>
          {showLabels ? (
            <span className={styles.label}>
              {inputs.length > 1 ? "inputs" : "input"}
            </span>
          ) : null}
          <div className={styles.pills}>
            {inputs.map((input, index) => (
              // Inputs can repeat in the generic diagram, so index is the key.
              <span key={index} className={styles.pill}>
                {input}
              </span>
            ))}
          </div>
        </div>

        <span className={styles.arrow} aria-hidden="true" />

        <div className={styles.box}>
          {showLabels ? <span className={styles.boxKicker}>function</span> : null}
          {name}
        </div>

        <span className={styles.arrow} aria-hidden="true" />

        <div className={styles.side}>
          {showLabels ? <span className={styles.label}>output</span> : null}
          <div className={styles.pills}>
            <span className={`${styles.pill} ${styles.outPill}`}>{output}</span>
          </div>
        </div>
      </div>

      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}

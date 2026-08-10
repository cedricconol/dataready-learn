import React, { useRef, useState } from "react";
import styles from "./PythonPlayground.module.css";
import PythonResult from "./PythonResult";
import { DATASETS } from "./pythonData";
import { createEditorKeyDownHandler } from "./pythonEditor";
import { statusLabel } from "./pythonRuntime";
import type { RunOutcome } from "./pythonRuntime";
import { useAutoResizeTextarea } from "./useAutoResizeTextarea";
import { usePythonRuntime } from "./usePythonRuntime";

interface Props {
  /**
   * Start the editor with the import and the read_csv calls written out. Off up
   * to and including Reading data, where the learner writes those calls instead.
   */
  withSetup?: boolean;
}

/**
 * Starter code for the lessons after Reading data. Each read_csv stays on one
 * line, the deliberate exception to the 60-character rule the lesson snippets
 * follow: this is setup the learner skims, and wrapping hides the call's shape.
 */
const SETUP_CODE = `# The imports and the data load are written for you.
import numpy as np
import pandas as pd

customers = pd.read_csv("customers.csv", parse_dates=["signup_date"])
products = pd.read_csv("products.csv")
orders = pd.read_csv("orders.csv", parse_dates=["order_date"])
`;

/** Starter code up to and including Reading data. Frames are bound either way. */
const PRELOADED_CODE = `# pandas is already imported as pd, NumPy as np, and the
# customers, products and orders DataFrames are loaded.
`;

export default function PythonPlayground({
  withSetup = true,
}: Props): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState(withSetup ? SETUP_CODE : PRELOADED_CODE);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [running, setRunning] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  const { status, ready, run } = usePythonRuntime(containerRef);
  useAutoResizeTextarea(editorRef, code);

  async function handleRun(): Promise<void> {
    setRunning(true);
    try {
      setOutcome(await run(code));
    } catch {
      setOutcome({
        stdout: "",
        result: { kind: "none" },
        error: "Python could not be loaded. Check your connection and reload the page.",
      });
    } finally {
      setRunning(false);
    }
  }

  const handleKeyDown = createEditorKeyDownHandler(code, setCode, () => void handleRun());

  const buttonLabel = running ? "Running…" : ready ? "▶ Run" : statusLabel(status);
  const nothingToShow =
    outcome !== null &&
    outcome.error === null &&
    outcome.stdout.trim() === "" &&
    outcome.result.kind === "none";

  return (
    <div className={styles.playground} ref={containerRef}>
      <div className={styles.header}>
        <span className={styles.title}>Python Playground</span>
        <button
          className={styles.dataToggle}
          onClick={() => setDataOpen((open) => !open)}
          aria-expanded={dataOpen}
        >
          {dataOpen ? "▾" : "▸"} Data
        </button>
      </div>

      {dataOpen && (
        <div className={styles.data}>
          {DATASETS.map(({ frame, rows, columns }) => (
            <div key={frame} className={styles.frame}>
              <div className={styles.frameName}>
                {frame} <span className={styles.frameRows}>({rows} rows)</span>
              </div>
              <div className={styles.columns}>
                {columns.map(({ name, type, note }) => (
                  <div key={name} className={styles.column}>
                    <span className={styles.columnName}>{name}</span>
                    <span className={styles.columnType}>{type}</span>
                    {note && <span className={styles.columnNote}>{note}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className={styles.dataNote}>
            {withSetup
              ? "The three CSV files are on disk, and the editor already loads them into customers, products and orders."
              : "customers, products and orders are already loaded and ready to use."}{" "}
            Every run starts from the original data.
          </p>
        </div>
      )}

      <textarea
        ref={editorRef}
        className={styles.editor}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={6}
      />

      <div className={styles.toolbar}>
        <button className={styles.runBtn} onClick={() => void handleRun()} disabled={running}>
          {buttonLabel}
        </button>
        <span className={styles.shortcut}>or ⌘ / Ctrl + Enter</span>
      </div>

      {outcome?.error && (
        <div className={styles.error}>{outcome.error}</div>
      )}

      {nothingToShow && (
        <div className={styles.empty}>
          Code ran with no output. End with an expression, like orders.head(), to see a result.
        </div>
      )}

      {outcome && !outcome.error && (
        <PythonResult stdout={outcome.stdout} result={outcome.result} />
      )}
    </div>
  );
}

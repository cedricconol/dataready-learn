import React, { useRef, useState } from "react";
import styles from "./PythonExercise.module.css";
import PythonResult from "./PythonResult";
import { DATASETS } from "./pythonData";
import { createEditorKeyDownHandler } from "./pythonEditor";
import { statusLabel } from "./pythonRuntime";
import type { CheckOutcome, RunOutcome } from "./pythonRuntime";
import { useAutoResizeTextarea } from "./useAutoResizeTextarea";
import { usePythonRuntime } from "./usePythonRuntime";

interface Props {
  /** Reference answer. It runs in a fresh namespace and its last line is the expected value. */
  solution: string;
  /** Code the editor starts with. */
  starter?: string;
  /** DataFrames listed in the collapsible Data panel. */
  frames?: string[];
  /** Set for questions where row order is part of the answer, such as sorting. */
  ordered?: boolean;
}

const DEFAULT_STARTER = "# Write your code here. The last line is your answer.\n";

/**
 * A checked pandas exercise: the learner's last expression is compared against
 * the value the reference solution produces, so any correct approach passes.
 */
export default function PythonExercise({
  solution,
  starter = DEFAULT_STARTER,
  frames = [],
  ordered = false,
}: Props): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState(starter);
  const [outcome, setOutcome] = useState<RunOutcome | CheckOutcome | null>(null);
  const [verdict, setVerdict] = useState<{ passed: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);

  const { status, ready, run, check } = usePythonRuntime(containerRef);
  useAutoResizeTextarea(editorRef, code);

  const shownFrames = DATASETS.filter((dataset) => frames.includes(dataset.frame));

  async function execute(withCheck: boolean): Promise<void> {
    setBusy(true);
    setVerdict(null);
    try {
      if (withCheck) {
        const result = await check(code, solution, ordered);
        setOutcome(result);
        setVerdict({ passed: result.passed, message: result.message });
      } else {
        setOutcome(await run(code));
      }
    } catch {
      setOutcome({
        stdout: "",
        result: { kind: "none" },
        error: "Python could not be loaded. Check your connection and reload the page.",
      });
    } finally {
      setBusy(false);
    }
  }

  const handleKeyDown = createEditorKeyDownHandler(code, setCode, () => void execute(false));

  const runLabel = busy ? "Running…" : ready ? "▶ Run" : statusLabel(status);
  const hasResult = outcome !== null && !outcome.error;
  const nothingToShow =
    hasResult && outcome.stdout.trim() === "" && outcome.result.kind === "none";

  return (
    <div className={styles.exercise} ref={containerRef}>
      {shownFrames.length > 0 && (
        <div className={styles.header}>
          <button
            className={styles.dataToggle}
            onClick={() => setDataOpen((open) => !open)}
            aria-expanded={dataOpen}
          >
            {dataOpen ? "▾" : "▸"} Data
          </button>
        </div>
      )}

      {dataOpen && (
        <div className={styles.data}>
          {shownFrames.map(({ frame, columns }) => (
            <div key={frame} className={styles.frame}>
              <div className={styles.frameName}>{frame}</div>
              <div className={styles.columns}>
                {columns.map(({ name, type }) => (
                  <div key={name} className={styles.column}>
                    <span className={styles.columnName}>{name}</span>
                    <span className={styles.columnType}>{type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <textarea
        ref={editorRef}
        className={styles.editor}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        rows={5}
      />

      <div className={styles.toolbar}>
        <button className={styles.runBtn} onClick={() => void execute(false)} disabled={busy}>
          {runLabel}
        </button>
        <span className={styles.shortcut}>⌘ / Ctrl + Enter to run</span>
        <button className={styles.answerToggle} onClick={() => setAnswerOpen((open) => !open)}>
          {answerOpen ? "Hide answer" : "Show answer"}
        </button>
        {verdict && (
          <span className={verdict.passed ? styles.pass : styles.fail}>
            {verdict.passed ? `✓ ${verdict.message}` : `✗ ${verdict.message}`}
          </span>
        )}
        <button className={styles.submitBtn} onClick={() => void execute(true)} disabled={busy}>
          Submit
        </button>
      </div>

      {answerOpen && <pre className={styles.answer}>{solution.trim()}</pre>}

      {outcome?.error && <div className={styles.error}>{outcome.error}</div>}

      {nothingToShow && (
        <div className={styles.empty}>
          Code ran with no output. End with an expression to see a result.
        </div>
      )}

      {hasResult && !nothingToShow && (
        <div className={styles.output}>
          <div className={styles.outputLabel}>Output</div>
          <PythonResult stdout={outcome.stdout} result={outcome.result} />
        </div>
      )}
    </div>
  );
}

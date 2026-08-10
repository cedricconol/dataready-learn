/**
 * Shared Pyodide runtime for the Python track.
 *
 * Pyodide plus pandas is a large download, so it is loaded once per browser
 * session and shared by every playground and exercise on the page. Loading is
 * lazy: components call `loadPythonRuntime()` only when they scroll into view.
 */
import { SEED_PYTHON } from "./pythonSeed";

const PYODIDE_VERSION = "314.0.3";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export type Cell = string | null;

export interface DataFrameView {
  kind: "dataframe";
  columns: string[];
  dtypes: string[];
  index: string[];
  indexName: string;
  rows: Cell[][];
  shape: [number, number];
  truncated: boolean;
}

export interface SeriesView {
  kind: "series";
  name: string;
  dtype: string;
  index: string[];
  indexName: string;
  values: Cell[];
  length: number;
  truncated: boolean;
}

export interface TextView {
  kind: "text";
  text: string;
}

export interface NoneView {
  kind: "none";
}

export type ResultView = DataFrameView | SeriesView | TextView | NoneView;

export interface RunOutcome {
  stdout: string;
  result: ResultView;
  error: string | null;
}

export interface CheckOutcome extends RunOutcome {
  passed: boolean;
  message: string;
}

export interface PythonRuntime {
  run(code: string): RunOutcome;
  check(code: string, solution: string, ordered: boolean): CheckOutcome;
}

/** Coarse loading stages, surfaced in the toolbar while the runtime boots. */
export type LoadStatus = "idle" | "downloading" | "installing" | "ready" | "error";

type StatusListener = (status: LoadStatus) => void;

const listeners = new Set<StatusListener>();
let currentStatus: LoadStatus = "idle";
let runtimePromise: Promise<PythonRuntime> | null = null;

function setStatus(status: LoadStatus): void {
  currentStatus = status;
  listeners.forEach((listener) => listener(status));
}

export function getStatus(): LoadStatus {
  return currentStatus;
}

export function subscribeToStatus(listener: StatusListener): () => void {
  listeners.add(listener);
  listener(currentStatus);
  return () => listeners.delete(listener);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-pyodide="${src}"]`
    );
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Pyodide.")));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.dataset.pyodide = src;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    });
    script.addEventListener("error", () => reject(new Error("Failed to load Pyodide.")));
    document.head.appendChild(script);
  });
}

async function boot(): Promise<PythonRuntime> {
  setStatus("downloading");
  await loadScript(`${PYODIDE_INDEX_URL}pyodide.js`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalScope = globalThis as any;
  const pyodide = await globalScope.loadPyodide({ indexURL: PYODIDE_INDEX_URL });

  setStatus("installing");
  await pyodide.loadPackage(["pandas"]);
  pyodide.runPython(SEED_PYTHON);

  const runFn = pyodide.globals.get("_dr_run");
  const checkFn = pyodide.globals.get("_dr_check");

  setStatus("ready");

  return {
    run(code: string): RunOutcome {
      return JSON.parse(runFn(code)) as RunOutcome;
    },
    check(code: string, solution: string, ordered: boolean): CheckOutcome {
      return JSON.parse(checkFn(code, solution, ordered)) as CheckOutcome;
    },
  };
}

export function loadPythonRuntime(): Promise<PythonRuntime> {
  if (!runtimePromise) {
    runtimePromise = boot().catch((error) => {
      runtimePromise = null;
      setStatus("error");
      throw error;
    });
  }
  return runtimePromise;
}

/** Human-readable label for the Run button while the runtime is still loading. */
export function statusLabel(status: LoadStatus): string {
  switch (status) {
    case "downloading":
      return "Starting Python…";
    case "installing":
      return "Loading pandas…";
    case "error":
      return "Python failed to load";
    default:
      return "Loading…";
  }
}

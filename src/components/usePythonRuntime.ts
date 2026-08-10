import { RefObject, useCallback, useEffect, useState } from "react";
import {
  CheckOutcome,
  LoadStatus,
  RunOutcome,
  getStatus,
  loadPythonRuntime,
  subscribeToStatus,
} from "./pythonRuntime";

interface PythonRuntimeHook {
  status: LoadStatus;
  ready: boolean;
  run(code: string): Promise<RunOutcome>;
  check(code: string, solution: string, ordered: boolean): Promise<CheckOutcome>;
}

/**
 * Gives a component access to the shared Pyodide runtime.
 *
 * Loading starts as soon as `ref` scrolls near the viewport, so the runtime is
 * usually warm by the time a learner reaches the editor, and pages nobody
 * scrolls to never pay for the download.
 */
export function usePythonRuntime(ref: RefObject<HTMLElement | null>): PythonRuntimeHook {
  const [status, setStatus] = useState<LoadStatus>(getStatus());

  useEffect(() => subscribeToStatus(setStatus), []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      void loadPythonRuntime().catch(() => undefined);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void loadPythonRuntime().catch(() => undefined);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  const run = useCallback(async (code: string) => {
    const runtime = await loadPythonRuntime();
    return runtime.run(code);
  }, []);

  const check = useCallback(async (code: string, solution: string, ordered: boolean) => {
    const runtime = await loadPythonRuntime();
    return runtime.check(code, solution, ordered);
  }, []);

  return { status, ready: status === "ready", run, check };
}

import React, { useEffect, useRef, useState } from "react";
import type { DirectoryNode, FileSystemNode, ShellState } from "../engine/types";
import { getLessonById, getNextLesson, getPrevLesson } from "../engine/lessons";
import { executeCommand, getPrompt, makeInitialState } from "../engine/shell";
import styles from "./TerminalPlayground.module.css";

interface TerminalPlaygroundProps {
  lessonId: string;
}

// ── File tree renderer ────────────────────────────────────────────

interface TreeNodeProps {
  node: FileSystemNode;
  path: string;
  cwd: string;
  changedPaths: Map<string, "created" | "deleted" | "modified">;
  depth: number;
}

function TreeNode({ node, path, cwd, changedPaths, depth }: TreeNodeProps): React.ReactElement {
  const change = changedPaths.get(path);
  const isDir = node.type === "dir";
  const isHidden = node.name.startsWith(".");
  const isCwd = path === cwd;

  const indent = "  ".repeat(depth);
  const icon = isDir ? "📁" : "📄";
  const prefix = depth === 0 ? "" : indent + (isDir ? "├── " : "├── ");

  const classNames = [
    styles.treeNode,
    isDir ? styles.isDir : "",
    isHidden ? styles.isHidden : "",
    isCwd ? styles.isCwd : "",
    change ? styles[change] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={classNames} title={path}>
        <span>{prefix}{icon} {node.name}</span>
      </div>
      {isDir &&
        (node as DirectoryNode).children.map((child) => {
          const childPath = path === "/" ? "/" + child.name : path + "/" + child.name;
          return (
            <TreeNode
              key={childPath}
              node={child}
              path={childPath}
              cwd={cwd}
              changedPaths={changedPaths}
              depth={depth + 1}
            />
          );
        })}
    </>
  );
}

function FileTree({
  fs,
  cwd,
  changedPaths,
}: {
  fs: FileSystemNode;
  cwd: string;
  changedPaths: Map<string, "created" | "deleted" | "modified">;
}): React.ReactElement {
  // Show from /home/user downward
  const homeUser = (() => {
    let node: FileSystemNode | null = fs;
    for (const seg of ["home", "user"]) {
      if (!node || node.type !== "dir") return null;
      node = (node as DirectoryNode).children.find((c) => c.name === seg) ?? null;
    }
    return node;
  })();

  return (
    <div className={styles.fileTree}>
      <div className={styles.treeLabel}>Filesystem</div>
      {homeUser ? (
        <TreeNode
          node={homeUser}
          path="/home/user"
          cwd={cwd}
          changedPaths={changedPaths}
          depth={0}
        />
      ) : (
        <div className={styles.treeNode}>~</div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function TerminalPlayground({ lessonId }: TerminalPlaygroundProps): React.ReactElement {
  const lesson = getLessonById(lessonId);

  const [, forceRender] = useState(0);
  const shellRef = useRef<ShellState | null>(null);
  const termWriteRef = useRef<((text: string) => void) | null>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const cwdRef = useRef<string>("");
  const [changedPaths, setChangedPaths] = useState<Map<string, "created" | "deleted" | "modified">>(new Map());
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [passed, setPassed] = useState(false);
  const [ready, setReady] = useState(false);

  if (!lesson) {
    return <div className={styles.loadingState}>Lesson {lessonId} not found.</div>;
  }

  // Initialise shell state once
  if (!shellRef.current) {
    shellRef.current = makeInitialState(lesson);
    cwdRef.current = lesson.initialCwd;
  }

  const shellState = shellRef.current;

  // Validate after each command
  const validationResult = lesson.validate(shellState);
  const isPassed = passed || validationResult.passed;

  // Handle command execution — called from xterm onKey
  const handleCommandRef = useRef<(cmd: string) => void>(() => {});
  handleCommandRef.current = (cmd: string) => {
    if (!shellRef.current) return;
    const { newState, output, changedPaths: changed } = executeCommand(cmd, shellRef.current);
    shellRef.current = newState;
    cwdRef.current = newState.cwd;

    // Write output and new prompt
    const write = termWriteRef.current;
    if (write) {
      if (output) {
        write("\r\n" + output.split("\n").join("\r\n"));
      }
      write("\r\n" + getPrompt(newState.cwd));
    }

    // Animate changed paths
    if (changed.length > 0) {
      const map = new Map<string, "created" | "deleted" | "modified">();
      for (const c of changed) map.set(c.path, c.change);
      setChangedPaths(map);
      setTimeout(() => setChangedPaths(new Map()), 700);
    }

    // Check validation
    const result = lesson.validate(newState);
    if (result.passed) setPassed(true);

    forceRender((n) => n + 1);
  };

  // Reset lesson
  const handleReset = () => {
    shellRef.current = makeInitialState(lesson);
    cwdRef.current = lesson.initialCwd;
    setPassed(false);
    setHintsRevealed(0);
    setChangedPaths(new Map());
    forceRender((n) => n + 1);
    const write = termWriteRef.current;
    if (write) {
      write("\x1b[2J\x1b[H"); // clear screen
      write(buildWelcome(lesson));
      write(getPrompt(lesson.initialCwd));
    }
  };

  // Navigate to a different lesson (reload page)
  const handleNav = (id: string) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lesson", id);
      window.location.href = url.toString();
    }
  };

  const nextLesson = getNextLesson(lessonId);
  const prevLesson = getPrevLesson(lessonId);

  // xterm.js setup
  useEffect(() => {
    let disposed = false;
    const el = termRef.current;
    if (!el) return;

    (async () => {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");
      await import("@xterm/xterm/css/xterm.css");

      if (disposed) return;

      const term = new Terminal({
        fontFamily: '"Geist Mono", "Cascadia Code", "Fira Code", monospace',
        fontSize: 13,
        lineHeight: 1.5,
        theme: {
          background: "#07090f",
          foreground: "#e2e8f0",
          cursor: "#60a5fa",
          cursorAccent: "#07090f",
          selectionBackground: "#1e3a6e",
          black: "#0f1623",
          brightBlack: "#334155",
          red: "#ef4444",
          brightRed: "#f87171",
          green: "#10b981",
          brightGreen: "#34d399",
          yellow: "#f59e0b",
          brightYellow: "#fbbf24",
          blue: "#3b82f6",
          brightBlue: "#60a5fa",
          magenta: "#8b5cf6",
          brightMagenta: "#a78bfa",
          cyan: "#06b6d4",
          brightCyan: "#22d3ee",
          white: "#94a3b8",
          brightWhite: "#f1f5f9",
        },
        cursorBlink: true,
        scrollback: 500,
        convertEol: true,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(el);

      setTimeout(() => { try { fitAddon.fit(); } catch {} }, 50);

      termWriteRef.current = (text: string) => term.write(text);

      // Welcome message + initial prompt
      term.write(buildWelcome(lesson));
      term.write(getPrompt(cwdRef.current));

      setReady(true);

      // Input state
      let buffer = "";
      let histIdx = -1;
      const histItems: string[] = [];

      term.onKey(({ key, domEvent }) => {
        const ev = domEvent;

        // Ctrl+L — clear screen
        if (ev.ctrlKey && ev.key.toLowerCase() === "l") {
          term.write("\x1b[2J\x1b[H");
          term.write(getPrompt(cwdRef.current) + buffer);
          return;
        }

        // Ctrl+C — cancel
        if (ev.ctrlKey && ev.key.toLowerCase() === "c") {
          term.write("^C\r\n" + getPrompt(cwdRef.current));
          buffer = "";
          histIdx = -1;
          return;
        }

        // Enter
        if (key === "\r") {
          const cmd = buffer.trim();
          if (cmd) {
            histItems.unshift(cmd);
            handleCommandRef.current(cmd);
          } else {
            term.write("\r\n" + getPrompt(cwdRef.current));
          }
          buffer = "";
          histIdx = -1;
          return;
        }

        // Backspace
        if (key === "\x7f") {
          if (buffer.length > 0) {
            buffer = buffer.slice(0, -1);
            term.write("\b \b");
          }
          return;
        }

        // Up arrow — history
        if (ev.key === "ArrowUp") {
          if (histIdx < histItems.length - 1) {
            histIdx++;
            term.write("\b \b".repeat(buffer.length));
            buffer = histItems[histIdx] ?? "";
            term.write(buffer);
          }
          return;
        }

        // Down arrow — history
        if (ev.key === "ArrowDown") {
          if (histIdx > 0) {
            histIdx--;
            term.write("\b \b".repeat(buffer.length));
            buffer = histItems[histIdx] ?? "";
            term.write(buffer);
          } else if (histIdx === 0) {
            histIdx = -1;
            term.write("\b \b".repeat(buffer.length));
            buffer = "";
          }
          return;
        }

        // Tab — basic completion
        if (key === "\t") {
          const words = buffer.split(" ");
          const partial = words[words.length - 1] ?? "";
          if (partial && shellRef.current) {
            const dir = shellRef.current.fs;
            const cwd = cwdRef.current;
            // Get current dir node
            let node: FileSystemNode | null = dir;
            const cwdParts = cwd === "/" ? [] : cwd.slice(1).split("/");
            for (const part of cwdParts) {
              if (!node || node.type !== "dir") { node = null; break; }
              node = (node as DirectoryNode).children.find((c) => c.name === part) ?? null;
            }
            if (node && node.type === "dir") {
              const matches = (node as DirectoryNode).children
                .filter((c) => c.name.startsWith(partial))
                .map((c) => c.name);
              if (matches.length === 1) {
                const completion = matches[0].slice(partial.length);
                buffer += completion;
                term.write(completion);
              } else if (matches.length > 1) {
                term.write("\r\n" + matches.join("  ") + "\r\n" + getPrompt(cwd) + buffer);
              }
            }
          }
          return;
        }

        // Ignore non-printable
        if (
          key.length > 1 ||
          ev.ctrlKey ||
          ev.altKey ||
          ev.metaKey ||
          ev.key === "ArrowLeft" ||
          ev.key === "ArrowRight"
        ) return;

        buffer += key;
        term.write(key);
      });

      const ro = new ResizeObserver(() => { try { fitAddon.fit(); } catch {} });
      ro.observe(el);

      return () => {
        disposed = true;
        ro.disconnect();
        term.dispose();
        termWriteRef.current = null;
      };
    })();

    return () => { disposed = true; };
  }, []); // mount once — lesson re-mounts on page navigation

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.title}>Terminal Playground</span>
          <span className={styles.lessonBadge}>{lesson.title}</span>
        </div>
        <div className={styles.headerActions}>
          {prevLesson && (
            <button className={styles.btnSecondary} onClick={() => handleNav(prevLesson.id)}>
              ← Prev
            </button>
          )}
          {nextLesson && isPassed && (
            <button className={styles.btnSecondary} onClick={() => handleNav(nextLesson.id)}>
              Next →
            </button>
          )}
          <button className={styles.btnSecondary} onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* Two-pane grid */}
      <div className={styles.grid}>
        {/* Left pane */}
        <div className={styles.leftPane}>
          {/* Goal */}
          <div className={styles.goalBox}>
            <div className={styles.goalLabel}>Goal</div>
            <div
              className={styles.goalText}
              dangerouslySetInnerHTML={{ __html: renderInlineCode(lesson.goal) }}
            />
          </div>

          {/* Success */}
          {isPassed && (
            <div className={styles.successBox}>
              <div className={styles.successLabel}>✓ Completed</div>
              <div className={styles.successText}>{lesson.successMessage}</div>
            </div>
          )}

          {/* File tree */}
          <FileTree
            fs={shellState.fs}
            cwd={shellState.cwd}
            changedPaths={changedPaths}
          />

          {/* Hints */}
          {!isPassed && lesson.hints.length > 0 && (
            <div className={styles.hintsSection}>
              {lesson.hints.slice(0, hintsRevealed).map((hint, i) => (
                <div
                  key={i}
                  className={styles.hint}
                  dangerouslySetInnerHTML={{ __html: "💡 " + renderInlineCode(hint) }}
                />
              ))}
              {hintsRevealed < lesson.hints.length && (
                <button
                  className={styles.hintReveal}
                  onClick={() => setHintsRevealed((n) => n + 1)}
                >
                  {hintsRevealed === 0 ? "Show hint" : "Show next hint"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right pane — terminal */}
        <div className={styles.rightPane}>
          {!ready && <div className={styles.loadingState}>Loading terminal…</div>}
          <div
            ref={termRef}
            className={styles.terminalContainer}
            style={{ display: ready ? "block" : "none" }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────

function buildWelcome(lesson: { module: number; id: string; title: string; intro: string }): string {
  return (
    `\x1b[1;34m━━━ ${lesson.title} \x1b[0m\r\n` +
    `\x1b[90m${lesson.intro.replace(/`([^`]+)`/g, "\x1b[36m$1\x1b[90m")}\x1b[0m\r\n\r\n`
  );
}

function renderInlineCode(text: string): string {
  return text.replace(/`([^`]+)`/g, "<code>$1</code>");
}

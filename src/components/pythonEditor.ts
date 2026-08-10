import type React from "react";

const INDENT = "    ";

/**
 * Key handling shared by the Python editors.
 *
 * Python is whitespace-sensitive, so a plain textarea is not quite enough: Tab
 * has to insert spaces instead of moving focus, and Enter should keep the
 * current indentation (and add a level after a colon).
 */
export function createEditorKeyDownHandler(
  value: string,
  setValue: (next: string) => void,
  onRun: () => void
) {
  return function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    const textarea = event.currentTarget;

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      onRun();
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const apply = (insert: string, replaceFrom = start, replaceTo = end) => {
      const next = value.slice(0, replaceFrom) + insert + value.slice(replaceTo);
      setValue(next);
      const caret = replaceFrom + insert.length;
      requestAnimationFrame(() => {
        textarea.selectionStart = caret;
        textarea.selectionEnd = caret;
      });
    };

    if (event.key === "Tab") {
      event.preventDefault();
      apply(INDENT);
      return;
    }

    if (event.key === "Enter") {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      const indent = line.match(/^[ \t]*/)?.[0] ?? "";
      const deeper = line.trimEnd().endsWith(":") ? INDENT : "";
      if (!indent && !deeper) return;
      event.preventDefault();
      apply("\n" + indent + deeper);
      return;
    }

    if (event.key === "Backspace" && start === end && start >= INDENT.length) {
      const before = value.slice(start - INDENT.length, start);
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const isIndentOnly = value.slice(lineStart, start).trim() === "";
      if (before === INDENT && isIndentOnly) {
        event.preventDefault();
        apply("", start - INDENT.length, end);
      }
    }
  };
}

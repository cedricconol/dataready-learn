import { useLayoutEffect, type RefObject } from "react";

/**
 * Auto-expands a textarea to fit its content, up to a maximum number of rows.
 * Once the content exceeds maxRows, the textarea stops growing and scrolls.
 */
export function useAutoResizeTextarea(
  ref: RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxRows = 20,
): void {
  useLayoutEffect(() => {
    const ta = ref.current;
    if (!ta) return;

    const style = window.getComputedStyle(ta);
    const lineHeight = parseFloat(style.lineHeight) || 0;
    const paddingY =
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const borderY =
      parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const maxHeight = lineHeight * maxRows + paddingY + borderY;

    ta.style.height = "auto";
    const next = Math.min(ta.scrollHeight, maxHeight);
    ta.style.height = `${next}px`;
    ta.style.overflowY = ta.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [ref, value, maxRows]);
}

import React, { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Delay in ms before the element animates in once it enters the viewport. */
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

/**
 * Reveals its children with a subtle fade-and-rise the first time they scroll
 * into view. Uses IntersectionObserver (never a scroll listener) and collapses
 * to a static, already-visible state when the user prefers reduced motion or
 * when IntersectionObserver is unavailable (SSR / older browsers).
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={visible ? "in" : "out"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

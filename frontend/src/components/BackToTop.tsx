"use client";

import { useEffect, useState } from "react";

/**
 * Appears past 600px of scroll, exactly as the artifact's `scrolled` state
 * did. The scroll listener is registered with `capture: true` for the same
 * reason the original gave: the scrolling element is not always the document.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sc = document.scrollingElement || document.documentElement;
      const y = sc.scrollTop || window.scrollY || document.body.scrollTop || 0;
      setShown(y > 600);
    };
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  if (!shown) return null;

  const goTop = () => {
    const sc = document.scrollingElement || document.documentElement;
    try {
      sc.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      sc.scrollTop = 0;
    }
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      /* older engines: the scrollingElement write above already ran */
    }
    document.body.scrollTop = 0;
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      className="btn btn-primary fixed right-[clamp(16px,3vw,32px)] bottom-[clamp(16px,3vw,32px)] z-50 min-h-10 animate-kfm-press whitespace-nowrap shadow-md"
    >
      ↑ Top
    </button>
  );
}

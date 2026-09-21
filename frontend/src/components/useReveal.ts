"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The scroll reveal, lifted from the artifact's `class Component extends
 * DCLogic`. Every element carrying `data-reveal` gets `data-armed` when the
 * observer picks it up and `data-in` when it crosses the viewport;
 * globals.css turns that into the kfm-rise animation.
 *
 * Two things here are not in the artifact, both measured on 2026-09-22:
 *
 * 1. A MutationObserver replaces the artifact's `setInterval(wire, 500)`.
 *    This hook lives in the layout, so its effect runs when the SHELL
 *    commits; the API-backed pages stream their content in afterwards, which a
 *    `pathname` dependency never sees. The first implementation armed 0 of 19
 *    elements for exactly this reason. (Those pages were `force-dynamic` when
 *    the fault was found and are ISR now — the ordering is the same either
 *    way, so the MutationObserver is still load-bearing.)
 *
 * 2. `data-armed` is a CSS hook ONLY — never a record of "already observed".
 *    Using it as both made the hook fail under StrictMode's double-invoke:
 *    run 1 armed 19 elements and its cleanup disconnected that observer, then
 *    run 2 skipped all 19 as already-armed, leaving the LIVE observer with
 *    zero targets and nothing ever revealing. arm() now re-observes anything
 *    not yet revealed on every run (io.observe is a no-op for a target the
 *    observer already holds), and cleanup clears data-armed from whatever has
 *    not revealed, so a genuine unmount cannot strand content at opacity 0.
 *
 * The 1.5 s failsafe is the artifact's, unchanged: if nothing has revealed by
 * then the observer is not doing its job, so everything is shown.
 */
export function useReveal(): void {
  const pathname = usePathname();

  useEffect(() => {
    const clearArmed = () => {
      document.querySelectorAll("[data-armed]").forEach((el) => {
        el.removeAttribute("data-armed");
      });
    };

    if (typeof IntersectionObserver === "undefined" || document.visibilityState === "hidden") {
      clearArmed();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-in", "");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    const arm = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (el.hasAttribute("data-in")) return;
        el.setAttribute("data-armed", "");
        io.observe(el);
      });
    };

    arm();

    // Re-arm whatever streams in after the shell, coalesced to one pass per frame.
    let frame = 0;
    const mo = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        arm();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const standDown = () => {
      mo.disconnect();
      io.disconnect();
      clearArmed();
    };

    // failsafe: if nothing has revealed shortly after mount, show everything
    const guard = window.setTimeout(() => {
      if (document.querySelector("[data-in]")) return;
      standDown();
    }, 1500);

    const onVisibility = () => {
      if (document.visibilityState !== "hidden") return;
      standDown();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(guard);
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      mo.disconnect();
      io.disconnect();
      clearArmed();
    };
  }, [pathname]);
}

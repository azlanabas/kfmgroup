"use client";

import { useReveal } from "./useReveal";

/**
 * Host for useReveal(). The pages are Server Components carrying plain
 * `data-reveal` attributes, so the observer needs one client element in the
 * shell to run from; it renders nothing.
 */
export function Reveal() {
  useReveal();
  return null;
}

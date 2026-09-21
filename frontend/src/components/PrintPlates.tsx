"use client";

import { useEffect, useRef } from "react";
import { startPressDriver } from "./pressDriver";

/**
 * The Broadsheet separation filters. Each single-plate filter extracts one
 * process plate from a photograph, rendered as that ink on the sheet — cyan
 * from R, magenta from G, yellow from B, and a 60%-strength luminance K in the
 * text ink. #sep-all chains the four into ONE compound filter: each stage
 * re-extracts a plate from SourceGraphic, clips it to the source's own
 * silhouette (feComposite operator="in" against SourceAlpha), and offsets the
 * clipped sheet by the registered misregistration (C 0,0 / M 5,3 / Y -5,-3 /
 * K 3,6). The sheets multiply where they cross and show alone where they do
 * not.
 *
 * The artifact injected these defs with a script because its defs had to end
 * up in the document and a data-URI filter reference does not survive
 * Chromium. React puts them in the document directly, so the injection is
 * gone; the offsets still live on feOffset primitives tagged data-plate
 * because the press driver animates them.
 *
 * Rendered once at the end of <body> in layout.tsx, outside any page, so a
 * route change cannot strand the references — filter references resolve
 * document-wide.
 */
export function PrintPlates() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return startPressDriver(ref.current);
  }, []);

  return (
    <svg ref={ref} width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="sep-c" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0.467 0 0 0 0.533  0.310 0 0 0 0.690  0 0 0 0 1"
          />
        </filter>
        <filter id="sep-m" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0.161 0 0 0.839  0 1 0 0 0  0 0.576 0 0 0.424  0 0 0 0 1"
          />
        </filter>
        <filter id="sep-y" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0.071 0 0.929  0 0 0.267 0 0.733  0 0 1 0 0  0 0 0 0 1"
          />
        </filter>
        <filter id="sep-k" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.112 0.375 0.038 0 0.475  0.113 0.379 0.038 0 0.471  0.113 0.380 0.038 0 0.468  0 0 0 0 1"
          />
        </filter>

        <filter id="sep-all" colorInterpolationFilters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  0.467 0 0 0 0.533  0.310 0 0 0 0.690  0 0 0 0 1"
            data-plate-mat="c"
            result="c0"
          />
          <feComposite in="c0" in2="SourceAlpha" operator="in" result="c" />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0.161 0 0 0.839  0 1 0 0 0  0 0.576 0 0 0.424  0 0 0 0 1"
            data-plate-mat="m"
            result="m0"
          />
          <feComposite in="m0" in2="SourceAlpha" operator="in" result="m1" />
          <feOffset in="m1" dx="5" dy="3" data-plate="m" result="m" />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0.071 0 0.929  0 0 0.267 0 0.733  0 0 1 0 0  0 0 0 0 1"
            data-plate-mat="y"
            result="y0"
          />
          <feComposite in="y0" in2="SourceAlpha" operator="in" result="y1" />
          <feOffset in="y1" dx="-5" dy="-3" data-plate="y" result="y" />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.112 0.375 0.038 0 0.475  0.113 0.379 0.038 0 0.471  0.113 0.380 0.038 0 0.468  0 0 0 0 1"
            data-plate-mat="k"
            result="k0"
          />
          <feComposite in="k0" in2="SourceAlpha" operator="in" result="k1" />
          <feOffset in="k1" dx="3" dy="6" data-plate="k" result="k" />

          <feBlend in="m" in2="c" mode="multiply" result="s1" />
          <feBlend in="y" in2="s1" mode="multiply" result="s2" />
          <feBlend in="k" in2="s2" mode="multiply" />
        </filter>
      </defs>
    </svg>
  );
}

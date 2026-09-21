/**
 * The press driver — hover registration and the pointer lean, ported from
 * print-plates.js inside the artifact bundle (manifest uuid
 * 6df0c695-bd7c-4234-a6ce-3c102a9974ba). All numbers are the measured design
 * values, not tunables-in-waiting: LEAN is ±2.5px x / ±2px y at the viewport
 * edges (half the M/Y x-offset, two-thirds of its y — a breath); REGISTER_MS
 * matches the deck's gather without its theatre.
 *
 * Hover gathers the plates into register while the same eased value purifies
 * the plate inks — each feColorMatrix lerps from its brand separation to the
 * pure-process factorization whose four plates multiply back to SourceGraphic
 * exactly — so the converged merge IS the photograph. Nothing is swapped in at
 * any point.
 *
 * The driver also publishes the pointer as bare -1..1 factors
 * (--press-nx / --press-ny) on :root, which the text-plate treatments
 * (.cmyk-num, .cmyk-head in globals.css) multiply into their own em spreads.
 * It stands down wholesale under prefers-reduced-motion or without a fine
 * hover pointer; globals.css carries the matching media-gated :hover cut as
 * the fallback.
 */

const BASE: Record<string, [number, number]> = {
  m: [5, 3],
  y: [-5, -3],
  k: [3, 6],
};

const LEAN_PX: [number, number] = [2.5, 2];
const REGISTER_MS = 450;

/**
 * The plate matrices' two endpoints. INK is the brand separation the sheet
 * prints at rest. TRUE_ is the pure-process factorization — C passes R and
 * floods G,B to 1, M and Y likewise for their channels, K goes to white (the
 * multiply identity) — chosen because the four TRUE plates multiply back to
 * SourceGraphic EXACTLY: (R,1,1)·(1,G,1)·(1,1,B)·(1,1,1) = (R,G,B).
 */
const INK: Record<string, number[]> = {
  c: [1, 0, 0, 0, 0, 0.467, 0, 0, 0, 0.533, 0.31, 0, 0, 0, 0.69, 0, 0, 0, 0, 1],
  m: [0, 0.161, 0, 0, 0.839, 0, 1, 0, 0, 0, 0, 0.576, 0, 0, 0.424, 0, 0, 0, 0, 1],
  y: [0, 0, 0.071, 0, 0.929, 0, 0, 0.267, 0, 0.733, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  k: [0.112, 0.375, 0.038, 0, 0.475, 0.113, 0.379, 0.038, 0, 0.471, 0.113, 0.38, 0.038, 0, 0.468, 0, 0, 0, 0, 1],
};

const TRUE_: Record<string, number[]> = {
  c: [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  m: [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  y: [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  k: [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
};

/** Starts the driver against a mounted <svg> of defs. Returns a teardown. */
export function startPressDriver(svg: SVGSVGElement): () => void {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};

  const nodes: Record<string, SVGFEOffsetElement> = {};
  svg.querySelectorAll<SVGFEOffsetElement>("feOffset[data-plate]").forEach((n) => {
    nodes[n.dataset.plate as string] = n;
  });

  const mats: Record<string, SVGFEColorMatrixElement> = {};
  svg.querySelectorAll<SVGFEColorMatrixElement>("feColorMatrix[data-plate-mat]").forEach((n) => {
    mats[n.dataset.plateMat as string] = n;
  });

  const root = document.documentElement;
  let nx = 0;
  let ny = 0; // smoothed pointer, -1..1 from viewport centre
  let tx = 0;
  let ty = 0; // raw pointer target
  let reg = 1; // 1 = misregistered (rest), 0 = in register
  let regFrom = 1;
  let regTo = 1;
  let regT0 = 0;
  let raf = 0;
  let lastOffs = "";
  let lastReg = -1;
  let lastProps = "";

  const ease = (t: number) => 1 - Math.pow(1 - t, 3); // cubic out

  const tick = (now: number) => {
    raf = 0;
    nx += (tx - nx) * 0.22;
    ny += (ty - ny) * 0.22; // soften the hand

    if (regTo !== reg || regT0) {
      const t = Math.min(1, (now - regT0) / REGISTER_MS);
      reg = regFrom + (regTo - regFrom) * ease(t);
      if (t >= 1) {
        reg = regTo;
        regT0 = 0;
      }
    }

    // Every write below is guarded on its COMPUTED output, not its inputs — an
    // equal-value setAttribute still dirties the filter, and at full register
    // the offsets are 0.00 whatever the lean.
    const lx = LEAN_PX[0] * nx;
    const ly = LEAN_PX[1] * ny;
    const vals: Record<string, [string, string]> = {};
    let offsKey = "";
    for (const p in BASE) {
      const dx = ((BASE[p][0] + lx) * reg).toFixed(2);
      const dy = ((BASE[p][1] + ly) * reg).toFixed(2);
      vals[p] = [dx, dy];
      offsKey += `${dx},${dy};`;
    }
    if (offsKey !== lastOffs) {
      lastOffs = offsKey;
      for (const p in BASE) {
        nodes[p]?.setAttribute("dx", vals[p][0]);
        nodes[p]?.setAttribute("dy", vals[p][1]);
      }
    }

    // the ink purification rides the same eased value — INK at rest (reg 1),
    // TRUE_ at register (reg 0)
    if (reg !== lastReg) {
      lastReg = reg;
      for (const p in mats) {
        const a = INK[p];
        const b = TRUE_[p];
        const v = new Array<string>(20);
        for (let i = 0; i < 20; i++) v[i] = (b[i] + (a[i] - b[i]) * reg).toFixed(3);
        mats[p].setAttribute("values", v.join(" "));
      }
    }

    // the text plates lean whatever the photo's register state
    const pk = `${nx.toFixed(3)},${ny.toFixed(3)}`;
    if (pk !== lastProps) {
      lastProps = pk;
      root.style.setProperty("--press-nx", nx.toFixed(3));
      root.style.setProperty("--press-ny", ny.toFixed(3));
    }

    if (regT0 || Math.abs(tx - nx) > 0.002 || Math.abs(ty - ny) > 0.002) schedule();
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onPointerMove = (e: PointerEvent) => {
    tx = (2 * e.clientX) / innerWidth - 1;
    ty = (2 * e.clientY) / innerHeight - 1;
    schedule();
  };

  const retarget = (to: number) => {
    regFrom = reg;
    regTo = to;
    regT0 = performance.now();
    schedule();
  };

  const onPointerOver = (e: PointerEvent) => {
    const target = e.target as Element | null;
    const p = target?.closest?.(".cmyk .print");
    if (p && !(e.relatedTarget instanceof Node && p.contains(e.relatedTarget))) retarget(0);
  };

  const onPointerOut = (e: PointerEvent) => {
    const target = e.target as Element | null;
    const p = target?.closest?.(".cmyk .print");
    if (p && !(e.relatedTarget instanceof Node && p.contains(e.relatedTarget))) retarget(1);
  };

  addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerover", onPointerOver);
  document.addEventListener("pointerout", onPointerOut);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerover", onPointerOver);
    document.removeEventListener("pointerout", onPointerOut);
    root.style.removeProperty("--press-nx");
    root.style.removeProperty("--press-ny");
  };
}

/**
 * The two text-plate constructions from the Broadsheet system.
 *
 * Both work the same way: a `.paper` span carries the real text for assistive
 * technology and paints the white of the sheet behind the plates, then three
 * aria-hidden repeats print the C, M and Y plates over it in multiply. There
 * is no black plate — the dark core is the C×M×Y overlap, and the fringes are
 * the registration drift. The M and Y plates lean toward the pointer via
 * --press-nx / --press-ny, published by the press driver.
 *
 * PlateNumeral is the catalogue-cover numeral (full offsets, paints its own
 * ground). PlateHeadline is the same construction at half the offsets, recut
 * for display headlines sitting on the page's own paper.
 */

function plates(text: string) {
  return (
    <>
      <span className="plate plate-c" aria-hidden="true">
        {text}
      </span>
      <span className="plate plate-m" aria-hidden="true">
        {text}
      </span>
      <span className="plate plate-y" aria-hidden="true">
        {text}
      </span>
    </>
  );
}

export function PlateNumeral({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`cmyk-num font-heading ${className}`}>
      <span className="paper">{children}</span>
      {plates(children)}
    </div>
  );
}

export function PlateHeadline({ children }: { children: string }) {
  return (
    <span className="cmyk-head block">
      <span className="paper">{children}</span>
      {plates(children)}
    </span>
  );
}

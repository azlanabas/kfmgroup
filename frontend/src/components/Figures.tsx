/**
 * The two photographic treatments.
 *
 * PrintFigure is the four-colour separation: figure.cmyk > .print > img, with
 * the compound #sep-all filter extracting, offsetting and multiplying the
 * plates live. Hovering resolves the print into the photograph.
 *
 * HalftoneFigure is the cheaper treatment — a dot screen multiplied over a
 * desaturated photograph, no filter and no driver.
 *
 * Both use a plain <img>. The photographs are local files under /media/,
 * mirrored from ../media by scripts/sync-media.mjs — nothing is fetched from
 * kfmgroup.my at runtime. next/image is not used because these images are
 * already sized for their slots and the CMYK filter chain operates on the
 * element itself, which next/image's wrapper markup would complicate.
 */

type Img = { src: string; alt: string };

export function PrintFigure({
  src,
  alt,
  ratio,
  figureClassName = "",
  printClassName = "",
  reveal = true,
}: Img & {
  /** Tailwind aspect utility, e.g. "aspect-[3/4]". */
  ratio: string;
  figureClassName?: string;
  printClassName?: string;
  reveal?: boolean;
}) {
  return (
    <figure
      data-reveal={reveal ? "" : undefined}
      className={`cmyk m-0 overflow-visible ${figureClassName}`}
    >
      <div className={`print ${ratio} ${printClassName}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-full w-full object-cover" />
      </div>
    </figure>
  );
}

export function HalftoneFigure({
  src,
  alt,
  ratio,
  className = "",
  reveal = false,
  as = "figure",
}: Img & {
  ratio: string;
  className?: string;
  reveal?: boolean;
  /** The artifact used a bare <div class="halftone"> inside article cards. */
  as?: "figure" | "div";
}) {
  const inner = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="block h-full w-full object-cover" />
  );
  const cls = `halftone m-0 ${ratio} ${className}`;
  return as === "div" ? (
    <div data-reveal={reveal ? "" : undefined} className={cls}>
      {inner}
    </div>
  ) : (
    <figure data-reveal={reveal ? "" : undefined} className={cls}>
      {inner}
    </figure>
  );
}

import Image from "next/image";

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
 * Both use next/image in `fill` mode, which serves AVIF/WebP with a srcset and
 * lazy-loads anything below the fold. It renders a real <img>, so the CMYK
 * filter chain and the halftone ::after still apply exactly as before — the
 * filter lives on the wrapper, not the image. Both wrappers are already
 * `position: relative` in globals.css (`.cmyk .print` and `.halftone`), which
 * is what `fill` needs.
 *
 * `priority` is for above-the-fold art only: the home hero and each page's
 * lead figure. Everything else stays lazy.
 */

type Img = { src: string; alt: string };

/** Matches the layout: full width on mobile, then a share of the 1240px page. */
const SIZES_DEFAULT = "(max-width: 820px) 100vw, (max-width: 1240px) 50vw, 620px";

export function PrintFigure({
  src,
  alt,
  ratio,
  figureClassName = "",
  printClassName = "",
  reveal = true,
  priority = false,
  sizes = SIZES_DEFAULT,
}: Img & {
  /** Tailwind aspect utility, e.g. "aspect-[3/4]". */
  ratio: string;
  figureClassName?: string;
  printClassName?: string;
  reveal?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure
      data-reveal={reveal ? "" : undefined}
      className={`cmyk m-0 overflow-visible ${figureClassName}`}
    >
      <div className={`print relative ${ratio} ${printClassName}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
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
  priority = false,
  sizes = SIZES_DEFAULT,
}: Img & {
  ratio: string;
  className?: string;
  reveal?: boolean;
  /** The artifact used a bare <div class="halftone"> inside article cards. */
  as?: "figure" | "div";
  priority?: boolean;
  sizes?: string;
}) {
  const inner = (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
  );
  const cls = `halftone relative m-0 ${ratio} ${className}`;
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

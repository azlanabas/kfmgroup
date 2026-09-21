import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Next 16 writes an AGENTS.md and CLAUDE.md into this folder on every dev
   * start. The workspace rule is exactly one root CLAUDE.md, so the generator
   * is off (owner decision, 2026-09-22).
   */
  agentRules: false,

  images: {
    /**
     * AVIF first, WebP second — the browser picks via Accept. Measured
     * 2026-09-22: the 121 KB hero JPEG comes back as 47 KB WebP; AVIF is
     * smaller again. Ordering matters, Next tries them left to right.
     */
    formats: ["image/avif", "image/webp"],
    /** The photographs never change without a filename change. */
    minimumCacheTTL: 31536000,
    /**
     * deviceSizes / imageSizes are deliberately left at Next's defaults.
     * Trimming them to the widths this layout uses saved almost nothing and
     * made the optimizer return 400 for any width not in the list — observed
     * 2026-09-22 on a page still referencing w=384.
     */
  },

  /** Don't advertise the framework. */
  poweredByHeader: false,

  async headers() {
    return [
      {
        // The fonts are content-hashed by filename and never change in place.
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;

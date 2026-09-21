import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes";
import { siteConfig } from "@/lib/siteConfig";

/** Served at /sitemap.xml. Driven by lib/routes.ts so it cannot fall behind the nav. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.filter((r) => r.path !== "/careers" || siteConfig.showCareers).map((r) => ({
    url: `${siteConfig.url}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

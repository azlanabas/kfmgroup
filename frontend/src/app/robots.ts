import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Served at /robots.txt.
 *
 * AEO/GEO note: the AI answer-engine crawlers are allowed deliberately —
 * GPTBot, ClaudeBot, PerplexityBot and Google-Extended are what decide whether
 * this site can be cited in an AI answer. Blocking them is the single most
 * common reason a site never appears in one. Flip any of them to `disallow`
 * if the client would rather not be used as training or citation material.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing here is private, but the API is not for crawlers.
        disallow: ["/api/"],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

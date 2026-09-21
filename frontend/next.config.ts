import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Next 16 writes an AGENTS.md and CLAUDE.md into this folder on every dev
   * start. The workspace rule is exactly one root CLAUDE.md, so the generator
   * is off (owner decision, 2026-09-22).
   */
  agentRules: false,
};

export default nextConfig;

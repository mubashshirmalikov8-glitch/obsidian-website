/**
 * Single source of truth for the site's absolute origin (used by metadata,
 * canonical/hreflang, sitemap, robots, JSON-LD and OG images).
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL  — explicit override (set this once DNS is live).
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production domain, so
 *      canonicals resolve on the live deployment now and migrate automatically
 *      when the custom domain (obsidian.uz) is attached as production.
 *   3. https://obsidian.uz   — the locked brand domain (local/dev fallback).
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://obsidian.uz";
}

export const SITE_URL = resolveSiteUrl().replace(/\/+$/, "");

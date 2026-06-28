import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

/** Sitemap with per-locale hreflang alternates (incl. x-default → default locale). */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}`]),
  );
  languages["x-default"] = `${SITE_URL}/${defaultLocale}`;

  const lastModified = new Date();

  return locales.map((l) => ({
    url: `${SITE_URL}/${l}`,
    lastModified,
    changeFrequency: "monthly",
    priority: l === defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}

import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, defaultLocale, locales, type Locale } from "@/i18n/config";

export const alt = "OBSIDIAN — Marketplace ta'lim va konsalting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * On-brand social card (OG + Twitter), generated per locale. Mirrors the
 * OBSIDIAN palette — deep obsidian, ion/ember accents — with the localized
 * headline and tagline. Meta asset only; the site UI is untouched.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : defaultLocale;
  const dict = await getDictionary(loc);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(120% 90% at 18% 12%, #0b1620 0%, #05060a 55%), #05060a",
          color: "#eaf0ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "9999px",
              background: "#5ee6ff",
            }}
          />
          <div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "0.24em" }}>
            OBSIDIAN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <div
            style={{
              fontSize: "66px",
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              maxWidth: "960px",
            }}
          >
            {dict.hero.title}
          </div>
          <div style={{ fontSize: "30px", color: "#8a93ad", maxWidth: "840px" }}>
            {dict.brand.tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              width: "128px",
              height: "4px",
              borderRadius: "9999px",
              background: "linear-gradient(90deg, #5ee6ff, #ff6a3d)",
            }}
          />
          <div style={{ fontSize: "22px", color: "#8a93ad" }}>obsidian.uz</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { locales, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SITE_URL } from "@/lib/site";
import { organizationJsonLd, courseJsonLd } from "@/lib/structured-data";
import { DictionaryProvider } from "@/i18n/dictionary-context";
import { AppProviders } from "@/components/providers/AppProviders";
import { Backdrop } from "@/components/ui/Backdrop";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { MobileCta } from "@/components/ui/MobileCta";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const OG_LOCALE: Record<Locale, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : defaultLocale;
  const dict = await getDictionary(loc);

  const languages: Record<string, string> = {
    uz: "/uz",
    ru: "/ru",
    en: "/en",
    "x-default": `/${defaultLocale}`,
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${loc}`,
      languages,
    },
    openGraph: {
      type: "website",
      url: `/${loc}`,
      siteName: "OBSIDIAN",
      title: dict.meta.title,
      description: dict.meta.description,
      locale: OG_LOCALE[loc],
      alternateLocale: locales.filter((l) => l !== loc).map((l) => OG_LOCALE[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  const jsonLdArgs = {
    siteUrl: SITE_URL,
    locale,
    name: dict.brand.name,
    title: dict.meta.title,
    description: dict.meta.description,
  };

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(jsonLdArgs)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(courseJsonLd(jsonLdArgs)),
          }}
        />
        <DictionaryProvider dict={dict} locale={locale as Locale}>
          <AppProviders>
            <Backdrop />
            <Nav />
            <main className="relative z-10">{children}</main>
            <Footer />
            <MobileCta />
            <GrainOverlay />
            <VisitorTracker />
          </AppProviders>
        </DictionaryProvider>
      </body>
    </html>
  );
}

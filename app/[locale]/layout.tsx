import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { locales, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { DictionaryProvider } from "@/i18n/dictionary-context";
import { AppProviders } from "@/components/providers/AppProviders";
import { Backdrop } from "@/components/ui/Backdrop";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { MobileCta } from "@/components/ui/MobileCta";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : defaultLocale;
  const dict = await getDictionary(loc);
  return {
    metadataBase: new URL("https://obsidian.uz"),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${loc}`,
      languages: { uz: "/uz", ru: "/ru", en: "/en" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${loc}`,
      siteName: "OBSIDIAN",
      type: "website",
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

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <DictionaryProvider dict={dict} locale={locale as Locale}>
          <AppProviders>
            <Backdrop />
            <Nav />
            <main className="relative z-10">{children}</main>
            <Footer />
            <MobileCta />
            <GrainOverlay />
          </AppProviders>
        </DictionaryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import "../globals.css";

// Admin gets its own root layout (separate <html>) — isolated from the public
// [locale] tree, no i18n, no Lenis/motion. Same OBSIDIAN fonts + tokens.
const display = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "OBSIDIAN — Admin",
  robots: { index: false, follow: false }, // the admin panel is never indexed
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-screen bg-void text-starlight">{children}</body>
    </html>
  );
}

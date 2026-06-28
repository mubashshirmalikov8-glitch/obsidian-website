/**
 * Schema.org JSON-LD builders (server-only data, no UI impact).
 *
 * - Organization: the OBSIDIAN brand entity.
 * - Course: the marketplace education/consulting program, with online/offline
 *   instances (the two real formats offered in the Final CTA).
 *
 * No FAQPage is emitted: the page has no visible FAQ section, and Google's
 * guidelines require FAQ structured data to reflect on-page FAQ content.
 */

type Args = {
  siteUrl: string;
  locale: string;
  name: string; // brand name — "OBSIDIAN"
  title: string; // localized meta title (reused as the Course name)
  description: string; // localized meta description
};

const ORG_ID = (siteUrl: string) => `${siteUrl}/#organization`;

export function organizationJsonLd({ siteUrl, name, title, description }: Args) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID(siteUrl),
    name,
    alternateName: title,
    url: siteUrl,
    description,
    image: `${siteUrl}/opengraph-image`,
    areaServed: "UZ",
    knowsLanguage: ["uz", "ru", "en"],
  };
}

export function courseJsonLd({ siteUrl, locale, name, title, description }: Args) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description,
    inLanguage: locale,
    url: `${siteUrl}/${locale}#enroll`,
    provider: {
      "@type": "Organization",
      "@id": ORG_ID(siteUrl),
      name,
      url: siteUrl,
    },
    hasCourseInstance: [
      { "@type": "CourseInstance", courseMode: "online", inLanguage: locale },
      { "@type": "CourseInstance", courseMode: "onsite", inLanguage: locale },
    ],
  };
}

import type { Metadata, MetadataRoute } from "next";
import { SEO } from "@/content/seo";
import { ALL_SERVICE_NAMES } from "@/content/services";
import { siteConfig, type PostalAddress, type SiteConfig } from "@/site.config";

export function pageTitle(config: SiteConfig = siteConfig): string {
    return `${config.brandName} — ${SEO.titleTail}`;
}

export function buildMetadata(config: SiteConfig = siteConfig): Metadata {
    const title = pageTitle(config);
    return {
        metadataBase: new URL(config.siteUrl),
        title,
        description: SEO.description,
        applicationName: config.brandName,
        alternates: { canonical: "/" },
        robots: config.allowIndex ? { index: true, follow: true } : { index: false, follow: false },
        openGraph: {
            type: "website",
            locale: "en_US",
            url: "/",
            siteName: config.brandName,
            title,
            description: SEO.description,
        },
        twitter: { card: "summary", title, description: SEO.description },
    };
}

/**
 * Crawling stays allowed before launch on purpose: a robots.txt Disallow would
 * stop Google from ever seeing the noindex tag and header that keep the site
 * out of results. The sitemap is listed only once indexing is allowed.
 */
export function buildRobots(config: SiteConfig = siteConfig): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        ...(config.allowIndex ? { sitemap: `${config.siteUrl}/sitemap.xml` } : {}),
    };
}

/** One page. No lastModified: there is no real date to give it. */
export function buildSitemap(config: SiteConfig = siteConfig): MetadataRoute.Sitemap {
    return [{ url: `${config.siteUrl}/`, changeFrequency: "monthly", priority: 1 }];
}

function toSchemaAddress(address: PostalAddress): Record<string, string> {
    return {
        "@type": "PostalAddress",
        streetAddress: address.streetAddress,
        addressLocality: address.addressLocality,
        addressRegion: address.addressRegion,
        ...(address.postalCode ? { postalCode: address.postalCode } : {}),
        addressCountry: address.addressCountry,
    };
}

/**
 * ProfessionalService JSON-LD. Real facts only: no ratings, reviews, prices,
 * phone or dates. The email is left out on purpose, because the page builds it
 * in the browser to keep it away from scrapers.
 */
export function buildJsonLd(config: SiteConfig = siteConfig): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${config.siteUrl}/#organization`,
        name: config.brandName,
        url: `${config.siteUrl}/`,
        description: SEO.description,
        address: config.addresses.map(toSchemaAddress),
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: SEO.offerCatalogName,
            itemListElement: ALL_SERVICE_NAMES.map((name) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name },
            })),
        },
        ...(config.poweredBy.show
            ? {
                  parentOrganization: {
                      "@type": "Organization",
                      name: config.poweredBy.name,
                      url: config.poweredBy.url,
                  },
              }
            : {}),
    };
}

/** `<` is escaped so no string in the data can close the script tag early. */
export function serializeJsonLd(data: Record<string, unknown>): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

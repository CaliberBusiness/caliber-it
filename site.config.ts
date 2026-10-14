/**
 * Everything that names the brand, its domain or its parent company.
 *
 * Spinning this service off onto its own domain should be an edit to this
 * file plus new env vars, nothing else. Section copy lives in content/, and
 * nothing in content/ or components/ hardcodes the brand or the parent.
 */

export interface PostalAddress {
    readonly label: string;
    readonly streetAddress: string;
    readonly addressLocality: string;
    readonly addressRegion: string;
    /** Null where the source (Caliber's footer) gives none. Never guessed. */
    readonly postalCode: string | null;
    /** ISO 3166-1 alpha-2. */
    readonly addressCountry: string;
}

export interface PoweredBy {
    /**
     * The one switch. False removes the "Powered by" line, the JSON-LD
     * parentOrganization and the staffing-form link. Caliber's name then
     * remains only in legal.copyrightHolder.
     */
    readonly show: boolean;
    readonly label: string;
    readonly name: string;
    readonly url: string;
    readonly staffingFormUrl: string;
}

export interface SiteConfig {
    readonly brandName: string;
    /** Origin only, no trailing slash. */
    readonly siteUrl: string;
    readonly allowIndex: boolean;
    readonly contact: {
        /** Split so ObfuscatedEmail can assemble the address in the browser only. */
        readonly emailUser: string;
        readonly emailDomain: string;
        /** Null until the 214 number port completes. Null renders nothing. */
        readonly phone: string | null;
    };
    readonly addresses: readonly PostalAddress[];
    readonly poweredBy: PoweredBy;
    readonly legal: {
        readonly copyrightHolder: string;
        readonly privacyUrl: string;
        readonly termsUrl: string;
    };
}

const DEV_FALLBACK_URL = "http://localhost:3000";

/**
 * Canonicals, the sitemap and the JSON-LD are all built from this, so a
 * production build without it would ship wrong URLs. It fails instead.
 */
export function resolveSiteUrl(raw: string | undefined, nodeEnv: string | undefined): string {
    const value = raw?.trim();
    if (!value) {
        if (nodeEnv === "production") {
            throw new Error(
                "NEXT_PUBLIC_SITE_URL is required for a production build, e.g. https://it.caliberbusinessresource.com",
            );
        }
        return DEV_FALLBACK_URL;
    }

    let parsed: URL;
    try {
        parsed = new URL(value);
    } catch {
        throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid URL: "${value}"`);
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        throw new Error(`NEXT_PUBLIC_SITE_URL must use http or https: "${value}"`);
    }
    return parsed.origin;
}

/** Only the exact string "true" opens the site to search engines. */
export function isIndexingAllowed(raw: string | undefined): boolean {
    return raw === "true";
}

export function formatAddress(address: PostalAddress): string {
    const region = address.postalCode ? `${address.addressRegion} ${address.postalCode}` : address.addressRegion;
    return `${address.streetAddress}, ${address.addressLocality}, ${region}`;
}

const PARENT_URL = "https://www.caliberbusinessresource.com";

export const siteConfig: SiteConfig = {
    brandName: "Caliber IT Solutions",
    // NEXT_PUBLIC_* values are fixed at build time: changing either needs a redeploy.
    siteUrl: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV),
    allowIndex: isIndexingAllowed(process.env.NEXT_PUBLIC_ALLOW_INDEX),
    contact: {
        emailUser: "info",
        emailDomain: "caliberbusinessresource.com",
        phone: null,
    },
    addresses: [
        {
            label: "United States",
            streetAddress: "254 Chapman Rd, Ste 208",
            addressLocality: "Newark",
            addressRegion: "DE",
            postalCode: "19702",
            addressCountry: "US",
        },
        {
            label: "Philippines",
            streetAddress: "Ruberen Complex",
            addressLocality: "Tagbilaran City",
            addressRegion: "Bohol",
            postalCode: null,
            addressCountry: "PH",
        },
    ],
    poweredBy: {
        show: true,
        label: "Powered by",
        name: "Caliber Business Resource",
        url: PARENT_URL,
        staffingFormUrl: `${PARENT_URL}/#connect`,
    },
    legal: {
        copyrightHolder: "Caliber Business Resource",
        privacyUrl: `${PARENT_URL}/privacy-policy/`,
        termsUrl: `${PARENT_URL}/terms-of-use/`,
    },
};

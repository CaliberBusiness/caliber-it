import { siteConfig } from "@/site.config";
import type { ClientLogo } from "./types";

/** The strip under the hero, behind showClientLogos (content/flags.ts). */
export const CLIENT_LOGOS_COPY = {
    label: "Built for",
    newTabNote: "opens in a new tab",
} as const;

/**
 * Caliber first, then the Work section's order. Built like the Caliber site's
 * Partners strip: every entry is a logo image, and any logo that isn't a wide
 * wordmark is enlarged rather than shown small. The comment on each entry is
 * where its file came from.
 */
export const CLIENT_LOGOS: readonly ClientLogo[] = [
    {
        name: siteConfig.poweredBy.name,
        url: siteConfig.poweredBy.url,
        // Caliber's own logo, the file the lockup uses.
        image: { src: "/images/logo.jpg", width: 576, height: 440 },
        enlarge: true,
    },
    {
        name: "Elevare Remote Partners",
        url: "https://elevarerp.com",
        // https://www.elevarerp.com/images/logo-header.png, unchanged.
        image: { src: "/images/clients/elevare-remote-partners.png", width: 470, height: 160 },
        enlarge: false,
    },
    {
        name: "UpVirtual",
        url: "https://upvirtual.net",
        // Supplied by Caliber as company-logo.PNG, copied unchanged.
        image: { src: "/images/clients/upvirtual.png", width: 576, height: 576 },
        enlarge: true,
    },
    {
        name: "Executives Events",
        url: "https://executivesevents.com",
        // Supplied by Caliber as ee-logo-white.jpg: white margin
        // trimmed off and saved as WebP, nothing else changed.
        image: { src: "/images/clients/executives-events.webp", width: 912, height: 524 },
        enlarge: true,
    },
    {
        name: "JCI Boholana Kisses",
        url: "https://jciboholanakisses.net",
        // https://www.jciboholanakisses.net/images/logo.jpg, saved as WebP.
        image: { src: "/images/clients/jci-boholana-kisses.webp", width: 2048, height: 2048 },
        enlarge: true,
    },
];

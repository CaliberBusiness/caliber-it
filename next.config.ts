import type { NextConfig } from "next";

/**
 * Same rule as isIndexingAllowed() in site.config.ts, read straight from the
 * environment so this file imports no app code. NEXT_PUBLIC_* values are
 * fixed at build time, so turning indexing on needs a redeploy.
 */
const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEX === "true";

/** Copied from the Caliber site's next.config.js. */
const SECURITY_HEADERS = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

/** Covers every response, including ones the robots meta tag can't reach. */
const NOINDEX_HEADER = { key: "X-Robots-Tag", value: "noindex, nofollow" };

const nextConfig: NextConfig = {
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: "/:path*",
                headers: allowIndex ? SECURITY_HEADERS : [...SECURITY_HEADERS, NOINDEX_HEADER],
            },
        ];
    },
};

export default nextConfig;

import { OG } from "@/content/og";
import { BRAND_COLORS } from "@/lib/tokens";
import type { SiteConfig } from "@/site.config";

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Key content stays inside the central 1000x525 box, so square and
 * narrower crops (LinkedIn, iMessage, Slack) don't cut it off.
 */
const SAFE_X = (OG_SIZE.width - 1000) / 2;
const SAFE_Y = Math.ceil((OG_SIZE.height - 525) / 2);

const STRIP_WIDTH = 16;
const LOGO_SIZE = 72;

/** Colours that only the share image uses; ink and gold are shared tokens. */
const OG_COLORS = {
    mint: "#7fffd4",
    body: "#4a4a4a",
    muted: "#6b6b6b",
} as const;

/** Montserrat for the brand name and headline; Inter for the rest, as on the main site. */
export const OG_FONT_FAMILY = {
    heading: "Montserrat",
    body: "Inter",
} as const;

export function ogAlt(config: SiteConfig): string {
    return `${config.brandName} — ${OG.altTail}`;
}

/** Joined with " · "; each name is kept whole, so lines break only between services. */
export function servicesLine(services: readonly string[]): string {
    return services.map((name) => name.replace(/ /g, " ")).join(" · ");
}

/** "https://it.example.com" -> "it.example.com". */
export function displayHost(siteUrl: string): string {
    return new URL(siteUrl).host;
}

interface OgCardProps {
    readonly config: SiteConfig;
    /** The logo as a data: URI, since the image renderer can't fetch relative paths. */
    readonly logoDataUri: string;
}

const footerTextStyle = {
    fontFamily: OG_FONT_FAMILY.body,
    fontSize: 24,
    color: OG_COLORS.muted,
} as const;

/** The 1200x630 share card. Plain flexbox only: the renderer supports no grid. */
export function OgCard({ config, logoDataUri }: OgCardProps) {
    const { poweredBy } = config;
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                position: "relative",
                backgroundColor: BRAND_COLORS.white,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: STRIP_WIDTH,
                    height: "100%",
                    backgroundImage: `linear-gradient(to bottom, ${OG_COLORS.mint}, ${BRAND_COLORS.gold})`,
                }}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                    padding: `${SAFE_Y}px ${SAFE_X}px`,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
                    <img
                        src={logoDataUri}
                        alt=""
                        width={LOGO_SIZE}
                        height={LOGO_SIZE}
                        style={{ objectFit: "cover" }}
                    />
                    <div
                        style={{
                            fontFamily: OG_FONT_FAMILY.heading,
                            fontWeight: 800,
                            fontSize: 40,
                            color: BRAND_COLORS.ink,
                        }}
                    >
                        {config.brandName}
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            fontFamily: OG_FONT_FAMILY.heading,
                            fontWeight: 800,
                            fontSize: 68,
                            lineHeight: 1.15,
                            letterSpacing: "-0.01em",
                            color: BRAND_COLORS.ink,
                        }}
                    >
                        <div>{OG.headline}</div>
                        <div
                            style={{
                                marginTop: 8,
                                padding: "0 14px",
                                marginLeft: -14,
                                backgroundColor: BRAND_COLORS.gold,
                            }}
                        >
                            {OG.highlight}
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: 28,
                            fontFamily: OG_FONT_FAMILY.body,
                            fontSize: 28,
                            lineHeight: 1.35,
                            // Two even lines rather than one long line and an orphan.
                            textWrap: "balance",
                            color: OG_COLORS.body,
                        }}
                    >
                        {servicesLine(OG.services)}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={footerTextStyle}>{displayHost(config.siteUrl)}</div>
                    {poweredBy.show ? (
                        <div style={footerTextStyle}>{`${poweredBy.label} ${poweredBy.name}`}</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

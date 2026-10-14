import { ImageResponse } from "next/og";
import { BRAND_COLORS } from "@/lib/tokens";
import { siteConfig } from "@/site.config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** A gold square with the brand's first letter, generated at build time. */
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: BRAND_COLORS.gold,
                    color: BRAND_COLORS.ink,
                    fontSize: 22,
                    fontWeight: 700,
                }}
            >
                {siteConfig.brandName.charAt(0)}
            </div>
        ),
        size,
    );
}

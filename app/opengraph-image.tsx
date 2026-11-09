import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { OG_FONT_FAMILY, OG_SIZE, OgCard, ogAlt } from "@/lib/og-card";
import { siteConfig } from "@/site.config";

export const alt = ogAlt(siteConfig);
export const size = OG_SIZE;
export const contentType = "image/png";

const root = process.cwd();
const fontPath = (file: string) => path.join(root, "assets", "fonts", file);

/** Static .woff files: the image renderer reads neither woff2 nor variable fonts. */
async function loadFonts() {
    const [montserrat, inter] = await Promise.all([
        readFile(fontPath("montserrat-latin-800-normal.woff")),
        readFile(fontPath("inter-latin-400-normal.woff")),
    ]);
    return [
        { name: OG_FONT_FAMILY.heading, data: montserrat, weight: 800, style: "normal" },
        { name: OG_FONT_FAMILY.body, data: inter, weight: 400, style: "normal" },
    ] as const;
}

async function loadLogoDataUri(): Promise<string> {
    const bytes = await readFile(path.join(root, "public", siteConfig.logoSrc));
    return `data:image/jpeg;base64,${bytes.toString("base64")}`;
}

export default async function OpengraphImage() {
    const [fonts, logoDataUri] = await Promise.all([loadFonts(), loadLogoDataUri()]);
    return new ImageResponse(<OgCard config={siteConfig} logoDataUri={logoDataUri} />, {
        ...size,
        fonts: [...fonts],
    });
}

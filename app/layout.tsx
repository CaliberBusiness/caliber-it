import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Montserrat, Public_Sans } from "next/font/google";
import { buildMetadata } from "@/lib/seo";
import { BRAND_COLORS } from "@/lib/tokens";
import "./globals.css";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["600", "700", "800"],
    variable: "--font-montserrat",
    display: "swap",
});

const publicSans = Public_Sans({
    subsets: ["latin"],
    variable: "--font-public-sans",
    display: "swap",
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-plex-mono",
    display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
    themeColor: BRAND_COLORS.white,
};

interface RootLayoutProps {
    readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={`${montserrat.variable} ${publicSans.variable} ${plexMono.variable}`}>
            <body>{children}</body>
        </html>
    );
}

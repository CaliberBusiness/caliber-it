import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Montserrat } from "next/font/google";
import { buildMetadata } from "@/lib/seo";
import { BRAND_COLORS } from "@/lib/tokens";
import "./globals.css";

// Same pairing as the main Caliber site: Inter for everything,
// Montserrat only for the brand wordmark.
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["600"],
    variable: "--font-montserrat",
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
        <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
            <body>{children}</body>
        </html>
    );
}

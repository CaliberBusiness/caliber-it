import type { ComponentType } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowSupportWorks } from "@/components/sections/HowSupportWorks";
import { InPractice } from "@/components/sections/InPractice";
import { Services } from "@/components/sections/Services";
import { Testimonial } from "@/components/sections/Testimonial";
import { Work } from "@/components/sections/Work";
import type { SectionProps } from "@/components/ui/Section";
import { NAV_COPY } from "@/content/nav";
import { isEnabled, visibleOnly, type Gated } from "@/lib/flags";
import { buildJsonLd, serializeJsonLd } from "@/lib/seo";

interface PageSection extends Gated {
    readonly key: string;
    readonly Component: ComponentType<SectionProps>;
}

/**
 * Page order after the hero and its logo strip. Gated sections drop out
 * entirely, and the white/paper backgrounds re-alternate around whatever is left.
 */
const SECTIONS: readonly PageSection[] = [
    { key: "services", Component: Services },
    { key: "support", Component: HowSupportWorks },
    { key: "work", Component: Work, requiresFlag: "showWork" },
    { key: "in-practice", Component: InPractice, requiresFlag: "showInPractice" },
    { key: "testimonial", Component: Testimonial, requiresFlag: "showTestimonial" },
    { key: "contact", Component: Contact },
];

export default function HomePage() {
    const sections = visibleOnly(SECTIONS);

    return (
        <>
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
            >
                {NAV_COPY.skipLink}
            </a>
            <Header />
            <main id="main">
                <Hero />
                {/* A thin white band, not a toned section, so it stays out of the alternation. */}
                {isEnabled("showClientLogos") ? <ClientLogos /> : null}
                {sections.map(({ key, Component }, index) => (
                    <Component key={key} tone={index % 2 === 0 ? "paper" : "white"} />
                ))}
            </main>
            <Footer />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd()) }}
            />
        </>
    );
}

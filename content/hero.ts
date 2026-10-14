import { NAV_CTA, SECTION_IDS } from "./nav";
import type { Link, Way } from "./types";

export const HERO = {
    headline: "Your CRM, website and IT.",
    headlineHighlight: "We build it and run it.",
    subtext:
        "Our in-house IT team sets up and maintains the systems directly — as a project, a monthly plan or a dedicated person on your team.",
    primaryCta: NAV_CTA,
    secondaryCta: { label: "See services", href: `#${SECTION_IDS.services}` } satisfies Link,
    waysTitle: "Three ways to work with us",
} as const;

/**
 * The services under each way come from the `way` on each row in
 * content/services.ts, so this panel and the ledger can't disagree.
 *
 * "Billed monthly" rather than "per seat": Email, Domains & Phones is a setup
 * fee plus monthly, so "per seat" would only be true of one of the two.
 */
export const WAYS: readonly Way[] = [
    { key: "project", name: "Project", terms: "Scoped per build" },
    { key: "monthly", name: "Monthly", terms: "Billed monthly" },
    { key: "dedicated", name: "Dedicated", terms: "Full-time, on your team" },
];

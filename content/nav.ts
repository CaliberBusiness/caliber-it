import type { Link, NavItem } from "./types";

/** Anchor ids shared by the nav and the sections, so a rename can't orphan a link. */
export const SECTION_IDS = {
    services: "services",
    support: "support",
    work: "work",
    inPractice: "in-practice",
    testimonials: "testimonials",
    contact: "contact",
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
    { label: "Services", href: `#${SECTION_IDS.services}` },
    { label: "How support works", href: `#${SECTION_IDS.support}` },
    // Gated links use the same flag as their section, so a link never points at nothing.
    { label: "Work", href: `#${SECTION_IDS.work}`, requiresFlag: "showWork" },
    { label: "In practice", href: `#${SECTION_IDS.inPractice}`, requiresFlag: "showInPractice" },
    { label: "Contact", href: `#${SECTION_IDS.contact}` },
];

export const NAV_CTA: Link = { label: "Book a free assessment", href: `#${SECTION_IDS.contact}` };

export const NAV_COPY = {
    skipLink: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    navLabel: "Primary",
} as const;

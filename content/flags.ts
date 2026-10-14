/**
 * Whole-block switches. A flag that hides a claim not yet approved for public
 * use stays false; flip it only with sign-off. The ones that are on show only
 * approved content: live projects, supplied testimonials, client logos.
 */
export type FlagKey = "showPricing" | "showInPractice" | "showTestimonial" | "showWork" | "showClientLogos";

export type Flags = Readonly<Record<FlagKey, boolean>>;

export const FLAGS: Flags = {
    // Prices also stay null in content/services.ts until agreed. Both gates
    // have to pass before a price renders.
    showPricing: false,
    // Until Chrissa approves public use of Caliber's own IT work.
    showInPractice: false,
    // The testimonials list. Holds only testimonials supplied for this site
    // (content/testimonials.ts).
    showTestimonial: true,
    // The Work section and its nav link (content/work.ts).
    showWork: true,
    // The logo strip under the hero (content/client-logos.ts).
    showClientLogos: true,
};

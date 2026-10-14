/**
 * Whole-block switches. The claim flags default to false because each hides a
 * claim that is not approved for public use yet. Flip one only with sign-off.
 * showWork and showClientLogos are the exceptions: they are on, and show only
 * live projects and client logos.
 */
export type FlagKey = "showPricing" | "showInPractice" | "showTestimonial" | "showWork" | "showClientLogos";

export type Flags = Readonly<Record<FlagKey, boolean>>;

export const FLAGS: Flags = {
    // Prices also stay null in content/services.ts until agreed. Both gates
    // have to pass before a price renders.
    showPricing: false,
    // Until Chrissa approves public use of Caliber's own IT work.
    showInPractice: false,
    // Until reuse of this testimonial on the IT site is confirmed.
    showTestimonial: false,
    // The Work section and its nav link (content/work.ts).
    showWork: true,
    // The logo strip under the hero (content/client-logos.ts).
    showClientLogos: true,
};

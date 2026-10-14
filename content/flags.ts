/**
 * Whole-block switches. Every one defaults to false because each hides a
 * claim that is not approved for public use yet. Flip one only with sign-off.
 */
export type FlagKey = "showPricing" | "showInPractice" | "showTestimonial";

export type Flags = Readonly<Record<FlagKey, boolean>>;

export const FLAGS: Flags = {
    // Prices also stay null in content/services.ts until agreed. Both gates
    // have to pass before a price renders.
    showPricing: false,
    // Until Chrissa approves public use of Caliber's own IT work.
    showInPractice: false,
    // Until reuse of this testimonial on the IT site is confirmed.
    showTestimonial: false,
};

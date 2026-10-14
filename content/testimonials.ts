import type { Testimonial } from "./types";

/** Behind showTestimonial (content/flags.ts). */
export const TESTIMONIALS_COPY = {
    label: "Clients",
    heading: "What our clients say",
    linkLabel: "Visit",
    linkNewTabNote: "opens in a new tab",
} as const;

/**
 * Excerpts exactly as the clients wrote them: "…" marks a cut, and nothing is
 * reworded or corrected. Each links to that client's project in content/work.ts.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
    {
        quote: "The GoHighLevel setup, the landing page, and the documentation were all done professionally and ahead of schedule.",
        // Supplied without a name.
        name: null,
        role: "Founder & CEO",
        company: "Caliber Business Resource",
        url: "https://landing.caliberbusinessresource.com",
    },
    {
        quote: "I absolutely love how my website turned out! It's exactly what I envisioned, and even better.",
        name: "Claire Hibaya",
        role: "Founder & CEO",
        company: "Elevare Remote Partners",
        url: "https://elevarerp.com",
    },
    {
        quote: "You didn't just build a website, you brought my vision to life in a way that exceeded my expectations. … I wouldn't hesitate to recommend you to anyone looking for a talented and reliable web developer.",
        name: "Faustine Sarah",
        role: "CEO",
        company: "Executives Events",
        url: "https://executivesevents.com",
    },
    {
        quote: "You understood our needs and delivered a clean, functional, and professional website for our organization. Highly recommended!",
        name: "Ma. Christine Torralba",
        role: "2026 President",
        company: "JCI Boholana Kisses",
        url: "https://jciboholanakisses.net",
    },
];

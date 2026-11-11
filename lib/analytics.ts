import { sendGAEvent } from "@next/third-parties/google";

/**
 * GA4 measurement ID, e.g. G-XXXXXXXXXX. NEXT_PUBLIC_* is fixed at build time,
 * so setting or changing it needs a redeploy. Unset or blank: the layout
 * renders no GA script and trackLead sends nothing.
 */
export const GA_ID: string | null = process.env.NEXT_PUBLIC_GA_ID?.trim() || null;

/** GA4's recommended event name for a captured lead. */
export const LEAD_EVENT = "generate_lead";

/**
 * Call only after /api/lead confirms the write. Analytics must never turn a
 * sent lead into an error for the visitor, so a failure is logged, not thrown.
 */
export function trackLead(service: string): void {
    if (!GA_ID) return;
    try {
        sendGAEvent("event", LEAD_EVENT, { service });
    } catch (error) {
        console.warn("GA generate_lead event failed", error);
    }
}

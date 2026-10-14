import { FORM_COPY, SERVICE_OPTIONS, TEAM_SIZES } from "@/content/contact";

/**
 * One rule set for the form and the API route. The browser runs it for quick
 * feedback; the route runs it again because that is the real boundary.
 */

export const LEAD_FIELDS = [
    "firstName",
    "lastName",
    "email",
    "companyName",
    "service",
    "teamSize",
    "currentTools",
    "message",
] as const;

export type LeadField = (typeof LEAD_FIELDS)[number];
export type LeadInput = Readonly<Record<LeadField, string>>;
export type LeadErrors = Partial<Record<LeadField, string>>;

export type LeadValidation =
    | { readonly ok: true; readonly lead: LeadInput }
    | { readonly ok: false; readonly errors: LeadErrors };

export const MAX_LENGTHS: Readonly<Record<LeadField, number>> = {
    firstName: 100,
    lastName: 100,
    email: 254,
    companyName: 150,
    service: 120,
    teamSize: 20,
    currentTools: 300,
    message: 1000,
};

export const EMPTY_LEAD: LeadInput = {
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    service: "",
    teamSize: "",
    currentTools: "",
    message: "",
};

/** Bots fill every input they find; the visible form has no such field. */
export const HONEYPOT_FIELD = "website";

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Strips anything tag-shaped, so no markup reaches the CRM or the notification
 * email. React escapes on render regardless. The Caliber form's extra
 * `on…=` and `javascript:` rules are gone: with tags already removed they
 * only mangled ordinary text such as "online = ...".
 */
export function sanitizeText(input: string): string {
    return input.replace(/<[^>]*>/g, "").trim();
}

/** Every field becomes a cleaned, length-capped string; anything else becomes "". */
export function normalizeLead(raw: unknown): LeadInput {
    const source = isRecord(raw) ? raw : {};
    const entries = LEAD_FIELDS.map((field) => {
        const value = source[field];
        const text = typeof value === "string" ? value : "";
        const cleaned = field === "email" ? text.trim() : sanitizeText(text);
        return [field, cleaned.slice(0, MAX_LENGTHS[field])] as const;
    });
    return Object.fromEntries(entries) as LeadInput;
}

function emailError(email: string): string | null {
    if (!email) return FORM_COPY.errors.emailRequired;
    return EMAIL_PATTERN.test(email) ? null : FORM_COPY.errors.emailInvalid;
}

/** Current tools is the one optional answer. */
export function findLeadErrors(lead: LeadInput): LeadErrors {
    const { errors } = FORM_COPY;
    const checks: ReadonlyArray<readonly [LeadField, string | null]> = [
        ["firstName", lead.firstName ? null : errors.firstName],
        ["lastName", lead.lastName ? null : errors.lastName],
        ["email", emailError(lead.email)],
        ["companyName", lead.companyName ? null : errors.companyName],
        ["service", SERVICE_OPTIONS.includes(lead.service) ? null : errors.service],
        ["teamSize", TEAM_SIZES.includes(lead.teamSize) ? null : errors.teamSize],
        ["message", lead.message ? null : errors.message],
    ];
    return Object.fromEntries(checks.filter(([, message]) => message !== null)) as LeadErrors;
}

export function validateLead(raw: unknown): LeadValidation {
    const lead = normalizeLead(raw);
    const errors = findLeadErrors(lead);
    return Object.keys(errors).length === 0 ? { ok: true, lead } : { ok: false, errors };
}

export function isHoneypotFilled(raw: unknown): boolean {
    if (!isRecord(raw)) return false;
    const value = raw[HONEYPOT_FIELD];
    return typeof value === "string" && value.trim() !== "";
}

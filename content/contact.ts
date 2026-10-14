import { ALL_SERVICE_NAMES } from "./services";

export const CONTACT_SECTION = {
    label: "Contact",
    heading: "Tell us what you're running now.",
    body: "We'll reply with what we'd set up first and what it would take.",
    staffingText: "Looking to hire staff instead?",
    staffingLabel: "Use the staffing form",
} as const;

/** Dropdown order: the free assessment, the five services, then this. */
export const NOT_SURE = "Not sure yet";

export const SERVICE_OPTIONS: readonly string[] = [...ALL_SERVICE_NAMES, NOT_SURE];

/**
 * En dashes, deliberately. If a GHL dropdown is created for team size, its
 * options must match these strings exactly.
 */
export const TEAM_SIZES: readonly string[] = ["1–4", "5–20", "21–50", "51+"];

export const FORM_COPY = {
    labels: {
        firstName: "First name",
        lastName: "Last name",
        email: "Work email",
        companyName: "Company",
        service: "Service",
        teamSize: "Team size",
        currentTools: "Current tools",
        message: "What isn't working?",
    },
    optional: "(optional)",
    servicePlaceholder: "Select a service",
    teamSizePlaceholder: "Select team size",
    currentToolsPlaceholder: "e.g. HubSpot, Wix, spreadsheets",
    honeypotLabel: "Leave this field empty",
    submit: "Book a free assessment",
    submitting: "Sending…",
    cooldownPrefix: "Please wait",
    consentPrefix: "By submitting, you agree to our",
    consentLink: "Privacy Policy",
    success: "Thanks — we've got it. We'll be in touch shortly.",
    failure: "Something went wrong. Please try again, or email us directly.",
    errors: {
        firstName: "First name is required",
        lastName: "Last name is required",
        emailRequired: "Work email is required",
        emailInvalid: "Please enter a valid email address",
        companyName: "Company is required",
        service: "Please select a service",
        teamSize: "Please select a team size",
        message: "Please tell us what isn't working",
    },
} as const;

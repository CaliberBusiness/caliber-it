import { NAV_CTA } from "./nav";
import type { ServiceId, ServiceRow, WayKey } from "./types";

export const SERVICES_SECTION = {
    label: "Services",
    heading: "We keep your IT running, and build what you're missing.",
    intro:
        "Monthly plans cover the day-to-day. Projects cover new systems. Not sure where you stand? Start with an assessment.",
} as const;

export const ASSESSMENT = {
    label: "Start here",
    title: "Free IT Assessment",
    body: "A 30-minute call, then a written checklist of what to fix first.",
    cta: NAV_CTA,
} as const;

export const SERVICE_ROWS: readonly ServiceRow[] = [
    {
        id: "helpdesk",
        name: "Managed Helpdesk",
        line: "Day-to-day support for your staff, wherever they log in from.",
        bullets: [
            "Helpdesk requests",
            "Daily pre-shift systems checks",
            "Device health and updates",
            "Microsoft 365 and Google Workspace accounts",
            "Onboarding and offboarding access",
            "Three-level escalation",
        ],
        billing: "Monthly, per seat",
        way: "monthly",
        price: null,
        highlighted: false,
    },
    {
        id: "email-phones",
        name: "Email, Domains & Phones",
        line: "Business email that lands in the inbox, and US numbers that work from any desk.",
        bullets: [
            "DNS management",
            "SPF, DKIM and DMARC",
            "Domain transfers and dedicated sending domains",
            "VoIP numbers and softphones",
            "Number porting",
            "Calls logged to your CRM",
        ],
        billing: "Setup fee + monthly",
        way: "monthly",
        price: null,
        highlighted: false,
    },
    {
        id: "crm",
        name: "CRM & Automation",
        line: "Every lead captured, tracked and followed up automatically.",
        bullets: [
            "GoHighLevel setup",
            "Pipelines and lead forms",
            "Website and Messenger chatbots",
            "Follow-up sequences and reporting",
            "Integrations between your apps",
        ],
        billing: "Project, scoped per build",
        way: "project",
        price: null,
        highlighted: false,
    },
    {
        id: "web-apps",
        name: "Web & App Development",
        line: "Websites and apps, from a landing page to a client portal.",
        bullets: [
            "Websites and landing pages",
            "Booking and inquiry systems",
            "Web apps and client portals",
            "iOS and Android apps",
            "SEO-ready and mobile-optimized",
        ],
        billing: "Project, scoped per build",
        way: "project",
        price: null,
        highlighted: false,
    },
    {
        id: "dedicated-va",
        name: "Dedicated IT VA",
        line: "A full-time IT person from our team, working your hours inside your tools.",
        bullets: [
            "Works your shift",
            "Handles helpdesk, accounts and updates",
            "Runs the daily systems check",
            "Backed by our IT lead for escalations",
        ],
        billing: "Monthly, full-time",
        way: "dedicated",
        price: null,
        highlighted: true,
    },
];

/** Every service on offer, in page order: the free assessment, then the five rows. */
export const ALL_SERVICE_NAMES: readonly string[] = [ASSESSMENT.title, ...SERVICE_ROWS.map((row) => row.name)];

export function servicesForWay(way: WayKey): string[] {
    return SERVICE_ROWS.filter((row) => row.way === way).map((row) => row.name);
}

/** Throws on an unknown id, so a broken reference fails the build instead of rendering blank. */
export function serviceName(id: ServiceId): string {
    const row = SERVICE_ROWS.find((candidate) => candidate.id === id);
    if (!row) {
        throw new Error(`Unknown service id: ${id}`);
    }
    return row.name;
}

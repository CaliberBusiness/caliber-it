import type { WorkGroup } from "./types";

/** The whole section and its nav link are behind showWork (content/flags.ts). */
export const WORK_COPY = {
    label: "Work",
    heading: "Projects we've built.",
    visitLabel: "Visit",
    newTabNote: "opens in a new tab",
} as const;

/**
 * Names, lines, tags, stacks and URLs are copied word for word from the
 * CaliberBusiness portfolio (lib/it-solutions.ts). Reword nothing here. A
 * project with no public URL or no description stays off the page, and
 * tests/work.test.ts lists projects that must never be added.
 */
export const WORK_GROUPS: readonly WorkGroup[] = [
    {
        key: "caliber",
        label: "Built for Caliber",
        note: null,
        projects: [
            {
                name: "Consultation landing page",
                built: ["Landing page whose form creates the lead, assigns it to a rep and alerts the team."],
                tags: ["Websites", "CRM & Automation"],
                stack: "GoHighLevel",
                url: "https://landing.caliberbusinessresource.com",
            },
        ],
    },
    {
        key: "it-lead",
        label: "Built by our IT lead",
        // Never relabel these "our clients" or "Caliber clients": they were
        // delivered before and outside Caliber.
        note: "Projects delivered before and outside Caliber.",
        projects: [
            {
                name: "Elevare Remote Partners",
                built: [
                    "Company website",
                    "Applicant qualification platform with separate agent and VA flows",
                    "Responses synced to Google Sheets with instant hot-lead email alerts",
                ],
                tags: ["Websites", "Integrations"],
                stack: "Next.js · Supabase · Tailwind · Google Sheets API",
                url: "https://elevarerp.com",
            },
            {
                name: "UpVirtual",
                built: [
                    "Full agency website",
                    "Five service pages plus a cloud services page",
                    "Discovery-call booking built in",
                ],
                tags: ["Websites"],
                stack: "Next.js · TypeScript · Tailwind · Vercel",
                url: "https://upvirtual.net",
            },
            {
                name: "Executives Events",
                built: [
                    "Single-page site for a corporate events firm serving Asia-Pacific",
                    "15 services and 4 case studies",
                    "Structured data, sitemap and booking via Cal.com and Formspree",
                ],
                tags: ["Websites"],
                stack: "Next.js · Framer Motion · Tailwind · Vercel",
                url: "https://executivesevents.com",
            },
            {
                name: "JCI Boholana Kisses",
                built: [
                    "Digital souvenir magazine for a JCI chapter in Bohol",
                    "Community projects, board and messages from 12 chapters",
                    "Static export with search schema",
                ],
                tags: ["Websites"],
                stack: "Next.js · TypeScript · CSS Modules · Vercel",
                url: "https://jciboholanakisses.net",
            },
        ],
    },
];

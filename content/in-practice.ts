import type { InPracticeRow } from "./types";

/** The whole section is behind showInPractice (content/flags.ts). */
export const IN_PRACTICE = {
    label: "In practice",
    heading: "We run Caliber's IT first.",
    intro: "Every service we sell runs on our own team first. Here's what we fixed.",
    columns: {
        problem: "Problem",
        action: "What we did",
        service: "Service",
    },
} as const;

export const IN_PRACTICE_ROWS: readonly InPracticeRow[] = [
    {
        problem: "Marketing email landed in spam, and the sending account got suspended.",
        action:
            "Moved DNS to Cloudflare and set up a dedicated sending domain with SPF, DKIM and DMARC. The suspension was lifted and campaigns now send from a verified domain.",
        service: "email-phones",
    },
    {
        problem: "The business line was a consumer Skype number.",
        action:
            "Replaced it with a US business number on a VoIP line. Staff call from softphones on their phones and laptops, with caller ID verified in the CRM.",
        service: "email-phones",
    },
    {
        problem: "Website leads needed tracking from first contact to close.",
        action:
            "Every form submission now lands in a seven-stage pipeline, is assigned to a person and triggers an alert. Imported lead lists are deduplicated automatically.",
        service: "crm",
    },
    {
        problem: "Facebook inquiries needed answers outside office hours.",
        action:
            "A Messenger chatbot handles job applications, service questions and directions. Every comment gets a public reply and a private message.",
        service: "crm",
    },
    {
        problem: "An aging laptop fleet had to stay reliable every shift.",
        action:
            "A written pre-shift systems check, plus audit scripts for Mac and Windows that record encryption, updates, antivirus and disk space for each machine.",
        service: "helpdesk",
    },
];

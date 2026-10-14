import type { EscalationLevel, PreShiftStep, SeatStatus } from "./types";

export const SUPPORT_COPY = {
    label: "How support works",
    heading: "Every seat is ready before the shift starts.",
    preShiftTitle: "Pre-shift checks",
    seatStatusTitle: "Seat status",
    escalationTitle: "Escalation",
    coverageLabel: "Coverage hours",
} as const;

export const PRE_SHIFT_STEPS: readonly PreShiftStep[] = [
    {
        time: "60 min before",
        body: "Power on every workstation, verify network and internet speed, test the phone system.",
    },
    {
        time: "45 min before",
        body: "Log in to CRM, email, scheduling and chat tools; test headset audio and camera.",
    },
    {
        time: "30 min before",
        body: "Fix anything still open, mark every seat Ready, tell operations the shift is clear.",
    },
];

export const SEAT_STATUSES: readonly SeatStatus[] = [
    { label: "Ready", tone: "ready", description: "Fully working" },
    { label: "Needs attention", tone: "attention", description: "Minor issue, staff can still work" },
    { label: "Critical", tone: "critical", description: "Can't start the shift until fixed" },
];

export const ESCALATION_LEVELS: readonly EscalationLevel[] = [
    { level: "Level 1", who: "IT support", handles: "Password resets, headsets, browsers, printers" },
    { level: "Level 2", who: "Systems administrator", handles: "Network outages, VPN, domain sign-in, servers" },
    { level: "Level 3", who: "Vendor", handles: "Software platform, carrier or ISP outages" },
];

/** Null until coverage hours are approved. Null renders nothing. */
export const COVERAGE_HOURS: string | null = null;

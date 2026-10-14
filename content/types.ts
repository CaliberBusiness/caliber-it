import type { FlagKey } from "./flags";

export interface Link {
    readonly label: string;
    readonly href: string;
}

export interface NavItem extends Link {
    readonly requiresFlag?: FlagKey;
}

/** The three engagement models in the hero's "Three ways" ledger. */
export type WayKey = "project" | "monthly" | "dedicated";

export interface Way {
    readonly key: WayKey;
    readonly name: string;
    readonly terms: string;
}

export type ServiceId = "helpdesk" | "email-phones" | "crm" | "web-apps" | "dedicated-va";

export interface ServiceRow {
    readonly id: ServiceId;
    readonly name: string;
    readonly line: string;
    readonly bullets: readonly string[];
    readonly billing: string;
    readonly way: WayKey;
    /** Null until approved. Renders only when showPricing is on as well. */
    readonly price: string | null;
    readonly highlighted: boolean;
}

export interface PreShiftStep {
    readonly time: string;
    readonly body: string;
}

export type StatusTone = "ready" | "attention" | "critical";

export interface SeatStatus {
    readonly label: string;
    readonly tone: StatusTone;
    readonly description: string;
}

export interface EscalationLevel {
    readonly level: string;
    readonly who: string;
    readonly handles: string;
}

export interface InPracticeRow {
    readonly problem: string;
    readonly action: string;
    readonly service: ServiceId;
}

export type WorkTag = "Websites" | "CRM & Automation" | "Integrations" | "IT support";

export interface WorkProject {
    readonly name: string;
    /** What was built, one claim per line, exactly as worded at the source. */
    readonly built: readonly string[];
    readonly tags: readonly WorkTag[];
    readonly stack: string;
    /** Absolute https URL of the live project. */
    readonly url: string;
}

export interface WorkGroup {
    readonly key: string;
    readonly label: string;
    /** One line under the label. Null renders nothing. */
    readonly note: string | null;
    readonly projects: readonly WorkProject[];
}

export interface ImageFile {
    /** Under public/. */
    readonly src: string;
    /** The file's pixel size, for its aspect ratio. */
    readonly width: number;
    readonly height: number;
}

export interface ClientLogo {
    /** Also the logo's alt text. */
    readonly name: string;
    /** Absolute https URL of the client's project. */
    readonly url: string;
    readonly image: ImageFile;
    /** Drawn larger: square and stacked logos read small at the wordmark height. */
    readonly enlarge: boolean;
}

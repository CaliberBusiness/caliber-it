import type { LeadInput } from "./validate";

/**
 * GoHighLevel contact payload for the IT form.
 *
 * Service, team size and current tools have no GHL custom fields yet. Until
 * their IDs are set, each answer is folded into the message as a labelled
 * line, so nothing is lost. Setting GHL_FIELD_IT_SERVICE,
 * GHL_FIELD_IT_TEAM_SIZE or GHL_FIELD_IT_CURRENT_TOOLS moves that answer into
 * its own field with no code change.
 */

export const GHL_ENDPOINT = "https://services.leadconnectorhq.com/contacts/upsert";
export const GHL_API_VERSION = "2021-07-28";

/** "it-lead" only, so IT leads stay out of the staffing workflows. */
export const LEAD_SOURCE = "IT site";
export const LEAD_TAGS: readonly string[] = ["it-lead"];

/**
 * The message field Caliber's staffing form already writes to (lib/ghl-fields.ts
 * in the Caliber repo). Not a secret. Override with GHL_FIELD_MESSAGE when
 * pointing at a different GHL sub-account.
 */
export const DEFAULT_MESSAGE_FIELD_ID = "AUL2fZm9cCG38MRVWlxl";

type FoldableField = "service" | "teamSize" | "currentTools";

/** Order here is the order the lines appear in the message. */
const FOLDABLE: ReadonlyArray<{ readonly field: FoldableField; readonly label: string }> = [
    { field: "service", label: "Service" },
    { field: "teamSize", label: "Team size" },
    { field: "currentTools", label: "Current tools" },
];

export interface GhlFieldIds {
    readonly message: string;
    readonly service: string;
    readonly teamSize: string;
    readonly currentTools: string;
}

export interface GhlCustomField {
    readonly id: string;
    readonly value: string;
}

export interface GhlContactPayload {
    readonly locationId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly companyName: string;
    readonly source: string;
    readonly tags: readonly string[];
    readonly customFields: readonly GhlCustomField[];
}

type Env = Readonly<Record<string, string | undefined>>;

export function readGhlFieldIds(env: Env): GhlFieldIds {
    const read = (key: string): string => env[key]?.trim() ?? "";
    return {
        message: read("GHL_FIELD_MESSAGE") || DEFAULT_MESSAGE_FIELD_ID,
        service: read("GHL_FIELD_IT_SERVICE"),
        teamSize: read("GHL_FIELD_IT_TEAM_SIZE"),
        currentTools: read("GHL_FIELD_IT_CURRENT_TOOLS"),
    };
}

/** The message, plus a labelled line for each answer without a field of its own. */
export function composeMessage(lead: LeadInput, ids: GhlFieldIds): string {
    const lines = FOLDABLE.filter(({ field }) => ids[field] === "" && lead[field] !== "").map(
        ({ field, label }) => `${label}: ${lead[field]}`,
    );
    return lines.length === 0 ? lead.message : `${lead.message}\n\n${lines.join("\n")}`;
}

/** GHL rejects blank custom values, so unmapped IDs and empty answers are dropped. */
export function buildCustomFields(lead: LeadInput, ids: GhlFieldIds): GhlCustomField[] {
    const candidates: readonly GhlCustomField[] = [
        { id: ids.message, value: composeMessage(lead, ids) },
        ...FOLDABLE.map(({ field }) => ({ id: ids[field], value: lead[field] })),
    ];
    return candidates.filter((field) => field.id !== "" && field.value !== "");
}

export function buildGhlPayload(lead: LeadInput, locationId: string, ids: GhlFieldIds): GhlContactPayload {
    return {
        locationId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        companyName: lead.companyName,
        source: LEAD_SOURCE,
        tags: LEAD_TAGS,
        customFields: buildCustomFields(lead, ids),
    };
}

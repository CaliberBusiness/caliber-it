import { NextResponse } from "next/server";
import { GHL_API_VERSION, GHL_ENDPOINT, buildGhlPayload, readGhlFieldIds } from "@/lib/lead/ghl";
import { isHoneypotFilled, isRecord, validateLead, type LeadInput } from "@/lib/lead/validate";

/**
 * POST /api/lead: the contact form's destination.
 *
 * Ported from the Caliber site's /api/it-lead, with the same order: GHL first
 * and fatal, Formspree second and non-fatal. The lead is safe in the CRM
 * before the email notification goes out.
 *
 * Request and response bodies are never logged: they carry names, emails and
 * free text.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Shared with Caliber's site forms. `formName` tells them apart in the inbox. */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqjnnwv";
const FORMSPREE_FORM_NAME = "IT site";
const OUTBOUND_TIMEOUT_MS = 8000;

/** Generous for eight short fields. Anything bigger is not a form submission. */
const MAX_BODY_CHARS = 16 * 1024;
const TOO_LARGE = Symbol("too-large");

interface ApiResult {
    readonly ok: boolean;
    readonly error?: string;
}

function fail(status: number, error: string): NextResponse<ApiResult> {
    return NextResponse.json({ ok: false, error }, { status });
}

async function postJson(url: string, headers: Readonly<Record<string, string>>, body: unknown): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), OUTBOUND_TIMEOUT_MS);
    try {
        return await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Caps the body before parsing it. Content-Length can be missing or wrong,
 * so the text itself is measured too. Returns null for anything not JSON.
 */
async function readBody(request: Request): Promise<unknown> {
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (declared > MAX_BODY_CHARS) return TOO_LARGE;

    const raw = await request.text().catch(() => "");
    if (raw.length > MAX_BODY_CHARS) return TOO_LARGE;

    try {
        return JSON.parse(raw) as unknown;
    } catch {
        return null;
    }
}

/** Only GHL's traceId is read, for correlation. The body echoes the lead. */
async function readTraceId(response: Response): Promise<string> {
    try {
        const parsed: unknown = await response.json();
        return isRecord(parsed) && typeof parsed.traceId === "string" ? parsed.traceId : "unknown";
    } catch {
        return "unknown";
    }
}

async function notifyFormspree(lead: LeadInput): Promise<void> {
    try {
        const response = await postJson(FORMSPREE_ENDPOINT, {}, { formName: FORMSPREE_FORM_NAME, ...lead });
        if (!response.ok) {
            console.error(`[lead] Formspree notification failed: status=${response.status}`);
        }
    } catch {
        console.error("[lead] Formspree notification failed: unreachable");
    }
}

export async function POST(request: Request): Promise<NextResponse<ApiResult>> {
    const body = await readBody(request);
    if (body === TOO_LARGE) return fail(413, "Request too large.");
    if (!isRecord(body)) return fail(400, "Malformed request.");

    // Answer a bot with success so it learns nothing, but write nowhere.
    if (isHoneypotFilled(body)) {
        console.warn("[lead] bot hit: honeypot filled");
        return NextResponse.json({ ok: true });
    }

    const checked = validateLead(body);
    if (!checked.ok) return fail(400, "Please check the form and try again.");

    const token = process.env.GHL_PIT;
    const locationId = process.env.GHL_LOCATION_ID;
    if (!token || !locationId) {
        console.error("[lead] GHL_PIT or GHL_LOCATION_ID is not configured; refusing to send.");
        return fail(500, "Form is not configured. Please email us directly.");
    }

    const payload = buildGhlPayload(checked.lead, locationId, readGhlFieldIds(process.env));
    let ghlResponse: Response;
    try {
        ghlResponse = await postJson(
            GHL_ENDPOINT,
            { Authorization: `Bearer ${token}`, Version: GHL_API_VERSION },
            payload,
        );
    } catch (error: unknown) {
        const reason = error instanceof Error && error.name === "AbortError" ? "timeout" : "network error";
        console.error(`[lead] GHL unreachable (${reason})`);
        return fail(502, "We could not submit your details. Please try again.");
    }

    if (!ghlResponse.ok) {
        const traceId = await readTraceId(ghlResponse);
        console.error(`[lead] GHL rejected contact: status=${ghlResponse.status} traceId=${traceId}`);
        return fail(502, "We could not submit your details. Please try again.");
    }

    await notifyFormspree(checked.lead);
    return NextResponse.json({ ok: true });
}

/** The form is POST-only; anything else is a probe. */
export async function GET(): Promise<NextResponse<ApiResult>> {
    return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
}

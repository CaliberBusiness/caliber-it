import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/lead/route";

const VALID = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  companyName: "Analytical Engines",
  service: "Managed Helpdesk",
  teamSize: "5–20",
  currentTools: "Google Workspace",
  message: "Laptops keep dropping off the VPN.",
};

function post(body: unknown): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function ok(): Response {
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

function sentBody(call: Parameters<typeof fetch> | undefined): Record<string, unknown> {
  const init = call?.[1];
  return JSON.parse(typeof init?.body === "string" ? init.body : "{}") as Record<string, unknown>;
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubEnv("GHL_PIT", "test-token");
  vi.stubEnv("GHL_LOCATION_ID", "loc-123");
  vi.stubEnv("GHL_FIELD_MESSAGE", "");
  vi.stubEnv("GHL_FIELD_IT_SERVICE", "");
  vi.stubEnv("GHL_FIELD_IT_TEAM_SIZE", "");
  vi.stubEnv("GHL_FIELD_IT_CURRENT_TOOLS", "");
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/lead", () => {
  it("sends a valid lead to GHL tagged it-lead, then notifies Formspree", async () => {
    fetchMock.mockResolvedValue(ok());

    const response = await POST(post(VALID));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [ghlCall, formspreeCall] = fetchMock.mock.calls;
    expect(String(ghlCall?.[0])).toBe("https://services.leadconnectorhq.com/contacts/upsert");
    expect(ghlCall?.[1]?.headers).toMatchObject({ Authorization: "Bearer test-token" });
    expect(sentBody(ghlCall)).toMatchObject({ locationId: "loc-123", source: "IT site", tags: ["it-lead"] });
    expect(String(formspreeCall?.[0])).toContain("formspree.io");
    expect(sentBody(formspreeCall)).toMatchObject({ formName: "IT site", email: "ada@example.com" });
  });

  it("answers a bot with success but sends nothing", async () => {
    const response = await POST(post({ ...VALID, website: "http://spam.example" }));
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized body before parsing it", async () => {
    const response = await POST(post({ ...VALID, message: "x".repeat(20_000) }));
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed body", async () => {
    const response = await POST(post("{not json"));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid lead without calling out", async () => {
    const response = await POST(post({ ...VALID, teamSize: "lots" }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses to send when GHL is not configured", async () => {
    vi.stubEnv("GHL_PIT", "");
    const response = await POST(post(VALID));
    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails the request, and skips Formspree, when GHL rejects the contact", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ traceId: "t-1" }), { status: 422 }));
    const response = await POST(post(VALID));
    expect(response.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails the request when GHL is unreachable", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    const response = await POST(post(VALID));
    expect(response.status).toBe(502);
  });

  it("still succeeds when only the Formspree email fails", async () => {
    fetchMock.mockResolvedValueOnce(ok()).mockRejectedValueOnce(new TypeError("fetch failed"));
    const response = await POST(post(VALID));
    expect(response.status).toBe(200);
  });
});

describe("GET /api/lead", () => {
  it("is not allowed", async () => {
    const response = await GET();
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });
});

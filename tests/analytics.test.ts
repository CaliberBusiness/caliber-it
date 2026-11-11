import { afterEach, describe, expect, it, vi } from "vitest";

const { sendGAEvent } = vi.hoisted(() => ({ sendGAEvent: vi.fn() }));
vi.mock("@next/third-parties/google", () => ({ sendGAEvent }));

/** GA_ID is read when the module loads, so each case loads it fresh. */
async function loadWith(gaId: string | undefined) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GA_ID", gaId);
  return import("@/lib/analytics");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  sendGAEvent.mockReset();
});

describe("GA_ID", () => {
  it("is null when unset or blank, so no GA script renders", async () => {
    expect((await loadWith(undefined)).GA_ID).toBeNull();
    expect((await loadWith("   ")).GA_ID).toBeNull();
  });

  it("is the trimmed measurement ID when set", async () => {
    expect((await loadWith(" G-TEST123 ")).GA_ID).toBe("G-TEST123");
  });
});

describe("trackLead", () => {
  it("sends nothing without a GA ID", async () => {
    const { trackLead } = await loadWith(undefined);
    trackLead("Managed Helpdesk");
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("sends generate_lead with the selected service", async () => {
    const { trackLead } = await loadWith("G-TEST123");
    trackLead("Managed Helpdesk");
    expect(sendGAEvent).toHaveBeenCalledWith("event", "generate_lead", { service: "Managed Helpdesk" });
  });

  it("never throws, so a sent lead still shows as sent", async () => {
    sendGAEvent.mockImplementation(() => {
      throw new Error("blocked");
    });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { trackLead } = await loadWith("G-TEST123");
    expect(() => trackLead("Managed Helpdesk")).not.toThrow();
    expect(warn).toHaveBeenCalledOnce();
  });
});

import { describe, expect, it } from "vitest";
import {
  DEFAULT_MESSAGE_FIELD_ID,
  buildCustomFields,
  buildGhlPayload,
  composeMessage,
  readGhlFieldIds,
} from "@/lib/lead/ghl";
import { normalizeLead } from "@/lib/lead/validate";

const LEAD = normalizeLead({
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  companyName: "Analytical Engines",
  service: "Managed Helpdesk",
  teamSize: "5–20",
  currentTools: "Google Workspace",
  message: "Laptops keep dropping off the VPN.",
});

const NO_CUSTOM_FIELDS = readGhlFieldIds({});

describe("readGhlFieldIds", () => {
  it("defaults the message field to Caliber's existing one and leaves the rest blank", () => {
    expect(NO_CUSTOM_FIELDS).toEqual({
      message: DEFAULT_MESSAGE_FIELD_ID,
      service: "",
      teamSize: "",
      currentTools: "",
    });
  });

  it("reads overrides from the environment, ignoring blank values", () => {
    const ids = readGhlFieldIds({
      GHL_FIELD_MESSAGE: "  ",
      GHL_FIELD_IT_SERVICE: "svc-1",
      GHL_FIELD_IT_TEAM_SIZE: "size-1",
      GHL_FIELD_IT_CURRENT_TOOLS: "tools-1",
    });
    expect(ids).toEqual({ message: DEFAULT_MESSAGE_FIELD_ID, service: "svc-1", teamSize: "size-1", currentTools: "tools-1" });
  });
});

describe("composeMessage", () => {
  it("folds every unmapped answer into the message as a labelled line", () => {
    expect(composeMessage(LEAD, NO_CUSTOM_FIELDS)).toBe(
      "Laptops keep dropping off the VPN.\n\nService: Managed Helpdesk\nTeam size: 5–20\nCurrent tools: Google Workspace",
    );
  });

  it("leaves out answers that have their own field, and empty answers", () => {
    const ids = { ...NO_CUSTOM_FIELDS, service: "svc-1" };
    const lead = { ...LEAD, currentTools: "" };
    expect(composeMessage(lead, ids)).toBe("Laptops keep dropping off the VPN.\n\nTeam size: 5–20");
  });

  it("returns the bare message when nothing needs folding", () => {
    const ids = { ...NO_CUSTOM_FIELDS, service: "a", teamSize: "b", currentTools: "c" };
    expect(composeMessage(LEAD, ids)).toBe("Laptops keep dropping off the VPN.");
  });
});

describe("buildCustomFields", () => {
  it("sends only the message field until the IT fields exist", () => {
    const fields = buildCustomFields(LEAD, NO_CUSTOM_FIELDS);
    expect(fields).toHaveLength(1);
    expect(fields[0]?.id).toBe(DEFAULT_MESSAGE_FIELD_ID);
  });

  it("uses each IT field automatically once its ID is set", () => {
    const ids = { ...NO_CUSTOM_FIELDS, service: "svc-1", teamSize: "size-1" };
    expect(buildCustomFields(LEAD, ids)).toEqual([
      { id: DEFAULT_MESSAGE_FIELD_ID, value: "Laptops keep dropping off the VPN.\n\nCurrent tools: Google Workspace" },
      { id: "svc-1", value: "Managed Helpdesk" },
      { id: "size-1", value: "5–20" },
    ]);
  });
});

describe("buildGhlPayload", () => {
  it("tags the contact it-lead only, with source 'IT site'", () => {
    const payload = buildGhlPayload(LEAD, "loc-123", NO_CUSTOM_FIELDS);
    expect(payload).toMatchObject({
      locationId: "loc-123",
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      companyName: "Analytical Engines",
      source: "IT site",
      tags: ["it-lead"],
    });
  });
});

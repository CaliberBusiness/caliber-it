import { describe, expect, it } from "vitest";
import {
  MAX_LENGTHS,
  findLeadErrors,
  isHoneypotFilled,
  normalizeLead,
  sanitizeText,
  validateLead,
} from "@/lib/lead/validate";

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

describe("sanitizeText", () => {
  it("strips anything tag-shaped, then trims", () => {
    expect(sanitizeText("  <b>Hi</b> <img src=x onerror=alert(1)> there ")).toBe("Hi  there");
  });

  it("leaves ordinary text alone", () => {
    const text = "We're online = mostly; condition=5; javascript: came up in the audit";
    expect(sanitizeText(text)).toBe(text);
  });
});

describe("normalizeLead", () => {
  it("turns missing and non-string fields into empty strings", () => {
    const lead = normalizeLead({ firstName: 42, lastName: null });
    expect(lead.firstName).toBe("");
    expect(lead.lastName).toBe("");
    expect(lead.message).toBe("");
  });

  it("treats a non-object body as empty", () => {
    expect(normalizeLead("nope").email).toBe("");
  });

  it("trims and caps every field at its max length", () => {
    const lead = normalizeLead({ ...VALID, message: `  ${"x".repeat(5000)}  ` });
    expect(lead.message).toHaveLength(MAX_LENGTHS.message);
  });
});

describe("findLeadErrors", () => {
  it("accepts a complete lead, with current tools optional", () => {
    expect(findLeadErrors(normalizeLead({ ...VALID, currentTools: "" }))).toEqual({});
  });

  it("flags every missing required field", () => {
    const errors = findLeadErrors(normalizeLead({}));
    expect(Object.keys(errors).sort()).toEqual(
      ["companyName", "email", "firstName", "lastName", "message", "service", "teamSize"].sort(),
    );
  });

  it("rejects a malformed email", () => {
    expect(findLeadErrors(normalizeLead({ ...VALID, email: "ada@" }))).toHaveProperty("email");
  });

  it("rejects a service or team size that is not one of the options", () => {
    const errors = findLeadErrors(normalizeLead({ ...VALID, service: "Crypto mining", teamSize: "1-4" }));
    expect(errors).toHaveProperty("service");
    expect(errors).toHaveProperty("teamSize");
  });

  it("accepts every listed team size", () => {
    for (const teamSize of ["1–4", "5–20", "21–50", "51+"]) {
      expect(findLeadErrors(normalizeLead({ ...VALID, teamSize }))).toEqual({});
    }
  });
});

describe("validateLead", () => {
  it("returns the normalized lead when valid", () => {
    const result = validateLead({ ...VALID, firstName: "  Ada  " });
    expect(result.ok).toBe(true);
    expect(result.ok && result.lead.firstName).toBe("Ada");
  });

  it("returns the field errors when invalid", () => {
    const result = validateLead({ ...VALID, email: "" });
    expect(result.ok).toBe(false);
    expect(!result.ok && Object.keys(result.errors)).toEqual(["email"]);
  });
});

describe("isHoneypotFilled", () => {
  it("is true only when the hidden field has content", () => {
    expect(isHoneypotFilled({ website: "http://spam.example" })).toBe(true);
    expect(isHoneypotFilled({ website: "   " })).toBe(false);
    expect(isHoneypotFilled({})).toBe(false);
    expect(isHoneypotFilled(null)).toBe(false);
  });
});

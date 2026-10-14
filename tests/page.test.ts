import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHome, sectionOrder } from "./support/html";

afterEach(() => {
  vi.doUnmock("@/content/flags");
  vi.resetModules();
});

describe("home page order", () => {
  it("puts the logo strip directly under the hero", async () => {
    expect(sectionOrder(await renderHome())).toEqual([
      "hero-heading",
      "clients-label",
      "services",
      "support",
      "work",
      "contact",
    ]);
  });
});

describe("showClientLogos", () => {
  it("drops the logo strip when off, leaving the rest of the page", async () => {
    const order = sectionOrder(await renderHome({ showClientLogos: false }));
    expect(order).not.toContain("clients-label");
    expect(order).toContain("services");
  });
});

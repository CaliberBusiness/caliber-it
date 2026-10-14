import { describe, expect, it } from "vitest";
import { FLAGS, type Flags } from "@/content/flags";
import { isEnabled, priceToShow, visibleOnly } from "@/lib/flags";

const ALL_ON: Flags = {
  showPricing: true,
  showInPractice: true,
  showTestimonial: true,
  showWork: true,
  showClientLogos: true,
};

describe("FLAGS", () => {
  it("keeps unapproved claims off and the approved proof on", () => {
    expect(FLAGS).toEqual({
      showPricing: false,
      showInPractice: false,
      showTestimonial: false,
      showWork: true,
      showClientLogos: true,
    });
  });
});

describe("isEnabled", () => {
  it("treats an item with no flag as always visible", () => {
    expect(isEnabled(undefined)).toBe(true);
  });

  it("follows the flag when one is set", () => {
    expect(isEnabled("showInPractice")).toBe(false);
    expect(isEnabled("showInPractice", ALL_ON)).toBe(true);
  });
});

describe("visibleOnly", () => {
  const items = [
    { id: "always" },
    { id: "gated", requiresFlag: "showInPractice" as const },
  ];

  it("drops gated items while their flag is off", () => {
    expect(visibleOnly(items).map((item) => item.id)).toEqual(["always"]);
  });

  it("keeps them once the flag is on, without mutating the input", () => {
    expect(visibleOnly(items, ALL_ON).map((item) => item.id)).toEqual(["always", "gated"]);
    expect(items).toHaveLength(2);
  });
});

describe("priceToShow", () => {
  it("hides a real price while showPricing is off", () => {
    expect(priceToShow("$99")).toBeNull();
  });

  it("hides a null price even with showPricing on", () => {
    expect(priceToShow(null, ALL_ON)).toBeNull();
  });

  it("shows the price only when both gates pass", () => {
    expect(priceToShow("$99", ALL_ON)).toBe("$99");
  });
});

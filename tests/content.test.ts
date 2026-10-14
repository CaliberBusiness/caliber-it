import { describe, expect, it } from "vitest";
import * as contact from "@/content/contact";
import * as footer from "@/content/footer";
import * as hero from "@/content/hero";
import * as inPractice from "@/content/in-practice";
import * as nav from "@/content/nav";
import * as seo from "@/content/seo";
import * as services from "@/content/services";
import * as support from "@/content/support";
import * as testimonial from "@/content/testimonial";
import * as work from "@/content/work";
import { siteConfig } from "@/site.config";

/** Every string reachable from a value, functions skipped. */
function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value !== null && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

const ALL_COPY = collectStrings([
  contact, footer, hero, inPractice, nav, seo, services, support, testimonial, work, siteConfig,
]);

describe("copy hygiene", () => {
  it("contains no placeholder or TODO text", () => {
    const offenders = ALL_COPY.filter((text) => /\[PRICE|\[confirm|TODO|TBD|lorem/i.test(text));
    expect(offenders).toEqual([]);
  });

  it("uses US spelling", () => {
    const british = /optimis|organis|prioritis|customis|enquir|ageing|colour|centre|behaviour|licence|catalogue/i;
    expect(ALL_COPY.filter((text) => british.test(text))).toEqual([]);
  });
});

describe("services", () => {
  it("has five ledger rows with Dedicated IT VA highlighted", () => {
    expect(services.SERVICE_ROWS.map((row) => row.name)).toEqual([
      "Managed Helpdesk",
      "Email, Domains & Phones",
      "CRM & Automation",
      "Web & App Development",
      "Dedicated IT VA",
    ]);
    expect(services.SERVICE_ROWS.filter((row) => row.highlighted).map((row) => row.name)).toEqual(["Dedicated IT VA"]);
  });

  it("keeps every price null until approved", () => {
    expect(services.SERVICE_ROWS.every((row) => row.price === null)).toBe(true);
  });

  it("bills Email, Domains & Phones as setup fee plus monthly", () => {
    const row = services.SERVICE_ROWS.find((r) => r.id === "email-phones");
    expect(row?.billing).toBe("Setup fee + monthly");
  });

  it("gives every way in the hero at least one service", () => {
    for (const way of hero.WAYS) {
      expect(services.servicesForWay(way.key).length).toBeGreaterThan(0);
    }
  });
});

describe("contact options", () => {
  it("offers the six services plus 'Not sure yet'", () => {
    expect(contact.SERVICE_OPTIONS).toEqual([
      "Free IT Assessment",
      "Managed Helpdesk",
      "Email, Domains & Phones",
      "CRM & Automation",
      "Web & App Development",
      "Dedicated IT VA",
      "Not sure yet",
    ]);
  });

  it("offers the four team sizes", () => {
    expect(contact.TEAM_SIZES).toEqual(["1–4", "5–20", "21–50", "51+"]);
  });
});

describe("in practice", () => {
  it("has five rows, each pointing at a real service", () => {
    expect(inPractice.IN_PRACTICE_ROWS).toHaveLength(5);
    for (const row of inPractice.IN_PRACTICE_ROWS) {
      expect(() => services.serviceName(row.service)).not.toThrow();
    }
  });
});

describe("navigation", () => {
  it("only links to anchors a section actually uses", () => {
    const ids = Object.values(nav.SECTION_IDS).map((id) => `#${id}`);
    for (const item of [...nav.NAV_ITEMS, nav.NAV_CTA]) {
      expect(ids).toContain(item.href);
    }
  });

  it("hides the In practice link behind the same flag as the section", () => {
    const link = nav.NAV_ITEMS.find((item) => item.href === `#${nav.SECTION_IDS.inPractice}`);
    expect(link?.requiresFlag).toBe("showInPractice");
  });

  it("hides the Work link behind the same flag as the section", () => {
    const link = nav.NAV_ITEMS.find((item) => item.href === `#${nav.SECTION_IDS.work}`);
    expect(link?.label).toBe("Work");
    expect(link?.requiresFlag).toBe("showWork");
  });
});

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Testimonials } from "@/components/sections/Testimonials";
import type { Testimonial } from "@/content/types";
import { TESTIMONIALS, TESTIMONIALS_COPY } from "@/content/testimonials";
import { WORK_GROUPS } from "@/content/work";
import { attribute, visibleText } from "./support/html";

/** Exactly as supplied by the clients. "…" marks a cut in the original. */
const SUPPLIED: readonly Testimonial[] = [
  {
    quote:
      "The GoHighLevel setup, the landing page, and the documentation were all done professionally and ahead of schedule.",
    name: null,
    role: "Founder & CEO",
    company: "Caliber Business Resource",
    url: "https://landing.caliberbusinessresource.com",
  },
  {
    quote: "I absolutely love how my website turned out! It's exactly what I envisioned, and even better.",
    name: "Claire Hibaya",
    role: "Founder & CEO",
    company: "Elevare Remote Partners",
    url: "https://elevarerp.com",
  },
  {
    quote:
      "You didn't just build a website, you brought my vision to life in a way that exceeded my expectations. … I wouldn't hesitate to recommend you to anyone looking for a talented and reliable web developer.",
    name: "Faustine Sarah",
    role: "CEO",
    company: "Executives Events",
    url: "https://executivesevents.com",
  },
  {
    quote:
      "You understood our needs and delivered a clean, functional, and professional website for our organization. Highly recommended!",
    name: "Ma. Christine Torralba",
    role: "2026 President",
    company: "JCI Boholana Kisses",
    url: "https://jciboholanakisses.net",
  },
];

/** Test-only items, to cover a missing link. Never shipped. */
const FIXTURES: readonly Testimonial[] = [
  { quote: "Fixture quote one.", name: "Fixture One", role: "Role One", company: "Company One", url: "https://example.com/one" },
  { quote: "Fixture quote two.", name: null, role: "Role Two", company: "Company Two", url: null },
];

describe("testimonials content", () => {
  it("holds exactly the four supplied excerpts, word for word", () => {
    expect(TESTIMONIALS).toEqual(SUPPLIED);
  });

  it("keeps the ellipsis that marks a cut, as a single … character", () => {
    expect(TESTIMONIALS[2]?.quote).toContain("expectations. … I wouldn't");
    expect(TESTIMONIALS.some((item) => item.quote.includes("..."))).toBe(false);
  });

  it("invents no name where none was given", () => {
    expect(TESTIMONIALS[0]?.name).toBeNull();
  });

  it("links each testimonial to that client's project in the Work section", () => {
    const workUrls = new Set(WORK_GROUPS.flatMap((group) => group.projects).map((project) => project.url));
    for (const item of TESTIMONIALS) expect(workUrls, item.company).toContain(item.url);
  });

  it("is labelled 'Clients' and headed 'What our clients say'", () => {
    expect(TESTIMONIALS_COPY.label).toBe("Clients");
    expect(TESTIMONIALS_COPY.heading).toBe("What our clients say");
  });
});

describe("Testimonials section", () => {
  const html = renderToStaticMarkup(createElement(Testimonials, { tone: "white" }));
  const text = visibleText(html);
  const figures = html.match(/<figure\b[\s\S]*?<\/figure>/g) ?? [];

  it("is labelled by its visible heading, with the 'Clients' label above it", () => {
    expect(html).toMatch(/^<section id="testimonials" aria-labelledby="testimonials-heading"/);
    expect(html).toMatch(/<p class="[^"]*">Clients<\/p><h2 id="testimonials-heading"[^>]*>What our clients say<\/h2>/);
  });

  it("lists the quotes two to a row from md up", () => {
    expect(html).toMatch(/<ul role="list" class="[^"]*\bgrid\b[^"]*\bmd:grid-cols-2\b/);
    expect(figures).toHaveLength(SUPPLIED.length);
  });

  it("shows every quote verbatim, in curly quotes", () => {
    for (const item of SUPPLIED) expect(text).toContain(`“${item.quote}”`);
  });

  it("credits each quote with name, role and company, and no name line where none was given", () => {
    SUPPLIED.forEach((item, i) => {
      const caption = visibleText(figures[i]?.match(/<figcaption[\s\S]*<\/figcaption>/)?.[0] ?? "");
      expect(caption).toContain(`${item.role}, ${item.company}`);
      if (item.name) expect(caption).toContain(item.name);
    });
    expect(figures[0]).not.toContain('<span class="block font-semibold text-ink">');
    expect(figures[1]).toContain('<span class="block font-semibold text-ink">Claire Hibaya</span>');
  });

  it("links each quote to its project in a new tab", () => {
    const links = html.match(/<a\s[^>]*>/g) ?? [];
    expect(links.map((tag) => attribute(tag, "href"))).toEqual(SUPPLIED.map((item) => item.url));
    for (const tag of links) {
      expect(attribute(tag, "target")).toBe("_blank");
      expect(attribute(tag, "rel")).toBe("noopener noreferrer");
    }
    for (const item of SUPPLIED) {
      expect(html).toContain(`<span class="sr-only"> ${item.company.replace(/&/g, "&amp;")} (opens in a new tab)</span>`);
    }
  });
});

describe("Testimonials without a link or a name", () => {
  afterEach(() => {
    vi.doUnmock("@/content/testimonials");
    vi.resetModules();
  });

  it("renders only the links and names that exist", async () => {
    vi.resetModules();
    vi.doMock("@/content/testimonials", async (importOriginal) => ({
      ...(await importOriginal<typeof import("@/content/testimonials")>()),
      TESTIMONIALS: FIXTURES,
    }));
    const { Testimonials: WithFixtures } = await import("@/components/sections/Testimonials");
    const html = renderToStaticMarkup(createElement(WithFixtures, { tone: "white" }));

    const links = html.match(/<a\s[^>]*>/g) ?? [];
    expect(links.map((tag) => attribute(tag, "href"))).toEqual(["https://example.com/one"]);
    expect(visibleText(html)).toContain("Fixture One");
    expect(visibleText(html)).toContain("Role Two, Company Two");
  });
});

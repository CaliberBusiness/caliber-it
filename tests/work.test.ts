import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Work } from "@/components/sections/Work";
import { FLAGS } from "@/content/flags";
import { WORK_COPY, WORK_GROUPS } from "@/content/work";

const PROJECTS = WORK_GROUPS.flatMap((group) => group.projects);

/**
 * Must never be listed: not built by Caliber or its IT lead, concept only,
 * never approved, or not shipped. Carried over from the source portfolio.
 */
const EXCLUDED = [
  "Filipina Pea",
  "Borongan",
  "Kofi Chapters",
  "DARBC",
  "PrimeNest",
  "Yeshua",
  "AkountPH",
  "LeadFlow",
  "AAMS",
];

/** Text a visitor sees: tags stripped, the entities React escapes decoded. */
function visibleText(html: string): string {
  return html
    .replace(/<span class="sr-only">.*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function attribute(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
}

describe("work content", () => {
  it("lists the five live projects, in source order", () => {
    expect(PROJECTS.map((project) => project.name)).toEqual([
      "Consultation landing page",
      "Elevare Remote Partners",
      "UpVirtual",
      "Executives Events",
      "JCI Boholana Kisses",
    ]);
  });

  it("gives every project an https URL, a description, tags and a stack", () => {
    for (const project of PROJECTS) {
      expect(project.url).toMatch(/^https:\/\/[^\s/]+/);
      expect(project.built.length).toBeGreaterThan(0);
      expect(project.built.every((line) => line.trim().length > 0)).toBe(true);
      expect(project.tags.length).toBeGreaterThan(0);
      expect(project.stack.trim()).not.toBe("");
    }
  });

  it("keeps the IT lead's projects labeled as delivered outside Caliber", () => {
    const group = WORK_GROUPS.find((g) => g.label === "Built by our IT lead");
    expect(group?.note).toBe("Projects delivered before and outside Caliber.");
  });

  it("never lists an excluded project", () => {
    const names = PROJECTS.map((project) => project.name).join("\n");
    for (const excluded of EXCLUDED) {
      expect(names).not.toContain(excluded);
    }
  });
});

describe("Work section", () => {
  const html = renderToStaticMarkup(createElement(Work, { tone: "white" }));
  const text = visibleText(html);

  it("renders the heading, labelled by its id", () => {
    expect(html).toContain('id="work"');
    expect(html).toContain('aria-labelledby="work-heading"');
    expect(html).toMatch(/<h2 id="work-heading"[^>]*>Projects we&#x27;ve built\.<\/h2>/);
    expect(WORK_COPY.heading).toBe("Projects we've built.");
  });

  it("renders one row per project, with its description, stack and tags", () => {
    expect(html.match(/<h4/g)).toHaveLength(PROJECTS.length);
    for (const project of PROJECTS) {
      expect(text).toContain(project.name);
      expect(text).toContain(project.stack);
      for (const line of project.built) expect(text).toContain(line);
      for (const tag of project.tags) expect(text).toContain(tag);
    }
  });

  it("gives each project one Visit link that opens in a new tab", () => {
    const links = html.match(/<a\s[^>]*>/g) ?? [];
    expect(links.map((tag) => attribute(tag, "href"))).toEqual(PROJECTS.map((project) => project.url));
    for (const tag of links) {
      expect(attribute(tag, "target")).toBe("_blank");
      expect(attribute(tag, "rel")).toBe("noopener noreferrer");
    }
    expect(text.match(/Visit ↗/g)).toHaveLength(PROJECTS.length);
  });

  it("names the project and the new tab for screen readers", () => {
    for (const project of PROJECTS) {
      expect(html).toContain(`<span class="sr-only"> ${project.name.replace(/&/g, "&amp;")} (opens in a new tab)</span>`);
    }
  });

  it("shows group labels, and no screenshots or logos", () => {
    for (const group of WORK_GROUPS) expect(text).toContain(group.label);
    expect(html).not.toMatch(/<(img|picture|svg)\b/);
  });
});

describe("showWork flag", () => {
  afterEach(() => {
    vi.doUnmock("@/content/flags");
    vi.resetModules();
  });

  /** Renders the real page with showWork forced, so the section and nav wiring are both covered. */
  async function renderHome(showWork: boolean): Promise<string> {
    vi.resetModules();
    vi.doMock("@/content/flags", () => ({ FLAGS: { ...FLAGS, showWork } }));
    const { default: HomePage } = await import("@/app/page");
    return renderToStaticMarkup(createElement(HomePage));
  }

  it("renders the section and its nav links when on", async () => {
    const html = await renderHome(true);
    expect(html).toContain('id="work"');
    // Desktop nav and mobile menu.
    expect(html.match(/href="#work"/g)).toHaveLength(2);
  });

  it("places Work after How support works and before Contact", async () => {
    const html = await renderHome(true);
    const order = ["support", "work", "contact"].map((id) => html.indexOf(`<section id="${id}"`));
    expect(order.every((index) => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("drops both the section and the nav links when off, leaving the rest of the page", async () => {
    const html = await renderHome(false);
    expect(html).not.toContain('id="work"');
    expect(html).not.toContain('href="#work"');
    expect(html).toContain('id="contact"');
  });
});

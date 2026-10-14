import { existsSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Lockup } from "@/components/brand/Lockup";
import { PoweredBy } from "@/components/brand/PoweredBy";
import { siteConfig } from "@/site.config";

const root = process.cwd();

describe("PoweredBy", () => {
  it("draws the parent link in ink with a solid underline, not a faded or default color", () => {
    const html = renderToStaticMarkup(createElement(PoweredBy));
    const link = html.match(/<a\s[^>]*>/)?.[0] ?? "";
    const classes = /class="([^"]*)"/.exec(link)?.[1]?.split(" ") ?? [];
    expect(classes).toEqual(expect.arrayContaining(["text-ink", "underline", "decoration-ink"]));
    expect(classes.some((c) => /^decoration-ink\/\d+$/.test(c))).toBe(false);
  });
});

describe("Lockup", () => {
  const html = renderToStaticMarkup(createElement(Lockup));

  it("links to the top of the page", () => {
    expect(html).toMatch(/^<a href="#top"/);
  });

  it("shows the Caliber logo beside the brand name", () => {
    // next/image serves it through the optimizer, so the path arrives URL-encoded.
    expect(html).toContain(`url=${encodeURIComponent(siteConfig.logoSrc)}`);
    expect(html).toContain(`>${siteConfig.brandName}</a>`);
  });

  it("marks the logo decorative, so screen readers hear the name once", () => {
    expect(html).toMatch(/<img [^>]*alt=""/);
  });
});

describe("logo files", () => {
  it("ships the logo the lockup points at", () => {
    expect(existsSync(path.join(root, "public", siteConfig.logoSrc))).toBe(true);
  });

  it("uses Caliber's own favicon set instead of a generated icon", () => {
    for (const file of ["favicon.ico", "icon.png", "apple-icon.png"]) {
      expect(existsSync(path.join(root, "app", file))).toBe(true);
    }
    expect(existsSync(path.join(root, "app", "icon.tsx"))).toBe(false);
  });
});

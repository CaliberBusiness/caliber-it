import { existsSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OG } from "@/content/og";
import { buildMetadata } from "@/lib/seo";
import { OG_SIZE, OgCard, displayHost, ogAlt, servicesLine } from "@/lib/og-card";
import { siteConfig, type SiteConfig } from "@/site.config";

const LIVE: SiteConfig = { ...siteConfig, siteUrl: "https://it.example.com" };
const STANDALONE: SiteConfig = { ...LIVE, poweredBy: { ...LIVE.poweredBy, show: false } };
const LOGO = "data:image/jpeg;base64,AA==";

const render = (config: SiteConfig) => renderToStaticMarkup(createElement(OgCard, { config, logoDataUri: LOGO }));

describe("OG image", () => {
  it("is the standard 1200x630 share size", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
  });

  it("builds its alt text from the brand name", () => {
    expect(ogAlt(LIVE)).toBe("Caliber IT Solutions — Managed IT, CRM & Web Development");
  });

  it("shows the domain without the scheme", () => {
    expect(displayHost("https://it.caliberbusinessresource.com")).toBe("it.caliberbusinessresource.com");
  });

  it("draws the brand, headline, services and domain", () => {
    const html = render(LIVE);
    for (const text of [LIVE.brandName, OG.headline, OG.highlight, "it.example.com"]) {
      expect(html).toContain(text);
    }
    expect(html).toContain(servicesLine(OG.services).replace(/&/g, "&amp;"));
    expect(html).toContain(LOGO);
  });

  it("only lets the services line break between services", () => {
    const line = servicesLine(["CRM & Automation", "Web & App Development"]);
    expect(line).toBe("CRM & Automation · Web & App Development");
  });

  it("shows the Powered by line only while poweredBy.show is on", () => {
    expect(render(LIVE)).toContain(`Powered by ${LIVE.poweredBy.name}`);
    expect(render(STANDALONE)).not.toContain("Powered by");
  });

  it("ships the font files the image loads", () => {
    for (const file of ["montserrat-latin-800-normal.woff", "inter-latin-400-normal.woff"]) {
      expect(existsSync(path.join(process.cwd(), "assets", "fonts", file))).toBe(true);
    }
  });

  it("uses the large Twitter card to match the wide image", () => {
    expect(buildMetadata(LIVE).twitter).toMatchObject({ card: "summary_large_image" });
  });
});

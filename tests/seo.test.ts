import { describe, expect, it } from "vitest";
import { buildJsonLd, buildMetadata, buildRobots, buildSitemap, pageTitle, serializeJsonLd } from "@/lib/seo";
import { siteConfig, type SiteConfig } from "@/site.config";

const LIVE: SiteConfig = { ...siteConfig, siteUrl: "https://it.example.com", allowIndex: true };
const STANDALONE: SiteConfig = { ...LIVE, poweredBy: { ...LIVE.poweredBy, show: false } };

describe("pageTitle", () => {
  it("leads with the brand name from config", () => {
    expect(pageTitle(LIVE)).toBe("Caliber IT Solutions — Managed IT, CRM & Web Development");
  });
});

describe("buildMetadata", () => {
  it("is noindex until indexing is allowed", () => {
    expect(buildMetadata(siteConfig).robots).toEqual({ index: false, follow: false });
    expect(buildMetadata(LIVE).robots).toEqual({ index: true, follow: true });
  });

  it("builds the canonical from siteUrl", () => {
    const metadata = buildMetadata(LIVE);
    expect(metadata.metadataBase?.toString()).toBe("https://it.example.com/");
    expect(metadata.alternates?.canonical).toBe("/");
  });
});

describe("buildRobots", () => {
  it("lets crawlers in, so they can see the noindex, but lists no sitemap before launch", () => {
    const robots = buildRobots(siteConfig);
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(robots.sitemap).toBeUndefined();
  });

  it("lists the sitemap once indexing is allowed", () => {
    expect(buildRobots(LIVE).sitemap).toBe("https://it.example.com/sitemap.xml");
  });
});

describe("buildSitemap", () => {
  it("lists the one page, with no invented dates", () => {
    const sitemap = buildSitemap(LIVE);
    expect(sitemap).toHaveLength(1);
    expect(sitemap[0]?.url).toBe("https://it.example.com/");
    expect(sitemap[0]?.lastModified).toBeUndefined();
  });
});

describe("buildJsonLd", () => {
  it("describes a ProfessionalService with Caliber as parent organization", () => {
    expect(buildJsonLd(LIVE)).toMatchObject({
      "@type": "ProfessionalService",
      name: "Caliber IT Solutions",
      url: "https://it.example.com/",
      parentOrganization: { "@type": "Organization", name: "Caliber Business Resource" },
    });
  });

  it("drops the parent organization when poweredBy is off", () => {
    expect(buildJsonLd(STANDALONE)).not.toHaveProperty("parentOrganization");
  });

  it("lists all six services and makes no unbacked claims", () => {
    const data = buildJsonLd(LIVE);
    const serialized = JSON.stringify(data);
    expect(serialized.match(/"@type":"Service"/g)).toHaveLength(6);
    for (const key of ["aggregateRating", "review", "telephone", "foundingDate", "priceRange", "email"]) {
      expect(data).not.toHaveProperty(key);
    }
  });

  it("never invents a postal code for the Philippines address", () => {
    const serialized = JSON.stringify(buildJsonLd(LIVE));
    expect(serialized).toContain('"postalCode":"19702"');
    expect(serialized.match(/postalCode/g)).toHaveLength(1);
  });
});

describe("serializeJsonLd", () => {
  it("escapes '<' so the data cannot close the script tag", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});

import { describe, expect, it } from "vitest";
import { formatAddress, isIndexingAllowed, resolveSiteUrl, siteConfig } from "@/site.config";

describe("resolveSiteUrl", () => {
  it("returns the bare origin, dropping any trailing slash", () => {
    expect(resolveSiteUrl("https://it.example.com/", "production")).toBe("https://it.example.com");
  });

  it("fails a production build when the URL is missing or blank", () => {
    expect(() => resolveSiteUrl(undefined, "production")).toThrow(/NEXT_PUBLIC_SITE_URL/);
    expect(() => resolveSiteUrl("   ", "production")).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("falls back to localhost outside production", () => {
    expect(resolveSiteUrl(undefined, "development")).toBe("http://localhost:3000");
    expect(resolveSiteUrl(undefined, "test")).toBe("http://localhost:3000");
  });

  it("rejects values that are not http(s) URLs", () => {
    expect(() => resolveSiteUrl("it.example.com", "production")).toThrow(/valid URL/);
    expect(() => resolveSiteUrl("ftp://it.example.com", "production")).toThrow(/http or https/);
  });
});

describe("isIndexingAllowed", () => {
  it("is true only for the exact string 'true'", () => {
    expect(isIndexingAllowed("true")).toBe(true);
    expect(isIndexingAllowed("TRUE")).toBe(false);
    expect(isIndexingAllowed("1")).toBe(false);
    expect(isIndexingAllowed(undefined)).toBe(false);
  });
});

describe("formatAddress", () => {
  it("matches the Caliber footer and never invents a postal code", () => {
    const [us, ph] = siteConfig.addresses;
    expect(us && formatAddress(us)).toBe("254 Chapman Rd, Ste 208, Newark, DE 19702");
    expect(ph && formatAddress(ph)).toBe("Ruberen Complex, Tagbilaran City, Bohol");
  });
});

describe("siteConfig defaults", () => {
  it("keeps the phone out until the 214 port completes", () => {
    expect(siteConfig.contact.phone).toBeNull();
  });

  it("shows the powered-by line, naming Caliber Business Resource", () => {
    expect(siteConfig.poweredBy).toMatchObject({
      show: true,
      name: "Caliber Business Resource",
      url: "https://www.caliberbusinessresource.com",
    });
  });

  it("points the legal links at Caliber's existing pages", () => {
    expect(siteConfig.legal.privacyUrl).toBe("https://www.caliberbusinessresource.com/privacy-policy/");
    expect(siteConfig.legal.termsUrl).toBe("https://www.caliberbusinessresource.com/terms-of-use/");
  });

  it("is not indexable unless NEXT_PUBLIC_ALLOW_INDEX is set", () => {
    expect(siteConfig.allowIndex).toBe(false);
  });
});

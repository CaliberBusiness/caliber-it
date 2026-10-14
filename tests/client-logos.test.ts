import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { CLIENT_LOGOS, CLIENT_LOGOS_COPY } from "@/content/client-logos";
import { WORK_GROUPS } from "@/content/work";
import { attribute } from "./support/html";

const byName = (name: string) => CLIENT_LOGOS.find((logo) => logo.name === name);

function classesOf(tag: string): string[] {
  return attribute(tag, "class")?.split(" ") ?? [];
}

/** Copied from the Caliber site's Partners strip: each set three times, then the whole run twice. */
const TRACK_LENGTH = CLIENT_LOGOS.length * 3 * 2;

describe("client logos content", () => {
  it("lists the five clients in Work's order, Caliber first", () => {
    expect(CLIENT_LOGOS.map((logo) => logo.name)).toEqual([
      "Caliber Business Resource",
      "Elevare Remote Partners",
      "UpVirtual",
      "Executives Events",
      "JCI Boholana Kisses",
    ]);
  });

  it("uses each client's own logo file", () => {
    expect(CLIENT_LOGOS.map((logo) => logo.image)).toEqual([
      { src: "/images/logo.jpg", width: 576, height: 440 },
      { src: "/images/clients/elevare-remote-partners.png", width: 470, height: 160 },
      { src: "/images/clients/upvirtual.png", width: 576, height: 576 },
      { src: "/images/clients/executives-events.webp", width: 912, height: 524 },
      { src: "/images/clients/jci-boholana-kisses.webp", width: 2048, height: 2048 },
    ]);
  });

  it("enlarges every logo that isn't a wide wordmark, as the Caliber site does for icon marks", () => {
    for (const logo of CLIENT_LOGOS) {
      expect(logo.enlarge, logo.name).toBe(logo.image.width < 2 * logo.image.height);
    }
    expect(CLIENT_LOGOS.filter((logo) => !logo.enlarge).map((logo) => logo.name)).toEqual(["Elevare Remote Partners"]);
  });

  it("names every client file by slug, as svg, png or webp, and ships it", () => {
    for (const { image } of CLIENT_LOGOS) {
      if (image.src !== "/images/logo.jpg") {
        expect(image.src).toMatch(/^\/images\/clients\/[a-z0-9-]+\.(svg|png|webp)$/);
      }
      expect(existsSync(path.join(process.cwd(), "public", image.src)), image.src).toBe(true);
    }
  });

  it("links Caliber to its site and every other client to its Work entry's URL", () => {
    expect(byName("Caliber Business Resource")?.url).toBe("https://www.caliberbusinessresource.com");
    const workUrls = new Map(WORK_GROUPS.flatMap((group) => group.projects).map((p) => [p.name, p.url]));
    for (const logo of CLIENT_LOGOS.slice(1)) expect(logo.url).toBe(workUrls.get(logo.name));
  });
});

describe("marquee animation", () => {
  const css = readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");

  it("loops one half of the track every 60 seconds, like the Caliber site", () => {
    expect(css).toContain("--animate-marquee: marquee 60s linear infinite;");
    expect(css).toMatch(/@keyframes marquee\s*\{[^}]*translateX\(0\)[^}]*\}[^}]*translateX\(-50%\)/);
  });
});

describe("ClientLogos strip", () => {
  const html = renderToStaticMarkup(createElement(ClientLogos));
  const items = html.match(/<li\b[^>]*>/g) ?? [];
  const links = html.match(/<a\s[^>]*>/g) ?? [];
  const images = html.match(/<img\s[^>]*>/g) ?? [];
  const track = html.match(/<ul [^>]*>/)?.[0] ?? "";

  it("is labelled 'Built for', centered above the logos", () => {
    expect(CLIENT_LOGOS_COPY.label).toBe("Built for");
    expect(html).toMatch(/^<section [^>]*aria-labelledby="clients-label"/);
    expect(html).toMatch(/<p id="clients-label" class="[^"]*\btext-center\b[^"]*">Built for<\/p>/);
  });

  it("scrolls the logos in a seamless loop, inside a clipped window", () => {
    expect(html).toMatch(/<div class="[^"]*\bgroup\/marquee\b[^"]*\boverflow-hidden\b/);
    expect(classesOf(track)).toEqual(
      expect.arrayContaining(["flex", "w-max", "animate-marquee", "items-center", "gap-20", "sm:gap-24"]),
    );
    expect(items).toHaveLength(TRACK_LENGTH);
    expect(links.map((tag) => attribute(tag, "href"))).toEqual(
      Array.from({ length: TRACK_LENGTH }, (_, i) => CLIENT_LOGOS[i % CLIENT_LOGOS.length]?.url),
    );
  });

  it("pauses on hover and while a logo has keyboard focus", () => {
    expect(classesOf(track)).toEqual(
      expect.arrayContaining([
        "group-hover/marquee:[animation-play-state:paused]",
        "group-focus-within/marquee:[animation-play-state:paused]",
      ]),
    );
  });

  it("stands still for reduced motion, showing each client once in a centered row", () => {
    expect(classesOf(track)).toEqual(
      expect.arrayContaining(["motion-reduce:animate-none", "motion-reduce:w-auto", "motion-reduce:flex-wrap", "motion-reduce:justify-center"]),
    );
    for (const tag of items.slice(CLIENT_LOGOS.length)) expect(classesOf(tag)).toContain("motion-reduce:hidden");
  });

  it("exposes each client once to screen readers and the keyboard; the repeats are hidden", () => {
    items.forEach((tag, i) => {
      const repeat = i >= CLIENT_LOGOS.length;
      expect(attribute(tag, "aria-hidden"), `item ${i}`).toBe(repeat ? "true" : undefined);
    });
    links.forEach((tag, i) => {
      expect(attribute(tag, "tabindex"), `link ${i}`).toBe(i >= CLIENT_LOGOS.length ? "-1" : undefined);
    });
    expect(html.match(/\(opens in a new tab\)/g)).toHaveLength(CLIENT_LOGOS.length);
  });

  it("opens every link in a new tab", () => {
    for (const tag of links) {
      expect(attribute(tag, "target")).toBe("_blank");
      expect(attribute(tag, "rel")).toBe("noopener noreferrer");
    }
  });

  it("names each logo for its client", () => {
    expect(images.slice(0, CLIENT_LOGOS.length).map((tag) => attribute(tag, "alt"))).toEqual(
      CLIENT_LOGOS.map((logo) => logo.name),
    );
  });

  it("sizes logos like the Caliber site: 40/48px, or 64/80px when enlarged", () => {
    CLIENT_LOGOS.forEach((logo, i) => {
      const classes = classesOf(images[i] ?? "");
      const size = logo.enlarge ? ["h-16", "sm:h-20"] : ["h-10", "sm:h-12"];
      expect(classes, logo.name).toEqual(expect.arrayContaining([...size, "w-auto", "object-contain"]));
    });
  });

  it("shows every logo in grayscale, in color on hover or focus", () => {
    for (const tag of images) {
      expect(classesOf(tag)).toEqual(
        expect.arrayContaining(["grayscale", "group-hover/logo:grayscale-0", "group-focus-visible/logo:grayscale-0"]),
      );
    }
  });

  it("blends each logo into the white strip, so a logo's own white backing never shows as a box", () => {
    for (const tag of images) expect(classesOf(tag)).toContain("mix-blend-multiply");
  });
});

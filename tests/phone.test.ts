import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHome } from "./support/html";

afterEach(() => {
  vi.doUnmock("@/content/flags");
  vi.resetModules();
});

const PHONE_LINK = /<a href="tel:\+14693818804"[^>]*>\+1 \(469\) 381-8804<\/a>/g;

describe("phone number", () => {
  it("is a tel: link in the contact section and in the footer", async () => {
    const html = await renderHome();
    const positions = [...html.matchAll(PHONE_LINK)].map((match) => match.index);
    const contactStart = html.indexOf('<section id="contact"');
    const footerStart = html.indexOf("<footer");

    expect(positions).toHaveLength(2);
    expect(positions[0]).toBeGreaterThan(contactStart);
    expect(positions[0]).toBeLessThan(footerStart);
    expect(positions[1]).toBeGreaterThan(footerStart);
  });
});

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { vi } from "vitest";
import { FLAGS, type Flags } from "@/content/flags";

/** One attribute's value from a single opening tag. */
export function attribute(tag: string, name: string): string | undefined {
  return new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
}

/** Text a visitor sees: screen-reader-only spans and tags stripped, React's entities decoded. */
export function visibleText(html: string): string {
  return html
    .replace(/<span class="sr-only">.*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

/**
 * Renders the real home page with some flags forced, so section and nav
 * wiring are tested together. Pair with vi.doUnmock("@/content/flags").
 */
export async function renderHome(overrides: Partial<Flags> = {}): Promise<string> {
  vi.resetModules();
  vi.doMock("@/content/flags", () => ({ FLAGS: { ...FLAGS, ...overrides } }));
  const { default: HomePage } = await import("@/app/page");
  return renderToStaticMarkup(createElement(HomePage));
}

/** Every <section> in page order, named by its id, else its aria-labelledby. */
export function sectionOrder(html: string): string[] {
  return (html.match(/<section\s[^>]*>/g) ?? []).map(
    (tag) => attribute(tag, "id") ?? attribute(tag, "aria-labelledby") ?? "?",
  );
}

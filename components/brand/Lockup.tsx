import { siteConfig } from "@/site.config";

/**
 * A text lockup built from config, with no logo file, so a rename is one edit.
 * "#top" with no matching id is the HTML-spec way to scroll to the top of the
 * document. Don't give the sticky header that id: a stuck header already
 * counts as in view, so the jump would do nothing.
 */
export function Lockup() {
    return (
        <a
            href="#top"
            className="inline-flex items-center gap-2.5 font-heading text-base font-extrabold tracking-tight text-ink sm:text-lg"
        >
            <span aria-hidden="true" className="block h-3.5 w-3.5 shrink-0 bg-gold" />
            {siteConfig.brandName}
        </a>
    );
}

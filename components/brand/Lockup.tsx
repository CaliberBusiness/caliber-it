import Image from "next/image";
import { siteConfig } from "@/site.config";

/** The logo fills this square; 64px source covers it at 2x. */
const LOGO_SOURCE_SIZE = 64;

/**
 * The Caliber logo beside the brand name, both from config, so a rename is
 * one edit. The logo is decorative (alt=""): the name is the link text.
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
            <Image
                src={siteConfig.logoSrc}
                alt=""
                width={LOGO_SOURCE_SIZE}
                height={LOGO_SOURCE_SIZE}
                className="h-7 w-7 shrink-0 object-cover sm:h-8 sm:w-8"
            />
            {siteConfig.brandName}
        </a>
    );
}

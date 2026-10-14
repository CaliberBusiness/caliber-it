import Image from "next/image";
import { CONTAINER, MONO_LABEL } from "@/components/ui/styles";
import { CLIENT_LOGOS, CLIENT_LOGOS_COPY } from "@/content/client-logos";
import type { ClientLogo } from "@/content/types";

const LABEL_ID = "clients-label";

/** Logo heights copied from the Caliber site's Partners strip. `px` is the sm-and-up height. */
const DEFAULT_SIZE = { classes: "h-10 sm:h-12", px: 48 };
const ENLARGED_SIZE = { classes: "h-16 sm:h-20", px: 80 };

/** Repeat the set until one half of the track outruns the viewport, so the loop never shows a gap. */
const SET_REPEAT = 3;

/**
 * The strip under the hero, rendered only while showClientLogos is on
 * (app/page.tsx). A marquee like the Caliber site's: two identical halves,
 * shifted by one half (animate-marquee in globals.css). It pauses on hover
 * and keyboard focus, and with reduced motion it stands still and shows each
 * client once. Only the first set is exposed to screen readers and the keyboard.
 */
export function ClientLogos() {
    const half = Array.from({ length: SET_REPEAT }).flatMap(() => CLIENT_LOGOS);
    const track = [...half, ...half];

    return (
        <section aria-labelledby={LABEL_ID} className="border-t border-ink bg-white">
            <div className={`${CONTAINER} py-10 sm:py-12`}>
                <p id={LABEL_ID} className={`mb-8 text-center ${MONO_LABEL}`}>
                    {CLIENT_LOGOS_COPY.label}
                </p>
                <div className="group/marquee overflow-hidden">
                    <ul
                        role="list"
                        className={[
                            "flex w-max animate-marquee items-center gap-20 sm:gap-24",
                            "group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]",
                            "motion-reduce:w-auto motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-8",
                        ].join(" ")}
                    >
                        {track.map((logo, index) => {
                            const repeat = index >= CLIENT_LOGOS.length;
                            return (
                                <li
                                    key={`${logo.url}-${index}`}
                                    aria-hidden={repeat || undefined}
                                    className={repeat ? "shrink-0 motion-reduce:hidden" : "shrink-0"}
                                >
                                    <LogoLink logo={logo} repeat={repeat} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}

interface LogoLinkProps {
    readonly logo: ClientLogo;
    /** A copy that only exists to fill the loop: skipped by the keyboard. */
    readonly repeat: boolean;
}

function LogoLink({ logo, repeat }: LogoLinkProps) {
    const size = logo.enlarge ? ENLARGED_SIZE : DEFAULT_SIZE;
    const { src, width, height } = logo.image;
    return (
        <a
            href={logo.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={repeat ? -1 : undefined}
            className="group/logo block"
        >
            <Image
                src={src}
                alt={logo.name}
                width={Math.round((size.px * width) / height)}
                height={size.px}
                className={`${size.classes} w-auto object-contain mix-blend-multiply grayscale motion-safe:transition group-hover/logo:grayscale-0 group-focus-visible/logo:grayscale-0`}
            />
            {repeat ? null : <span className="sr-only">{` (${CLIENT_LOGOS_COPY.newTabNote})`}</span>}
        </a>
    );
}

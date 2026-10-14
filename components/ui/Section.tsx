import type { ReactNode } from "react";
import { CONTAINER } from "./styles";

export type Tone = "white" | "paper";

/** What app/page.tsx passes every section after the hero. */
export interface SectionProps {
    readonly tone: Tone;
}

interface SectionShellProps extends SectionProps {
    readonly id: string;
    readonly children: ReactNode;
    readonly labelledBy?: string;
    readonly ariaLabel?: string;
}

/** Ruled on top, padded, and offset so the sticky header never covers an anchor target. */
export function Section({ id, tone, labelledBy, ariaLabel, children }: SectionShellProps) {
    const background = tone === "paper" ? "bg-paper" : "bg-white";
    return (
        <section
            id={id}
            aria-labelledby={labelledBy}
            aria-label={ariaLabel}
            className={`scroll-mt-24 border-t border-ink ${background}`}
        >
            <div className={`${CONTAINER} py-16 lg:py-24`}>{children}</div>
        </section>
    );
}

import type { ReactNode } from "react";
import { MONO_LABEL } from "./styles";

interface LedgerProps {
    readonly children: ReactNode;
    readonly title?: string;
    readonly titleLevel?: 2 | 3;
    readonly className?: string;
}

/** A ruled list: a full ink rule on top, hairlines between rows. The site's stand-in for cards. */
export function Ledger({ children, title, titleLevel = 3, className = "" }: LedgerProps) {
    const Title = titleLevel === 2 ? "h2" : "h3";
    return (
        <div className={className}>
            {title ? <Title className={`mb-3 text-body ${MONO_LABEL}`}>{title}</Title> : null}
            <ul role="list" className="border-t border-ink">
                {children}
            </ul>
        </div>
    );
}

interface LedgerRowProps {
    readonly children: ReactNode;
    /** Aqua accent fill, for the one row that should stand out. */
    readonly highlighted?: boolean;
}

export function LedgerRow({ children, highlighted = false }: LedgerRowProps) {
    const fill = highlighted ? "bg-aqua px-4 sm:px-6" : "";
    return <li className={`border-b border-ink/20 py-6 ${fill}`}>{children}</li>;
}

import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "dark";

const BASE =
    "inline-flex items-center justify-center border-2 px-5 py-3 text-center font-heading text-sm font-bold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/** Gold always carries ink text. "dark" is for a button that sits on a gold fill. */
const VARIANTS: Readonly<Record<ButtonVariant, string>> = {
    primary: "border-gold bg-gold text-ink hover:border-ink",
    secondary: "border-ink bg-white text-ink hover:bg-paper",
    dark: "border-ink bg-ink text-white hover:bg-white hover:text-ink",
};

export function buttonClasses(variant: ButtonVariant = "primary", extra = ""): string {
    return [BASE, VARIANTS[variant], extra].filter(Boolean).join(" ");
}

interface ButtonLinkProps {
    readonly href: string;
    readonly children: ReactNode;
    readonly variant?: ButtonVariant;
    readonly className?: string;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
    return (
        <a href={href} className={buttonClasses(variant, className)}>
            {children}
        </a>
    );
}

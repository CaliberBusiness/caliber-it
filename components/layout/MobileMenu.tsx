"use client";

import { useEffect, useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { CONTAINER } from "@/components/ui/styles";
import type { Link } from "@/content/types";

interface MobileMenuProps {
    readonly items: readonly Link[];
    readonly cta: Link;
    readonly openLabel: string;
    readonly closeLabel: string;
    readonly navLabel: string;
}

/** Below the lg breakpoint: a square toggle and a full-width panel under the header. */
export function MobileMenu({ items, cta, openLabel, closeLabel, navLabel }: MobileMenuProps) {
    const [open, setOpen] = useState(false);
    const panelId = useId();
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return undefined;
        // Focus goes back to the toggle, so keyboard users aren't left inside a hidden panel.
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            setOpen(false);
            toggleRef.current?.focus();
        };
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [open]);

    const close = () => setOpen(false);

    return (
        <div className="lg:hidden">
            <button
                ref={toggleRef}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={open ? closeLabel : openLabel}
                onClick={() => setOpen((isOpen) => !isOpen)}
                className="flex h-11 w-11 items-center justify-center border-2 border-ink text-ink"
            >
                <MenuIcon open={open} />
            </button>

            <nav
                id={panelId}
                aria-label={navLabel}
                hidden={!open}
                className="absolute inset-x-0 top-full border-b border-ink bg-white"
            >
                <ul role="list" className={CONTAINER}>
                    {items.map((item) => (
                        <li key={item.href} className="border-b border-ink/20">
                            <a href={item.href} onClick={close} className="block py-4 font-heading font-bold text-ink">
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className={`${CONTAINER} py-4`}>
                    <a href={cta.href} onClick={close} className={buttonClasses("primary", "w-full")}>
                        {cta.label}
                    </a>
                </div>
            </nav>
        </div>
    );
}

interface MenuIconProps {
    readonly open: boolean;
}

function MenuIcon({ open }: MenuIconProps) {
    return (
        <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
        >
            {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M2 5h16M2 10h16M2 15h16" />}
        </svg>
    );
}

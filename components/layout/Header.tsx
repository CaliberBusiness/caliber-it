import { Lockup } from "@/components/brand/Lockup";
import { PoweredBy } from "@/components/brand/PoweredBy";
import { ButtonLink } from "@/components/ui/Button";
import { CONTAINER } from "@/components/ui/styles";
import { NAV_COPY, NAV_CTA, NAV_ITEMS } from "@/content/nav";
import { visibleOnly } from "@/lib/flags";
import { MobileMenu } from "./MobileMenu";

export function Header() {
    // Flags are resolved here, on the server, so the menu only ever gets live links.
    const items = visibleOnly(NAV_ITEMS);

    return (
        <header className="sticky top-0 z-40 border-b border-ink bg-white">
            <div className={`${CONTAINER} flex items-center justify-between gap-4 py-3 sm:gap-6`}>
                <div className="min-w-0">
                    <Lockup />
                    <PoweredBy compact className="mt-0.5" />
                </div>

                <nav aria-label={NAV_COPY.navLabel} className="hidden items-center gap-7 lg:flex">
                    <ul role="list" className="flex items-center gap-7">
                        {items.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <ButtonLink href={NAV_CTA.href}>{NAV_CTA.label}</ButtonLink>
                </nav>

                <MobileMenu
                    items={items}
                    cta={NAV_CTA}
                    openLabel={NAV_COPY.openMenu}
                    closeLabel={NAV_COPY.closeMenu}
                    navLabel={NAV_COPY.navLabel}
                />
            </div>
        </header>
    );
}

import type { ReactNode } from "react";
import { Lockup } from "@/components/brand/Lockup";
import { PoweredBy } from "@/components/brand/PoweredBy";
import ObfuscatedEmail from "@/components/ui/ObfuscatedEmail";
import { CONTAINER, MONO_LABEL, TEXT_LINK } from "@/components/ui/styles";
import { FOOTER } from "@/content/footer";
import { SECTION_IDS } from "@/content/nav";
import { ALL_SERVICE_NAMES } from "@/content/services";
import { formatAddress, siteConfig } from "@/site.config";

const FOOTER_LINK = "underline-offset-4 hover:text-ink hover:underline";

export function Footer() {
    const { contact, addresses, legal } = siteConfig;
    // Resolved at build time; the page is static.
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-ink bg-white">
            <div className={`${CONTAINER} grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4`}>
                <div className="space-y-2">
                    <Lockup />
                    <PoweredBy />
                </div>

                <FooterColumn title={FOOTER.servicesTitle}>
                    <ul role="list" className="space-y-2">
                        {ALL_SERVICE_NAMES.map((name) => (
                            <li key={name}>
                                <a href={`#${SECTION_IDS.services}`} className={FOOTER_LINK}>
                                    {name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </FooterColumn>

                <FooterColumn title={FOOTER.contactTitle}>
                    <p>
                        <ObfuscatedEmail user={contact.emailUser} domain={contact.emailDomain} className={TEXT_LINK} />
                    </p>
                    {contact.phone ? <p className="mt-2">{contact.phone}</p> : null}
                    <address className="mt-5 space-y-4 not-italic">
                        {addresses.map((address) => (
                            <p key={address.label}>
                                <span className={`block text-ink ${MONO_LABEL}`}>{address.label}</span>
                                {formatAddress(address)}
                            </p>
                        ))}
                    </address>
                </FooterColumn>

                <FooterColumn title={FOOTER.legalTitle}>
                    <ul role="list" className="space-y-2">
                        <li>
                            <a href={legal.privacyUrl} className={FOOTER_LINK}>
                                {FOOTER.privacyLabel}
                            </a>
                        </li>
                        <li>
                            <a href={legal.termsUrl} className={FOOTER_LINK}>
                                {FOOTER.termsLabel}
                            </a>
                        </li>
                    </ul>
                    <p className="mt-6 font-mono text-xs">
                        © {year} {legal.copyrightHolder}
                    </p>
                </FooterColumn>
            </div>
        </footer>
    );
}

interface FooterColumnProps {
    readonly title: string;
    readonly children: ReactNode;
}

function FooterColumn({ title, children }: FooterColumnProps) {
    return (
        <div className="text-sm">
            <h2 className={`mb-4 text-ink ${MONO_LABEL}`}>{title}</h2>
            {children}
        </div>
    );
}

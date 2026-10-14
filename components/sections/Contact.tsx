import { ContactForm } from "@/components/forms/ContactForm";
import ObfuscatedEmail from "@/components/ui/ObfuscatedEmail";
import { Section, type SectionProps } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TEXT_LINK } from "@/components/ui/styles";
import { CONTACT_SECTION } from "@/content/contact";
import { SECTION_IDS } from "@/content/nav";
import { siteConfig } from "@/site.config";

const HEADING_ID = "contact-heading";

export function Contact({ tone }: SectionProps) {
    const { contact, poweredBy, legal } = siteConfig;
    return (
        <Section id={SECTION_IDS.contact} tone={tone} labelledBy={HEADING_ID}>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <SectionHeader
                        label={CONTACT_SECTION.label}
                        heading={CONTACT_SECTION.heading}
                        intro={CONTACT_SECTION.body}
                        headingId={HEADING_ID}
                    />
                    <div className="mt-8 space-y-4">
                        <p>
                            <ObfuscatedEmail user={contact.emailUser} domain={contact.emailDomain} className={TEXT_LINK} />
                        </p>
                        {/* Staffing leads belong on Caliber's own form. Goes with the powered-by switch. */}
                        {poweredBy.show ? (
                            <p className="text-sm">
                                {CONTACT_SECTION.staffingText}{" "}
                                <a href={poweredBy.staffingFormUrl} className={TEXT_LINK}>
                                    {CONTACT_SECTION.staffingLabel}
                                    <span aria-hidden="true"> →</span>
                                </a>
                            </p>
                        ) : null}
                    </div>
                </div>
                <div className="lg:col-span-7">
                    <ContactForm privacyUrl={legal.privacyUrl} />
                </div>
            </div>
        </Section>
    );
}

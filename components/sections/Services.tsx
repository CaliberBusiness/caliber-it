import { ButtonLink } from "@/components/ui/Button";
import { Ledger, LedgerRow } from "@/components/ui/Ledger";
import { Section, type SectionProps } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MONO_LABEL } from "@/components/ui/styles";
import { SECTION_IDS } from "@/content/nav";
import { ASSESSMENT, SERVICE_ROWS, SERVICES_SECTION } from "@/content/services";
import type { ServiceRow } from "@/content/types";
import { priceToShow } from "@/lib/flags";

const HEADING_ID = "services-heading";

export function Services({ tone }: SectionProps) {
    return (
        <Section id={SECTION_IDS.services} tone={tone} labelledBy={HEADING_ID}>
            <SectionHeader
                label={SERVICES_SECTION.label}
                heading={SERVICES_SECTION.heading}
                intro={SERVICES_SECTION.intro}
                headingId={HEADING_ID}
            />
            <AssessmentBanner />
            <Ledger className="mt-12">
                {SERVICE_ROWS.map((row) => (
                    <ServiceLedgerRow key={row.id} row={row} />
                ))}
            </Ledger>
        </Section>
    );
}

function AssessmentBanner() {
    return (
        <div className="mt-10 flex flex-col gap-6 bg-gold p-6 text-ink sm:p-8 md:flex-row md:items-center md:justify-between">
            <div>
                <p className={MONO_LABEL}>{ASSESSMENT.label}</p>
                <h3 className="mt-2 text-2xl font-extrabold">{ASSESSMENT.title}</h3>
                <p className="mt-2 max-w-xl">{ASSESSMENT.body}</p>
            </div>
            <ButtonLink href={ASSESSMENT.cta.href} variant="dark" className="shrink-0">
                {ASSESSMENT.cta.label}
            </ButtonLink>
        </div>
    );
}

interface ServiceLedgerRowProps {
    readonly row: ServiceRow;
}

function ServiceLedgerRow({ row }: ServiceLedgerRowProps) {
    const price = priceToShow(row.price);
    return (
        <LedgerRow highlighted={row.highlighted}>
            <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-4">
                    <h3 className="text-xl font-bold">{row.name}</h3>
                    <p className={`mt-2 ${MONO_LABEL}`}>{row.billing}</p>
                    {price ? <p className="mt-1 font-mono text-sm font-medium text-ink">{price}</p> : null}
                </div>
                <div className="md:col-span-8">
                    <p className="font-medium text-ink">{row.line}</p>
                    <ul role="list" className="mt-3 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
                        {row.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2.5">
                                <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 bg-ink" />
                                <span>{bullet}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </LedgerRow>
    );
}

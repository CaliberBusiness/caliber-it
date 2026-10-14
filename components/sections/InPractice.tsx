import type { ReactNode } from "react";
import { Ledger, LedgerRow } from "@/components/ui/Ledger";
import { Section, type SectionProps } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MONO_LABEL } from "@/components/ui/styles";
import { IN_PRACTICE, IN_PRACTICE_ROWS } from "@/content/in-practice";
import { SECTION_IDS } from "@/content/nav";
import { serviceName } from "@/content/services";

const HEADING_ID = "in-practice-heading";

/** Rendered only while showInPractice is on (app/page.tsx). */
export function InPractice({ tone }: SectionProps) {
    const { columns } = IN_PRACTICE;
    return (
        <Section id={SECTION_IDS.inPractice} tone={tone} labelledBy={HEADING_ID}>
            <SectionHeader
                label={IN_PRACTICE.label}
                heading={IN_PRACTICE.heading}
                intro={IN_PRACTICE.intro}
                headingId={HEADING_ID}
            />

            <div className="mt-12">
                {/* Visual column heads on wide screens; each row carries its own labels for screen readers and phones. */}
                <div aria-hidden="true" className={`hidden gap-8 pb-3 md:grid md:grid-cols-12 ${MONO_LABEL}`}>
                    <p className="md:col-span-4">{columns.problem}</p>
                    <p className="md:col-span-5">{columns.action}</p>
                    <p className="md:col-span-3">{columns.service}</p>
                </div>
                <Ledger>
                    {IN_PRACTICE_ROWS.map((row) => (
                        <LedgerRow key={row.problem}>
                            <dl className="grid gap-4 md:grid-cols-12 md:gap-8">
                                <Cell term={columns.problem} className="md:col-span-4">
                                    <span className="font-semibold text-ink">{row.problem}</span>
                                </Cell>
                                <Cell term={columns.action} className="md:col-span-5">
                                    {row.action}
                                </Cell>
                                <Cell term={columns.service} className="md:col-span-3">
                                    <span className={`inline-block bg-aqua px-2 py-1 text-ink ${MONO_LABEL}`}>
                                        {serviceName(row.service)}
                                    </span>
                                </Cell>
                            </dl>
                        </LedgerRow>
                    ))}
                </Ledger>
            </div>
        </Section>
    );
}

interface CellProps {
    readonly term: string;
    readonly className: string;
    readonly children: ReactNode;
}

function Cell({ term, className, children }: CellProps) {
    return (
        <div className={className}>
            <dt className={`mb-1 md:sr-only ${MONO_LABEL}`}>{term}</dt>
            <dd>{children}</dd>
        </div>
    );
}

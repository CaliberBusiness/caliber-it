import { Ledger, LedgerRow } from "@/components/ui/Ledger";
import { Section, type SectionProps } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MONO_LABEL } from "@/components/ui/styles";
import { SECTION_IDS } from "@/content/nav";
import {
    COVERAGE_HOURS,
    ESCALATION_LEVELS,
    PRE_SHIFT_STEPS,
    SEAT_STATUSES,
    SUPPORT_COPY,
} from "@/content/support";
import type { StatusTone } from "@/content/types";

const HEADING_ID = "support-heading";

/** Within the palette: aqua is fine, gold needs a look, ink means stop. */
const TONE_CLASSES: Readonly<Record<StatusTone, string>> = {
    ready: "bg-aqua text-ink",
    attention: "bg-gold text-ink",
    critical: "bg-ink text-white",
};

export function HowSupportWorks({ tone }: SectionProps) {
    return (
        <Section id={SECTION_IDS.support} tone={tone} labelledBy={HEADING_ID}>
            <SectionHeader label={SUPPORT_COPY.label} heading={SUPPORT_COPY.heading} headingId={HEADING_ID} />

            <Ledger title={SUPPORT_COPY.preShiftTitle} className="mt-12">
                {PRE_SHIFT_STEPS.map((step) => (
                    <LedgerRow key={step.time}>
                        <div className="grid gap-2 sm:grid-cols-12 sm:gap-8">
                            <p className="font-mono text-sm font-medium text-ink sm:col-span-3">{step.time}</p>
                            <p className="sm:col-span-9">{step.body}</p>
                        </div>
                    </LedgerRow>
                ))}
            </Ledger>

            <div className="mt-12 grid gap-12 lg:grid-cols-2">
                <Ledger title={SUPPORT_COPY.seatStatusTitle}>
                    {SEAT_STATUSES.map((status) => (
                        <LedgerRow key={status.label}>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className={`inline-block min-w-40 px-2.5 py-1 ${MONO_LABEL} ${TONE_CLASSES[status.tone]}`}>
                                    {status.label}
                                </span>
                                <span>{status.description}</span>
                            </div>
                        </LedgerRow>
                    ))}
                </Ledger>

                <Ledger title={SUPPORT_COPY.escalationTitle}>
                    {ESCALATION_LEVELS.map((level) => (
                        <LedgerRow key={level.level}>
                            <div className="grid gap-1 sm:grid-cols-12 sm:gap-6">
                                <p className="font-mono text-sm font-medium text-ink sm:col-span-3">{level.level}</p>
                                <div className="sm:col-span-9">
                                    <p className="font-semibold text-ink">{level.who}</p>
                                    <p className="text-sm">{level.handles}</p>
                                </div>
                            </div>
                        </LedgerRow>
                    ))}
                </Ledger>
            </div>

            {COVERAGE_HOURS ? (
                <p className="mt-10 font-mono text-sm text-ink">
                    {SUPPORT_COPY.coverageLabel}: {COVERAGE_HOURS}
                </p>
            ) : null}
        </Section>
    );
}

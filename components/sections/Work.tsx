import { Ledger, LedgerRow } from "@/components/ui/Ledger";
import { Section, type SectionProps } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MONO_LABEL, TEXT_LINK } from "@/components/ui/styles";
import { SECTION_IDS } from "@/content/nav";
import type { WorkProject } from "@/content/types";
import { WORK_COPY, WORK_GROUPS } from "@/content/work";

const HEADING_ID = "work-heading";

/** Rendered only while showWork is on (app/page.tsx). Links only: no screenshots, no logos. */
export function Work({ tone }: SectionProps) {
    return (
        <Section id={SECTION_IDS.work} tone={tone} labelledBy={HEADING_ID}>
            <SectionHeader label={WORK_COPY.label} heading={WORK_COPY.heading} headingId={HEADING_ID} />

            {WORK_GROUPS.map((group) => (
                <div key={group.key} className="mt-12">
                    <h3 className={`text-body ${MONO_LABEL}`}>{group.label}</h3>
                    {group.note ? <p className="mt-1 text-sm">{group.note}</p> : null}
                    <Ledger className="mt-3">
                        {group.projects.map((project) => (
                            <ProjectRow key={project.url} project={project} />
                        ))}
                    </Ledger>
                </div>
            ))}
        </Section>
    );
}

interface ProjectRowProps {
    readonly project: WorkProject;
}

/** "A · B" wraps as "A ·" / "B", never "A" / "· B": the space before each dot can't break. */
function keepSeparatorsTrailing(stack: string): string {
    return stack.split(" · ").join(" · ");
}

function ProjectRow({ project }: ProjectRowProps) {
    return (
        <LedgerRow>
            <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-4">
                    {/* globals.css styles h1-h3 only, so the heading font and ink are set here. */}
                    <h4 className="font-heading text-xl font-bold text-ink">{project.name}</h4>
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-2 inline-block text-sm ${TEXT_LINK}`}
                    >
                        {WORK_COPY.visitLabel}
                        <span className="sr-only">{` ${project.name} (${WORK_COPY.newTabNote})`}</span>
                        <span aria-hidden="true"> ↗</span>
                    </a>
                </div>
                <ul role="list" className="space-y-1.5 md:col-span-5">
                    {project.built.map((line) => (
                        <li key={line} className="flex gap-2.5">
                            <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 bg-ink" />
                            <span>{line}</span>
                        </li>
                    ))}
                </ul>
                <div className="md:col-span-3">
                    <p className="font-mono text-sm text-ink">{keepSeparatorsTrailing(project.stack)}</p>
                    <ul role="list" className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <li key={tag} className={`border border-ink/30 px-2 py-1 text-ink ${MONO_LABEL}`}>
                                {tag}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </LedgerRow>
    );
}

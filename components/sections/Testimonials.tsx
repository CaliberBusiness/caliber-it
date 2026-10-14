import { Section, type SectionProps } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MONO_LABEL, TEXT_LINK } from "@/components/ui/styles";
import { SECTION_IDS } from "@/content/nav";
import { TESTIMONIALS, TESTIMONIALS_COPY } from "@/content/testimonials";
import type { Testimonial } from "@/content/types";

const HEADING_ID = "testimonials-heading";

/** Rendered only while showTestimonial is on (app/page.tsx). */
export function Testimonials({ tone }: SectionProps) {
    return (
        <Section id={SECTION_IDS.testimonials} tone={tone} labelledBy={HEADING_ID}>
            <SectionHeader label={TESTIMONIALS_COPY.label} heading={TESTIMONIALS_COPY.heading} headingId={HEADING_ID} />
            <ul role="list" className="mt-12 grid gap-x-16 gap-y-14 md:grid-cols-2">
                {TESTIMONIALS.map((item) => (
                    <li key={item.quote}>
                        <TestimonialFigure item={item} />
                    </li>
                ))}
            </ul>
        </Section>
    );
}

interface TestimonialFigureProps {
    readonly item: Testimonial;
}

function TestimonialFigure({ item }: TestimonialFigureProps) {
    return (
        <figure className="flex h-full flex-col">
            <span aria-hidden="true" className="mb-5 block h-1 w-12 bg-gold" />
            <blockquote className="mb-8 font-heading text-xl font-bold leading-snug text-ink sm:text-2xl">
                <p>“{item.quote}”</p>
            </blockquote>
            {/* Pushed to the bottom, so captions line up across a row. */}
            <figcaption className="mt-auto border-t border-ink pt-4">
                {item.name ? <span className="block font-semibold text-ink">{item.name}</span> : null}
                <span className={`${item.name ? "mt-1 " : ""}block ${MONO_LABEL}`}>{`${item.role}, ${item.company}`}</span>
                {item.url ? (
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-3 inline-block text-sm ${TEXT_LINK}`}
                    >
                        {TESTIMONIALS_COPY.linkLabel}
                        <span className="sr-only">{` ${item.company} (${TESTIMONIALS_COPY.linkNewTabNote})`}</span>
                        <span aria-hidden="true"> ↗</span>
                    </a>
                ) : null}
            </figcaption>
        </figure>
    );
}

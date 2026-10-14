import { Section, type SectionProps } from "@/components/ui/Section";
import { MONO_LABEL } from "@/components/ui/styles";
import { SECTION_IDS } from "@/content/nav";
import { TESTIMONIAL } from "@/content/testimonial";

/** Rendered only while showTestimonial is on (app/page.tsx). */
export function Testimonial({ tone }: SectionProps) {
    return (
        <Section id={SECTION_IDS.testimonial} tone={tone} ariaLabel={TESTIMONIAL.ariaLabel}>
            <figure className="max-w-3xl">
                <span aria-hidden="true" className="mb-6 block h-1 w-12 bg-gold" />
                <blockquote className="font-heading text-2xl font-bold leading-snug text-ink sm:text-3xl">
                    <p>“{TESTIMONIAL.quote}”</p>
                </blockquote>
                <figcaption className="mt-8 border-t border-ink pt-4">
                    <span className="block font-semibold text-ink">{TESTIMONIAL.name}</span>
                    <span className={`mt-1 block ${MONO_LABEL}`}>{TESTIMONIAL.role}</span>
                </figcaption>
            </figure>
        </Section>
    );
}

import { ButtonLink } from "@/components/ui/Button";
import { Ledger, LedgerRow } from "@/components/ui/Ledger";
import { CONTAINER, MONO_LABEL } from "@/components/ui/styles";
import { HERO, WAYS } from "@/content/hero";
import { servicesForWay } from "@/content/services";

export function Hero() {
    return (
        <section aria-labelledby="hero-heading" className="bg-white">
            <div className={`${CONTAINER} grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24`}>
                <div className="lg:col-span-7">
                    <h1
                        id="hero-heading"
                        className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        <span className="block">{HERO.headline}</span>{" "}
                        <span className="mt-2 inline bg-aqua px-1 box-decoration-clone">{HERO.headlineHighlight}</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed">{HERO.subtext}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <ButtonLink href={HERO.primaryCta.href}>{HERO.primaryCta.label}</ButtonLink>
                        <ButtonLink href={HERO.secondaryCta.href} variant="secondary">
                            {HERO.secondaryCta.label}
                        </ButtonLink>
                    </div>
                </div>

                <Ledger title={HERO.waysTitle} titleLevel={2} className="lg:col-span-5 lg:self-center">
                    {WAYS.map((way) => (
                        <LedgerRow key={way.key}>
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <p className="font-heading text-lg font-bold text-ink">{way.name}</p>
                                <p className={MONO_LABEL}>{way.terms}</p>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed">{servicesForWay(way.key).join(" · ")}</p>
                        </LedgerRow>
                    ))}
                </Ledger>
            </div>
        </section>
    );
}

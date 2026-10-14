import { MONO_LABEL } from "./styles";

interface SectionHeaderProps {
    readonly label: string;
    readonly heading: string;
    readonly headingId: string;
    readonly intro?: string;
}

export function SectionHeader({ label, heading, headingId, intro }: SectionHeaderProps) {
    return (
        <div className="max-w-3xl">
            <p className={MONO_LABEL}>{label}</p>
            <h2
                id={headingId}
                className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl"
            >
                {heading}
            </h2>
            {intro ? <p className="mt-4 text-lg leading-relaxed">{intro}</p> : null}
        </div>
    );
}

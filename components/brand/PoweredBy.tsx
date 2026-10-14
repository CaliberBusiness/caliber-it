import { siteConfig } from "@/site.config";

interface PoweredByProps {
    readonly className?: string;
    /**
     * Tighter type below sm, so the line stays on one row beside the menu
     * button at 320px and the sticky header keeps its height.
     */
    readonly compact?: boolean;
}

const SIZE_DEFAULT = "text-[11px] tracking-[0.12em]";
const SIZE_COMPACT = "text-[10px] tracking-normal sm:text-[11px] sm:tracking-[0.12em]";

/**
 * The "Powered by" line, used in the header and the footer. Setting
 * poweredBy.show to false in site.config.ts removes it everywhere.
 */
export function PoweredBy({ className = "", compact = false }: PoweredByProps) {
    const { poweredBy } = siteConfig;
    if (!poweredBy.show) {
        return null;
    }

    const size = compact ? SIZE_COMPACT : SIZE_DEFAULT;
    return (
        <p className={`font-mono uppercase text-body ${size} ${className}`}>
            {poweredBy.label}{" "}
            <a href={poweredBy.url} className="underline decoration-ink/30 underline-offset-2 hover:decoration-ink">
                {poweredBy.name}
            </a>
        </p>
    );
}

import { siteConfig } from "@/site.config";

interface PoweredByProps {
    readonly className?: string;
    /**
     * Tighter type below sm, so the line stays on one row beside the menu
     * button at 320px and the sticky header keeps its height.
     */
    readonly compact?: boolean;
}

/** Same type as the main site's "BPO & Managed Staffing" line under its wordmark. */
const TYPE = "font-wordmark font-semibold uppercase";
const SIZE_DEFAULT = "text-[10px] tracking-[0.1em]";
const SIZE_COMPACT = "text-[9px] tracking-normal sm:text-[10px] sm:tracking-[0.1em]";

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
        <p className={`${TYPE} text-body ${size} ${className}`}>
            {poweredBy.label}{" "}
            <a href={poweredBy.url} className="text-ink underline decoration-ink underline-offset-2 hover:decoration-2">
                {poweredBy.name}
            </a>
        </p>
    );
}

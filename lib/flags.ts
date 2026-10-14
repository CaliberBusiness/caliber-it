import { FLAGS, type FlagKey, type Flags } from "@/content/flags";

export interface Gated {
    readonly requiresFlag?: FlagKey;
}

/** No flag means always shown, which is why `undefined` counts as visible. */
export function isEnabled(flag: FlagKey | undefined, flags: Flags = FLAGS): boolean {
    return flag === undefined || flags[flag];
}

export function visibleOnly<T extends Gated>(items: readonly T[], flags: Flags = FLAGS): T[] {
    return items.filter((item) => isEnabled(item.requiresFlag, flags));
}

/** A price needs both gates: showPricing on AND a real value. */
export function priceToShow(price: string | null, flags: Flags = FLAGS): string | null {
    return flags.showPricing && price !== null ? price : null;
}

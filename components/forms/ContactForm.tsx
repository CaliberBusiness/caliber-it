"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { TEXT_LINK } from "@/components/ui/styles";
import { FORM_COPY, SERVICE_OPTIONS, TEAM_SIZES } from "@/content/contact";
import {
    EMPTY_LEAD,
    HONEYPOT_FIELD,
    LEAD_FIELDS,
    MAX_LENGTHS,
    findLeadErrors,
    normalizeLead,
    type LeadErrors,
    type LeadField,
    type LeadInput,
} from "@/lib/lead/validate";

const ENDPOINT = "/api/lead";
const COOLDOWN_SECONDS = 5 * 60;
const COOLDOWN_MS = COOLDOWN_SECONDS * 1000;
const COOLDOWN_KEY = "caliber_it_lead_last_submit";
const ID_PREFIX = "lead-";

const INPUT =
    "mt-1.5 block w-full border border-ink/40 bg-white px-3 py-3 text-ink placeholder:text-body/70 focus:border-ink disabled:opacity-60 aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink";

type Status = "idle" | "submitting" | "success" | "error";

/** Storage can be blocked (private mode, strict settings). Then there is simply no cooldown. */
function readCooldownSeconds(): number {
    try {
        const last = Number(window.localStorage.getItem(COOLDOWN_KEY));
        const remaining = COOLDOWN_MS - (Date.now() - last);
        return last > 0 && remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    } catch {
        return 0;
    }
}

function rememberSubmission(): void {
    try {
        window.localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    } catch {
        // Storage blocked: the cooldown is skipped, nothing else is affected.
    }
}

/**
 * Only a confirmed write counts as success: never tell someone their message
 * was sent when it wasn't. The honeypot is judged on the server, never here,
 * so a real lead whose browser autofilled it is not silently dropped.
 */
async function submitLead(lead: LeadInput, honeypot: string): Promise<boolean> {
    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...lead, [HONEYPOT_FIELD]: honeypot }),
    });
    const result: unknown = await response.json().catch(() => null);
    return response.ok && typeof result === "object" && result !== null && "ok" in result && result.ok === true;
}

function submitLabel(status: Status, cooldown: number): string {
    if (status === "submitting") return FORM_COPY.submitting;
    if (cooldown > 0) return `${FORM_COPY.cooldownPrefix} ${cooldown}s`;
    return FORM_COPY.submit;
}

interface ContactFormProps {
    readonly privacyUrl: string;
}

export function ContactForm({ privacyUrl }: ContactFormProps) {
    const [values, setValues] = useState<LeadInput>(EMPTY_LEAD);
    const [errors, setErrors] = useState<LeadErrors>({});
    const [status, setStatus] = useState<Status>("idle");
    const [honeypot, setHoneypot] = useState("");
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        setCooldown(readCooldownSeconds());
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return undefined;
        const timer = window.setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
        return () => window.clearTimeout(timer);
    }, [cooldown]);

    const busy = status === "submitting";

    const update = (field: LeadField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = event.target.value.slice(0, MAX_LENGTHS[field]);
        setValues((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous));
    };

    const control = (field: LeadField) => ({
        id: `${ID_PREFIX}${field}`,
        name: field,
        value: values[field],
        onChange: update(field),
        disabled: busy,
        "aria-invalid": errors[field] ? true : undefined,
        "aria-describedby": errors[field] ? `${ID_PREFIX}${field}-error` : undefined,
        className: INPUT,
    });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (busy || cooldown > 0) return;

        const lead = normalizeLead(values);
        const found = findLeadErrors(lead);
        setErrors(found);
        const firstInvalid = LEAD_FIELDS.find((field) => found[field]);
        if (firstInvalid) {
            setStatus("idle");
            document.getElementById(`${ID_PREFIX}${firstInvalid}`)?.focus();
            return;
        }

        setStatus("submitting");
        try {
            const sent = await submitLead(lead, honeypot);
            // Cool down only after a confirmed send: a failed attempt must
            // stay retryable, even after a reload.
            if (sent) {
                rememberSubmission();
                setCooldown(COOLDOWN_SECONDS);
                setValues(EMPTY_LEAD);
            }
            setStatus(sent ? "success" : "error");
        } catch {
            setStatus("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
            <Honeypot value={honeypot} onChange={setHoneypot} />

            <div className="grid gap-5 sm:grid-cols-2">
                <Field field="firstName" error={errors.firstName}>
                    <input type="text" autoComplete="given-name" aria-required="true" {...control("firstName")} />
                </Field>
                <Field field="lastName" error={errors.lastName}>
                    <input type="text" autoComplete="family-name" aria-required="true" {...control("lastName")} />
                </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field field="email" error={errors.email}>
                    <input type="email" autoComplete="email" inputMode="email" aria-required="true" {...control("email")} />
                </Field>
                <Field field="companyName" error={errors.companyName}>
                    <input type="text" autoComplete="organization" aria-required="true" {...control("companyName")} />
                </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field field="service" error={errors.service}>
                    <select aria-required="true" {...control("service")}>
                        <option value="">{FORM_COPY.servicePlaceholder}</option>
                        {SERVICE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field field="teamSize" error={errors.teamSize}>
                    <select aria-required="true" {...control("teamSize")}>
                        <option value="">{FORM_COPY.teamSizePlaceholder}</option>
                        {TEAM_SIZES.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field field="currentTools" optional>
                <input type="text" placeholder={FORM_COPY.currentToolsPlaceholder} {...control("currentTools")} />
            </Field>

            <Field field="message" error={errors.message}>
                <textarea rows={5} aria-required="true" {...control("message")} />
            </Field>

            <div>
                <button type="submit" disabled={busy || cooldown > 0} className={buttonClasses("primary", "w-full")}>
                    {submitLabel(status, cooldown)}
                </button>
                <p className="mt-3 text-xs">
                    {FORM_COPY.consentPrefix}{" "}
                    <a href={privacyUrl} className={TEXT_LINK}>
                        {FORM_COPY.consentLink}
                    </a>
                    .
                </p>
            </div>

            <div aria-live="polite" aria-atomic="true">
                {status === "success" ? <Notice tone="success">{FORM_COPY.success}</Notice> : null}
                {status === "error" ? <Notice tone="error">{FORM_COPY.failure}</Notice> : null}
            </div>
        </form>
    );
}

interface FieldProps {
    readonly field: LeadField;
    readonly error?: string;
    readonly optional?: boolean;
    readonly children: ReactNode;
}

function Field({ field, error, optional = false, children }: FieldProps) {
    const id = `${ID_PREFIX}${field}`;
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-ink">
                {FORM_COPY.labels[field]}
                {optional ? (
                    <span className="font-normal text-body"> {FORM_COPY.optional}</span>
                ) : (
                    <span aria-hidden="true"> *</span>
                )}
            </label>
            {children}
            {error ? (
                <p id={`${id}-error`} className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-ink">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-gold" />
                    {error}
                </p>
            ) : null}
        </div>
    );
}

interface HoneypotProps {
    readonly value: string;
    readonly onChange: (value: string) => void;
}

/** Off-screen rather than display:none, which some bots know to skip. */
function Honeypot({ value, onChange }: HoneypotProps) {
    const id = `${ID_PREFIX}${HONEYPOT_FIELD}`;
    return (
        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor={id}>{FORM_COPY.honeypotLabel}</label>
            <input
                id={id}
                name={HONEYPOT_FIELD}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}

interface NoticeProps {
    readonly tone: "success" | "error";
    readonly children: ReactNode;
}

function Notice({ tone, children }: NoticeProps) {
    const rule = tone === "success" ? "border-aqua" : "border-gold";
    return <p className={`border-l-4 ${rule} bg-white px-4 py-3 font-semibold text-ink`}>{children}</p>;
}

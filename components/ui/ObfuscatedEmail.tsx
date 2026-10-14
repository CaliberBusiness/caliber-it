"use client";

import { useState, useEffect } from 'react';

/**
 * Phase 6: Email Obfuscation Component
 * Renders the email address only client-side via JavaScript
 * to prevent scraping bots from harvesting the address.
 */
export default function ObfuscatedEmail({
    user,
    domain,
    className = ""
}: {
    user: string;
    domain: string;
    className?: string;
}) {
    const [email, setEmail] = useState("");

    useEffect(() => {
        // Only assemble the email in the browser, never in SSR/HTML source
        setEmail(`${user}@${domain}`);
    }, [user, domain]);

    if (!email) {
        return <span className={className}>Loading...</span>;
    }

    return (
        <a href={`mailto:${email}`} className={className}>
            {email}
        </a>
    );
}

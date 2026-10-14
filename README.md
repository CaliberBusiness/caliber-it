# Caliber IT Solutions

The one-page site for Caliber's IT service line, deployed at `it.caliberbusinessresource.com`.
Built so it can later be moved to its own domain with config changes only.

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · `next/font` · Vitest

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build (needs NEXT_PUBLIC_SITE_URL)
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest, run once
```

## Where things live

| Path | What it holds |
|---|---|
| `site.config.ts` | Brand name, logo path, site URL, email, addresses, legal links, copyright holder, and the `poweredBy` switch |
| `public/images/logo.jpg`, `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` | Caliber's logo and favicon set, copied unchanged from the Caliber site |
| `content/` | All page copy as typed data, plus `flags.ts`. No copy lives in JSX. |
| `components/` | `brand/` (lockup, powered-by line), `layout/`, `sections/`, `forms/`, `ui/` |
| `lib/lead/` | Form validation (shared by browser and server) and the GoHighLevel payload |
| `app/api/lead/route.ts` | The form endpoint |
| `tests/` | Vitest suites |

## Flags (`content/flags.ts`)

`showPricing` and `showInPractice` default to `false`; flip either only with sign-off. The rest are on and show only approved content.

| Flag | Hides | Default |
|---|---|---|
| `showPricing` | Every price. Prices are also `null` in `content/services.ts`, and both gates must pass. | off |
| `showInPractice` | The "In practice" section and its nav link | off |
| `showTestimonial` | The testimonials list (`content/testimonials.ts`) | on |
| `showWork` | The "Work" section and its nav link | on |
| `showClientLogos` | The "Built for" logo strip under the hero (`content/client-logos.ts`) | on |

## Environment variables

See `.env.example`.

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonicals, sitemap and JSON-LD are built from it. A production build fails without it. |
| `NEXT_PUBLIC_ALLOW_INDEX` | No | `true` at launch. Otherwise every page is `noindex` (meta tag and `X-Robots-Tag` header). Needs a redeploy to take effect. |
| `GHL_PIT`, `GHL_LOCATION_ID` | Yes | Server-only. Without them the form returns an error and captures nothing. |
| `GHL_FIELD_MESSAGE` | No | Defaults to Caliber's existing message field. |
| `GHL_FIELD_IT_SERVICE`, `GHL_FIELD_IT_TEAM_SIZE`, `GHL_FIELD_IT_CURRENT_TOOLS` | No | Blank until those fields exist in GHL. While blank, the answers go into the message as labelled lines. |

## How a lead travels

1. The form validates in the browser, then POSTs JSON to `/api/lead`.
2. The route drops bots (honeypot field `website`), then validates again.
3. GoHighLevel contact upsert, tagged `it-lead`, source `IT site`. If this fails, the visitor sees an error.
4. Formspree email notification, `formName: "IT site"`. Allowed to fail: the lead is already in the CRM.

Abuse protection is the honeypot, a 16 KB request cap and a 5-minute browser cooldown after each successful send. There is no server-side rate limiting, the same as the Caliber site's form. Adding it needs a store such as Upstash Redis.

## Launch checklist

1. Vercel: set `NEXT_PUBLIC_SITE_URL`, `GHL_PIT` (mark Sensitive) and `GHL_LOCATION_ID`.
2. Submit a real test lead and confirm it lands in GHL tagged `it-lead`.
3. Set `NEXT_PUBLIC_ALLOW_INDEX=true`, redeploy, and add the site to Search Console.

## Spinning off to its own domain

1. `site.config.ts`: change `brandName`, the contact email, `legal` (own privacy policy and terms, copyright holder) and the addresses, then set `poweredBy.show` to `false`.
2. Review the "In practice" heading in `content/in-practice.ts`, which names Caliber.
3. Point `NEXT_PUBLIC_SITE_URL` at the new domain.
4. GHL: set `GHL_PIT` and `GHL_LOCATION_ID` for the new sub-account, plus `GHL_FIELD_MESSAGE` and any IT field IDs (Caliber's IDs won't exist there).
5. Formspree: `FORMSPREE_ENDPOINT` in `app/api/lead/route.ts` is Caliber's shared inbox. Replace it.

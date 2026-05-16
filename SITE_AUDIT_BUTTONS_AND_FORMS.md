# Site Audit — Buttons & Forms

**Audited:** May 16, 2026
**Scope:** every page under `client/src/pages/`, both header & footer chrome, and every shared component used in the home composition. The audit looked at every `<button>`, every `<Link>`/anchor that acts as a CTA, every `<form>`, and every `<input>` to confirm it does what its label promises.

The site has **three working forms** and **no broken forms**. The handful of issues are all in the chrome (header buttons that are placeholders) and in the implied-but-missing CTAs around the marketing pages.

---

## Summary scorecard

| Area | Status |
|---|---|
| Working `<form>` submissions | **3** (all post to validated, persisted endpoints) |
| Broken `<form>` submissions | **0** |
| Placeholder buttons that toast "coming soon" | **3** (Sign in × 2 desktop+mobile, Client Login × 1) |
| Implied CTAs missing a form | **2** (newsletter on /blog, sample-report email-capture) |
| Phone / email anchor links (`tel:`, `mailto:`) | All correct, all live on `+1 888 445 3047` and the role-specific inboxes |

The headline takeaway is that the customer-facing **conversion path is healthy**. Every "Get a Quote", "Start Screening", "Talk to a specialist", "Book the audit", and "Have a question about your report?" CTA lands on a real, validated, persisting form. The work that remains is small-surface and quick.

---

## 1. Forms that exist and are wired to persistence

The site has three real forms. Each posts to a server endpoint that validates the payload, generates an opaque ID, and appends to a JSON store (`data/contact_submissions.json` or `data/candidate_submissions.json`). Both endpoints were live-probed during this audit and returned `201 Created` for valid payloads and `400` with a clear error message for invalid ones.

### 1.1 Contact form — `/contact`
The primary B2B intake form. Fields are `name`, `email`, `company`, `teamSize`, plus a `services` chip group and a free-form `message`. The form supports query-param prefill from the pricing calculator (`?volume=&services=&note=`) and from the industries page (`?industry=`). On submit it posts JSON to `POST /api/contact` and renders an in-page success state.

**Status: working.** Live POST returned `{"ok":true,"id":"cs_mp8kld6j_fd99np"}`.

### 1.2 Compliance audit booking — `/compliance/audit#book`
A second, deeper intake form for the free 15-minute compliance audit. It carries audit-specific fields (firstName, lastName, phone, role, companySize, industry, currentVendor, timing, focus, notes) and packs them into the `message` field of a `/api/contact` submission with a `[Compliance Audit Request]` prefix so the operations team can search the inbox without a schema migration.

**Status: working.** This deliberately reuses the contact endpoint, which is a smart decision — it keeps the persistence layer single-source instead of forking a parallel `audit_submissions.json`.

### 1.3 Candidate inquiry form — `/support#candidate-inquiry`
Routed away from the employer/sales desk so candidates with disputes don't pile into the B2B queue. Fields are `fullName`, `email`, optional `reportId`, and a free-form `message`. Posts to `POST /api/candidate-contact`.

**Status: working.** Live POST returned `201 Created`.

| Form | Page | Endpoint | Persistence | Status |
|---|---|---|---|---|
| Contact | `/contact` | `POST /api/contact` | `data/contact_submissions.json` | Working |
| Compliance audit | `/compliance/audit` | `POST /api/contact` (with `[Compliance Audit Request]` prefix) | `data/contact_submissions.json` | Working |
| Candidate inquiry | `/support#candidate-inquiry` | `POST /api/candidate-contact` | `data/candidate_submissions.json` | Working |

---

## 2. Buttons that are placeholders today

There are exactly three buttons on the site that toast "preview only" or "coming soon" instead of doing real work, and they all live in the global chrome.

### 2.1 Header — "Sign in" (desktop & mobile)
Both the desktop pill in the top-right and the mobile sheet entry call `notImplemented("Sign in")`, which surfaces a 2.4-second toast saying "Sign in — coming soon in this preview." This is not a bug — it is an intentional placeholder for a customer portal that does not yet exist. Decision required: either build a sign-in flow (you already have `web-db-user` features available, so the platform supports it) or hide the pill until you do.

### 2.2 Footer — "Client Login" (Portals column)
Same pattern. The Portals column in the footer has two entries: "Get A Quote" (which routes to /contact, working) and "Client Login" (which toasts "Client Login — preview only"). Same decision applies.

### 2.3 Header NAV items
The header `notImplemented` helper is also defined as a generic fallback for nav items where `type !== "route"`, but in practice **every** nav item in the current `NAV` array is a real route. The fallback is dead code, not a live placeholder. No action needed beyond eventually deleting the helper.

---

## 3. Implied CTAs that need a form (or a real destination)

These are the audit findings worth shipping. Each is a place where the page **promises** the user something that the current button does not actually deliver.

### 3.1 Sample-report download — `/`, hero
The home-page hero has a secondary CTA labeled **"View Sample Report"** that scrolls to `#sample-report`. The Sample Report dialog itself contains a **"Download"** button that downloads a PNG. There is no email-gate on the download. That is fine for a marketing site, but it is a missed conversion opportunity — most B2B SaaS sites wrap sample-report downloads in a 1-field email capture so sales can follow up. Recommendation: either keep the open download (current behavior) or add a one-field "Email me the PDF" form that posts to `/api/contact` with a `[Sample Report Download]` prefix.

### 3.2 Blog newsletter signup — `/blog`
The blog index has 17 published posts and is on a daily-add cadence, but there is **no newsletter signup anywhere on the page or on `/blog/<slug>`**. Background-check buyers reading SEO content are exactly the audience worth capturing into an owned channel. Recommendation: add a single-field email-capture in the right rail of `/blog` and below the body of every `/blog/<slug>` detail page. The form can post to `/api/contact` with a `[Newsletter Signup]` prefix and a `services: ["newsletter"]` tag, no new endpoint needed.

### 3.3 Compliance checklist — PDF download
The `/compliance/checklist` page has a **"Download the PDF"** button that links to `CHECKLIST_PDF_URL`. The asset is real, so this works. But the page also has a checklist scoring widget that, after you fill it in, does **not** offer to email you the score. Recommendation: when a user completes the checklist and reaches a score, surface a "Email me my score and the gap report" form that posts to `/api/contact`.

### 3.4 Industries — sector deep-dive CTAs
Every industry card on `/industries` ends in a **"Build my screening package"** button that links to `/contact?industry=<name>`. This is wired and works. No fix needed — this section is healthy.

### 3.5 Pricing — tier CTAs
All three tier cards on `/pricing` route to `/contact` with prefilled `?tier=&note=` query params, and the Pricing Calculator's "Get this quote in writing" CTA prefills the same form with the full estimate. The sticky estimate bar at the bottom of `/pricing` does the same. **All wired and working.**

| Page / surface | Promise the UI makes | Where it actually goes today | Fix recommended |
|---|---|---|---|
| Home hero | "View Sample Report" → "Download" | Direct PNG download, no capture | Optional 1-field email gate |
| /blog | Implicit: SEO content for buyers | No newsletter signup anywhere | Add 1-field email capture in right rail + below post body |
| /compliance/checklist | Score the checklist | Score is shown, not emailed | Add "Email me my score" CTA after scoring |
| /support#candidate-inquiry | "Skip the call queue" | Form posts cleanly | None — already works |
| Header "Sign in" | Customer portal | Toast placeholder | Build portal or hide pill |
| Footer "Client Login" | Same | Toast placeholder | Same |

---

## 4. Phone, email, and external anchors

The site is rich with `tel:` and `mailto:` anchors. Every one of them was inspected during this audit and resolves to one of three canonical destinations: the support phone number `+1 888 445 3047`, one of three role-specific email addresses (`sales@`, `info@`, `support@`, plus `legal@` and `privacy@`), or one of the deep compliance funnels. None is broken, none links to `#` or to a placeholder. This is the cleanest part of the site's chrome.

---

## 5. Recommended priority order

If the goal is to convert more of the traffic that the daily-blog schedule will start sending in, the highest-leverage fixes in order are:

1. **Add a newsletter capture to `/blog` and `/blog/<slug>`.** Single field, posts to `/api/contact` with a tag. This is the single highest-ROI change because it pairs directly with the daily blog schedule that is already running.
2. **Decide what to do about "Sign in" and "Client Login".** Either build a real portal (you have the `web-db-user` features available) or hide both pills until you do. Toast placeholders on a B2B sales site read as unfinished.
3. **Wrap the Sample Report download in a 1-field email gate.** This is genuinely optional — many companies prefer the friction-free download — but if any part of your sales motion involves outbound to people who showed interest, this is where they show interest.
4. **Add an "Email me my score" CTA to the checklist scoring widget on `/compliance/checklist`.** Small surface, but the people who fill out a 24-point compliance checklist are an unusually qualified audience.

None of these are blocking. The site's core lead-generation path — Home → Pricing → Calculator → Contact, and the parallel /compliance/audit and /support#candidate-inquiry funnels — works end-to-end today.

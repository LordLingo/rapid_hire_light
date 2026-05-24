# Forms & CTAs audit — Rapid Hire Solutions site

_Last verified: 2026-05-23 against checkpoint `0fd403d3` (live: `https://rapidhire-8y99zzzx.manus.space`)._

## Top-line answer

**There are exactly 5 distinct form submission endpoints on the site today,
serving 4 logical inboxes:**

| # | Inbox (logical) | Endpoint | Purpose | Forms feeding it | CTAs pointing at it |
|---|---|---|---|---|---|
| 1 | Sales / quote / contact / audit | Formspree **`mvzyoyoz`** | One unified pipe for everything sales-adjacent. `_subject` line tags each submission so they're sortable in the inbox. | 3 forms (Contact, Get a Quote, Compliance Audit) | ~50 CTAs across 20+ pages |
| 2 | Partner / ATS integrations | Formspree **`xgoqzprv`** | Engineering / partnerships — kept off the sales pipe so reps don't have to triage them. | 1 form (Integrations request) | 1 CTA (the integrations page itself) + the "See how it works" hero in `CtaBanner` (sitewide) |
| 3 | Candidate care | Local Express `POST /api/candidate-contact` | A US-based **candidate-care** specialist responds — explicitly NOT sales. Persisted to JSON store; **no Formspree, no email**. | 1 form (`CandidateContactForm`, embedded twice) | 2 page CTAs (`/support` and `/candidates`) + the footer "For candidates" link + the `/sample-report` cross-link |

So today you actually only need **2 Formspree inboxes** (`mvzyoyoz` + `xgoqzprv`), which is what we already have. Whether you want **more** is a routing question, not a "missing forms" question — see "Recommendation" at the bottom.

---

## Section A — Every form on the site (5 total)

These are the only `<form>` elements on the site. Everything else is a CTA / link that funnels into one of these.

### A1. `client/src/pages/Contact.tsx` — `/contact`
- **Submits to:** `FORMSPREE_ENDPOINT` (= `https://formspree.io/f/mvzyoyoz`)
- **Subject line:** `New contact request — {company}` (or `SHRM 2026 — meeting request — {company}` if `?source=shrm-2026`)
- **Reads from query string:** `subject`, `source`, `services`, plus all UTMs (carried into the payload as a footer line). This is the page that absorbs all the prefilled deep-links from blog CTAs, SHRM CTAs, ROI calculator, ServiceDetail, IndustryDetail, etc.
- **Honeypot:** yes (`_gotcha`)

### A2. `client/src/pages/GetAQuote.tsx` — `/get-a-quote`
- **Submits to:** `FORMSPREE_ENDPOINT` (`mvzyoyoz`) via the back-compat alias `QUOTE_FORMSPREE_ENDPOINT`
- **Subject line:** `New quote request — {company}`
- **Reads from query string:** `industry`, `volume`, `note`/`topic`, `service`/`services`, `tier` (for tier-aware prefills from /pricing tier cards and the calculators)
- **Honeypot:** yes

### A3. `client/src/pages/ComplianceAudit.tsx` — `/compliance/audit`
- **Submits to:** `FORMSPREE_ENDPOINT` (`mvzyoyoz`)
- **Subject line:** `Compliance audit request — {company}` (or `Compliance audit request` if blank)
- **Reads from query string:** none — this is a standalone booking form for the free 15-minute audit
- **Honeypot:** yes
- _Note: Migrated off the legacy `/api/contact` endpoint in §159._

### A4. `client/src/pages/Integrations.tsx` — `/integrations#request-integration`
- **Submits to:** `FORMSPREE_INTEGRATIONS_ENDPOINT` (= `https://formspree.io/f/xgoqzprv`)
- **Subject line:** `Integration request — {ATS name}`
- **Extra fields:** `_source: "Integrations page · /integrations#request-integration"`
- **Honeypot:** yes
- _Lives in a dedicated inbox so partner / ATS requests reach engineering, not sales (§161)._

### A5. `client/src/components/site/CandidateContactForm.tsx` — embedded on `/support` and `/candidates`
- **Submits to:** `POST /api/candidate-contact` (local Express endpoint in `server/index.ts`)
- **Subject line:** N/A — payload validated and appended to a JSON store; no email is sent
- **Honeypot:** none currently
- _This is the **candidate-care** channel. It is intentionally NOT routed to Formspree because employers shouldn't see candidate inquiries land in the sales inbox._

---

## Section B — Every CTA / button that funnels users into a form

CTAs are grouped by which form they ultimately end at. A "deep-link" prefilled CTA (e.g. `/contact?topic=references`) still ends at the same form / inbox — it just arrives with a query string that pre-tags the submission.

### B1. CTAs that land at `/contact` → Formspree `mvzyoyoz`

(33 distinct CTAs across 18 files)

| Page / Component | CTA label | Querystring prefill |
|---|---|---|
| `components/site/Header.tsx` | Top-nav "Contact Us" link | — |
| `components/site/Footer.tsx` | Footer "Contact" link | — |
| `components/site/Hero.tsx` (homepage) | "Start Screening" primary CTA | — |
| `components/site/Faq.tsx` (homepage) | "Talk to a specialist" | — |
| `components/site/ModernScreening.tsx` (homepage) | "Talk to us" | — |
| `components/site/RoiCalculator.tsx` (Pricing) | "Talk to a screener" | `?topic=roi` |
| `components/site/ConferenceStrip.tsx` → `/shrm` → `Shrm.tsx` | "Book your slot" + "Virtual / 'I can't make it'" + final-band CTA | `?subject=SHRM 2026 — request meeting&source=shrm-2026[&slot={id}]` |
| `components/site/ShrmBookingPicker.tsx` (`/shrm`) | "Reserve this slot" | (same as above with `slot=` filled) |
| `pages/About.tsx` | "Get in touch" | — |
| `pages/Compliance.tsx` | Closing dark-band primary | — |
| `pages/ComplianceAudit.tsx` | "Other questions" (secondary alongside the audit form itself) | — |
| `pages/Customers.tsx` | "Request reference" | `?topic=references` |
| `pages/CustomerDetail.tsx` | "Request a reference call" | `?topic=references` |
| `pages/Industries.tsx` (vertical card row) | "Request {industry} pricing" (×6) | `?industry={Industry}` |
| `pages/Industries.tsx` (mid-page closing band) | "Talk to an industry specialist" | — |
| `pages/IndustryDetail.tsx` | "Get a tailored quote" | `?topic=industry` |
| `pages/Integrations.tsx` (form CTAs row) | "General contact" (sibling to the integration request submit button) | — |
| `pages/ResourcesBanTheBox.tsx` | 3 CTAs ("Get a fair-chance ready quote", "Get started", "Talk to a compliance specialist") | — |
| `pages/ResourcesBenchmarks.tsx` | "Talk to a specialist" | `?topic=benchmark` |
| `pages/ResourcesK12ComplianceGuide.tsx` (hero) | "Schedule a district consultation" | `?source=resources&topic=k12-compliance` |
| `pages/ResourcesStatePage.tsx` | 2 CTAs ("Talk to a screener" hero + closing) | — |
| `pages/ServiceDetail.tsx` | "Talk to a screener" | `?service={slug}` |
| `pages/ServiceInternational.tsx` | "Get a tailored quote" | `?topic=international` |
| `pages/Spa.tsx` (`/spa`) | hero primary CTA + final-band CTA | — |
| `pages/Support.tsx` | 4 employer-side CTAs (closing band, mid-page band, inline link, "Send a structured message") | — |
| `pages/Trust.tsx` | "Talk to compliance" | — |
| `components/blog/BlogPostCta.tsx` (every blog post except the `pricing-cost` archetype) | Archetype-aware label, e.g. "Get a quote in 24 hours", "Talk to a healthcare specialist", "Schedule a district consultation", "Set up DOT-compliant screening", "Book a 15-minute switch call" | `?source=blog&archetype={id}&slug={slug}&subject={archetype subject}` |

### B2. CTAs that land at `/get-a-quote` → Formspree `mvzyoyoz` (same inbox)

(8 distinct CTAs across 6 files — all carry tier / volume / industry prefills where appropriate)

| Page / Component | CTA label | Querystring prefill |
|---|---|---|
| `components/site/Header.tsx` | Top-right "Get a Quote" pill (desktop **and** mobile) | — |
| `components/site/Footer.tsx` | Footer "Get A Quote" | — |
| `components/site/PricingCalculator.tsx` (Pricing) | "Get this quote" after estimate | `?services=…&volume=…&tier=…` |
| `components/site/StickyEstimateBar.tsx` (Pricing) | Sticky "Get quote" pill (desktop + mobile) | (same as above) |
| `pages/Pricing.tsx` (3 tier cards + closing band) | "Get an Essential / Professional / Comprehensive quote" + "Get a quote" closing | `?tier={tier}&note=…` |
| `pages/Industries.tsx` (top of vertical grid) | "Get an industry quote" | — |
| `pages/Services.tsx` (closing band) | "Get a quote" | — |

### B3. CTAs that land at `/compliance/audit` → Formspree `mvzyoyoz` (same inbox, audit subject prefix)

(5 distinct CTAs across 5 files)

| Page / Component | CTA label |
|---|---|
| `components/site/Header.tsx` (Resources mega-menu) | "Free 15-min audit" |
| `components/site/Footer.tsx` | "Free 15-min audit" |
| `pages/Compliance.tsx` (data-testid `compliance-cta-audit`) | "Book a free 15-minute audit" |
| `pages/ComplianceChecklist.tsx` (closing dark band) | "Book the free audit" |
| `pages/Trust.tsx` (closing dark band) | "Book the free audit" |
| `pages/ResourcesBanTheBox.tsx` | "Book the free audit" |
| `pages/Resources.tsx` (PILLARS) | Resource-card "Free 15-min audit" tile |

### B4. CTAs that land at the integrations form → Formspree `xgoqzprv`

(2 paths)

| Source | CTA label | Notes |
|---|---|---|
| `components/site/Header.tsx` (top nav) | "Integrations" | Lands on `/integrations`; the request-an-integration form is the primary CTA on that page |
| `components/site/CtaBanner.tsx` (homepage + most marketing pages, the "Switch" closing band) | "See how it works" | Routes to `/integrations` (this is your **highest-traffic** funnel into the integrations inbox — every page that uses `<CtaBanner />` shows it) |

### B5. CTAs that land at the candidate-care form → local `/api/candidate-contact`

(4 paths — all clearly labeled candidate-side)

| Source | CTA label | Notes |
|---|---|---|
| `pages/Support.tsx` | "I'm a candidate / job applicant" tab + the embedded `<CandidateContactForm />` below | The form is on the same page; no redirect |
| `pages/Candidates.tsx` | The embedded `<CandidateContactForm />` is the page's primary action | — |
| `components/site/Footer.tsx` | "For candidates" footer link → `/candidates` | — |
| `pages/SampleReport.tsx` | Footer-of-page nudge "If you're a candidate, go here →" → `/candidates` | — |

---

## Section C — Things that look like forms but aren't

For completeness, since you mentioned not knowing what's there:

- **`tel:` and `mailto:` links** — 28 across 9 files (sales@, info@, privacy@, legal@, support@, compliance@, plus phone numbers). These bypass forms entirely and are not Formspree-eligible.
- **`https://clients.rapidhiresolutions.com/`** — the "Sign in" link in the header (desktop + mobile). External client portal, not a form.
- **`#sample-report` / `#tat` / `#estimate` / `#attestation-pack` / `#checklist`** — anchor links to in-page sections; not forms.
- **Resources hub PDF download buttons** (`/resources/k12-compliance-guide` PDF, Integrations API docs PDF, snippets ZIP) — client-side downloads, no submission, no inbox.
- **Pricing calculator + ROI calculator** — client-side calculators only; the only thing that ever leaves the browser is the eventual CTA into `/get-a-quote` or `/contact`.

---

## Section D — Recommendation: how many Formspree inboxes do you actually need?

You currently have 2 (`mvzyoyoz` + `xgoqzprv`). Here are the realistic options, ordered from "do nothing" to "fully siloed":

### Option 1 — Keep 2 inboxes (current state). Cost: $0 / 0 effort.
- **`mvzyoyoz`** = sales firehose. Sort by `_subject` line which already contains `New contact request`, `New quote request`, `Compliance audit request`, or `SHRM 2026 — meeting request`.
- **`xgoqzprv`** = integrations.
- Pros: simplest, least to maintain, all sales context lives in one searchable inbox.
- Cons: high volume; one human triages everything sales-adjacent.

### Option 2 — Split sales into 3 inboxes (recommended if any of the three has real volume).
- **Sales/quote inbox** (existing `mvzyoyoz`, possibly renamed): everything from `Contact.tsx` and `GetAQuote.tsx`.
- **Compliance-audit inbox** (new): just `ComplianceAudit.tsx`. The audit booking is a different funnel — it's a meeting request, not a quote — and it's usually claimed by a compliance specialist rather than a sales rep.
- **Integrations inbox** (existing `xgoqzprv`): unchanged.
- Effort: ~10 minutes — add `FORMSPREE_AUDIT_ENDPOINT` to `client/src/lib/formspree.ts`, swap the import in `ComplianceAudit.tsx`, update `formspree.test.ts` ring-fence.

### Option 3 — Split sales further into 4 inboxes (only if the team is structured around it).
- **Quote / pricing inbox** (new): just `GetAQuote.tsx` (incoming from Pricing tier cards, calculators, sticky bar).
- **Contact / general inbox** (existing `mvzyoyoz`, narrowed): everything from `Contact.tsx`, including blog CTAs and SHRM bookings.
- **Compliance-audit inbox** (new): as above.
- **Integrations inbox** (existing `xgoqzprv`).
- Effort: ~15 minutes — same pattern.

### Option 4 — Add a SHRM-specific inbox (only if SHRM 2026 is being run by an event team, not the sales team).
- Stand up a Formspree id e.g. `shrm-2026` and wire a `FORMSPREE_SHRM_ENDPOINT` constant. Modify `Contact.tsx` to post to it whenever `cameFromShrm === true` (the page already detects this).
- Otherwise, the `_subject = SHRM 2026 — meeting request — {company}` tag is already enough to filter on.

### Option 5 — Add a candidate-care Formspree inbox (only if you want to retire the local Express endpoint).
- Today candidate inquiries are persisted to a JSON file on disk and you have to actively check the file. If you want them as email like everything else, add `FORMSPREE_CANDIDATE_ENDPOINT` and switch `CandidateContactForm.tsx` to it.
- _Caveat: candidate PII must NOT land in the sales inbox. This MUST be a separate Formspree id, not a reuse of `mvzyoyoz`._

### My honest take
- **You probably need 3 inboxes, not 5**: keep `xgoqzprv`, split the audit out of `mvzyoyoz` into its own id (Option 2). The audit form is the only one of the three sales forms with a different SLA and a different owner (a compliance specialist) — so getting it out of the firehose is the highest-leverage move.
- **Don't split SHRM 2026** unless the event has its own owner — the subject-line filter is already doing that work.
- **Don't move candidate-care to Formspree** unless you specifically want it as email; the local store + sub-day SLA is a fine pattern as long as someone is checking it.

If you tell me which of these options you want, I'll wire it up — usually 10 to 20 minutes per new inbox including tests.

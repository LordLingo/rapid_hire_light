/*
  §111 — Dedicated /get-a-quote page (Editorial Calm style).
  Modeled on https://www.precisehire.com/get-a-quote inspiration page:
    - Hero rail (left) with promise lede + bullet list + response-time card
    - Form rail (right) with First/Last name, Work email, Phone, Company,
      Role, Industry select, Monthly volume select, services-needed
      checkboxes (10 options), ATS select, Timeline select, free-text
      textarea, and a primary "Get my quote" pill.
  Submission: JSON POST to https://formspree.io/f/mvzyoyoz with
    `Accept: application/json` so Formspree returns structured JSON.
    Honeypot field `_gotcha` (hidden) suppresses bot submissions.
  Pre-fill: query string `service=` (csv of slugs from ServiceDetail),
    `industry=`, `volume=`, `note=`, `topic=` — same convention as the
    pricing calculator → contact pre-fill flow (§19/§105).
  Design tokens reuse the same hairline-underline form fields used on
    Contact.tsx so the two surfaces feel like siblings.
*/
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearch } from "wouter";
import { ArrowRight, ArrowUpRight, Check, Clock3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SiteShell from "@/components/site/SiteShell";
import "@/components/site/homepage-quote-redesign.css";
import { useSeo } from "@/hooks/useSeo";
import {
  initTracking,
  loadTrackingParams,
  type TrackingParams,
} from "@/lib/staffingLp";
// §134: shared field-level validation — surfaces inline red borders
// (.form-field--invalid) and short helper text per field instead of a
// single page-level toast for missing data.
import {
  validateFields,
  hasErrors,
  clearFieldError,
  type FieldErrors,
} from "@/lib/formValidation";
// §159 — Endpoint centralized in @/lib/formspree. Re-exported under the
// original name so the existing §111 tests + downstream importers keep
// working without a rename.
import { FORMSPREE_ENDPOINT } from "@/lib/formspree";
// §209 — Direct HubSpot Forms API submission. Fires in parallel with
// the Formspree submission so the form is wired to HubSpot end-to-end
// even if the Formspree → HubSpot integration mapping is incomplete.
// §210 — formatQuoteRequestDetails bundles the compound fields
// (role, volume, services, ATS, timeline, message) into a single
// multi-line summary that lands in the `quote_request_details` custom
// HubSpot property, replacing five would-be separate properties with one.
import {
  buildHubspotFields,
  formatQuoteRequestDetails,
  readHubspotUtkCookie,
  submitToHubspot,
} from "@/lib/hubspotForm";

/** Formspree endpoint for quote requests (provided by site owner). */
export const QUOTE_FORMSPREE_ENDPOINT = FORMSPREE_ENDPOINT;

/** Industries shown in the Industry select. Matches /industries hub. */
export const QUOTE_INDUSTRIES = [
  "Healthcare",
  "Transportation & Logistics",
  "Staffing & Light Industrial",
  "Manufacturing & Skilled Trades",
  "Finance & Insurance",
  "Retail & Hospitality",
  "Nonprofit / Public Sector",
  "Other",
];

/** Monthly volume buckets (CRA-typical breakpoints). */
export const QUOTE_VOLUMES = [
  "1–25 checks / month",
  "26–100 checks / month",
  "101–500 checks / month",
  "501–1,500 checks / month",
  "1,500+ checks / month",
];

/** Service checkboxes — must mirror what ServiceDetail.slug values map to. */
export const QUOTE_SERVICES = [
  { id: "county-criminal", label: "County criminal" },
  { id: "national-criminal", label: "Statewide / national criminal" },
  { id: "mvr", label: "MVR (motor vehicle)" },
  { id: "employment-verification", label: "Employment verification" },
  { id: "education-verification", label: "Education verification" },
  { id: "professional-license", label: "Professional license verification" },
  { id: "dot-drug-alcohol", label: "DOT drug & alcohol" },
  { id: "non-dot-drug", label: "Non-DOT drug screen" },
  { id: "oig-sam", label: "OIG / SAM exclusion monitoring" },
  { id: "i9-everify", label: "I-9 / E-Verify" },
] as const;

/** ATS / system-of-record options. */
export const QUOTE_ATS_OPTIONS = [
  "Bullhorn",
  "Avionté",
  "Workday",
  "Greenhouse",
  "iCIMS",
  "ApplicantStack",
  "JazzHR",
  "Other / not sure",
  "No ATS — direct portal use",
];

/** Timeline options. */
export const QUOTE_TIMELINES = [
  "Hiring this week",
  "Hiring this month",
  "Switching providers in the next 60–90 days",
  "Research / planning",
];

/**
 * Map a calculator addon id (or ServiceDetail slug) to a QUOTE_SERVICES id.
 * Mirrors §19 calculator → contact pre-fill so deep links from the pricing
 * calculator land on this page with the right boxes already checked.
 */
export const QUOTE_SERVICE_ALIASES: Record<string, string> = {
  county: "county-criminal",
  federal: "national-criminal",
  national: "national-criminal",
  mvr: "mvr",
  employment: "employment-verification",
  "employment-verification": "employment-verification",
  education: "education-verification",
  "education-verification": "education-verification",
  drug5: "non-dot-drug",
  "drug-screening": "non-dot-drug",
  "professional-license": "professional-license",
  "criminal-background-checks": "national-criminal",
  "driving-record-checks-mvr": "mvr",
  "international-background-checks": "national-criminal",
};

const DEMO_URL =
  "https://meetings.hubspot.com/david-keller/hirequest-rhs-meeting";

export default function GetAQuote() {
  const search = useSearch();
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.rapidhiresolutions.com";

  useSeo({
    title: "Get a Background Check Quote | Rapid Hire Solutions",
    description:
      "Tell us your hiring volume and screening needs. Get a clear, line-itemized background screening quote from Rapid Hire Solutions.",
    canonical: `${origin}/get-a-quote`,
    image: `${origin}/static/rhs5-og-card.png`,
    ogType: "website",
  });
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const prefillIndustry = params.get("industry") ?? "";
  const prefillVolume = params.get("volume") ?? "";
  const prefillNote = params.get("note") ?? params.get("topic") ?? "";
  const prefillServiceIds = (params.get("service") ?? params.get("services") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((id) => QUOTE_SERVICE_ALIASES[id] ?? id)
    .filter((id) => QUOTE_SERVICES.some((s) => s.id === id));
  const prefillSet = useMemo(
    () => Array.from(new Set(prefillServiceIds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  const [services, setServices] = useState<string[]>(prefillSet);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // §134: per-field inline errors. Keyed by `name` attribute so the
  // markup binding stays trivial. Cleared on input/change.
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [tracking, setTracking] = useState<TrackingParams>(() =>
    initTracking(search),
  );
  // §216 — Ref to the success-state panel. After a successful submit
  // the form unmounts and the success panel mounts in-place, but the
  // user's scroll position is left at the bottom of the (now-vanished)
  // form fields — leaving them staring at empty whitespace and footer
  // links and believing the form did nothing. The post-submit effect
  // below scrolls this panel into view so the "Quote request received"
  // confirmation is what they actually see after pressing the button.
  const successRef = useRef<HTMLDivElement | null>(null);

  // Re-sync if user navigates between pre-fills within the SPA.
  useEffect(() => {
    if (prefillSet.length) setServices(prefillSet);
  }, [prefillSet]);

  useEffect(() => {
    setTracking(initTracking(search));
  }, [search]);

  // §216 — Scroll the success-state confirmation panel into view as soon
  // as `submitted` flips to true. Without this the form node unmounts
  // in place and the user (who was scrolled near the submit button at
  // the bottom of the form) is left looking at empty space — the new
  // panel renders ~600px above their current scroll position. Using
  // `block: "center"` (instead of `start`) keeps the eyebrow row and
  // hero context visible above the panel, which reads more like a
  // deliberate confirmation state than a hard jump. `behavior: "smooth"`
  // makes the transition obviously deliberate so the user perceives
  // their click as having had an effect.
  useEffect(() => {
    if (!submitted) return;
    // requestAnimationFrame defers the scroll until after React has
    // committed the success panel to the DOM — otherwise the ref is
    // still null on the same tick that `submitted` becomes true.
    const id = requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      successRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [submitted]);

  function toggleService(id: string) {
    setServices((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    // Honeypot — if filled, silently swallow.
    if (String(fd.get("_gotcha") ?? "").trim().length > 0) {
      setSubmitted(true);
      return;
    }
    // §134: client-side required + email validation BEFORE the network call.
    const validationValues = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      volume: String(fd.get("volume") ?? ""),
    };
    const errs = validateFields(validationValues, {
      requiredFields: [
        "firstName",
        "lastName",
        "email",
        "company",
        "industry",
        "volume",
      ],
      emailFields: ["email"],
    });
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      const firstName = Object.keys(errs)[0];
      const firstEl = formEl.elements.namedItem(firstName) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      firstEl?.focus();
      return;
    }
    const company = String(fd.get("company") ?? "").trim();
    const serviceLabels = QUOTE_SERVICES.filter((s) => services.includes(s.id))
      .map((s) => s.label)
      .join(", ");
    const effectiveTracking = {
      ...loadTrackingParams(),
      ...tracking,
    };
    const payload = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company,
      role: String(fd.get("role") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      volume: String(fd.get("volume") ?? ""),
      services: serviceLabels,
      ats: String(fd.get("ats") ?? ""),
      timeline: String(fd.get("timeline") ?? ""),
      message: String(fd.get("message") ?? ""),
      // §208 — HubSpot lead-source attribution. Read from the hidden
      // <input name="lead_source"> in the form so the JSON payload that
      // actually ships to Formspree carries the value (the hand-rolled
      // payload object above does NOT auto-include FormData fields).
      // Falls back to the literal default so a stripped-down /get-a-quote
      // call still enrolls in the HubSpot "Get Started Form" workflow.
      lead_source: String(fd.get("lead_source") ?? "Get Started Form"),
      _subject: company
        ? `New quote request — ${company}`
        : "New quote request",      ...effectiveTracking,

      // §215 — NOTE: do NOT add a `_cc` field here. The owner-requested
      // partner-recipient distribution (Mark / Arthur / Stewart) is now
      // managed inside the Formspree Workflow dashboard for form
      // `mvzyoyoz` (Linked Emails + per-recipient Email actions). Adding
      // `_cc` here in addition would duplicate those addresses across
      // SendGrid's `to`/`cc` personalization block and the underlying
      // SendGrid backend rejects the send with: "Each email address in
      // the personalization block should be unique between to, cc, and
      // bcc." — which is exactly what happened on §212. Recipients are
      // intentionally a Formspree-side concern from §215 onward; if the
      // partner list changes, update it in the Formspree dashboard, not
      // in this payload.
    };
    setSubmitting(true);

    /*
      §209/§210 — Fire-and-forget HubSpot Forms API submission.

      Runs in parallel with the Formspree POST below. We DO NOT await it
      in a way that blocks the user's success state — if HubSpot
      rejects the payload (missing custom property, invalid dropdown
      enum, etc.), we want the user to still get the success toast off
      the Formspree path while we log the HubSpot diagnostic to the
      console for engineering follow-up.

      Top-line fields go to HubSpot's STANDARD contact-property internal
      names (firstname, lastname, email, phone, company, industry,
      lead_source) so they remain filterable and segmentable in HubSpot.
      The five compound fields (role, hiring volume, services of interest,
      ATS in use, timeline) plus the free-text message are bundled into
      a single multi-line summary that lands in ONE custom long-text
      property `quote_request_details` — see formatQuoteRequestDetails().
      This avoids needing five separate custom HubSpot properties for
      one-off form data while keeping the full submission visible to
      sales on the contact record.
    */
    const quoteDetails = formatQuoteRequestDetails({
      role: payload.role,
      volume: payload.volume,
      services: payload.services,
      ats: payload.ats,
      timeline: payload.timeline,
      message: payload.message,
      sourcePageUri:
        typeof window !== "undefined" ? window.location.href : undefined,
    });
    const hubspotFields = buildHubspotFields({
      firstname: payload.firstName,
      lastname: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      industry: payload.industry,
      lead_source: payload.lead_source,
      quote_request_details: quoteDetails,
    });
    const hubspotPromise = submitToHubspot({
      fields: hubspotFields,
      context: {
        pageUri:
          typeof window !== "undefined" ? window.location.href : undefined,
        pageName: "Get a Quote — Rapid Hire Solutions",
        hutk: readHubspotUtkCookie(),
      },
    }).then((result) => {
      // Surface non-2xx HubSpot responses to the dev console so future
      // missing-property errors are visible without breaking the user.
      if (!result.ok && typeof console !== "undefined") {
        console.warn("[HubSpot Forms] non-2xx response", result);
      }
      return result;
    });
    // Mark the promise as intentionally not awaited — this prevents an
    // unhandled-rejection warning if HubSpot's fetch ever rejects.
    void hubspotPromise.catch(() => {});

    try {
      const resp = await fetch(QUOTE_FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await resp
        .json()
        .catch(() => ({}))) as { ok?: boolean; errors?: Array<{ message?: string }> };
      if (!resp.ok) {
        const msg =
          data?.errors?.[0]?.message ||
          `Submission failed (${resp.status}). Please try again.`;
        setError(msg);
        toast.error(msg);
        return;
      }
      setSubmitted(true);
      toast.success("Quote request received — a U.S.-based specialist will reply same business day.");
    } catch {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteShell>
      <main className="quote-conversion-page">
        <section className="quote-conversion-hero" aria-labelledby="quote-page-heading">
          <div className="container quote-conversion-grid">
            <div className="quote-conversion-intro quote-enter">
              <p className="conversion-eyebrow">Custom screening quote</p>
              <h1 id="quote-page-heading">Get a screening plan built around how you hire.</h1>
              <p className="quote-conversion-lede">
                Tell us your hiring volume, role mix, and screening needs. A
                Rapid Hire specialist will review your request and send a clear,
                line-itemized recommendation.
              </p>
              <div className="quote-response-proof">
                <Clock3 aria-hidden="true" />
                <div>
                  <strong>A real quote in one business day.</strong>
                  <span>Submitted requests are reviewed by a screening specialist.</span>
                </div>
              </div>

              <div className="quote-receive-list">
                <h2>A quote you can actually evaluate.</h2>
                <ul>
                  {[
                    "A recommended package based on your roles",
                    "Clear, line-item pricing",
                    "Options for implementation and integrations",
                    "Answers to timing and screening questions",
                  ].map((item) => (
                    <li key={item}><Check aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="quote-form-column quote-enter quote-enter-delay">
              {submitted ? (
                <div
                  ref={successRef}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                  data-testid="quote-success"
                  className="quote-success-card"
                >
                  <div className="quote-success-icon"><Check aria-hidden="true" /></div>
                  <h2>Quote request received.</h2>
                  <p>
                    A U.S.-based specialist will reply the same business day
                    with a tailored, line-itemized quote. No sales auto-sequences.
                  </p>
                  <Link href="/" className="conversion-text-link">
                    Back to home
                    <ArrowUpRight aria-hidden="true" className="conversion-arrow" />
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="quote-form-card"
                  noValidate
                  aria-labelledby="quote-form-heading"
                  data-testid="quote-form"
                  onChange={(event) => {
                    const target = event.target as
                      | HTMLInputElement
                      | HTMLTextAreaElement
                      | HTMLSelectElement;
                    if (target?.name && fieldErrors[target.name]) {
                      setFieldErrors((current) =>
                        clearFieldError(current, target.name),
                      );
                    }
                  }}
                >
                  <div className="quote-form-heading">
                    <p className="conversion-eyebrow">Your hiring profile</p>
                    <h2 id="quote-form-heading">Tell us about your hiring needs.</h2>
                    <p>Required fields are marked with an asterisk.</p>
                  </div>

                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    className="quote-honeypot"
                    aria-hidden="true"
                  />
                  <input
                    type="hidden"
                    name="lead_source"
                    value="Get Started Form"
                    data-testid="quote-lead-source"
                  />
                  {Object.entries(tracking).map(([name, value]) => (
                    <input
                      key={name}
                      type="hidden"
                      name={name}
                      value={value ?? ""}
                      data-tracking-field={name}
                    />
                  ))}

                  <fieldset className="quote-fieldset">
                    <legend>Contact information</legend>
                    <div className="quote-field-grid">
                      <Field label="First name" name="firstName" required autoComplete="given-name" error={fieldErrors.firstName} />
                      <Field label="Last name" name="lastName" required autoComplete="family-name" error={fieldErrors.lastName} />
                      <Field label="Work email" name="email" type="email" required autoComplete="email" error={fieldErrors.email} />
                      <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
                      <Field label="Company" name="company" required autoComplete="organization" error={fieldErrors.company} />
                      <Field label="Your role / title" name="role" autoComplete="organization-title" />
                    </div>
                  </fieldset>

                  <fieldset className="quote-fieldset">
                    <legend>Hiring profile</legend>
                    <div className="quote-field-grid">
                      <SelectField label="Industry" name="industry" defaultValue={prefillIndustry} options={QUOTE_INDUSTRIES} required error={fieldErrors.industry} />
                      <SelectField label="Monthly hiring volume" name="volume" defaultValue={prefillVolume} options={QUOTE_VOLUMES} required error={fieldErrors.volume} />
                      <SelectField label="ATS / system of record" name="ats" options={QUOTE_ATS_OPTIONS} />
                      <SelectField label="Timeline" name="timeline" options={QUOTE_TIMELINES} />
                    </div>
                  </fieldset>

                  <fieldset className="quote-fieldset" data-testid="quote-services">
                    <legend>Screening needs</legend>
                    <p className="quote-fieldset-help">Which checks do you need? Select all that apply.</p>
                    <div className="quote-service-grid">
                      {QUOTE_SERVICES.map((service) => {
                        const active = services.includes(service.id);
                        return (
                          <label
                            key={service.id}
                            className={[
                              "quote-service-option",
                              active ? "is-selected" : "",
                            ].filter(Boolean).join(" ")}
                          >
                            <input
                              type="checkbox"
                              name="services-checkbox"
                              value={service.id}
                              checked={active}
                              onChange={() => toggleService(service.id)}
                              data-testid={`quote-service-${service.id}`}
                            />
                            <span aria-hidden="true" className="quote-service-check">
                              {active ? <Check /> : null}
                            </span>
                            <span>{service.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="quote-message-field">
                      <label htmlFor="quote-message">
                        Anything else? (states you hire in, specific role types,
                        current provider)
                      </label>
                      <textarea
                        id="quote-message"
                        name="message"
                        rows={4}
                        defaultValue={prefillNote}
                        placeholder="Optional — but the more you share, the more accurate the quote."
                        className="form-field"
                      />
                    </div>
                  </fieldset>

                  {error && (
                    <p role="alert" className="quote-submit-error">{error}</p>
                  )}

                  <p className="quote-consent">
                    By submitting, you agree to be contacted about Rapid Hire
                    Solutions services. We never share your details. No sales
                    auto-sequences — one real specialist emails you back.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="quote-submit"
                    className="conversion-button conversion-button-primary quote-submit-button"
                  >
                    {submitting ? (
                      <>
                        Sending
                        <Loader2 aria-hidden="true" className="quote-submit-loader" />
                      </>
                    ) : (
                      <>
                        Get My Custom Quote
                        <ArrowUpRight aria-hidden="true" className="conversion-arrow" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <aside className="quote-next-panel reveal-on-scroll" aria-labelledby="quote-next-heading">
              <p className="conversion-eyebrow">What happens next</p>
              <h2 id="quote-next-heading">A clear recommendation, without the sales runaround.</h2>
              <ol>
                <li><span>01</span><p>We review your hiring needs.</p></li>
                <li><span>02</span><p>We recommend the right screening package.</p></li>
                <li><span>03</span><p>A screening specialist follows up with pricing and implementation options.</p></li>
              </ol>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a 15-Minute Demo (opens in a new tab)"
                className="conversion-text-link"
              >
                Prefer to talk now? Book a 15-Minute Demo
                <ArrowUpRight aria-hidden="true" className="conversion-arrow" />
              </a>
            </aside>
          </div>
        </section>

        <section className="quote-faq-section" aria-labelledby="quote-faq-heading">
          <div className="container">
            <div className="conversion-heading reveal-on-scroll">
              <p className="conversion-eyebrow">Before you request a quote</p>
              <h2 id="quote-faq-heading">Three common questions.</h2>
            </div>
            <div className="quote-faq-grid">
              <article className="reveal-on-scroll">
                <h3>How quickly will I receive my quote?</h3>
                <p>Requests submitted during business hours are answered the same business day. After-hours requests are reviewed the next business morning.</p>
              </article>
              <article className="reveal-on-scroll">
                <h3>Can Rapid Hire work with our ATS?</h3>
                <p>Rapid Hire supports established ATS and HRIS integrations. Include your system in the form and a specialist will confirm the right implementation option.</p>
              </article>
              <article className="reveal-on-scroll">
                <h3>Can packages be customized by role?</h3>
                <p>Yes. Your recommendation can match screening services to the roles, industry, and hiring workflow you describe.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  className,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  /** §134 — inline error message to surface beneath the field. */
  error?: string;
}) {
  const fieldId = `quote-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}{required ? " *" : ""}
      </label>
      <input
        id={fieldId}
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={["form-field", error ? "form-field--invalid" : ""]
          .filter(Boolean)
          .join(" ")}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
  defaultValue,
  className,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  defaultValue?: string;
  className?: string;
  /** §134 — inline error message to surface beneath the field. */
  error?: string;
}) {
  const fieldId = `quote-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}{required ? " *" : ""}
      </label>
      <select
        id={fieldId}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={["form-field", error ? "form-field--invalid" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

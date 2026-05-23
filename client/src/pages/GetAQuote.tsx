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
import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { ArrowUpRight, Mail, Phone, Check, Loader2, Clock, Timer } from "lucide-react";
import { LAST_QUOTE_TURNAROUND } from "@/lib/lastQuoteTurnaround";
import { toast } from "sonner";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { ContactCallCard } from "@/components/heroes/HeroCards";
import HeroMiniStats from "@/components/heroes/HeroMiniStats";
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

export default function GetAQuote() {
  const search = useSearch();
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

  // Re-sync if user navigates between pre-fills within the SPA.
  useEffect(() => {
    if (prefillSet.length) setServices(prefillSet);
  }, [prefillSet]);

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
      _subject: company
        ? `New quote request — ${company}`
        : "New quote request",
    };
    setSubmitting(true);
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
      <PageHero
        eyebrow="03 — Get a quote"
        title={
          <>
            A real{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              quote
            </span>
            . In one business day.
          </>
        }
        lede="No 'talk to sales' runaround. Tell us your volume, role mix, and ATS — a U.S.-based specialist will email back a transparent, line-itemized quote the same business day. SOC 2 Type II · PBSA · FCRA-aligned."
        visual={<ContactCallCard />}
        belowVisual={<HeroMiniStats page="contact" />}
      />

      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-12">
            {/* Left rail */}
            <aside
              className="col-span-12 lg:col-span-4 reveal-on-scroll"
              data-testid="quote-promise-rail"
            >
              <p className="eyebrow">04 — What's in the quote</p>
              <div className="mt-3 hairline" />

              {/* §113: owner-editable last-quote-turnaround social-proof chip.
                  Source: client/src/data/lastQuoteTurnaround.json. Auto-hides
                  if the recorded measurement is stale (default >7 days). */}
              {LAST_QUOTE_TURNAROUND.isFresh && (
                <div
                  data-testid="quote-last-turnaround-chip"
                  role="status"
                  aria-live="polite"
                  className="mt-6 inline-flex items-start gap-3 rounded-full border border-border bg-[color:var(--color-tint)] pl-3 pr-4 py-2"
                >
                  <Timer
                    className="size-4 mt-0.5 text-[color:var(--color-accent-ink)]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <div className="text-[12.5px] leading-tight">
                    <span className="uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Last quote turnaround
                    </span>
                    <span className="mx-1.5 text-[color:var(--color-ink-muted)]">:</span>
                    <strong className="text-[color:var(--color-ink)]">
                      {LAST_QUOTE_TURNAROUND.display}
                    </strong>
                    <span className="block mt-1 text-[11.5px] tracking-wide text-[color:var(--color-ink-muted)]">
                      {LAST_QUOTE_TURNAROUND.subline}
                    </span>
                  </div>
                </div>
              )}

              <ul className="mt-8 space-y-4 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                <li className="flex items-start gap-3">
                  <Check className="size-4 mt-1 text-[color:var(--color-accent-ink)]" strokeWidth={2.25} />
                  <span><strong className="text-[color:var(--color-ink)]">Quote in writing</strong> — no verbal-only pricing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-4 mt-1 text-[color:var(--color-accent-ink)]" strokeWidth={2.25} />
                  <span><strong className="text-[color:var(--color-ink)]">Itemized by check type</strong> so you see exactly what each report costs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-4 mt-1 text-[color:var(--color-accent-ink)]" strokeWidth={2.25} />
                  <span><strong className="text-[color:var(--color-ink)]">Volume discounts shown up front</strong> (kick in at 50 checks / month)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-4 mt-1 text-[color:var(--color-accent-ink)]" strokeWidth={2.25} />
                  <span><strong className="text-[color:var(--color-ink)]">Setup fee: $0.</strong> Minimums: none.</span>
                </li>
              </ul>

              <div className="hover-lift-card mt-10 rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.75} />
                  <p className="eyebrow !mt-0">Response time</p>
                </div>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  Same business day during business hours (Mon–Fri, 8a–8p CT).
                  After-hours requests are answered the next business morning.
                </p>
                <div className="mt-5 space-y-2 text-[14px]">
                  <p className="flex items-center gap-2 text-[color:var(--color-ink)]">
                    <Phone className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.5} />
                    <a className="ink-link" href="tel:+18884453047">(888) 445-3047</a>
                  </p>
                  <p className="flex items-center gap-2 text-[color:var(--color-ink)]">
                    <Mail className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.5} />
                    <a className="ink-link" href="mailto:sales@rapidhiresolutions.com">sales@rapidhiresolutions.com</a>
                  </p>
                </div>
              </div>

              <p className="mt-8 text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                SOC 2 Type II · PBSA · FCRA-aligned
              </p>
            </aside>

            {/* Form */}
            <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
              {submitted ? (
                <div
                  data-testid="quote-success"
                  className="rounded-[20px] border border-border bg-[color:var(--color-paper)] px-8 py-16 text-center"
                >
                  <div className="mx-auto grid place-items-center size-12 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                    <Check className="size-5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-6 font-display text-[32px] leading-tight text-[color:var(--color-ink)]">
                    Quote request received.
                  </h3>
                  <p className="mt-3 max-w-md mx-auto text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    A U.S.-based specialist will reply the same business day
                    with a tailored, line-itemized quote. No sales auto-sequences.
                  </p>
                  <Link
                    href="/"
                    className="ink-link mt-8 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
                  >
                    Back to home
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="grid gap-10"
                  noValidate
                  data-testid="quote-form"
                  onChange={(e) => {
                    // §134: clear an individual field's error as soon as
                    // the user edits it.
                    const target = e.target as
                      | HTMLInputElement
                      | HTMLTextAreaElement
                      | HTMLSelectElement;
                    if (target?.name && fieldErrors[target.name]) {
                      setFieldErrors((cur) => clearFieldError(cur, target.name));
                    }
                  }}
                >
                  {/* Honeypot — hidden from real users, picked up by bots */}
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-12 gap-x-8 gap-y-8">
                    <Field label="First name" name="firstName" required autoComplete="given-name" className="col-span-12 md:col-span-6" error={fieldErrors.firstName} />
                    <Field label="Last name" name="lastName" required autoComplete="family-name" className="col-span-12 md:col-span-6" error={fieldErrors.lastName} />
                    <Field label="Work email" name="email" type="email" required autoComplete="email" className="col-span-12 md:col-span-6" error={fieldErrors.email} />
                    <Field label="Phone" name="phone" type="tel" autoComplete="tel" className="col-span-12 md:col-span-6" />
                    <Field label="Company" name="company" required autoComplete="organization" className="col-span-12 md:col-span-6" error={fieldErrors.company} />
                    <Field label="Your role / title" name="role" autoComplete="organization-title" className="col-span-12 md:col-span-6" />

                    <SelectField
                      label="Industry"
                      name="industry"
                      defaultValue={prefillIndustry}
                      options={QUOTE_INDUSTRIES}
                      required
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.industry}
                    />
                    <SelectField
                      label="Monthly hiring volume"
                      name="volume"
                      defaultValue={prefillVolume}
                      options={QUOTE_VOLUMES}
                      required
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.volume}
                    />
                  </div>

                  <div data-testid="quote-services">
                    <p className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Which checks do you need? (select all that apply)
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {QUOTE_SERVICES.map((s) => {
                        const active = services.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className={[
                              "btn-press text-[14px] rounded-full border px-4 py-2.5 transition-colors cursor-pointer flex items-center gap-2.5",
                              active
                                ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                                : "border-border bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]",
                            ].join(" ")}
                          >
                            <input
                              type="checkbox"
                              name="services-checkbox"
                              value={s.id}
                              checked={active}
                              onChange={() => toggleService(s.id)}
                              className="sr-only"
                              data-testid={`quote-service-${s.id}`}
                            />
                            <span
                              aria-hidden
                              className={[
                                "grid place-items-center size-4 rounded-[4px] border shrink-0",
                                active
                                  ? "border-white bg-white text-[color:var(--color-accent-ink)]"
                                  : "border-[color:var(--color-rule)] bg-white",
                              ].join(" ")}
                            >
                              {active ? <Check className="size-3" strokeWidth={3} /> : null}
                            </span>
                            <span>{s.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-x-8 gap-y-8">
                    <SelectField
                      label="ATS / system of record"
                      name="ats"
                      options={QUOTE_ATS_OPTIONS}
                      className="col-span-12 md:col-span-6"
                    />
                    <SelectField
                      label="Timeline"
                      name="timeline"
                      options={QUOTE_TIMELINES}
                      className="col-span-12 md:col-span-6"
                    />
                  </div>

                  <div>
                    <label className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Anything else? (states you hire in, specific role types, current provider)
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      defaultValue={prefillNote}
                      placeholder="Optional — but the more you share, the more accurate the quote."
                      className="form-field"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-[13px] text-red-600 -mt-4">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-[12px] text-[color:var(--color-ink-muted)] max-w-md">
                      By submitting, you agree to be contacted about Rapid Hire
                      Solutions services. We never share your details. No sales
                      auto-sequences — one real specialist emails you back.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      data-testid="quote-submit"
                      className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          Sending
                          <Loader2 className="size-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Get my quote
                          <ArrowUpRight className="size-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
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

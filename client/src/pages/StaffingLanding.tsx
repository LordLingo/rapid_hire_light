/*
  §218 — Standalone staffing-only Google Ads landing page (/lp/staffing).

  WHY THIS IS NOT A NORMAL SITE PAGE
  ----------------------------------
  This is a paid-traffic conversion LP, deliberately decoupled from the
  marketing site chrome:
    - It does NOT use SiteShell / the global Header / Footer / SHRM
      announcement strip / mega-nav. Those exist to keep visitors browsing;
      a Google Ads LP must keep the visitor on a single decision (submit
      the lead form). Instead it renders its own minimal sticky header
      (logo + ONE phone CTA) and a slim legal footer.
    - It does NOT reuse the homepage "spa" hero artwork or the spa
      metaphor. This page is purely about staffing-firm background screening.
    - It is staffing-vertical only (light industrial, healthcare, clerical,
      driver/logistics, hospitality, high-volume seasonal).

  PLACEHOLDER STATS POLICY (per the brief)
  ----------------------------------------
  We must NOT invent turnaround / accuracy / savings / client-count numbers.
  Every quantitative claim is rendered as a bracketed [PLACEHOLDER] token via
  the <Stat> helper so the marketing team can fill real, substantiated
  figures before launch. The savings calculator uses the VISITOR'S OWN
  inputs plus a clearly-labeled, editable "assumed saving per check"
  assumption — it never asserts a Rapid Hire savings figure.

  LEAD FORM
  ---------
  Reuses the exact §111/§209/§210 plumbing as /get-a-quote: JSON POST to the
  shared Formspree sales inbox + a parallel fire-and-forget HubSpot Forms API
  submission, shared inline validation, honeypot, and a success-state swap.
  Adds hidden utm_source/medium/campaign/term + gclid fields captured from
  the landing URL (and persisted to sessionStorage so they survive an
  in-SPA navigation), plus a Google Ads conversion hook (placeholder
  send_to) fired on successful submit.
*/
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearch } from "wouter";
import {
  ArrowUpRight,
  Check,
  Loader2,
  Phone,
  Clock,
  Gauge,
  DollarSign,
  HeartHandshake,
  Headset,
  ClipboardList,
  Send,
  Activity,
  FileCheck2,
  ShieldCheck,
  Truck,
  Stethoscope,
  HardHat,
  Briefcase,
  UtensilsCrossed,
  CalendarRange,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { HEADER_LOGO_URL, BRAND_NAME } from "@shared/brand";
import { useSeo } from "@/hooks/useSeo";
import { FORMSPREE_ENDPOINT } from "@/lib/formspree";
import {
  validateFields,
  hasErrors,
  clearFieldError,
  type FieldErrors,
} from "@/lib/formValidation";
import {
  buildHubspotFields,
  formatQuoteRequestDetails,
  readHubspotUtkCookie,
  submitToHubspot,
} from "@/lib/hubspotForm";
import {
  UTM_PARAM_KEYS,
  readTrackingParams,
  mergeTrackingParams,
  persistTrackingParams,
  loadTrackingParams,
  computeStaffingSavings,
  formatUsd,
  fireLeadConversion,
  DEFAULT_ASSUMED_SAVING_PER_CHECK,
  type TrackingParams,
} from "@/lib/staffingLp";

/** Phone CTA shown in the minimal header + throughout. */
const LP_PHONE_DISPLAY = "(888) 445-3047";
const LP_PHONE_HREF = "tel:+18884453047";
const LEAD_FORM_ANCHOR = "lead-form";

/** Monthly volume buckets — same convention as /get-a-quote. */
const LP_VOLUMES = [
  "1–25 checks / month",
  "26–100 checks / month",
  "101–500 checks / month",
  "501–1,500 checks / month",
  "1,500+ checks / month",
];

/**
 * Bracketed placeholder stat. Renders the metric label with a visibly
 * unfilled [PLACEHOLDER] token so no invented number ever ships. The
 * marketing team replaces the `value` prop with a substantiated figure
 * before launch.
 */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="font-display text-[34px] leading-none text-[color:var(--color-ink)]">
        <span className="rounded-md bg-[color:var(--color-tint)] px-2 py-0.5 text-[color:var(--color-accent-ink)]">
          {value}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-snug text-[color:var(--color-ink-muted)]">
        {label}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-3 hairline" />
      <h2 className="mt-6 font-display text-[clamp(26px,3.4vw,40px)] leading-[1.1] text-[color:var(--color-ink)]">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
          {lede}
        </p>
      )}
    </div>
  );
}

export default function StaffingLanding() {
  useSeo({
    title: "Background Checks for Staffing Agencies | Rapid Hire Solutions",
    description:
      "Fast, FCRA-aligned background screening built for staffing agencies. Place candidates sooner with transparent pricing and U.S.-based support. Get staffing pricing in one business day.",
    keywords: [
      "staffing background checks",
      "background checks for staffing agencies",
      "staffing agency screening",
      "fast background checks staffing",
      "FCRA compliant staffing screening",
    ],
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Background screening for staffing agencies",
      provider: {
        "@type": "Organization",
        name: BRAND_NAME,
        telephone: "+1-888-445-3047",
      },
      areaServed: "US",
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Staffing and recruiting agencies",
      },
    },
  });

  // ---- Marketing attribution capture -------------------------------------
  const search = useSearch();
  const [tracking, setTracking] = useState<TrackingParams>({});
  useEffect(() => {
    // Merge any freshly-arrived URL params over the cached set, persist,
    // and store in state so the hidden fields render with the values.
    const fromUrl = readTrackingParams(search ?? "");
    const merged = mergeTrackingParams(loadTrackingParams(), fromUrl);
    persistTrackingParams(merged);
    setTracking(merged);
  }, [search]);

  // ---- Lead form state ---------------------------------------------------
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!submitted) return;
    const id = requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => cancelAnimationFrame(id);
  }, [submitted]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    if (String(fd.get("_gotcha") ?? "").trim().length > 0) {
      setSubmitted(true);
      return;
    }
    const validationValues = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      volume: String(fd.get("volume") ?? ""),
    };
    const errs = validateFields(validationValues, {
      requiredFields: ["firstName", "lastName", "email", "company", "volume"],
      emailFields: ["email"],
    });
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const firstEl = formEl.elements.namedItem(firstKey) as
        | HTMLInputElement
        | HTMLSelectElement
        | null;
      firstEl?.focus();
      return;
    }

    const company = String(fd.get("company") ?? "").trim();
    const payload = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company,
      volume: String(fd.get("volume") ?? ""),
      message: String(fd.get("message") ?? ""),
      lead_source: "Staffing LP",
      // Marketing attribution — carried into the Formspree payload so the
      // sales inbox can see which campaign/keyword produced the lead.
      utm_source: tracking.utm_source ?? "",
      utm_medium: tracking.utm_medium ?? "",
      utm_campaign: tracking.utm_campaign ?? "",
      utm_term: tracking.utm_term ?? "",
      gclid: tracking.gclid ?? "",
      _subject: company
        ? `New staffing LP lead — ${company}`
        : "New staffing LP lead",
      // §215 — intentionally NO `_cc` field (recipients managed in the
      // Formspree dashboard; duplicating them here breaks SendGrid).
    };
    setSubmitting(true);

    // Parallel fire-and-forget HubSpot submission (same pattern as /get-a-quote).
    const attribution = UTM_PARAM_KEYS.map((k) => {
      const v = tracking[k];
      return v ? `${k}: ${v}` : null;
    })
      .filter(Boolean)
      .join("\n");
    const quoteDetails = formatQuoteRequestDetails({
      volume: payload.volume,
      message:
        attribution.length > 0
          ? `${payload.message}\n\n--- Campaign attribution ---\n${attribution}`
          : payload.message,
      sourcePageUri:
        typeof window !== "undefined" ? window.location.href : undefined,
    });
    const hubspotFields = buildHubspotFields({
      firstname: payload.firstName,
      lastname: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      lead_source: payload.lead_source,
      quote_request_details: quoteDetails,
    });
    const hubspotPromise = submitToHubspot({
      fields: hubspotFields,
      context: {
        pageUri:
          typeof window !== "undefined" ? window.location.href : undefined,
        pageName: "Staffing Landing Page — Rapid Hire Solutions",
        hutk: readHubspotUtkCookie(),
      },
    }).then((result) => {
      if (!result.ok && typeof console !== "undefined") {
        console.warn("[HubSpot Forms] non-2xx response", result);
      }
      return result;
    });
    void hubspotPromise.catch(() => {});

    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: Array<{ message?: string }>;
      };
      if (!resp.ok) {
        const msg =
          data?.errors?.[0]?.message ||
          `Submission failed (${resp.status}). Please try again.`;
        setError(msg);
        toast.error(msg);
        return;
      }
      // §218 — Google Ads conversion + dataLayer event on success.
      fireLeadConversion({ form: "staffing_lp", company });
      setSubmitted(true);
      toast.success(
        "Request received — a U.S.-based specialist will reply the same business day.",
      );
    } catch {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function clearOnChange(e: React.FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement | HTMLSelectElement | null;
    if (t?.name && fieldErrors[t.name]) {
      setFieldErrors((cur) => clearFieldError(cur, t.name));
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-paper)] text-[color:var(--color-ink)] font-sans antialiased">
      <LpHeader />

      <main>
        <Hero
          tracking={tracking}
          submitted={submitted}
          submitting={submitting}
          error={error}
          fieldErrors={fieldErrors}
          successRef={successRef}
          onSubmit={onSubmit}
          clearOnChange={clearOnChange}
        />
        <PainSection />
        <SolutionSection />
        <BenefitsSection />
        <SavingsSection />
        <ProcessSection />
        <UseCasesSection />
        <ServicesSection />
        <ComparisonSection />
        <TrustSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <LpFooter />
      <MobileStickyCta />
    </div>
  );
}

/* ============================ Minimal header ============================ */
function LpHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[color:var(--color-paper)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-paper)]/75">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={BRAND_NAME}>
          <img
            src={HEADER_LOGO_URL}
            alt={BRAND_NAME}
            className="h-8 w-auto"
            width={160}
            height={32}
          />
        </Link>
        <a
          href={LP_PHONE_HREF}
          className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] px-4 py-2 text-[13.5px] font-medium text-[color:var(--color-accent-ink)] hover:bg-[color:var(--color-accent-ink)] hover:text-white transition-colors"
        >
          <Phone className="size-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">{LP_PHONE_DISPLAY}</span>
          <span className="sm:hidden">Call</span>
        </a>
      </div>
    </header>
  );
}

/* ================================ Hero ================================== */
function Hero({
  tracking,
  submitted,
  submitting,
  error,
  fieldErrors,
  successRef,
  onSubmit,
  clearOnChange,
}: {
  tracking: TrackingParams;
  submitted: boolean;
  submitting: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  successRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  clearOnChange: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const flowSteps = [
    { icon: ClipboardList, label: "Order placed" },
    { icon: Activity, label: "In progress" },
    { icon: FileCheck2, label: "Verified" },
    { icon: Check, label: "Cleared to place" },
  ];
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* soft tint wash behind hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 480px at 18% -10%, var(--color-tint), transparent 60%)",
        }}
      />
      <div className="container grid grid-cols-12 gap-x-10 gap-y-12 py-14 md:py-20">
        {/* Left: pitch */}
        <div className="col-span-12 lg:col-span-6 lg:pr-6">
          <p className="eyebrow">Background checks for staffing agencies</p>
          <h1 className="mt-4 font-display text-[clamp(34px,5vw,58px)] leading-[1.04] tracking-tight text-[color:var(--color-ink)]">
            Place candidates sooner with screening built for{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              staffing speed
            </span>
            .
          </h1>
          <p className="mt-5 max-w-xl text-[16.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
            When a check stalls, a placement stalls. Rapid Hire Solutions is a
            background-screening partner designed around how staffing agencies
            actually hire — fast turnaround, transparent per-check pricing, and
            a real U.S.-based specialist who answers the phone.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`#${LEAD_FORM_ANCHOR}`}
              className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[15px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] transition-colors"
            >
              Get staffing pricing
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href={LP_PHONE_HREF}
              className="btn-press inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-[15px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)] transition-colors"
            >
              <Phone className="size-4" strokeWidth={1.75} />
              Book a 15-minute call
            </a>
          </div>

          {/* Trust row */}
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[color:var(--color-ink-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.75} />
              SOC 2 Type II
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.75} />
              PBSA accredited
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.75} />
              FCRA-aligned
            </span>
          </div>

          {/* Status-flow visual card */}
          <div className="hover-lift-card mt-9 rounded-[18px] border border-border bg-white p-5">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.75} />
              <p className="eyebrow !mt-0">How an order moves</p>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {flowSteps.map((s, i) => (
                <div key={s.label} className="relative text-center">
                  <div className="mx-auto grid size-11 place-items-center rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                    <s.icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <p className="mt-2 text-[11.5px] leading-tight text-[color:var(--color-ink-soft)]">
                    {s.label}
                  </p>
                  {i < flowSteps.length - 1 && (
                    <div
                      aria-hidden
                      className="absolute right-[-10px] top-[22px] hidden h-px w-5 bg-[color:var(--color-rule)] sm:block"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: lead form (above the fold on desktop) */}
        <div className="col-span-12 lg:col-span-6">
          <div
            id={LEAD_FORM_ANCHOR}
            className="scroll-mt-24 rounded-[22px] border border-border bg-white p-6 shadow-[0_18px_50px_-30px_rgba(20,30,60,0.35)] md:p-8"
          >
            {submitted ? (
              <div
                ref={successRef}
                data-testid="staffing-lp-success"
                className="px-2 py-10 text-center scroll-mt-24"
              >
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                  <Check className="size-5" strokeWidth={2} />
                </div>
                <h3 className="mt-6 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                  Request received.
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  A U.S.-based staffing specialist will reply the same business
                  day with transparent per-check pricing for your volume.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-[24px] leading-tight text-[color:var(--color-ink)]">
                    Get staffing pricing
                  </h2>
                  <span className="text-[12px] uppercase tracking-wider text-[color:var(--color-accent-ink)]">
                    1 business day
                  </span>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[color:var(--color-ink-muted)]">
                  Tell us your volume — get a transparent, line-itemized quote.
                  No obligation.
                </p>
                <form
                  onSubmit={onSubmit}
                  onChange={clearOnChange}
                  className="mt-6 grid gap-5"
                  noValidate
                  data-testid="staffing-lp-form"
                >
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: 1,
                      height: 1,
                      opacity: 0,
                    }}
                  />
                  {/* Hidden attribution fields */}
                  <input type="hidden" name="lead_source" value="Staffing LP" />
                  {UTM_PARAM_KEYS.map((k) => (
                    <input
                      key={k}
                      type="hidden"
                      name={k}
                      value={tracking[k] ?? ""}
                      data-testid={`staffing-lp-${k}`}
                    />
                  ))}

                  <div className="grid grid-cols-2 gap-4">
                    <LpField label="First name" name="firstName" required autoComplete="given-name" error={fieldErrors.firstName} />
                    <LpField label="Last name" name="lastName" required autoComplete="family-name" error={fieldErrors.lastName} />
                  </div>
                  <LpField label="Work email" name="email" type="email" required autoComplete="email" error={fieldErrors.email} />
                  <div className="grid grid-cols-2 gap-4">
                    <LpField label="Phone" name="phone" type="tel" autoComplete="tel" />
                    <LpField label="Company" name="company" required autoComplete="organization" error={fieldErrors.company} />
                  </div>
                  <LpSelect
                    label="Monthly hiring volume"
                    name="volume"
                    options={LP_VOLUMES}
                    required
                    error={fieldErrors.volume}
                  />
                  <div>
                    <label className="text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Roles you hire for (optional)
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      placeholder="e.g. warehouse associates, CNAs, drivers…"
                      className="form-field"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="-mt-2 text-[13px] text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="staffing-lp-submit"
                    className="btn-press inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[15px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        Sending
                        <Loader2 className="size-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Get my staffing pricing
                        <ArrowUpRight className="size-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11.5px] leading-relaxed text-[color:var(--color-ink-muted)]">
                    No sales auto-sequences — one real specialist emails you
                    back. SOC 2 Type II · PBSA · FCRA-aligned.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ 1. Pain ============================ */
function PainSection() {
  const pains = [
    "Candidates accept other offers while a check sits in a queue.",
    "Opaque, bundled pricing makes it impossible to bill clients accurately.",
    "Support tickets disappear into a portal with no one to call.",
    "A clunky candidate experience drives drop-off before day one.",
  ];
  return (
    <section className="border-b border-border bg-[color:var(--color-paper-soft)]">
      <div className="container py-16 md:py-24">
        <SectionHeading
          eyebrow="01 — The problem"
          title="When a background check slows down, your placement slows down."
          lede="Staffing runs on speed. Every hour a report sits in limbo is an hour a competing agency can place your candidate first — and most screening providers were never built for that clock."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {pains.map((p) => (
            <div
              key={p}
              className="flex items-start gap-3 rounded-[14px] border border-border bg-white p-5"
            >
              <X className="mt-0.5 size-5 shrink-0 text-red-500" strokeWidth={2} />
              <p className="text-[14.5px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                {p}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ 2. Solution ============================ */
function SolutionSection() {
  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading
              eyebrow="02 — The solution"
              title={
                <>
                  A screening partner built around how staffing agencies hire.
                </>
              }
              lede="We pair fast, accredited screening with transparent per-check pricing and a named U.S.-based specialist for your account. You get the throughput high-volume staffing demands, without the black-box pricing or the disappearing support."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Per-check pricing you can pass through to clients line by line.",
                "ATS-friendly ordering that fits your existing workflow.",
                "A named specialist who answers the phone — not a ticket queue.",
                "Accredited, FCRA-aligned process from order to adjudication.",
              ].map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-[color:var(--color-accent-ink)]" strokeWidth={2.25} />
                  <span className="text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Placeholder stat band */}
          <div className="col-span-12 lg:col-span-5">
            <div className="hover-lift-card grid grid-cols-2 gap-6 rounded-[18px] border border-border bg-white p-7">
              <Stat value="[XX]%" label="Average turnaround improvement vs. prior provider" />
              <Stat value="[X.X] hrs" label="Typical time to first completed report" />
              <Stat value="[XX]%+" label="Reports completed within SLA" />
              <Stat value="[XXX]+" label="Staffing agencies screened with us" />
              <p className="col-span-2 text-[11px] leading-snug text-[color:var(--color-ink-muted)]">
                Bracketed figures are placeholders — replace with substantiated
                metrics before campaign launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ 3. Benefits ============================ */
function BenefitsSection() {
  const benefits = [
    {
      icon: Gauge,
      title: "Faster placements",
      body: "Quick turnaround keeps offers warm so candidates start with you, not the agency down the street.",
    },
    {
      icon: DollarSign,
      title: "Lower, transparent cost",
      body: "Per-check pricing with no setup fees or minimums — bill your clients accurately and protect your margin.",
    },
    {
      icon: HeartHandshake,
      title: "Better candidate experience",
      body: "A clean mobile intake and clear status reduce drop-off between offer and first shift.",
    },
    {
      icon: Headset,
      title: "Support you can reach",
      body: "A named U.S.-based specialist who picks up the phone when a placement is on the line.",
    },
  ];
  return (
    <section className="border-b border-border bg-[color:var(--color-paper-soft)]">
      <div className="container py-16 md:py-24">
        <SectionHeading
          eyebrow="03 — Why staffing teams switch"
          title="Built for the metrics staffing leaders actually own."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="hover-lift-card rounded-[16px] border border-border bg-white p-6"
            >
              <div className="grid size-11 place-items-center rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                <b.icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-display text-[19px] leading-tight text-[color:var(--color-ink)]">
                {b.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ 4. Savings calculator ============================ */
function SavingsSection() {
  const [checks, setChecks] = useState(100);
  const [cost, setCost] = useState(35);
  const [saving, setSaving] = useState<number>(DEFAULT_ASSUMED_SAVING_PER_CHECK);

  const result = useMemo(
    () =>
      computeStaffingSavings({
        checksPerMonth: checks,
        currentCostPerCheck: cost,
        assumedSavingPerCheck: saving,
      }),
    [checks, cost, saving],
  );

  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <SectionHeading
          eyebrow="04 — Estimate your savings"
          title="See what tighter per-check pricing could return."
          lede="Enter your own numbers. This estimator uses your inputs and an assumed per-check saving you control — it is an illustration, not a guaranteed quote. Request pricing above for an exact, line-itemized figure."
        />
        <div className="mt-10 grid grid-cols-12 gap-x-10 gap-y-8">
          {/* Inputs */}
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-[18px] border border-border bg-white p-7">
              <CalcRow
                label="Checks per month"
                value={checks}
                min={0}
                max={3000}
                step={25}
                onChange={setChecks}
                format={(v) => v.toLocaleString("en-US")}
              />
              <div className="my-6 hairline" />
              <CalcRow
                label="Your current average cost per check"
                value={cost}
                min={0}
                max={150}
                step={1}
                onChange={setCost}
                format={(v) => formatUsd(v)}
              />
              <div className="my-6 hairline" />
              <CalcRow
                label="Assumed saving per check"
                hint="[EDITABLE ASSUMPTION — not a quoted rate]"
                value={saving}
                min={0}
                max={Math.max(1, cost)}
                step={1}
                onChange={setSaving}
                format={(v) => formatUsd(v)}
              />
            </div>
          </div>
          {/* Output */}
          <div className="col-span-12 lg:col-span-5">
            <div className="hover-lift-card flex h-full flex-col justify-center rounded-[18px] border border-[color:var(--color-accent-ink)] bg-[color:var(--color-tint)] p-7">
              <p className="eyebrow !mt-0">Estimated savings</p>
              <div className="mt-4">
                <p className="text-[13px] text-[color:var(--color-ink-muted)]">
                  Per month
                </p>
                <p
                  className="font-display text-[40px] leading-none text-[color:var(--color-accent-ink)]"
                  data-testid="staffing-lp-monthly-saving"
                >
                  {formatUsd(result.monthlySaving)}
                </p>
              </div>
              <div className="mt-6">
                <p className="text-[13px] text-[color:var(--color-ink-muted)]">
                  Per year
                </p>
                <p
                  className="font-display text-[28px] leading-none text-[color:var(--color-ink)]"
                  data-testid="staffing-lp-annual-saving"
                >
                  {formatUsd(result.annualSaving)}
                </p>
              </div>
              <a
                href={`#${LEAD_FORM_ANCHOR}`}
                className="btn-press mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] transition-colors"
              >
                Get my exact quote
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalcRow({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-[13.5px] font-medium text-[color:var(--color-ink)]">
          {label}
          {hint && (
            <span className="ml-2 text-[11px] font-normal uppercase tracking-wide text-[color:var(--color-accent-ink)]">
              {hint}
            </span>
          )}
        </label>
        <span className="font-display text-[20px] text-[color:var(--color-ink)]">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[color:var(--color-accent-ink)]"
        aria-label={label}
      />
    </div>
  );
}

/* ============================ 5. Process ============================ */
function ProcessSection() {
  const steps = [
    { icon: ClipboardList, title: "Choose a package", body: "Pick a screening package matched to your roles and volume." },
    { icon: Send, title: "Submit candidates", body: "Order in seconds — candidates complete a mobile-friendly intake." },
    { icon: Activity, title: "Track in real time", body: "Watch each report move from ordered to completed, with status you can see." },
    { icon: FileCheck2, title: "Receive results", body: "Get clear, adjudication-ready reports so you can place with confidence." },
  ];
  return (
    <section className="border-b border-border bg-[color:var(--color-paper-soft)]">
      <div className="container py-16 md:py-24">
        <SectionHeading
          eyebrow="05 — How it works"
          title="From order to placement in four steps."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-[16px] border border-border bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-[color:var(--color-accent-ink)] text-white">
                  <s.icon className="size-5" strokeWidth={1.75} />
                </div>
                <span className="font-display text-[22px] text-[color:var(--color-rule)]">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[18px] leading-tight text-[color:var(--color-ink)]">
                {s.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-[color:var(--color-ink-soft)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ 6. Use cases ============================ */
function UseCasesSection() {
  const cases = [
    { icon: HardHat, title: "Light industrial", body: "Warehouse, assembly, and logistics roles screened fast for high-volume shifts." },
    { icon: Stethoscope, title: "Healthcare", body: "CNAs, aides, and clinical staff with the verifications and exclusion checks care settings require." },
    { icon: Briefcase, title: "Clerical & admin", body: "Office, finance, and front-desk placements with employment and education verification." },
    { icon: Truck, title: "Driver & logistics", body: "MVR and DOT-aware screening to keep drivers compliant and road-ready." },
    { icon: UtensilsCrossed, title: "Hospitality", body: "Front- and back-of-house hires screened to start before the next rush." },
    { icon: CalendarRange, title: "High-volume seasonal", body: "Surge-ready throughput so peak hiring never waits on a backlog." },
  ];
  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <SectionHeading
          eyebrow="06 — Who we screen for"
          title="Tuned to the verticals staffing agencies place most."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <div
              key={c.title}
              className="hover-lift-card rounded-[16px] border border-border bg-white p-6"
            >
              <c.icon className="size-6 text-[color:var(--color-accent-ink)]" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-[18px] leading-tight text-[color:var(--color-ink)]">
                {c.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ 7. Services ============================ */
function ServicesSection() {
  const services = [
    "County & statewide criminal",
    "National criminal database",
    "SSN trace & address history",
    "Sex-offender registry",
    "Employment verification",
    "Education verification",
    "Professional license verification",
    "MVR (motor vehicle records)",
    "DOT & non-DOT drug screening",
    "OIG / SAM exclusion checks",
    "I-9 / E-Verify",
    "Ongoing post-hire monitoring",
  ];
  return (
    <section className="border-b border-border bg-[color:var(--color-paper-soft)]">
      <div className="container py-16 md:py-24">
        <SectionHeading
          eyebrow="07 — Popular checks"
          title="The screening staffing agencies order most."
          lede="Mix and match into a package that fits each role type — you only pay for the checks you run."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s}
              className="flex items-center gap-3 rounded-full border border-border bg-white px-5 py-3"
            >
              <Check className="size-4 shrink-0 text-[color:var(--color-accent-ink)]" strokeWidth={2.25} />
              <span className="text-[14px] text-[color:var(--color-ink)]">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ 8. Comparison ============================ */
function ComparisonSection() {
  const rows = [
    { label: "Turnaround focus", big: "Batch-oriented, queue-based", rhs: "Built around staffing speed" },
    { label: "Pricing", big: "Bundled / opaque tiers", rhs: "Transparent per-check pricing" },
    { label: "Setup & minimums", big: "Setup fees + monthly minimums", rhs: "$0 setup, no minimums" },
    { label: "Support", big: "Ticket queue / chatbot", rhs: "Named U.S.-based specialist" },
    { label: "Candidate intake", big: "Desktop-era forms", rhs: "Mobile-first, low drop-off" },
  ];
  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <SectionHeading
          eyebrow="08 — How we compare"
          title="Big-box provider vs. Rapid Hire Solutions."
        />
        <div className="mt-10 overflow-hidden rounded-[18px] border border-border bg-white">
          <div className="grid grid-cols-3 border-b border-border bg-[color:var(--color-paper-soft)] text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
            <div className="p-4" />
            <div className="p-4">Typical big-box provider</div>
            <div className="p-4 text-[color:var(--color-accent-ink)]">Rapid Hire Solutions</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={[
                "grid grid-cols-3 text-[14px]",
                i < rows.length - 1 ? "border-b border-border" : "",
              ].join(" ")}
            >
              <div className="p-4 font-medium text-[color:var(--color-ink)]">{r.label}</div>
              <div className="flex items-start gap-2 p-4 text-[color:var(--color-ink-soft)]">
                <X className="mt-0.5 size-4 shrink-0 text-red-400" strokeWidth={2} />
                {r.big}
              </div>
              <div className="flex items-start gap-2 bg-[color:var(--color-tint)]/40 p-4 text-[color:var(--color-ink)]">
                <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]" strokeWidth={2.5} />
                {r.rhs}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ 9. Trust ============================ */
function TrustSection() {
  return (
    <section className="border-b border-border bg-[color:var(--color-paper-soft)]">
      <div className="container py-16 md:py-24">
        <SectionHeading
          eyebrow="09 — Trust & compliance"
          title="Accredited, secure, and built for FCRA-aligned hiring."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "SOC 2 Type II", body: "Independently audited security controls protect candidate data end to end." },
            { icon: ShieldCheck, title: "PBSA accredited", body: "Held to the background-screening industry's accreditation standard." },
            { icon: ShieldCheck, title: "FCRA-aligned process", body: "Adverse-action workflows and disclosures designed to support compliant hiring." },
          ].map((t) => (
            <div key={t.title} className="rounded-[16px] border border-border bg-white p-6">
              <t.icon className="size-6 text-[color:var(--color-accent-ink)]" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-[18px] text-[color:var(--color-ink)]">{t.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">{t.body}</p>
            </div>
          ))}
        </div>
        {/* Placeholder testimonial */}
        <figure className="mt-8 rounded-[18px] border border-border bg-white p-7">
          <blockquote className="font-display text-[20px] leading-[1.5] text-[color:var(--color-ink)]">
            “[PLACEHOLDER — staffing client testimonial. Replace with a real,
            attributable quote before launch.]”
          </blockquote>
          <figcaption className="mt-4 text-[13px] text-[color:var(--color-ink-muted)]">
            [Name], [Title] — [Staffing Agency]
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ============================ 10. FAQ ============================ */
function FaqSection() {
  const faqs = [
    {
      q: "How fast are your background checks for staffing placements?",
      a: "Turnaround depends on the checks ordered and the jurisdictions involved. Our process is built around staffing speed; request pricing above and a specialist will share typical turnaround for your specific package. [Add a substantiated turnaround figure here before launch.]",
    },
    {
      q: "How does pricing work?",
      a: "Transparent per-check pricing with no setup fees and no monthly minimums, so you can pass costs through to clients line by line. Tell us your volume for an exact, itemized quote.",
    },
    {
      q: "Do you integrate with our ATS?",
      a: "We support ATS-friendly ordering that fits common staffing workflows. Mention your system when you request pricing and a specialist will confirm the fit.",
    },
    {
      q: "Are you compliant and accredited?",
      a: "Yes — we maintain SOC 2 Type II, are PBSA accredited, and run an FCRA-aligned process including adverse-action support.",
    },
    {
      q: "Can you handle high-volume seasonal surges?",
      a: "Yes. The platform is designed for surge-ready throughput so peak hiring doesn't wait on a backlog.",
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <SectionHeading eyebrow="10 — FAQ" title="Questions staffing teams ask first." />
        <div className="mt-10 grid gap-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-[14px] border border-border bg-white p-5 [&_summary]:cursor-pointer"
            >
              <summary className="flex items-center justify-between gap-4 text-[15.5px] font-medium text-[color:var(--color-ink)] marker:content-['']">
                {f.q}
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-[color:var(--color-accent-ink)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ 11. Final CTA ============================ */
function FinalCtaSection() {
  return (
    <section className="bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]">
      <div className="container py-16 text-center md:py-24">
        <p className="eyebrow" style={{ color: "var(--color-footer-muted)" }}>
          Ready when you are
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-[clamp(28px,4vw,46px)] leading-[1.1]">
          Stop losing placements to slow background checks.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-[1.7]" style={{ color: "var(--color-footer-soft-text)" }}>
          Get transparent staffing pricing in one business day — no obligation,
          no auto-sequences, just a real specialist.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`#${LEAD_FORM_ANCHOR}`}
            className="btn-press inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-medium text-[color:var(--color-footer)] hover:opacity-90 transition-opacity"
          >
            Get staffing pricing
            <ArrowUpRight className="size-4" />
          </a>
          <a
            href={LP_PHONE_HREF}
            className="btn-press inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-[15px] font-medium text-white hover:bg-white/10 transition-colors"
          >
            <Phone className="size-4" strokeWidth={1.75} />
            {LP_PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================ Footer ============================ */
function LpFooter() {
  return (
    <footer className="border-t border-border bg-[color:var(--color-paper)]">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-[12.5px] text-[color:var(--color-ink-muted)] sm:flex-row">
        <p>
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="ink-link">Privacy</Link>
          <Link href="/terms" className="ink-link">Terms</Link>
          <a href={LP_PHONE_HREF} className="ink-link">{LP_PHONE_DISPLAY}</a>
        </div>
      </div>
    </footer>
  );
}

/* ============================ Mobile sticky CTA ============================ */
function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[color:var(--color-paper)]/95 backdrop-blur p-3 lg:hidden">
      <div className="container flex items-center gap-3">
        <a
          href={`#${LEAD_FORM_ANCHOR}`}
          className="btn-press inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white"
        >
          Get staffing pricing
          <ArrowUpRight className="size-4" />
        </a>
        <a
          href={LP_PHONE_HREF}
          aria-label={`Call ${LP_PHONE_DISPLAY}`}
          className="btn-press grid size-12 shrink-0 place-items-center rounded-full border border-[color:var(--color-accent-ink)] text-[color:var(--color-accent-ink)]"
        >
          <Phone className="size-5" strokeWidth={1.75} />
        </a>
      </div>
    </div>
  );
}

/* ============================ Field helpers ============================ */
function LpField({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  const id = `lp-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={["form-field", error ? "form-field--invalid" : ""].filter(Boolean).join(" ")}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-[12px] text-[color:var(--color-destructive,#dc2626)]">
          {error}
        </p>
      )}
    </div>
  );
}

function LpSelect({
  label,
  name,
  options,
  required,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  error?: string;
}) {
  const id = `lp-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
        {label}
        {required ? " *" : ""}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={["form-field", error ? "form-field--invalid" : ""].filter(Boolean).join(" ")}
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
        <p id={errorId} role="alert" className="mt-1 text-[12px] text-[color:var(--color-destructive,#dc2626)]">
          {error}
        </p>
      )}
    </div>
  );
}

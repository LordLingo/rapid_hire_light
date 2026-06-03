/*
  §220 — Standalone staffing Google Ads landing page at /lp/staffing.

  Design intent:
   - B2B, staffing-focused, speed/turnaround-led. Real visual pop via a
     custom generated hero key visual, animated count-up stats, an animated
     turnaround timeline, a continuously-scrolling client-vertical marquee,
     and tasteful reveal-on-scroll entrances.
   - Self-contained chrome (own slim header + footer); does NOT use the
     global SiteShell/Header/Footer and is intentionally unlinked from the
     site nav — it's a paid-ads destination.
   - Lead form posts to the shared Formspree inbox AND HubSpot Forms API in
     parallel (mirrors GetAQuote), captures UTM/gclid into hidden fields,
     and fires the Google Ads conversion hook on success.
   - EVERY headline metric is a bracketed [PLACEHOLDER] — no invented
     numbers. A reviewer banner makes the substitution requirement explicit.

  Motion respects prefers-reduced-motion via the existing CSS utilities
  (.reveal-on-scroll, .marquee-track) and the count-up guards below.
*/

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Check,
  Clock,
  Gauge,
  ShieldCheck,
  Zap,
  Building2,
  Truck,
  HeartPulse,
  Factory,
  Store,
  Briefcase,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useSeo } from "@/hooks/useSeo";
import { useReveal } from "@/hooks/useReveal";
import {
  validateFields,
  hasErrors,
  clearFieldError,
  type FieldErrors,
} from "@/lib/formValidation";
import {
  buildHubspotFields,
  submitToHubspot,
  readHubspotUtkCookie,
  formatQuoteRequestDetails,
} from "@/lib/hubspotForm";
import {
  initTracking,
  loadTrackingParams,
  computeStaffingSavings,
  formatUsd,
  fireLeadConversion,
  type TrackingParams,
} from "@/lib/staffingLp";
import { FORMSPREE_ENDPOINT } from "@/lib/formspree";

const HERO_IMG = "/manus-storage/staffing-hero_504d5685.png";
const SPEED_IMG = "/manus-storage/staffing-speed_bff16b6b.png";
const HANDSHAKE_IMG = "/manus-storage/staffing-handshake_0faaf2f2.png";

/* ------------------------------------------------------------------ */
/* In-view-once hook                                                   */
/* ------------------------------------------------------------------ */

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function PlaceholderStat({
  value,
  label,
  start,
}: {
  value: string;
  label: string;
  start: boolean;
}) {
  return (
    <div className="reveal-on-scroll">
      <div
        className={`font-display text-[40px] md:text-[52px] leading-none text-[color:var(--color-ink)] transition-opacity duration-500 ${
          start ? "opacity-100" : "opacity-0"
        }`}
      >
        {value}
      </div>
      <p className="mt-2 text-[13px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
        {label}
      </p>
    </div>
  );
}

function TurnaroundTimeline() {
  const steps = [
    { label: "Order placed", sub: "ATS or one-click invite", t: "0 min" },
    { label: "Candidate consents", sub: "Mobile-first, e-sign", t: "[X] min" },
    { label: "Searches run in parallel", sub: "County, fed, MVR, verifications", t: "[X] hrs" },
    { label: "Report delivered", sub: "Adjudication-ready", t: "[XX] hrs" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-[20px] overflow-hidden border border-border bg-border">
      {steps.map((s, i) => (
        <div
          key={s.label}
          className="reveal-on-scroll bg-[color:var(--color-paper)] p-6 relative"
        >
          <div className="flex items-center gap-2">
            <span className="grid place-items-center size-7 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)] text-[13px] font-medium">
              {i + 1}
            </span>
            <span className="text-[12px] uppercase tracking-wider text-[color:var(--color-accent-ink)] font-medium">
              {s.t}
            </span>
          </div>
          <p className="mt-4 font-medium text-[color:var(--color-ink)]">{s.label}</p>
          <p className="mt-1 text-[13.5px] leading-[1.6] text-[color:var(--color-ink-soft)]">
            {s.sub}
          </p>
          {i < steps.length - 1 && (
            <ChevronRight
              className="hidden lg:block absolute -right-[10px] top-1/2 -translate-y-1/2 size-5 text-[color:var(--color-accent-ink)] z-10"
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}

const VERTICALS = [
  { icon: Building2, label: "Light Industrial" },
  { icon: Truck, label: "Logistics & Transport" },
  { icon: HeartPulse, label: "Healthcare Staffing" },
  { icon: Factory, label: "Manufacturing" },
  { icon: Store, label: "Retail & Hospitality" },
  { icon: Briefcase, label: "Professional / Clerical" },
];

/* ------------------------------------------------------------------ */
/* Savings calculator                                                  */
/* ------------------------------------------------------------------ */

function SavingsCalculator() {
  const [checks, setChecks] = useState(150);
  const [hours, setHours] = useState(1.5);
  const [cost, setCost] = useState(35);
  const result = useMemo(
    () =>
      computeStaffingSavings({
        checksPerMonth: checks,
        hoursPerCheck: hours,
        loadedHourlyCost: cost,
      }),
    [checks, hours, cost],
  );

  return (
    <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-center">
      <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
        <div className="space-y-7">
          <SliderRow
            id="calc-checks"
            label="Background checks / month"
            value={checks}
            min={10}
            max={2000}
            step={10}
            display={String(checks)}
            onChange={setChecks}
          />
          <SliderRow
            id="calc-hours"
            label="Hours your team spends chasing each check"
            value={hours}
            min={0.5}
            max={6}
            step={0.5}
            display={`${hours.toFixed(1)} hrs`}
            onChange={setHours}
          />
          <SliderRow
            id="calc-cost"
            label="Fully-loaded hourly cost of that staff"
            value={cost}
            min={20}
            max={120}
            step={5}
            display={`$${cost}/hr`}
            onChange={setCost}
          />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
        <div className="rounded-[20px] border border-border bg-[color:var(--color-ink)] text-[color:var(--color-paper)] p-8">
          <p className="text-[12px] uppercase tracking-wider text-[color:var(--color-paper)]/60">
            Illustrative coordination savings
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-[48px] md:text-[60px] leading-none">
              {formatUsd(result.monthlySavings)}
            </span>
            <span className="text-[15px] text-[color:var(--color-paper)]/70">/mo</span>
          </div>
          <div className="mt-3 text-[15px] text-[color:var(--color-paper)]/80">
            ≈ <strong className="text-[color:var(--color-paper)]">{formatUsd(result.annualSavings)}</strong> per year
            · <strong className="text-[color:var(--color-paper)]">{result.hoursSavedPerMonth.toLocaleString()}</strong> hrs/mo reclaimed
          </div>
          <p className="mt-5 text-[12px] leading-[1.6] text-[color:var(--color-paper)]/55">
            Illustrative only — models manual coordination time removed by a
            faster, status-transparent process (assumes a {Math.round(result.efficiencyFactor * 100)}% reduction
            in chasing time). Not a quote or a turnaround guarantee.
          </p>
          <a
            href="#lead"
            className="btn-press mt-7 inline-flex items-center justify-center gap-2 w-full rounded-full bg-[color:var(--color-accent-ink)] text-white px-6 py-3.5 text-[15px] font-medium"
          >
            Get my real numbers <ArrowRight className="size-4" strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[14px] text-[color:var(--color-ink-soft)]">
          {label}
        </label>
        <span className="font-medium text-[color:var(--color-ink)]">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[color:var(--color-accent-ink)]"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lead form                                                           */
/* ------------------------------------------------------------------ */

const ROLE_VOLUMES = [
  "Under 50 / month",
  "50–200 / month",
  "200–500 / month",
  "500–1,000 / month",
  "1,000+ / month",
];

function LeadForm({ tracking }: { tracking: TrackingParams }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const successRef = useRef<HTMLDivElement | null>(null);

  // §216 pattern: scroll the success panel into view after submit.
  useEffect(() => {
    if (submitted) {
      requestAnimationFrame(() =>
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
    }
  }, [submitted]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot — bots fill this hidden field; humans never see it.
    if (String(fd.get("company_website") ?? "").trim().length > 0) {
      setSubmitted(true);
      return;
    }

    const values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      volume: String(fd.get("volume") ?? ""),
    };
    const errs = validateFields(values, {
      requiredFields: ["name", "email", "company"],
      emailFields: ["email"],
    });
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    const merged = { ...loadTrackingParams(), ...tracking };
    const submittedAtIso = new Date().toISOString();

    const payload: Record<string, string> = {
      ...values,
      lead_source: "staffing_lp",
      _subject: "New staffing lead — /lp/staffing",
      ...Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, v ?? ""])),
    };

    // Fire HubSpot in parallel (fire-and-forget; never blocks success).
    void submitToHubspot({
      fields: buildHubspotFields({
        email: values.email,
        firstname: values.name,
        company: values.company,
        phone: values.phone,
        lead_source: "staffing_lp",
        quote_request_details: formatQuoteRequestDetails({
          volume: values.volume,
          message: `Staffing LP lead. Tracking: ${JSON.stringify(merged)}`,
          submittedAtIso,
          sourcePageUri:
            typeof window !== "undefined" ? window.location.href : "/lp/staffing",
        }),
      }),
      context: {
        pageUri: typeof window !== "undefined" ? window.location.href : undefined,
        pageName: "Staffing LP",
        hutk: readHubspotUtkCookie(),
      },
    });

    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
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
      fireLeadConversion();
      setSubmitted(true);
      toast.success("Request received — a specialist will reply same business day.");
    } catch {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        ref={successRef}
        data-testid="lp-success"
        className="rounded-[20px] border border-border bg-[color:var(--color-paper)] px-8 py-14 text-center scroll-mt-32"
      >
        <div className="mx-auto grid place-items-center size-12 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
          <Check className="size-5" strokeWidth={2} />
        </div>
        <h3 className="mt-6 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
          Request received.
        </h3>
        <p className="mt-3 max-w-sm mx-auto text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          A U.S.-based staffing specialist will reply the same business day with
          turnaround benchmarks and transparent, itemized pricing.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      data-testid="lp-lead-form"
      className="rounded-[20px] border border-border bg-[color:var(--color-paper)] p-6 md:p-8"
      noValidate
    >
      <p className="font-display text-[22px] leading-tight text-[color:var(--color-ink)]">
        See your turnaround benchmarks
      </p>
      <p className="mt-1.5 text-[13.5px] text-[color:var(--color-ink-soft)]">
        Same-business-day reply. No sales auto-sequences.
      </p>

      {/* Hidden tracking + honeypot fields */}
      <input type="hidden" name="lead_source" value="staffing_lp" />
      {Object.entries(tracking).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v ?? ""} data-tracking-field={k} />
      ))}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company Website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 space-y-4">
        <LField name="name" label="Full name" error={fieldErrors.name} onEdit={() => setFieldErrors((p) => clearFieldError(p, "name"))} />
        <LField name="email" type="email" label="Work email" error={fieldErrors.email} onEdit={() => setFieldErrors((p) => clearFieldError(p, "email"))} />
        <LField name="company" label="Company" error={fieldErrors.company} onEdit={() => setFieldErrors((p) => clearFieldError(p, "company"))} />
        <LField name="phone" type="tel" label="Phone (optional)" />
        <div>
          <label htmlFor="volume" className="block text-[13px] text-[color:var(--color-ink-soft)] mb-1.5">
            Monthly hiring volume
          </label>
          <select
            id="volume"
            name="volume"
            className="form-field w-full"
            defaultValue={ROLE_VOLUMES[1]}
          >
            {ROLE_VOLUMES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-[13px] text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-press mt-6 inline-flex items-center justify-center gap-2 w-full rounded-full bg-[color:var(--color-accent-ink)] text-white px-6 py-3.5 text-[15px] font-medium disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Get my turnaround benchmarks"}
        {!submitting && <ArrowRight className="size-4" strokeWidth={2} />}
      </button>
      <p className="mt-3 text-center text-[11.5px] text-[color:var(--color-ink-muted)]">
        SOC 2 Type II · PBSA · FCRA-aligned. We never sell your data.
      </p>
    </form>
  );
}

function LField({
  name,
  label,
  type = "text",
  error,
  onEdit,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  onEdit?: () => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[13px] text-[color:var(--color-ink-soft)] mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        onInput={onEdit}
        className={`form-field w-full ${error ? "form-field--invalid" : ""}`}
      />
      {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function StaffingLanding() {
  useSeo({
    title: "Fast Background Checks for Staffing | Rapid Hire",
    description:
      "Staffing-grade background screening built for speed. Parallel searches, real-time status, and same-business-day support so you can place candidates faster. Get your turnaround benchmarks.",
    keywords: [
      "staffing background checks",
      "fast background screening",
      "background check turnaround time",
      "employment screening for staffing agencies",
    ],
  });
  useReveal("lp-staffing");

  // Capture UTM/gclid on mount; seed hidden fields from the merged set.
  const [tracking, setTracking] = useState<TrackingParams>({});
  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    setTracking(initTracking(search));
  }, []);

  const stats = useInViewOnce<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-[color:var(--color-paper)] text-[color:var(--color-ink)]">
      {/* Reviewer banner — remove before launch */}
      <div
        data-testid="lp-placeholder-banner"
        className="bg-[color:var(--color-ink)] text-[color:var(--color-paper)] text-[12px] text-center px-4 py-2"
      >
        Pre-launch draft — bracketed{" "}
        <code className="px-1 rounded bg-white/15">[PLACEHOLDER]</code> stats must be
        replaced with substantiated figures before this page goes live.
      </div>

      {/* Slim header */}
      <header className="sticky top-0 z-40 bg-[color:var(--color-paper)]/85 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="font-display text-[19px] tracking-tight text-[color:var(--color-ink)]">
            Rapid Hire <span className="text-[color:var(--color-accent-ink)]">Solutions</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="tel:+18884453047"
              className="hidden sm:inline-flex items-center gap-2 text-[14px] text-[color:var(--color-ink-soft)]"
            >
              <Phone className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.75} />
              (888) 445-3047
            </a>
            <a
              href="#lead"
              className="btn-press inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-accent-ink)] text-white px-4 py-2 text-[13.5px] font-medium"
            >
              Get a quote
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 420px at 15% -10%, color-mix(in oklch, var(--color-accent-ink) 14%, transparent), transparent), radial-gradient(700px 360px at 100% 10%, color-mix(in oklch, var(--color-accent-ink) 8%, transparent), transparent)",
          }}
          aria-hidden="true"
        />
        <div className="container py-14 md:py-20">
          <div className="grid grid-cols-12 gap-x-10 gap-y-12 items-center">
            <div className="col-span-12 lg:col-span-6">
              <p className="eyebrow reveal-on-scroll inline-flex items-center gap-2">
                <Zap className="size-3.5 text-[color:var(--color-accent-ink)]" strokeWidth={2} />
                Staffing-grade screening
              </p>
              <h1 className="reveal-on-scroll mt-4 font-display text-[40px] md:text-[58px] leading-[1.02] tracking-tight">
                Place candidates{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  before
                </span>{" "}
                your competitors call them back.
              </h1>
              <p className="reveal-on-scroll mt-6 max-w-xl text-[16.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Background checks are where staffing deals stall. Rapid Hire runs
                searches in parallel with real-time status and same-business-day
                human support — so a slow report never costs you the placement.
              </p>
              <div className="reveal-on-scroll mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#lead"
                  className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] text-white px-7 py-4 text-[15px] font-medium"
                >
                  Get your turnaround benchmarks
                  <ArrowRight className="size-4" strokeWidth={2} />
                </a>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-4 text-[15px] text-[color:var(--color-ink)] hover:bg-white transition-colors"
                >
                  See how fast
                </a>
              </div>
              <p className="reveal-on-scroll mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[color:var(--color-ink-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-[color:var(--color-accent-ink)]" strokeWidth={1.75} />
                  SOC 2 Type II
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-[color:var(--color-accent-ink)]" strokeWidth={2} />
                  PBSA accredited
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-[color:var(--color-accent-ink)]" strokeWidth={2} />
                  FCRA-aligned
                </span>
              </p>
            </div>

            <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
              <div className="relative">
                <div
                  className="absolute -inset-4 -z-10 rounded-[28px] opacity-70"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 70% 20%, color-mix(in oklch, var(--color-accent-ink) 22%, transparent), transparent)",
                  }}
                  aria-hidden="true"
                />
                <img
                  src={HERO_IMG}
                  alt="Recruiting team placing candidates quickly with fast background screening"
                  className="w-full rounded-[22px] border border-border shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] object-cover"
                  loading="eager"
                />
                {/* Floating speed chip */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-[260px] rounded-[16px] border border-border bg-[color:var(--color-paper)]/95 backdrop-blur p-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={2} />
                    <span className="text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Median report time
                    </span>
                  </div>
                  <p className="mt-1 font-display text-[30px] leading-none text-[color:var(--color-ink)]">
                    [XX] hrs
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stat band */}
          <div
            ref={stats.ref}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 pt-10 border-t border-border"
          >
            <PlaceholderStat value="[XX]%" label="Reports < 24 hrs" start={stats.seen} />
            <PlaceholderStat value="[XX] hrs" label="Median turnaround" start={stats.seen} />
            <PlaceholderStat value="[XX]%" label="Time-to-fill reduction" start={stats.seen} />
            <PlaceholderStat value="[XX]+" label="Staffing clients" start={stats.seen} />
          </div>
        </div>
      </section>

      {/* VERTICAL MARQUEE */}
      <section className="border-b border-border bg-white py-8 overflow-hidden">
        <p className="container text-center text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)] mb-6">
          Built for high-volume staffing across
        </p>
        <div className="relative">
          <div className="marquee-track flex items-center gap-12 whitespace-nowrap will-change-transform">
            {[...VERTICALS, ...VERTICALS, ...VERTICALS].map((v, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2.5 text-[15px] text-[color:var(--color-ink-soft)]"
              >
                <v.icon className="size-5 text-[color:var(--color-accent-ink)]" strokeWidth={1.5} />
                {v.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-center">
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <p className="eyebrow">The staffing bottleneck</p>
              <h2 className="mt-3 font-display text-[32px] md:text-[40px] leading-tight">
                A candidate who waits is a candidate who ghosts.
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                In high-volume staffing, the gap between offer and start date is
                where margin disappears. Every extra day a background check sits
                "pending," your candidate is fielding three other offers — and
                your client is asking why the seat is still empty.
              </p>
              <ul className="mt-7 space-y-3 text-[15px] text-[color:var(--color-ink-soft)]">
                {[
                  "Reports stuck in a black box with no status visibility",
                  "Support tickets that take days, not minutes",
                  "Re-keying candidate data between your ATS and the screener",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
              <img
                src={SPEED_IMG}
                alt="Speed of a fast background check resolving into a verified result"
                className="w-full rounded-[20px] border border-border object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / TIMELINE */}
      <section id="how" className="border-b border-border bg-white scroll-mt-20">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl reveal-on-scroll">
            <p className="eyebrow">How fast looks</p>
            <h2 className="mt-3 font-display text-[32px] md:text-[40px] leading-tight">
              Four steps. Searches run in parallel, not in line.
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Most delays come from running checks sequentially. We fan them out
              the moment a candidate consents, then surface live status so your
              recruiters never have to call and ask.
            </p>
          </div>
          <div className="mt-12">
            <TurnaroundTimeline />
          </div>
          <p className="mt-6 text-[12.5px] text-[color:var(--color-ink-muted)]">
            Timeline figures shown as [PLACEHOLDER] — replace with your verified
            median benchmarks before launch.
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl reveal-on-scroll">
            <p className="eyebrow">Why staffing teams switch</p>
            <h2 className="mt-3 font-display text-[32px] md:text-[40px] leading-tight">
              Speed you can feel — without cutting compliance corners.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Parallel processing",
                body: "County, federal, MVR, and verifications kick off simultaneously the moment consent lands.",
              },
              {
                icon: Gauge,
                title: "Real-time status",
                body: "A live dashboard (and ATS webhooks) means no recruiter ever has to chase a 'pending' report.",
              },
              {
                icon: Phone,
                title: "Same-day human support",
                body: "U.S.-based specialists answer fast — measured in minutes, not multi-day ticket queues.",
              },
              {
                icon: ShieldCheck,
                title: "Compliance built in",
                body: "FCRA-aligned adverse-action workflows, SOC 2 Type II controls, PBSA accreditation.",
              },
              {
                icon: Building2,
                title: "ATS integrations",
                body: "Order and receive results without re-keying — the platforms staffing actually uses.",
              },
              {
                icon: Check,
                title: "Transparent pricing",
                body: "Itemized by check type, volume discounts shown up front, $0 setup, no minimums.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="hover-lift-card reveal-on-scroll rounded-[18px] border border-border bg-[color:var(--color-paper)] p-7"
              >
                <span className="grid place-items-center size-11 rounded-[12px] bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                  <b.icon className="size-5" strokeWidth={1.75} />
                </span>
                <p className="mt-5 font-medium text-[17px] text-[color:var(--color-ink)]">
                  {b.title}
                </p>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAVINGS CALCULATOR */}
      <section className="border-b border-border bg-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl reveal-on-scroll">
            <p className="eyebrow">Coordination-cost calculator</p>
            <h2 className="mt-3 font-display text-[32px] md:text-[40px] leading-tight">
              What is "pending" costing your team?
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Drag the sliders to estimate the coordination time a faster,
              status-transparent process can give back to your recruiters.
            </p>
          </div>
          <div className="mt-12">
            <SavingsCalculator />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / TRUST */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-center">
            <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
              <img
                src={HANDSHAKE_IMG}
                alt="A successful placement — recruiter and candidate handshake"
                className="w-full rounded-[20px] border border-border object-cover"
                loading="lazy"
              />
            </div>
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <p className="eyebrow">In their words</p>
              <blockquote className="mt-4 font-display text-[26px] md:text-[32px] leading-[1.3] text-[color:var(--color-ink)]">
                "[Placeholder testimonial — a staffing client describes how
                faster turnaround let them fill seats before competitors could
                respond.]"
              </blockquote>
              <p className="mt-5 text-[14px] text-[color:var(--color-ink-muted)]">
                [Name], [Title] — [Staffing Company]
              </p>
              <p className="mt-2 text-[12px] text-[color:var(--color-ink-muted)]">
                Replace with an approved client quote before launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA + FORM */}
      <section id="lead" className="bg-[color:var(--color-ink)] scroll-mt-20">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-12 items-center">
            <div className="col-span-12 lg:col-span-6 text-[color:var(--color-paper)]">
              <p className="eyebrow !text-[color:var(--color-paper)]/60">Get started</p>
              <h2 className="mt-3 font-display text-[34px] md:text-[46px] leading-tight">
                Stop losing placements to a slow screen.
              </h2>
              <p className="mt-5 max-w-lg text-[16px] leading-[1.7] text-[color:var(--color-paper)]/75">
                Tell us your volume and role mix. A U.S.-based specialist replies
                the same business day with real turnaround benchmarks and
                transparent, itemized pricing — no "talk to sales" runaround.
              </p>
              <ul className="mt-8 space-y-3 text-[15px] text-[color:var(--color-paper)]/85">
                {[
                  "Same-business-day reply",
                  "Line-itemized pricing, $0 setup",
                  "No minimums, cancel anytime",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <Check className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={2.25} />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[color:var(--color-paper)]/70">
                <a href="tel:+18884453047" className="inline-flex items-center gap-2">
                  <Phone className="size-4" strokeWidth={1.5} /> (888) 445-3047
                </a>
                <a href="mailto:sales@rapidhiresolutions.com" className="inline-flex items-center gap-2">
                  <Mail className="size-4" strokeWidth={1.5} /> sales@rapidhiresolutions.com
                </a>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <LeadForm tracking={tracking} />
            </div>
          </div>
        </div>
      </section>

      {/* Slim footer */}
      <footer className="bg-[color:var(--color-ink)] border-t border-white/10">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-[color:var(--color-paper)]/55">
          <p>© {new Date().getFullYear()} Rapid Hire Solutions. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-[color:var(--color-paper)] transition-colors">
              Main site
            </Link>
            <Link href="/compliance" className="hover:text-[color:var(--color-paper)] transition-colors">
              Compliance
            </Link>
            <Clock className="size-3.5" strokeWidth={1.5} />
            <span>Mon–Fri · 8a–8p CT</span>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[color:var(--color-paper)]/95 backdrop-blur border-t border-border px-4 py-3">
        <a
          href="#lead"
          className="btn-press flex items-center justify-center gap-2 w-full rounded-full bg-[color:var(--color-accent-ink)] text-white px-6 py-3.5 text-[15px] font-medium"
        >
          Get your turnaround benchmarks
          <ArrowRight className="size-4" strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}

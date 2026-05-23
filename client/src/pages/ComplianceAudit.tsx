/*
  ComplianceAudit — /compliance/audit

  A focused booking page for Rapid Hire Solutions' free 15-minute compliance
  audit. Reached from the Compliance hero CTA ("Book a free 15-min audit").
  Inspired by the structure of precisehire.com/compliance/audit (six surfaces
  reviewed, three-step flow, FAQ, structured form) but written for our brand
  on our existing design system: warm-paper surfaces, dark-navy footer-style
  CTA bands, Fraunces display headings, Inter body, sky-halo accent.

  Sections:
    PageHero (00 — Free Audit, italic accent on "adverse-action workflow")
    Section 01 — Six surfaces we actually audit (6 cards)
    Section 02 — Booking form (id="book") — posts to shared Formspree (§159)
    Section 03 — How the 15 minutes goes (3 steps)
    Section 04 — Frequently asked (5 Q&A, native <details>)
    Closing dark CTA band (back to /contact for non-audit needs)

  Form posts to the shared Formspree endpoint (§159, @/lib/formspree).
  Audit-specific fields are packed into the `message` body with a
  `[Compliance Audit Request]` prefix and a `_subject` line, so audit
  bookings land in the same inbox as quote + contact submissions but
  remain trivially identifiable.
*/
import { useState } from "react";
import { Link } from "wouter";
// §134: shared field-level validation — surfaces inline red borders
// (.form-field--invalid) and short helper text per field instead of a
// single page-level toast for missing data.
import {
  validateFields,
  hasErrors,
  clearFieldError,
  type FieldErrors,
} from "@/lib/formValidation";
// §159 — Formspree endpoint centralized so audit bookings land in the
// same mvzyoyoz inbox as quote + contact submissions. Previously posted
// to the local /api/contact JSON store.
import { FORMSPREE_ENDPOINT } from "@/lib/formspree";
import {
  ArrowUpRight,
  CalendarCheck2,
  Check,
  ChevronDown,
  Clock,
  FileSignature,
  Gavel,
  Loader2,
  MapPinned,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";

/* ---------- audit content ---------- */

const SURFACES: ReadonlyArray<{
  id: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}> = [
  {
    id: "disclosure",
    title: "Pre-hire disclosure & authorization",
    body:
      "We compare your standalone disclosure and authorization documents against the FCRA §604 standalone-document rule and the March 2024 CFPB Summary of Rights update. If yours pre-dates that update, it almost certainly needs a refresh.",
    Icon: FileSignature,
  },
  {
    id: "pre-adverse",
    title: "Pre-adverse action workflow",
    body:
      "We trace how a hit is surfaced, how the pre-adverse notice is delivered, what's enclosed (Summary of Rights, copy of the report), how candidate questions are routed during the waiting window, and whether the clock pauses correctly when a dispute is filed.",
    Icon: Gavel,
  },
  {
    id: "waiting",
    title: "Waiting-period cushion by jurisdiction",
    body:
      "Federal floor is five business days. California, Los Angeles, NYC, Philadelphia, and a growing list of other jurisdictions add cushions on top. We confirm your ATS or screening platform enforces the right wait time per candidate location.",
    Icon: MapPinned,
  },
  {
    id: "eeoc",
    title: "EEOC individualized assessment",
    body:
      "We review whether your hiring decisions on convictions document the three-factor analysis (nature of the offense, time elapsed, nature of the job) that the EEOC's 2012 enforcement guidance requires — and whether the documentation pattern would survive a disparate-impact discovery request.",
    Icon: Scale,
  },
  {
    id: "disputes",
    title: "Dispute handling under FCRA §611",
    body:
      "We test whether your CRA gives candidates a real reinvestigation under FCRA §611 or simply re-runs the same database. We look at the dispute close rate and the outcome distribution — for a healthy program the right denominator sits under 0.5%.",
    Icon: ShieldCheck,
  },
  {
    id: "monitoring",
    title: "Continuous-monitoring posture",
    body:
      "If you run continuous monitoring, we confirm the original disclosure contemplates ongoing screening, the authorization is a standalone document, and every alert flows through the full adverse-action sequence rather than being handled informally.",
    Icon: Clock,
  },
];

const COMPANY_SIZES = [
  "1 – 49 employees",
  "50 – 249 employees",
  "250 – 999 employees",
  "1,000 – 4,999 employees",
  "5,000+ employees",
] as const;

const INDUSTRIES = [
  "Healthcare",
  "Transportation / DOT",
  "Staffing & light industrial",
  "Retail / hospitality",
  "Financial / professional services",
  "Manufacturing / trades",
  "Education / non-profit",
  "Technology / SaaS",
  "Other",
] as const;

const TIMING = [
  "This week",
  "Next week",
  "Within 2 – 3 weeks",
  "Just researching for now",
] as const;

const FOCUS_AREAS = [
  "Pre-hire disclosure & authorization",
  "Pre-adverse action workflow",
  "Waiting-period cushion by state / city",
  "EEOC individualized assessment",
  "Dispute handling (FCRA §611)",
  "Continuous-monitoring posture",
  "Not sure yet — full review",
] as const;

const STEPS: ReadonlyArray<{ n: string; title: string; body: string }> = [
  {
    n: "01",
    title: "Book a 15-minute window",
    body:
      "Tell us roughly how many checks you run a month and which industries you hire into. That's the only intake we need before the call.",
  },
  {
    n: "02",
    title: "Walk through the six surfaces",
    body:
      "On Zoom or phone, we work through your disclosure and authorization, your pre-adverse and final adverse-action workflow, your dispute handling, and your continuous-monitoring posture.",
  },
  {
    n: "03",
    title: "Receive the written summary",
    body:
      "Within three business days you get a one-page summary of what's working and what isn't, with the FCRA section, EEOC guidance line, or case citation behind every finding.",
  },
];

const FAQS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "Is this really free, or do I have to switch CRAs?",
    a: "It's free for any U.S. employer regardless of who currently runs your screens. We do this whether you ever become a Rapid Hire Solutions customer. If a fix is something you can do internally with your current vendor, we'll tell you that directly on the call.",
  },
  {
    q: "What do I need to bring to the 15 minutes?",
    a: "Your current disclosure and authorization document, a representative pre-adverse and final adverse-action notice, and a rough sense of where your candidates live. Nothing with PII — we work from templates and structure, not real candidate files.",
  },
  {
    q: "Who actually runs the audit?",
    a: "A senior member of our compliance desk. The same people who review our own templates against new state and city ordinances quarterly. U.S.-based, owner-operated, and not handed off to a junior salesperson.",
  },
  {
    q: "What happens after the call?",
    a: "Within three business days you receive a one-page written summary of findings — what's working, what isn't, and the statute, regulation, or case-law citation behind each item. No drip campaign, no auto-enrolled marketing list. We follow up only if you ask us to.",
  },
  {
    q: "Can my legal or HR partner sit in?",
    a: "Yes. Many teams bring their employment counsel or in-house HR business partner. If you want the written summary addressed to a specific person or sent to a shared inbox, just tell us at the start of the call.",
  },
];

/* ---------- page ---------- */

export default function ComplianceAudit() {
  useSeo({
    title: "Free 15-minute compliance audit — Rapid Hire Solutions",
    description:
      "Book a free 15-minute compliance audit with the Rapid Hire Solutions compliance desk. We review your disclosure, adverse-action workflow, waiting-period math, EEOC documentation, and dispute pipeline against the FCRA and state-law overlays — and you receive a written one-page summary within three business days.",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // §134: per-field inline errors. Keyed by `name` attribute so the
  // markup binding stays trivial. Cleared on input/change.
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const role = String(fd.get("role") ?? "").trim();
    const companySize = String(fd.get("companySize") ?? "").trim();
    const industry = String(fd.get("industry") ?? "").trim();
    const currentVendor = String(fd.get("currentVendor") ?? "").trim();
    const timing = String(fd.get("timing") ?? "").trim();
    const focus = String(fd.get("focus") ?? "").trim();
    const notes = String(fd.get("notes") ?? "").trim();

    // §134: client-side required + email validation BEFORE the network call.
    const errs = validateFields(
      {
        firstName,
        lastName,
        email,
        company,
        companySize,
        industry,
        timing,
        focus,
      },
      {
        requiredFields: [
          "firstName",
          "lastName",
          "email",
          "company",
          "companySize",
          "industry",
          "timing",
          "focus",
        ],
        emailFields: ["email"],
      },
    );
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      const firstInvalid = Object.keys(errs)[0];
      const firstEl = formEl.elements.namedItem(firstInvalid) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      firstEl?.focus();
      return;
    }

    // Pack audit-specific fields into `message` so the audit booking lands
    // in the shared Formspree inbox alongside quote + contact submissions.
    // The `[Compliance Audit Request]` prefix and `_subject` line make audit
    // bookings trivially identifiable in the inbox.
    // §159 — Migrated from /api/contact to the shared Formspree endpoint.
    const messageLines: string[] = [
      "[Compliance Audit Request]",
      "",
      `Role: ${role || "—"}`,
      `Company size: ${companySize || "—"}`,
      `Primary industry: ${industry || "—"}`,
      `Current screening provider: ${currentVendor || "—"}`,
      `Preferred timing: ${timing || "—"}`,
      `Focus area: ${focus || "—"}`,
      `Phone: ${phone || "—"}`,
      "",
      "Notes:",
      notes || "(none)",
    ];

    const payload = {
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      company,
      // Map company size into the `volume` slot kept for inbox parity.
      volume: companySize,
      // The focus area travels in `services` as a single-item array.
      services: focus ? [focus] : [],
      message: messageLines.join("\n"),
      _subject: company
        ? `Compliance audit request — ${company}`
        : "Compliance audit request",
    };

    setSubmitting(true);
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
      setSubmitted(true);
      toast.success(
        "Audit request received — we'll confirm within one business day.",
      );
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
        eyebrow="00 — Free 15-minute audit"
        title={
          <>
            A 15-minute audit of your{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              adverse-action workflow.
            </span>
          </>
        }
        lede="Our compliance desk walks through your disclosure, your pre-adverse and final adverse-action workflow, your dispute handling, and your continuous-monitoring posture against the federal FCRA floor and the state and city overlays that ride on top. You receive a written one-page summary within three business days — whether you ever become a customer."
        afterLede={
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#book"
                data-testid="audit-cta-primary"
                className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]"
              >
                <CalendarCheck2 aria-hidden className="size-4" />
                Book the 15-minute audit
              </a>
              <a
                href="tel:+18884453047"
                data-testid="audit-cta-call"
                className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-border)] bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] transition-colors duration-200 ease-out hover:border-[color:var(--color-ink-soft)]"
              >
                Or call (888) 445-3047
              </a>
            </div>
            <ul
              data-testid="audit-trust-strip"
              className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13.5px] text-[color:var(--color-ink-soft)]"
            >
              {[
                "No PII required on the call",
                "Written summary within 3 business days",
                "Statute & case-law citations on every finding",
                "No sales follow-up unless you ask",
              ].map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <Check
                    aria-hidden
                    className="size-4 shrink-0 text-[color:var(--color-accent-ink)]"
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </>
        }
        visual={
          <div className="relative w-full">
            <div className="rounded-[18px] border border-border paper-shadow bg-white p-7 md:p-8">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-[color:var(--color-accent-ink)] support-status-dot-live"
                />
                <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-ink-muted)]">
                  Hosted by the Rapid Hire compliance desk
                </p>
              </div>
              <p className="mt-4 font-display text-[22px] leading-[1.25] text-[color:var(--color-ink)]">
                U.S.-based · Owner-operated · FCRA-certified
              </p>
              <p className="mt-3 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Most workflow defects we find on these audits are small — a
                disclosure that quietly bundles authorization, a pre-adverse
                template that omits the Summary of Rights, an ATS that doesn't
                pause the clock when a dispute is filed. They're also the same
                defects that turn into class-action exhibits when something
                goes wrong.
              </p>
              <ul className="mt-6 space-y-3 border-t border-[color:var(--color-rule)] pt-6">
                {[
                  "15 minutes on Zoom or phone",
                  "Written one-page summary in 3 business days",
                  "Statute / regulation / case-law citations on every finding",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 text-[14px] text-[color:var(--color-ink)]"
                  >
                    <span className="mt-[5px] grid place-items-center size-4 shrink-0 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      {/* 01 — Six surfaces */}
      <section
        data-testid="audit-surfaces"
        className="bg-[color:var(--color-paper-soft)] border-y border-border"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-6 items-end">
            <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
              <p className="eyebrow">01 — What we audit</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-8 font-display text-[34px] md:text-[42px] leading-[1.1] text-[color:var(--color-ink)]">
                Six surfaces.{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  Every one of them litigated.
                </span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7 reveal-on-scroll">
              <p className="text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                We don't audit everything. We audit the six surfaces that
                actually generate FCRA, EEOC, and state-law class actions
                against employers. If a screening program gets all six right,
                it's very hard to sue.
              </p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SURFACES.map((s) => (
              <article
                key={s.id}
                data-testid={`audit-surface-${s.id}`}
                className="hover-lift-card rounded-[16px] border border-border bg-white p-7"
              >
                <span className="grid place-items-center size-10 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                  <s.Icon aria-hidden className="size-4" />
                </span>
                <h3 className="mt-5 font-display text-[20px] leading-[1.3] text-[color:var(--color-ink)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — Booking form */}
      <section
        id="book"
        data-testid="audit-form-section"
        className="bg-white border-b border-border scroll-mt-24"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-12">
            {/* Left rail — what's promised */}
            <aside className="col-span-12 lg:col-span-4 reveal-on-scroll">
              <p className="eyebrow">02 — Book the audit</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-8 font-display text-[30px] md:text-[34px] leading-[1.15] text-[color:var(--color-ink)]">
                Tell us a little about your program. We reply personally within
                one business day.
              </h2>
              <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Fifteen minutes on Zoom or phone, written one-page summary
                delivered within three business days, statute and case-law
                citations on every finding. Free for any U.S. employer — we do
                this whether you ever become a customer.
              </p>
              <ul className="mt-7 space-y-3 text-[14px] text-[color:var(--color-ink)]">
                {[
                  "No PII, no signup wall, no auto-enrolled drip campaign.",
                  "You set the agenda — we won't pitch unless you ask.",
                  "If a fix is something you can do internally, we'll say so.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-[5px] grid place-items-center size-4 shrink-0 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    <span className="leading-[1.6]">{line}</span>
                  </li>
                ))}
              </ul>

              <div className="hover-lift-card mt-10 rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6">
                <div className="flex items-center gap-2">
                  <Sparkles
                    aria-hidden
                    className="size-3.5 text-[color:var(--color-accent-ink)]"
                  />
                  <p className="eyebrow !mt-0">Hosted by the compliance desk</p>
                </div>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  U.S.-based, owner-operated. The same people who review our
                  own templates against new state and city ordinances every
                  quarter.
                </p>
              </div>
            </aside>

            {/* Form */}
            <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
              {submitted ? (
                <div
                  data-testid="audit-form-success"
                  className="rounded-[20px] border border-border bg-[color:var(--color-paper)] px-8 py-16 text-center"
                >
                  <div className="mx-auto grid place-items-center size-12 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                    <Check className="size-5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-6 font-display text-[32px] leading-tight text-[color:var(--color-ink)]">
                    Audit request received.
                  </h3>
                  <p className="mt-3 max-w-md mx-auto text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    A member of the compliance desk will reach out within one
                    business day to confirm a 15-minute window. The written
                    summary follows within three business days of the call.
                  </p>
                  <Link
                    href="/compliance"
                    className="ink-link mt-8 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
                  >
                    Back to compliance
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  data-testid="audit-form"
                  className="grid gap-10"
                  noValidate
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
                  <div className="grid grid-cols-12 gap-x-8 gap-y-8">
                    <Field
                      label="First name"
                      name="firstName"
                      required
                      autoComplete="given-name"
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.firstName}
                    />
                    <Field
                      label="Last name"
                      name="lastName"
                      required
                      autoComplete="family-name"
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.lastName}
                    />
                    <Field
                      label="Work email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.email}
                    />
                    <Field
                      label="Phone (optional)"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="col-span-12 md:col-span-6"
                    />
                    <Field
                      label="Company"
                      name="company"
                      required
                      autoComplete="organization"
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.company}
                    />
                    <Field
                      label="Your role (e.g. Head of Talent)"
                      name="role"
                      autoComplete="organization-title"
                      className="col-span-12 md:col-span-6"
                    />
                    <SelectField
                      label="Company size"
                      name="companySize"
                      required
                      options={COMPANY_SIZES}
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.companySize}
                    />
                    <SelectField
                      label="Primary industry"
                      name="industry"
                      required
                      options={INDUSTRIES}
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.industry}
                    />
                    <Field
                      label="Current screening provider (if any)"
                      name="currentVendor"
                      className="col-span-12 md:col-span-6"
                    />
                    <SelectField
                      label="When would you like to talk?"
                      name="timing"
                      required
                      options={TIMING}
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.timing}
                    />
                    <SelectField
                      label="What do you most want us to look at?"
                      name="focus"
                      required
                      options={FOCUS_AREAS}
                      className="col-span-12"
                      error={fieldErrors.focus}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="audit-notes"
                      className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                    >
                      Anything specific you want us to come prepared for?
                      (optional)
                    </label>
                    <textarea
                      id="audit-notes"
                      name="notes"
                      rows={5}
                      placeholder="A jurisdiction, a recent dispute, an ATS migration, an internal audit finding — whatever you want the compliance desk to spend the 15 minutes on."
                      className="form-field"
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      data-testid="audit-form-error"
                      className="text-[13px] text-red-600 -mt-4"
                    >
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-[12px] text-[color:var(--color-ink-muted)] max-w-md">
                      Free for any U.S. employer. By submitting, you agree to
                      be contacted about your audit request. We never share
                      your details.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      data-testid="audit-form-submit"
                      className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          Sending
                          <Loader2 className="size-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Request the audit
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

      {/* 03 — How it goes */}
      <section
        data-testid="audit-flow"
        className="bg-[color:var(--color-paper-soft)] border-b border-border"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-6 items-end">
            <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
              <p className="eyebrow">03 — How the 15 minutes goes</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-8 font-display text-[34px] md:text-[42px] leading-[1.1] text-[color:var(--color-ink)]">
                Three steps.{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  No signup wall.
                </span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7 reveal-on-scroll">
              <p className="text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                You set the agenda. We work through what you want us to look
                at, send a written summary with citations, and follow up only
                if you ask us to.
              </p>
            </div>
          </div>

          <ol className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <li
                key={step.n}
                data-testid={`audit-step-${step.n}`}
                className="hover-lift-card rounded-[16px] border border-border bg-white p-7"
              >
                <p className="font-display text-[40px] leading-none text-[color:var(--color-accent-ink)]">
                  {step.n}
                </p>
                <h3 className="mt-5 font-display text-[20px] leading-[1.3] text-[color:var(--color-ink)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04 — FAQ */}
      <section
        data-testid="audit-faq"
        className="bg-white border-b border-border"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-6 items-end">
            <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
              <p className="eyebrow">04 — Frequently asked</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-8 font-display text-[34px] md:text-[42px] leading-[1.1] text-[color:var(--color-ink)]">
                The questions employers{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  actually ask
                </span>{" "}
                before booking.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7 reveal-on-scroll">
              <p className="text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                If yours isn't here, just ask on the call — it's fifteen
                minutes and you set the agenda.
              </p>
            </div>
          </div>

          <ul className="mt-12 max-w-[860px] space-y-3">
            {FAQS.map((f, i) => (
              <li key={f.q} data-testid={`audit-faq-${i + 1}`}>
                <details className="group rounded-[14px] border border-border bg-white open:bg-[color:var(--color-paper)] transition-colors">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 px-6 py-5 list-none">
                    <span className="font-display text-[18px] leading-[1.35] text-[color:var(--color-ink)]">
                      {f.q}
                    </span>
                    <ChevronDown
                      aria-hidden
                      className="mt-1 size-4 shrink-0 text-[color:var(--color-ink-muted)] transition-transform duration-200 ease-out group-open:rotate-180"
                    />
                  </summary>
                  <div className="px-6 pb-6 -mt-1 text-[14.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                    {f.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing dark CTA band */}
      <section
        data-testid="audit-closing"
        className="bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
        style={{ colorScheme: "dark" }}
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-footer-muted)]">
                Free · written · no follow-up unless you want it
              </p>
              <h2 className="mt-5 font-display text-[36px] md:text-[44px] leading-[1.1] text-[color:var(--color-footer-foreground)]">
                Fifteen minutes is usually all it takes to find the two or
                three things to fix.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:col-start-8 reveal-on-scroll">
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <a
                  href="#book"
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-white text-[color:var(--color-ink)] px-5 py-3 text-[14px] font-medium hover:bg-[color:var(--color-paper)]"
                >
                  <CalendarCheck2 aria-hidden className="size-4" />
                  Book the audit
                </a>
                <Link
                  href="/contact"
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-footer-soft-text)]/40 bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-footer-foreground)] hover:border-[color:var(--color-footer-foreground)]"
                >
                  Other questions
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

/* ---------- form primitives ---------- */

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
  const id = `audit-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}
      </label>
      <input
        id={id}
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
  className,
  error,
}: {
  label: string;
  name: string;
  options: ReadonlyArray<string>;
  required?: boolean;
  className?: string;
  /** §134 — inline error message to surface beneath the field. */
  error?: string;
}) {
  const id = `audit-${name}`;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={["form-field", error ? "form-field--invalid" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <option value="" disabled>
          Select —
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
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

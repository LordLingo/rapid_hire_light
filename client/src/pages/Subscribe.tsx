/*
  /subscribe — newsletter signup page.

  Single-purpose page that captures email + role + (optional) company and
  posts to a dedicated Formspree inbox (`xdajwoqo`, see @/lib/formspree).
  Newsletter signups are passive opt-ins and have a different downstream
  flow than sales — exporting to a mailing-list provider, sending a
  confirmation email — so they get their own inbox to keep the sales
  team's signal-to-noise ratio intact.

  Design language matches /contact + /get-a-quote (PageHero + framed
  card + label-on-top inputs) so the form feels native to the site, but
  the page itself is intentionally short — three fields, one button —
  because newsletter conversion drops off sharply with form length.

  We DO NOT collect a phone number, an industry pick list, or any other
  field that would make the form feel like a sales-qualification form
  in disguise. The whole point of the channel split is to set the right
  expectation for the visitor.

  Audit: §168 (YouTube readiness suite).
*/

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";
import { FORMSPREE_NEWSLETTER_ENDPOINT } from "@/lib/formspree";

type FieldErrors = Partial<Record<"email" | "role" | "company", string>>;

const ROLE_OPTIONS = [
  { value: "", label: "Choose a role (optional)" },
  { value: "hr-talent", label: "HR / Talent" },
  { value: "compliance", label: "Compliance / Legal" },
  { value: "ops-finance", label: "Operations / Finance" },
  { value: "founder-exec", label: "Founder / Executive" },
  { value: "consultant", label: "Consultant / Advisor" },
  { value: "candidate", label: "Candidate / Job-seeker" },
  { value: "other", label: "Other" },
] as const;

function validate(values: { email: string }): FieldErrors {
  const errs: FieldErrors = {};
  // Permissive RFC-5322-ish check — Formspree does the strict pass.
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errs.email = "Please enter a valid email address.";
  }
  return errs;
}

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  // Honeypot — bots fill all fields, humans never see this one.
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/subscribe`
      : "https://rapidhiresolutions.com/subscribe";

  useSeo({
    title: "Subscribe — the Rapid Hire Solutions newsletter",
    description:
      "One short email a week from the Rapid Hire Solutions compliance desk. New FCRA / state-law / drug-testing rulings, distilled to the changes that affect hiring teams. Unsubscribe in one click.",
    canonical,
    ogType: "website",
    keywords: [
      "background check newsletter",
      "FCRA legislative update newsletter",
      "compliance newsletter HR",
      "rapid hire solutions newsletter",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Subscribe to the Rapid Hire Solutions newsletter",
      url: canonical,
      description:
        "Weekly compliance newsletter for hiring teams: FCRA updates, state-law changes, and the rulings that quietly reshape pre-employment screening.",
    },
  });

  // Auto-focus the email field on mount so a visitor can start typing
  // immediately. Wrapped in useEffect so it runs after the input mounts.
  useEffect(() => {
    const el = formRef.current?.elements.namedItem("email") as HTMLInputElement | null;
    el?.focus();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Honeypot trip — silently succeed so bots don't learn anything.
    if (honeypot.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    const errs = validate({ email });
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      const firstName = Object.keys(errs)[0];
      const firstEl = formRef.current?.elements.namedItem(firstName) as
        | HTMLInputElement
        | HTMLSelectElement
        | null;
      firstEl?.focus();
      return;
    }

    const payload = {
      email,
      role: role || "(unspecified)",
      company: company || "(unspecified)",
      _subject: `Newsletter signup — ${email}`,
      // Carries the entry path so the operator can tell whether a signup
      // came directly from /subscribe vs. from the /learn empty state vs.
      // from a footer link, without needing analytics.
      source:
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("source") ||
            document.referrer ||
            "direct"
          : "direct",
    };

    setSubmitting(true);
    try {
      const resp = await fetch(FORMSPREE_NEWSLETTER_ENDPOINT, {
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
          `Subscription failed (${resp.status}). Please try again.`;
        setError(msg);
        toast.error(msg);
        return;
      }
      setSubmitted(true);
      toast.success("You're on the list — check your inbox for the welcome email.");
    } catch {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // What you get bullets — kept short and concrete so visitors can decide
  // in five seconds whether the newsletter is right for them.
  const bullets = useMemo(
    () => [
      "One short email per week — six minutes of reading max.",
      "Plain-English summaries of FCRA, state-law, and drug-testing rulings.",
      "Direct links to the source statute or court filing every time.",
      "Unsubscribe in one click. We don't sell or share your address.",
    ],
    [],
  );

  return (
    <SiteShell>
      <PageHero
        eyebrow="11 — Subscribe"
        title={
          <>
            The compliance{" "}
            <em className="font-display italic text-[color:var(--color-accent-ink)]">
              briefing
            </em>{" "}
            for hiring teams.
          </>
        }
        lede="One short email a week from the Rapid Hire Solutions compliance desk. New FCRA rulings, state-law changes, and the quietly important things HR Twitter never picks up. We won't waste your inbox."
      />

      <section className="bg-[color:var(--color-paper)] border-y border-border">
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-12 gap-x-10 gap-y-12">
            {/* Left rail — what you get */}
            <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
              <p className="eyebrow">What you'll get</p>
              <h2 className="mt-3 font-display text-[28px] leading-[1.2] text-[color:var(--color-ink)]">
                Compliance changes, distilled.
              </h2>
              <ul
                className="mt-6 space-y-3"
                data-testid="subscribe-bullets"
              >
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-[15px] leading-[1.55] text-[color:var(--color-ink-soft)]"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[color:var(--color-accent-ink)]"
                      aria-hidden
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-[13px] text-[color:var(--color-ink-muted)]">
                Looking for the long-form articles? Read the{" "}
                <Link
                  href="/blog"
                  className="underline underline-offset-2 hover:text-[color:var(--color-accent-ink)]"
                >
                  full compliance blog
                </Link>{" "}
                or watch the{" "}
                <Link
                  href="/learn"
                  className="underline underline-offset-2 hover:text-[color:var(--color-accent-ink)]"
                >
                  /learn video hub
                </Link>
                .
              </p>
            </div>

            {/* Right rail — form */}
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <div className="rounded-[20px] border border-border bg-white px-6 py-8 sm:px-8 sm:py-10 paper-shadow">
                {submitted ? (
                  <SuccessState />
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={onSubmit}
                    noValidate
                    data-testid="subscribe-form"
                    action={FORMSPREE_NEWSLETTER_ENDPOINT}
                    method="POST"
                  >
                    <h2 className="font-display text-[24px] leading-[1.2] text-[color:var(--color-ink)]">
                      Get the briefing.
                    </h2>
                    <p className="mt-2 text-[14px] text-[color:var(--color-ink-soft)]">
                      Email is required. The role and company fields help us
                      tailor the editorial mix — but they're optional.
                    </p>

                    {/* Honeypot — visually hidden, accessible-named so screen
                        readers know to skip it. Bots fill it; humans don't. */}
                    <input
                      type="text"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      aria-hidden="true"
                      data-testid="subscribe-honeypot"
                      style={{
                        position: "absolute",
                        left: "-9999px",
                        width: "1px",
                        height: "1px",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />

                    <div className="mt-6 space-y-5">
                      <Field
                        label="Email address"
                        required
                        error={fieldErrors.email}
                      >
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="hr-director@school-district.org"
                          className={inputCls(!!fieldErrors.email)}
                          data-testid="subscribe-email"
                        />
                      </Field>

                      <Field label="Your role" error={fieldErrors.role}>
                        <select
                          name="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className={inputCls(false)}
                          data-testid="subscribe-role"
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Company / organization" error={fieldErrors.company}>
                        <input
                          type="text"
                          name="company"
                          autoComplete="organization"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Optional"
                          className={inputCls(false)}
                          data-testid="subscribe-company"
                        />
                      </Field>
                    </div>

                    {error ? (
                      <p
                        className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700"
                        role="alert"
                        data-testid="subscribe-error"
                      >
                        {error}
                      </p>
                    ) : null}

                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-[14.5px] font-medium text-white shadow-sm transition-all duration-200 hover:scale-[0.98] active:scale-[0.96] disabled:opacity-60 disabled:hover:scale-100"
                        data-testid="subscribe-submit"
                      >
                        <Mail className="h-4 w-4" aria-hidden />
                        {submitting ? "Subscribing…" : "Subscribe"}
                      </button>
                      <p className="text-[12.5px] text-[color:var(--color-ink-muted)]">
                        We use your email only to send the newsletter and a
                        confirmation. No sales follow-up.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

/* -------------------------------------------------------------------- */
/* Field wrapper                                                         */
/* -------------------------------------------------------------------- */

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 inline-flex items-center gap-1 text-[12.5px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)]">
        {label}
        {required ? (
          <span className="text-[color:var(--color-accent-ink)]" aria-hidden>
            *
          </span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span
          className="mt-1.5 block text-[12.5px] text-red-600"
          role="alert"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

function inputCls(hasError: boolean): string {
  return [
    "block w-full rounded-md border bg-white px-3.5 py-2.5 text-[14.5px] text-[color:var(--color-ink)]",
    "placeholder:text-[color:var(--color-ink-muted)]/70",
    "transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-ink)]/40",
    hasError ? "border-red-400" : "border-border focus:border-[color:var(--color-accent-ink)]",
  ].join(" ");
}

/* -------------------------------------------------------------------- */
/* Success state                                                         */
/* -------------------------------------------------------------------- */

function SuccessState() {
  return (
    <div className="text-center" data-testid="subscribe-success">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-accent-ink)]/10 text-[color:var(--color-accent-ink)]">
        <CheckCircle2 className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="mt-6 font-display text-[26px] leading-[1.2] text-[color:var(--color-ink)]">
        You're on the list.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.6] text-[color:var(--color-ink-soft)]">
        We just sent a confirmation email — click the link inside to lock in
        your subscription. The next briefing will land in your inbox at the
        end of the week.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-[14px] font-medium text-[color:var(--color-ink)] shadow-sm transition-all duration-200 hover:scale-[0.98] active:scale-[0.96]"
        >
          Read the blog
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-5 py-2.5 text-[14px] font-medium text-white shadow-sm transition-all duration-200 hover:scale-[0.98] active:scale-[0.96]"
        >
          Watch on /learn
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

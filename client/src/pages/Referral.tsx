/*
  Referral Partner Program — standalone, nav-hidden page (/referral).

  Purpose (per request): a single shareable page a sales rep can send to a
  prospective referral partner. It is intentionally NOT linked from the
  Header or Footer nav — it's reached only by its direct URL.

  Sections:
   - PageHero (custom editorial illustration, no nav dependency).
   - "Why partners like this model" band.
   - Revenue-share tier table + the three PDF example cards.
   - "How it works" 3-step + supporting "no account babysitting" / "who
     qualifies" / "clean handoff" cards.
   - ReferralCalculator (models the pricing-page calculator, uses the exact
     PDF tier math from @/lib/referral).
   - Lead-capture form ("Interested? Tell us about your book of business.")
     posting to the shared Formspree sales inbox with a referral subject.
   - Program terms / fine print.

  All figures trace to RHSBackgroundChecksReferralPartnerProgram.pdf
  (mirrored in marketing/referral-program-source-notes.md). No invented
  stats — the calculator is explicitly labelled an illustrative estimate.
*/
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check, Loader2, ShieldCheck, Repeat, HandCoins } from "lucide-react";
import { toast } from "sonner";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { FORMSPREE_REFERRAL_ENDPOINT } from "@/lib/formspree";
import {
  validateFields,
  hasErrors,
  type FieldErrors,
} from "@/lib/formValidation";
import {
  REFERRAL_TIERS,
  REFERRAL_EXAMPLES,
} from "@/lib/referral";
import ReferralCalculator from "@/components/site/ReferralCalculator";

const REFERRAL_HERO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/referral-hero-portrait-kuthHSix6w7dfBXegtTBRA.webp";


const HOW_IT_WORKS = [
  {
    n: "1",
    title: "Register",
    body: "Complete the referral information form and a W-9 so we can set up your affiliate registration number and payout.",
  },
  {
    n: "2",
    title: "Share",
    body: "Introduce your client using your custom referral partner form or link. Your registration number ties the account to you.",
  },
  {
    n: "3",
    title: "Earn",
    body: "Your client orders Rapid Hire services and pays us. You receive your revenue share — paid net 15 days after we're paid.",
  },
];

const SUPPORT_CARDS = [
  {
    icon: Repeat,
    title: "No account babysitting",
    body: "Rapid Hire handles day-to-day client questions, support, billing workflow, and account service. No further intervention is required from you after the introduction.",
  },
  {
    icon: ShieldCheck,
    title: "Who can qualify",
    body: "Individuals or entities — HR consulting firms, temporary employment agencies, investigation agencies, insurance agencies, and other trusted business advisors. Registration is granted at Rapid Hire's discretion.",
  },
  {
    icon: HandCoins,
    title: "Clean handoff",
    body: "Because of state and federal requirements, Rapid Hire contracts directly with the client. Partners receive marketing materials and may request approval to use RHS logos, service marks, and copyrighted materials.",
  },
];

const PROGRAM_TERMS = [
  {
    label: "Eligible billing",
    body: "Referral percentages exclude Rapid Hire pass-through expenses, including county courthouse fees, third-party verification fees, state fees, communications, and related costs.",
  },
  {
    label: "Existing contacts",
    body: "No referral fee applies where the client contacted Rapid Hire directly before the referral was provided.",
  },
  {
    label: "Timing",
    body: "Referrals older than 180 days with no signed contract may expire, unless extended by Rapid Hire at its discretion upon affiliate request.",
  },
  {
    label: "Client acceptance",
    body: "Rapid Hire may refuse a client at its sole discretion.",
  },
  {
    label: "Referral records",
    body: "Client referral forms must be submitted in writing by regular mail or email and must be dated. If multiple affiliates refer the same client, the first referral received by Rapid Hire receives the fee.",
  },
  {
    label: "Partner ID",
    body: "The affiliate is responsible for providing the correct affiliate registration number. A referral form without the proper registration number may not be compensated.",
  },
  {
    label: "Program changes",
    body: "Rapid Hire may change referral fee percentages in writing within a 30-day period. Rules are governed by current prevailing program terms, which may change without notice.",
  },
];

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function Referral() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const REQUIRED = useMemo(
    () => ["name", "email", "company"] as const,
    [],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const errs = validateFields(values, {
      requiredFields: REQUIRED as unknown as string[],
      emailFields: ["email"],
    });
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      const firstName = Object.keys(errs)[0];
      const firstEl = formEl.elements.namedItem(firstName) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      firstEl?.focus();
      return;
    }

    const payload = {
      name: values.name,
      email: values.email,
      company: values.company,
      phone: values.phone,
      message: values.message,
      _subject: `New referral-partner inquiry — ${values.company}`.trim(),
      source: "referral-partner-program",
    };
    setSubmitting(true);
    try {
      const resp = await fetch(FORMSPREE_REFERRAL_ENDPOINT, {
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
      setSubmittedName(values.name);
      setSubmitted(true);
      toast.success("Thanks — we'll send your referral partner form the same business day.");
    } catch {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function clearErr(name: string) {
    setFieldErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Referral Partner Program"
        belowEyebrow={
          <div className="mt-6 aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-[0_1px_2px_rgba(16,42,75,0.08),0_8px_24px_-12px_rgba(16,42,75,0.18)]">
            <img
              src={REFERRAL_HERO_URL}
              alt="Editorial line illustration in cream and navy with sage accents: two hands meeting in a handshake at the top, a line flowing down through a dollar badge, then three ascending coin stacks, ending at a calendar page with a check mark — a referral that pays out month after month."
              width={1632}
              height={2176}
              loading="eager"
              decoding="async"
              className="block h-full w-full rounded-xl object-cover"
            />
          </div>
        }
        title={
          <>
            Refer once,{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              earn monthly.
            </span>
          </>
        }
        lede="Introduce a client to Rapid Hire Solutions and earn a percentage of their eligible monthly background-check billing — every month they stay with us. We contract with the client, service the account, and pay you after they pay us."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#referral-interest"
              className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
            >
              Request your partner form
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href="#referral-estimate"
              className="ink-link inline-flex items-center gap-1.5 text-[13.5px] text-[color:var(--color-ink)]"
            >
              Estimate what a referral pays
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        }
      />

      {/* Why partners like this model */}
      <section className="border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)]">
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-12 gap-x-10 gap-y-6 items-start">
            <div className="col-span-12 lg:col-span-4">
              <p className="eyebrow">Why partners like this model</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <p className="font-display text-[22px] leading-[1.4] tracking-[-0.01em] text-[color:var(--color-ink)] md:text-[26px]">
                Your referral can keep paying month after month.
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                The larger the client and the more hiring they do, the more the
                monthly revenue share can add up. Rapid Hire contracts directly
                with the client, services the account day to day, and pays the
                partner after the client pays us — so a single introduction can
                turn into recurring income with no ongoing work on your side.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue-share tiers + examples */}
      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-4">
              <p className="eyebrow">Monthly revenue share</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <h2 className="font-display text-[30px] sm:text-[38px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The more they bill,{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  the higher your share.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                Your payment is based on the eligible monthly Rapid Hire billing
                for each referred client. Paid net 15 calendar days after Rapid
                Hire receives payment from the client.
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-12 gap-x-10 gap-y-12">
            {/* Tier table */}
            <div className="col-span-12 lg:col-span-6">
              <div className="overflow-hidden rounded-[16px] border border-border">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[color:var(--color-accent-ink)] text-white">
                      <th className="px-5 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em]">
                        Monthly RHS billing
                      </th>
                      <th className="px-5 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] text-right">
                        Partner share
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {REFERRAL_TIERS.map((t, i) => (
                      <tr
                        key={t.id}
                        className={
                          i % 2 === 0
                            ? "bg-white"
                            : "bg-[color:var(--color-paper)]"
                        }
                      >
                        <td className="border-t border-border px-5 py-4 text-[14.5px] text-[color:var(--color-ink)]">
                          {t.label}
                        </td>
                        <td className="border-t border-border px-5 py-4 text-right font-display text-[18px] tracking-tight text-[color:var(--color-accent-ink)]">
                          {t.rateLabel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-[color:var(--color-ink-muted)]">
                Referral percentages exclude Rapid Hire pass-through expenses
                (county courthouse fees, third-party verification fees, state
                fees, communications, and related costs).
              </p>
            </div>

            {/* Example cards */}
            <div className="col-span-12 lg:col-span-6">
              <p className="eyebrow">What that looks like</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {REFERRAL_EXAMPLES.map((ex) => (
                  <article
                    key={ex.id}
                    className="flex flex-col rounded-[16px] border border-border bg-[color:var(--color-paper)] p-5"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-accent-ink)]">
                      {ex.name}
                    </p>
                    <p className="mt-3 text-[13px] text-[color:var(--color-ink-soft)]">
                      {fmtMoney(ex.billing)} billing
                    </p>
                    <p className="text-[13px] text-[color:var(--color-ink-soft)]">
                      {ex.shareLabel}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="font-display text-[28px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)] tabular-nums">
                        {fmtMoney(ex.monthly)}
                        <span className="ml-1 text-[13px] font-normal text-[color:var(--color-ink-muted)]">
                          /mo
                        </span>
                      </p>
                      <p className="mt-1 text-[12px] text-[color:var(--color-ink-muted)] tabular-nums">
                        {fmtMoney(ex.annual)} / yr
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[color:var(--color-paper-soft)] border-b border-border">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-4">
              <p className="eyebrow">How it works</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <h2 className="font-display text-[30px] sm:text-[38px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Three steps, then it runs on its own.
              </h2>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <article
                key={s.n}
                className="rounded-[16px] border border-border bg-white p-7"
              >
                <span className="grid place-items-center size-10 rounded-full bg-[color:var(--color-accent-ink)] font-display text-[18px] text-white">
                  {s.n}
                </span>
                <h3 className="mt-5 font-display text-[22px] tracking-tight text-[color:var(--color-ink)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {s.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUPPORT_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <article
                  key={c.title}
                  className="rounded-[16px] border border-border bg-white p-7"
                >
                  <Icon
                    aria-hidden
                    className="size-6 text-[color:var(--color-accent-ink)]"
                  />
                  <h3 className="mt-4 font-display text-[19px] tracking-tight text-[color:var(--color-ink)]">
                    {c.title}
                  </h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    {c.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <ReferralCalculator />

      {/* Lead-capture form */}
      <section
        id="referral-interest"
        className="bg-[color:var(--color-paper-soft)] border-y border-border scroll-mt-24"
      >
        <div className="container py-20 md:py-24">
          <div className="flex flex-col lg:flex-row gap-x-12 gap-y-10">
            {/* Left rail */}
            <div className="w-full lg:w-1/3 min-w-0">
              <p className="eyebrow">Interested?</p>
              <h2 className="mt-4 font-display text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Tell us about your book of business.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                Send us your details and we'll register you and email your
                custom referral partner form the same business day. There's no
                cost to join and no obligation to refer.
              </p>
              <p className="mt-6 text-[12.5px] leading-relaxed text-[color:var(--color-ink-muted)]">
                Referral payments and eligibility are governed by the full
                program terms. This page is a summary only.
              </p>
            </div>

            {/* Form / success */}
            <div className="w-full lg:w-2/3 min-w-0">
              {submitted ? (
                <div
                  data-testid="referral-success"
                  className="rounded-[20px] border border-[color:var(--color-accent-ink)] bg-white p-8 md:p-10"
                >
                  <span className="grid place-items-center size-12 rounded-full bg-[color:var(--color-accent-ink)] text-white">
                    <Check className="size-6" strokeWidth={2.4} />
                  </span>
                  <h3 className="mt-6 font-display text-[26px] tracking-tight text-[color:var(--color-ink)]">
                    Thanks{submittedName ? `, ${submittedName.split(" ")[0]}` : ""} — you're on our list.
                  </h3>
                  <p className="mt-3 max-w-prose text-[15px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                    We'll review your details and email your custom referral
                    partner form (and a W-9) the same business day. Once it's
                    signed, your affiliate registration number is live and any
                    client you introduce is tied to you.
                  </p>
                  <Link
                    href="/"
                    className="mt-6 ink-link inline-flex items-center gap-1.5 text-[13.5px] text-[color:var(--color-ink)]"
                  >
                    Back to home
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="space-y-6 rounded-[20px] border border-border bg-white p-8 md:p-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="min-w-0">
                      <label
                        htmlFor="ref-name"
                        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                      >
                        Your name
                      </label>
                      <input
                        id="ref-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        onChange={() => clearErr("name")}
                        aria-invalid={fieldErrors.name ? "true" : undefined}
                        className={[
                          "form-field",
                          fieldErrors.name ? "form-field--invalid" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {fieldErrors.name && (
                        <p role="alert" className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>
                    <div className="min-w-0">
                      <label
                        htmlFor="ref-email"
                        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                      >
                        Work email
                      </label>
                      <input
                        id="ref-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={() => clearErr("email")}
                        aria-invalid={fieldErrors.email ? "true" : undefined}
                        className={[
                          "form-field",
                          fieldErrors.email ? "form-field--invalid" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {fieldErrors.email && (
                        <p role="alert" className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="min-w-0">
                      <label
                        htmlFor="ref-company"
                        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                      >
                        Company / firm
                      </label>
                      <input
                        id="ref-company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        onChange={() => clearErr("company")}
                        aria-invalid={fieldErrors.company ? "true" : undefined}
                        className={[
                          "form-field",
                          fieldErrors.company ? "form-field--invalid" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                      {fieldErrors.company && (
                        <p role="alert" className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]">
                          {fieldErrors.company}
                        </p>
                      )}
                    </div>
                    <div className="min-w-0">
                      <label
                        htmlFor="ref-phone"
                        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                      >
                        Phone <span className="normal-case text-[color:var(--color-ink-muted)]">(optional)</span>
                      </label>
                      <input
                        id="ref-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="form-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="ref-message"
                      className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                    >
                      Anything we should know? <span className="normal-case text-[color:var(--color-ink-muted)]">(optional)</span>
                    </label>
                    <textarea
                      id="ref-message"
                      name="message"
                      rows={4}
                      placeholder="Roughly how many clients you work with, the industries they hire in, or any questions about the program."
                      className="form-field"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-[13px] text-red-600">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-[12px] text-[color:var(--color-ink-muted)] max-w-full sm:max-w-md min-w-0">
                      By submitting, you agree to be contacted about the Rapid
                      Hire Solutions referral partner program. We never share
                      your details.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          Sending
                          <Loader2 className="size-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Referral Partner Request
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

      {/* Program terms / fine print */}
      <section className="bg-white">
        <div className="container py-16 md:py-20">
          <p className="eyebrow">Program terms, exclusions, and limitations</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {PROGRAM_TERMS.map((t) => (
              <div key={t.label} className="flex flex-col">
                <p className="text-[13px] font-semibold text-[color:var(--color-ink)]">
                  {t.label}
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {t.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[12px] leading-relaxed text-[color:var(--color-ink-muted)]">
            Summary only. Referral payments and eligibility are governed by the
            full program terms.{" "}
            <a href="#referral-interest" className="ink-link text-[color:var(--color-ink)]">
              Contact Rapid Hire Solutions
            </a>{" "}
            to register and receive your custom referral partner form.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}

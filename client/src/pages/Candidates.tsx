/*
  §83 — Candidates page (/candidates)
  ------------------------------------
  Self-service surface for the *applicant* side of the relationship. Every
  top-5 BGC competitor exposes a dedicated candidates page; we previously
  had only a candidate-contact form embedded inside /support. Splitting it
  into its own page does three things:

   1. Gives candidates a direct URL to share — recruiters can paste
      /candidates into a candidate-experience email instead of asking
      applicants to navigate the support site.
   2. Concentrates the FCRA candidate-rights material in one canonical
      place (currently scattered across /compliance and /support).
   3. Lets us file the page under "Resources" in the sitemap so it is
      indexable as a candidate-help destination, not buried in support.

  Section rhythm:
    01 — Hero (eyebrow + title + lede + 3-stat band)
    02 — What to expect (4 micro-steps from invite → cleared report)
    03 — Your FCRA rights (5 bullet rights, with /compliance cross-link)
    04 — Status check + report-ID submission (CandidateContactForm reuse)
    05 — FAQ (4 candidate-side questions)
    + CtaBanner

  Why no "live status check" widget yet: rapidhiresolutions.com is a
  marketing site, not the candidate portal. We embed the contact form
  (which carries the same /api/candidate-contact path support uses) so
  status questions reach the candidate-care team, who then look the
  applicant up in the actual screening platform. A future iteration can
  swap the form for a tokenized status-lookup once that endpoint exists.
*/
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  ScrollText,
  HelpingHand,
  MailCheck,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import CandidateContactForm from "@/components/site/CandidateContactForm";
import { useSeo } from "@/hooks/useSeo";

const STEPS: { num: string; head: string; body: string }[] = [
  {
    num: "01",
    head: "You receive a secure invite",
    body:
      "Your prospective employer triggers a background check; you'll get an email with a one-time link to a mobile-friendly form. The link does not expire for 14 days.",
  },
  {
    num: "02",
    head: "You complete consent + disclosure",
    body:
      "Federal law (FCRA §604) requires written consent before any check runs. The form is two screens — never longer — and is in plain English (Spanish toggle available).",
  },
  {
    num: "03",
    head: "We run the searches",
    body:
      "Most checks complete in under 24 hours. You can re-open the link any time to see status; you'll also get a status email at completion.",
  },
  {
    num: "04",
    head: "Your employer receives the report",
    body:
      "If everything is clear, the employer moves you forward. If anything is flagged, federal law requires a 5-day pre-adverse window during which you can dispute.",
  },
];

const RIGHTS: { label: string; body: string }[] = [
  {
    label: "Right to know",
    body:
      "You have the right to know what is in your file. We will provide a free copy of any report we generate about you on request.",
  },
  {
    label: "Right to dispute",
    body:
      "If anything in the report is inaccurate or incomplete, you have the right to dispute it. We will reinvestigate within 30 days and update or delete inaccurate items at no cost to you.",
  },
  {
    label: "Right to consent",
    body:
      "Employers must obtain your written consent before pulling a report. If you didn't sign a disclosure, we will not run a check on you.",
  },
  {
    label: "Right to pre-adverse notice",
    body:
      "Before an employer makes a decision based on the report, you must receive a copy of the report and a summary of your FCRA rights — and have at least 5 business days to respond.",
  },
  {
    label: "Right to confidentiality",
    body:
      "Your file is shared only with the requesting employer who has your consent. We do not resell your data and we do not advertise to candidates.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How long does a background check take?",
    a: "Most reports clear in under 24 hours. County criminal searches can take 2–3 business days when the courthouse requires manual retrieval.",
  },
  {
    q: "What if the report has incorrect information?",
    a: "File a dispute by emailing the report ID and the disputed item to disputes@rapidhiresolutions.com or use the form below. We reinvestigate within 30 days and notify you of the outcome.",
  },
  {
    q: "Will my employer see my credit score?",
    a: "Only if the role specifically requires a credit check (financial services, fiduciary roles). The check shows liens, judgments, and bankruptcies — not the FICO score most consumer reports show.",
  },
  {
    q: "Do I need to take a drug test in person?",
    a: "Yes. We work with 12,000+ collection sites nationwide, and you'll receive a chain-of-custody form to take with you. Most candidates complete the test within 48 hours.",
  },
];

export default function Candidates() {
  useSeo({
    title: "Candidates — Status, Your Rights, Dispute Process — Rapid Hire Solutions",
    description:
      "If you're being screened by Rapid Hire Solutions, this page explains the process, your FCRA rights, and how to check status or dispute a report.",
    canonical: "https://www.rapidhiresolutions.com/candidates",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  });

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="For candidates"
        title={
          <>
            You're being{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              screened.
            </span>{" "}
            Here's what that means.
          </>
        }
        lede="If your prospective employer is using Rapid Hire Solutions to verify your background, this page explains what you can expect, your rights under federal law, and how to check status or dispute the report. Plain English, no legal jargon."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#status-check"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Check status / dispute
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/compliance"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              FCRA rights summary
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Typical TAT
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                &lt; 24h
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                For 85% of reports
              </p>
            </div>
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Dispute window
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                30 days
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                FCRA reinvestigation timeline
              </p>
            </div>
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Pre-adverse
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                5 days
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                Mandatory before adverse action
              </p>
            </div>
          </div>
        }
      />

      {/* Breadcrumb chip */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container -mt-6 pb-4 text-[12px] text-[color:var(--color-ink-soft)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-[color:var(--color-ink)]">Candidates</span>
        </div>
      </section>

      {/* 02 — WHAT TO EXPECT */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — The process</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Four steps from invite to cleared report.
              </h2>
              <ol className="mt-8 grid sm:grid-cols-2 gap-6 max-w-4xl">
                {STEPS.map((s) => (
                  <li
                    key={s.num}
                    className="rounded-[14px] border border-border bg-white p-6"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                      {s.num}
                    </p>
                    <p className="mt-2 font-display text-[19px] leading-tight text-[color:var(--color-ink)]">
                      {s.head}
                    </p>
                    <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — YOUR RIGHTS */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — Your rights</p>
              <div className="mt-3 hairline" />
              <p className="mt-4 inline-flex items-center gap-2 text-[12px] text-[color:var(--color-ink-soft)]">
                <ScrollText className="h-4 w-4" />
                Fair Credit Reporting Act
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Five rights every candidate has under federal law.
              </h2>
              <ul className="mt-8 max-w-3xl divide-y divide-border">
                {RIGHTS.map((r) => (
                  <li key={r.label} className="py-5 grid grid-cols-12 gap-x-6">
                    <p className="col-span-12 sm:col-span-3 font-display text-[16px] leading-tight text-[color:var(--color-ink)]">
                      {r.label}
                    </p>
                    <p className="col-span-12 sm:col-span-9 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {r.body}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/compliance"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-brand-blue)] hover:underline"
              >
                Read the full FCRA framework
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — STATUS / DISPUTE FORM */}
      <section
        id="status-check"
        className="bg-[color:var(--color-paper-soft)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
              <p className="eyebrow">04 — Status / dispute</p>
              <h2 className="mt-4 font-display text-[28px] md:text-[34px] leading-tight tracking-[-0.02em] text-[color:var(--color-ink)]">
                Talk to a candidate-care specialist.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Send your report ID (if you have one) and your question.
                A US-based specialist will reach out the same business day.
              </p>
              <div className="mt-6 grid gap-3">
                <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-ink-soft)]">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--color-accent-ink)]" />
                  Submissions are encrypted in transit and at rest
                </span>
                <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-ink-soft)]">
                  <HelpingHand className="h-4 w-4 text-[color:var(--color-accent-ink)]" />
                  We never share with the requesting employer without your consent
                </span>
                <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-ink-soft)]">
                  <MailCheck className="h-4 w-4 text-[color:var(--color-accent-ink)]" />
                  Responses arrive from a verified rapidhiresolutions.com inbox
                </span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
              <div className="rounded-[14px] border border-border bg-white p-6 md:p-8 paper-shadow">
                <CandidateContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — FAQ */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — FAQ</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <div className="max-w-3xl divide-y divide-border">
                {FAQS.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                      <span className="font-display text-[18px] leading-tight text-[color:var(--color-ink)]">
                        {f.q}
                      </span>
                      <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-[color:var(--color-ink-soft)] transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}

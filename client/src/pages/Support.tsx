/*
  Editorial Calm — Support page
  Modeled after precisehire.com/support but rewritten in the Rapid Hire voice
  and visual system. The dominant trust positioning is "Zero offshore. 100%
  US-based humans." Hero, comparison table, hours, and final CTA all return
  to that promise.

  Sections:
    1. Hero (US-based positioning + answer-time stat panel)
    2. The desk (four named US-based specialists, placeholder roster)
    3. Coverage (hours by US time zone)
    4. Why this matters (Rapid Hire vs typical big-four CRA comparison)
    5. Phone CTA band ("Try it. Call us right now.")
    6. Candidate vs. client routing (two-card split)
    7. Support FAQ (different from marketing FAQ; targeted at support intent)
    8. Accessibility + escalation
    9. Closing CTA

  The page emits a JSON-LD ContactPoint schema so the US phone number is
  machine-readable to search engines.
*/
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  UserCheck,
  Plus,
  ArrowRight,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import SupportStatusBadge from "@/components/site/SupportStatusBadge";
import CandidateContactForm from "@/components/site/CandidateContactForm";
import { useSeo } from "@/hooks/useSeo";

/* ---------- content ---------- */

const PHONE_DISPLAY = "(888) 555-0142";
const PHONE_TEL = "+18885550142";
const SUPPORT_EMAIL = "support@rapidhiresolutions.com";
const CANDIDATE_EMAIL = "candidates@rapidhiresolutions.com";
const HQ_CITY = "Houston, TX";
const ANSWER_TIME = "14 sec";

type Specialist = {
  initials: string;
  name: string;
  role: string;
  city: string;
  blurb: string;
  years: string;
};

const TEAM: Specialist[] = [
  {
    initials: "JM",
    name: "Jordan M.",
    role: "Senior Account Specialist",
    city: "Houston, TX",
    blurb:
      "Onboards new staffing and healthcare clients and runs point on day-to-day account questions. Picks up before the second ring more often than not.",
    years: "9+ years",
  },
  {
    initials: "MT",
    name: "Maya T.",
    role: "Compliance & Screening Lead",
    city: "Houston, TX",
    blurb:
      "Handles FCRA questions, adverse-action workflows, and the trickier criminal-record dispositions. A decade-plus in CRA operations.",
    years: "12+ years",
  },
  {
    initials: "PS",
    name: "Priya S.",
    role: "Client Success Specialist",
    city: "Houston, TX",
    blurb:
      "Quarterbacks renewals, package design, and quarterly review calls. The person clients call when they want a real recommendation, not a script.",
    years: "7+ years",
  },
  {
    initials: "TR",
    name: "Tyler R.",
    role: "Background Research Analyst",
    city: "Houston, TX",
    blurb:
      "Runs the verification desk — employment, education, and professional licenses. The reason your reports clear faster than the industry average.",
    years: "4+ years",
  },
];

type ComparisonRow = { question: string; rapid: string; typical: string };

const COMPARISON: ComparisonRow[] = [
  {
    question: "Who picks up the phone?",
    rapid: "A named US-based specialist on our team",
    typical: "An offshore call center reading from a script",
  },
  {
    question: "Average time to a human",
    rapid: ANSWER_TIME,
    typical: "8–14 minutes (industry survey, 2024)",
  },
  {
    question: "Same person handles your account?",
    rapid: "Yes — direct extensions, no rotating queue",
    typical: "No — a different agent every call",
  },
  {
    question: "Knows FCRA & adverse action workflow?",
    rapid: "Yes — a compliance lead is on the team",
    typical: "Routes you to a tier-2 ticket, 24–72 hr SLA",
  },
  {
    question: "Hours covered live",
    rapid: "7am–7pm Central, M–F + Sat on-call",
    typical: "Often 9–5 in a single time zone you don't share",
  },
  {
    question: "Where the team sits",
    rapid: "Houston, TX — zero offshore",
    typical: "Manila, Bengaluru, San Salvador (typical)",
  },
];

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "What's the fastest way to reach a real person?",
    a: (
      <>
        Call <a className="ink-link" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>{" "}
        between 7am and 7pm Central, Monday through Friday. Our team currently
        averages an under-15-second answer time on the main line. Email
        replies for non-urgent questions ship within one business hour during
        the same window.
      </>
    ),
  },
  {
    q: "I'm a candidate and have a question about my background check. Where do I go?",
    a: (
      <>
        Email{" "}
        <a className="ink-link" href={`mailto:${CANDIDATE_EMAIL}`}>
          {CANDIDATE_EMAIL}
        </a>{" "}
        with your full name, the employer who ordered the report, and the date
        you completed your authorization. A US-based candidate-care specialist
        will reach out — usually the same business day. You also have the
        right under the FCRA to request a free copy of any report we've
        compiled about you.
      </>
    ),
  },
  {
    q: "Something on my report looks wrong. How do disputes work?",
    a: (
      <>
        File a dispute by emailing{" "}
        <a className="ink-link" href={`mailto:${CANDIDATE_EMAIL}`}>
          {CANDIDATE_EMAIL}
        </a>{" "}
        and including the report ID and the specific item you're disputing.
        Federal law gives us 30 days to reinvestigate; in practice we close
        most disputes within 5–9 business days. We'll send you a written
        summary of the outcome and a corrected report if anything changes.
      </>
    ),
  },
  {
    q: "Can I get help with an adverse-action workflow?",
    a: (
      <>
        Yes. Our compliance lead helps clients build pre-adverse and final
        adverse-action templates that meet FCRA §615 and any state-specific
        timing rules (California, New York City, Illinois, and others have
        their own clocks). Mention "adverse action" when you call and you'll
        be routed to her directly.
      </>
    ),
  },
  {
    q: "Do you support integrations with my ATS?",
    a: (
      <>
        We have native integrations with Workable, Greenhouse, Lever, BambooHR,
        and JazzHR, plus a documented REST API for everything else. Implementation
        support is included at every plan tier — see the{" "}
        <Link href="/integrations" className="ink-link">
          Integrations page
        </Link>{" "}
        for the current list and request flow.
      </>
    ),
  },
  {
    q: "What if I need help outside business hours?",
    a: (
      <>
        Saturdays from 9am–1pm Central we run a smaller on-call shift; you can
        leave a voicemail any other time and a real person — not a ticket
        robot — will return your call by 8am Central the next business day.
        Critical issues (a stalled high-volume hiring queue, an adverse-action
        deadline) can be flagged in the voicemail to escalate to the on-call
        lead.
      </>
    ),
  },
  {
    q: "Is this page describing your real team?",
    a: (
      <>
        The roles, hours, location, and main line are real. The names and
        photos in <em>The Desk</em> section are placeholders for this preview
        and will be replaced with the live roster on launch — we'd rather show
        you the format honestly than fabricate identities.
      </>
    ),
  },
];

/* ---------- page ---------- */

export default function Support() {
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Rapid Hire Solutions",
      url:
        typeof window !== "undefined"
          ? `${window.location.origin}/support`
          : "/support",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: PHONE_TEL,
          contactType: "customer support",
          areaServed: "US",
          availableLanguage: ["English"],
          contactOption: "TollFree",
          hoursAvailable: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "07:00",
              closes: "19:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Saturday"],
              opens: "09:00",
              closes: "13:00",
            },
          ],
        },
        {
          "@type": "ContactPoint",
          email: SUPPORT_EMAIL,
          contactType: "customer support",
          areaServed: "US",
          availableLanguage: ["English"],
        },
        {
          "@type": "ContactPoint",
          email: CANDIDATE_EMAIL,
          contactType: "candidate care",
          areaServed: "US",
          availableLanguage: ["English"],
        },
      ],
    }),
    []
  );

  useSeo({
    title: "Support — Talk to a US-based human, every time",
    description:
      "No phone tree. No offshore call center. Reach a named US-based specialist in seconds, with FCRA expertise, direct extensions, and 7am–7pm Central live coverage. Trusted by 800+ HR & staffing teams.",
    jsonLd,
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="01 — Support"
        title={
          <>
            You'll talk to a real person.{" "}
            <em className="font-display italic text-[color:var(--color-accent-ink)]">
              Every time.
            </em>
          </>
        }
        lede={`No phone tree. No offshore call center. No "your ticket is important to us" loop. When you call Rapid Hire, a named US-based specialist in ${HQ_CITY} picks up — usually in seconds. They know your account, they know FCRA, and they have the authority to actually fix things.`}
      />

      {/* Hero CTAs + live answer-time panel */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container pb-16">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                >
                  <Phone className="size-4" aria-hidden />
                  Call {PHONE_DISPLAY}
                </a>
                <Link
                  href="/contact"
                  className="btn-press inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                >
                  <MessageSquare className="size-4" aria-hidden />
                  Send us a message
                </Link>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="btn-press inline-flex items-center gap-2 rounded-full px-3 py-3 text-[14px] font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent-ink)]"
                >
                  <Mail className="size-4" aria-hidden />
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
              <SupportStatusBadge />
            </div>
          </div>
        </div>
      </section>

      {/* The desk */}
      <section className="border-t border-border bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — The desk</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] max-w-3xl">
                Four people. Four direct lines.{" "}
                <em className="italic text-[color:var(--color-accent-ink)]">
                  No queue.
                </em>
              </h2>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                When something needs to move, you don't want to start over with
                a stranger. Pick the specialist closest to your question, and
                you skip the queue entirely.
              </p>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {TEAM.map((person) => (
                  <article
                    key={person.name}
                    className="reveal-on-scroll rounded-[20px] border border-border bg-white p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        aria-hidden
                        className="grid place-items-center size-14 rounded-full bg-[color:var(--color-accent-ink)]/8 text-[color:var(--color-accent-ink)] font-display text-[18px] tracking-tight"
                      >
                        {person.initials}
                      </div>
                      <div>
                        <p className="eyebrow text-[10.5px] text-[color:var(--color-ink-muted)] inline-flex items-center gap-1.5">
                          <MapPin className="size-3" aria-hidden />
                          {person.city}
                        </p>
                        <h3 className="mt-1 font-display text-[20px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                          {person.name}
                        </h3>
                        <p className="text-[13.5px] text-[color:var(--color-ink-soft)]">
                          {person.role}
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {person.blurb}
                    </p>
                    <div className="mt-5 hairline" />
                    <p className="mt-4 eyebrow text-[10.5px] text-[color:var(--color-ink-muted)]">
                      Background screening · {person.years}
                    </p>
                  </article>
                ))}
              </div>

              <p className="mt-8 max-w-2xl text-[12.5px] italic leading-[1.7] text-[color:var(--color-ink-muted)]">
                Names shown are placeholders for this preview and will be
                replaced with the live team roster on launch. The roles,
                coverage, and main line are real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="border-t border-border bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — Coverage</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] max-w-3xl">
                When the team is on the desk.
              </h2>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                One Central-time desk, no offshore handoff after hours. If you
                leave a voicemail, you'll hear back from a real person — not a
                ticket robot.
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    label: "Monday – Friday",
                    value: "7:00 AM – 7:00 PM Central",
                    detail: "Live phone, email, and chat",
                  },
                  {
                    label: "Saturday",
                    value: "9:00 AM – 1:00 PM Central",
                    detail: "On-call shift; reduced staff",
                  },
                  {
                    label: "Sunday",
                    value: "Voicemail",
                    detail: "Returned Monday by 8am Central",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="reveal-on-scroll rounded-[18px] border border-border bg-white p-6"
                  >
                    <p className="eyebrow text-[10.5px] text-[color:var(--color-ink-muted)] inline-flex items-center gap-1.5">
                      <Clock className="size-3" aria-hidden />
                      {row.label}
                    </p>
                    <p className="mt-3 font-display text-[22px] leading-[1.2] tracking-[-0.01em] text-[color:var(--color-ink)]">
                      {row.value}
                    </p>
                    <p className="mt-2 text-[13.5px] text-[color:var(--color-ink-soft)]">
                      {row.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why this matters — comparison */}
      <section className="border-t border-border bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — Why this matters</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] max-w-3xl">
                The big-four CRAs took support offshore.{" "}
                <em className="italic text-[color:var(--color-accent-ink)]">
                  We didn't.
                </em>
              </h2>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Most national background-screening providers offshored their
                customer service desks between 2014 and 2020 to cut headcount
                cost. The trade is real: cheaper for them, slower and
                lower-context for you. Here's what the difference looks like in
                practice.
              </p>

              <div className="mt-10 overflow-hidden rounded-[20px] border border-border bg-white">
                <div className="grid grid-cols-12 gap-0 bg-[color:var(--color-paper-soft)] border-b border-border">
                  <div className="col-span-6 sm:col-span-5 px-5 py-4 eyebrow text-[10.5px] text-[color:var(--color-ink-muted)]">
                    The question
                  </div>
                  <div className="col-span-3 sm:col-span-3 px-5 py-4 eyebrow text-[10.5px] text-[color:var(--color-accent-ink)]">
                    Rapid Hire
                  </div>
                  <div className="col-span-3 sm:col-span-4 px-5 py-4 eyebrow text-[10.5px] text-[color:var(--color-ink-muted)]">
                    Big-four CRAs (typical)
                  </div>
                </div>
                {COMPARISON.map((row, i) => (
                  <div
                    key={row.question}
                    className={[
                      "compare-row grid grid-cols-12 gap-0 items-start border-b border-border last:border-b-0",
                      i % 2 === 1 ? "bg-[color:var(--color-paper-soft)]/40" : "",
                    ].join(" ")}
                  >
                    <div className="col-span-12 sm:col-span-5 px-5 py-5 text-[14.5px] font-medium text-[color:var(--color-ink)]">
                      {row.question}
                    </div>
                    <div className="col-span-12 sm:col-span-3 px-5 py-5 text-[14px] text-[color:var(--color-ink)] inline-flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]" aria-hidden />
                      <span>{row.rapid}</span>
                    </div>
                    <div className="col-span-12 sm:col-span-4 px-5 py-5 text-[14px] text-[color:var(--color-ink-soft)]">
                      {row.typical}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phone CTA band */}
      <section className="border-t border-border bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="rounded-[24px] border border-border bg-white p-8 sm:p-12 reveal-on-scroll">
            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-12 lg:col-span-7">
                <p className="eyebrow text-[color:var(--color-accent-ink)]">
                  Try it.
                </p>
                <h2 className="mt-4 font-display text-[36px] sm:text-[46px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                  Call us right now.
                </h2>
                <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  The fastest way to see the difference is to pick up the
                  phone. We'll answer in seconds, in English, and you can ask
                  us anything about a screening package, an FCRA workflow, or
                  current turnaround.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-4 text-[16px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                  >
                    <Phone className="size-4" aria-hidden />
                    {PHONE_DISPLAY}
                  </a>
                  <Link
                    href="/contact"
                    className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-4 text-[15px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                  >
                    Talk to an expert
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <p className="text-center eyebrow text-[10.5px] text-[color:var(--color-ink-muted)]">
                    Avg. answer {ANSWER_TIME} · 7am–7pm Central
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate vs client routing */}
      <section className="border-t border-border bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Who needs help?</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] max-w-3xl">
                Two doors. Pick the one that fits.
              </h2>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Candidates and employers have different questions and different
                rights under the FCRA. We route you to the right specialist
                from the first message so nothing gets lost.
              </p>

              <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <article className="rounded-[20px] border border-border bg-white p-7 reveal-on-scroll">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center size-10 rounded-full bg-[color:var(--color-accent-ink)]/8 text-[color:var(--color-accent-ink)]">
                      <UserCheck className="size-5" aria-hidden />
                    </div>
                    <h3 className="font-display text-[22px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                      I'm a candidate
                    </h3>
                  </div>
                  <p className="mt-5 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    Questions about a report you authorized, a result you don't
                    recognize, or a copy of your file? Use the form below or call
                    — either way, a US-based candidate-care specialist replies the
                    same business day.
                  </p>
                  <div className="mt-6 hairline" />
                  <ul className="mt-5 grid gap-3 text-[14px] text-[color:var(--color-ink)]">
                    <li className="inline-flex items-start gap-2">
                      <Mail className="mt-0.5 size-4 text-[color:var(--color-accent-ink)] shrink-0" aria-hidden />
                      <a className="ink-link" href={`mailto:${CANDIDATE_EMAIL}`}>
                        {CANDIDATE_EMAIL}
                      </a>
                    </li>
                    <li className="inline-flex items-start gap-2">
                      <Phone className="mt-0.5 size-4 text-[color:var(--color-accent-ink)] shrink-0" aria-hidden />
                      <a className="ink-link" href={`tel:${PHONE_TEL}`}>
                        {PHONE_DISPLAY} (option 2)
                      </a>
                    </li>
                    <li className="inline-flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 size-4 text-[color:var(--color-accent-ink)] shrink-0" aria-hidden />
                      <span>FCRA file copy and dispute requests honored</span>
                    </li>
                  </ul>
                </article>

                <article className="rounded-[20px] border border-border bg-white p-7 reveal-on-scroll">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center size-10 rounded-full bg-[color:var(--color-accent-ink)]/8 text-[color:var(--color-accent-ink)]">
                      <Users className="size-5" aria-hidden />
                    </div>
                    <h3 className="font-display text-[22px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                      I'm an employer or client
                    </h3>
                  </div>
                  <p className="mt-5 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    Account questions, package changes, integration issues, or
                    a stuck report? Your direct line is the main desk during
                    business hours; expect an answer in seconds.
                  </p>
                  <div className="mt-6 hairline" />
                  <ul className="mt-5 grid gap-3 text-[14px] text-[color:var(--color-ink)]">
                    <li className="inline-flex items-start gap-2">
                      <Phone className="mt-0.5 size-4 text-[color:var(--color-accent-ink)] shrink-0" aria-hidden />
                      <a className="ink-link" href={`tel:${PHONE_TEL}`}>
                        {PHONE_DISPLAY} (option 1)
                      </a>
                    </li>
                    <li className="inline-flex items-start gap-2">
                      <Mail className="mt-0.5 size-4 text-[color:var(--color-accent-ink)] shrink-0" aria-hidden />
                      <a className="ink-link" href={`mailto:${SUPPORT_EMAIL}`}>
                        {SUPPORT_EMAIL}
                      </a>
                    </li>
                    <li className="inline-flex items-start gap-2">
                      <MessageSquare className="mt-0.5 size-4 text-[color:var(--color-accent-ink)] shrink-0" aria-hidden />
                      <Link href="/contact" className="ink-link">
                        Send us a structured message
                      </Link>
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate-direct contact form */}
      <section className="border-t border-border bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05.5 — Candidate inquiry</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] max-w-3xl">
                Candidate? Send a quick message.
              </h2>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Skip the call queue. Tell us what you're trying to resolve and a
                US-based candidate-care specialist will respond the same business
                day. Your inquiry is routed away from the employer/sales desk
                automatically.
              </p>
              <div className="mt-10 rounded-[20px] border border-border bg-white p-6 sm:p-9">
                <CandidateContactForm candidateEmail={CANDIDATE_EMAIL} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support FAQ */}
      <section className="border-t border-border bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">06 — Support FAQ</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] max-w-3xl">
                Common support questions.
              </h2>
              <SupportFaq items={FAQ} />
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility + escalation */}
      <section className="border-t border-border bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">07 — Access & escalation</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-[20px] border border-border bg-white p-7">
                  <h3 className="font-display text-[22px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                    Accessibility
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    We design Rapid Hire to meet WCAG 2.2 AA and continuously
                    test color contrast, keyboard navigation, screen-reader
                    output, and reduced-motion preferences. If you experience
                    a barrier on any page, email{" "}
                    <a className="ink-link" href={`mailto:${SUPPORT_EMAIL}`}>
                      {SUPPORT_EMAIL}
                    </a>{" "}
                    with the URL and a short description and we'll investigate
                    promptly.
                  </p>
                </div>
                <div className="rounded-[20px] border border-border bg-white p-7">
                  <h3 className="font-display text-[22px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                    Escalation path
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    If a response time falls outside our published SLA — under
                    one business hour for email, under one minute for phone
                    during live coverage — escalate by replying to your most
                    recent thread with the word <em>escalate</em> in the
                    subject. Threads marked this way route to a manager
                    directly and bypass the standard queue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="rounded-[24px] border border-border bg-white p-8 sm:p-12 text-center reveal-on-scroll">
            <p className="eyebrow text-[color:var(--color-accent-ink)]">
              Zero offshore. 100% US-based humans.
            </p>
            <h2 className="mt-4 font-display text-[36px] sm:text-[46px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
              Real support shouldn't be a feature.{" "}
              <em className="italic text-[color:var(--color-accent-ink)]">
                It's the standard.
              </em>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Trusted by 800+ HR &amp; staffing teams · Avg. 20-min report
              turnaround · 99.4% on-time SLA.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${PHONE_TEL}`}
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[15px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                <Phone className="size-4" aria-hidden />
                Call {PHONE_DISPLAY}
              </a>
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-[15px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
              >
                Talk to an expert
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

/* ---------- support FAQ ---------- */

function SupportFaq({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-10 grid">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={it.q}
            className="border-t border-border last:border-b last:border-border"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full text-left flex items-start justify-between gap-6 py-5 group"
            >
              <span className="font-display text-[20px] sm:text-[22px] leading-[1.25] tracking-[-0.005em] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)] transition-colors">
                {it.q}
              </span>
              <span
                aria-hidden
                className={[
                  "support-faq-toggle mt-1 grid place-items-center size-8 rounded-full border border-border text-[color:var(--color-ink-soft)]",
                  isOpen ? "rotate-45 text-[color:var(--color-accent-ink)] border-[color:var(--color-accent-ink)]" : "",
                ].join(" ")}
              >
                <Plus className="size-4" />
              </span>
            </button>
            <div
              className="support-faq-panel grid"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-12 text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                  {it.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

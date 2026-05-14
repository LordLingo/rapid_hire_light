/*
  Editorial Calm — Services detail page
  Layout:
   - PageHero with eyebrow "Services" + accent on "every screen we run".
   - Long-form services: 6 deeper service entries, alternating left rail
     (number + tag) and right column (title, body, what's included list,
     SLA chip). Hairline rules between entries — same editorial cadence as
     the homepage, deeper detail.
   - Closing CTA strip routes to /contact.
*/
import { Link } from "wouter";
import {
  BriefcaseBusiness,
  Gavel,
  FlaskConical,
  GraduationCap,
  Car,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";

const SERVICES = [
  {
    icon: BriefcaseBusiness,
    tag: "01 — Employment",
    title: "Employment Screening",
    body:
      "Effortlessly streamline your hiring with verified employment history, gap analysis, and reference checks — turned around faster than a recruiter can finish their morning standup.",
    includes: [
      "Past employer verification (7 years)",
      "Job title, dates, and reason for leaving",
      "Gap analysis with candidate prompts",
      "Up to 5 reference interviews",
    ],
    sla: "Avg. 18h turnaround",
  },
  {
    icon: Gavel,
    tag: "02 — Criminal",
    title: "Criminal Records",
    body:
      "Comprehensive federal, state, and county criminal history searches — built for every U.S. jurisdiction, with adverse action workflow baked in.",
    includes: [
      "Federal criminal search (94 districts)",
      "State + county criminal (7 years)",
      "Sex offender registry (national)",
      "OFAC / Interpol watch list",
      "Pre-adverse + adverse action workflow",
    ],
    sla: "85% complete < 24h",
  },
  {
    icon: FlaskConical,
    tag: "03 — Drug & Health",
    title: "Drug & Health Screening",
    body:
      "Fast, reliable 5-, 10-, and 12-panel drug testing plus occupational health screens — at over 12,000 collection sites nationwide.",
    includes: [
      "5 / 10 / 12-panel urine drug tests",
      "Hair, oral fluid, and ETG alcohol",
      "Occupational health (TB, vision)",
      "DOT and non-DOT testing programs",
      "MRO-reviewed electronic results",
    ],
    sla: "Negative results in 24h",
  },
  {
    icon: GraduationCap,
    tag: "04 — Education",
    title: "Education Verification",
    body:
      "Instantly verify degrees, diplomas, and technical certifications directly with institutions — including international credentials.",
    includes: [
      "Degree, major, and graduation status",
      "Vocational + technical certifications",
      "Foreign credential evaluation",
      "Direct Student Clearinghouse access",
    ],
    sla: "Avg. 2 business days",
  },
  {
    icon: Car,
    tag: "05 — MVR",
    title: "Motor Vehicle Reports",
    body:
      "Real-time driving records across all 50 states for any role involving a company vehicle — paired with continuous monitoring for fleet teams.",
    includes: [
      "3-, 5-, or 7-year driving history",
      "License status, class, endorsements",
      "Violations, accidents, and DUIs",
      "CDL clearinghouse query (FMCSA)",
      "Continuous MVR monitoring (optional)",
    ],
    sla: "Instant in 47 states",
  },
  {
    icon: Globe,
    tag: "06 — Social",
    title: "Social Media Checks",
    body:
      "FCRA-compliant screening of public online behavior — flagging only the categories you opt in to, never protected-class data.",
    includes: [
      "Public posts across the major platforms",
      "Hate speech and illegal-activity flags",
      "Human-reviewed evidence packets",
      "Configurable category opt-ins",
    ],
    sla: "Avg. 2 business days",
  },
];

export default function Services() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="01 — Services"
        title={
          <>
            Every screen we run, in one{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              honest list.
            </span>
          </>
        }
        lede="Comprehensive background screening services tailored to elevate your hiring process and boost your team's success — with the SLAs and inclusions written down where you can see them."
      />

      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid">
            {SERVICES.map((s, i) => (
              <article
                key={s.title}
                className={[
                  "reveal-on-scroll grid grid-cols-12 gap-x-8 gap-y-6 py-12 md:py-16",
                  i === 0 ? "" : "border-t border-border",
                ].join(" ")}
              >
                <div className="col-span-12 lg:col-span-3">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center size-10 rounded-full border border-border text-[color:var(--color-accent-ink)]">
                      <s.icon className="size-4" strokeWidth={1.5} />
                    </span>
                    <span className="eyebrow">{s.tag}</span>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <h2 className="font-display text-[28px] md:text-[36px] leading-tight text-[color:var(--color-ink)]">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                    {s.body}
                  </p>
                </div>
                <div className="col-span-12 lg:col-span-3">
                  <p className="eyebrow">What&apos;s included</p>
                  <ul className="mt-3 grid gap-1.5">
                    {s.includes.map((item) => (
                      <li
                        key={item}
                        className="text-[13.5px] leading-snug text-[color:var(--color-ink-soft)]"
                      >
                        — {item}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 inline-block rounded-full border border-[color:var(--color-accent-ink)]/20 bg-[color:var(--color-tint)] px-3 py-1 text-[11.5px] font-medium text-[color:var(--color-accent-ink)] tracking-wide">
                    {s.sla}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20">
          <div className="reveal-on-scroll grid grid-cols-12 gap-6 rounded-[20px] border border-border bg-white px-6 md:px-10 py-10 md:py-14 paper-shadow">
            <div className="col-span-12 md:col-span-8">
              <p className="eyebrow">Ready when you are</p>
              <h2 className="mt-3 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Build a package that fits the role —{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  in minutes.
                </span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:justify-end items-end">
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Get a quote
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

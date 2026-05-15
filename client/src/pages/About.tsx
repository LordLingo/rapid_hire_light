/*
  Editorial Calm — About / Company page
  Layout:
   - PageHero with eyebrow "About" and italic accent.
   - Section: "Built for hiring teams that can't afford a bad hire" — story column.
   - Stats strip (FCRA, U.S.-based, 24h SLA) on hairline grid.
   - Principles: 4 numbered principles with eyebrow + body, no boxes.
   - Leadership / team — small ink portraits placeholder grid.
   - Closing CTA → /contact.
*/
import { Link } from "wouter";
import { ArrowUpRight, ShieldCheck, Compass, Sparkles, BadgeCheck } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { AboutOrgChart, TrustLedger } from "@/components/heroes/HeroCards";
import HeroMiniStats from "@/components/heroes/HeroMiniStats";

const STATS = [
  { k: "85%+", v: "of checks complete in under 24 hours" },
  { k: "U.S.", v: "based support team — same-day response" },
  { k: "FCRA", v: "certified, SOC 2 + HIPAA compliant" },
  { k: "12,000+", v: "drug & health collection sites nationwide" },
];

const PRINCIPLES = [
  {
    icon: Compass,
    eyebrow: "01 — Why we exist",
    title: "Hiring shouldn't feel like gambling.",
    body:
      "A bad hire costs roughly 30% of that role's first-year salary — sometimes far more. We built Rapid Hire Solutions so growing teams could move quickly without trading away the diligence that protects them.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "02 — How we work",
    title: "Compliance is a feature, not a checkbox.",
    body:
      "Every workflow we ship — disclosures, authorizations, adverse action — is FCRA-aligned by default. Auditors, legal teams, and HR get a clean trail without anyone having to remember to do it manually.",
  },
  {
    icon: Sparkles,
    eyebrow: "03 — How we treat candidates",
    title: "The candidate experience matters as much as the report.",
    body:
      "Mobile-first intake, plain-language disclosures, real-time status. The first impression a candidate has of the company should not be a confusing PDF emailed at 11pm.",
  },
  {
    icon: BadgeCheck,
    eyebrow: "04 — How we measure ourselves",
    title: "Results in a day. Service in real time.",
    body:
      "Over 85% of background checks return within 24 hours, and our U.S.-based specialists answer the same business day. If a search is going to take longer, you'll hear it from a human, not a status page.",
  },
];

const TEAM = [
  { name: "M. Alvarez", role: "Founder & CEO", initials: "MA" },
  { name: "S. Chen", role: "Head of Compliance", initials: "SC" },
  { name: "J. Patel", role: "Head of Operations", initials: "JP" },
  { name: "R. Okafor", role: "Head of Customer Success", initials: "RO" },
];

export default function About() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="04 — About"
        title={
          <>
            We&apos;re building the{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              quiet
            </span>{" "}
            background-check company.
          </>
        }
        lede="Founded in 2011, Rapid Hire Solutions is a U.S.-based, FCRA-certified background screening company built for hiring teams that need speed without giving up compliance. Privately held, owner-operated, and answering to the same operating principle for fourteen years: pick up the phone, verify the source, treat candidates like people."
        visual={<AboutOrgChart />}
        belowVisual={<HeroMiniStats page="about" />}
      />

      {/* Story */}
      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28 grid grid-cols-12 gap-x-10 gap-y-10">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow">05 — Our story</p>
            <div className="mt-3 hairline" />
            <div className="mt-8 hidden lg:block">
              <TrustLedger />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
            <p className="font-display text-[28px] sm:text-[34px] md:text-[40px] leading-[1.2] tracking-[-0.015em] text-[color:var(--color-ink)]">
              Most background-check companies were built for the world before
              high-volume hiring. We were built for the one after it.
            </p>
            <div className="mt-8 grid md:grid-cols-2 gap-x-12 gap-y-6 text-[16px] leading-[1.8] text-[color:var(--color-ink-soft)]">
              <p>
                Our founding team came out of staffing operations and
                regulated industries — healthcare, logistics, financial
                services. We knew first-hand how a single missed compliance
                step could derail a class-action-sized risk, and how a
                two-week background check could lose a candidate to a faster
                competitor.
              </p>
              <p>
                So we built the platform we wished we had: a single workflow
                that handles disclosures, authorizations, adjudication, and
                adverse action automatically — and an in-house operations
                team that returns over 85% of checks within a single business
                day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8 reveal-on-scroll">
            {STATS.map((s, i) => (
              <div
                key={s.k}
                className={[
                  "col-span-6 md:col-span-3",
                  i !== 0 ? "md:border-l md:border-border md:pl-8" : "",
                ].join(" ")}
              >
                <p className="font-display text-[36px] md:text-[44px] leading-none text-[color:var(--color-ink)] tracking-[-0.02em]">
                  {s.k}
                </p>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-[color:var(--color-ink-soft)] max-w-[220px]">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones — fourteen years on the page */}
      <section className="bg-white border-y border-border">
        <div className="container py-24 md:py-32">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">06 — Milestones</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[40px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Fourteen years{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  on the page.
                </span>
              </h2>
              <p className="mt-6 text-[15.5px] leading-[1.8] text-[color:var(--color-ink-soft)] max-w-[640px]">
                A short history of the moments that shaped the company we are
                now &mdash; from a single-account staffing build in 2011 to the
                FCRA-aligned, SOC&nbsp;2 + HIPAA-compliant operation that ships
                today.
              </p>
            </div>
          </div>

          <ol className="mt-14 grid grid-cols-12 gap-x-10 gap-y-10">
            {[
              {
                year: "2011",
                title: "Founded for staffing operators",
                body:
                  "Rapid Hire Solutions opens with a single account: a regional staffing firm that needed FCRA-aligned screening it couldn't get from a legacy CRA. The product roadmap is set by what staffing operators actually run.",
              },
              {
                year: "2014",
                title: "Healthcare practice opens",
                body:
                  "Dedicated OIG LEIE + GSA SAM monitoring workflow ships for the first regional health-system client. HIPAA posture is hardened across the platform the same year.",
              },
              {
                year: "2017",
                title: "DOT / MVR program",
                body:
                  "49&nbsp;CFR Part&nbsp;40-aligned drug & alcohol workflow and a 50-state MVR pipeline launch for transportation and logistics customers.",
              },
              {
                year: "2020",
                title: "Mobile-first candidate intake",
                body:
                  "Plain-language disclosures, e-sign authorizations, and real-time status pages roll out so candidates aren't navigating PDFs at 11pm. Drop-off rates fall sharply.",
              },
              {
                year: "2022",
                title: "24-hour SLA hits 85%",
                body:
                  "Operations build-out lands the median turnaround on a single business day, with over 85% of reports closed inside 24 hours and a U.S.-based specialist on every escalation.",
              },
              {
                year: "2024",
                title: "Native ATS integrations",
                body:
                  "Direct integrations with the major ATS and HRIS platforms ship; SFTP for everyone else. Compliance and adverse-action workflows are wired into the same lane as ordering.",
              },
              {
                year: "2026",
                title: "Where we are today",
                body:
                  "Privately held, owner-operated, U.S.-based. FCRA-certified, SOC&nbsp;2 and HIPAA compliant. Same operating principle as day one: pick up the phone, verify at the source, treat candidates like people.",
              },
            ].map((m, i) => (
              <li
                key={m.year}
                className={[
                  "reveal-on-scroll col-span-12 md:col-span-6 lg:col-span-4 pt-6",
                  "border-t border-border",
                ].join(" ")}
              >
                <p className="eyebrow">{m.year}</p>
                <h3 className="mt-3 font-display text-[22px] leading-snug text-[color:var(--color-ink)]">
                  {m.title}
                </h3>
                <p
                  className="mt-3 text-[14.5px] leading-[1.75] text-[color:var(--color-ink-soft)]"
                  dangerouslySetInnerHTML={{ __html: m.body }}
                />
                {i === 6 ? null : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-[color:var(--color-paper)] border-b border-border">
        <div className="container py-24 md:py-32">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">07 &mdash; Principles</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[40px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                What we{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  believe
                </span>{" "}
                — and how it shows up in the product.
              </h2>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-x-10 gap-y-12">
            {PRINCIPLES.map((p) => (
              <article
                key={p.title}
                className="reveal-on-scroll col-span-12 md:col-span-6 flex gap-6"
              >
                <span className="grid place-items-center size-11 shrink-0 rounded-full border border-border text-[color:var(--color-accent-ink)]">
                  <p.icon className="size-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="eyebrow">{p.eyebrow}</p>
                  <h3 className="mt-3 font-display text-[24px] leading-snug text-[color:var(--color-ink)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                    {p.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white border-b border-border">
        <div className="container py-24 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">08 — Leadership</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                People who&apos;ve actually{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  hired at scale.
                </span>
              </h2>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-6">
            {TEAM.map((p) => (
              <div
                key={p.name}
                className="reveal-on-scroll col-span-6 md:col-span-3"
              >
                <div className="hover-lift-card aspect-[4/5] rounded-[16px] border border-border bg-white flex items-end p-5">
                  <div className="w-full">
                    <span
                      aria-hidden
                      className="block size-12 rounded-full border border-border grid place-items-center font-display text-[18px] text-[color:var(--color-ink)]"
                    >
                      {p.initials}
                    </span>
                    <p className="mt-5 font-display text-[18px] text-[color:var(--color-ink)]">
                      {p.name}
                    </p>
                    <p className="mt-1 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      {p.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[color:var(--color-paper)] border-t border-border">
        <div className="container py-20 md:py-24">
          <div className="reveal-on-scroll grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 md:col-span-8">
              <p className="eyebrow">09 — Talk to us</p>
              <h3 className="mt-4 font-display text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Hiring at scale and tired of gambling on a vendor?
              </h3>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Talk to our team
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

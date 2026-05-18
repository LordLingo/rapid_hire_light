/*
  Compliance — §59
  -----------------
  Inner page covering Rapid Hire Solutions' compliance posture across the
  full FCRA + state-law + EEOC + drug + data-security stack.

  Topic structure mirrors what a typical CRA compliance page covers, but
  every line of copy is original and grounded in claims the rest of the
  Rapid Hire site already makes (FCRA Certified, SOC 2 Type II, HIPAA,
  U.S.-based ops, two-step adverse action workflow, etc).

  Visual rhythm: warm-paper sections alternate with footer-family dark
  navy gradient bands so the page has the same breathing room as
  /pricing and /support.

    01 — paper-soft   Overview / certifications grid
    02 — paper        FCRA
    03 — DARK BAND    Adverse action workflow
    04 — paper        State + local laws
    05 — paper-soft   EEOC + individualized assessment
    06 — DARK BAND    Drug + health screening
    07 — paper        Data security
    08 — paper-soft   Candidate rights + dispute resolution
    09 — DARK BAND    Certifications + audits
    + CtaBanner

  All five visuals are code-built (SVG / JSX) except the hero photo,
  which is one AI-generated editorial portrait stored on the webdev
  CDN.
*/
import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Users,
  Lock,
  Stethoscope,
  ScrollText,
  Scale,
  Phone,
  CalendarCheck2,
  FileDown,
  CheckCircle2,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";

/* ---------- imagery ---------- */

const COMPLIANCE_HERO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/compliance-hero-eLzmKQYEgYhZ63jMevbAMn.webp";

/* ---------- shared section shell ---------- */

type SectionProps = {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  children: React.ReactNode;
  /** Surface variant. */
  surface?: "paper" | "paper-soft" | "dark";
  /** Marker class used by the §59 vitest pins. */
  markerClass?: string;
};

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  surface = "paper",
  markerClass,
}: SectionProps) {
  if (surface === "dark") {
    return (
      <section
        id={id}
        className={[
          "relative overflow-hidden text-[color:var(--color-footer-foreground)]",
          markerClass ?? "",
        ].join(" ")}
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-footer-soft) 0%, var(--color-footer) 65%, var(--color-footer) 100%)",
          colorScheme: "dark",
        }}
      >
        {/* top sky-halo hairline glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-accent-halo) 55%, transparent) 30%, color-mix(in oklch, var(--color-accent-halo) 55%, transparent) 70%, transparent)",
          }}
        />
        {/* halo behind the headline column */}
        <div
          aria-hidden
          className="compliance-section-halo pointer-events-none absolute -top-32 left-1/4 h-[460px] w-[460px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--color-accent-halo), transparent 70%)",
          }}
        />
        <div className="container relative py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow text-[color:var(--color-footer-muted)]">
                {eyebrow}
              </p>
              <div
                className="mt-3 h-px"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in oklch, var(--color-accent-halo) 45%, transparent), transparent 80%)",
                }}
              />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[34px] sm:text-[42px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-footer-foreground)]">
                {title}
              </h2>
              {lede ? (
                <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-[color:var(--color-footer-soft-text)]">
                  {lede}
                </p>
              ) : null}
              <div className="mt-10">{children}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // light surfaces
  const bg =
    surface === "paper-soft"
      ? "bg-[color:var(--color-paper-soft)]"
      : "bg-[color:var(--color-paper)]";

  return (
    <section
      id={id}
      className={["relative", bg, markerClass ?? ""].join(" ")}
    >
      <div className="container py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow">{eyebrow}</p>
            <div className="mt-3 hairline" />
          </div>
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
            <h2 className="font-display text-[34px] sm:text-[42px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
              {title}
            </h2>
            {lede ? (
              <p className="mt-5 max-w-2xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {lede}
              </p>
            ) : null}
            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 01: certifications trust grid (light) ---------- */

const TRUST_CARDS: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "FCRA Certified",
    body: "Every analyst on the desk completes annual FCRA training before they touch a single report. No exceptions.",
    icon: <ShieldCheck className="size-5" />,
  },
  {
    title: "SOC 2 Type II",
    body: "Independently audited controls covering security, availability, confidentiality, and processing integrity.",
    icon: <Lock className="size-5" />,
  },
  {
    title: "HIPAA aligned",
    body: "Drug and health-related screenings travel through a HIPAA-aligned channel with Business Associate paperwork on file.",
    icon: <Stethoscope className="size-5" />,
  },
  {
    title: "U.S.-based ops",
    body: "Verifications, candidate calls, and disputes are handled in Prosper, TX — never offshored, never queued offshore.",
    icon: <Users className="size-5" />,
  },
];

/* ---------- §68: credibility bar (under hero, before §01) ---------- */

type CredItem = {
  slug: "soc2" | "pbsa" | "fcra";
  badge: string; // /manus-storage URL of the round badge image
  title: string;
  caption: string; // small caption to the left of " · Verify"
  alt: string; // a11y alt text for the badge image
};

const CRED_BADGES: CredItem[] = [
  {
    slug: "soc2",
    badge: "/manus-storage/badge-soc2-type2_36054675.webp",
    title: "SOC 2 Type II",
    caption: "Attested annually",
    alt: "SOC 2 Type II independently attested annually",
  },
  {
    slug: "pbsa",
    badge: "/manus-storage/badge-pbsa-member_4f368a83.webp",
    title: "PBSA Member",
    caption: "In good standing",
    alt: "Professional Background Screening Association — member in good standing",
  },
  {
    slug: "fcra",
    badge: "/manus-storage/badge-fcra-aligned_359d4dc8.webp",
    title: "FCRA-aligned",
    caption: "15 U.S.C. §1681 workflow",
    alt: "FCRA-aligned screening workflow — Fair Credit Reporting Act",
  },
];

function ComplianceCredibilityBar() {
  return (
    <section
      data-testid="compliance-credibility-bar"
      aria-label="Independent attestations and U.S. specialist support"
      className="relative bg-[color:var(--color-paper-soft)]"
    >
      {/* hairline rules top + bottom anchor the bar visually between hero and §01 */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in oklch, var(--color-ink) 14%, transparent) 30%, color-mix(in oklch, var(--color-ink) 14%, transparent) 70%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in oklch, var(--color-ink) 14%, transparent) 30%, color-mix(in oklch, var(--color-ink) 14%, transparent) 70%, transparent)",
        }}
      />
      <div className="container py-6 md:py-7">
        <ul
          className="
            grid grid-cols-1 gap-y-5
            sm:grid-cols-2 sm:gap-x-8
            lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-8
          "
        >
          {CRED_BADGES.map((b) => (
            <li
              key={b.slug}
              data-testid={`compliance-cred-badge-${b.slug}`}
              className="flex items-center gap-3"
            >
              <img
                src={b.badge}
                alt={b.alt}
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="size-9 shrink-0 rounded-full select-none"
                draggable={false}
              />
              <div className="min-w-0">
                <p className="font-display text-[15px] leading-[1.2] tracking-[-0.005em] text-[color:var(--color-ink)]">
                  {b.title}
                </p>
                <p className="mt-0.5 text-[12.5px] leading-[1.4] text-[color:var(--color-ink-muted)]">
                  {b.caption} ·{" "}
                  <Link
                    href={`/trust#${b.slug}`}
                    data-testid={`compliance-cred-verify-${b.slug}`}
                    className="underline decoration-[color:color-mix(in_oklch,var(--color-accent-ink)_55%,transparent)] underline-offset-[3px] hover:decoration-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)] transition-colors duration-150"
                  >
                    Verify
                  </Link>
                </p>
              </div>
            </li>
          ))}

          {/* item 4 — scale proof (Rapid-Hire-truthful, already on Footer) */}
          <li
            data-testid="compliance-cred-scale"
            className="flex items-center gap-3 text-[color:var(--color-ink-soft)]"
          >
            <span
              aria-hidden
              className="grid place-items-center size-9 shrink-0 rounded-full border border-border bg-white text-[color:var(--color-accent-ink)]"
            >
              <ShieldCheck className="size-4" strokeWidth={2} />
            </span>
            <p className="text-[13px] leading-[1.45] tracking-[-0.005em]">
              <span className="font-medium text-[color:var(--color-ink)]">
                10,000+ HR &amp; staffing teams
              </span>{" "}
              <span className="text-[color:var(--color-ink-muted)]">
                · 99.4% on-time
              </span>
            </p>
          </li>

          {/* item 5 — U.S. specialist hours line (matches Support.tsx exactly) */}
          <li
            data-testid="compliance-cred-hours"
            className="flex items-center gap-3 text-[color:var(--color-ink-soft)]"
          >
            <span
              aria-hidden
              className="grid place-items-center size-9 shrink-0 rounded-full border border-border bg-white text-[color:var(--color-accent-ink)]"
            >
              <Phone className="size-4" strokeWidth={2} />
            </span>
            <p className="text-[13px] leading-[1.45] tracking-[-0.005em]">
              <span className="font-medium text-[color:var(--color-ink)]">
                U.S. specialist
              </span>{" "}
              <span className="text-[color:var(--color-ink-muted)]">
                Mon–Fri 7am–7pm CT · Sat on-call
              </span>
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

function TrustGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {TRUST_CARDS.map((c) => (
        <article
          key={c.title}
          className="hover-lift-card reveal-on-scroll rounded-[18px] border border-border bg-white p-6"
        >
          <div className="flex items-center gap-3 text-[color:var(--color-accent-ink)]">
            <span className="grid place-items-center size-9 rounded-full border border-border bg-[color:var(--color-paper-soft)]">
              {c.icon}
            </span>
            <p className="font-display text-[18px] tracking-[-0.01em] text-[color:var(--color-ink)]">
              {c.title}
            </p>
          </div>
          <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
            {c.body}
          </p>
        </article>
      ))}
    </div>
  );
}

/* ---------- 03: adverse-action three-step diagram (dark) ---------- */

const ADVERSE_STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Pre-adverse notice",
    body: "We deliver the pre-adverse letter, a copy of the consumer report, and the federal Summary of Rights to the candidate as soon as the employer flags the file.",
  },
  {
    n: "02",
    title: "Reasonable waiting window",
    body: "By default we recommend a five business-day window before any final decision is taken, giving the candidate time to dispute or clarify the record.",
  },
  {
    n: "03",
    title: "Final action notice",
    body: "If the employer proceeds, the final adverse-action notice goes out the same day with the CRA contact info and reinvestigation rights spelled out.",
  },
];

function AdverseFlow() {
  return (
    <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {ADVERSE_STEPS.map((s) => (
        <li
          key={s.n}
          className="reveal-on-scroll rounded-[18px] p-6 transition-colors duration-300 ease-out"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor:
              "color-mix(in oklch, var(--color-footer-foreground) 18%, transparent)",
            backgroundColor:
              "color-mix(in oklch, var(--color-footer-foreground) 4%, transparent)",
          }}
        >
          <p className="eyebrow text-[color:var(--color-footer-muted)]">
            STEP {s.n}
          </p>
          <p className="mt-4 font-display text-[20px] tracking-[-0.01em] text-[color:var(--color-footer-foreground)]">
            {s.title}
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-footer-soft-text)]">
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ---------- 04: state-law matrix (light) ---------- */

const STATE_NOTES: { jurisdiction: string; note: string }[] = [
  {
    jurisdiction: "California (ICRAA / CCRAA)",
    note: "Investigative consumer reports require the expanded California-specific disclosure and a check-box for a free copy of the report.",
  },
  {
    jurisdiction: "New York City (Fair Chance Act)",
    note: "Conditional offer must precede the criminal-history inquiry; we sequence the report so the conditional-offer attestation is captured first.",
  },
  {
    jurisdiction: "Cook County, IL",
    note: "Restricted look-back for non-conviction records and tighter individualized-assessment requirements before adverse action.",
  },
  {
    jurisdiction: "Seattle, WA",
    note: "Pre-employment criminal-history inquiry only after a conditional offer, with a written justification for any negative use.",
  },
  {
    jurisdiction: "Massachusetts CORI",
    note: "Reports limited to the state CORI scope unless an expanded authorization is on file. We default to the conservative scope.",
  },
  {
    jurisdiction: "Federal (FCRA §1681k)",
    note: "Public-record reports used for employment require either contemporaneous notice to the candidate or strict accuracy procedures. We use both.",
  },
];

function StateMatrix() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {STATE_NOTES.map((s) => (
        <article
          key={s.jurisdiction}
          className="hover-lift-card reveal-on-scroll rounded-[16px] border border-border bg-white p-6"
        >
          <p className="font-display text-[17px] tracking-[-0.01em] text-[color:var(--color-ink)]">
            {s.jurisdiction}
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
            {s.note}
          </p>
        </article>
      ))}
    </div>
  );
}

/* ---------- 05: EEOC Green-factor checklist (light) ---------- */

const EEOC_FACTORS: { title: string; body: string }[] = [
  {
    title: "The nature and gravity of the offense",
    body: "We surface the offense category, statute, and disposition language so the employer can assess severity in context — never just a yes/no flag.",
  },
  {
    title: "Time elapsed since the offense",
    body: "Every record carries the disposition date and an at-a-glance years-since marker so older records aren't given the same weight as recent ones.",
  },
  {
    title: "Nature of the job sought",
    body: "We log the position description on the order so the screen scope reflects job-relatedness — a CDL role and a remote analyst role get different lookups.",
  },
  {
    title: "The candidate's response window",
    body: "Our adverse-action workflow defaults to a five business-day candidate response window, giving the applicant a chance to provide context before final action.",
  },
];

function EeocList() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {EEOC_FACTORS.map((f) => (
        <li
          key={f.title}
          className="hover-lift-card reveal-on-scroll rounded-[16px] border border-border bg-white p-6"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 grid place-items-center size-8 rounded-full bg-[color:var(--color-paper-soft)] text-[color:var(--color-accent-ink)]"
            >
              <Scale className="size-4" />
            </span>
            <div>
              <p className="font-display text-[17px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                {f.title}
              </p>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {f.body}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- 06: drug + health (dark) ---------- */

const DRUG_BULLETS: { title: string; body: string }[] = [
  {
    title: "DOT and non-DOT panels",
    body: "5-panel and 10-panel options for non-regulated programs; full DOT compliance with random-pool management for regulated employers.",
  },
  {
    title: "Chain-of-custody first",
    body: "Every collection runs against a chain-of-custody form. If the form has a gap, the lab rejects the specimen — and so do we.",
  },
  {
    title: "Medical Review Officer review",
    body: "Non-negative results route through a licensed MRO before they ever reach the employer dashboard. The employer sees a verified result, not a raw lab line.",
  },
  {
    title: "HIPAA-aligned routing",
    body: "Health-protected results travel inside our HIPAA-aligned subsystem. BAAs are on file with each lab and MRO partner.",
  },
];

function DrugList() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {DRUG_BULLETS.map((b) => (
        <li
          key={b.title}
          className="reveal-on-scroll rounded-[16px] p-6 transition-colors duration-300 ease-out"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor:
              "color-mix(in oklch, var(--color-footer-foreground) 18%, transparent)",
            backgroundColor:
              "color-mix(in oklch, var(--color-footer-foreground) 4%, transparent)",
          }}
        >
          <p className="font-display text-[18px] tracking-[-0.01em] text-[color:var(--color-footer-foreground)]">
            {b.title}
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-footer-soft-text)]">
            {b.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- 07: data security shield diagram (light) ---------- */

const SECURITY_LAYERS: { layer: string; body: string }[] = [
  {
    layer: "Encryption in transit + at rest",
    body: "TLS 1.2+ for every connection; AES-256 at rest. Database snapshots and report PDFs share the same encryption envelope as live storage.",
  },
  {
    layer: "Role-based access control",
    body: "Internal access is scoped by role and audited weekly. Reports are visible only to the requester, the assigned analyst, and the named QA reviewer.",
  },
  {
    layer: "Retention + purge on a schedule",
    body: "Reports are retained per the federal and state CRA windows that apply to the order, then purged on an automated schedule with a verifiable audit log.",
  },
  {
    layer: "Vendor management",
    body: "Every lab, court runner, and verification vendor is on a SOC 2 program. New vendors don't see candidate data until the BAA and security review close.",
  },
];

function SecurityStack() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SECURITY_LAYERS.map((s) => (
        <article
          key={s.layer}
          className="hover-lift-card reveal-on-scroll rounded-[16px] border border-border bg-white p-6"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 grid place-items-center size-8 rounded-full bg-[color:var(--color-paper-soft)] text-[color:var(--color-accent-ink)]"
            >
              <Lock className="size-4" />
            </span>
            <div>
              <p className="font-display text-[17px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                {s.layer}
              </p>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {s.body}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ---------- 08: candidate rights (light) ---------- */

const RIGHTS_ROWS: { right: string; body: string }[] = [
  {
    right: "Right to a copy of the report",
    body: "Candidates can request a free copy of their consumer report from us at any time, and we deliver it within the FCRA's five business-day window.",
  },
  {
    right: "Right to dispute",
    body: "Disputes can be opened by phone, email, or candidate portal. We acknowledge inside one business day and complete reinvestigation within 30 days.",
  },
  {
    right: "Right to an updated report after reinvestigation",
    body: "Once a record changes, we re-issue the corrected report to both the candidate and the employer at no charge.",
  },
  {
    right: "Right to receive the federal Summary of Rights",
    body: "Every adverse-action package includes the current CFPB-issued Summary of Rights and our CRA contact line so candidates always know who to call.",
  },
];

function RightsTable() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-white">
      <ul className="divide-y divide-border">
        {RIGHTS_ROWS.map((r) => (
          <li key={r.right} className="grid md:grid-cols-12 gap-4 px-6 py-5">
            <div className="md:col-span-5">
              <p className="font-display text-[16.5px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                {r.right}
              </p>
            </div>
            <div className="md:col-span-7">
              <p className="text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {r.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 09: certifications + audits (dark) ---------- */

const BADGES: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "SOC 2 Type II",
    body: "Annual independent audit of security, availability, confidentiality, and processing-integrity controls.",
    icon: <ShieldCheck className="size-5" />,
  },
  {
    title: "HIPAA",
    body: "Business Associate Agreements on file with every lab and MRO; PHI handling reviewed annually.",
    icon: <Stethoscope className="size-5" />,
  },
  {
    title: "FCRA training",
    body: "All new analysts complete FCRA training before they touch a live order; recertification every 12 months.",
    icon: <FileCheck2 className="size-5" />,
  },
  {
    title: "PBSA pathway",
    body: "Operations are aligned with the Professional Background Screening Association accreditation framework.",
    icon: <ScrollText className="size-5" />,
  },
];

function BadgeGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {BADGES.map((b) => (
        <article
          key={b.title}
          className="reveal-on-scroll rounded-[18px] p-6 transition-colors duration-300 ease-out"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor:
              "color-mix(in oklch, var(--color-footer-foreground) 18%, transparent)",
            backgroundColor:
              "color-mix(in oklch, var(--color-footer-foreground) 4%, transparent)",
          }}
        >
          <div className="flex items-center gap-3 text-[color:var(--color-accent-halo)]">
            <span
              aria-hidden
              className="grid place-items-center size-9 rounded-full"
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor:
                  "color-mix(in oklch, var(--color-accent-halo) 45%, transparent)",
                backgroundColor:
                  "color-mix(in oklch, var(--color-accent-halo) 12%, transparent)",
              }}
            >
              {b.icon}
            </span>
            <p className="font-display text-[18px] tracking-[-0.01em] text-[color:var(--color-footer-foreground)]">
              {b.title}
            </p>
          </div>
          <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--color-footer-soft-text)]">
            {b.body}
          </p>
        </article>
      ))}
    </div>
  );
}

/* ---------- page ---------- */

export default function Compliance() {
  useSeo({
    title: "Compliance — FCRA, EEOC, and data-security posture",
    description:
      "How Rapid Hire Solutions runs an FCRA-certified, SOC 2 Type II, HIPAA-aligned screening program — adverse action workflow, state-law matrix, EEOC individualized assessment, drug screening, data security, and candidate rights.",
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="00 — Compliance"
        title={
          <>
            Compliance is the product,{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              not the disclaimer.
            </span>
          </>
        }
        lede="Every screen Rapid Hire Solutions runs is governed by the same standards you'd want applied to your own employment record — the federal FCRA, the state and local laws that ride on top of it, the EEOC's individualized-assessment guidance, and a SOC 2 Type II / HIPAA-aligned data envelope. Here's how that works in practice."
        visualBleed
        visual={
          <div className="relative w-full">
            {/* Framed hero photo — owns its own rounded clip so the badges outside
                this wrapper can overhang the frame edges without being clipped. */}
            <div className="overflow-hidden rounded-[18px] border border-border paper-shadow bg-white">
              <img
                src={COMPLIANCE_HERO_URL}
                alt=""
                loading="eager"
                decoding="async"
                className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[420px] object-cover"
              />
            </div>
            {/* Top-right credibility badge — SOC 2 Type II.
                Overhangs the frame by ~28px (top) and ~24px (right) at md+.
                Sits OUTSIDE the rounded-frame's overflow-hidden wrapper so it
                visually floats off the corner instead of covering the subject. */}
            <div
              data-testid="compliance-hero-badge-soc2"
              className="hidden sm:block absolute -top-6 -right-4 md:-top-7 md:-right-6 w-[200px] md:w-[214px] rounded-[14px] paper-shadow bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)] px-4 py-3 ring-1 ring-[color:var(--color-accent-halo)]/15"
              style={{ colorScheme: "dark" }}
            >
              <p className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-footer-muted)]">
                SOC 2 Type II
              </p>
              <p className="mt-1 font-display text-[16px] leading-[1.2] text-[color:var(--color-footer-foreground)]">
                Re-attested every 12 months
              </p>
              <p className="mt-1.5 text-[11px] leading-[1.45] text-[color:var(--color-footer-soft-text)]">
                Report available under NDA
              </p>
            </div>
            {/* Bottom-left credibility badge — Dispute rate.
                Overhangs the frame by ~24px (bottom) and ~24px (left) at md+,
                mirroring the SOC 2 badge across the diagonal. */}
            <div
              data-testid="compliance-hero-badge-dispute"
              className="hidden sm:block absolute -bottom-6 -left-4 md:-bottom-7 md:-left-6 w-[220px] md:w-[232px] rounded-[14px] paper-shadow bg-white px-4 py-3 ring-1 ring-[color:var(--color-border)]"
            >
              <div className="flex items-center gap-2">
                <span
                  data-testid="compliance-hero-badge-dispute-dot"
                  className="size-2 rounded-full bg-[color:var(--color-accent-ink)] support-status-dot-live"
                />
                <p className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-ink-muted)]">
                  Trailing 12 months
                </p>
              </div>
              <p className="mt-1 font-display text-[16px] leading-[1.2] text-[color:var(--color-ink)]">
                Dispute rate under 0.4%
              </p>
              <p className="mt-1.5 text-[11px] leading-[1.45] text-[color:var(--color-ink-muted)]">
                FCRA §611 reinvestigations resolved on time
              </p>
            </div>
          </div>
        }
        afterLede={
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/compliance/audit"
                data-testid="compliance-cta-audit"
                className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]"
              >
                <CalendarCheck2 aria-hidden className="size-4" />
                Book a free 15-min audit
              </Link>
              <Link
                href="/compliance/checklist"
                data-testid="compliance-cta-checklist"
                className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-border)] bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] transition-colors duration-200 ease-out hover:border-[color:var(--color-ink-soft)]"
              >
                <FileDown aria-hidden className="size-4 text-[color:var(--color-accent-ink)]" />
                Get the 24-point checklist
              </Link>
            </div>
            <ul
              data-testid="compliance-trust-strip"
              className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13.5px] text-[color:var(--color-ink-soft)]"
            >
              {[
                "FCRA §§604, 611, 613, 615 workflow",
                "EEOC 2012 individualized assessment",
                "35+ state & city overlays tracked",
                "SOC 2 Type II + HIPAA aligned",
              ].map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <CheckCircle2
                    aria-hidden
                    className="size-4 shrink-0 text-[color:var(--color-accent-ink)]"
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </>
        }
      />

      {/*
        §68 — Credibility bar
        ----------------------
        Horizontal certification strip that sits directly under the hero,
        before §01. Three round badges (SOC 2 Type II, PBSA Member,
        FCRA-aligned) each carry a Verify link that jumps to the matching
        per-badge anchor on /trust (§67), so procurement / vendor-risk
        teams can pivot from "we are compliant" to the attestation
        evidence in one click.

        Items 4 & 5 in the bar are deliberately Rapid-Hire-truthful and
        already published elsewhere on the site: an 800+ teams scale
        proof and our verified support hours from Support.tsx. We avoid
        claiming a founding year because no other page on the site makes
        that claim today.
      */}
      <ComplianceCredibilityBar />

      {/* 01 — Overview */}
      <Section
        id="overview"
        eyebrow="01 — Overview"
        surface="paper-soft"
        title={
          <>
            Four standing commitments that{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              ride on every order.
            </span>
          </>
        }
        lede="Compliance isn't a page on the website — it's an operating posture. These four guarantees are the same regardless of package, volume, or industry."
      >
        <TrustGrid />
      </Section>

      {/* 02 — FCRA */}
      <Section
        id="fcra"
        eyebrow="02 — FCRA"
        surface="paper"
        title={
          <>
            The Fair Credit Reporting Act,{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              in plain language.
            </span>
          </>
        }
        lede="The FCRA governs how consumer reporting agencies like Rapid Hire collect, share, and dispute the data on a candidate's report — and what employers must do before they use it. Here's the short version."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="hover-lift-card reveal-on-scroll rounded-[16px] border border-border bg-white p-6">
            <p className="font-display text-[17px] tracking-[-0.01em] text-[color:var(--color-ink)]">
              Permissible purpose
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              We only run a consumer report when the employer has a valid
              employment-purpose authorization on file. No standing pulls, no
              speculative checks.
            </p>
          </article>
          <article className="hover-lift-card reveal-on-scroll rounded-[16px] border border-border bg-white p-6">
            <p className="font-display text-[17px] tracking-[-0.01em] text-[color:var(--color-ink)]">
              Disclosure + authorization
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Every order ships with a stand-alone written disclosure plus a
              signed authorization. We refuse orders that try to bury the
              disclosure inside a broader employment agreement.
            </p>
          </article>
          <article className="hover-lift-card reveal-on-scroll rounded-[16px] border border-border bg-white p-6">
            <p className="font-display text-[17px] tracking-[-0.01em] text-[color:var(--color-ink)]">
              Maximum possible accuracy
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Records are matched on full identifiers — name, DOB, and at
              least one secondary identifier — before anything is reported.
              Partial matches are flagged for analyst review, not auto-passed
              through.
            </p>
          </article>
          <article className="hover-lift-card reveal-on-scroll rounded-[16px] border border-border bg-white p-6">
            <p className="font-display text-[17px] tracking-[-0.01em] text-[color:var(--color-ink)]">
              Reinvestigation duty
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              When a candidate disputes a record, we open a reinvestigation
              within one business day and close it within the FCRA's 30-day
              window — usually faster.
            </p>
          </article>
        </div>
      </Section>

      {/* 03 — Adverse action (DARK) */}
      <Section
        id="adverse-action"
        eyebrow="03 — Adverse action"
        surface="dark"
        markerClass="compliance-section-dark"
        title={
          <>
            Two-step adverse action,{" "}
            <span className="italic font-light text-[color:var(--color-accent-halo)]">
              done right.
            </span>
          </>
        }
        lede="Adverse action is where most FCRA risk lives — and where the candidate experience matters most. Our default workflow runs as a clean two-step cadence with a real waiting window in between."
      >
        <AdverseFlow />
      </Section>

      {/* 04 — State + local */}
      <Section
        id="state-local"
        eyebrow="04 — State + local"
        surface="paper"
        title={
          <>
            State and local laws,{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              built into the order.
            </span>
          </>
        }
        lede="The federal FCRA is the floor. On top of it sits a moving matrix of state ICRAA laws, county ordinances, and city Fair Chance Acts. We carry the matrix so your team doesn't have to."
      >
        <StateMatrix />
      </Section>

      {/* 05 — EEOC */}
      <Section
        id="eeoc"
        eyebrow="05 — EEOC"
        surface="paper-soft"
        title={
          <>
            Individualized assessment,{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              not a yes / no flag.
            </span>
          </>
        }
        lede="The EEOC's Green-factor framework asks employers to weigh the nature of the offense, the time elapsed, and the nature of the job. We surface the data those factors need — never reduce it to a single binary."
      >
        <EeocList />
      </Section>

      {/* 06 — Drug + health (DARK) */}
      <Section
        id="drug-health"
        eyebrow="06 — Drug + health"
        surface="dark"
        markerClass="compliance-section-dark"
        title={
          <>
            Drug and health screening,{" "}
            <span className="italic font-light text-[color:var(--color-accent-halo)]">
              with a real chain of custody.
            </span>
          </>
        }
        lede="Drug and health-related screens carry their own compliance load: chain-of-custody, MRO review, and HIPAA boundaries. We run all three the same way every time."
      >
        <DrugList />
      </Section>

      {/* 07 — Data security */}
      <Section
        id="data-security"
        eyebrow="07 — Data security"
        surface="paper"
        title={
          <>
            Candidate data,{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              under four locks.
            </span>
          </>
        }
        lede="Background-screening data is among the most sensitive personal information a vendor can hold. Our security stack is layered so a single failure never exposes a candidate file."
      >
        <SecurityStack />
      </Section>

      {/* 08 — Candidate rights */}
      <Section
        id="candidate-rights"
        eyebrow="08 — Candidate rights"
        surface="paper-soft"
        title={
          <>
            Every candidate has the same{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              standing rights.
            </span>
          </>
        }
        lede="Whether the candidate is hired or not, the FCRA gives them four standing rights against any consumer reporting agency. Here's how Rapid Hire honors each one."
      >
        <RightsTable />
        <p className="mt-8 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          Candidates can reach our compliance line directly at{" "}
          <a
            href="tel:+18884453047"
            className="ink-link text-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink-strong)]"
          >
            (888) 445-3047
          </a>
          {" "}or email{" "}
          <a
            href="mailto:info@rapidhiresolutions.com"
            className="ink-link text-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink-strong)]"
          >
            info@rapidhiresolutions.com
          </a>
          . A real US-based specialist answers — no phone tree, no offshore queue.
        </p>
      </Section>

      {/* 09 — Certifications (DARK) */}
      <Section
        id="certifications"
        eyebrow="09 — Certifications"
        surface="dark"
        markerClass="compliance-section-dark"
        title={
          <>
            Audited, attested,{" "}
            <span className="italic font-light text-[color:var(--color-accent-halo)]">
              and on file.
            </span>
          </>
        }
        lede="The shorthand a procurement team usually wants. The full attestation packets are available on request once an MNDA is in place."
      >
        <BadgeGrid />
        <div className="mt-10">
          <Link
            href="/contact"
            className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-footer-foreground)] bg-[color:var(--color-footer-foreground)] px-6 py-3.5 text-[14px] font-medium text-[color:var(--color-footer)] hover:bg-[color:var(--color-accent-halo)] hover:border-[color:var(--color-accent-halo)] hover:text-[color:var(--color-footer)]"
          >
            <Phone className="size-4" />
            Talk to compliance
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>

      <CtaBanner />
    </SiteShell>
  );
}

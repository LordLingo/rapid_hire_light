/*
  Trust — /trust  (§67)
  ---------------------
  Procurement / vendor-risk landing for Rapid Hire Solutions' attestation
  marks. Linked from the Compliance hero secondary credibility row and
  the global Footer.

  Structure:
    Hero with right-rail verification card (compliance contact + how to
      request the attestation pack — mirrors the precisehire structure
      but on our own warm-paper / Fraunces / sky-halo system).
    Trio band — three certification badges in a single white card so the
      whole row reads as one clean credential block before the deep dive.
    01 — paper        SOC 2 Type II      (scope · cadence · how to verify)
    02 — DARK BAND    PBSA Member        (scope · cadence · how to verify)
    03 — paper        FCRA-aligned       (scope · cadence · how to verify)
    Procurement pack — "one email gets you the full pack" mid-page CTA.
    Closing dark CTA band — back to /compliance + forward to /compliance/audit.

  Copy is original to Rapid Hire and grounded in claims the rest of the
  site already makes (SOC 2 Type II, FCRA, U.S.-based, FCRA-certified,
  two-step adverse-action). Where the upstream reference page used
  Rapid-Hire-specific stack details we cannot verify, the language is
  generalised to defensible, truthful framing.

  Badge images are mirrored to the Rapid Hire manus-storage namespace
  via scripts run from the sandbox; the constants below are stable
  /manus-storage/ paths returned by `manus-upload-file --webdev`.
*/
import { Link } from "wouter";
import {
  ArrowUpRight,
  CalendarCheck2,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";

/* ---------- assets ---------- */

const BADGE_SOC2_URL =
  "/static/badge-soc2-type2.webp";
const BADGE_PBSA_URL =
  "/static/badge-pbsa-member.webp";
const BADGE_FCRA_URL =
  "/static/badge-fcra-aligned.webp";

/* ---------- contact constants (kept in sync with Support.tsx voice) ---------- */

const COMPLIANCE_EMAIL = "compliance@rapidhiresolutions.com";
const COMPLIANCE_PHONE_DISPLAY = "(866) 773-5486";
const COMPLIANCE_PHONE_TEL = "+18667735486";

/* ---------- badge content ---------- */

type Badge = {
  /** Stable slug used as section anchor + testid suffix. */
  slug: "soc2" | "pbsa" | "fcra";
  /** Image asset URL on /manus-storage. */
  src: string;
  /** Caption in the trio band (one short line). */
  caption: string;
  /** Section number, e.g. "01". */
  n: string;
  /** Section heading (badge name). */
  title: string;
  /** Italic accent fragment that sits next to the title. */
  accent: string;
  /** One-paragraph framing the badge. */
  intro: string;
  /** Three-block detail: scope · cadence · how to verify. */
  scope: string;
  cadence: string;
  verify: string;
  /** Small attribution footer line under the verify block. */
  attribution: string;
  /** Whether this section uses the dark navy band (true) or warm paper (false). */
  dark: boolean;
};

const BADGES: ReadonlyArray<Badge> = [
  {
    slug: "soc2",
    src: BADGE_SOC2_URL,
    caption: "Attested annually by an independent CPA firm.",
    n: "01",
    title: "SOC 2 Type II",
    accent: "attested annually",
    intro:
      "Our SOC 2 Type II report is the operational backbone of how we run a screening platform. It is not a one-time security review — it is a rolling, evidence-based attestation that the controls we say we run, we actually run, every day, for a year at a time.",
    scope:
      "The report covers the AICPA Trust Services Criteria for Security, Availability, and Confidentiality across the production environment that hosts our screening platform, candidate portal, researcher workbench, adverse-action workflow, and client portal — every system that touches a consumer report or PII in flight or at rest.",
    cadence:
      "The audit covers a rolling 12-month observation window and is re-attested every calendar year by an independent CPA firm. The current report is available under mutual NDA on request, typically within one business day.",
    verify:
      "Email compliance@rapidhiresolutions.com from a corporate domain with the words \"SOC 2 request\" in the subject. We will send back a mutual NDA, the latest report, and the bridge letter covering the gap to today.",
    attribution: "Independent CPA firm — name disclosed under NDA.",
    dark: false,
  },
  {
    slug: "pbsa",
    src: BADGE_PBSA_URL,
    caption: "Professional Background Screening Association — member in good standing.",
    n: "02",
    title: "PBSA Member",
    accent: "in good standing",
    intro:
      "PBSA is the industry association for U.S. consumer reporting agencies that perform employment background checks. Membership is the cleanest signal a procurement team can use that a screening provider is held to peer-reviewed industry standards — not just whatever the vendor decides to publish on its own site.",
    scope:
      "Members agree to abide by the PBSA Background Screening Agency Accreditation Program standards covering data security, legal compliance, client education, researcher and data standards, business practices, and verification services. Membership is publicly verifiable in the PBSA member directory.",
    cadence:
      "Membership is renewed annually. The current member directory is published on the PBSA website and is the source of truth — we do not publish a member number on the site, but we are happy to confirm it in writing for procurement or vendor-risk teams.",
    verify:
      "Verify our listing directly at thepbsa.org. If you need our internal member number on a vendor-risk form, email compliance@rapidhiresolutions.com and we will send it within one business day.",
    attribution: "Professional Background Screening Association (PBSA).",
    dark: true,
  },
  {
    slug: "fcra",
    src: BADGE_FCRA_URL,
    caption: "Fair Credit Reporting Act — 15 U.S.C. §1681 workflow, end to end.",
    n: "03",
    title: "FCRA-aligned",
    accent: "end to end",
    intro:
      "Every report we issue is produced under a permissible-purpose certification from the employer, paired with the FCRA-prescribed standalone disclosure and authorization for the consumer, and stitched into a two-step adverse-action workflow that pauses for disputes and resumes only on resolution.",
    scope:
      "Section 604(b)(2) standalone disclosure and authorization · §613 public-record procedures · §611 / §1681i reinvestigation handling · §615(a) pre-adverse and §615(a)(2) final-adverse action notices · current CFPB Summary of Rights enclosed on every notice. State and city overlays — California (ICRAA), New York City (Fair Chance Act), Los Angeles County, and Philadelphia (FCRSA) — are layered on top automatically.",
    cadence:
      "Our FCRA dispute and adverse-action procedures are reviewed each year by outside FCRA counsel. Sample notices, model forms, and the dispute-flow runbook are kept on file and shared with clients on request.",
    verify:
      "Email compliance@rapidhiresolutions.com or call our compliance desk directly at (866) 773-5486. We will send the current model-notice pack and walk you through the dispute flow on the same call.",
    attribution: "Reviewed annually by outside FCRA counsel.",
    dark: false,
  },
];

/* ---------- page ---------- */

export default function Trust() {
  useSeo({
    title: "Trust & verification — Rapid Hire Solutions",
    description:
      "Every certification mark on the Rapid Hire Solutions site is verifiable. SOC 2 Type II attested annually by an independent CPA firm, PBSA member in good standing, and an FCRA-aligned workflow reviewed annually by outside counsel. Scope, cadence, and how to verify each one.",
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="00 — Trust & verification"
        title={
          <>
            The badges on our pricing page are{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              verifiable.
            </span>
          </>
        }
        lede="We don't put attestation marks on the website that we can't back up with a real report, a real auditor, or a real membership directory. Below is exactly what each mark represents, the window it covers, and how a vendor-risk or procurement team can confirm it — usually inside the same business day."
        afterLede={
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#attestation-pack"
              data-testid="trust-cta-pack"
              className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]"
            >
              <ShieldCheck aria-hidden className="size-4" strokeWidth={2.25} />
              Request the attestation pack
            </a>
            <a
              href={`tel:${COMPLIANCE_PHONE_TEL}`}
              data-testid="trust-cta-phone"
              className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-border)] bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] transition-colors duration-200 ease-out hover:border-[color:var(--color-ink-soft)]"
            >
              <Phone
                aria-hidden
                className="size-4 text-[color:var(--color-accent-ink)]"
              />
              Talk to compliance · {COMPLIANCE_PHONE_DISPLAY}
            </a>
          </div>
        }
        visual={
          <div
            data-testid="trust-verify-card"
            className="rounded-[18px] border border-border paper-shadow bg-white p-7 md:p-8"
          >
            <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-ink-muted)]">
              Procurement / vendor-risk
            </p>
            <p className="mt-4 font-display text-[26px] leading-[1.2] text-[color:var(--color-ink)]">
              One email gets you the full attestation pack.
            </p>
            <p className="mt-4 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              SOC 2 Type II report, current PBSA membership letter, our FCRA
              model-notice pack, security questionnaire (CAIQ + SIG Lite
              pre-filled), and a sample data-processing addendum — usually
              inside the same business day.
            </p>
            <a
              href={`mailto:${COMPLIANCE_EMAIL}?subject=Attestation%20pack%20request`}
              data-testid="trust-verify-card-email"
              className="btn-press mt-6 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-4 py-2.5 text-[12.5px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]"
            >
              <Mail aria-hidden className="size-3.5" />
              {COMPLIANCE_EMAIL}
            </a>
          </div>
        }
      />

      {/* Badge trio band */}
      <section
        data-testid="trust-trio"
        aria-label="Certification badges"
        className="bg-white"
      >
        <div className="container py-14 md:py-20">
          <div className="mx-auto max-w-5xl rounded-[22px] border border-border paper-shadow bg-[color:var(--color-paper)] px-6 md:px-12 py-12 md:py-14 text-center">
            <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-ink-muted)]">
              Three marks. Each independently verifiable.
            </p>
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">
              {BADGES.map((b) => (
                <li
                  key={b.slug}
                  data-testid={`trust-trio-badge-${b.slug}`}
                  className="flex flex-col items-center"
                >
                  <a
                    href={`#${b.slug}`}
                    aria-label={`${b.title} — ${b.caption}`}
                    className="block transition-transform duration-200 ease-out hover:-translate-y-0.5"
                  >
                    <img
                      src={b.src}
                      alt={`${b.title} certification badge`}
                      width={148}
                      height={148}
                      className="block h-[148px] w-[148px] select-none"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </a>
                  <p className="mt-5 font-display text-[20px] leading-[1.2] tracking-[-0.005em] text-[color:var(--color-ink)]">
                    {b.title}
                  </p>
                  <p className="mt-2 max-w-[28ch] text-[13.5px] leading-[1.6] text-[color:var(--color-ink-soft)]">
                    {b.caption}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 01 / 02 / 03 — one section per badge */}
      {BADGES.map((b) => (
        <BadgeSection key={b.slug} badge={b} />
      ))}

      {/* Procurement / attestation-pack mid-page block */}
      <section
        id="attestation-pack"
        data-testid="trust-pack"
        className="bg-[color:var(--color-paper)] scroll-mt-24"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-end">
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-ink-muted)]">
                Procurement / vendor-risk pack
              </p>
              <h2 className="mt-5 font-display text-[36px] md:text-[44px] leading-[1.1] text-[color:var(--color-ink)]">
                One email gets you the full attestation pack —{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  usually inside the same business day.
                </span>
              </h2>
              <p className="mt-6 max-w-[60ch] text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                SOC 2 Type II report (under mutual NDA), current PBSA
                membership letter, FCRA model-notice pack, our security
                questionnaire pre-filled in both CAIQ and SIG Lite formats,
                and a sample data-processing addendum. If your vendor-risk
                team needs a specific format, tell us in the email and we
                will match it.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:col-start-8 reveal-on-scroll">
              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${COMPLIANCE_EMAIL}?subject=Attestation%20pack%20request`}
                  data-testid="trust-pack-email"
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]"
                >
                  <Mail aria-hidden className="size-4" />
                  {COMPLIANCE_EMAIL}
                </a>
                <Link
                  href="/contact"
                  data-testid="trust-pack-talk"
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-border)] bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] transition-colors duration-200 ease-out hover:border-[color:var(--color-ink-soft)]"
                >
                  Talk to compliance instead
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing dark CTA band — forward to /compliance/audit + back to /compliance */}
      <section
        data-testid="trust-closing"
        className="bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
        style={{ colorScheme: "dark" }}
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-footer-muted)]">
                The marks back the workflow — not the other way around
              </p>
              <h2 className="mt-5 font-display text-[36px] md:text-[44px] leading-[1.1] text-[color:var(--color-footer-foreground)]">
                A mark on a website is only as good as the workflow behind
                it. Walk yours through with our compliance desk.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:col-start-8 reveal-on-scroll">
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <Link
                  href="/compliance/audit"
                  data-testid="trust-closing-cta-audit"
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-white text-[color:var(--color-ink)] px-5 py-3 text-[14px] font-medium hover:bg-[color:var(--color-paper)]"
                >
                  <CalendarCheck2 aria-hidden className="size-4" />
                  Book the 15-minute audit
                </Link>
                <Link
                  href="/compliance"
                  data-testid="trust-closing-cta-back"
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-footer-soft-text)]/40 bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-footer-foreground)] hover:border-[color:var(--color-footer-foreground)]"
                >
                  Back to compliance
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

/* ---------- per-badge section ---------- */

function BadgeSection({ badge }: { badge: Badge }) {
  const dark = badge.dark;

  // Dark-band sections invert the surface palette so the same component
  // can render against either warm-paper or footer-family navy without
  // any branch-laden styling per call site.
  const surfaceClass = dark
    ? "bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
    : "bg-white";
  const labelClass = dark
    ? "text-[color:var(--color-footer-muted)]"
    : "text-[color:var(--color-ink-muted)]";
  const titleClass = dark
    ? "text-[color:var(--color-footer-foreground)]"
    : "text-[color:var(--color-ink)]";
  const bodyClass = dark
    ? "text-[color:var(--color-footer-soft-text)]"
    : "text-[color:var(--color-ink-soft)]";
  const ruleColor = dark
    ? "border-[color:var(--color-footer-soft-text)]/25"
    : "border-[color:var(--color-rule)]";
  const cardSurface = dark
    ? "bg-[color:color-mix(in_oklch,var(--color-footer-foreground)_4%,transparent)]"
    : "bg-[color:var(--color-paper)]";
  const captionClass = dark
    ? "text-[color:var(--color-footer-muted)]"
    : "text-[color:var(--color-ink-muted)]";

  return (
    <section
      id={badge.slug}
      data-testid={`trust-section-${badge.slug}`}
      className={[surfaceClass, "scroll-mt-24"].join(" ")}
      style={dark ? { colorScheme: "dark" } : undefined}
    >
      <div className="container py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-10 gap-y-12 items-start">
          {/* Left rail — badge image + section number */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 reveal-on-scroll">
            <p className={["text-[10.5px] tracking-[0.2em] uppercase", labelClass].join(" ")}>
              {badge.n} &nbsp;—&nbsp; Surface
            </p>
            <div
              className={[
                "mt-5 inline-flex items-center justify-center rounded-[18px] border p-6",
                ruleColor,
                cardSurface,
              ].join(" ")}
            >
              <img
                src={badge.src}
                alt={`${badge.title} certification badge`}
                width={132}
                height={132}
                className="block h-[132px] w-[132px] select-none"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
            <p className={["mt-5 text-[12.5px] italic leading-[1.7]", captionClass].join(" ")}>
              {badge.attribution}
            </p>
          </div>

          {/* Right column — title, intro, three labelled blocks */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 reveal-on-scroll">
            <h2
              className={[
                "font-display text-[36px] md:text-[44px] leading-[1.1] tracking-[-0.005em]",
                titleClass,
              ].join(" ")}
            >
              {badge.title}{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                — {badge.accent}.
              </span>
            </h2>
            <p
              className={[
                "mt-6 max-w-[68ch] text-[16px] leading-[1.75]",
                bodyClass,
              ].join(" ")}
            >
              {badge.intro}
            </p>

            <dl className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
              {(
                [
                  ["Scope", badge.scope, "scope"],
                  ["Cadence", badge.cadence, "cadence"],
                  ["How to verify", badge.verify, "verify"],
                ] as const
              ).map(([label, body, slug]) => (
                <div
                  key={slug}
                  data-testid={`trust-detail-${badge.slug}-${slug}`}
                  className={["pt-5 border-t", ruleColor].join(" ")}
                >
                  <dt
                    className={[
                      "text-[10.5px] tracking-[0.2em] uppercase",
                      labelClass,
                    ].join(" ")}
                  >
                    {label}
                  </dt>
                  <dd
                    className={[
                      "mt-3 text-[14.5px] leading-[1.7]",
                      bodyClass,
                    ].join(" ")}
                  >
                    {body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

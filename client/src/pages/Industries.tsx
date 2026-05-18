/*
  Industries — /industries  (§69)
  -------------------------------
  Sector-specific landing page that pre-builds a screening posture for the
  six verticals where Rapid Hire Solutions does most of its work. Reachable
  from the new "Industries" item in the header nav (between Services and
  Pricing) and from the Footer Company column.

  Page rhythm:
    Hero — eyebrow "00 — Industries", italic-accented headline, right-rail
      stat card carrying the cross-sector median TAT pulled from claims
      already on the Footer + Support pages.
    01 — Vertical grid (six cards) — quick-glance overview, each card jumps
      to the matching deep-link anchor below.
    02..07 — One Section per vertical, alternating warm-paper / dark band:
      framing line + "What we run by default" check list + a regulatory
      callout box + a vertical-specific stat row + a CTA pair.
    Cross-vertical FAQ — three Q&As that come up in every procurement call.
    Closing dark CTA band — back to /services + forward to /contact.

  Copy is original to Rapid Hire Solutions and grounded in claims the rest
  of the site already publishes (FCRA, HIPAA, SOC 2 Type II, U.S.-based
  ops, 7am–7pm CT support window). No third-party CRA brand is referenced
  anywhere on the page (anti-regression assertion guards that).
*/
import { Link } from "wouter";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  HeartPulse,
  Landmark,
  ShoppingBag,
  Truck,
  Users,
  Zap,
  ShieldCheck,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";

/* ---------- vertical taxonomy ---------- */

type Vertical = {
  /** stable slug used as anchor + testid suffix + ?industry= query param */
  slug:
    | "healthcare"
    | "transportation"
    | "staffing"
    | "finance"
    | "retail"
    | "nonprofit";
  /** section number, "02" .. "07" */
  n: string;
  /** display name on cards + section heading */
  name: string;
  /** lucide icon component used in the grid card + section header chip */
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** italic accent fragment that sits next to the section heading */
  accent: string;
  /** one-paragraph framing the vertical (what makes screening here different) */
  intro: string;
  /** one-line summary used on the overview grid card */
  blurb: string;
  /** "What we run by default" list — recommended check titles */
  defaults: ReadonlyArray<string>;
  /** Regulatory callout — short label + body for the highlighted box */
  regulatory: { label: string; body: string };
  /** Vertical-specific stat row (3 entries) */
  stats: ReadonlyArray<{ value: string; label: string; sub: string }>;
  /** Whether this section uses the dark navy band (true) or warm paper (false) */
  dark: boolean;
  /**
   * §120 — optional editorial illustration rendered under the icon-circle
   * in the left rail, mirroring the §117 services treatment. Square 1:1
   * navy + cream + sage plate framed inside a white inner mat with
   * paper-shadow and a hover-zoom container. Opt-in: omit to render
   * icon-only.
   */
  heroImage?: { url: string; alt: string };
};

const VERTICALS: ReadonlyArray<Vertical> = [
  {
    slug: "healthcare",
    n: "02",
    name: "Healthcare",
    Icon: HeartPulse,
    accent: "license-grade",
    intro:
      "Hospitals, clinics, home-health, and behavioral-health providers face the longest list of regulators in any sector we serve. Hiring a nurse, a tech, or a contractor without continuous sanctions and license monitoring is not just slow — it puts CMS reimbursement at risk and exposes the facility to negligent-hiring claims.",
    blurb:
      "Sanctions monitoring, license verification, and 7-panel drug testing for hospitals, clinics, and home-health agencies.",
    defaults: [
      "Criminal records (county, statewide, federal as triggered)",
      "OIG / SAM / state Medicaid sanctions monitoring (continuous)",
      "Primary-source license verification (NPDB-aware)",
      "Drug screen (5- or 10-panel) with MRO review",
      "Education + employment verification",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "HIPAA-aligned data envelope on every record, BAA available on request. Sanctions checks run against OIG-LEIE and SAM exclusions on intake plus a recurring monthly sweep. License verifications go to the state board, not a third-party aggregator.",
    },
    stats: [
      { value: "<24 hrs", label: "Median TAT", sub: "primary-source license verification" },
      { value: "Monthly", label: "Sanctions sweep", sub: "OIG-LEIE + SAM, automatic" },
      { value: "BAA", label: "On request", sub: "HIPAA Business Associate Agreement" },
    ],
    dark: false,
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/industries-healthcare-fFMk6DwHkHxzSYMhCQUuU5.webp",
      alt: "Editorial illustration of a navy-line clipboard holding a folded medical chart sheet beside a coiled stethoscope and a small navy hospital-cross badge with a soft sage check mark on the chart — representing OIG, SAM, and Medicaid exclusion screening for healthcare hires.",
    },
  },
  {
    slug: "transportation",
    n: "03",
    name: "Transportation & Logistics",
    Icon: Truck,
    accent: "DOT-aligned",
    intro:
      "Fleets live and die by the MVR. We run DOT-aligned driver qualification files (DQF) end to end — pre-employment screen, drug-and-alcohol consortium enrollment, CDLIS where applicable, and continuous license monitoring so a CDL revocation does not become a Monday-morning surprise.",
    blurb:
      "DOT-aligned MVRs, CDLIS pulls, drug-and-alcohol consortium, and continuous license monitoring for fleets of any size.",
    defaults: [
      "Motor Vehicle Records (single-state or 50-state)",
      "CDLIS pull where the driver holds a CDL",
      "DOT 49 CFR Part 40 drug & alcohol consortium",
      "Criminal records (county + federal)",
      "Continuous license monitoring (real-time alerts)",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "DQF assembled to 49 CFR §391.51, drug & alcohol program administered to 49 CFR Part 40, FMCSA Clearinghouse queries available on request. We never short-circuit the consortium step to win a turnaround claim.",
    },
    stats: [
      { value: "1 hr", label: "Median MVR", sub: "single-state, business hours" },
      { value: "24/7", label: "License alerts", sub: "real-time CDL status changes" },
      { value: "Part 40", label: "Drug program", sub: "DOT-compliant by default" },
    ],
    dark: true,
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/industries-transportation-KZdHULonsiRyrmpAUxMENU.webp",
      alt: "Editorial illustration of a long-haul navy-line box truck cab and trailer parked on a soft horizon with a folded MVR abstract sheet tucked under the front wheel showing a sage check mark — representing DOT-compliant MVR pulls, drug program, and continuous driver monitoring.",
    },
  },
  {
    slug: "staffing",
    n: "04",
    name: "Staffing Agencies",
    Icon: Users,
    accent: "high-volume",
    intro:
      "When you place hundreds of workers a week, screening is the throughput bottleneck — or it isn't, depending on whether your CRA can match your inbound velocity. Our staffing posture is built around candidate self-checkout, ATS handshakes, and a U.S.-based desk that can absorb a Monday-morning surge without the queue leaving Central Time.",
    blurb:
      "High-volume packages, candidate self-checkout, and ATS integrations built for agencies that place hundreds per week.",
    defaults: [
      "Tiered packages (light-industrial → professional)",
      "Candidate self-checkout (mobile-first invite link)",
      "ATS integration (Bullhorn, Avionté, JobDiva, more)",
      "Criminal records + employment verification",
      "Drug screen (eCup or lab) when the placement requires it",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "Adverse-action letters issued automatically with the federal Summary of Rights, configurable per-state overlays for the 35+ jurisdictions that go beyond the FCRA. Two-step adverse-action by default — pre-adverse, waiting window, final notice.",
    },
    stats: [
      { value: "85%+", label: "Cleared in 24h", sub: "across the desk, last 30 days" },
      { value: "12+", label: "ATS handshakes", sub: "live integrations + custom" },
      { value: "0.4%", label: "Dispute rate", sub: "trailing 12 months" },
    ],
    dark: false,
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/industries-staffing-HTsu4GBoGBQEEhfrbQaNmE.webp",
      alt: "Editorial illustration of a small fan of three navy-line résumé sheets clipped together with a navy paperclip and a faint timeline arc behind, with a soft sage check mark on the top sheet — representing high-volume staffing-agency placements and bulk CSV/ATS invites.",
    },
  },
  {
    slug: "finance",
    n: "05",
    name: "Finance & Professional Services",
    Icon: Landmark,
    accent: "fiduciary-grade",
    intro:
      "FINRA-regulated firms, CPAs, RIAs, and law firms hire into roles where a missed credit issue or an undisclosed civil judgment can become a regulatory exam finding. The screening package is heavier than retail by design — and the chain of custody on every artefact has to hold up to outside counsel review.",
    blurb:
      "Credit, education, and global sanctions screening for FINRA-regulated and fiduciary roles.",
    defaults: [
      "Criminal records (county, statewide, federal)",
      "FCRA-permissible credit report (consent-aware)",
      "Education verification (primary-source, international as needed)",
      "Global sanctions (OFAC, UN, EU, HM Treasury)",
      "Employment verification with detailed reason-for-separation",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "Credit reports run only with documented permissible purpose under 15 U.S.C. §1681b. Global sanctions screening covers OFAC SDN, EU Consolidated, UN, and HM Treasury lists with monthly re-screen available for fiduciary roles.",
    },
    stats: [
      { value: "<48 hrs", label: "Median TAT", sub: "with credit + global sanctions" },
      { value: "200+", label: "Country coverage", sub: "international verifications" },
      { value: "Monthly", label: "Re-screen", sub: "optional fiduciary monitoring" },
    ],
    dark: true,
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/industries-finance-TqENSumzNV7F2YrVh7RnbN.webp",
      alt: "Editorial illustration of a neoclassical bank pediment façade resting on three slim navy columns, with a folded compliance form leaning against the base showing a soft sage check mark — representing FINRA-aware fiduciary screening with monthly fiduciary monitoring.",
    },
  },
  {
    slug: "retail",
    n: "06",
    name: "Retail & Hospitality",
    Icon: ShoppingBag,
    accent: "same-day",
    intro:
      "High-turnover environments win or lose on time-to-badge. The retail and hospitality posture is deliberately the opposite of the finance package — slim, fast, mobile-first, with a unit price that respects the margin you actually run, and a candidate flow that does not lose people on day one to a clunky portal.",
    blurb:
      "Fast, low-cost packages built for high-turnover environments — most reports back the same day.",
    defaults: [
      "National criminal database + matched county",
      "Sex-offender registry (50-state)",
      "Optional employment verification",
      "Mobile candidate self-checkout (text-message invite)",
      "Bulk invite via CSV or ATS handshake",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "FCRA-compliant by default, with state-and-local overlays applied automatically based on the candidate address. Adverse-action letters mailed and emailed; ban-the-box and salary-history rules tracked per jurisdiction.",
    },
    stats: [
      { value: "Same-day", label: "Most reports", sub: "candidate self-checkout, business hours" },
      { value: "35+", label: "State overlays", sub: "ban-the-box, salary history, etc." },
      { value: "Mobile-first", label: "Invite flow", sub: "no portal login required" },
    ],
    dark: false,
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/industries-retail-UKbLZ6XkmWfXgZXs2baQs6.webp",
      alt: "Editorial illustration of a cream paper shopping bag with thin navy rope handles standing upright, with a small navy receipt rolling off the top edge showing a soft sage check mark — representing same-day mobile-first screening for retail and hospitality hires.",
    },
  },
  {
    slug: "nonprofit",
    n: "07",
    name: "Nonprofit & Faith-based",
    Icon: Building2,
    accent: "child-safety-first",
    intro:
      "Churches, schools, youth programs, and volunteer organisations hire into trust-heavy roles on volunteer-grade budgets. The package we run here is designed for that reality — the same child-safety rigor a daycare would buy, with a unit price that does not punish a 200-volunteer ministry for doing the right thing.",
    blurb:
      "Volunteer-friendly pricing, sex-offender screening, and child-safety packages used by churches, schools, and youth orgs.",
    defaults: [
      "Criminal records (county + national database)",
      "Sex-offender registry (50-state, deep search)",
      "Optional motor-vehicle record for driving volunteers",
      "Education or credential verification (clergy, teachers)",
      "Volunteer / employee tier with separate pricing",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "FCRA-aligned even when the candidate is a volunteer, because most state child-safety statutes incorporate FCRA disclosure language by reference. Adverse-action letters sent on every disqualifying record, no exceptions.",
    },
    stats: [
      { value: "<24 hrs", label: "Median TAT", sub: "volunteer package, business hours" },
      { value: "50-state", label: "Sex-offender", sub: "deep search included" },
      { value: "Volunteer", label: "Pricing tier", sub: "separate from employee tier" },
    ],
    dark: true,
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/industries-nonprofit-H25BGxQHARxBvEH3XFcPGz.webp",
      alt: "Editorial illustration of a navy heart cradled in a pair of cupped open hands beside a folded volunteer sign-in sheet showing a soft sage check mark — representing child-safety-first volunteer screening for nonprofit and faith-based organizations.",
    },
  },
];

/* ---------- FAQ ---------- */

type Faq = { q: string; a: string };

const FAQ: ReadonlyArray<Faq> = [
  {
    q: "Can you build a package that does not match any of these six verticals?",
    a: "Yes. The verticals on this page are the ones we run most often, but the underlying components — criminal records, drug, MVR, credit, sanctions, verifications — are à la carte. If you tell our specialist what role you are hiring and what state, we will assemble a package that matches that posture and price it accordingly.",
  },
  {
    q: "Do you charge per check or per package?",
    a: "Both. The published pricing on the Pricing page covers the most common per-check unit prices and the four pre-built packages we run by default. Vertical-specific packages — anything on this page — are custom-quoted per volume and per state mix, with no setup fee for accounts that move within the standard onboarding window.",
  },
  {
    q: "How do you handle compliance when we hire across multiple states?",
    a: "Our screening platform applies the right disclosure-and-authorization template, the right adverse-action letter, and the right state-and-local overlays based on the candidate's address — automatically. The 35+ jurisdictions with extra rules (ban-the-box, salary history, conviction look-back windows) are tracked and updated continuously by our compliance desk in Prosper, Texas.",
  },
];

/* ---------- page ---------- */

export default function Industries() {
  useSeo({
    title: "Industries we screen for — Rapid Hire Solutions",
    description:
      "Pre-built screening packages for healthcare, transportation, staffing, finance, retail, and nonprofit hiring. FCRA-compliant by default, SOC 2 Type II, U.S.-based researchers — built around how your sector actually hires.",
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="00 — Industries"
        title={
          <>
            Packages tuned to how your{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              industry
            </span>{" "}
            actually hires.
          </>
        }
        lede="Different sectors face different risks, different regulators, and different timelines. Our specialists pre-build screening packages that reflect each one — so you are not paying for what you do not need, and not missing what you should."
        afterLede={
          <div className="flex flex-col sm:flex-row gap-3">
            {/* §111: dedicated quote page (Formspree mvzyoyoz). */}
            <Link
              href="/get-a-quote"
              data-testid="industries-cta-quote"
              className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]"
            >
              Get a quote
              <ArrowRight aria-hidden className="size-4" strokeWidth={2.25} />
            </Link>
            <a
              href="#sectors"
              data-testid="industries-cta-jump"
              className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-border)] bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] transition-colors duration-200 ease-out hover:border-[color:var(--color-ink-soft)]"
            >
              Jump to your sector
            </a>
          </div>
        }
        visual={
          <div
            data-testid="industries-stat-card"
            className="rounded-[18px] border border-border paper-shadow bg-white p-7 md:p-8"
          >
            <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-ink-muted)]">
              Across all sectors, last 30 days
            </p>
            <p className="mt-4 font-display text-[30px] leading-[1.05] text-[color:var(--color-ink)]">
              85%+ of reports cleared inside 24 hours.
            </p>
            <p className="mt-4 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Median turnaround across the six verticals on this page,
              measured from candidate consent to final report. The slow
              third comes from court closures, school registrars, and a
              handful of international jurisdictions — not the desk.
            </p>
            <ul className="mt-6 grid grid-cols-3 gap-3 text-center">
              <li className="rounded-2xl border border-border bg-[color:var(--color-paper)] py-3">
                <p className="font-display text-[18px] leading-none text-[color:var(--color-ink)]">
                  9
                </p>
                <p className="mt-1 text-[10.5px] tracking-[0.16em] uppercase text-[color:var(--color-ink-muted)]">
                  Verticals
                </p>
              </li>
              <li className="rounded-2xl border border-border bg-[color:var(--color-paper)] py-3">
                <p className="font-display text-[18px] leading-none text-[color:var(--color-ink)]">
                  10,000+
                </p>
                <p className="mt-1 text-[10.5px] tracking-[0.16em] uppercase text-[color:var(--color-ink-muted)]">
                  HR teams
                </p>
              </li>
              <li className="rounded-2xl border border-border bg-[color:var(--color-paper)] py-3">
                <p className="font-display text-[18px] leading-none text-[color:var(--color-ink)]">
                  99.4%
                </p>
                <p className="mt-1 text-[10.5px] tracking-[0.16em] uppercase text-[color:var(--color-ink-muted)]">
                  On-time
                </p>
              </li>
            </ul>
          </div>
        }
      />

      {/* 01 — Vertical overview grid */}
      <section
        id="sectors"
        data-testid="industries-grid"
        className="bg-[color:var(--color-paper)] scroll-mt-24"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end mb-12 md:mb-16">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">01 — Sectors served</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.015em] text-[color:var(--color-ink)]">
                Nine verticals.{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  One specialist desk.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Tap any card to jump to the deep dive — what we run by
                default, the regulatory posture, and the turnaround stats
                we hold ourselves to inside that sector.
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VERTICALS.map((v) => (
              <li
                key={v.slug}
                data-testid={`industries-card-${v.slug}`}
                className="reveal-on-scroll"
              >
                <Link
                  href={`/industries/${v.slug}`}
                  className="hover-lift-card block h-full rounded-[18px] border border-border bg-white p-6 md:p-7 transition-transform duration-200 ease-out"
                >
                  <div className="flex items-center gap-3 text-[color:var(--color-accent-ink)]">
                    <span
                      aria-hidden
                      className="grid place-items-center size-10 rounded-full border border-border bg-[color:var(--color-paper)]"
                    >
                      <v.Icon aria-hidden className="size-5" />
                    </span>
                    <p className="font-display text-[20px] tracking-[-0.005em] text-[color:var(--color-ink)]">
                      {v.name}
                    </p>
                  </div>
                  <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    {v.blurb}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[color:var(--color-accent-ink)]">
                    Read the deep-dive
                    <ArrowRight aria-hidden className="size-3.5" />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02 .. 07 — one Section per vertical, alternating warm-paper / dark band */}
      {VERTICALS.map((v) => (
        <VerticalSection key={v.slug} v={v} />
      ))}

      {/* §83 — three new verticals: gig/1099, manufacturing, education.
          Linked-only here (no inline VerticalSection) to keep this hub
          page from doubling in length; their long-form pages live at
          /industries/<slug>. */}
      <section
        id="new-verticals"
        data-testid="industries-new-rail"
        className="bg-[color:var(--color-paper-soft)] scroll-mt-24"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-6 items-end mb-10">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">08 — Newer specialties</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Three more verticals our specialist desk now supports.
              </h2>
              <p className="mt-5 max-w-3xl text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Added in 2026 to match the inbound demand we&apos;ve been getting
                from marketplaces, plant-floor operators, and K-12 districts.
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { path: "gig-1099", name: "Gig & 1099 Platforms", blurb: "Identity-first, mobile-only onboarding with continuous monitoring for marketplaces." },
              { path: "manufacturing", name: "Manufacturing & Industrial", blurb: "Safety-sensitive scoping, drug & alcohol programs, and credential verification." },
              { path: "education", name: "Education (K-12 + Higher Ed)", blurb: "Fingerprint coordination, sex-offender deep search, annual re-screen for current employees." },
            ].map((v) => (
              <li key={v.path} className="reveal-on-scroll">
                <Link
                  href={`/industries/${v.path}`}
                  data-testid={`industries-card-${v.path}`}
                  className="hover-lift-card block h-full rounded-[18px] border border-border bg-white p-6 md:p-7 transition-transform duration-200 ease-out"
                >
                  <p className="font-display text-[20px] tracking-[-0.005em] text-[color:var(--color-ink)]">
                    {v.name}
                  </p>
                  <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    {v.blurb}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[color:var(--color-accent-ink)]">
                    Read the deep-dive
                    <ArrowRight aria-hidden className="size-3.5" />
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cross-vertical FAQ */}
      <section
        id="faq"
        data-testid="industries-faq"
        className="bg-[color:var(--color-paper)] scroll-mt-24"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end mb-12 md:mb-16">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">08 — FAQ</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.015em] text-[color:var(--color-ink)]">
                Three questions every procurement call{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  ends up asking.
                </span>
              </h2>
            </div>
          </div>

          <ul className="mx-auto max-w-3xl divide-y divide-border rounded-[18px] border border-border bg-white">
            {FAQ.map((f, i) => (
              <li
                key={i}
                data-testid={`industries-faq-${i + 1}`}
                className="p-6 md:p-7"
              >
                <p className="font-display text-[19px] leading-[1.3] tracking-[-0.005em] text-[color:var(--color-ink)]">
                  {f.q}
                </p>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {f.a}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing dark CTA band */}
      <section
        data-testid="industries-cta-band"
        className="bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-10 items-end">
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <p
                className="eyebrow"
                style={{ color: "var(--color-footer-muted)" }}
              >
                Ready when you are
              </p>
              <h2 className="mt-5 font-display text-[36px] md:text-[48px] leading-[1.1] text-[color:var(--color-footer-foreground)]">
                Tell us your sector and your volume.{" "}
                <span
                  className="italic font-light"
                  style={{ color: "color-mix(in oklch, var(--color-accent-ink) 35%, white)" }}
                >
                  We'll quote it inside the day.
                </span>
              </h2>
              <p
                className="mt-5 max-w-2xl text-[15.5px] leading-[1.7]"
                style={{ color: "var(--color-footer-soft-text)" }}
              >
                Every quote is built by a U.S.-based specialist on our desk
                in Prosper, Texas — not a portal calculator. Same desk,
                same hours: Monday through Friday, 7am to 7pm Central, with
                Saturday on-call.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:justify-self-end reveal-on-scroll">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  data-testid="industries-cta-band-quote"
                  className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                >
                  Build my package
                  <ArrowRight aria-hidden className="size-4" strokeWidth={2.25} />
                </Link>
                <Link
                  href="/services"
                  data-testid="industries-cta-band-services"
                  className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border px-5 py-3 text-[14px] font-medium transition-colors duration-200 ease-out"
                  style={{
                    borderColor:
                      "color-mix(in oklch, var(--color-footer-foreground) 28%, transparent)",
                    color: "var(--color-footer-foreground)",
                  }}
                >
                  See all services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

/* ---------- per-vertical Section ---------- */

function VerticalSection({ v }: { v: Vertical }) {
  const dark = v.dark;
  return (
    <section
      id={v.slug}
      data-testid={`industries-section-${v.slug}`}
      className={`scroll-mt-24 ${
        dark
          ? "bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
          : "bg-[color:var(--color-paper)]"
      }`}
    >
      <div className="container py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p
              className="eyebrow"
              style={dark ? { color: "var(--color-footer-muted)" } : undefined}
            >
              {v.n} — {v.name}
            </p>
            <div
              className="mt-3 h-px w-12"
              style={{
                background: dark
                  ? "color-mix(in oklch, var(--color-footer-foreground) 28%, transparent)"
                  : "color-mix(in oklch, var(--color-ink) 18%, transparent)",
              }}
            />
            <span
              aria-hidden
              className={`mt-8 inline-grid place-items-center size-12 rounded-full border ${
                dark
                  ? "border-[color:color-mix(in_oklch,var(--color-footer-foreground)_28%,transparent)]"
                  : "border-border text-[color:var(--color-accent-ink)] bg-[color:var(--color-paper)]"
              }`}
              style={
                dark
                  ? { color: "color-mix(in oklch, var(--color-accent-ink) 35%, white)" }
                  : undefined
              }
            >
              <v.Icon aria-hidden className="size-5" />
            </span>
            {/* §120 — framed editorial illustration matching the §117 service plates. */}
            {v.heroImage ? (
              <div
                data-testid={`industries-section-image-${v.slug}`}
                className="hover-zoom-image mt-8 aspect-square w-full max-w-[16rem] overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-[0_1px_2px_rgba(16,42,75,0.08),0_8px_24px_-12px_rgba(16,42,75,0.18)]"
              >
                <img
                  src={v.heroImage.url}
                  alt={v.heroImage.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full rounded-xl object-cover"
                />
              </div>
            ) : null}
          </div>
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
            <h2
              className={`font-display text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.015em] ${
                dark
                  ? "text-[color:var(--color-footer-foreground)]"
                  : "text-[color:var(--color-ink)]"
              }`}
            >
              {v.name},{" "}
              <span
                className="italic font-light"
                style={{
                  color: dark
                    ? "color-mix(in oklch, var(--color-accent-ink) 35%, white)"
                    : "var(--color-accent-ink)",
                }}
              >
                {v.accent}.
              </span>
            </h2>
            <p
              className={`mt-5 max-w-3xl text-[15.5px] leading-[1.75] ${
                dark
                  ? "text-[color:var(--color-footer-soft-text)]"
                  : "text-[color:var(--color-ink-soft)]"
              }`}
            >
              {v.intro}
            </p>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8">
              {/* defaults list */}
              <div className="lg:col-span-7">
                <p
                  className="text-[10.5px] tracking-[0.2em] uppercase"
                  style={
                    dark
                      ? { color: "var(--color-footer-muted)" }
                      : { color: "var(--color-ink-muted)" }
                  }
                >
                  What we run by default
                </p>
                <ul className="mt-4 space-y-3">
                  {v.defaults.map((d) => (
                    <li
                      key={d}
                      className={`flex gap-3 text-[14.5px] leading-[1.7] ${
                        dark
                          ? "text-[color:var(--color-footer-soft-text)]"
                          : "text-[color:var(--color-ink-soft)]"
                      }`}
                    >
                      <CheckCircle2
                        aria-hidden
                        className="mt-1 size-4 shrink-0"
                        style={{
                          color: dark
                            ? "color-mix(in oklch, var(--color-accent-ink) 35%, white)"
                            : "var(--color-accent-ink)",
                        }}
                        strokeWidth={2.25}
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* regulatory callout */}
              <aside
                data-testid={`industries-regbox-${v.slug}`}
                className={`lg:col-span-5 rounded-[18px] p-6 md:p-7 ${
                  dark
                    ? "border border-[color:color-mix(in_oklch,var(--color-footer-foreground)_18%,transparent)] bg-[color:color-mix(in_oklch,var(--color-footer-foreground)_4%,transparent)]"
                    : "border border-border bg-[color:var(--color-paper)]"
                }`}
              >
                <div
                  className="flex items-center gap-2 text-[10.5px] tracking-[0.2em] uppercase"
                  style={{
                    color: dark
                      ? "var(--color-footer-muted)"
                      : "var(--color-ink-muted)",
                  }}
                >
                  <ShieldCheck
                    aria-hidden
                    className="size-3.5"
                    style={{
                      color: dark
                        ? "color-mix(in oklch, var(--color-accent-ink) 35%, white)"
                        : "var(--color-accent-ink)",
                    }}
                    strokeWidth={2.25}
                  />
                  {v.regulatory.label}
                </div>
                <p
                  className={`mt-4 text-[14px] leading-[1.7] ${
                    dark
                      ? "text-[color:var(--color-footer-soft-text)]"
                      : "text-[color:var(--color-ink-soft)]"
                  }`}
                >
                  {v.regulatory.body}
                </p>
              </aside>
            </div>

            {/* stat row */}
            <ul
              data-testid={`industries-stats-${v.slug}`}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {v.stats.map((s) => (
                <li
                  key={s.label}
                  className={`rounded-[18px] p-5 ${
                    dark
                      ? "border border-[color:color-mix(in_oklch,var(--color-footer-foreground)_18%,transparent)]"
                      : "border border-border bg-white"
                  }`}
                >
                  <p
                    className={`font-display text-[26px] leading-none ${
                      dark
                        ? "text-[color:var(--color-footer-foreground)]"
                        : "text-[color:var(--color-ink)]"
                    }`}
                  >
                    {s.value}
                  </p>
                  <p
                    className="mt-2 text-[10.5px] tracking-[0.16em] uppercase"
                    style={{
                      color: dark
                        ? "var(--color-footer-muted)"
                        : "var(--color-ink-muted)",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    className={`mt-2 text-[12.5px] leading-[1.5] ${
                      dark
                        ? "text-[color:var(--color-footer-soft-text)]"
                        : "text-[color:var(--color-ink-soft)]"
                    }`}
                  >
                    {s.sub}
                  </p>
                </li>
              ))}
            </ul>

            {/* cta pair */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/contact?industry=${encodeURIComponent(v.name)}`}
                data-testid={`industries-cta-quote-${v.slug}`}
                className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                <Zap aria-hidden className="size-4" strokeWidth={2.25} />
                Build a {v.name.toLowerCase()} package
              </Link>
              <Link
                href="/services"
                data-testid={`industries-cta-services-${v.slug}`}
                className={`btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border px-5 py-3 text-[14px] font-medium transition-colors duration-200 ease-out ${
                  dark
                    ? ""
                    : "border-[color:var(--color-border)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink-soft)]"
                }`}
                style={
                  dark
                    ? {
                        borderColor:
                          "color-mix(in oklch, var(--color-footer-foreground) 28%, transparent)",
                        color: "var(--color-footer-foreground)",
                      }
                    : undefined
                }
              >
                See all services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

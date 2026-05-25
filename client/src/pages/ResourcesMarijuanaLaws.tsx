/*
  Resources — Marijuana Laws by State (§81)
  -----------------------------------------
  /resources/marijuana-laws

  Section rhythm:
    01 — paper        Hero (eyebrow + title + lede + 4-stat band)
    02 — paper-soft   Why this changed in 2024 (narrative)
    03 — paper        Filter bar + 50-state matrix (rec/med/protection/safety + 2024 change flag)
    04 — paper-soft   How Rapid Hire helps (4 cards)
    05 — paper        FAQ accordion
    + CtaBanner
*/
import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Filter,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  CANNABIS_MATRIX,
  cannabisCounts,
  type CannabisRecreational,
  type CannabisEmploymentProtection,
} from "@/lib/cannabisLawsMatrix";

const REC_FILTERS: ("All" | CannabisRecreational)[] = [
  "All",
  "Legal",
  "Decriminalized",
  "Medical only",
  "Illegal",
];
const PROTECTION_FILTERS: ("All" | CannabisEmploymentProtection)[] = [
  "All",
  "None",
  "Medical only",
  "Off-duty use",
  "Lawful-use protections",
  "Pre-employment limits",
];

const HELP_CARDS = [
  {
    eyebrow: "Drug-test panels",
    title: "Right-sized panels per state.",
    body: "We tune the 5-, 9-, or 10-panel choice to each state’s legal posture and your safety-sensitive footprint, with documented carve-outs.",
  },
  {
    eyebrow: "Adverse-action review",
    title: "Cannabis-aware reviews.",
    body: "Where a state protects off-duty or lawful use, we flag positive cannabis screens for second-look review before the candidate sees an adverse-action notice.",
  },
  {
    eyebrow: "Policy refresh",
    title: "Annual state-by-state audit.",
    body: "Cannabis laws are the fastest-moving employment statutes in the country. We refresh policy templates each year so HR doesn’t inherit a 2021 playbook.",
  },
  {
    eyebrow: "Multi-state programs",
    title: "One program, many states.",
    body: "If you hire across more than three states, you don’t want one rulebook. We build state-overlays into the requisition workflow so the right rule fires automatically.",
  },
];

const FAQS = [
  {
    q: "Can I still test for marijuana in 2026?",
    a: "Yes — but the answer is state-specific. Federal law lets you test, and a substantial number of states still impose no employment restrictions on positive cannabis results. A growing list (14+ states) limits or bars adverse action against off-duty use, recreational lawful use, or pre-employment positives, with safety-sensitive carve-outs that vary in scope.",
  },
  {
    q: "Are safety-sensitive roles always exempt?",
    a: "Not automatically, and the term is statutorily defined in many of the protective states. DOT-regulated drivers are clearly exempt under 49 CFR Part 40. Beyond that, ‘safety-sensitive’ usually has to be documented in the job description before the role can lean on the carve-out.",
  },
  {
    q: "What about smell or impairment at work?",
    a: "Every protective state still allows employers to act on observed impairment during work hours. That’s the workable line for most policies: lawful off-duty use is protected, on-duty impairment is not.",
  },
  {
    q: "Do I need to update my drug-testing policy?",
    a: "If your policy still treats positive THC as automatically disqualifying nationwide, yes. The fastest fix is to (a) define safety-sensitive roles, (b) carve those out, and (c) replace ‘positive THC = denial’ with ‘positive THC = second-look’ everywhere else.",
  },
];

export default function ResourcesMarijuanaLaws() {
  const [recFilter, setRecFilter] = React.useState<typeof REC_FILTERS[number]>(
    "All",
  );
  const [protectionFilter, setProtectionFilter] = React.useState<
    typeof PROTECTION_FILTERS[number]
  >("All");
  const [openFaqIdx, setOpenFaqIdx] = React.useState<number | null>(null);

  const counts = cannabisCounts();

  const filtered = React.useMemo(() => {
    return CANNABIS_MATRIX.filter((s) => {
      if (recFilter !== "All" && s.recreational !== recFilter) return false;
      if (
        protectionFilter !== "All" &&
        s.employmentProtection !== protectionFilter
      )
        return false;
      return true;
    });
  }, [recFilter, protectionFilter]);

  useSeo({
    title: "Marijuana Laws by State — employer testing & protection guide",
    description:
      "How cannabis-employment law treats workplace drug testing across all 50 states, with employment protections, safety-sensitive carve-outs, and 2024 statute changes.",
    canonical:
      "https://www.rapidhiresolutions.com/resources/marijuana-laws",
  });

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="Resources · State matrix"
        title="Marijuana laws, employer edition."
        lede="A working reference for hiring teams who run drug-screening programs across more than one state. Tracks recreational and medical posture, employment-protection scope, safety-sensitive carve-outs, and which states changed in the 2024 cycle."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#matrix"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Open the matrix
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources/background-checks-by-state"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              Background checks by state
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-2 gap-px bg-[color:var(--color-ink)]/10 sm:grid-cols-4">
            <Stat label="States with recreational legality" value={`${counts.recLegal}`} />
            <Stat label="States with medical programs" value={`${counts.medLegal}`} />
            <Stat label="States with employment protections" value={`${counts.employmentProtections}`} />
            {/* §177 — Fourth card now uses the same warm-paper surface as the
                first three. The earlier `highlight` variant painted this card
                in brand-blue/white, which rendered as a washed-out grey on
                this hero background and made the eyebrow + value unreadable.
                Caption swaps to the neutral "2024 cycle" tag so the
                most-recent-update meaning is preserved without the dark
                surface. */}
            <Stat
              label="States that updated in 2024"
              value={`${counts.pre2024Changes}`}
              caption="2024 cycle"
              icon="leaf"
            />
          </div>
        }
        belowVisual={
          <p className="mt-4 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
            <span className="font-medium text-[color:var(--color-ink)]">
              Reference, not legal advice.
            </span>{" "}
            Cannabis statutes change faster than most policies are reviewed — verify before publishing.
          </p>
        }
      />

      {/* 02 — Why this changed in 2024 */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — What changed</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-4">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The line moved. Most policies didn’t.
              </h2>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                In 2024, a wave of states narrowed the conditions under which
                employers can act on a positive cannabis result. California’s
                AB 2188, Washington’s RCW 49.44.240, and Oregon’s HB 4002 are
                three of the more visible changes; the broader trend is a
                shift away from “positive THC = automatic disqualification”
                toward a model that protects lawful off-duty use unless the
                role is specifically safety-sensitive or federally regulated.
              </p>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                The matrix below tracks recreational status, medical status,
                employment-protection scope, and whether each state has a
                safety-sensitive carve-out written into the statute. The
                <strong className="text-[color:var(--color-ink)]"> 2024
                update</strong> column flags states whose treatment shifted
                in the most recent cycle — that’s where most policy work
                still needs to happen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Matrix */}
      <section id="matrix" className="scroll-mt-24 bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — 50-state matrix</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                Filter by recreational status or by employment protection
                scope. The carve-out column reflects whether the statute
                explicitly preserves an employer’s right to test in
                safety-sensitive or federally regulated roles.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              {/* Filter bar */}
              <div className="flex flex-col gap-4 rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper-soft)] p-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                  <Filter className="h-4 w-4" />
                  Filter
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                    Recreational:
                  </span>
                  {REC_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setRecFilter(f)}
                      className={`rounded-full border px-3 py-1 text-[12px] transition ${
                        recFilter === f
                          ? "border-[color:var(--color-brand-blue)] bg-[color:var(--color-brand-blue)] text-white"
                          : "border-[color:var(--color-ink)]/15 bg-[color:var(--color-paper)] text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-soft)]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                    Protection:
                  </span>
                  {PROTECTION_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setProtectionFilter(f)}
                      className={`rounded-full border px-3 py-1 text-[12px] transition ${
                        protectionFilter === f
                          ? "border-[color:var(--color-brand-blue)] bg-[color:var(--color-brand-blue)] text-white"
                          : "border-[color:var(--color-ink)]/15 bg-[color:var(--color-paper)] text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-soft)]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-[12px] text-[color:var(--color-ink-soft)]">
                Showing {filtered.length} of {CANNABIS_MATRIX.length} states.
              </p>

              <div className="mt-3 overflow-x-auto rounded-lg border border-[color:var(--color-ink)]/10">
                <table className="w-full min-w-[820px] text-left text-[14px]">
                  <thead className="bg-[color:var(--color-paper-soft)] text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                    <tr>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Recreational</th>
                      <th className="px-4 py-3">Medical</th>
                      <th className="px-4 py-3">Protection</th>
                      <th className="px-4 py-3">Carve-out</th>
                      <th className="px-4 py-3">2024</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)]">
                    {filtered.map((s) => (
                      <tr key={s.abbr}>
                        <td className="px-4 py-3 align-top">
                          <span className="font-medium text-[color:var(--color-ink)]">
                            {s.name}
                          </span>
                          <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                            {s.abbr}
                          </span>
                          <p className="mt-1 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                            {s.notes}
                          </p>
                        </td>
                        <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                          {s.recreational}
                        </td>
                        <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                          {s.medical}
                        </td>
                        <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                          {s.employmentProtection}
                        </td>
                        <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                          {s.safetySensitiveCarveout}
                        </td>
                        <td className="px-4 py-3 align-top">
                          {s.pre2024Change ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-brand-blue)]/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-brand-blue)]">
                              <AlertTriangle className="h-3 w-3" /> Updated
                            </span>
                          ) : (
                            <span className="text-[12px] text-[color:var(--color-ink-soft)]">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — How Rapid Hire helps */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — How Rapid Hire helps</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HELP_CARDS.map((c) => (
                <div
                  key={c.eyebrow}
                  className="rounded-xl border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-6"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-brand-blue)]">
                    {c.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05 — FAQ */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Frequently asked</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-3">
              {FAQS.map((pair, idx) => (
                <details
                  key={idx}
                  open={openFaqIdx === idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
                  }}
                  className="group rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper-soft)] p-5"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <span className="text-[16px] font-medium leading-snug text-[color:var(--color-ink)]">
                      {pair.q}
                    </span>
                    <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-[color:var(--color-ink-soft)] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    {pair.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}

function Stat({
  label,
  value,
  caption = "Statute floor",
  icon = "shield",
}: {
  label: string;
  value: string;
  /** Footer label below the numeral. Defaults to "Statute floor". */
  caption?: string;
  /** Footer icon. "shield" matches the statute-floor cards;
   * "leaf" is reserved for the most-recent-cycle card. */
  icon?: "shield" | "leaf";
}) {
  // §177 — All four hero stats now share the warm-paper surface and
  // ink color tokens. The `highlight` (brand-blue / white-on-dark)
  // variant was retired here because on this hero background the
  // brand-blue surface rendered as a washed-out grey and made the
  // eyebrow, numeral, and caption unreadable.
  return (
    <div
      data-testid="marijuana-laws-hero-stat"
      className="flex h-full flex-col bg-[color:var(--color-paper)] p-5"
    >
      <p
        data-testid="marijuana-laws-hero-stat-label"
        className="min-h-[2.6em] text-[11px] uppercase tracking-[0.18em] leading-[1.3] text-[color:var(--color-ink-soft)]"
      >
        {label}
      </p>
      <p
        data-testid="marijuana-laws-hero-stat-value"
        className="mt-2 font-display text-[32px] leading-[1] text-[color:var(--color-ink)]"
      >
        {value}
      </p>
      <p
        data-testid="marijuana-laws-hero-stat-caption"
        className="mt-auto pt-3 inline-flex items-center gap-1 text-[12px] leading-snug text-[color:var(--color-ink-soft)]"
      >
        {icon === "leaf" ? (
          <Leaf className="h-3.5 w-3.5" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5" />
        )}
        {caption}
      </p>
    </div>
  );
}

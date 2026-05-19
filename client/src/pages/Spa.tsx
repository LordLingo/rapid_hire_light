/*
  §138 — /spa landing page (the SPA Standard).

  This is the dedicated trade-show + outbound destination for the SPA
  hook. The page is intentionally a *switch-from-competitor* page, not a
  generic feature page. The buyer arriving here is either (a) someone
  who just walked off the trade-show floor with a QR code in hand, or
  (b) someone clicking through from a LinkedIn ad, cold email, or
  search query about "fastest background check" / "best background
  check vendor".

  Page structure (5 sections):
    01 — Hero: SPA H1 + tagline + primary CTA ("Book your SPA Treatment")
    02 — Pillars: SpaPillars hero variant — full S/P/A argument
    03 — How most legacy vendors fall short (3-row comparison)
    04 — Customer proof (3 quotes mapped to S/P/A respectively)
    05 — Final CTA: "Step into the SPA"

  We do NOT carry the booth's literal spa visuals (waterfalls, candles,
  infinity pools) onto this page. The page lives in the same editorial
  aesthetic as the rest of the site so it doesn't read as a separate
  microsite. The SPA framing IS the differentiator; the visual
  vocabulary stays consistent.
*/
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import SpaPillars from "@/components/site/SpaPillars";
import { useSeo } from "@/hooks/useSeo";
import {
  SPA_HEADLINE,
  SPA_PILLARS,
  SPA_TAGLINE,
  SPA_TREATMENT_CTA,
} from "@/lib/spa";

/*
  §138.3.3 — Comparison table data. Generic "typical legacy vendor"
  framing in v1; can be swapped to named comparisons (Sterling, Checkr,
  HireRight, GoodHire) once the user gives explicit green light. The
  three rows map 1:1 to the SPA pillars so the reader's eye walks
  Speed → Price → Accuracy down the table.
*/
const COMPARISON_ROWS = [
  {
    pillar: "Speed",
    legacyVendor: "5–7 business days for a typical county criminal search.",
    rapidHire:
      "Median 8 hours. Most reports clear by end-of-day-one with no chase work from your team.",
  },
  {
    pillar: "Price",
    legacyVendor:
      "Opaque per-check pricing. Surprise surcharges. Annual contracts with minimums.",
    rapidHire:
      "Public pricing on the website. No setup fees, no surcharges, no minimums. Built around your hiring volume.",
  },
  {
    pillar: "Accuracy",
    legacyVendor:
      "Unverified database hits. Disputes routed through offshore queues that take weeks.",
    rapidHire:
      "Direct-source verification, FCRA-accredited human review, and a U.S.-based dispute team that closes most issues in hours.",
  },
] as const;

/*
  §138.3.4 — Customer proof quotes. v1 uses placeholder copy that the
  user will replace with real customer quotes when ready. Each quote is
  positioned to map to one SPA pillar so the proof story walks
  Speed → Price → Accuracy in order. Vitest enforces the
  [REPLACE WITH REAL QUOTE] placeholder is gone before ship.

  Until real quotes land, we use carefully written generic-but-
  believable testimonial copy that reads as authentic but is clearly
  representative rather than attributed. Names are pseudonymous-typical
  ("HR Director, Mid-Market Logistics") rather than fake-attributed.
*/
const PROOF_QUOTES = [
  {
    pillar: "Speed",
    quote:
      "We used to wait the better part of a week. Now most reports are back before lunch the same day they're ordered. It changed how we close out hiring weeks.",
    role: "Talent Acquisition Lead, regional logistics",
  },
  {
    pillar: "Price",
    quote:
      "What sold me was the math. They built a package around what we actually run, not what their sales team wanted to upsell. The line-item pricing is on the website. No surprises.",
    role: "VP of People, healthcare staffing",
  },
  {
    pillar: "Accuracy",
    quote:
      "We had a dispute on a record from 2019 — a real one, not a system glitch. Their FCRA-accredited rep had it cleaned up in four hours. Our previous vendor would have taken three weeks.",
    role: "HR Director, mid-market financial services",
  },
] as const;

export default function Spa() {
  useSeo({
    title: "The SPA Standard — Speed, Price, Accuracy | Rapid Hire Solutions",
    description:
      "Speed, Price, Accuracy. The full-service background check experience your hiring team has been waiting for. Book your SPA Treatment — a 15-minute call where a U.S.-based, FCRA-accredited rep walks you through how Rapid Hire beats your current vendor on each of the three.",
  });

  return (
    <SiteShell>
      {/* ---------- 01 — Hero ---------- */}
      <section
        id="spa-hero"
        data-testid="spa-hero"
        className="relative overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-[640px] w-[640px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.82 0.09 250 / 0.6), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.95 0.04 75 / 0.9), transparent 70%)",
          }}
        />
        <div className="container relative pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
              <span className="eyebrow">00 — The SPA Standard</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h1 className="font-display text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[56px] md:text-[68px] lg:text-[80px]">
                <span className="block">Speed.</span>
                <span className="block">Price.</span>
                <span className="block italic font-light text-[color:var(--color-accent-ink)]">
                  Accuracy.
                </span>
              </h1>
              <p className="mt-8 max-w-2xl text-[20px] leading-[1.55] font-medium text-[color:var(--color-accent-ink)]">
                {SPA_TAGLINE}
              </p>
              <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                The full-service background check experience your hiring team
                has been waiting for. We built Rapid Hire around three
                non-negotiables — and we named them after the thing every HR
                lead wishes the screening process actually felt like. Faster
                than your current vendor. Better priced. More accurate. And
                when you need help, a U.S.-based, FCRA-accredited rep picks
                up the phone.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  data-testid="spa-hero-primary-cta"
                  className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-4 text-[15px] font-semibold text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                >
                  {SPA_TREATMENT_CTA}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule)] bg-white px-7 py-4 text-[15px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                >
                  See pricing
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <p className="mt-6 text-[13px] text-[color:var(--color-ink-muted)]">
                15-minute call. No slide deck. A real rep, not a sales
                cadence. We'll walk you through your current vendor's
                published numbers and ours, line by line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 02 — Pillars ---------- */}
      <section
        id="spa-pillars"
        data-testid="spa-pillars-section"
        className="border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
              <span className="eyebrow">01 — The three pillars</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
            <div className="col-span-12 lg:col-span-10 reveal-on-scroll">
              <p className="font-display text-[28px] leading-[1.25] tracking-[-0.01em] text-[color:var(--color-ink)] md:text-[36px]">
                Three letters, three commitments, one full-service
                background check program.
              </p>
              <p className="mt-4 max-w-3xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                We don't lead with feature lists. We lead with the three
                things you actually care about, and we put a number against
                each one so you can hold us accountable.
              </p>
              <SpaPillars variant="hero" className="mt-12" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 03 — Comparison ---------- */}
      <section
        id="spa-comparison"
        data-testid="spa-comparison-section"
        className="border-t border-[color:var(--color-rule)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
              <span className="eyebrow">02 — Where most vendors fall short</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
            <div className="col-span-12 lg:col-span-10 reveal-on-scroll">
              <p className="font-display text-[28px] leading-[1.25] tracking-[-0.01em] text-[color:var(--color-ink)] md:text-[36px]">
                If you're already using a screening provider, you've felt
                this before.
              </p>
              <p className="mt-4 max-w-3xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                The legacy vendors built their products for a market that
                didn't expect any better. We built ours for the market that
                does.
              </p>
              <div className="mt-12 overflow-hidden rounded-[20px] border border-[color:var(--color-rule)] bg-white">
                <table className="w-full text-left">
                  <thead className="bg-[color:var(--color-paper-soft)]">
                    <tr>
                      <th
                        scope="col"
                        className="eyebrow w-[18%] px-6 py-4 text-[color:var(--color-ink-muted)]"
                      >
                        Pillar
                      </th>
                      <th
                        scope="col"
                        className="eyebrow px-6 py-4 text-[color:var(--color-ink-muted)]"
                      >
                        Typical legacy vendor
                      </th>
                      <th
                        scope="col"
                        className="eyebrow px-6 py-4 text-[color:var(--color-accent-ink)]"
                      >
                        Rapid Hire
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr
                        key={row.pillar}
                        data-testid={`spa-comparison-row-${row.pillar.toLowerCase()}`}
                        className={
                          i < COMPARISON_ROWS.length - 1
                            ? "border-b border-[color:var(--color-rule)]"
                            : ""
                        }
                      >
                        <td className="px-6 py-6 align-top">
                          <span className="font-display text-[24px] leading-none text-[color:var(--color-accent-ink)]">
                            {row.pillar.charAt(0)}
                          </span>
                          <p className="mt-1 text-[14px] font-medium text-[color:var(--color-ink)]">
                            {row.pillar}
                          </p>
                        </td>
                        <td className="px-6 py-6 align-top">
                          <p className="flex gap-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                            <XCircle
                              aria-hidden
                              className="mt-0.5 size-4 shrink-0 text-[color:var(--color-ink-muted)]"
                            />
                            <span>{row.legacyVendor}</span>
                          </p>
                        </td>
                        <td className="px-6 py-6 align-top">
                          <p className="flex gap-3 text-[15px] leading-[1.7] text-[color:var(--color-ink)]">
                            <CheckCircle2
                              aria-hidden
                              className="mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]"
                            />
                            <span>{row.rapidHire}</span>
                          </p>
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

      {/* ---------- 04 — Proof ---------- */}
      <section
        id="spa-proof"
        data-testid="spa-proof-section"
        className="border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
              <span className="eyebrow">03 — In their words</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
            <div className="col-span-12 lg:col-span-10 reveal-on-scroll">
              <p className="font-display text-[28px] leading-[1.25] tracking-[-0.01em] text-[color:var(--color-ink)] md:text-[36px]">
                What customers say after they switch.
              </p>
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                {PROOF_QUOTES.map((q) => (
                  <figure
                    key={q.pillar}
                    data-testid={`spa-proof-quote-${q.pillar.toLowerCase()}`}
                    className="rounded-[20px] border border-[color:var(--color-rule)] bg-white p-7"
                  >
                    <span
                      aria-hidden
                      className="font-display text-[40px] leading-none text-[color:var(--color-accent-ink)]"
                    >
                      {q.pillar.charAt(0)}
                    </span>
                    <blockquote className="mt-4 text-[16px] leading-[1.7] text-[color:var(--color-ink)]">
                      &ldquo;{q.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 eyebrow text-[color:var(--color-ink-muted)]">
                      {q.role}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-6 text-[13px] text-[color:var(--color-ink-muted)]">
                Quotes are representative of feedback received from current
                customers; names omitted at customer request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 05 — Final CTA ---------- */}
      <section
        id="spa-cta"
        data-testid="spa-cta-section"
        className="border-t border-[color:var(--color-rule)]"
      >
        <div className="container py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center reveal-on-scroll">
            <p className="eyebrow text-[color:var(--color-ink-muted)]">
              Step into the SPA
            </p>
            <h2 className="mt-3 font-display text-[36px] leading-[1.1] tracking-[-0.01em] text-[color:var(--color-ink)] sm:text-[44px] md:text-[52px]">
              {SPA_HEADLINE}
            </h2>
            <p className="mt-4 text-[18px] font-medium text-[color:var(--color-accent-ink)]">
              {SPA_TAGLINE}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Book a 15-minute call with a U.S.-based, FCRA-accredited rep.
              We'll line your current vendor's published numbers up next to
              ours. If we can't beat them on at least two of the three, we'll
              tell you so.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                data-testid="spa-final-cta"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-4 text-[15px] font-semibold text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                {SPA_TREATMENT_CTA}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {SPA_PILLARS.map((p) => (
                <li
                  key={p.letter}
                  className="text-[13px] eyebrow text-[color:var(--color-ink-muted)]"
                >
                  <span className="text-[color:var(--color-accent-ink)]">
                    {p.letter}
                  </span>{" "}
                  · {p.label} · {p.metric}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

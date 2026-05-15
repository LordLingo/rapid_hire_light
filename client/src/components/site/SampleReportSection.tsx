/*
  SampleReportSection — homepage proof section.

  Pairs the SampleReportCard with a short editorial intro so the home
  page still carries a tangible "this is what you actually receive"
  moment. Sits between LogoStrip and StopGambling in the Home
  composition.

  Layout: two-column on lg+ (copy left, card right); single column,
  card-first stack on mobile. Copy intentionally calls out the same
  five verifications the card displays so readers can connect what they
  read to what they see without looking at a real screenshot of the
  product.
*/
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import SampleReportCard from "./SampleReportCard";

export default function SampleReportSection() {
  return (
    <section
      id="sample-report"
      aria-labelledby="sample-report-heading"
      className="relative"
    >
      <div className="container py-20 md:py-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-center">
          {/* Left rail — section number + hairline (matches editorial rhythm) */}
          <div className="col-span-12 lg:col-span-2">
            <div className="flex lg:block items-center gap-4">
              <span className="eyebrow">02 — Proof</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
          </div>

          {/* Editorial intro */}
          <div className="col-span-12 lg:col-span-6">
            <p className="eyebrow mb-5">What a report looks like</p>
            <h2
              id="sample-report-heading"
              className="font-display text-[32px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[40px] md:text-[44px] lg:text-[48px]"
            >
              A clean, audit-ready report&nbsp;&mdash; not a wall of legalese.
            </h2>
            <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Every Rapid Hire report opens with a clear status pill,
              candidate identity, and time-to-completion at the top. The body
              spells out exactly which checks ran &mdash; identity, criminal
              (federal &amp; county), employment history, MVR, and drug panel
              &mdash; and the result of each, so your hiring managers can
              decide in seconds. An immutable audit trail and FCRA
              confirmation close the file.
            </p>
            <ul className="mt-7 grid gap-2 text-[14px] text-[color:var(--color-ink-soft)] sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-[7px] size-1.5 rounded-full bg-[color:var(--color-accent-ink)]"
                />
                Per-row verification status, not buried PDFs
              </li>
              <li className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-[7px] size-1.5 rounded-full bg-[color:var(--color-accent-ink)]"
                />
                Time-to-clear visible at a glance
              </li>
              <li className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-[7px] size-1.5 rounded-full bg-[color:var(--color-accent-ink)]"
                />
                FCRA-compliant disclosures included
              </li>
              <li className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-[7px] size-1.5 rounded-full bg-[color:var(--color-accent-ink)]"
                />
                Tamper-evident audit trail per case
              </li>
            </ul>

            <div className="mt-8">
              <Link
                href="/services"
                className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule)] bg-white px-5 py-3 text-[13.5px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-accent-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-white"
              >
                See what we screen
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Sample card */}
          <div className="col-span-12 lg:col-span-4">
            <SampleReportCard />
          </div>
        </div>
      </div>
    </section>
  );
}

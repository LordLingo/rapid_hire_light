/*
  Editorial Calm — hero
  Asymmetric two-column on desktop:
   - Left rail: section index "01 / Platform" + small eyebrow.
   - Main column: large Fraunces 300 headline with italic accent word
     "trusted", subhead in Inter, twin CTAs (ink primary + ghost),
     and a tiny meta line of trust signals.
   - Right column on desktop: a soft "report card" snapshot SVG that
     hints at the product without screenshotting it.
*/
import { ArrowRight, FileText } from "lucide-react";
import { toast } from "sonner";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft halo wash */}
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

      <div className="container relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-12 gap-x-8 gap-y-16">
          {/* Left rail */}
          <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
            <div className="flex lg:block items-center gap-4">
              <span className="eyebrow">01 — Platform</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
          </div>

          {/* Main column */}
          <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
            <p className="eyebrow mb-6">The intelligent hiring platform</p>
            <h1 className="font-display text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[60px] md:text-[76px] lg:text-[88px]">
              The{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                trusted
              </span>{" "}
              standard in&nbsp;background checks.
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Scale your hiring team with a platform built for speed,
              compliance, and accurate results that don&apos;t slow you down.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={() => toast("Start Screening — opens quote flow")}
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Start Screening
                <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => toast("Sample report — preview")}
                className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule)] bg-white px-6 py-3.5 text-[14px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
              >
                <FileText className="size-4" />
                View Sample Report
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 eyebrow text-[color:var(--color-ink-muted)]">
              <span>FCRA Certified</span>
              <span aria-hidden>·</span>
              <span>U.S.-Based Support</span>
              <span aria-hidden>·</span>
              <span>85%+ Within 24 Hours</span>
            </div>
          </div>

          {/* Right report card */}
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <ReportCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportCard() {
  return (
    <div className="relative">
      <div className="relative rounded-[18px] border border-border bg-white paper-shadow">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[color:var(--color-accent-ink)]" />
            <span className="eyebrow">Report · 24a-08821</span>
          </div>
          <span className="text-[10px] text-[color:var(--color-ink-muted)] tracking-wider uppercase">
            Cleared
          </span>
        </div>
        <div className="px-5 py-5">
          <p className="font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
            Maya R. — Logistics Lead
          </p>
          <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-muted)]">
            Returned in 06h 12m
          </p>

          <div className="mt-5 grid gap-3">
            {[
              { label: "Identity", state: "Verified" },
              { label: "Criminal — Federal & County", state: "Clear" },
              { label: "Employment History", state: "3 / 3 Verified" },
              { label: "MVR — Texas", state: "No incidents" },
              { label: "Drug — 5 Panel", state: "Negative" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 border-b border-border last:border-0 py-2"
              >
                <span className="text-[13px] text-[color:var(--color-ink-soft)]">
                  {row.label}
                </span>
                <span className="text-[12.5px] font-medium text-[color:var(--color-accent-ink)]">
                  {row.state}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between text-[11px] text-[color:var(--color-ink-muted)]">
            <span>Audit trail · 14 events</span>
            <span>FCRA ✓</span>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[28px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, oklch(0.95 0.04 250 / 0.6), transparent 70%)",
        }}
      />
    </div>
  );
}

/*
  Editorial Calm — hero
  Asymmetric two-column on desktop:
   - Left rail: section index "01 / Platform".
   - Main column: large Fraunces 300 headline with italic accent word
     "trusted", subhead in Inter, twin CTAs (ink primary + ghost),
     and a tiny meta line of trust signals.
   - Right column on desktop: a supplied marketing photograph
     (HOME_HERO_IMAGE_URL) that already includes its own composed
     headline ("TRUSTED RESULTS. FAST.") and tagline. Because the photo
     carries that copy, we intentionally drop the on-page eyebrow row
     ("THE INTELLIGENT HIRING PLATFORM") so the page doesn't compete
     with the image's baked-in headline.
*/
import { ArrowRight, FileText } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { HOME_HERO_IMAGE_URL } from "@shared/brand";

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
        <div className="grid grid-cols-12 gap-x-8 gap-y-16 items-center">
          {/* Left rail */}
          <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
            <div className="flex lg:block items-center gap-4">
              <span className="eyebrow">01 — Platform</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
          </div>

          {/* Main column */}
          <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
            <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[48px] md:text-[56px] lg:text-[58px] xl:text-[64px]">
              The{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                trusted
              </span>{" "}
              standard in&nbsp;background checks.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Scale your hiring team with a platform built for speed,
              compliance, and accurate results that don&apos;t slow you down.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Start Screening
                <ArrowRight className="size-4" />
              </Link>
              <button
                onClick={() => toast("Sample report — preview")}
                className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule)] bg-white px-6 py-3.5 text-[14px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-accent-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-white"
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

          {/* Right key visual */}
          <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
            <HeroKeyVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroKeyVisual() {
  // Marketing photograph supplied by the brand owner. The image already
  // contains a composed headline ("TRUSTED RESULTS. FAST.") and tagline,
  // so we don't overlay any additional text here. The soft halo behind it
  // mirrors the editorial palette without competing with the photo.
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[20px] border border-border bg-white paper-shadow">
        <img
          src={HOME_HERO_IMAGE_URL}
          alt="Hiring leader reviewing a Rapid Hire Solutions background check report on her laptop, with a pull-quote that reads: Trusted Results. Fast. Right People. Safe Choices. Stronger Teams."
          width={1240}
          height={1240}
          decoding="async"
          fetchPriority="high"
          draggable={false}
          className="block h-auto w-full select-none"
        />
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

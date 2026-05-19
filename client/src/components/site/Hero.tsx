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
import { Link } from "wouter";
import {
  HOME_HERO_IMAGE_URL,
  HOME_HERO_IMAGE_URL_AVIF,
  HOME_HERO_IMAGE_URL_WEBP,
  HOME_HERO_IMAGE_URL_MOBILE,
  HOME_HERO_IMAGE_URL_MOBILE_AVIF,
  HOME_HERO_IMAGE_URL_MOBILE_WEBP,
} from "@shared/brand";
import SpaPillars from "./SpaPillars";
import { SPA_ROUTE, SPA_TAGLINE } from "@/lib/spa";

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
              {/*
                §138: eyebrow renumbered from "01 — Platform" to
                "01 — The SPA Standard" so the SPA framework anchors the
                page from the very first line. The numbered eyebrow
                language carries through the rest of the home page
                sections (02, 03, …) so SPA reads as the foundational
                section, not a sidebar.
              */}
              <span className="eyebrow">01 — The SPA Standard</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
          </div>

          {/* Main column */}
          <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
            {/*
              §138: SPA-framed H1. The headline is the canonical
              SPA_HEADLINE ("Speed. Price. Accuracy.") rendered in three
              tight lines so each pillar word lands as its own visual
              beat, with the third line picking up the existing italic
              accent treatment that was previously applied to "trusted".
              The italic carries the editorial DNA of the previous H1
              forward into the new framing — it isn't a clean break.
            */}
            <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[48px] md:text-[56px] lg:text-[58px] xl:text-[64px]">
              <span className="block">Speed.</span>
              <span className="block">Price.</span>
              <span className="block italic font-light text-[color:var(--color-accent-ink)]">
                Accuracy.
              </span>
            </h1>
            {/*
              §138: subhead carries the trade-show tagline "Relax — we've
              got it handled." as a confident kicker in the accent ink,
              followed by the value-prop sentence that explains the SPA
              framing in concrete terms (faster, better priced, more
              accurate, U.S.-based FCRA-accredited support). The kicker
              is rendered slightly larger than the body so it reads as a
              brand statement, not a body sentence.
            */}
            <p className="mt-6 max-w-xl text-[18px] leading-[1.55] font-medium text-[color:var(--color-accent-ink)]">
              {SPA_TAGLINE}
            </p>
            <p className="mt-3 max-w-xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              The full-service background check experience your hiring
              team has been waiting for. Faster than your current vendor.
              Better priced. More accurate. And when you need help, a
              U.S.-based, FCRA-accredited rep picks up the phone.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="hero-primary-cta btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Start Screening
                <ArrowRight className="size-4" />
              </Link>
              {/*
                Anchor link to the homepage "What a Rapid Hire report looks
                like" section. We use a plain <a> instead of an onClick
                handler so right-click → "open in new tab" still works,
                Cmd+click opens the section in a new tab with the hash
                preserved, and the browser handles smooth-scroll natively
                via the `scroll-behavior: smooth` global rule. Keeps the
                button purely declarative.
              */}
              <a
                href="#sample-report"
                className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule)] bg-white px-6 py-3.5 text-[14px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-accent-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-white"
              >
                <FileText className="size-4" />
                View Sample Report
              </a>
              {/*
                §138: tertiary link to the dedicated SPA landing page.
                Styled as a low-contrast text link so it doesn't compete
                with the two primary CTAs — buyers who already know what
                they want click "Start Screening"; buyers who saw the
                booth at a trade show or are evaluating us against an
                incumbent click "Why we call it SPA".
              */}
              <Link
                href={SPA_ROUTE}
                data-testid="hero-why-spa-link"
                className="btn-press inline-flex items-center gap-1 px-2 py-3.5 text-[14px] font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent-ink)] underline-offset-4 hover:underline"
              >
                Why we call it SPA
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/*
              §138: SPA pillars replace the previous micro-stats trio
              ("FCRA Certified · U.S.-Based Support · 85%+ Within 24
              Hours"). The three pillars carry the hero's primary trust
              proof: Speed (TAT 8 hours), Price (competitive rates), and
              Accuracy (99.9% data accuracy). FCRA / U.S.-based support
              still appear in the certification strip at the very top of
              the page (separate component, not removed) so we don't
              lose the compliance signal.
            */}
            <SpaPillars variant="editorial" className="mt-10 max-w-xl" />
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
      <div className="hover-zoom-image relative rounded-[20px] border border-border bg-white paper-shadow">
        {/*
          <picture> swaps source at the Tailwind `sm` breakpoint (640px) and
          negotiates format inside each breakpoint. Browsers walk the
          <source> list top-down and pick the first they can decode whose
          media query matches.
            - >= 640px: 5:4 desktop crop  (AVIF -> WebP -> PNG fallback)
            - <  640px: original 1:1 source (AVIF -> WebP -> PNG fallback)
          AVIF + WebP cut the LCP image payload from ~1.5 MB to ~100 KB
          with no visible quality loss; the PNG <img> below remains the
          universal fallback for browsers that ship neither codec.
          See encode_hero_modern.py in webdev-static-assets/ for how the
          AVIF/WebP variants were produced.
        */}
        <picture>
          {/* Desktop sources (>= 640px) */}
          <source
            type="image/avif"
            media="(min-width: 640px)"
            srcSet={HOME_HERO_IMAGE_URL_AVIF}
            width={1254}
            height={1003}
          />
          <source
            type="image/webp"
            media="(min-width: 640px)"
            srcSet={HOME_HERO_IMAGE_URL_WEBP}
            width={1254}
            height={1003}
          />
          <source
            type="image/png"
            media="(min-width: 640px)"
            srcSet={HOME_HERO_IMAGE_URL}
            width={1254}
            height={1003}
          />
          {/* Mobile sources (< 640px) */}
          <source
            type="image/avif"
            media="(max-width: 639px)"
            srcSet={HOME_HERO_IMAGE_URL_MOBILE_AVIF}
            width={1254}
            height={1254}
          />
          <source
            type="image/webp"
            media="(max-width: 639px)"
            srcSet={HOME_HERO_IMAGE_URL_MOBILE_WEBP}
            width={1254}
            height={1254}
          />
          <source
            type="image/png"
            media="(max-width: 639px)"
            srcSet={HOME_HERO_IMAGE_URL_MOBILE}
            width={1254}
            height={1254}
          />
          <img
            src={HOME_HERO_IMAGE_URL}
            alt="Hiring leader reviewing a Rapid Hire Solutions background check report on her laptop, with a pull-quote that reads: Trusted Results. Fast. Right People. Safe Choices. Stronger Teams."
            width={1254}
            height={1003}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="block h-auto w-full select-none"
          />
        </picture>
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

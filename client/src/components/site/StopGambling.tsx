/*
  How We're Different (dark gradient variant, mirrored).

  This block is the homepage's positive differentiator beat:
  turnaround time + U.S.-based customer support, on the dark band.
  (Earlier revisions framed the same slot as a problem-statement;
  the section now leads with the differentiator instead. See the
  project changelog / todo.md §42 for context.)

  Editorial copy
    - Eyebrow: 02 — How we're different
    - Headline: "Turnaround time & customer support, done right."
      with the italic accent on the second clause so the sky-halo
      italic still carries the dark surface.
    - Left body paragraph: TAT claim with concrete numbers
      (24-hour median, 85%+ within 24 hours).
    - Right body paragraph: U.S.-based support, explicit disclaimers
      (no offshore queues / chatbots / scripts).
    - Closing italic pull-quote: "…it should be this simple."

  Design intent (unchanged from the dark-band rhythm pass)
    - Reuses the same dark gradient family as the Switch CTA banner so
      the homepage carries a deliberate "dark band" rhythm: this block
      mid-page (lighter on the LEFT, deeper ink on the RIGHT) and the
      Switch CTA near the bottom (deeper ink on the LEFT, lighter on
      the RIGHT). The two darks bracket the SampleReport / WhyUs /
      Workflows proof block in between.
    - Reversing the gradient direction here keeps the rhythm from
      feeling like two stacked copy/paste slabs: the "weight" shifts
      across the page instead of stacking on the same side.
    - Body copy + headline italic accent invert to the same warm-white
      / sky-halo tokens the footer + Switch CTA already use, so all
      three dark surfaces read as one continuous treatment.

  Tokens (defined in client/src/index.css)
      --color-footer            deep ink-cobalt
      --color-footer-soft       one step lighter
      --color-footer-foreground warm white
      --color-footer-muted      secondary copy
      --color-footer-soft-text  body copy on dark
      --color-accent-halo       sky-blue accent for emphasis on dark
*/
export default function StopGambling() {
  return (
    <section
      className="relative overflow-hidden text-[color:var(--color-footer-foreground)]"
      style={{
        // Mirrored gradient: lighter on the LEFT, deeper ink on the
        // RIGHT. Pinned in the test file so a future copy-edit can't
        // silently flatten this back to the paper surface or to the
        // same direction as the Switch CTA.
        backgroundImage:
          "linear-gradient(90deg, var(--color-footer-soft) 0%, var(--color-footer) 65%, var(--color-footer) 100%)",
        colorScheme: "dark",
      }}
    >
      {/*
        Soft top + bottom hairline glows. Same accent halo the Switch
        CTA uses, but here painted along the full edge of the section
        (since the dark surface is a full bleed band, not an inner
        card). Kept low alpha so they read as boundary glow, not stripes.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-accent-halo) 55%, transparent) 30%, color-mix(in oklch, var(--color-accent-halo) 55%, transparent) 70%, transparent)",
        }}
      />
      {/* Bottom hairline glow removed in section 43 — the wedge below
          replaces the clean bottom edge with a soft diagonal cut. */}

      <div className="container py-24 md:pt-32 md:pb-44 relative">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow text-[color:var(--color-footer-muted)]">
              02 — How we&apos;re different
            </p>
            <div
              className="mt-3 h-px"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in oklch, var(--color-accent-halo) 50%, transparent), transparent)",
              }}
            />
          </div>
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll relative">
            {/*
              Sky-halo radial halo behind the headline. Mirrors the
              halo treatment on CtaBanner so the two dark surfaces
              read as one continuous family. Painted via an absolute
              aria-hidden div positioned roughly behind the first
              line of the headline; the radial gradient fades to
              transparent at ~70% so it blooms against the gradient
              surface rather than punching a circle into it.
              Marker class `stop-gambling-halo` is the test pin.
            */}
            <div
              aria-hidden
              className="stop-gambling-halo pointer-events-none absolute -left-32 -top-24 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, var(--color-accent-halo), transparent 70%)",
              }}
            />
            <h2 className="relative font-display text-[44px] leading-[1.04] tracking-[-0.025em] text-[color:var(--color-footer-foreground)] sm:text-[60px] md:text-[76px]">
              Turnaround time &amp; customer support,{" "}
              <span className="italic font-normal text-[color:var(--color-accent-halo)]">
                done right.
              </span>
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl">
              <p className="text-[16.5px] leading-[1.75] text-[color:var(--color-footer-soft-text)]">
                Most reports clear in under 24 hours — among the fastest,
                most accurate background checks in the industry. We don&apos;t
                pad SLAs to look good on paper; we publish a 24-hour median
                and beat it on 85%+ of orders.
              </p>
              <p className="text-[16.5px] leading-[1.75] text-[color:var(--color-footer-soft-text)]">
                Every call is answered by a U.S.-based screening specialist
                — no offshore queues, no chatbots, no scripts. Real humans,
                in your timezone, on the same continent as your candidates.
              </p>
            </div>
            <p className="mt-10 font-display italic text-[24px] md:text-[28px] text-[color:var(--color-accent-halo)]">
              …it should be this simple.
            </p>
          </div>
        </div>
      </div>

      {/*
        Bottom wedge — visually transitions the dark band into the
        warm WhyUs paper that follows. Implemented as an SVG path with
        the section's deepest gradient stop (--color-footer) as fill,
        painted into the bottom 96px of the section. The path leans
        from upper-left to lower-right so the wedge mirrors the
        gradient's direction (light → deep). The padding-bottom on
        the inner container above is bumped to md:pb-44 so the wedge
        height (96px) cannot overlap the closing italic pull-quote.
        Marker class `stop-gambling-wedge` is the test pin.
      */}
      <svg
        aria-hidden
        className="stop-gambling-wedge pointer-events-none absolute inset-x-0 bottom-0 h-[72px] w-full md:h-[96px]"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        focusable="false"
      >
        {/*
          Path coordinates: top-left (0,32) → top-right (1440,72)
          → bottom-right (1440,96) → bottom-left (0,96) → close.
          The asymmetric top edge gives a shallow diagonal cubic
          curve rather than a straight cut, so the transition reads
          editorial rather than mechanical.
        */}
        <path
          d="M0,32 C 360,8 1080,88 1440,72 L 1440,96 L 0,96 Z"
          fill="var(--color-footer)"
        />
      </svg>
    </section>
  );
}

/*
  §138 — Reusable SPA pillars block.

  Renders the three SPA pillars (Speed, Price, Accuracy) in three
  visually distinct variants from a single shared data source
  (`SPA_PILLARS` from client/src/lib/spa.ts):

   - "editorial" — restrained, paper-toned, big serif S/P/A drop caps in
     accent-ink color, body in editorial typography. Used on the home
     hero where SPA replaces the old micro-stats trio. The visual
     aesthetic stays consistent with the rest of the editorial / law-
     firm look so SPA enriches the brand rather than competing with it.

   - "hero" — larger, more confident, used on the /spa landing page hero
     where each pillar gets a full short paragraph of supporting copy.
     Brand-blue circle icons sit above the letter; full SpaPillar.metric
     and SpaPillar.supportingCopy render below.

   - "compact" — single-line variant for footer / sidebars / OG card
     contexts. Renders the SPA_COMPACT string with optional micro icons.

  All three variants share the same pillar data so a metric edit in
  spa.ts propagates everywhere. Locked by spaPillars.test.ts +
  spaHero.test.ts + spaPage.test.ts.
*/
import { SPA_COMPACT, SPA_PILLARS } from "@/lib/spa";

type Variant = "editorial" | "hero" | "compact";

type Props = {
  variant: Variant;
  /** Optional className passthrough for fine-grained layout control. */
  className?: string;
};

export default function SpaPillars({ variant, className = "" }: Props) {
  if (variant === "compact") {
    return (
      <p
        data-testid="spa-pillars-compact"
        className={[
          "eyebrow text-[color:var(--color-footer-muted)]",
          className,
        ].join(" ")}
      >
        {SPA_COMPACT}
      </p>
    );
  }

  if (variant === "hero") {
    return (
      <div
        data-testid="spa-pillars-hero"
        className={[
          "grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3",
          className,
        ].join(" ")}
      >
        {SPA_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.letter}
              data-testid={`spa-pillar-hero-${pillar.letter.toLowerCase()}`}
              className="reveal-on-scroll"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="inline-flex size-12 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--color-accent-ink)_10%,transparent)] text-[color:var(--color-accent-ink)] ring-1 ring-[color:color-mix(in_oklch,var(--color-accent-ink)_25%,transparent)]"
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <span
                  aria-hidden
                  className="font-display text-[64px] leading-none text-[color:var(--color-accent-ink)]"
                >
                  {pillar.letter}
                </span>
              </div>
              <p className="mt-5 font-display text-[24px] leading-tight tracking-[-0.01em] text-[color:var(--color-ink)]">
                {pillar.label}
              </p>
              <p className="mt-2 text-[15px] font-medium text-[color:var(--color-accent-ink)]">
                {pillar.metric}
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {pillar.supportingCopy}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  // "editorial" — home hero replacement for the old micro-stats trio.
  // Three columns on md+, single column on mobile. Big serif drop-cap
  // letter, label + metric stacked, no supporting paragraph (kept tight
  // because the home hero already carries the H1 + sub-headline above).
  return (
    <div
      data-testid="spa-pillars-editorial"
      className={[
        "grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3",
        className,
      ].join(" ")}
    >
      {SPA_PILLARS.map((pillar) => (
        <div
          key={pillar.letter}
          data-testid={`spa-pillar-editorial-${pillar.letter.toLowerCase()}`}
          className="flex items-baseline gap-3"
        >
          <span
            aria-hidden
            className="font-display text-[40px] leading-none text-[color:var(--color-accent-ink)]"
          >
            {pillar.letter}
          </span>
          <div className="min-w-0">
            <p className="eyebrow text-[color:var(--color-ink-muted)]">
              {pillar.label}
            </p>
            <p className="mt-1 text-[14px] font-medium leading-snug text-[color:var(--color-ink)]">
              {pillar.metric}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

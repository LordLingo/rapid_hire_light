/*
  Editorial Calm — Sticky estimate mini-bar (Pricing page only)

  Why it exists:
    Once a visitor has configured the Pricing Calculator, the live numbers
    drop out of view as they scroll through Add-ons / FAQ / Closing CTA.
    This sticky bar keeps the per-check + monthly figure and a quote CTA
    one click away, anchored to the bottom of the viewport.

  Visibility model:
    - Hidden when the calculator (passed-in sentinelRef) is intersecting the
      viewport. We don't compete with the live calculator card.
    - Shown only after the user scrolls past the calculator bottom.
    - Hidden if the user has dismissed it for this session (sessionStorage).
    - Hidden if no estimate has been emitted yet (estimate === null).
    - Hidden during the initial paint to avoid flash.

  Motion:
    - Slides up 16px + fades in over 240ms ease-out on appearance.
    - Slides down + fades on dismiss.
    - Suppressed under prefers-reduced-motion.
*/
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, ArrowUp, Sparkles, X } from "lucide-react";
import type { CalculatorEstimate } from "@/components/site/PricingCalculator";

const SESSION_DISMISS_KEY = "rh:sticky-estimate-dismissed";

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
function fmtMoney2(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buildQuery(e: CalculatorEstimate, tierLabel: string) {
  const params = new URLSearchParams();
  params.set("volume", String(e.hires));
  params.set("services", e.selected.join(","));
  const summary = `Calculator estimate: ~${e.hires} hires/mo · ${tierLabel} tier · ~${fmtMoney2(e.perCheckNet)}/check · ~${fmtMoney(e.monthly)}/mo · ~${fmtMoney(e.annual)}/yr`;
  params.set("note", summary);
  return params.toString();
}

export default function StickyEstimateBar({
  estimate,
  matchedTierLabel = null,
  sentinelRef,
}: {
  estimate: CalculatorEstimate | null;
  /**
   * Optional. The Pricing page used to drive this with a matched tier id; the
   * highlight effect was removed per user feedback (it dimmed the surrounding
   * cards). Kept optional so future surfaces can still pass a label.
   */
  matchedTierLabel?: string | null;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [pastCalculator, setPastCalculator] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Restore session dismissal preference on mount.
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_DISMISS_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      // sessionStorage unavailable — ignore, treat as not dismissed.
    }
  }, []);

  // Watch the sentinel via a passive scroll listener: bar shows once the sentinel
  // has scrolled above the viewport. Scroll listeners are simpler and more reliable
  // than IntersectionObserver for this "past element" pattern, and the work per tick
  // is constant (one bounding-rect read).
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = sentinelRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      // "Past" = sentinel has scrolled above the top of the viewport (top < 0).
      // Add a small 8px buffer so the bar doesn't flicker right at the boundary.
      setPastCalculator(top < -8);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(compute);
    };
    // Initial measurement (in case page loads scrolled past the calculator, e.g. via #anchor).
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [sentinelRef]);

  function handleDismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  const visible = pastCalculator && !dismissed && estimate !== null;

  // Render a stable container so transitions can run; toggle via class.
  return (
    <div
      className={[
        "sticky-estimate-bar fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pointer-events-none",
        visible ? "is-visible" : "",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div
        className={[
          "mx-auto max-w-[820px] pointer-events-auto",
          "rounded-[16px] border border-[color:var(--color-border)] bg-white/95 backdrop-blur-md",
          "shadow-[0_18px_50px_-22px_rgba(15,23,42,0.25)]",
          "px-4 py-3 sm:px-5",
          "flex items-center gap-3 sm:gap-5",
        ].join(" ")}
        role="region"
        aria-label="Your live estimate"
      >
        {/* Left — sparkle + estimate facts */}
        <span className="hidden sm:grid place-items-center size-7 shrink-0 rounded-full bg-[color:var(--color-accent-ink)] text-white">
          <Sparkles className="size-3.5" strokeWidth={2.25} />
        </span>

        <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-[color:var(--color-ink-muted)]">
            Your estimate
          </p>
          {estimate ? (
            <p className="mt-0.5 truncate text-[13px] leading-tight text-[color:var(--color-ink)]">
              <span className="font-display text-[15px] tabular-nums text-[color:var(--color-ink)]">
                {fmtMoney2(estimate.perCheckNet)}
              </span>
              <span className="text-[color:var(--color-ink-muted)]"> / check</span>
              {/* Monthly is hidden on tiny viewports (<480px) to keep the row from wrapping. */}
              <span className="hidden xs:inline">
                <span className="mx-2 text-[color:var(--color-ink-muted)]">·</span>
                <span className="font-display text-[15px] tabular-nums text-[color:var(--color-ink)]">
                  {fmtMoney(estimate.monthly)}
                </span>
                <span className="text-[color:var(--color-ink-muted)]"> / mo</span>
              </span>
              {matchedTierLabel && (
                <>
                  <span className="mx-2 text-[color:var(--color-ink-muted)]">·</span>
                  <span className="text-[color:var(--color-accent-ink)] font-medium">
                    {matchedTierLabel}
                  </span>
                </>
              )}
            </p>
          ) : (
            <p className="mt-0.5 text-[13px] text-[color:var(--color-ink-muted)]">
              Configure the calculator above to see your live estimate.
            </p>
          )}
        </div>

        {/* Jump back to estimator — small icon-only on mobile, label on >=sm */}
        <a
          href="#estimate"
          className="btn-press hidden xs:inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-white px-3 py-2 text-[12px] font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent-ink)] hover:border-[color:var(--color-accent-ink)] shrink-0"
          aria-label="Jump to the estimator"
          title="Jump to the estimator"
        >
          <ArrowUp className="size-3.5" />
          <span className="hidden sm:inline">Jump to estimator</span>
          <span className="sm:hidden">Edit</span>
        </a>

        {/* Right — CTA + dismiss. §111: dedicated quote page (Formspree mvzyoyoz). */}
        {estimate && (
          <Link
            href={`/get-a-quote?${buildQuery(estimate, matchedTierLabel ?? "Custom")}`}
            data-testid="sticky-estimate-quote-desktop"
            className="btn-press hidden sm:inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-4 py-2 text-[12.5px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong,var(--color-accent-ink))] shrink-0"
          >
            Get this quote
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
        {estimate && (
          <Link
            href={`/get-a-quote?${buildQuery(estimate, matchedTierLabel ?? "Custom")}`}
            data-testid="sticky-estimate-quote-mobile"
            className="btn-press sm:hidden inline-flex items-center gap-1 rounded-full bg-[color:var(--color-accent-ink)] px-3 py-2 text-[12px] font-medium text-white shrink-0"
          >
            Get quote
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss estimate bar"
          className="grid place-items-center size-8 shrink-0 rounded-full text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper)] transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

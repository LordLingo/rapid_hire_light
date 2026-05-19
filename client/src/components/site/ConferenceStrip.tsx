/*
  §139.6 — Site-wide ConferenceStrip.

  Renders a single-line dismissible announcement strip at the very top
  of the page (above the trust/certification strip in Header.tsx). The
  strip is the loudest top-of-page surface site-wide and is the
  primary way booth-aware visitors who weren't actively looking for
  SHRM info still get pulled into /shrm.

  Behavior contract (locked by conferenceStrip.test.ts):
    - Auto-hides if isUpcoming() returns false (post-event)
    - Auto-hides if the user dismissed it earlier in the same session
      (sessionStorage, so a tab close re-shows it next visit)
    - Renders nothing on SSR / first paint to avoid hydration flash
    - Single-line copy on desktop, two-line wrap acceptable on mobile
    - Has a clearly-labeled close button with aria-label
    - Strip itself is a Link to /shrm so the entire bar is clickable
    - Uses the brand's accent-ink color so it dominates the page top
*/
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, X } from "lucide-react";
import {
  SHRM_EVENT,
  SHRM_ROUTE,
  SHRM_STRIP_DISMISSED_KEY,
  isUpcoming,
} from "@/lib/shrm";

export default function ConferenceStrip() {
  // Start hidden so SSR / first paint matches the post-mount state for
  // dismissed users, avoiding a flash. We flip to visible inside the
  // useEffect below if (a) the event is upcoming AND (b) the user
  // hasn't dismissed it this session.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isUpcoming()) return;
    try {
      const dismissed =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(SHRM_STRIP_DISMISSED_KEY) === "1";
      if (!dismissed) setVisible(true);
    } catch {
      // sessionStorage unavailable (Safari Private etc.) — show the strip
      // so we don't silently fail. Worst case the user dismisses it
      // every page load.
      setVisible(true);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
    try {
      window.sessionStorage.setItem(SHRM_STRIP_DISMISSED_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div
      data-testid="conference-strip"
      className="relative bg-[color:var(--color-accent-ink)] text-white"
    >
      <Link
        href={SHRM_ROUTE}
        data-testid="conference-strip-link"
        className="block"
      >
        <div className="container">
          <div className="flex items-center justify-center gap-3 py-2.5 text-[12.5px] font-medium leading-tight md:text-[13px]">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.18em] font-semibold">
              SHRM {SHRM_EVENT.year}
            </span>
            <span className="text-center">
              <span className="hidden sm:inline">
                Meeting at SHRM 2026, {SHRM_EVENT.dateRange}, {SHRM_EVENT.city}
                {" "}— book your slot
              </span>
              <span className="sm:hidden">
                SHRM 2026 — book your slot
              </span>
            </span>
            <ArrowRight
              className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              aria-hidden
            />
          </div>
        </div>
      </Link>
      <button
        type="button"
        data-testid="conference-strip-dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss SHRM 2026 announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-7 items-center justify-center rounded-full text-white/85 hover:bg-white/15 hover:text-white transition-colors duration-150"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

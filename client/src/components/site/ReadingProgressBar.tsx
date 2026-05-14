/*
  ReadingProgressBar — fixed-top, scroll-driven progress bar for /blog/:slug.

  - Reads scrollY against (documentHeight - viewportHeight) to compute %.
  - Throttled with requestAnimationFrame; passive scroll/resize listeners.
  - Sits at the very top of the viewport above the header (z-50).
  - Brand accent color, hairline track for polish, hides when complete (>99%)
    and when at the very top (<2%) so it doesn't distract on landing.
  - Respects prefers-reduced-motion: disables the inner CSS transition (the
    bar still updates every frame but without smoothing easing).
*/
import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const compute = () => {
      const doc = document.documentElement;
      const scrollTop =
        window.scrollY ||
        doc.scrollTop ||
        document.body.scrollTop ||
        0;
      const max = (doc.scrollHeight || 0) - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
      setProgress(pct);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Re-measure after late-rendered images/fonts shift content height.
    const t = window.setTimeout(compute, 600);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t);
    };
  }, []);

  // Hide the bar at the very top and at the end so it never feels like clutter.
  const visible = progress > 2 && progress < 99.5;

  return (
    <div
      aria-hidden
      className="reading-progress-bar fixed inset-x-0 top-0 z-50 h-[3px] pointer-events-none"
      data-reading-progress=""
      data-visible={visible ? "true" : "false"}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="absolute inset-0 bg-[color:color-mix(in_oklch,var(--color-accent-ink)_8%,transparent)]" />
      <div
        className="reading-progress-fill absolute inset-y-0 left-0 bg-[color:var(--color-accent-ink)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

import { useEffect } from "react";

/**
 * Premium reveal-on-scroll system.
 *
 * For every element with `.reveal-on-scroll`:
 *   1. We assign a stagger delay based on its index among `.reveal-on-scroll`
 *      siblings inside the same parent (so groups cascade — 0, 80ms, 160ms, ...)
 *      capped at 480ms to avoid sluggish entrances on long lists.
 *   2. An IntersectionObserver watches it once; on first intersection we add
 *      `.is-visible` and stop observing.
 *
 * Re-runs whenever `key` changes (e.g. on route change) so newly-mounted
 * pages get freshly observed.
 */
export function useReveal(key?: unknown) {
  useEffect(() => {
    const STAGGER_STEP = 80;
    const STAGGER_CAP = 480;

    // Group elements by their direct parent, so siblings stagger together
    // rather than the entire page using one global index.
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-on-scroll"),
    );
    if (els.length === 0) return;

    const indexInParent = new Map<HTMLElement, number>();
    const counters = new Map<HTMLElement, number>();
    els.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const next = (counters.get(parent) ?? 0);
      indexInParent.set(el, next);
      counters.set(parent, next + 1);
    });

    els.forEach((el) => {
      // Don't override an explicit author-set delay
      if (el.style.getPropertyValue("--reveal-delay")) return;
      const idx = indexInParent.get(el) ?? 0;
      const delay = Math.min(idx * STAGGER_STEP, STAGGER_CAP);
      if (delay > 0) {
        el.style.setProperty("--reveal-delay", `${delay}ms`);
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

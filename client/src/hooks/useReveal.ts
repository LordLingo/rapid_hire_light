import { useEffect } from "react";

/**
 * Lightweight IntersectionObserver-based reveal hook.
 * Adds `.is-visible` to any element with the `.reveal-on-scroll` class
 * once it enters the viewport. Respects prefers-reduced-motion via CSS.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-on-scroll"),
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

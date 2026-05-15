/*
  PostToc — on-page table of contents for long blog posts (§47).

  Renders a sticky vertical list of H2 anchors on the desktop left
  rail of a blog post. The active link (the H2 nearest the top of
  the viewport) gets the same brand-blue marker pattern the header
  uses for the active route — but rendered as a left-edge rail
  instead of an underline, since this list is stacked vertically.

  Active-section detection:
    Uses IntersectionObserver to watch all H2s simultaneously. The
    rootMargin shapes the "trigger zone" so the active heading is
    the one whose H2 has just crossed into the upper third of the
    viewport. We track ALL currently-intersecting headings and pick
    the one closest to the top of the document so the choice is
    stable when the reader is on a long section.

  Skip rules:
    - Posts with fewer than 3 H2 headings don't earn a TOC.
    - Hidden on viewports < lg breakpoint (where the article body
      already takes the full width and a side rail would crowd the
      reading column).

  Accessibility:
    - Wrapped in a labelled <nav>.
    - Active link gets aria-current="location" (the WAI-ARIA value
      reserved for "the current location within an environment or
      flow", which is exactly what a TOC active item is).
*/
import { useEffect, useRef, useState } from "react";

export type TocHeading = { id: string; text: string };

const HEADING_OBSERVER_OPTIONS: IntersectionObserverInit = {
  // top: -80px accounts for the sticky header height so the active
  //   heading flips when its title is just under the header.
  // bottom: -60% means the bottom 60% of the viewport is "outside"
  //   the trigger zone, so the active heading is whichever H2 is
  //   currently in the upper 40% of the viewport.
  rootMargin: "-80px 0px -60% 0px",
  threshold: [0, 1],
};

export default function PostToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null
  );
  // Track which heading ids are currently intersecting so we can pick
  // the topmost one in the document order rather than relying on the
  // last-fired entry.
  const intersectingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (headings.length < 3) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          intersectingRef.current.add(id);
        } else {
          intersectingRef.current.delete(id);
        }
      }
      // Pick the topmost heading among the intersecting set, in the
      // order they appear in `headings`. If none are intersecting,
      // leave activeId unchanged so we don't flicker between sections.
      const intersecting = intersectingRef.current;
      const topmost = headings.find((h) => intersecting.has(h.id));
      if (topmost) {
        setActiveId(topmost.id);
      }
    }, HEADING_OBSERVER_OPTIONS);

    const observed: Element[] = [];
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) {
        observer.observe(el);
        observed.push(el);
      }
    }
    return () => {
      for (const el of observed) observer.unobserve(el);
      observer.disconnect();
    };
  }, [headings]);

  // §47: skip render entirely for short posts.
  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="On this page"
      data-testid="post-toc"
      // Sticky: top-28 keeps the TOC clear of the header (which is
      // sticky at top-0 with ~80px combined trust strip + nav). The
      // border-l hairline anchors the rail visually without it
      // looking like a chrome panel.
      className="hidden lg:block sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4"
    >
      <p className="eyebrow text-[color:var(--color-ink-muted)]">On this page</p>
      <ul className="mt-5 grid gap-1.5">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={active ? "location" : undefined}
                data-active={active ? "true" : undefined}
                className={[
                  "relative block py-1.5 pl-3 -ml-3 text-[13px] leading-snug transition-colors",
                  active
                    ? "font-medium text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
                ].join(" ")}
              >
                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[color:var(--color-accent-ink)]"
                  />
                )}
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

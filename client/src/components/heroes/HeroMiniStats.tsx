/*
  HeroMiniStats — small 3-cell stat strip rendered directly under the
  framed hero card (inside the same right column of `PageHero`). Reads
  the per-page stats from `shared/hero-stats.json` so the numbers can
  be refreshed weekly without code changes. Each cell shares the brand
  vocabulary (paper-shadow card, hairline borders, Fraunces value).

  Animation: piggybacks on the existing `.reveal-on-scroll` infrastructure
  (see `useReveal`) and adds an extra internal stagger across the 3 cells
  via the `.hero-stagger-child` class defined in `index.css`.
*/
import * as React from "react";
import heroStats from "@shared/hero-stats.json";

export type HeroStatsPage =
  | "about"
  | "services"
  | "pricing"
  | "integrations"
  | "contact"
  | "support";

type Cell = { label: string; value: string; hint: string };

const PAGES = (heroStats as unknown as { pages: Record<HeroStatsPage, Cell[]> })
  .pages;
const WINDOW_LABEL = (heroStats as unknown as { windowLabel: string })
  .windowLabel;

export function HeroMiniStats({ page }: { page: HeroStatsPage }) {
  const cells = PAGES[page];
  if (!cells || cells.length === 0) return null;
  return (
    <div className="reveal-on-scroll mt-3" aria-label={`Live stats: ${WINDOW_LABEL}`}>
      <div className="rounded-[14px] border border-border bg-white paper-shadow overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] tracking-wider uppercase text-[color:var(--color-ink-muted)]">
            <span
              className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)] support-status-dot-live"
              aria-hidden
            />
            Live · {WINDOW_LABEL}
          </span>
          <span className="text-[10px] tracking-wider uppercase text-[color:var(--color-ink-muted)]">
            updated weekly
          </span>
        </div>
        <ul
          className="grid grid-cols-3 divide-x divide-border tabular-nums"
          role="list"
        >
          {cells.map((c, i) => (
            <li
              key={c.label}
              className="px-3 py-3 hero-stat-cell min-w-0"
              style={{ ["--stat-delay" as never]: `${i * 90}ms` }}
            >
              <p className="text-[10px] tracking-wider uppercase text-[color:var(--color-ink-muted)] leading-tight break-words">
                {c.label}
              </p>
              <p className="mt-1 font-display text-[18px] leading-tight text-[color:var(--color-ink)] break-words">
                {c.value}
              </p>
              <p className="mt-1 text-[10.5px] text-[color:var(--color-ink-muted)] leading-snug break-words">
                {c.hint}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HeroMiniStats;

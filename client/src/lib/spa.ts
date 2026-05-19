/*
  §138 — SPA brand hook (Speed · Price · Accuracy)

  Single source of truth for the SPA framework that runs end-to-end across
  the marketing site (home hero pillars, /spa landing page, footer tagline,
  pricing banner, header nav link, OG copy). Every consumer of SPA copy
  imports from here so a future copy edit happens in exactly one place
  and vitest specs can pin the canonical strings.

  The SPA framework comes from Rapid Hire's existing trade-show booth and
  has been validated as the most effective hook for switching prospects
  from incumbent vendors. The acronym hits the three things buyers
  actually care about (Speed, Price, Accuracy) and reframes a stressful
  purchase decision into something calming ("relax, we've got it
  handled").

  Discipline: we carry the SPA *framework* into the website, not the
  booth's literal spa visuals (waterfalls, candles, infinity pools). The
  booth is calibrated for stopping foot traffic on a noisy expo floor;
  the website is for serious B2B research. The existing editorial /
  law-firm aesthetic is doing real work — SPA enriches it, doesn't
  replace it.

  Per-pillar metrics are taken from the user-supplied trade-show booth
  artwork (730.png, 2026-05-18) and treated as canonical for now. They
  will be tightened automatically once the §137 live TAT feed lands and
  real per-check pricing is supplied.
*/

import { Gauge, Tag, Target, type LucideIcon } from "lucide-react";

export type SpaLetter = "S" | "P" | "A";

export type SpaPillar = {
  /** The single letter that anchors the pillar (S, P, or A). */
  letter: SpaLetter;
  /** Full pillar label ("Speed", "Price", "Accuracy"). */
  label: string;
  /**
   * Headline metric — the one number or short phrase that proves the
   * pillar at a glance. Used as the primary text under each pillar
   * across all variants of the SpaPillars component.
   */
  metric: string;
  /**
   * 1-2 sentence supporting copy that argues the pillar more deeply.
   * Used on the /spa landing page (hero variant). Editorial variant
   * (home hero) shows the metric only.
   */
  supportingCopy: string;
  /** Lucide icon that matches the booth's iconography. */
  icon: LucideIcon;
};

/**
 * Canonical SPA pillar data. Locked by spa.test.ts. Edit only with
 * intent — every consumer of SPA copy reads from this array.
 */
export const SPA_PILLARS: readonly SpaPillar[] = [
  {
    letter: "S",
    label: "Speed",
    metric: "Median TAT 8 hours",
    supportingCopy:
      "Most of our reports clear within a single business day. While legacy vendors are still acknowledging the order, your hiring decision is already made.",
    icon: Gauge,
  },
  {
    letter: "P",
    label: "Price",
    metric: "Competitive rates, better value",
    supportingCopy:
      "Built around your hiring volume, not a one-size-fits-all SKU. No setup fees, no hidden surcharges, no minimum commitments — and we publish our pricing publicly because we have nothing to hide.",
    icon: Tag,
  },
  {
    letter: "A",
    label: "Accuracy",
    metric: "99.9% data accuracy rate",
    supportingCopy:
      "Every report is sourced direct, verified twice, and reviewed by an FCRA-accredited rep before it lands in your dashboard. Disputes are rare — and when they happen, a U.S.-based human handles them in hours, not weeks.",
    icon: Target,
  },
] as const;

/**
 * Canonical SPA headline. Used as the home hero H1 and the /spa hero H1.
 * Locked by spa.test.ts.
 */
export const SPA_HEADLINE = "Speed. Price. Accuracy." as const;

/**
 * The "relax, we've got it handled" tagline from the trade-show booth.
 * Used as the home hero subhead kicker, the /spa hero subhead, and the
 * footer SPA line. Locked by spa.test.ts.
 */
export const SPA_TAGLINE = "Relax — we've got it handled." as const;

/**
 * Compact one-line variant for footer / sidebars / tab titles. Locked
 * by spa.test.ts.
 */
export const SPA_COMPACT = "Speed · Price · Accuracy." as const;

/**
 * Canonical name for the dedicated landing page concept. We refer to
 * the consultative call funnel as "your SPA Treatment" — a deliberate
 * play on the spa metaphor that turns the sales conversation into
 * something the buyer wants rather than something they tolerate.
 */
export const SPA_TREATMENT_CTA = "Book your SPA Treatment" as const;

/**
 * Canonical route for the dedicated SPA landing page. Locked by
 * spaTouchpoints.test.ts so a future rename can't silently break the
 * header nav link or footer references.
 */
export const SPA_ROUTE = "/spa" as const;

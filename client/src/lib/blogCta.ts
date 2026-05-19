/**
 * Blog CTA archetype framework.
 *
 * Every /blog/{slug} detail page renders a single closing CTA via the
 * <BlogPostCta /> component. The CTA shown is picked by scanning the post's
 * `tags` (and, as a last resort, its slug/title) against an ordered list of
 * archetypes. The first archetype that matches wins; otherwise the default
 * archetype is rendered.
 *
 * Why archetypes (not per-post CTAs)?
 *   - At 120+ posts (growing by 2/day) per-post CTAs become unmaintainable.
 *   - The product is the same regardless of which post brought a reader in,
 *     so most posts can share a single high-quality "Get a quote" CTA.
 *   - Verticals (healthcare / K-12 / DOT) and high-intent posts (switching,
 *     pricing/cost) earn specialized copy because their reader intent is
 *     materially different from the default research-mode reader.
 *
 * Attribution: every primary CTA href carries
 *   ?source=blog&archetype={id}&slug={slug}&subject={subject}
 * so the inbox routing on /contact can immediately tell us which post
 * (and which archetype) produced the lead.
 */

import type { BlogPost } from "./blog";

/** Canonical archetype identifiers. Stable strings — never rename. */
export type BlogCtaArchetypeId =
  | "default"
  | "healthcare"
  | "k12"
  | "dot"
  | "switching-rfp"
  | "pricing-cost";

/** Action with a builder so we can interpolate the post into the href. */
export type BlogCtaAction = {
  /** Visible button label. */
  label: string;
  /** Builds the destination href for this CTA given the post + archetype. */
  hrefBuilder: (post: BlogPost, archetypeId: BlogCtaArchetypeId) => string;
};

/** Static secondary action (no builder needed — destination is fixed). */
export type BlogCtaStaticAction = {
  label: string;
  href: string;
};

export type BlogCtaArchetype = {
  id: BlogCtaArchetypeId;
  /** Tiny uppercase pill above the headline. */
  eyebrow: string;
  /** Headline rendered in the band — short, sentence case. */
  headline: string;
  /** Supporting line below the headline. Optional but recommended. */
  body?: string;
  /** Primary (high-emphasis) CTA. Always required. */
  primary: BlogCtaAction;
  /** Optional secondary (low-emphasis) CTA. */
  secondary?: BlogCtaStaticAction;
  /**
   * Subject line used in the prefilled email / Formspree _subject when the
   * primary CTA lands on /contact. Keep short — appears in the inbox.
   */
  contactSubject: string;
};

/** Builder the default + most overrides share: lands on /contact with attribution. */
const contactHrefBuilder = (
  post: BlogPost,
  archetypeId: BlogCtaArchetypeId
): string => {
  const params = new URLSearchParams({
    source: "blog",
    archetype: archetypeId,
    slug: post.slug,
    subject: BLOG_CTA_ARCHETYPES_BY_ID[archetypeId]?.contactSubject ?? "Blog inquiry",
  });
  return `/contact?${params.toString()}`;
};

/**
 * Canonical archetype registry. Order does NOT determine match priority
 * (see CTA_MATCH_PRIORITY for that) — this is just the catalog.
 */
export const CTA_ARCHETYPES: readonly BlogCtaArchetype[] = [
  {
    id: "default",
    eyebrow: "Talk to a screening specialist",
    headline: "Get a quote in 24 hours.",
    body:
      "Most teams switch to Rapid Hire because we answer the phone, publish our pricing, and turn around the median check in 8 hours.",
    primary: {
      label: "Get a quote in 24 hours",
      hrefBuilder: contactHrefBuilder,
    },
    secondary: {
      label: "Try the pricing estimator",
      href: "/pricing#estimate",
    },
    contactSubject: "Quote request from the blog",
  },
  {
    id: "healthcare",
    eyebrow: "Healthcare hiring specialist",
    headline: "Talk to a healthcare-screening specialist.",
    body:
      "OIG, SAM, state Medicaid exclusion lists, license verification, abuse-registry checks — built into one package and refreshed continuously.",
    primary: {
      label: "Talk to a healthcare specialist",
      hrefBuilder: contactHrefBuilder,
    },
    secondary: {
      label: "Browse healthcare guides",
      href: "/blog/tag/healthcare",
    },
    contactSubject: "Healthcare screening — meeting request",
  },
  {
    id: "k12",
    eyebrow: "K-12 hiring specialist",
    headline: "Schedule a school-district consultation.",
    body:
      "State-mandated fingerprint checks, Jessica Lunsford Act tier-handling, ESSA §8546 lookback, and recurring re-screening on the same platform.",
    primary: {
      label: "Schedule a district consultation",
      hrefBuilder: contactHrefBuilder,
    },
    secondary: {
      label: "Read the K-12 compliance guide",
      href: "/blog/k12-school-employee-background-check-requirements",
    },
    contactSubject: "K-12 / school-district screening request",
  },
  {
    id: "dot",
    eyebrow: "DOT & transportation specialist",
    headline: "Set up DOT-compliant screening.",
    body:
      "FMCSA Clearinghouse queries, DOT pre-employment drug & alcohol panels, MVR pulls in all 50 states, and recurring annual MVRs — fully bundled.",
    primary: {
      label: "Set up DOT-compliant screening",
      hrefBuilder: contactHrefBuilder,
    },
    secondary: {
      label: "Browse DOT & MVR guides",
      href: "/blog/tag/dot",
    },
    contactSubject: "DOT / transportation screening request",
  },
  {
    id: "switching-rfp",
    eyebrow: "Switching vendors?",
    headline: "Book a 15-minute switch call.",
    body:
      "Most teams move off their incumbent vendor in under two weeks. We'll walk you through the cutover plan, pricing model, and ATS integration in one short call.",
    primary: {
      label: "Book a 15-minute switch call",
      hrefBuilder: contactHrefBuilder,
    },
    secondary: {
      label: "See how we compare",
      href: "/blog/tag/comparison",
    },
    contactSubject: "Switching from current background-check vendor",
  },
  {
    id: "pricing-cost",
    eyebrow: "Estimate your cost",
    headline: "Estimate your cost in 60 seconds.",
    body:
      "Our pricing estimator shows per-check, monthly, and annual totals at your real volume — with public, transparent rates and tiered volume discounts.",
    primary: {
      label: "Open the pricing estimator",
      hrefBuilder: (_post, _id) => "/pricing#estimate",
    },
    secondary: {
      label: "Talk to a specialist instead",
      href: "/contact?source=blog&archetype=pricing-cost",
    },
    contactSubject: "Pricing & cost question from the blog",
  },
] as const;

/** Indexed view of the archetype registry. Used by hrefBuilder + components. */
export const BLOG_CTA_ARCHETYPES_BY_ID: Record<BlogCtaArchetypeId, BlogCtaArchetype> =
  CTA_ARCHETYPES.reduce(
    (acc, a) => {
      acc[a.id] = a;
      return acc;
    },
    {} as Record<BlogCtaArchetypeId, BlogCtaArchetype>
  );

/**
 * Tag triggers per archetype. A post that has ANY trigger tag for an
 * archetype is considered a candidate for that archetype.
 */
export const CTA_TAG_TRIGGERS: Record<Exclude<BlogCtaArchetypeId, "default">, readonly string[]> = {
  k12: ["k12-education", "fingerprint-checks"],
  healthcare: ["healthcare"],
  dot: ["dot", "transportation"],
  "switching-rfp": ["comparison"],
  "pricing-cost": [], // Tag triggers don't apply — pricing-cost is matched by slug/title only.
} as const;

/**
 * Slug / title substring triggers (lowercased). Only used as a fallback when
 * tag triggers don't apply. Catches pricing/cost-intent posts that don't
 * carry a "pricing" tag in the registry.
 */
export const CTA_SLUG_TRIGGERS: Record<Exclude<BlogCtaArchetypeId, "default">, readonly string[]> = {
  k12: ["k12-", "k-12-", "school-employee", "school-district"],
  healthcare: ["healthcare-", "hospital-", "nurse-", "physician-"],
  dot: ["dot-", "fmcsa-", "mvr-", "trucking-", "driver-"],
  "switching-rfp": ["switching-", "vs-", "compare-", "comparison-", "rfp-"],
  "pricing-cost": [
    "pricing",
    "cost",
    "price",
    "turnaround",
    "tat",
    "how-much",
    "how-fast",
  ],
} as const;

/**
 * Match priority — most specialized first. The first matching archetype wins.
 * Order rationale:
 *   1. k12 — narrowest vertical, almost always the right CTA for a school post.
 *   2. healthcare — narrow vertical.
 *   3. dot — narrow vertical.
 *   4. switching-rfp — high-intent funnel position; beats pricing.
 *   5. pricing-cost — high-intent but more generic than switching.
 *   6. default — fallback.
 */
export const CTA_MATCH_PRIORITY: readonly Exclude<BlogCtaArchetypeId, "default">[] = [
  "k12",
  "healthcare",
  "dot",
  "switching-rfp",
  "pricing-cost",
] as const;

/**
 * Pick the right archetype for a post. Pure function — same post always
 * resolves to the same archetype.
 */
export function matchArchetype(post: Pick<BlogPost, "tags" | "slug" | "title">): BlogCtaArchetype {
  const tagSet = new Set(post.tags.map((t) => t.toLowerCase()));
  const haystack = `${post.slug} ${post.title}`.toLowerCase();

  for (const id of CTA_MATCH_PRIORITY) {
    const tagHit = CTA_TAG_TRIGGERS[id].some((t) => tagSet.has(t));
    if (tagHit) return BLOG_CTA_ARCHETYPES_BY_ID[id];
    const slugHit = CTA_SLUG_TRIGGERS[id].some((s) => haystack.includes(s));
    if (slugHit) return BLOG_CTA_ARCHETYPES_BY_ID[id];
  }

  return BLOG_CTA_ARCHETYPES_BY_ID.default;
}

/**
 * Build the destination URL for a CTA primary action. Exposed as a top-level
 * helper so tests + non-component callers can use it directly.
 */
export function buildBlogCtaContactUrl(
  post: Pick<BlogPost, "slug" | "tags" | "title">,
  archetypeId?: BlogCtaArchetypeId
): string {
  const archetype = archetypeId
    ? BLOG_CTA_ARCHETYPES_BY_ID[archetypeId]
    : matchArchetype(post);
  // The pricing-cost primary doesn't go to /contact — short-circuit.
  if (archetype.id === "pricing-cost") {
    return archetype.primary.hrefBuilder(post as BlogPost, archetype.id);
  }
  return contactHrefBuilder(post as BlogPost, archetype.id);
}

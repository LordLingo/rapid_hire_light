/**
 * Static blog content registry.
 *
 * Posts live as typed TS modules under `client/src/content/blog/<slug>.ts`
 * and are surfaced through this module's pure helpers. We keep the surface
 * intentionally tiny (`listPosts`, `getPostBySlug`) so the index/detail
 * pages remain framework-agnostic and easy to test.
 *
 * Why static modules instead of a database?
 *   - This template ships as a static frontend (no DB, no tRPC).
 *   - Content is version-controlled with the rest of the codebase.
 *   - Build-time bundling means zero hydration cost at the edge.
 *   - SEO meta is colocated with the body, so it can never drift.
 */

export type BlogPost = {
  /** URL slug. Lower-kebab-case. Stable forever; do not rename. */
  slug: string;
  /** Human-readable post title. Also the rendered <h1>. */
  title: string;
  /**
   * Title used in the browser tab + Open Graph. Optional override; falls
   * back to `title` when omitted. Should stay <= 60 characters for SERP.
   */
  metaTitle?: string;
  /**
   * Meta description for SERP snippet + OG. Aim for 140-160 characters and
   * include the primary keyword early.
   */
  metaDescription: string;
  /** Short marketing-style excerpt rendered on the index card (~25 words). */
  excerpt: string;
  /** ISO date (YYYY-MM-DD) of publication. Used for sort + dateline. */
  publishedAt: string;
  /** Estimated reading time in minutes. Pre-computed for content stability. */
  readingMinutes: number;
  /** Author display name. */
  author: string;
  /** Topical tags. Lowercase, kebab-case. First tag becomes the eyebrow. */
  tags: string[];
  /** Optional cover image URL (uploaded via manus-upload-file --webdev). */
  cover?: string;
  /** Alt text for the cover image. Should mirror the post's primary keywords. */
  coverAlt?: string;
  /**
   * Body in a tiny Markdown-like dialect:
   *   - Lines starting with `## ` become <h2>.
   *   - Lines starting with `### ` become <h3>.
   *   - Lines starting with `- ` become <ul><li>.
   *   - Blank lines separate paragraphs.
   *   - Inline `[text](url)` becomes <a>.
   *   - Inline `**text**` becomes <strong>.
   *
   * We avoid pulling in a markdown library to keep the bundle lean and the
   * rendering deterministic for SEO snapshots.
   */
  body: string;
};

import { post as postFcraGuide } from "@/content/blog/fcra-compliance-guide";
import { post as postTurnaround } from "@/content/blog/background-check-turnaround-times";
import { post as postDrugTesting } from "@/content/blog/pre-employment-drug-testing";
import { post as postDotMvr } from "@/content/blog/dot-driver-background-checks-mvr";
import { post as postMonitoring } from "@/content/blog/continuous-employee-monitoring";
import { post as postBanTheBox } from "@/content/blog/ban-the-box-fair-chance-hiring";
import { post as postHowToRun } from "@/content/blog/how-to-run-a-background-check-on-an-employee";
import { post as postSmallBiz } from "@/content/blog/best-background-check-service-small-business";
import { post as postCountyVsNational } from "@/content/blog/county-vs-national-criminal-background-check";
import { post as postEeocBtb } from "@/content/blog/eeoc-ban-the-box-compliance";
import { post as postIcraa } from "@/content/blog/california-icraa-disclosure-requirements";
import { post as postHowLong } from "@/content/blog/how-long-does-background-check-take";
import { post as postEduVerify } from "@/content/blog/education-verification-process";
import { post as postHealthcare } from "@/content/blog/healthcare-background-check-requirements";
import { post as postContinuousVsAnnual } from "@/content/blog/continuous-monitoring-vs-annual-rescreening";
import { post as postAdverseAction } from "@/content/blog/adverse-action-letter-fcra-template";
import { post as postNycFairChance } from "@/content/blog/nyc-fair-chance-act-background-checks";
import { post as postIllinoisJoqaa } from "@/content/blog/illinois-joqaa-background-checks";
import { post as postDotPart40 } from "@/content/blog/dot-drug-testing-49-cfr-part-40";
import { post as postMarijuanaStateLaws } from "@/content/blog/marijuana-drug-testing-state-laws";
import { post as postMroProcess } from "@/content/blog/medical-review-officer-mro-process";
import { post as post5vs10Panel } from "@/content/blog/5-panel-vs-10-panel-drug-test";
import { post as postOralVsUrine } from "@/content/blog/oral-fluid-vs-urine-drug-testing";
import { post as postFcra604b } from "@/content/blog/fcra-604b-disclosure-authorization";
import { post as postFcra613 } from "@/content/blog/fcra-613-public-record-reporting";
import { post as postFcra609 } from "@/content/blog/fcra-609-consumer-file-disclosure";
import { post as postFcra611 } from "@/content/blog/fcra-611-dispute-reinvestigation";
import { post as postFcra615623 } from "@/content/blog/fcra-615-623-employer-duties";
import { post as postCaAds } from "@/content/blog/california-ads-ai-employment-screening-regulations";
import { post as postLaCountyFco } from "@/content/blog/los-angeles-county-fair-chance-ordinance-employers";
import { post as postCaSb731 } from "@/content/blog/california-sb-731-clean-slate-employer-guide";
import { post as postCaAb2188 } from "@/content/blog/california-ab-2188-marijuana-hiring-employers";
import { post as postCaCfcaEnforcement } from "@/content/blog/california-crd-cfca-enforcement-employer-lessons";
import { post as postCaAb2095 } from "@/content/blog/california-ab-2095-job-duty-transparency";
import { post as postCaAiBias } from "@/content/blog/california-ai-algorithmic-bias-hiring-rules";
import { post as postCaAb2064 } from "@/content/blog/california-ab-2064-criminal-history-protected-characteristic";
import { post as postCaIcraaParsonage } from "@/content/blog/california-icraa-parsonage-walmart-10k-penalty";
import { post as postCaSb731Impact } from "@/content/blog/california-sb-731-clean-slate-impact-2026";
import { post as postEeocDisparate } from "@/content/blog/eeoc-title-vii-disparate-impact-screening";
import { post as postEeocAda } from "@/content/blog/eeoc-ada-pre-employment-medical-inquiries";
import { post as postEeocPwfa } from "@/content/blog/eeoc-pwfa-pregnant-workers-fairness-act";
import { post as postEeocSep } from "@/content/blog/eeoc-strategic-enforcement-plan-2024-2028";
import { post as postEeocEeo1 } from "@/content/blog/eeoc-eeo1-component-1-reporting";
import { post as postSmbPricing } from "@/content/blog/small-business-background-check-pricing";
import { post as postSmbFcraTraps } from "@/content/blog/small-business-fcra-compliance-traps";
import { post as postSmbFirstCheck } from "@/content/blog/small-business-first-background-check";
import { post as postSmbNoHr } from "@/content/blog/small-business-no-hr-screening-practices";
import { post as postSmbCraVsFree } from "@/content/blog/small-business-cra-vs-free-public-record-search";
import { post as postFmcsaPsp } from "@/content/blog/fmcsa-psp-pre-employment-screening-program";
import { post as postHairFollicle } from "@/content/blog/hair-follicle-drug-testing-cdl-drivers";
import { post as postOwnerOpVsEmployee } from "@/content/blog/owner-operator-vs-employee-driver-screening";
import { post as postLastMile } from "@/content/blog/last-mile-delivery-driver-hiring-non-dot";
import { post as postCdlDisqualify } from "@/content/blog/cdl-endorsements-disqualifying-offenses";
import { post as postCmsExclusion } from "@/content/blog/cms-exclusion-screening-oig-leie-sam";
import { post as postJointCommission } from "@/content/blog/joint-commission-hr-standards";
import { post as postHcCredVsBg } from "@/content/blog/healthcare-credentialing-vs-background-check";
import { post as postNpdb } from "@/content/blog/npdb-national-practitioner-data-bank";
import { post as postLtcSnf } from "@/content/blog/long-term-care-snf-screening-civil-money-penalty";
import { post as postClearinghouse } from "@/content/blog/fmcsa-drug-alcohol-clearinghouse";
import { post as postDotRtd } from "@/content/blog/dot-return-to-duty-process";
import { post as postDotTestTypes } from "@/content/blog/dot-pre-employment-random-reasonable-suspicion-testing";
import { post as postDqFile } from "@/content/blog/driver-qualification-file-checklist-49-cfr-391";
import { post as postNonDotTesting } from "@/content/blog/non-dot-drug-testing-state-local-cdl";
import { post as postWaMarijuana } from "@/content/blog/washington-marijuana-hiring-protections";
import { post as postNy201d } from "@/content/blog/new-york-labor-law-201-d-marijuana";
import { post as postNjCreamm } from "@/content/blog/new-jersey-creamm-act-wire-certification";
import { post as postThcMetabolite } from "@/content/blog/thc-metabolite-vs-impairment-science";
import { post as postSafetySensitive } from "@/content/blog/marijuana-testing-safety-sensitive-vs-non-safety-sensitive";

const ALL_POSTS: readonly BlogPost[] = Object.freeze([
  postFcraGuide,
  postTurnaround,
  postDrugTesting,
  postDotMvr,
  postMonitoring,
  postBanTheBox,
  postHowToRun,
  postSmallBiz,
  postCountyVsNational,
  postEeocBtb,
  postIcraa,
  postHowLong,
  postEduVerify,
  postHealthcare,
  postContinuousVsAnnual,
  postAdverseAction,
  postNycFairChance,
  postIllinoisJoqaa,
  postDotPart40,
  postMarijuanaStateLaws,
  postMroProcess,
  post5vs10Panel,
  postOralVsUrine,
  postFcra604b,
  postFcra613,
  postFcra609,
  postFcra611,
  postFcra615623,
  postCaAds,
  postLaCountyFco,
  postCaSb731,
  postCaAb2188,
  postCaCfcaEnforcement,
  postCaAb2095,
  postCaAiBias,
  postCaAb2064,
  postCaIcraaParsonage,
  postCaSb731Impact,
  postEeocDisparate,
  postEeocAda,
  postEeocPwfa,
  postEeocSep,
  postEeocEeo1,
  postSmbPricing,
  postSmbFcraTraps,
  postSmbFirstCheck,
  postSmbNoHr,
  postSmbCraVsFree,
  postFmcsaPsp,
  postHairFollicle,
  postOwnerOpVsEmployee,
  postLastMile,
  postCdlDisqualify,
  postCmsExclusion,
  postJointCommission,
  postHcCredVsBg,
  postNpdb,
  postLtcSnf,
  postClearinghouse,
  postDotRtd,
  postDotTestTypes,
  postDqFile,
  postNonDotTesting,
  postWaMarijuana,
  postNy201d,
  postNjCreamm,
  postThcMetabolite,
  postSafetySensitive,
]);

/**
 * Return all published posts sorted newest-first. Pure function — safe to
 * call from React components without memoization concerns.
 */
export function listPosts(): BlogPost[] {
  return [...ALL_POSTS].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}

/**
 * Look up a single post by slug. Returns `undefined` for unknown slugs so
 * callers can render a 404 cleanly.
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug);
}

/**
 * Return up to `n` posts excluding the supplied slug, used to power the
 * "More from the team" rail on detail pages.
 */
export function relatedPosts(currentSlug: string, n: number = 3): BlogPost[] {
  return listPosts()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, n);
}

/**
 * Return every distinct tag across all posts, alphabetically sorted.
 * Pure helper so both the index rail and the sitemap generator share one
 * source of truth.
 */
export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const p of ALL_POSTS) for (const t of p.tags) set.add(t);
  return Array.from(set).sort();
}

/**
 * Return all posts that carry the given tag, newest-first. Tag matching
 * is exact and case-sensitive (tags are guaranteed lower-kebab-case by
 * the registry test suite).
 */
export function listPostsByTag(tag: string): BlogPost[] {
  return listPosts().filter((p) => p.tags.includes(tag));
}

/**
 * Render a tag in human-readable form for headings and chips.
 * Example: "fair-chance" -> "Fair Chance".
 */
export function formatTag(tag: string): string {
  return tag
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/**
 * Format an ISO date (YYYY-MM-DD) as a long-form English dateline.
 */
export function formatPublishedDate(iso: string): string {
  // Parse as UTC midnight to avoid the page rendering a different day in
  // a viewer's local timezone (a classic SSR/CSR drift hazard).
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

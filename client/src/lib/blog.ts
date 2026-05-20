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
// §90 Phase 2 — Sanctions cluster
import { post as postStateMedicaid } from "@/content/blog/state-medicaid-exclusion-lists-by-state";
import { post as postSamWorkflow } from "@/content/blog/sam-gov-exclusion-check-workflow";
import { post as postOigLeieMonthly } from "@/content/blog/oig-leie-monthly-update-process";
import { post as postHcContractorSanctions } from "@/content/blog/healthcare-contractor-sanctions-screening";
import { post as postSanctionsFreq } from "@/content/blog/sanctions-screening-frequency-best-practices";
// §90 Phase 2 — Illinois cluster
import { post as postIlBipa } from "@/content/blog/illinois-bipa-background-checks";
import { post as postIlSalaryHistory } from "@/content/blog/illinois-salary-history-ban-employer-guide";
import { post as postChicagoFco } from "@/content/blog/chicago-fair-chance-ordinance-employer-guide";
import { post as postIhraConviction } from "@/content/blog/illinois-human-rights-act-conviction-record";
import { post as postIlEprc } from "@/content/blog/illinois-pay-data-reporting-eprc";
// §90 Phase 2 — New York cluster
import { post as postNyc23a } from "@/content/blog/nyc-article-23a-multi-factor-analysis";
import { post as postNyShield } from "@/content/blog/ny-shield-act-cra-data-security";
import { post as postNycLl144 } from "@/content/blog/nyc-local-law-144-aedt-bias-audit";
import { post as postWestchesterFco } from "@/content/blog/westchester-county-fair-chance-act";
import { post as postNyCleanSlate } from "@/content/blog/new-york-clean-slate-act-employer-guide";
// §90 Phase 2 — ADA cluster
import { post as postAdaDirectThreat } from "@/content/blog/ada-direct-threat-defense";
import { post as postAdaInteractive } from "@/content/blog/ada-interactive-accommodation-process";
import { post as postAdaRtw } from "@/content/blog/ada-return-to-work-fitness-for-duty";
import { post as postAdaDrugTesting } from "@/content/blog/ada-drug-testing-current-vs-past-use";
import { post as postAdaMentalHealth } from "@/content/blog/ada-mental-health-screening-employer-guide";
// §90 Phase 2 — ICRAA cluster
import { post as postIcraaDef } from "@/content/blog/icraa-investigative-consumer-report-definition";
import { post as postIcraaPenalty } from "@/content/blog/icraa-penalty-exposure-class-action";
import { post as postIcraaSevenYear } from "@/content/blog/icraa-seven-year-reporting-cap";
import { post as postIcraa178640 } from "@/content/blog/icraa-1786-40-public-record-notice";
import { post as postIcraaVsCcraa } from "@/content/blog/icraa-vs-ccraa-distinction";
// §90 Phase 3 — Operations cluster
import { post as postBulkRescreen } from "@/content/blog/bulk-rescreen-workflow-design";
import { post as postFunnelSla } from "@/content/blog/hiring-funnel-screening-sla-design";
import { post as postMultiVendor } from "@/content/blog/multi-vendor-screening-orchestration";
import { post as postCostPerHire } from "@/content/blog/screening-cost-per-hire-benchmarks";
import { post as postContingentOps } from "@/content/blog/contingent-workforce-screening-operations";
// §90 Phase 3 — Verification cluster
import { post as postI9EVerify } from "@/content/blog/i9-e-verify-employer-guide";
import { post as post7yrEmpHistory } from "@/content/blog/seven-year-employment-history-workflow";
import { post as postLicensePsv } from "@/content/blog/professional-license-primary-source-verification";
import { post as postIntlDegree } from "@/content/blog/international-degree-credential-evaluation";
import { post as postRefsVsEmp } from "@/content/blog/references-vs-employment-verification";
// §90 Phase 3 — Candidate experience cluster
import { post as postPreApplicantUx } from "@/content/blog/pre-applicant-disclosure-ux";
import { post as postMobileFirstAuth } from "@/content/blog/mobile-first-authorization-flows";
import { post as postDisputeResponse } from "@/content/blog/dispute-letter-response-best-practices";
import { post as postPortalStatus } from "@/content/blog/candidate-portal-status-transparency";
import { post as postMultilingualDisc } from "@/content/blog/multilingual-disclosure-design";
// §90 Phase 3 — Adverse action cluster
import { post as postPreAdverse5Day } from "@/content/blog/pre-adverse-five-business-day-clock";
import { post as postIndividualAssess } from "@/content/blog/individualized-assessment-letter-template";
import { post as postReasonableTimeState } from "@/content/blog/reasonable-time-rule-by-state";
import { post as postAdverseContingent } from "@/content/blog/adverse-action-contingent-workers";
import { post as postJointEmployerAdv } from "@/content/blog/joint-employer-adverse-action";
// §90 Phase 3 — Continuous monitoring cluster
import { post as postPostHireAlerts } from "@/content/blog/post-hire-criminal-alerts-program";
import { post as postMvrMonitoring } from "@/content/blog/mvr-continuous-monitoring-program";
import { post as postHcExclusionCm } from "@/content/blog/healthcare-exclusion-continuous-monitoring";
import { post as postCmLookback } from "@/content/blog/continuous-monitoring-lookback-policy";
import { post as postCmDriftDetect } from "@/content/blog/continuous-monitoring-drift-detection";
// §115 — financial services / FINRA Rule 3110(e) gap-filler
import { post as postFinra3110 } from "@/content/blog/finra-rule-3110-background-check-employer-guide";
// §143 — K-12 / education vertical gap-filler (ESSA §8546 + state fingerprint statutes)
import { post as postK12School } from "@/content/blog/k12-school-employee-background-check-requirements";
// §155 — Social media screening gap-filler (NLRA §7 + Title VII + GINA + state password-protection statutes + FCRA §603(d))
import { post as postSocialMedia } from "@/content/blog/social-media-screening-employer-guide";

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
  // §90 Phase 2 — 25 posts
  postStateMedicaid,
  postSamWorkflow,
  postOigLeieMonthly,
  postHcContractorSanctions,
  postSanctionsFreq,
  postIlBipa,
  postIlSalaryHistory,
  postChicagoFco,
  postIhraConviction,
  postIlEprc,
  postNyc23a,
  postNyShield,
  postNycLl144,
  postWestchesterFco,
  postNyCleanSlate,
  postAdaDirectThreat,
  postAdaInteractive,
  postAdaRtw,
  postAdaDrugTesting,
  postAdaMentalHealth,
  postIcraaDef,
  postIcraaPenalty,
  postIcraaSevenYear,
  postIcraa178640,
  postIcraaVsCcraa,
  // §90 Phase 3 — 25 posts
  postBulkRescreen,
  postFunnelSla,
  postMultiVendor,
  postCostPerHire,
  postContingentOps,
  postI9EVerify,
  post7yrEmpHistory,
  postLicensePsv,
  postIntlDegree,
  postRefsVsEmp,
  postPreApplicantUx,
  postMobileFirstAuth,
  postDisputeResponse,
  postPortalStatus,
  postMultilingualDisc,
  postPreAdverse5Day,
  postIndividualAssess,
  postReasonableTimeState,
  postAdverseContingent,
  postJointEmployerAdv,
  postPostHireAlerts,
  postMvrMonitoring,
  postHcExclusionCm,
  postCmLookback,
  postCmDriftDetect,
  postFinra3110,
  postK12School,
  postSocialMedia,
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
  const all = listPosts();
  const current = all.find((p) => p.slug === currentSlug);
  const currentTags = new Set(current?.tags ?? []);
  return all
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      const shared = p.tags.reduce(
        (acc, t) => (currentTags.has(t) ? acc + 1 : acc),
        0,
      );
      return { post: p, shared };
    })
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      // Tie-break by publish date (newest first), already the listPosts() order.
      const ai = all.findIndex((p) => p.slug === a.post.slug);
      const bi = all.findIndex((p) => p.slug === b.post.slug);
      return ai - bi;
    })
    .slice(0, n)
    .map((entry) => entry.post);
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

/**
 * Build-time-imported blog metadata. The same JSON file is consumed by the
 * sitemap pipeline and the OG SVG renderer; importing it directly keeps the
 * "lastmod" source of truth aligned across the build, the runtime, and the
 * sitemap. The shape is `{ posts: [{ slug, lastmod }] }`.
 */
import blogMeta from "../../../shared/blog-meta.json";

const LASTMOD_BY_SLUG: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  const posts = (blogMeta as { posts?: Array<{ slug?: string; lastmod?: string }> }).posts ?? [];
  for (const entry of posts) {
    if (entry.slug && entry.lastmod) map[entry.slug] = entry.lastmod;
  }
  return map;
})();

/**
 * Returns the last-modified ISO date for a post. Falls back to publishedAt
 * if the meta file hasn't been refreshed yet (defensive — should not happen
 * in production builds, but useful for local snapshots).
 */
export function getPostLastmod(slug: string): string {
  const fromMeta = LASTMOD_BY_SLUG[slug];
  if (fromMeta) return fromMeta;
  const post = ALL_POSTS.find((p) => p.slug === slug);
  return post?.publishedAt ?? "";
}

/**
 * "Recently updated" heuristic: lastmod is at least `dayThreshold` days
 * after publishedAt. Default 60 days — enough to filter out routine
 * republish noise but catch genuinely-revised posts.
 */
export function isRecentlyUpdated(post: BlogPost, dayThreshold: number = 60): boolean {
  const lastmod = getPostLastmod(post.slug);
  if (!lastmod || lastmod === post.publishedAt) return false;
  const pub = Date.parse(`${post.publishedAt}T00:00:00Z`);
  const mod = Date.parse(`${lastmod}T00:00:00Z`);
  if (Number.isNaN(pub) || Number.isNaN(mod)) return false;
  const days = (mod - pub) / (1000 * 60 * 60 * 24);
  return days >= dayThreshold;
}

/**
 * All publication years that contain at least one post, newest first.
 * Used to render /blog/year/:year hub navigation without hard-coding.
 */
export function listPostYears(): number[] {
  const years = new Set<number>();
  for (const p of ALL_POSTS) {
    const y = Number(p.publishedAt.slice(0, 4));
    if (!Number.isNaN(y)) years.add(y);
  }
  return Array.from(years).sort((a, b) => b - a);
}

/** Posts published in a given year, newest first. */
export function listPostsByYear(year: number): BlogPost[] {
  return listPosts().filter((p) => p.publishedAt.startsWith(`${year}-`));
}

/**
 * Group a list of posts by quarter (Q1..Q4). Returns an ordered array of
 * { quarter, label, posts } so the year-in-review page can render four
 * columns with chronologically-grouped entries.
 */
export function groupPostsByQuarter(
  posts: BlogPost[],
): Array<{ quarter: 1 | 2 | 3 | 4; label: string; posts: BlogPost[] }> {
  const buckets: Record<1 | 2 | 3 | 4, BlogPost[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const p of posts) {
    const m = Number(p.publishedAt.slice(5, 7));
    const q = (Math.ceil(m / 3) || 1) as 1 | 2 | 3 | 4;
    buckets[q].push(p);
  }
  const labels: Record<1 | 2 | 3 | 4, string> = {
    1: "Q1 — January to March",
    2: "Q2 — April to June",
    3: "Q3 — July to September",
    4: "Q4 — October to December",
  };
  return ([1, 2, 3, 4] as const).map((q) => ({
    quarter: q,
    label: labels[q],
    posts: buckets[q],
  }));
}

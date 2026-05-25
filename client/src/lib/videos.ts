/**
 * Static videos registry — companion to `lib/blog.ts`.
 *
 * Each entry represents a YouTube video produced for the Rapid Hire Solutions
 * faceless channel (see `reports/youtube-faceless-channel-playbook.md`).
 * Videos surface in three places:
 *   1. The `/learn` hub at the top of the page.
 *   2. As an inline `<BlogPostVideoCta />` callout above the body of any
 *      blog post whose slug appears in a video's `blogSlug` field.
 *   3. The internal cross-link from each blog post to its companion video
 *      keeps the two-way mapping in one place — the source of truth lives
 *      on the video, not on the post, so a single edit propagates to both
 *      surfaces. (This is the same discipline as `serviceCatalog.ts`.)
 *
 * Why static modules instead of a database:
 *   - This template ships as a static frontend.
 *   - Content is version-controlled with the rest of the codebase.
 *   - Build-time bundling means zero hydration cost at the edge.
 *   - SEO meta is colocated with the body, so it can never drift.
 *
 * `youtubeId` semantics:
 *   - Production IDs are 11-character YouTube watch-IDs (`/^[A-Za-z0-9_-]{11}$/`).
 *   - Pre-launch placeholders use the sentinel pattern `/^PENDING\d{4}$/`.
 *     Helpers below treat these as "not yet ready" and exclude them from
 *     hub listings + companion-callout renders so a half-published registry
 *     never ships dead embeds. Tests lock both branches.
 *
 * Audit history:
 *   §168 — introduced the registry, the /learn hub, the /subscribe newsletter
 *          page, and the <BlogPostVideoCta /> callout (YouTube readiness suite).
 */

export type VideoEntry = {
  /** URL slug used at /learn/<slug> if we add a detail page later. Stable forever. */
  slug: string;
  /** Human-readable video title. Mirrors the YouTube title for SEO consistency. */
  title: string;
  /**
   * YouTube watch-ID. 11 chars in production; placeholder pattern
   * `PENDING####` is used pre-launch and filtered out by `listReadyVideos()`.
   */
  youtubeId: string;
  /** Duration in `M:SS` or `MM:SS`. Free-form for now; tests pin the regex. */
  duration: string;
  /** ISO publish date (YYYY-MM-DD). Used for sort + dateline. */
  publishedAt: string;
  /**
   * Short marketing-style description rendered on the hub card and as the
   * companion-callout subhead on the matching blog post. ~25 words.
   */
  excerpt: string;
  /** Topical tags. Lowercase, kebab-case. First tag becomes the eyebrow. */
  tags: readonly string[];
  /**
   * Slug of a blog post in `lib/blog.ts` whose `<BlogPostVideoCta />` should
   * render this video. Optional — videos without a companion post still
   * appear on `/learn` but skip the inline blog callout.
   */
  blogSlug?: string;
};

/**
 * Sentinel: `youtubeId` values matching `/^PENDING\d{4}$/` are scaffolded
 * placeholders that still need a real video uploaded before launch. We
 * define the regex once so consumers + tests share the same truth.
 */
export const PENDING_YOUTUBE_ID_PATTERN = /^PENDING\d{4}$/;

/**
 * Production YouTube IDs are exactly 11 characters drawn from the
 * URL-safe alphabet. We pin this in tests so a typo in the registry
 * (e.g. a missing character or a stray space) fails CI loudly.
 */
export const PRODUCTION_YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/**
 * Duration must be `M:SS` or `MM:SS`. Pinned for visual consistency on the
 * hub card duration chip — three-digit minutes would overflow.
 */
export const DURATION_PATTERN = /^(?:\d|[1-5]\d):[0-5]\d$/;

const ALL_VIDEOS: readonly VideoEntry[] = Object.freeze([
  {
    slug: "fcra-compliance-4-minute-explainer",
    title:
      "FCRA compliance for hiring teams in 4 minutes: §604(b), §604(b)(3), and the pre-adverse clock",
    youtubeId: "PENDING0001",
    duration: "4:12",
    publishedAt: "2026-05-25",
    excerpt:
      "The four-minute version of our FCRA compliance guide — what §604(b) requires, where the §604(b)(3) pre-adverse clock starts, and the two errors that drive most class actions.",
    tags: ["fcra", "compliance"],
    blogSlug: "fcra-compliance-guide",
  },
  {
    slug: "k12-compliance-guide-overview",
    title:
      "K-12 background checks: the five compliance layers most districts run wrong",
    youtubeId: "PENDING0002",
    duration: "5:38",
    publishedAt: "2026-05-26",
    excerpt:
      "A district-HR walkthrough of the five compliance layers — state statute, federal floor, license-renewal cadence, volunteer scope, and FCRA — that ride on top of every K-12 hire.",
    tags: ["k12-education", "compliance"],
    blogSlug: "k12-school-employee-background-check-requirements",
  },
  {
    slug: "ban-the-box-fair-chance-explainer",
    title:
      "Ban the Box and Fair Chance hiring: a 4-minute employer guide",
    youtubeId: "PENDING0003",
    duration: "4:01",
    publishedAt: "2026-05-27",
    excerpt:
      "What 'ban the box' actually requires, where the federal Fair Chance Act ends and state law begins, and how to run an individualized assessment that holds up under EEOC review.",
    tags: ["ban-the-box", "fair-chance", "compliance"],
    blogSlug: "ban-the-box-fair-chance-hiring",
  },
]);

/**
 * Return every registered video, including pre-launch placeholders, sorted
 * newest-first. Useful for tests and for the studio dashboard surface.
 */
export function listAllVideos(): VideoEntry[] {
  return [...ALL_VIDEOS].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}

/**
 * Return only videos whose `youtubeId` is a real production ID — placeholders
 * are filtered out so half-published entries never ship dead embeds. This is
 * the helper the public-facing /learn hub and the BlogPostVideoCta consume.
 */
export function listReadyVideos(): VideoEntry[] {
  return listAllVideos().filter((v) => isReadyVideo(v));
}

/**
 * Predicate: is this video ready to render on the public site? A video is
 * considered ready when its `youtubeId` matches the production ID pattern.
 * Placeholders matching `PENDING####` always fail.
 */
export function isReadyVideo(video: VideoEntry): boolean {
  return (
    PRODUCTION_YOUTUBE_ID_PATTERN.test(video.youtubeId) &&
    !PENDING_YOUTUBE_ID_PATTERN.test(video.youtubeId)
  );
}

/**
 * Return the (single) ready video that companions a given blog slug, or
 * `undefined` if none. Called from `<BlogPostVideoCta />`. We intentionally
 * return only one — the callout above the body should not be a list.
 */
export function getCompanionVideoForBlog(
  blogSlug: string,
): VideoEntry | undefined {
  return listReadyVideos().find((v) => v.blogSlug === blogSlug);
}

/**
 * Return every video tagged with `tag`. Tag matching is exact and
 * case-sensitive — tags are guaranteed lower-kebab-case by the registry
 * test suite.
 */
export function listReadyVideosByTag(tag: string): VideoEntry[] {
  return listReadyVideos().filter((v) => v.tags.includes(tag));
}

/**
 * Return every distinct tag across ready videos, alphabetically sorted.
 * Used to power the filter pills on /learn.
 */
export function getAllReadyVideoTags(): string[] {
  const set = new Set<string>();
  for (const v of listReadyVideos()) {
    for (const t of v.tags) set.add(t);
  }
  return Array.from(set).sort();
}

/**
 * Render a tag in human-readable form.
 * Example: "fair-chance" -> "Fair Chance".
 */
export function formatVideoTag(tag: string): string {
  return tag
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/**
 * YouTube canonical thumbnail URL for a given video. We use `hqdefault.jpg`
 * (480x360) because it's served behind a CDN edge cache and exists for
 * every public video — `maxresdefault.jpg` doesn't always.
 */
export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/**
 * YouTube canonical watch URL. Used for the "Open on YouTube" affordance.
 */
export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/**
 * YouTube embed URL with privacy-enhanced mode. Used by the lite facade.
 * `enablejsapi=0` keeps the iframe from registering postMessage handlers
 * we don't need, and `rel=0` keeps related-video suggestions from leading
 * users away to a competitor's video.
 */
export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;
}

/*
  §168 — videos registry invariants.

  Locks the structural shape of the videos registry:
    - every entry has a unique slug
    - every entry has a unique youtubeId
    - every youtubeId matches either the production pattern (11 url-safe
      chars) or the sentinel pre-launch pattern (PENDING\d{4})
    - duration matches the M:SS / MM:SS regex
    - publishedAt is a valid YYYY-MM-DD ISO date
    - tags are lower-kebab-case
    - blogSlug, when set, points to a real post in lib/blog.ts
    - listReadyVideos() filters out PENDING ids
    - getCompanionVideoForBlog() returns at most one video per slug
    - the public-facing helpers (thumbnail / watch / embed) compose URLs
      from the youtubeId without leaking placeholder ids

  These invariants ride the same discipline as blog.ts and serviceCatalog.ts:
  the registry is the source of truth, helpers are pure, and a typo in
  any entry fails CI before the page ever loads.
*/
import { describe, it, expect } from "vitest";
import { listPosts } from "./blog";
import {
  DURATION_PATTERN,
  PENDING_YOUTUBE_ID_PATTERN,
  PRODUCTION_YOUTUBE_ID_PATTERN,
  formatVideoTag,
  getAllReadyVideoTags,
  getCompanionVideoForBlog,
  isReadyVideo,
  listAllVideos,
  listReadyVideos,
  listReadyVideosByTag,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
} from "./videos";

describe("§168 — videos registry shape", () => {
  it("listAllVideos() returns at least one entry", () => {
    expect(listAllVideos().length).toBeGreaterThan(0);
  });

  it("every entry has a unique slug", () => {
    const slugs = listAllVideos().map((v) => v.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every entry has a unique youtubeId", () => {
    const ids = listAllVideos().map((v) => v.youtubeId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every slug is lower-kebab-case", () => {
    for (const v of listAllVideos()) {
      expect(v.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("every youtubeId is either an 11-char production id or a PENDING#### placeholder", () => {
    for (const v of listAllVideos()) {
      const ok =
        PRODUCTION_YOUTUBE_ID_PATTERN.test(v.youtubeId) ||
        PENDING_YOUTUBE_ID_PATTERN.test(v.youtubeId);
      expect(ok, `bad id: ${v.slug} -> "${v.youtubeId}"`).toBe(true);
    }
  });

  it("every duration matches M:SS or MM:SS", () => {
    for (const v of listAllVideos()) {
      expect(v.duration).toMatch(DURATION_PATTERN);
    }
  });

  it("every publishedAt is a valid YYYY-MM-DD ISO date", () => {
    for (const v of listAllVideos()) {
      expect(v.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const d = new Date(`${v.publishedAt}T00:00:00Z`);
      expect(Number.isNaN(d.getTime())).toBe(false);
    }
  });

  it("every tag is lower-kebab-case", () => {
    for (const v of listAllVideos()) {
      for (const t of v.tags) {
        expect(t).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    }
  });

  it("title and excerpt are non-empty trimmed strings", () => {
    for (const v of listAllVideos()) {
      expect(v.title.trim()).toBe(v.title);
      expect(v.excerpt.trim()).toBe(v.excerpt);
      expect(v.title.length).toBeGreaterThan(10);
      expect(v.excerpt.length).toBeGreaterThan(20);
    }
  });

  it("when blogSlug is set, it points to a real post in lib/blog.ts", () => {
    const knownSlugs = new Set(listPosts().map((p) => p.slug));
    for (const v of listAllVideos()) {
      if (v.blogSlug) {
        expect(
          knownSlugs.has(v.blogSlug),
          `Video ${v.slug} references unknown blog slug ${v.blogSlug}`,
        ).toBe(true);
      }
    }
  });
});

describe("§168 — listReadyVideos() filters out placeholders", () => {
  it("excludes every PENDING#### id", () => {
    for (const v of listReadyVideos()) {
      expect(PENDING_YOUTUBE_ID_PATTERN.test(v.youtubeId)).toBe(false);
    }
  });

  it("includes only production-pattern ids", () => {
    for (const v of listReadyVideos()) {
      expect(PRODUCTION_YOUTUBE_ID_PATTERN.test(v.youtubeId)).toBe(true);
    }
  });

  it("isReadyVideo() returns false for a placeholder", () => {
    expect(
      isReadyVideo({
        slug: "x",
        title: "t",
        youtubeId: "PENDING0001",
        duration: "1:00",
        publishedAt: "2026-05-25",
        excerpt: "x".repeat(40),
        tags: ["x"],
      }),
    ).toBe(false);
  });

  it("isReadyVideo() returns true for an 11-char production id", () => {
    expect(
      isReadyVideo({
        slug: "x",
        title: "t",
        youtubeId: "dQw4w9WgXcQ",
        duration: "1:00",
        publishedAt: "2026-05-25",
        excerpt: "x".repeat(40),
        tags: ["x"],
      }),
    ).toBe(true);
  });

  it("listReadyVideos() returns entries sorted newest-first", () => {
    const list = listReadyVideos();
    for (let i = 1; i < list.length; i++) {
      expect(list[i - 1].publishedAt >= list[i].publishedAt).toBe(true);
    }
  });
});

describe("§168 — companion lookup", () => {
  it("getCompanionVideoForBlog returns undefined when no video targets the slug", () => {
    expect(getCompanionVideoForBlog("__definitely-not-a-real-slug__")).toBeUndefined();
  });

  it("getCompanionVideoForBlog never returns a placeholder video", () => {
    const slugsTargeted = new Set(
      listAllVideos()
        .filter((v) => v.blogSlug)
        .map((v) => v.blogSlug as string),
    );
    for (const blogSlug of slugsTargeted) {
      const v = getCompanionVideoForBlog(blogSlug);
      // Either undefined (placeholder filtered) or a real id.
      if (v) {
        expect(PRODUCTION_YOUTUBE_ID_PATTERN.test(v.youtubeId)).toBe(true);
      }
    }
  });

  it("at most one ready video may target a given blog slug (companion is singular)", () => {
    const counts = new Map<string, number>();
    for (const v of listReadyVideos()) {
      if (v.blogSlug) counts.set(v.blogSlug, (counts.get(v.blogSlug) ?? 0) + 1);
    }
    for (const [slug, count] of counts) {
      expect(count, `multiple companion videos target ${slug}`).toBeLessThanOrEqual(1);
    }
  });
});

describe("§168 — tag helpers", () => {
  it("getAllReadyVideoTags() returns a sorted, deduped, lower-kebab-case list", () => {
    const tags = getAllReadyVideoTags();
    const sorted = [...tags].sort();
    expect(tags).toEqual(sorted);
    expect(new Set(tags).size).toBe(tags.length);
    for (const t of tags) expect(t).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("listReadyVideosByTag() returns videos that include the tag", () => {
    for (const t of getAllReadyVideoTags()) {
      const subset = listReadyVideosByTag(t);
      for (const v of subset) expect(v.tags).toContain(t);
    }
  });

  it("formatVideoTag() title-cases each kebab segment", () => {
    expect(formatVideoTag("fair-chance")).toBe("Fair Chance");
    expect(formatVideoTag("k12-education")).toBe("K12 Education");
    expect(formatVideoTag("fcra")).toBe("Fcra");
  });
});

describe("§168 — URL helpers compose deterministically", () => {
  it("youtubeThumbnailUrl points at the canonical hqdefault asset", () => {
    expect(youtubeThumbnailUrl("dQw4w9WgXcQ")).toBe(
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    );
  });

  it("youtubeWatchUrl points at the canonical watch URL", () => {
    expect(youtubeWatchUrl("dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
  });

  it("youtubeEmbedUrl uses the privacy-enhanced host with rel=0 + modestbranding=1", () => {
    const u = youtubeEmbedUrl("dQw4w9WgXcQ");
    expect(u).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ\?/);
    expect(u).toContain("rel=0");
    expect(u).toContain("modestbranding=1");
  });
});

describe("§168 — sentinel patterns are stable contracts", () => {
  it("PENDING#### sentinel matches exactly four trailing digits", () => {
    expect(PENDING_YOUTUBE_ID_PATTERN.test("PENDING0001")).toBe(true);
    expect(PENDING_YOUTUBE_ID_PATTERN.test("PENDING9999")).toBe(true);
    expect(PENDING_YOUTUBE_ID_PATTERN.test("PENDING1")).toBe(false);
    expect(PENDING_YOUTUBE_ID_PATTERN.test("pending0001")).toBe(false);
    expect(PENDING_YOUTUBE_ID_PATTERN.test("PENDING00001")).toBe(false);
  });

  it("production pattern is exactly an 11-char url-safe charset test (length + alphabet)", () => {
    // Note: this regex is intentionally permissive — it only verifies that
    // an id has the *shape* of a YouTube video id. Discrimination between
    // a real id and a PENDING placeholder is the job of isReadyVideo() /
    // PENDING_YOUTUBE_ID_PATTERN. Locking that here keeps the contract honest.
    expect(PRODUCTION_YOUTUBE_ID_PATTERN.test("dQw4w9WgXcQ")).toBe(true);
    expect(PRODUCTION_YOUTUBE_ID_PATTERN.test("a-_BcDeFGHI")).toBe(true);
    expect(PRODUCTION_YOUTUBE_ID_PATTERN.test("short")).toBe(false);
    expect(PRODUCTION_YOUTUBE_ID_PATTERN.test("dQw4w9WgXcQ_")).toBe(false);
    // PENDING#### happens to also be 11 url-safe chars — the production
    // pattern matches by design. The PENDING pattern + isReadyVideo() is
    // what filters it out of the rendered surface.
    expect(PRODUCTION_YOUTUBE_ID_PATTERN.test("PENDING0001")).toBe(true);
    expect(isReadyVideo({
      slug: "x",
      title: "t",
      youtubeId: "PENDING0001",
      duration: "1:00",
      publishedAt: "2026-05-25",
      excerpt: "x".repeat(40),
      tags: ["x"],
    })).toBe(false);
  });

  it("DURATION_PATTERN accepts M:SS / MM:SS only (no 60+ seconds, no triple-digit minutes)", () => {
    expect(DURATION_PATTERN.test("4:12")).toBe(true);
    expect(DURATION_PATTERN.test("12:00")).toBe(true);
    expect(DURATION_PATTERN.test("59:59")).toBe(true);
    expect(DURATION_PATTERN.test("4:60")).toBe(false);
    expect(DURATION_PATTERN.test("60:00")).toBe(false);
    expect(DURATION_PATTERN.test("100:00")).toBe(false);
    expect(DURATION_PATTERN.test("4:1")).toBe(false);
  });
});

/*
  Spec for the /blog/index.json feed builder. The same `buildBlogIndexFeed`
  helper is used by the dev plugin (vite.config.ts) and the production
  Express server (server/index.ts via a mirrored copy), so this test locks
  in the behavior they both depend on.

  Truth source: the feed is built from `shared/blog-meta.json` (slug +
  lastmod) joined with `shared/blog-og.json` (slug + title + primary tag),
  so the test asserts shape, parity with the registry, and stable
  ordering.
*/
import { describe, it, expect } from "vitest";
import { buildBlogIndexFeed } from "../../../vite.config";
import { listPosts } from "./blog";

describe("buildBlogIndexFeed", () => {
  const feed = buildBlogIndexFeed();

  it("returns the canonical envelope", () => {
    expect(feed).toMatchObject({
      count: expect.any(Number),
      posts: expect.any(Array),
      generatedAt: expect.any(String),
    });
    // ISO-8601 generation timestamp
    expect(Number.isFinite(Date.parse(feed.generatedAt))).toBe(true);
  });

  it("matches the post-registry size", () => {
    expect(feed.count).toBe(feed.posts.length);
    expect(feed.count).toBe(listPosts().length);
  });

  it("emits the documented entry shape for every post", () => {
    for (const p of feed.posts) {
      expect(typeof p.slug).toBe("string");
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(typeof p.title).toBe("string");
      expect(p.title.length).toBeGreaterThan(0);
      expect(typeof p.tag).toBe("string");
      expect(p.tag).toMatch(/^[a-z0-9-]+$/);
      expect(p.url).toBe(`/blog/${p.slug}`);
      // lastmod is YYYY-MM-DD, sourced from blog-meta.json
      expect(p.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("sorts posts newest-first by lastmod, with slug as a stable tiebreaker", () => {
    for (let i = 1; i < feed.posts.length; i++) {
      const a = feed.posts[i - 1];
      const b = feed.posts[i];
      if (a.lastmod !== b.lastmod) {
        expect(a.lastmod >= b.lastmod).toBe(true);
      } else {
        expect(a.slug.localeCompare(b.slug)).toBeLessThan(0);
      }
    }
  });

  it("contains no duplicate slugs", () => {
    const slugs = new Set(feed.posts.map((p) => p.slug));
    expect(slugs.size).toBe(feed.posts.length);
  });
});

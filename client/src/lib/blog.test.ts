/**
 * Tests for the static blog content registry.
 *
 * Coverage strategy:
 *   1. Registry shape — every post has the required fields, slugs are unique
 *      and URL-safe, dates are ISO-formatted, tags are kebab-case.
 *   2. Sort + lookup helpers — `listPosts` returns newest-first, `getPostBySlug`
 *      returns and refuses correctly, `relatedPosts` excludes the current slug.
 *   3. Content quality — every post is roughly within the requested ~700-word
 *      band, has a reasonable meta description length, and uses internal links
 *      that point to real site routes (not 404s).
 *   4. Date formatting — `formatPublishedDate` is timezone-stable.
 */
import { describe, expect, it } from "vitest";
import {
  formatPublishedDate,
  getPostBySlug,
  listPosts,
  relatedPosts,
} from "./blog";

const VALID_INTERNAL_PREFIXES = [
  "/services",
  "/pricing",
  "/contact",
  "/about",
  "/integrations",
  "/industries",
  "/resources",
  "/customers",
  "/candidates",
  "/sample-report",
  "/compliance",
  "/blog/",
];

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

describe("listPosts", () => {
  const posts = listPosts();

  it("returns exactly sixty-eight posts", () => {
    expect(posts).toHaveLength(68);
  });

  it("is sorted newest-first by publishedAt", () => {
    const dates = posts.map((p) => p.publishedAt);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("has unique slugs", () => {
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses URL-safe lower-kebab-case slugs", () => {
    for (const p of posts) {
      expect(p.slug, p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("uses ISO YYYY-MM-DD publishedAt dates", () => {
    for (const p of posts) {
      expect(p.publishedAt, p.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // Not in the future.
      expect(new Date(p.publishedAt).getTime()).toBeLessThanOrEqual(
        Date.now() + 24 * 60 * 60 * 1000,
      );
    }
  });

  it("uses lowercase kebab-case tags", () => {
    for (const p of posts) {
      expect(p.tags.length).toBeGreaterThan(0);
      for (const t of p.tags) {
        expect(t, `${p.slug}: ${t}`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      }
    }
  });

  it("populates required marketing fields on every post", () => {
    for (const p of posts) {
      expect(p.title.length, p.slug).toBeGreaterThan(20);
      expect(p.excerpt.length, p.slug).toBeGreaterThan(40);
      expect(p.author.length, p.slug).toBeGreaterThan(0);
      expect(p.readingMinutes, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.readingMinutes, p.slug).toBeLessThanOrEqual(15);
    }
  });
});

describe("post content quality", () => {
  const posts = listPosts();

  it("every post body is within the ~700-word target band (550-900 words)", () => {
    for (const p of posts) {
      const wc = wordCount(p.body);
      expect(wc, `${p.slug}: ${wc} words`).toBeGreaterThanOrEqual(550);
      expect(wc, `${p.slug}: ${wc} words`).toBeLessThanOrEqual(900);
    }
  });

  it("every post has a SERP-friendly meta description (120-180 chars)", () => {
    for (const p of posts) {
      const len = p.metaDescription.length;
      expect(len, `${p.slug}: ${len} chars`).toBeGreaterThanOrEqual(120);
      expect(len, `${p.slug}: ${len} chars`).toBeLessThanOrEqual(180);
    }
  });

  it("every post has at least one H2 in the body for scannability + SEO", () => {
    for (const p of posts) {
      expect(p.body, p.slug).toMatch(/^## /m);
    }
  });

  it("internal links point to real site routes", () => {
    const linkRe = /\[[^\]]+\]\((\/[^)]+)\)/g;
    for (const p of posts) {
      let m: RegExpExecArray | null;
      while ((m = linkRe.exec(p.body)) !== null) {
        const href = m[1];
        const isValid = VALID_INTERNAL_PREFIXES.some(
          (prefix) => href === prefix || href.startsWith(prefix),
        );
        expect(isValid, `${p.slug}: bad internal link ${href}`).toBe(true);
      }
    }
  });

  it("metaTitle, when set, stays under 60 characters for SERP", () => {
    for (const p of posts) {
      if (p.metaTitle) {
        expect(p.metaTitle.length, `${p.slug}: ${p.metaTitle}`).toBeLessThanOrEqual(60);
      }
    }
  });
});

describe("getPostBySlug", () => {
  it("returns the post with the matching slug", () => {
    const post = getPostBySlug("fcra-compliance-guide");
    expect(post).toBeDefined();
    expect(post?.title).toContain("FCRA");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPostBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("relatedPosts", () => {
  it("excludes the current slug", () => {
    const slug = listPosts()[0].slug;
    const rel = relatedPosts(slug);
    expect(rel.find((p) => p.slug === slug)).toBeUndefined();
  });

  it("returns at most n posts", () => {
    expect(relatedPosts("fcra-compliance-guide", 2)).toHaveLength(2);
    expect(relatedPosts("fcra-compliance-guide", 10)).toHaveLength(10);
  });
});

describe("formatPublishedDate", () => {
  it("renders a long-form English dateline in UTC", () => {
    expect(formatPublishedDate("2026-05-12")).toBe("May 12, 2026");
    expect(formatPublishedDate("2026-01-01")).toBe("January 1, 2026");
  });

  it("is timezone-stable across local TZ shifts", () => {
    // The helper parses the date as UTC midnight, so it must always render
    // the same dateline regardless of the test runner's local timezone.
    expect(formatPublishedDate("2026-12-31")).toBe("December 31, 2026");
  });
});

// ---------------------------------------------------------------------------
// shared/blog-meta.json (consumed by the sitemap.xml generator in vite.config.ts)
// must stay perfectly in sync with the runtime registry. Adding a post or
// renaming a tag without updating the JSON would silently break SEO crawling,
// so we fail CI loudly when they diverge.
// ---------------------------------------------------------------------------
import meta from "../../../shared/blog-meta.json";
import { getAllTags, formatTag, listPostsByTag } from "./blog";

describe("shared/blog-meta.json sync", () => {
  it("includes every runtime slug and matches publishedAt as lastmod", () => {
    const runtime = listPosts();
    const metaSlugs = (meta.posts as { slug: string; lastmod: string }[]).map(
      (p) => p.slug,
    );
    const runtimeSlugs = runtime.map((p) => p.slug);
    expect(new Set(metaSlugs)).toEqual(new Set(runtimeSlugs));

    const lastmodBySlug = new Map(
      (meta.posts as { slug: string; lastmod: string }[]).map((p) => [
        p.slug,
        p.lastmod,
      ]),
    );
    for (const p of runtime) {
      expect(lastmodBySlug.get(p.slug), p.slug).toBe(p.publishedAt);
    }
  });

  it("includes the exact set of tags exposed by the runtime registry", () => {
    expect(new Set(meta.tags as string[])).toEqual(new Set(getAllTags()));
  });
});

// ---------------------------------------------------------------------------
// shared/blog-og.json (consumed by the dynamic /api/og/blog/:slug.svg endpoint
// in vite.config.ts and server/index.ts) must stay in sync with the runtime
// registry. Mismatch = the social card shows the wrong title for crawlers, a
// silent SEO regression. We assert slug coverage, exact title match, and that
// the chosen `tag` is one the post actually carries.
// ---------------------------------------------------------------------------
import ogMeta from "../../../shared/blog-og.json";

describe("shared/blog-og.json sync", () => {
  type OgPost = { slug: string; title: string; tag: string };
  const ogPosts = (ogMeta.posts as OgPost[]) ?? [];

  it("includes the exact set of runtime slugs", () => {
    const runtime = listPosts();
    expect(new Set(ogPosts.map((p) => p.slug))).toEqual(
      new Set(runtime.map((p) => p.slug)),
    );
  });

  it("matches each post's title exactly", () => {
    const runtime = listPosts();
    const titleBySlug = new Map(runtime.map((p) => [p.slug, p.title]));
    for (const og of ogPosts) {
      expect(og.title, og.slug).toBe(titleBySlug.get(og.slug));
    }
  });

  it("chooses a tag that the post actually carries", () => {
    const runtime = listPosts();
    const tagsBySlug = new Map(runtime.map((p) => [p.slug, p.tags]));
    for (const og of ogPosts) {
      const carried = tagsBySlug.get(og.slug) ?? [];
      expect(carried, og.slug).toContain(og.tag);
    }
  });
});

describe("tag helpers", () => {
  it("getAllTags returns lower-kebab-case tags, sorted", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(5);
    const sorted = [...tags].sort();
    expect(tags).toEqual(sorted);
    for (const t of tags) expect(t).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("listPostsByTag returns only posts that include the tag", () => {
    for (const t of getAllTags()) {
      const matches = listPostsByTag(t);
      expect(matches.length).toBeGreaterThan(0);
      for (const p of matches) expect(p.tags).toContain(t);
    }
  });

  it("listPostsByTag returns [] for an unknown tag", () => {
    expect(listPostsByTag("does-not-exist")).toEqual([]);
  });

  it("formatTag turns kebab-case into Title Case", () => {
    expect(formatTag("fair-chance")).toBe("Fair Chance");
    expect(formatTag("dot")).toBe("Dot");
    expect(formatTag("ban-the-box")).toBe("Ban The Box");
  });
});

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
  "/blog/",
];

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

describe("listPosts", () => {
  const posts = listPosts();

  it("returns exactly six posts", () => {
    expect(posts).toHaveLength(6);
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
    expect(relatedPosts("fcra-compliance-guide", 10)).toHaveLength(5);
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

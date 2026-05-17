import { describe, expect, it } from "vitest";
import {
  groupPostsByQuarter,
  isRecentlyUpdated,
  listPostYears,
  listPostsByYear,
  getPostLastmod,
  listPosts,
} from "./blog";

describe("blog year-archive helpers", () => {
  it("listPostYears returns the set of publish years sorted newest-first", () => {
    const years = listPostYears();
    expect(years.length).toBeGreaterThan(0);
    // Sorted descending.
    for (let i = 0; i < years.length - 1; i++) {
      expect(years[i]).toBeGreaterThan(years[i + 1]);
    }
    // Years are 4-digit numbers.
    for (const y of years) {
      expect(y).toBeGreaterThanOrEqual(2020);
      expect(y).toBeLessThanOrEqual(2030);
    }
  });

  it("listPostsByYear filters posts by their publishedAt year prefix", () => {
    const allYears = listPostYears();
    let total = 0;
    for (const y of allYears) {
      const inYear = listPostsByYear(y);
      for (const p of inYear) {
        expect(p.publishedAt.startsWith(`${y}-`)).toBe(true);
      }
      total += inYear.length;
    }
    expect(total).toBe(listPosts().length);
  });

  it("groupPostsByQuarter buckets posts into Q1..Q4 by month", () => {
    const allYears = listPostYears();
    if (allYears.length === 0) return;
    const recent = listPostsByYear(allYears[0]);
    const groups = groupPostsByQuarter(recent);
    expect(groups.map((g) => g.quarter)).toEqual([1, 2, 3, 4]);
    let count = 0;
    for (const g of groups) {
      for (const p of g.posts) {
        const m = Number(p.publishedAt.slice(5, 7));
        const q = Math.ceil(m / 3);
        expect(q).toBe(g.quarter);
      }
      count += g.posts.length;
    }
    expect(count).toBe(recent.length);
  });

  it("getPostLastmod returns a valid ISO date for every post", () => {
    for (const p of listPosts()) {
      const lm = getPostLastmod(p.slug);
      expect(/^\d{4}-\d{2}-\d{2}$/.test(lm)).toBe(true);
    }
  });

  it("isRecentlyUpdated honors the dayThreshold argument", () => {
    const posts = listPosts();
    // With a 9999-day threshold, no post can qualify.
    for (const p of posts) {
      expect(isRecentlyUpdated(p, 9999)).toBe(false);
    }
    // With a 0-day threshold, any post whose lastmod !== publishedAt qualifies.
    let qualifies = 0;
    for (const p of posts) {
      const lm = getPostLastmod(p.slug);
      if (lm && lm !== p.publishedAt) qualifies++;
    }
    let actual = 0;
    for (const p of posts) {
      if (isRecentlyUpdated(p, 0)) actual++;
    }
    expect(actual).toBe(qualifies);
  });
});

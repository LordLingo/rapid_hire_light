/*
  §197 — BlogPost.tsx hook-ordering invariant.

  THE BUG: BlogPost.tsx used to early-return `<NotFound />` the moment
  `getPostBySlug(slug)` returned undefined, and ONLY THEN call useSeo()
  and useMemo(). That is a Rules-of-Hooks violation: when a user navigates
  client-side from a valid post to a missing slug — or when a Vercel route-
  stub / hydration mismatch leaves `post` momentarily undefined on the first
  client render — the number of hooks React sees changes between renders.
  React throws "Rendered fewer hooks than expected. This may be caused by an
  accidental early return statement." and blanks the whole subtree. A hard
  refresh masked it by remounting the component fresh (which is exactly the
  symptom reported: "blank white page on blog-card click, fixed by refresh").

  THE FIX: every hook (useRoute, useSeo, two useMemos) must run
  unconditionally on every render. The `if (!post) return <NotFound />`
  guard must sit AFTER all of them, gating only the returned JSX.

  These are source-text pins (the component pulls in SiteShell and the whole
  site shell, so a full render here would be heavy and brittle). They lock
  the ordering so a future refactor can't silently reintroduce the early
  return above the hooks.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const BLOG_POST_PATH = resolve(__dirname, "..", "pages", "BlogPost.tsx");
const SRC = readFileSync(BLOG_POST_PATH, "utf8");

describe("§197 — BlogPost hooks run before any early return", () => {
  it("calls useSeo before the `if (!post) return <NotFound />` guard", () => {
    const seoIdx = SRC.indexOf("useSeo(");
    const guardIdx = SRC.indexOf("return <NotFound />");
    expect(seoIdx).toBeGreaterThan(-1);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(seoIdx).toBeLessThan(guardIdx);
  });

  it("calls every useMemo before the `if (!post)` guard", () => {
    const guardIdx = SRC.indexOf("if (!post)");
    expect(guardIdx).toBeGreaterThan(-1);
    // Collect every useMemo offset and assert each precedes the guard.
    const memoOffsets: number[] = [];
    const re = /useMemo\(/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(SRC)) !== null) memoOffsets.push(m.index);
    expect(memoOffsets.length).toBeGreaterThanOrEqual(2);
    for (const off of memoOffsets) expect(off).toBeLessThan(guardIdx);
  });

  it("has exactly one early return for the missing-post case, and it sits after the hooks", () => {
    // Exactly one NotFound bail-out (no stray early return reintroduced).
    const matches = SRC.match(/return <NotFound \/>/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("derives hook inputs defensively so the hooks never assume post exists", () => {
    // post may be undefined at hook-call time — these reads must be optional.
    expect(SRC).toMatch(/post\?\.cover/);
    expect(SRC).toMatch(/getHeadings\(post\?\.body \?\? ""\)/);
    // useSeo title falls back when post is missing rather than throwing.
    expect(SRC).toMatch(/post \? \(post\.metaTitle \?\? post\.title\) : "Article not found"/);
  });

  it("documents the §197 root cause inline so the ordering isn't 'cleaned up' later", () => {
    expect(SRC).toMatch(/§197/);
    expect(SRC).toMatch(/Rules of Hooks/);
  });
});

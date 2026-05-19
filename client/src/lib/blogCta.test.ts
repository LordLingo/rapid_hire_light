/**
 * §150 — universal blog CTA framework.
 *
 * Locks the archetype catalog, the tag/slug matcher priority, and the
 * Contact-URL builder so future contributors can't silently change the
 * conversion contract. Also pins the BlogPostCta component source to
 * keep its testids, archetype attribution, and Wouter integration stable.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BLOG_CTA_ARCHETYPES_BY_ID,
  CTA_ARCHETYPES,
  CTA_MATCH_PRIORITY,
  CTA_SLUG_TRIGGERS,
  CTA_TAG_TRIGGERS,
  buildBlogCtaContactUrl,
  matchArchetype,
  type BlogCtaArchetypeId,
} from "./blogCta";
import { listPosts, type BlogPost } from "./blog";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");

function readSource(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function postFixture(tags: string[], slug = "fixture-slug", title = "Fixture title"): Pick<BlogPost, "slug" | "tags" | "title"> {
  return { slug, tags, title };
}

describe("CTA_ARCHETYPES catalog", () => {
  it("ships exactly the canonical 6 archetype ids", () => {
    const ids = CTA_ARCHETYPES.map((a) => a.id).sort();
    expect(ids).toEqual([
      "default",
      "dot",
      "healthcare",
      "k12",
      "pricing-cost",
      "switching-rfp",
    ]);
  });

  it("has unique archetype ids", () => {
    const ids = CTA_ARCHETYPES.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every archetype has eyebrow + headline + primary action", () => {
    for (const a of CTA_ARCHETYPES) {
      expect(a.eyebrow).toMatch(/^[A-Za-z0-9 \-&'?]+$/);
      expect(a.headline.length).toBeGreaterThan(8);
      expect(a.headline.length).toBeLessThan(80);
      expect(a.primary).toBeDefined();
      expect(a.primary.label.length).toBeGreaterThan(4);
      expect(typeof a.primary.hrefBuilder).toBe("function");
      expect(a.contactSubject.length).toBeGreaterThan(8);
    }
  });

  it("default archetype carries a secondary CTA (the pricing estimator)", () => {
    const def = BLOG_CTA_ARCHETYPES_BY_ID.default;
    expect(def.secondary).toBeDefined();
    expect(def.secondary?.href).toBe("/pricing#estimate");
    expect(def.secondary?.label.toLowerCase()).toContain("estimator");
  });

  it("pricing-cost archetype routes its primary to /pricing#estimate, not /contact", () => {
    const a = BLOG_CTA_ARCHETYPES_BY_ID["pricing-cost"];
    const href = a.primary.hrefBuilder(
      postFixture(["pricing"], "what-is-the-cost-of-a-background-check"),
      "pricing-cost"
    );
    expect(href).toBe("/pricing#estimate");
  });

  it("BLOG_CTA_ARCHETYPES_BY_ID index has all 6 keys", () => {
    const keys = Object.keys(BLOG_CTA_ARCHETYPES_BY_ID).sort();
    expect(keys).toEqual([
      "default",
      "dot",
      "healthcare",
      "k12",
      "pricing-cost",
      "switching-rfp",
    ]);
  });
});

describe("CTA_MATCH_PRIORITY", () => {
  it("is ordered most-specialized first, default omitted", () => {
    expect(CTA_MATCH_PRIORITY).toEqual([
      "k12",
      "healthcare",
      "dot",
      "switching-rfp",
      "pricing-cost",
    ]);
  });

  it("contains every non-default archetype exactly once", () => {
    const all = CTA_ARCHETYPES.filter((a) => a.id !== "default").map((a) => a.id);
    expect(new Set(CTA_MATCH_PRIORITY)).toEqual(new Set(all));
  });
});

describe("matchArchetype — tag triggers", () => {
  it("matches k12 on k12-education tag", () => {
    expect(matchArchetype(postFixture(["k12-education"])).id).toBe("k12");
  });

  it("matches k12 on fingerprint-checks tag", () => {
    expect(matchArchetype(postFixture(["fingerprint-checks"])).id).toBe("k12");
  });

  it("matches healthcare on healthcare tag", () => {
    expect(matchArchetype(postFixture(["healthcare"])).id).toBe("healthcare");
  });

  it("matches dot on dot tag", () => {
    expect(matchArchetype(postFixture(["dot"])).id).toBe("dot");
  });

  it("matches dot on transportation tag", () => {
    expect(matchArchetype(postFixture(["transportation"])).id).toBe("dot");
  });

  it("matches switching-rfp on comparison tag", () => {
    expect(matchArchetype(postFixture(["comparison"])).id).toBe("switching-rfp");
  });

  it("falls back to default when no trigger tags match", () => {
    expect(matchArchetype(postFixture(["compliance", "fcra"])).id).toBe("default");
  });

  it("is case-insensitive on tag lookup", () => {
    expect(matchArchetype(postFixture(["HEALTHCARE"])).id).toBe("healthcare");
  });
});

describe("matchArchetype — slug/title fallback triggers", () => {
  it("matches healthcare on a healthcare- slug even without the tag", () => {
    expect(
      matchArchetype(postFixture(["compliance"], "healthcare-screening-overview")).id
    ).toBe("healthcare");
  });

  it("matches dot on a dot- slug even without the tag", () => {
    expect(
      matchArchetype(postFixture(["compliance"], "dot-pre-employment-screening")).id
    ).toBe("dot");
  });

  it("matches pricing-cost on a slug containing 'cost'", () => {
    expect(
      matchArchetype(postFixture(["compliance"], "what-is-the-cost-of-a-background-check")).id
    ).toBe("pricing-cost");
  });

  it("matches pricing-cost on a slug containing 'turnaround'", () => {
    expect(
      matchArchetype(postFixture(["operations"], "background-check-turnaround-time-explained")).id
    ).toBe("pricing-cost");
  });

  it("matches switching-rfp on a slug containing 'vs-'", () => {
    expect(matchArchetype(postFixture(["compliance"], "checkr-vs-rapid-hire")).id).toBe(
      "switching-rfp"
    );
  });
});

describe("matchArchetype — priority", () => {
  it("k12 wins over healthcare when both tags present", () => {
    expect(matchArchetype(postFixture(["healthcare", "k12-education"])).id).toBe("k12");
  });

  it("healthcare wins over dot when both tags present", () => {
    expect(matchArchetype(postFixture(["dot", "healthcare"])).id).toBe("healthcare");
  });

  it("dot wins over switching-rfp when both tags present", () => {
    expect(matchArchetype(postFixture(["comparison", "dot"])).id).toBe("dot");
  });

  it("switching-rfp wins over pricing-cost when slug matches both", () => {
    expect(
      matchArchetype(postFixture(["comparison"], "checkr-vs-rapid-hire-cost-comparison")).id
    ).toBe("switching-rfp");
  });

  it("tag trigger wins over slug trigger", () => {
    // Slug says pricing, but the healthcare tag wins.
    expect(
      matchArchetype(postFixture(["healthcare"], "what-is-the-cost-of-healthcare-screening")).id
    ).toBe("healthcare");
  });
});

describe("matchArchetype — real registry coverage", () => {
  const allPosts = listPosts();

  it("covers every non-default archetype with at least one real post", () => {
    const reached = new Set<BlogCtaArchetypeId>();
    for (const p of allPosts) {
      reached.add(matchArchetype(p).id);
    }
    for (const id of CTA_MATCH_PRIORITY) {
      expect(reached.has(id)).toBe(true);
    }
  });

  it("a meaningful majority of posts resolve to the default archetype", () => {
    let defaults = 0;
    for (const p of allPosts) if (matchArchetype(p).id === "default") defaults++;
    // We don't want EVERY post specialized — that defeats the framework.
    expect(defaults).toBeGreaterThan(allPosts.length * 0.25);
  });
});

describe("buildBlogCtaContactUrl", () => {
  it("builds /contact URL with source=blog, archetype, slug, subject for default", () => {
    const url = buildBlogCtaContactUrl(postFixture(["compliance"], "fcra-overview"));
    const u = new URL(url, "https://example.com");
    expect(u.pathname).toBe("/contact");
    expect(u.searchParams.get("source")).toBe("blog");
    expect(u.searchParams.get("archetype")).toBe("default");
    expect(u.searchParams.get("slug")).toBe("fcra-overview");
    expect(u.searchParams.get("subject")).toBe("Quote request from the blog");
  });

  it("uses the matched archetype's contactSubject for healthcare posts", () => {
    const url = buildBlogCtaContactUrl(postFixture(["healthcare"], "oig-exclusion-screening"));
    const u = new URL(url, "https://example.com");
    expect(u.searchParams.get("archetype")).toBe("healthcare");
    expect(u.searchParams.get("subject")).toContain("Healthcare");
  });

  it("respects an explicit archetypeId override", () => {
    const url = buildBlogCtaContactUrl(
      postFixture(["healthcare"], "oig-exclusion-screening"),
      "switching-rfp"
    );
    const u = new URL(url, "https://example.com");
    expect(u.searchParams.get("archetype")).toBe("switching-rfp");
  });

  it("short-circuits to /pricing#estimate for the pricing-cost archetype", () => {
    const url = buildBlogCtaContactUrl(
      postFixture(["operations"], "background-check-cost-explained")
    );
    expect(url).toBe("/pricing#estimate");
  });

  it("URL-encodes slugs and subjects safely", () => {
    const url = buildBlogCtaContactUrl(
      postFixture(["compliance"], "fcra+rule-2024"),
      "default"
    );
    // URLSearchParams encodes "+" as "%2B" and spaces in subject as "+".
    expect(url).toContain("slug=fcra%2Brule-2024");
  });
});

describe("CTA_TAG_TRIGGERS and CTA_SLUG_TRIGGERS shape", () => {
  it("every non-default archetype has a tag-trigger entry (possibly empty for slug-only)", () => {
    for (const id of CTA_MATCH_PRIORITY) {
      expect(CTA_TAG_TRIGGERS[id]).toBeDefined();
      expect(Array.isArray(CTA_TAG_TRIGGERS[id])).toBe(true);
    }
  });

  it("every non-default archetype has a slug-trigger entry", () => {
    for (const id of CTA_MATCH_PRIORITY) {
      expect(CTA_SLUG_TRIGGERS[id]).toBeDefined();
      expect(CTA_SLUG_TRIGGERS[id].length).toBeGreaterThan(0);
    }
  });

  it("trigger tokens are lowercased and kebab-friendly", () => {
    for (const id of CTA_MATCH_PRIORITY) {
      for (const t of CTA_TAG_TRIGGERS[id]) {
        expect(t).toBe(t.toLowerCase());
      }
      for (const s of CTA_SLUG_TRIGGERS[id]) {
        expect(s).toBe(s.toLowerCase());
      }
    }
  });
});

describe("BlogPostCta component source pins", () => {
  const src = readSource("client/src/components/blog/BlogPostCta.tsx");

  it("imports matchArchetype from lib/blogCta", () => {
    expect(src).toMatch(/import\s+\{[^}]*matchArchetype[^}]*\}\s+from\s+["']@\/lib\/blogCta["']/);
  });

  it("renders the canonical testids", () => {
    expect(src).toContain('data-testid="blog-cta"');
    expect(src).toContain('data-testid="blog-cta-eyebrow"');
    expect(src).toContain('data-testid="blog-cta-headline"');
    expect(src).toContain('data-testid="blog-cta-primary"');
    expect(src).toContain('data-testid="blog-cta-secondary"');
  });

  it("stamps data-archetype on the root", () => {
    expect(src).toMatch(/data-archetype=\{archetype\.id\}/);
  });

  it("only renders the secondary CTA when the archetype defines one", () => {
    expect(src).toMatch(/\{archetype\.secondary\s+&&/);
  });

  it("uses Wouter Link for both CTAs", () => {
    expect(src).toMatch(/import\s+\{\s*Link\s*\}\s+from\s+["']wouter["']/);
  });

  it("computes the primary href via archetype.primary.hrefBuilder", () => {
    expect(src).toMatch(/archetype\.primary\.hrefBuilder\(/);
  });
});

describe("BlogPost.tsx mount", () => {
  const src = readSource("client/src/pages/BlogPost.tsx");

  it("imports BlogPostCta from the blog component folder", () => {
    expect(src).toMatch(
      /import\s+\{[^}]*BlogPostCta[^}]*\}\s+from\s+["']@\/components\/blog\/BlogPostCta["']/
    );
  });

  it("mounts <BlogPostCta post={post} /> in the article body", () => {
    expect(src).toMatch(/<BlogPostCta\s+post=\{post\}\s*\/>/);
  });

  it("no longer carries the old hardcoded 'Talk to our team' CTA", () => {
    expect(src).not.toContain("Talk to our team");
    expect(src).not.toContain("Ready to talk through your screening workflow");
  });
});

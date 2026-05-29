/*
  §204 — <BlogPostDemoCta /> contract.

  Locks the component's behavior at the source level + verifies its
  integration with BlogPost.tsx. We don't render the React tree —
  source-pin assertions catch the regressions we actually care about
  (wrong CTA route, wrong button copy, wrong placement in the post
  layout, missing test ids).
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildBlogDemoHref } from "./BlogPostDemoCta";

const ROOT = resolve(__dirname, "..", "..", "..", "..");
const COMP = readFileSync(
  resolve(ROOT, "client/src/components/blog/BlogPostDemoCta.tsx"),
  "utf8",
);
const BLOG_POST = readFileSync(
  resolve(ROOT, "client/src/pages/BlogPost.tsx"),
  "utf8",
);

describe("§204 — BlogPostDemoCta href builder", () => {
  it("routes to the canonical /get-a-quote Formspree-backed quote page", () => {
    const href = buildBlogDemoHref("maryland-jafa-credit-history-employer-guide");
    expect(href.startsWith("/get-a-quote?")).toBe(true);
  });

  it("tags the lead with source=blog-demo-cta for inbox attribution", () => {
    const href = buildBlogDemoHref("any-slug");
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("source")).toBe("blog-demo-cta");
  });

  it("carries the post slug so sales can attribute the lead to the post", () => {
    const href = buildBlogDemoHref("fcra-compliance-guide");
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("slug")).toBe("fcra-compliance-guide");
  });

  it("pre-fills the note field so the inbox shows demo intent immediately", () => {
    const href = buildBlogDemoHref("any-slug");
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("note")).toBe("Interested in a demo");
  });

  it("URL-encodes the note correctly (space → +)", () => {
    const href = buildBlogDemoHref("any-slug");
    // URLSearchParams.toString() encodes spaces as '+'.
    expect(href).toContain("note=Interested+in+a+demo");
  });
});

describe("§204 — BlogPostDemoCta source-pin", () => {
  it("renders an exact 'Request a Demo' button label (high-intent ask)", () => {
    expect(COMP).toMatch(/>\s*Request a Demo\s*</);
  });

  it("exposes stable test ids the regression suite + analytics can target", () => {
    expect(COMP).toMatch(/data-testid="blog-demo-cta"/);
    expect(COMP).toMatch(/data-testid="blog-demo-cta-headline"/);
    expect(COMP).toMatch(/data-testid="blog-demo-cta-primary"/);
    expect(COMP).toMatch(/data-testid="blog-demo-cta-secondary"/);
  });

  it("uses wouter's <Link> for SPA navigation, not a raw <a> with href to /get-a-quote", () => {
    // Should import Link from wouter and use it for the primary CTA so the
    // page transitions reuse the same SPA route the rest of the site uses.
    expect(COMP).toMatch(/import \{ Link \} from "wouter"/);
    expect(COMP).toMatch(/<Link[^>]+data-testid="blog-demo-cta-primary"/s);
  });

  it("preserves the lower-intent quote path as a secondary link to /contact", () => {
    expect(COMP).toMatch(/<Link[^>]+href="\/contact"[^>]+data-testid="blog-demo-cta-secondary"/s);
  });

  it("derives the primary href from buildBlogDemoHref(post.slug) — single source of truth", () => {
    expect(COMP).toMatch(/buildBlogDemoHref\(post\.slug\)/);
  });
});

describe("§204 — BlogPost integration", () => {
  it("BlogPost.tsx imports BlogPostDemoCta", () => {
    expect(BLOG_POST).toMatch(
      /import \{ BlogPostDemoCta \} from "@\/components\/blog\/BlogPostDemoCta"/,
    );
  });

  it("renders <BlogPostDemoCta /> on every post (passes the full post object)", () => {
    expect(BLOG_POST).toMatch(/<BlogPostDemoCta post=\{post\}\s*\/>/);
  });

  it("renders the demo CTA AFTER the archetype CTA so the archetype keeps the primary spot", () => {
    const archetype = BLOG_POST.indexOf("<BlogPostCta post={post}");
    const demo = BLOG_POST.indexOf("<BlogPostDemoCta post={post}");
    expect(archetype).toBeGreaterThan(0);
    expect(demo).toBeGreaterThan(0);
    // Demo CTA must come AFTER the archetype CTA in the source.
    expect(demo).toBeGreaterThan(archetype);
  });

  it("renders the demo CTA BEFORE the related-posts rail (so it's the last in-article ask)", () => {
    const demo = BLOG_POST.indexOf("<BlogPostDemoCta post={post}");
    const related = BLOG_POST.indexOf("{/* Related */}");
    expect(demo).toBeGreaterThan(0);
    expect(related).toBeGreaterThan(0);
    expect(demo).toBeLessThan(related);
  });
});

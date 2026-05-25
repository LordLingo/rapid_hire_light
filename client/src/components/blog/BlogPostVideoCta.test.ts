/*
  §168 — <BlogPostVideoCta /> contract.

  Locks the component's behavior at the source level + verifies its
  integration with BlogPost.tsx. We don't render the React tree —
  source-pin assertions catch the regressions we actually care about
  (wrong helper imported, wrong placement in the post layout, missing
  facade gate, missing test ids).
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  getCompanionVideoForBlog,
  isReadyVideo,
  listAllVideos,
} from "@/lib/videos";

const ROOT = resolve(__dirname, "..", "..", "..", "..");
const COMP = readFileSync(
  resolve(ROOT, "client/src/components/blog/BlogPostVideoCta.tsx"),
  "utf8",
);
const BLOG_POST = readFileSync(
  resolve(ROOT, "client/src/pages/BlogPost.tsx"),
  "utf8",
);

describe("§168 — BlogPostVideoCta source-pin", () => {
  it("imports the companion lookup + URL helpers from @/lib/videos", () => {
    expect(COMP).toMatch(/import \{[^}]*getCompanionVideoForBlog[^}]*\} from "@\/lib\/videos"/s);
    expect(COMP).toMatch(/import \{[^}]*youtubeEmbedUrl[^}]*\} from "@\/lib\/videos"/s);
    expect(COMP).toMatch(/import \{[^}]*youtubeThumbnailUrl[^}]*\} from "@\/lib\/videos"/s);
    expect(COMP).toMatch(/import \{[^}]*youtubeWatchUrl[^}]*\} from "@\/lib\/videos"/s);
  });

  it("returns null when no companion video exists (zero footprint when unused)", () => {
    expect(COMP).toMatch(/if \(!video\) return null/);
  });

  it("uses the click-to-load facade pattern (no auto-mounted iframes)", () => {
    expect(COMP).toMatch(/const \[activated, setActivated\] = useState\(false\)/);
    expect(COMP).toMatch(/activated\s*\?\s*\(\s*<iframe/);
  });

  it("exposes stable test ids per slug for hub + companion contracts", () => {
    expect(COMP).toMatch(/data-testid={`blog-video-cta-\$\{video\.slug\}`}/);
    expect(COMP).toMatch(/data-testid={`blog-video-facade-\$\{video\.slug\}`}/);
    expect(COMP).toMatch(/data-testid={`blog-video-iframe-\$\{video\.slug\}`}/);
    expect(COMP).toMatch(/data-testid={`blog-video-youtube-link-\$\{video\.slug\}`}/);
  });

  it("links 'Open on YouTube' as an external anchor with rel='noopener noreferrer'", () => {
    expect(COMP).toMatch(/target="_blank"/);
    expect(COMP).toMatch(/rel="noopener noreferrer"/);
  });
});

describe("§168 — BlogPost integration", () => {
  it("BlogPost.tsx imports the companion component", () => {
    expect(BLOG_POST).toMatch(
      /import BlogPostVideoCta from "@\/components\/blog\/BlogPostVideoCta"/,
    );
  });

  it("BlogPostVideoCta is rendered ABOVE the body (so the video lands in the top viewport)", () => {
    const cta = BLOG_POST.indexOf("<BlogPostVideoCta");
    const body = BLOG_POST.indexOf("<PostBody markdown={post.body}");
    expect(cta).toBeGreaterThan(0);
    expect(body).toBeGreaterThan(0);
    expect(cta).toBeLessThan(body);
  });

  it("BlogPostVideoCta receives the post slug, not the whole post object", () => {
    expect(BLOG_POST).toMatch(/<BlogPostVideoCta blogSlug=\{post\.slug\}\s*\/>/);
  });
});

describe("§168 — companion mapping data integrity", () => {
  it("every video that names a blogSlug actually targets a real companion lookup", () => {
    for (const v of listAllVideos()) {
      if (!v.blogSlug) continue;
      // Only ready videos are eligible to surface as a companion.
      if (!isReadyVideo(v)) continue;
      const found = getCompanionVideoForBlog(v.blogSlug);
      expect(found?.slug).toBe(v.slug);
    }
  });
});

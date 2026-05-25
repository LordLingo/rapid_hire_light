/*
  §168 — Learn page (/learn) source-pin invariants.

  Locks the page wiring at the source level: the right helpers are
  imported, the right SEO meta is set, the right test ids exist on the
  CTA cluster + grid, the empty-state branch exists for the day-1
  pre-launch case, and the App.tsx route table actually mounts the page.

  We deliberately don't render the React tree — the goal is to detect
  source-level regressions cheaply, not to retest the JSX engine.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..", "..", "..");
const LEARN = readFileSync(resolve(ROOT, "client/src/pages/Learn.tsx"), "utf8");
const APP = readFileSync(resolve(ROOT, "client/src/App.tsx"), "utf8");
const HEADER = readFileSync(resolve(ROOT, "client/src/components/site/Header.tsx"), "utf8");
const FOOTER = readFileSync(resolve(ROOT, "client/src/components/site/Footer.tsx"), "utf8");

describe("§168 — /learn page wiring", () => {
  it("imports the videos registry helpers from @/lib/videos", () => {
    expect(LEARN).toMatch(/import \{[^}]*listReadyVideos[^}]*\} from "@\/lib\/videos"/s);
    expect(LEARN).toMatch(/import \{[^}]*getAllReadyVideoTags[^}]*\} from "@\/lib\/videos"/s);
    expect(LEARN).toMatch(/import \{[^}]*youtubeThumbnailUrl[^}]*\} from "@\/lib\/videos"/s);
    expect(LEARN).toMatch(/import \{[^}]*youtubeEmbedUrl[^}]*\} from "@\/lib\/videos"/s);
    expect(LEARN).toMatch(/import \{[^}]*youtubeWatchUrl[^}]*\} from "@\/lib\/videos"/s);
  });

  it("uses the shared SiteShell + PageHero + CtaBanner chrome", () => {
    expect(LEARN).toMatch(/import SiteShell from "@\/components\/site\/SiteShell"/);
    expect(LEARN).toMatch(/import PageHero from "@\/components\/site\/PageHero"/);
    expect(LEARN).toMatch(/import CtaBanner from "@\/components\/site\/CtaBanner"/);
  });

  it("registers SEO meta via useSeo with a CollectionPage JSON-LD", () => {
    expect(LEARN).toMatch(/import \{ useSeo \} from "@\/hooks\/useSeo"/);
    expect(LEARN).toMatch(/useSeo\(\{/);
    expect(LEARN).toMatch(/"@type":\s*"CollectionPage"/);
  });

  it("surfaces both YouTube and newsletter CTAs in the hero afterLede slot", () => {
    expect(LEARN).toMatch(/data-testid="learn-hero-ctas"/);
    expect(LEARN).toMatch(/data-testid="learn-hero-youtube"/);
    expect(LEARN).toMatch(/data-testid="learn-hero-newsletter"/);
    // Newsletter CTA must point to /subscribe internally (wouter Link)
    expect(LEARN).toMatch(/href="\/subscribe"/);
    // YouTube CTA must point at the channel URL (external anchor)
    expect(LEARN).toMatch(/youtube\.com\/@rapidhiresolutions/);
  });

  it("renders the empty-state branch when no ready videos exist", () => {
    expect(LEARN).toMatch(/data-testid="learn-empty-state"/);
    expect(LEARN).toMatch(/Channel coming soon/);
    expect(LEARN).toMatch(/data-testid="learn-empty-subscribe"/);
  });

  it("renders the populated grid + tag pills when ready videos exist", () => {
    expect(LEARN).toMatch(/data-testid="learn-video-grid"/);
    expect(LEARN).toMatch(/data-testid="learn-tag-pills"/);
  });

  it("each video card uses a click-to-load YouTube facade with duration chip", () => {
    expect(LEARN).toMatch(/data-testid={`video-card-\$\{video\.slug\}`}/);
    expect(LEARN).toMatch(/data-testid={`video-facade-\$\{video\.slug\}`}/);
    expect(LEARN).toMatch(/data-testid={`video-iframe-\$\{video\.slug\}`}/);
    // Facade -> iframe transition is gated on a state flag, so the iframe
    // must NOT mount until the user clicks. The presence of `activated`
    // ternary is the proof.
    expect(LEARN).toMatch(/activated\s*\?\s*\(\s*<iframe/);
  });
});

describe("§168 — App.tsx mounts /learn and /subscribe", () => {
  it("imports both new page components", () => {
    expect(APP).toMatch(/import Learn from "\.\/pages\/Learn"/);
    expect(APP).toMatch(/import Subscribe from "\.\/pages\/Subscribe"/);
  });

  it("registers /learn and /subscribe routes (and not behind a regex prefix)", () => {
    expect(APP).toMatch(/<Route path=\{"\/learn"\} component=\{Learn\} \/>/);
    expect(APP).toMatch(/<Route path=\{"\/subscribe"\} component=\{Subscribe\} \/>/);
  });

  it("places /learn ABOVE the catch-all /blog/:slug route so wouter picks the static path first", () => {
    const learnIdx = APP.indexOf('path={"/learn"}');
    const blogSlugIdx = APP.indexOf('path={"/blog/:slug"}');
    expect(learnIdx).toBeGreaterThan(0);
    expect(blogSlugIdx).toBeGreaterThan(0);
    expect(learnIdx).toBeLessThan(blogSlugIdx);
  });
});

describe("§168 — Header and Footer surface /learn and /subscribe", () => {
  it("Header Resources mega-menu links to /learn (Learn (videos))", () => {
    expect(HEADER).toMatch(/label:\s*"Learn \(videos\)"/);
    expect(HEADER).toMatch(/href:\s*"\/learn"/);
  });

  it("Header Resources mega-menu links to /subscribe (Subscribe (newsletter))", () => {
    expect(HEADER).toMatch(/label:\s*"Subscribe \(newsletter\)"/);
    expect(HEADER).toMatch(/href:\s*"\/subscribe"/);
  });

  it("Footer Company column links to both /learn and /subscribe", () => {
    expect(FOOTER).toMatch(/label:\s*"Learn \(videos\)",\s*to:\s*"\/learn"/);
    expect(FOOTER).toMatch(/label:\s*"Newsletter",\s*to:\s*"\/subscribe"/);
  });
});

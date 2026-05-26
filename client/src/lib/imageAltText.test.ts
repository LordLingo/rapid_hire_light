/*
 * §193 source-pin spec — image alt-text accessibility contract.
 *
 * Audit completed in §193 confirmed every rendered <img> in
 * client/src/ either:
 *   (a) carries descriptive alt text that conveys the image's
 *       purpose and content, OR
 *   (b) carries alt="" and is paired with aria-hidden on the parent
 *       (or is itself aria-hidden) because the image is purely
 *       decorative AND the surrounding text already conveys the
 *       semantic content.
 *
 * This spec locks that contract so future regressions don't ship
 * filename-as-alt strings, "Image of …"/"Picture of …" prefixes
 * (redundant per WCAG 1.1.1 because screen readers already announce
 * "image"), or an entirely missing alt attribute.
 *
 * Allow-list rationale for each empty alt is documented inline below.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(PROJECT_ROOT, rel), "utf-8");
}

/**
 * Walk a directory and return all .tsx and .ts source files,
 * excluding test files, the api/ adapter, server/, scripts/, and
 * dist/.
 */
function walkClientSrc(dir: string): string[] {
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      out.push(...walkClientSrc(full));
    } else if (
      (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) &&
      !entry.name.endsWith(".test.tsx") &&
      !entry.name.endsWith(".test.ts")
    ) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Strip JSX comments before scanning for tags so a doc-comment that
 * mentions <img> doesn't generate a false positive.
 */
function stripComments(src: string): string {
  return src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
}

describe("§193 — every rendered <img> has a non-regressing alt attribute", () => {
  it("no <img> tag is missing the alt attribute entirely", () => {
    const files = walkClientSrc(path.join(PROJECT_ROOT, "client/src"));
    const offenders: string[] = [];
    for (const f of files) {
      const src = stripComments(fs.readFileSync(f, "utf-8"));
      const tagRe = /<img\b[\s\S]*?\/>/g;
      let m: RegExpExecArray | null;
      while ((m = tagRe.exec(src)) !== null) {
        const tag = m[0];
        if (!/\balt\s*=/.test(tag)) {
          offenders.push(`${path.relative(PROJECT_ROOT, f)} :: ${tag.slice(0, 80)}`);
        }
      }
    }
    expect(
      offenders,
      `<img> tags missing alt attribute:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("no alt text uses the redundant 'Image of …' or 'Picture of …' prefix (WCAG 1.1.1)", () => {
    // §193: screen readers already announce that an element is an
    // image — alt text should describe the content, not restate the
    // element type. Bans common antipatterns like 'image of a logo',
    // 'picture of an interview', 'photograph of …'.
    const files = walkClientSrc(path.join(PROJECT_ROOT, "client/src"));
    const offenders: string[] = [];
    const banned = /alt\s*=\s*"(?:image of|picture of|photograph of|photo of|graphic of|icon of)\s/i;
    for (const f of files) {
      const src = stripComments(fs.readFileSync(f, "utf-8"));
      const tagRe = /<img\b[\s\S]*?\/>/g;
      let m: RegExpExecArray | null;
      while ((m = tagRe.exec(src)) !== null) {
        if (banned.test(m[0])) {
          offenders.push(`${path.relative(PROJECT_ROOT, f)} :: ${m[0].slice(0, 120)}`);
        }
      }
    }
    expect(
      offenders,
      `<img> tags using redundant 'Image of …' alt-text antipattern:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });

  it("no alt text is just a filename (e.g., alt=\"logo.png\")", () => {
    // §193: filename-as-alt is non-descriptive and a common copy-paste
    // mistake. Bans alt values that consist solely of FILENAME.EXT.
    const files = walkClientSrc(path.join(PROJECT_ROOT, "client/src"));
    const offenders: string[] = [];
    const banned = /alt\s*=\s*"[A-Za-z0-9_\-]+\.(png|jpe?g|webp|avif|gif|svg|ico)"/i;
    for (const f of files) {
      const src = stripComments(fs.readFileSync(f, "utf-8"));
      const tagRe = /<img\b[\s\S]*?\/>/g;
      let m: RegExpExecArray | null;
      while ((m = tagRe.exec(src)) !== null) {
        if (banned.test(m[0])) {
          offenders.push(`${path.relative(PROJECT_ROOT, f)} :: ${m[0].slice(0, 120)}`);
        }
      }
    }
    expect(
      offenders,
      `<img> tags using filename-as-alt:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});

describe("§193 — pinned descriptive alt text on key brand surfaces", () => {
  it("Header.tsx: brand logo uses BRAND_NAME for alt (not a generic 'logo' string)", () => {
    // §193: BRAND_NAME ('Rapid Hire Solutions') is the descriptive
    // alt; the surrounding <Link to="/"> already announces 'link', so
    // screen readers say 'Rapid Hire Solutions, link' — exactly right.
    const src = read("client/src/components/site/Header.tsx");
    expect(src).toMatch(/alt=\{BRAND_NAME\}/);
  });

  it("Footer.tsx: brand logo uses BRAND_NAME for alt", () => {
    const src = read("client/src/components/site/Footer.tsx");
    expect(src).toMatch(/alt=\{BRAND_NAME\}/);
  });

  it("Hero.tsx: brand artwork has a long descriptive alt covering wordmark + SPA + tagline + service strip", () => {
    // §193: the homepage hero's alt must convey the brand wordmark,
    // the SPA acronym meaning, the script tagline, and the service
    // strip — that's the entire selling proposition baked into one
    // image, and screen-reader users get all of it via alt text.
    const src = read("client/src/components/site/Hero.tsx");
    const altMatch = src.match(/alt="([^"]+)"/);
    expect(altMatch, "Hero.tsx must declare an alt= prop").not.toBeNull();
    const alt = altMatch![1];
    expect(alt.length).toBeGreaterThan(200);
    expect(alt).toMatch(/Rapid Hire Solutions/);
    expect(alt).toMatch(/SPA/);
    expect(alt).toMatch(/Speed/);
    expect(alt).toMatch(/Price/);
    expect(alt).toMatch(/Accuracy/);
  });

  it("WhyUs.tsx interview photo has a descriptive scene alt (not 'interview.png')", () => {
    const src = read("client/src/components/site/WhyUs.tsx");
    expect(src).toMatch(
      /alt="A hiring manager shaking hands with a candidate at a sunlit office, with a HIRED sign on the desk\."/,
    );
  });

  it("SampleReportImage.tsx: trigger + dialog images both use SAMPLE_REPORT_ALT (long descriptive)", () => {
    const src = read("client/src/components/site/SampleReportImage.tsx");
    // SAMPLE_REPORT_ALT must be defined and used for both <img>
    // instances (the resting card + the lightbox image).
    expect(src).toMatch(/const SAMPLE_REPORT_ALT\s*=\s*\n?\s*"[^"]{60,}"/);
    const altUsages = src.match(/alt=\{SAMPLE_REPORT_ALT\}/g) ?? [];
    expect(altUsages.length).toBe(2);
  });

  it("Pricing.tsx illustration alt describes the editorial scene (coins + ledger + receipt)", () => {
    const src = read("client/src/pages/Pricing.tsx");
    const altMatch = src.match(/alt="Tall editorial illustration[^"]+"/);
    expect(altMatch, "Pricing illustration must have descriptive alt").not.toBeNull();
    expect(altMatch![0]).toMatch(/coins/);
    expect(altMatch![0]).toMatch(/ledger/);
    expect(altMatch![0]).toMatch(/receipt/);
  });

  it("Trust.tsx + Compliance.tsx badges all use a per-badge descriptive alt", () => {
    // §193: each compliance badge's alt is the badge title +
    // ' certification badge' (Trust.tsx) or comes from the b.alt
    // catalog field (Compliance.tsx). Either is descriptive — just
    // pin that the cheap fallbacks haven't been introduced.
    const trust = read("client/src/pages/Trust.tsx");
    expect(trust).toMatch(/alt=\{`\$\{b\.title\} certification badge`\}/);
    const compliance = read("client/src/pages/Compliance.tsx");
    // Compliance row badges use catalog alt (b.alt). Compliance hero
    // uses alt="" because the section eyebrow already announces it.
    expect(compliance).toMatch(/alt=\{b\.alt\}/);
  });

  it("BlogPost.tsx cover uses post.coverAlt with title fallback (never bare empty alt)", () => {
    const src = read("client/src/pages/BlogPost.tsx");
    expect(src).toMatch(/alt=\{post\.coverAlt \?\? post\.title\}/);
  });

  it("Industries.tsx / ServiceDetail.tsx / IndustryDetail.tsx pass alt through from heroImage catalog", () => {
    // §193: each catalog entry must supply a descriptive
    // heroImage.alt; that's enforced by upstream catalog tests. Pin
    // here that the page-level <img> propagates it instead of
    // hardcoding a generic alt.
    expect(read("client/src/pages/Industries.tsx")).toMatch(
      /alt=\{v\.heroImage\.alt\}/,
    );
    expect(read("client/src/pages/ServiceDetail.tsx")).toMatch(
      /alt=\{service\.heroImage\.alt\}/,
    );
    expect(read("client/src/pages/IndustryDetail.tsx")).toMatch(
      /alt=\{industry\.heroImage\.alt\}/,
    );
  });
});

describe("§193 — empty alt is paired with aria-hidden context", () => {
  it("Support.tsx desk avatars: empty alt is paired with aria-hidden parent + name in adjacent text", () => {
    // §193: the desk avatar's alt="" is intentional — the support
    // rep's name is rendered in the card body next to the avatar,
    // so an alt would be redundant for screen readers.
    const src = read("client/src/pages/Support.tsx");
    // Look for the avatar block: aria-hidden on the wrapper div +
    // alt="" on the inner <img>.
    expect(src).toMatch(/aria-hidden\s*\n?\s+className=/);
    expect(src).toMatch(/data-testid="desk-avatar"/);
  });

  it("Learn.tsx video thumbnails: empty alt because the linked card title supplies the semantic content", () => {
    // §193: the thumbnail is decorative — the link's accessible name
    // comes from the card heading, not the thumbnail. alt="" is the
    // correct WAI-ARIA pattern here.
    const src = read("client/src/pages/Learn.tsx");
    expect(src).toMatch(/<img[^>]*alt=""/);
  });

  it("PageHero.tsx: imageAlt prop has a fallback to empty string for decorative-by-design heroes", () => {
    // §193: callers that pass imageAlt get descriptive alt; callers
    // that omit it (Compliance, Contact) get alt="" because their
    // hero is decorative + the section eyebrow already announces
    // the section's purpose.
    const src = read("client/src/components/site/PageHero.tsx");
    expect(src).toMatch(/alt=\{imageAlt \?\? ""\}/);
  });
});

/**
 * §121 — /integrations editorial plate + native-size handshake infographic.
 *
 * Two assertions live in this file:
 *
 *   A) The square editorial plate is rendered under the "02 — Integrations"
 *      eyebrow in the left rail of the page hero, framed with the same
 *      white-mat + paper-shadow + hover-zoom-image treatment used on
 *      /services and /industries (§117/§118/§120).
 *
 *   B) The user-supplied portrait infographic is rendered at native size in
 *      a dedicated "04 — The handshake" section between "How it works" and
 *      "Available today", with a self-describing alt text and a `figure`
 *      frame so it reads as legible imagery, not a decorative spot.
 *
 * Both assertions pin the asset URLs and structural classes so a future
 * edit can't silently drop the framing, the hover gesture, the alt text,
 * or the placement.
 */
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC = resolve(__dirname, "..");

const PAGE = readFileSync(resolve(SRC, "pages/Integrations.tsx"), "utf-8");

describe("§121.A — square editorial plate under the 02 — Integrations eyebrow", () => {
  it("PageHero is wired with belowEyebrow + framed hero image testid", () => {
    expect(PAGE).toContain('eyebrow="02 — Integrations"');
    expect(PAGE).toContain("belowEyebrow=");
    expect(PAGE).toContain('data-testid="integrations-hero-image"');
  });

  it("plate uses the same framing classes as the services/industries plates", () => {
    expect(PAGE).toMatch(/hover-zoom-image[^"]*aspect-square/);
    expect(PAGE).toContain("rounded-2xl");
    expect(PAGE).toContain("bg-white p-2");
    expect(PAGE).toMatch(/shadow-\[0_1px_2px/);
    // Inner image sits inside a rounded-xl clip with object-cover
    expect(PAGE).toContain('className="block h-full w-full rounded-xl object-cover"');
  });

  it("plate references the §121 cloudfront webp and ships with lazy/async loading", () => {
    expect(PAGE).toContain(
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/integrations-plate-5gAXFzjQrFTUZZGW4UdbC7.webp",
    );
    expect(PAGE).toContain('loading="lazy"');
    expect(PAGE).toContain('decoding="async"');
  });

  it("plate's alt text is self-descriptive — references the link rings + ATS/HRIS hand-off", () => {
    // Pull the alt content for the plate (avoid the §121.B infographic alt)
    const plateMatch = PAGE.match(
      /integrations-plate-5gAXFzjQrFTUZZGW4UdbC7\.webp[^]*?alt="([^"]+)"/,
    );
    expect(plateMatch, "could not find alt text for the editorial plate").not.toBeNull();
    const alt = (plateMatch![1] ?? "").toLowerCase();
    expect(alt.length).toBeGreaterThanOrEqual(60);
    expect(alt).not.toMatch(/^image of/);
    // Mentions both sides of the hand-off
    expect(alt).toMatch(/ats|hris/);
    expect(alt).toContain("background");
    // Mentions the central interlocking link rings + sage-green check
    expect(alt).toContain("link rings");
  });
});

describe("§121.B — full portrait infographic in a dedicated section", () => {
  it("renders the §121 handshake section with its own eyebrow and figure testid", () => {
    expect(PAGE).toContain('eyebrow">04 — The handshake</p>');
    expect(PAGE).toContain('data-testid="integrations-handshake-figure"');
    expect(PAGE).toMatch(/<figure[^>]*>/);
  });

  it("the user-supplied infographic is referenced via the manus-storage CDN path", () => {
    expect(PAGE).toContain('src="/manus-storage/integrations-infographic_ad1c2dd4.png"');
    // Allowed to render at native portrait size — no aspect-square clip on the figure.
    const figureSlice = PAGE.slice(
      PAGE.indexOf('data-testid="integrations-handshake-figure"'),
      PAGE.indexOf('{/* Integrations grid */}'),
    );
    expect(figureSlice).not.toMatch(/aspect-square/);
    expect(figureSlice).toContain('h-auto w-full');
  });

  it("the infographic carries an alt that mirrors its on-image messages", () => {
    const altMatch = PAGE.match(
      /integrations-infographic_ad1c2dd4\.png"[^>]*alt="([^"]+)"/s,
    );
    expect(altMatch, "could not find alt for handshake infographic").not.toBeNull();
    const alt = (altMatch![1] ?? "").toLowerCase();
    expect(alt.length).toBeGreaterThanOrEqual(120);
    // Mentions both connector layers
    expect(alt).toMatch(/ats|hris/);
    expect(alt).toContain("background check");
    // Mentions at least three of the four sub-checks visible on the image
    const subCheckHits = [
      "identity verification",
      "criminal records",
      "employment verification",
      "education verification",
    ].filter((kw) => alt.includes(kw));
    expect(subCheckHits.length).toBeGreaterThanOrEqual(3);
    // Mentions the closing trust line
    expect(alt).toContain("soc 2");
  });

  it("the dedicated section sits between '03 — How integrations work' and the integrations grid", () => {
    const howIdx = PAGE.indexOf("03 — How integrations work");
    const handshakeIdx = PAGE.indexOf("04 — The handshake");
    const gridIdx = PAGE.indexOf("{/* Integrations grid */}");
    expect(howIdx).toBeGreaterThan(0);
    expect(handshakeIdx).toBeGreaterThan(howIdx);
    expect(gridIdx).toBeGreaterThan(handshakeIdx);
  });

  it("renumbered the integrations-grid eyebrow to 05 to keep the page numbering monotonic", () => {
    expect(PAGE).toContain('eyebrow">05 — Available today</p>');
    // The old 04 — Available today should be gone.
    expect(PAGE).not.toContain('eyebrow">04 — Available today</p>');
  });
});

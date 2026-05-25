/*
  §175 — Contact hero image + credibility badge source-pin.

  Locks the new editorial-photo hero on /contact so the framed image,
  the visualBleed opt-in, and the live-pickup badge can't quietly
  regress through a future visual edit. Mirrors the pattern in
  complianceHeroBadges.test.ts: read the page source and slice from
  `visual={` to the next prop so badge text can't leak in from
  unrelated copy elsewhere on the page.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const CONTACT_PATH = resolve(__dirname, "../pages/Contact.tsx");
const contact = readFileSync(CONTACT_PATH, "utf8");

const EXPECTED_HERO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/contact-hero-NCQW8S8RJYNrqZZjYCgptA.webp";

/** Slice from `visual={` to the next prop (`belowVisual={`) so badge
 * pins cannot match copy elsewhere on the Contact page (e.g. the form
 * region or the FAQ strip). */
function visualSlice(): string {
  const idx = contact.indexOf("visual={");
  expect(idx, "visual={ marker present").toBeGreaterThan(-1);
  const end = contact.indexOf("belowVisual={", idx);
  expect(end, "belowVisual={ marker present after visual={").toBeGreaterThan(idx);
  return contact.slice(idx, end);
}

describe("§175 — Contact hero image + credibility badge", () => {
  it("pins the CONTACT_HERO_URL constant to the published CDN asset", () => {
    expect(contact).toMatch(/const CONTACT_HERO_URL\s*=\s*"[^"]+"/);
    expect(contact).toContain(EXPECTED_HERO_URL);
  });

  it("removes the synthetic ContactCallCard import from the Contact page", () => {
    // The card stays available in HeroCards.tsx (GetAQuote still uses it),
    // but Contact.tsx must no longer import or render it.
    expect(contact).not.toMatch(
      /import\s*\{[^}]*ContactCallCard[^}]*\}\s*from\s*"@\/components\/heroes\/HeroCards"/,
    );
    expect(contact).not.toMatch(/<ContactCallCard\s*\/>/);
  });

  it("renders the hero photo via <img src={CONTACT_HERO_URL}> with object-cover", () => {
    const slice = visualSlice();
    expect(slice).toMatch(/src=\{CONTACT_HERO_URL\}/);
    expect(slice).toMatch(/object-cover/);
    // Match the canonical Compliance-hero responsive height ladder so the
    // two photo heroes line up visually across the site.
    expect(slice).toMatch(
      /h-\[280px\] sm:h-\[340px\] md:h-\[400px\] lg:h-\[420px\]/,
    );
  });

  it("opts into PageHero's visualBleed mode so the badge can overhang", () => {
    // Without `visualBleed`, PageHero re-applies an outer overflow-hidden
    // rounded frame and the negatively-offset badge would be clipped.
    expect(contact).toMatch(/visualBleed/);
  });

  it("frames the hero photo inside its own rounded overflow-hidden wrapper", () => {
    const slice = visualSlice();
    const frameIdx = slice.indexOf("overflow-hidden rounded-[18px]");
    const imgIdx = slice.indexOf("<img");
    expect(frameIdx, "inner rounded frame present").toBeGreaterThan(-1);
    expect(imgIdx).toBeGreaterThan(frameIdx);
  });

  it("wraps the hero in a relative container so the absolute badge can overlay", () => {
    const slice = visualSlice();
    const relativeIdx = slice.indexOf('className="relative w-full');
    const imgIdx = slice.indexOf("<img");
    expect(relativeIdx).toBeGreaterThan(-1);
    expect(imgIdx).toBeGreaterThan(relativeIdx);
  });

  it("renders the live-pickup credibility badge with all three text rows in order", () => {
    const slice = visualSlice();
    const badgeIdx = slice.indexOf('data-testid="contact-hero-badge-pickup"');
    expect(badgeIdx, "pickup badge testid present").toBeGreaterThan(-1);
    const eyebrow = slice.indexOf("Live answer · M\u2013F 7am\u20137pm CT", badgeIdx);
    const headline = slice.indexOf("Average pickup 14 seconds", badgeIdx);
    const caption = slice.indexOf("Direct extension · no IVR · (888) 445-3047", badgeIdx);
    expect(eyebrow).toBeGreaterThan(badgeIdx);
    expect(headline).toBeGreaterThan(eyebrow);
    expect(caption).toBeGreaterThan(headline);
  });

  it("pickup badge is positioned absolutely overhanging the bottom-left corner at sm: and up", () => {
    const slice = visualSlice();
    const badgeIdx = slice.indexOf('data-testid="contact-hero-badge-pickup"');
    const card = slice.slice(badgeIdx, badgeIdx + 1500);
    expect(card).toMatch(/hidden sm:block/);
    expect(card).toMatch(/absolute/);
    expect(card).toMatch(/-bottom-6/);
    expect(card).toMatch(/-left-4/);
    expect(card).toMatch(/md:-bottom-7/);
    expect(card).toMatch(/md:-left-6/);
  });

  it("pickup badge uses warm-paper surface tokens (not the dark footer family)", () => {
    const slice = visualSlice();
    const badgeIdx = slice.indexOf('data-testid="contact-hero-badge-pickup"');
    const card = slice.slice(badgeIdx, badgeIdx + 1500);
    expect(card).toMatch(/bg-white/);
    expect(card).toMatch(/text-\[color:var\(--color-ink\)\]/);
    expect(card).not.toMatch(/bg-\[color:var\(--color-footer\)\]/);
  });

  it("pickup badge includes a live-pulse dot using the existing support-status-dot-live treatment", () => {
    const slice = visualSlice();
    const dotIdx = slice.indexOf('data-testid="contact-hero-badge-pickup-dot"');
    expect(dotIdx, "pickup pulse-dot testid present").toBeGreaterThan(-1);
    const dot = slice.slice(dotIdx, dotIdx + 600);
    expect(dot).toMatch(/size-2 rounded-full/);
    expect(dot).toMatch(/bg-\[color:var\(--color-accent-ink\)\]/);
    expect(dot).toMatch(/support-status-dot-live/);
  });

  it("badge sits INSIDE the hero visual wrapper (above belowVisual={)", () => {
    const belowVisualIdx = contact.indexOf("belowVisual={");
    const badgeIdx = contact.indexOf('data-testid="contact-hero-badge-pickup"');
    expect(badgeIdx).toBeGreaterThan(-1);
    expect(badgeIdx).toBeLessThan(belowVisualIdx);
  });

  it("anti-regression: existing hero headline and italic accent are unchanged", () => {
    expect(contact).toMatch(/Let&apos;s/);
    expect(contact).toMatch(/screening\./);
    expect(contact).toMatch(
      /italic font-normal text-\[color:var\(--color-accent-ink\)\]/,
    );
  });

  it("anti-regression: HeroMiniStats below-visual slot still feeds the contact page key", () => {
    expect(contact).toMatch(/<HeroMiniStats page="contact" \/>/);
  });
});

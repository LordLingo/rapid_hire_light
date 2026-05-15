import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const COMPLIANCE_PATH = resolve(__dirname, "../pages/Compliance.tsx");
const compliance = readFileSync(COMPLIANCE_PATH, "utf8");

/** Slice from the `visual={` open until the matching close so badge pins
 * cannot accidentally match copy elsewhere on the page (e.g. section bodies). */
function visualSlice(): string {
  const idx = compliance.indexOf("visual={");
  expect(idx, "visual={ marker present").toBeGreaterThan(-1);
  // Cap the slice at the next prop, `afterLede={`, which is structurally
  // adjacent in PageHero's prop list.
  const end = compliance.indexOf("afterLede={", idx);
  expect(end, "afterLede={ marker present after visual={").toBeGreaterThan(idx);
  return compliance.slice(idx, end);
}

describe("§62 — Compliance hero credibility badges", () => {
  it("preserves the existing COMPLIANCE_HERO_URL <img> with object-cover", () => {
    const slice = visualSlice();
    expect(slice).toMatch(/src=\{COMPLIANCE_HERO_URL\}/);
    expect(slice).toMatch(/object-cover/);
  });

  it("wraps the hero in a relative container so absolute badges can overlay", () => {
    const slice = visualSlice();
    // The relative wrapper must come BEFORE the <img>.
    const relativeIdx = slice.indexOf('className="relative w-full');
    const imgIdx = slice.indexOf("<img");
    expect(relativeIdx).toBeGreaterThan(-1);
    expect(imgIdx).toBeGreaterThan(relativeIdx);
  });

  it("renders the SOC 2 top-right badge with all three text rows in order", () => {
    const slice = visualSlice();
    const soc2Idx = slice.indexOf('data-testid="compliance-hero-badge-soc2"');
    expect(soc2Idx, "SOC 2 badge testid present").toBeGreaterThan(-1);
    const eyebrow = slice.indexOf("SOC 2 Type II", soc2Idx);
    const headline = slice.indexOf("Re-attested every 12 months", soc2Idx);
    const caption = slice.indexOf("Report available under NDA", soc2Idx);
    expect(eyebrow).toBeGreaterThan(soc2Idx);
    expect(headline).toBeGreaterThan(eyebrow);
    expect(caption).toBeGreaterThan(headline);
  });

  it("SOC 2 badge uses the dark footer surface tokens", () => {
    const slice = visualSlice();
    const soc2Idx = slice.indexOf('data-testid="compliance-hero-badge-soc2"');
    const card = slice.slice(soc2Idx, soc2Idx + 1500);
    expect(card).toMatch(/bg-\[color:var\(--color-footer\)\]/);
    expect(card).toMatch(/text-\[color:var\(--color-footer-foreground\)\]/);
    expect(card).toMatch(/colorScheme: "dark"/);
  });

  it("SOC 2 badge is positioned absolutely top-right and pinned at sm: and up", () => {
    const slice = visualSlice();
    const soc2Idx = slice.indexOf('data-testid="compliance-hero-badge-soc2"');
    const card = slice.slice(soc2Idx, soc2Idx + 1500);
    // Hidden on mobile (xs), shown sm: and up:
    expect(card).toMatch(/hidden sm:block/);
    expect(card).toMatch(/absolute/);
    expect(card).toMatch(/top-4/);
    expect(card).toMatch(/right-4/);
  });

  it("renders the Dispute-rate bottom-left badge with all three text rows in order", () => {
    const slice = visualSlice();
    const dispIdx = slice.indexOf('data-testid="compliance-hero-badge-dispute"');
    expect(dispIdx, "Dispute badge testid present").toBeGreaterThan(-1);
    const eyebrow = slice.indexOf("Trailing 12 months", dispIdx);
    const headline = slice.indexOf("Dispute rate under 0.4%", dispIdx);
    const caption = slice.indexOf("FCRA §611 reinvestigations resolved on time", dispIdx);
    expect(eyebrow).toBeGreaterThan(dispIdx);
    expect(headline).toBeGreaterThan(eyebrow);
    expect(caption).toBeGreaterThan(headline);
  });

  it("Dispute badge uses warm-paper surface tokens (not the dark footer family)", () => {
    const slice = visualSlice();
    const dispIdx = slice.indexOf('data-testid="compliance-hero-badge-dispute"');
    const card = slice.slice(dispIdx, dispIdx + 1500);
    expect(card).toMatch(/bg-white/);
    expect(card).toMatch(/text-\[color:var\(--color-ink\)\]/);
    expect(card).not.toMatch(/bg-\[color:var\(--color-footer\)\]/);
  });

  it("Dispute badge is positioned absolutely bottom-left and pinned at sm: and up", () => {
    const slice = visualSlice();
    const dispIdx = slice.indexOf('data-testid="compliance-hero-badge-dispute"');
    const card = slice.slice(dispIdx, dispIdx + 1500);
    expect(card).toMatch(/hidden sm:block/);
    expect(card).toMatch(/absolute/);
    expect(card).toMatch(/bottom-4/);
    expect(card).toMatch(/left-4/);
  });

  it("Dispute badge includes a live-pulse dot using the existing support-status-dot-live treatment", () => {
    const slice = visualSlice();
    const dotIdx = slice.indexOf('data-testid="compliance-hero-badge-dispute-dot"');
    expect(dotIdx, "Dispute pulse-dot testid present").toBeGreaterThan(-1);
    const dot = slice.slice(dotIdx, dotIdx + 600);
    expect(dot).toMatch(/size-2 rounded-full/);
    expect(dot).toMatch(/bg-\[color:var\(--color-accent-ink\)\]/);
    expect(dot).toMatch(/support-status-dot-live/);
  });

  it("both badges sit INSIDE the hero visual wrapper (above afterLede)", () => {
    // Both testids must appear before `afterLede={` in the file.
    const afterLedeIdx = compliance.indexOf("afterLede={");
    const soc2Idx = compliance.indexOf('data-testid="compliance-hero-badge-soc2"');
    const dispIdx = compliance.indexOf('data-testid="compliance-hero-badge-dispute"');
    expect(soc2Idx).toBeGreaterThan(-1);
    expect(dispIdx).toBeGreaterThan(-1);
    expect(soc2Idx).toBeLessThan(afterLedeIdx);
    expect(dispIdx).toBeLessThan(afterLedeIdx);
  });

  it("anti-regression: existing hero headline and italic accent are unchanged", () => {
    // The headline is split across two JSX nodes:
    //   `Compliance is the product,` + `not the disclaimer.` (italic span).
    expect(compliance).toMatch(/Compliance is the product,/);
    expect(compliance).toMatch(/not the disclaimer\./);
    expect(compliance).toMatch(/italic font-light text-\[color:var\(--color-accent-ink\)\]/);
  });

  it("anti-regression: §61 CTA pair still renders below the lede", () => {
    expect(compliance).toMatch(/data-testid="compliance-cta-audit"/);
    expect(compliance).toMatch(/Book a free 15-min audit/);
    expect(compliance).toMatch(/Get the 24-point checklist/);
  });
});

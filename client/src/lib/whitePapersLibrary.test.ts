/**
 * §82 — White papers library expansion (10 added, total 16).
 *
 * Anti-regression pins for the dataset shape, the 10 new entries, and
 * cross-topic coverage. Locks the count and slugs so an accidental
 * truncation of the array shows up as a test failure.
 */
import { describe, expect, it } from "vitest";
import {
  WHITE_PAPERS,
  whitePaperCounts,
  type WhitePaper,
  type WhitePaperTopic,
} from "./whitePapers";

const SLUGS_82 = [
  "building-a-defensible-adjudication-matrix",
  "staffing-agency-screening-program-design",
  "international-screening-for-us-employers",
  "post-legalization-drug-testing-program-design",
  "financial-services-screening-fingerprinting-and-finra",
  "ai-in-employment-screening-governance",
  "gig-and-1099-contractor-screening",
  "mergers-acquisitions-workforce-rescreen",
  "candidate-data-privacy-and-retention",
];
const SLUGS_82_FULL = [
  ...SLUGS_82,
  // The 10th entry is the adjudication-matrix flagship; full set:
];
// 10 new entries (the 9 above + the adjudication-matrix flagship is included
// at the head of SLUGS_82, so we add the actual 10th here):
const NEW_82_SLUGS = [
  "building-a-defensible-adjudication-matrix",
  "staffing-agency-screening-program-design",
  "international-screening-for-us-employers",
  "post-legalization-drug-testing-program-design",
  "financial-services-screening-fingerprinting-and-finra",
  "ai-in-employment-screening-governance",
  "gig-and-1099-contractor-screening",
  "mergers-acquisitions-workforce-rescreen",
  "candidate-data-privacy-and-retention",
  "retail-and-qsr-loss-prevention-screening",
];

describe("§82 — White papers library expansion", () => {
  it("library now contains 16 papers (was 6)", () => {
    expect(WHITE_PAPERS).toHaveLength(16);
    expect(whitePaperCounts().total).toBe(16);
  });

  it("slugs are unique", () => {
    const slugs = WHITE_PAPERS.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("ids are unique", () => {
    const ids = WHITE_PAPERS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each new §82 slug is present in the library", () => {
    const slugs = new Set(WHITE_PAPERS.map((w) => w.slug));
    for (const s of NEW_82_SLUGS) {
      expect(slugs.has(s), `Missing §82 slug: ${s}`).toBe(true);
    }
  });

  it("every paper has the required fields populated", () => {
    for (const w of WHITE_PAPERS) {
      expect(typeof w.id).toBe("string");
      expect(w.id.length).toBeGreaterThan(0);
      expect(w.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(w.title.length).toBeGreaterThan(10);
      expect(w.summary.length).toBeGreaterThan(80);
      expect(w.audience.length).toBeGreaterThan(5);
      expect(w.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(w.readMinutes).toBeGreaterThanOrEqual(8);
      expect(w.readMinutes).toBeLessThanOrEqual(30);
      expect(Array.isArray(w.highlights)).toBe(true);
      expect(w.highlights.length).toBeGreaterThanOrEqual(3);
      for (const h of w.highlights) {
        expect(h.length).toBeGreaterThan(10);
      }
    }
  });

  it("every topic field is one of the four allowed values", () => {
    const allowed: WhitePaperTopic[] = [
      "Compliance",
      "Operations",
      "Industry",
      "Candidate Experience",
    ];
    for (const w of WHITE_PAPERS) {
      expect(allowed).toContain(w.topic);
    }
  });

  it("each of the four topics is represented in the expanded library", () => {
    const counts = whitePaperCounts();
    expect((counts.topics.get("Compliance") ?? 0)).toBeGreaterThanOrEqual(2);
    expect((counts.topics.get("Operations") ?? 0)).toBeGreaterThanOrEqual(2);
    expect((counts.topics.get("Industry") ?? 0)).toBeGreaterThanOrEqual(2);
    expect((counts.topics.get("Candidate Experience") ?? 0)).toBeGreaterThanOrEqual(1);
  });

  it("totalReadMinutes is the sum of all readMinutes", () => {
    const sum = WHITE_PAPERS.reduce((s: number, w: WhitePaper) => s + w.readMinutes, 0);
    expect(whitePaperCounts().totalReadMinutes).toBe(sum);
  });

  it("publishedAt dates are valid and not in the impossibly distant future", () => {
    for (const w of WHITE_PAPERS) {
      const d = new Date(w.publishedAt);
      expect(Number.isNaN(d.getTime())).toBe(false);
      // sanity: within +/- 5 years of "now" baseline 2026-05-16
      const year = d.getUTCFullYear();
      expect(year).toBeGreaterThanOrEqual(2024);
      expect(year).toBeLessThanOrEqual(2027);
    }
  });
});

// Avoid lint-on-unused for the helper arrays kept for future reference.
void SLUGS_82_FULL;
void SLUGS_82;

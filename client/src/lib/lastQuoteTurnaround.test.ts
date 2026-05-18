/**
 * §113 — last-quote-turnaround chip invariants.
 *
 * The chip on /get-a-quote is owner-editable via
 * `client/src/data/lastQuoteTurnaround.json`. These specs pin:
 *   A) the JSON file's required shape (so an owner edit can't ship a typo
 *      that the runtime silently swallows),
 *   B) the formatter's display rules across hour/min boundaries,
 *   C) the freshness gate (stale claims auto-hide, never publish "last
 *      quote turnaround" from a year ago),
 *   D) the chip is wired into GetAQuote.tsx behind the `isFresh` guard,
 *      with the documented testid + content slots.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  buildLastQuoteTurnaround,
  formatTurnaround,
  formatRelativeRecordedAt,
  DEFAULT_FRESHNESS_HOURS,
  LAST_QUOTE_TURNAROUND,
  type LastQuoteTurnaroundSource,
} from "./lastQuoteTurnaround";

const DATA_PATH = path.resolve(
  __dirname,
  "..",
  "data",
  "lastQuoteTurnaround.json",
);
const PAGE_PATH = path.resolve(__dirname, "..", "pages", "GetAQuote.tsx");
const PAGE_SRC = fs.readFileSync(PAGE_PATH, "utf8");

describe("§113 A) JSON source-of-truth shape", () => {
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  it("declares minutes as a non-negative integer", () => {
    expect(typeof raw.minutes).toBe("number");
    expect(Number.isInteger(raw.minutes)).toBe(true);
    expect(raw.minutes).toBeGreaterThanOrEqual(0);
  });

  it("declares recordedAt as a parseable ISO timestamp", () => {
    expect(typeof raw.recordedAt).toBe("string");
    const ts = Date.parse(raw.recordedAt);
    expect(Number.isFinite(ts)).toBe(true);
  });

  it("default freshness window is 168 hours (7 days)", () => {
    expect(DEFAULT_FRESHNESS_HOURS).toBe(168);
  });
});

describe("§113 B) formatTurnaround display rules", () => {
  it("renders combined hour + min with the bullet separator", () => {
    expect(formatTurnaround(887)).toBe("14 hr · 47 min");
    expect(formatTurnaround(75)).toBe("1 hr · 15 min");
  });

  it("renders a clean hour when minutes are exactly zero", () => {
    expect(formatTurnaround(120)).toBe("2 hr");
    expect(formatTurnaround(60)).toBe("1 hr");
  });

  it("renders minutes-only under one hour", () => {
    expect(formatTurnaround(45)).toBe("45 min");
    expect(formatTurnaround(1)).toBe("1 min");
  });

  it("collapses zero / sub-minute / invalid input gracefully", () => {
    expect(formatTurnaround(0)).toBe("Under a minute");
    expect(formatTurnaround(0.4)).toBe("Under a minute");
    expect(formatTurnaround(-1)).toBe("—");
    expect(formatTurnaround(Number.NaN)).toBe("—");
  });
});

describe("§113 B2) formatRelativeRecordedAt subline rules", () => {
  const now = Date.parse("2026-05-18T13:00:00.000Z");

  it("collapses sub-minute deltas to 'just now'", () => {
    expect(formatRelativeRecordedAt("2026-05-18T12:59:30.000Z", now)).toBe(
      "just now",
    );
  });

  it("uses singular and plural forms correctly", () => {
    expect(formatRelativeRecordedAt("2026-05-18T12:00:00.000Z", now)).toBe(
      "1 hour ago",
    );
    expect(formatRelativeRecordedAt("2026-05-18T11:00:00.000Z", now)).toBe(
      "2 hours ago",
    );
  });

  it("rolls up to weeks past the 14-day boundary", () => {
    expect(formatRelativeRecordedAt("2026-04-25T13:00:00.000Z", now)).toBe(
      "3 weeks ago",
    );
  });
});

describe("§113 C) buildLastQuoteTurnaround freshness gate", () => {
  const fresh: LastQuoteTurnaroundSource = {
    minutes: 887,
    recordedAt: "2026-05-18T00:00:00.000Z",
    industry: "Healthcare staffing",
  };
  const stale: LastQuoteTurnaroundSource = {
    minutes: 887,
    recordedAt: "2024-01-01T00:00:00.000Z",
    industry: "Healthcare staffing",
  };
  const NOW = Date.parse("2026-05-18T13:00:00.000Z");

  it("marks a same-day measurement as fresh", () => {
    const vm = buildLastQuoteTurnaround(fresh, NOW);
    expect(vm.isFresh).toBe(true);
    expect(vm.display).toBe("14 hr · 47 min");
  });

  it("marks a 2-year-old measurement as stale (chip will hide)", () => {
    const vm = buildLastQuoteTurnaround(stale, NOW);
    expect(vm.isFresh).toBe(false);
  });

  it("respects an owner-set custom freshnessHours window", () => {
    const tight = buildLastQuoteTurnaround(
      { ...fresh, freshnessHours: 1 },
      NOW + 7200_000, // 2 hours after recordedAt
    );
    expect(tight.isFresh).toBe(false);
  });

  it("subline includes the optional industry when provided", () => {
    const vm = buildLastQuoteTurnaround(fresh, NOW);
    expect(vm.subline).toMatch(/^Healthcare staffing · /);
  });

  it("subline falls back to 'Recorded …' when industry is omitted", () => {
    const vm = buildLastQuoteTurnaround(
      { minutes: 30, recordedAt: fresh.recordedAt },
      NOW,
    );
    expect(vm.subline.startsWith("Recorded ")).toBe(true);
  });
});

describe("§113 D) GetAQuote chip wiring", () => {
  it("imports LAST_QUOTE_TURNAROUND from the typed loader", () => {
    expect(PAGE_SRC).toMatch(
      /import\s*{\s*LAST_QUOTE_TURNAROUND[^}]*}\s*from\s*["']@\/lib\/lastQuoteTurnaround["']/,
    );
  });

  it("renders the chip behind the isFresh guard", () => {
    expect(PAGE_SRC).toMatch(/LAST_QUOTE_TURNAROUND\.isFresh\s*&&/);
  });

  it("uses the documented testid", () => {
    expect(PAGE_SRC).toContain('data-testid="quote-last-turnaround-chip"');
  });

  it("surfaces the display + subline slots in the chip", () => {
    expect(PAGE_SRC).toMatch(/{LAST_QUOTE_TURNAROUND\.display}/);
    expect(PAGE_SRC).toMatch(/{LAST_QUOTE_TURNAROUND\.subline}/);
  });

  it("uses the 'Last quote turnaround' label text", () => {
    expect(PAGE_SRC).toContain("Last quote turnaround");
  });

  it("declares aria-live for the chip so updates are announced", () => {
    expect(PAGE_SRC).toMatch(
      /data-testid="quote-last-turnaround-chip"[\s\S]{0,300}aria-live="polite"/,
    );
  });
});

describe("§113 E) runtime singleton sanity", () => {
  it("exports a non-null view-model with display + subline strings", () => {
    expect(typeof LAST_QUOTE_TURNAROUND.display).toBe("string");
    expect(LAST_QUOTE_TURNAROUND.display.length).toBeGreaterThan(0);
    expect(typeof LAST_QUOTE_TURNAROUND.subline).toBe("string");
    expect(LAST_QUOTE_TURNAROUND.subline.length).toBeGreaterThan(0);
    expect(typeof LAST_QUOTE_TURNAROUND.isFresh).toBe("boolean");
  });
});

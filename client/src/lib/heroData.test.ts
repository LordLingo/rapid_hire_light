/*
  Tests for the data sources that drive the live hero mini-stats and the
  IntegrationsGrid. These guard against silent drift between the JSON
  source of truth and what the page components expect.
*/
import { describe, it, expect } from "vitest";
import heroStats from "../../../shared/hero-stats.json";
import integrationsData from "../../../shared/integrations.json";

type Cell = { label: string; value: string; hint: string };
type HeroStats = {
  windowLabel: string;
  updatedAt: string;
  pages: Record<string, Cell[]>;
};

type Integration = {
  name: string;
  mark: string;
  category: "ATS" | "HRIS" | "Payroll" | "CRM";
  status: "Live" | "Beta" | "Request";
  body: string;
};
type IntegrationsFile = {
  updatedAt: string;
  items: Integration[];
};

const REQUIRED_HERO_PAGES = [
  "about",
  "services",
  "pricing",
  "integrations",
  "contact",
  "support",
] as const;

describe("shared/hero-stats.json", () => {
  const data = heroStats as unknown as HeroStats;

  it("has every required page key", () => {
    for (const page of REQUIRED_HERO_PAGES) {
      expect(data.pages[page], `missing page: ${page}`).toBeDefined();
    }
  });

  it("each page has exactly 3 cells, each with label/value/hint", () => {
    for (const page of REQUIRED_HERO_PAGES) {
      const cells = data.pages[page];
      expect(cells.length, `${page} should have 3 cells`).toBe(3);
      for (const c of cells) {
        expect(c.label).toBeTypeOf("string");
        expect(c.value).toBeTypeOf("string");
        expect(c.hint).toBeTypeOf("string");
        expect(c.label.length).toBeGreaterThan(0);
        expect(c.value.length).toBeGreaterThan(0);
      }
    }
  });

  it("has a non-empty windowLabel + ISO-ish updatedAt", () => {
    expect(data.windowLabel.length).toBeGreaterThan(0);
    expect(data.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("shared/integrations.json", () => {
  const file = integrationsData as unknown as IntegrationsFile;

  it("has a non-empty list", () => {
    expect(file.items.length).toBeGreaterThanOrEqual(6);
  });

  it("provides at least 6 Live items so the hero grid never short-circuits", () => {
    const live = file.items.filter((i) => i.status === "Live");
    expect(live.length).toBeGreaterThanOrEqual(6);
  });

  it("every item has the fields the page consumes", () => {
    for (const item of file.items) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.mark.length).toBeGreaterThan(0);
      expect(item.mark.length).toBeLessThanOrEqual(4);
      expect(["ATS", "HRIS", "Payroll", "CRM"]).toContain(item.category);
      expect(["Live", "Beta", "Request"]).toContain(item.status);
      expect(item.body.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate integration names", () => {
    const names = file.items.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

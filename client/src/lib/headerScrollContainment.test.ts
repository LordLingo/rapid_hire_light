/**
 * §88: anti-regression for the Header Resources submenu scroll-chain fix.
 *
 * Bug: on short laptops and mobile, scrolling the Resources submenu (or the
 * mobile drawer) with the trackpad/wheel/touch leaked to the page behind it
 * once the menu had nothing more to scroll, because the menu surfaces had
 * neither a max-height cap nor `overscroll-behavior: contain`.
 *
 * Fix: both the desktop dropdown panel and the mobile sheet now cap their
 * height to the viewport and use `overscroll-contain` + `overflow-y-auto`,
 * which is the CSS contract that keeps wheel/touch events inside the
 * scroll boundary instead of chaining them to the page behind.
 *
 * This spec asserts the literal class strings are present in the source so
 * a future cosmetic refactor can't silently drop the containment.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HEADER_SRC = readFileSync(
  resolve(__dirname, "../components/site/Header.tsx"),
  "utf8",
);

describe("§88 — Resources submenu scroll containment", () => {
  it("desktop Resources panel caps height and contains overscroll", () => {
    // Find the className for the panel (data-testid='header-resources-panel').
    const panelMatch = HEADER_SRC.match(
      /data-testid="header-resources-panel"[\s\S]*?className="([^"]+)"/,
    );
    expect(panelMatch, "panel className not found").not.toBeNull();
    const panelClasses = panelMatch![1];
    expect(panelClasses).toContain("max-h-[calc(100vh-160px)]");
    expect(panelClasses).toContain("overflow-y-auto");
    expect(panelClasses).toContain("overscroll-contain");
  });

  it("mobile sheet caps height and contains overscroll", () => {
    const sheetMatch = HEADER_SRC.match(
      /data-testid="header-mobile-sheet"[\s\S]*?className="([^"]+)"/,
    );
    expect(sheetMatch, "mobile sheet className not found").not.toBeNull();
    const sheetClasses = sheetMatch![1];
    expect(sheetClasses).toContain("max-h-[calc(100vh-64px)]");
    expect(sheetClasses).toContain("overflow-y-auto");
    expect(sheetClasses).toContain("overscroll-contain");
  });

  it("both surfaces declare scrollbar-gutter:stable to avoid layout shift", () => {
    const panelMatch = HEADER_SRC.match(
      /data-testid="header-resources-panel"[\s\S]*?className="([^"]+)"/,
    );
    const sheetMatch = HEADER_SRC.match(
      /data-testid="header-mobile-sheet"[\s\S]*?className="([^"]+)"/,
    );
    expect(panelMatch![1]).toContain("[scrollbar-gutter:stable]");
    expect(sheetMatch![1]).toContain("[scrollbar-gutter:stable]");
  });
});

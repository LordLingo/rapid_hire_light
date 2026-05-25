/*
  §185 — Source-pin: main navigation hover/transition choreography.

  Pins the .nav-link-press utility definition + its application to:
    - NavLink (desktop primary route links)
    - ResourcesMenu trigger (the Resources dropdown trigger)
    - MobileNavLink color easing parity
  …so the entire main nav animates on the same cubic-bezier(0.23, 1,
  0.32, 1) curve as the .filter-chip-press chips and .hero-primary-cta
  buttons elsewhere on the site.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const HEADER = readFileSync(
  resolve(__dirname, "../components/site/Header.tsx"),
  "utf8",
);
const CSS = readFileSync(resolve(__dirname, "../index.css"), "utf8");

describe("§185 — Main nav hover/transition choreography", () => {
  it("defines .nav-link-press in index.css with the snappy curve", () => {
    // Locate the §185 block. Must exist and be inside @layer components.
    const idx = CSS.indexOf("§185");
    expect(idx, "§185 marker present in index.css").toBeGreaterThan(-1);
    const block = CSS.slice(idx, idx + 1400);

    // Color always transitions on the canonical curve — even when
    // reduced-motion is set — so the hover feel is consistent.
    expect(block).toMatch(
      /\.nav-link-press\s*\{[^}]*color\s+200ms\s+cubic-bezier\(0\.23,\s*1,\s*0\.32,\s*1\)/,
    );

    // Reduced-motion-gated lift adds transform to the transition list.
    expect(block).toMatch(/@media\s*\(prefers-reduced-motion:\s*no-preference\)/);
    expect(block).toMatch(
      /\.nav-link-press\s*\{[^}]*transform\s+200ms\s+cubic-bezier\(0\.23,\s*1,\s*0\.32,\s*1\)/,
    );

    // Hover applies translateY(-1px) — the chip-tier vertical lift.
    expect(block).toMatch(/\.nav-link-press:hover\s*\{[^}]*transform:\s*translateY\(-1px\)/);

    // Active resets the lift quickly.
    expect(block).toMatch(/\.nav-link-press:active\s*\{[^}]*translateY\(0/);
    expect(block).toMatch(/transition-duration:\s*110ms/);

    // Focus-visible carries an explicit ring so keyboard users get a
    // strong affordance even when the lift is suppressed.
    expect(block).toMatch(/\.nav-link-press:focus-visible\s*\{[^}]*box-shadow:/);
  });

  it("NavLink applies .nav-link-press and a 2.5px hover rail at 200ms", () => {
    // NavLink slice — anchored to the §185 marker comment.
    const idx = HEADER.indexOf("§185 — nav-link choreography upgraded");
    expect(idx, "NavLink §185 marker present").toBeGreaterThan(-1);
    const slice = HEADER.slice(idx, idx + 1800);

    // Class name is applied.
    expect(slice).toMatch(/"nav-link-press group/);

    // Old transition-colors phrasing replaced — the .nav-link-press
    // utility owns the color animation now, so callsites must not
    // duplicate the transition-colors directive on the NavLink itself.
    expect(slice).not.toMatch(/transition-colors duration-200 ease-out/);

    // Hover rail upgraded from h-[2px]/180ms → h-[2.5px]/200ms so it
    // matches the active rail visually mid-hover. Anchor on the
    // hover-rail testid to avoid matching the active rail accidentally.
    const hoverRailIdx = slice.indexOf("data-testid=\\\"nav-hover-rail\\\"") >= 0
      ? slice.indexOf("data-testid=\\\"nav-hover-rail\\\"")
      : slice.indexOf('data-testid="nav-hover-rail"');
    expect(hoverRailIdx, "nav-hover-rail span present").toBeGreaterThan(-1);
    const railSlice = slice.slice(hoverRailIdx, hoverRailIdx + 600);
    expect(railSlice).toMatch(/h-\[2\.5px\]/);
    expect(railSlice).toMatch(/scale-x-0/);
    expect(railSlice).toMatch(
      /duration-\[200ms\]\s+ease-\[cubic-bezier\(0\.23,1,0\.32,1\)\]/,
    );
  });

  it("ResourcesMenu trigger uses .nav-link-press for parity with NavLink", () => {
    const idx = HEADER.indexOf("data-testid=\"header-resources-trigger\"");
    expect(idx, "ResourcesMenu trigger present").toBeGreaterThan(-1);
    const slice = HEADER.slice(idx, idx + 900);

    expect(slice).toMatch(/"nav-link-press group/);
    // Same de-duplication: trigger class string must not also redeclare
    // transition-colors duration-200 ease-out.
    expect(slice).not.toMatch(/transition-colors duration-200 ease-out/);
  });

  it("ResourcesMenu hover rail also bumped to 2.5px / 200ms", () => {
    // The trigger has its own rail span. Find it via testid context.
    const idx = HEADER.indexOf("data-testid=\"header-resources-trigger\"");
    const slice = HEADER.slice(idx, idx + 1800);
    // Should have at least one hover rail using the upgraded
    // h-[2.5px] / 200ms snappy easing.
    expect(slice).toMatch(/h-\[2\.5px\][^"`]*duration-\[200ms\]/);
  });

  it("MobileNavLink color easing matches desktop (snappy curve, 200ms)", () => {
    const idx = HEADER.indexOf("function MobileNavLink");
    expect(idx, "MobileNavLink function present").toBeGreaterThan(-1);
    const slice = HEADER.slice(idx, idx + 1200);

    expect(slice).toMatch(
      /transition-colors duration-\[200ms\] ease-\[cubic-bezier\(0\.23,1,0\.32,1\)\]/,
    );
    // Hover should now actually swap the text color on mobile too —
    // it was previously a no-op (color only flipped via active state).
    expect(slice).toMatch(/hover:text-\[color:var\(--color-ink\)\]/);
  });
});

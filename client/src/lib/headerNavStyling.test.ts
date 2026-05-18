/*
  §136 — vitest pin: Header nav menu styling refresh.

  Locks the new pattern so a future copy-paste from another component
  can't quietly regress the nav back to the previous (lighter) typography
  or the abrupt static-underline indicator.

  Pinned facts (all read directly from Header.tsx source):
   - NavLink desktop typography is `text-[14px]` with `font-medium` on
     inactive items and `font-semibold` on active items (was 13.5px /
     regular).
   - NavLink renders an "active rail" 2.5px underline only when the
     route matches, AND a separate "hover rail" 2px underline that
     scales-X from 0 to 1 on group-hover/group-focus-visible.
   - The hover rail uses `transform-origin: center` (origin-center)
     so the underline grows from the midpoint of the label.
   - The hover rail transition is 180ms with the
     cubic-bezier(0.23, 1, 0.32, 1) "snappy ease-out" curve from the
     design-system animation guide.
   - The Resources dropdown trigger receives the same typography +
     animated rail treatment (parity with NavLink), AND its hover rail
     stays expanded while the panel is open (`scale-x-100`) so closing
     the panel doesn't feel like the link "un-hits".
   - The desktop Get-a-Quote CTA uses font-semibold, has a resting
     shadow that ramps on hover, uses `hover:-translate-y-px` for a 1px
     hover lift, and translates its arrow icon 0.5 on hover.
   - Both CTA pills (Sign in + Get a Quote) sit at the same vertical
     metrics (px-5 py-2.5 text-[13.5px]) so the two read as siblings.

  These cover both the "tighter typography + animated underline +
  stronger active indicator" goal and the "premium Get-a-Quote pill"
  goal called out in §136.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const HEADER_PATH = path.resolve(
  __dirname,
  "..",
  "components",
  "site",
  "Header.tsx",
);
const SRC = fs.readFileSync(HEADER_PATH, "utf8");

describe("§136 — Header nav menu styling refresh", () => {
  describe("NavLink (desktop primary nav)", () => {
    it("uses 14px / font-medium / tracking-tight on inactive items", () => {
      // The NavLink className opens with the typography string we pin.
      expect(SRC).toMatch(
        /group relative whitespace-nowrap text-\[14px\] tracking-tight transition-colors duration-200 ease-out/,
      );
      // Inactive branch carries font-medium so unselected nav items have
      // visible weight (the previous default-weight was too quiet).
      expect(SRC).toMatch(
        /font-medium text-\[color:var\(--color-ink-soft\)\] hover:text-\[color:var\(--color-ink\)\] focus-visible:text-\[color:var\(--color-ink\)\]/,
      );
    });

    it("uses font-semibold for the active route (stronger than the previous font-medium)", () => {
      expect(SRC).toMatch(/font-semibold text-\[color:var\(--color-ink\)\]/);
    });

    it("renders a 2.5px active rail only when the route matches", () => {
      // The active-rail span carries data-testid and 2.5px height; pin both.
      expect(SRC).toMatch(/data-testid="nav-active-rail"/);
      expect(SRC).toMatch(
        /h-\[2\.5px\] rounded-full bg-\[color:var\(--color-accent-ink\)\]/,
      );
    });

    it("renders a separate hover rail that scales from 0 to 1 on hover/focus-visible", () => {
      expect(SRC).toMatch(/data-testid="nav-hover-rail"/);
      // The default state is scale-x-0; hover/focus-visible expand it.
      expect(SRC).toMatch(
        /scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100/,
      );
    });

    it("hover rail grows from center (origin-center) and uses the snappy 180ms ease-out curve", () => {
      expect(SRC).toMatch(/origin-center/);
      // `duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)]` per the
      // design-system animation guide.
      expect(SRC).toMatch(
        /transition-transform duration-\[180ms\] ease-\[cubic-bezier\(0\.23,1,0\.32,1\)\]/,
      );
    });
  });

  describe("Resources dropdown trigger", () => {
    it("matches NavLink's typography (14px / font-medium / font-semibold-when-active)", () => {
      /*
        Two occurrences of the typography string are expected: once on
        NavLink, once on the Resources trigger. The classNames between
        "group relative" and "whitespace-nowrap" differ across the two:
         - NavLink: `group relative whitespace-nowrap ...` (no extra)
         - Resources trigger: `group relative inline-flex items-center
           gap-1 whitespace-nowrap ...`
        We accept either via `[^"]*?` (non-greedy, single-line, anything
        but a closing quote so we don't accidentally span across
        adjacent className strings).
      */
      const matches = SRC.match(
        /group relative[^"]*?whitespace-nowrap text-\[14px\] tracking-tight transition-colors duration-200 ease-out/g,
      );
      expect(matches).not.toBeNull();
      expect((matches as RegExpMatchArray).length).toBeGreaterThanOrEqual(2);
    });

    it("hover rail stays expanded (scale-x-100) while the dropdown panel is open", () => {
      // The trigger's hover rail toggles based on `isOpen` so closing the
      // panel doesn't make the link feel like it "un-hit". Pin the
      // ternary'd scale-x-100 path.
      expect(SRC).toMatch(
        /isOpen[\s\S]*?\?\s*"scale-x-100"\s*:\s*"scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"/,
      );
    });

    it("active rail on the trigger is 2.5px (matches NavLink) and uses the accent-ink token", () => {
      // The trigger's active rail mirrors NavLink's; pin the same height.
      const occurrences = SRC.match(
        /h-\[2\.5px\] rounded-full bg-\[color:var\(--color-accent-ink\)\]/g,
      );
      expect(occurrences).not.toBeNull();
      expect((occurrences as RegExpMatchArray).length).toBeGreaterThanOrEqual(
        2,
      );
    });
  });

  describe("Get-a-Quote desktop CTA — premium pill", () => {
    it("uses font-semibold (was font-medium previously)", () => {
      // Match the desktop Get-a-Quote className block specifically by
      // anchoring on data-testid="header-get-a-quote" + font-semibold.
      expect(SRC).toMatch(
        /data-testid="header-get-a-quote"[\s\S]*?font-semibold text-white/,
      );
    });

    it("has a resting shadow that ramps stronger on hover", () => {
      expect(SRC).toMatch(
        /shadow-\[0_2px_8px_-2px_rgba\(15,23,42,0\.18\)\]/,
      );
      expect(SRC).toMatch(
        /hover:shadow-\[0_8px_22px_-6px_rgba\(15,23,42,0\.28\)\]/,
      );
    });

    it("lifts 1px on hover (hover:-translate-y-px)", () => {
      expect(SRC).toMatch(/hover:-translate-y-px/);
    });

    it("translates its arrow 0.5 on hover (group-hover/cta:translate-x-0.5)", () => {
      // The arrow span uses a named hover group so translating it doesn't
      // affect the surrounding pill metrics.
      expect(SRC).toMatch(/group\/cta/);
      expect(SRC).toMatch(/group-hover\/cta:translate-x-0\.5/);
    });

    it("has a visible focus-visible ring (accessibility)", () => {
      expect(SRC).toMatch(
        /focus-visible:ring-\[color:var\(--color-accent-ink\)\]/,
      );
      expect(SRC).toMatch(/focus-visible:ring-offset-2/);
    });
  });

  describe("Sign in CTA — secondary pill", () => {
    it("matches the Get-a-Quote pill's vertical metrics (px-5 py-2.5 text-[13.5px])", () => {
      // The two desktop CTAs sit side-by-side; equal padding/text size
      // makes them read as siblings.
      expect(SRC).toMatch(
        /data-testid="header-signin"[\s\S]*?px-5 py-2\.5 text-\[13\.5px\]/,
      );
    });

    it("subtly fills its background on hover (hover:bg-[color:var(--color-paper-soft)])", () => {
      expect(SRC).toMatch(
        /data-testid="header-signin"[\s\S]*?hover:bg-\[color:var\(--color-paper-soft\)\]/,
      );
    });
  });
});

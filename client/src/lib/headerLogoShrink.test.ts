/*
 * §194 source-pin spec — desktop header logo flex-shrink contract.
 *
 * Bug: the header logo was rendering as ~12px-wide vertical stripes
 * because the template's customized .flex default sets min-width: 0
 * on flex children. With the desktop nav competing for horizontal
 * space (Sign in pill + Get-a-Quote pill + Resources dropdown +
 * eight nav links + gap-7 spacing), the flex algorithm shrunk the
 * leftmost flex item — the Logo Link wrapper — past its content,
 * collapsing the <img> to a sliver of its intrinsic width.
 *
 * Fix: the desktop logo Link wrapper now carries `shrink-0` so the
 * flex algorithm refuses to shrink it. The mobile sheet logo
 * already used `inline-flex` inside a grid parent and was unaffected.
 *
 * This spec locks the contract so future Header refactors don't
 * silently re-introduce the regression.
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

describe("§194 — desktop header logo Link wrapper has shrink-0 to prevent flex squeeze", () => {
  it("Header.tsx desktop logo Link uses `flex shrink-0 items-center gap-3`", () => {
    const src = read("client/src/components/site/Header.tsx");
    // §194: the desktop logo Link sits in a flex row with the entire
    // nav (gap-7, multiple buttons, sign-in pill, quote pill). Without
    // shrink-0 on this Link the flex algorithm collapses it to ~12px,
    // turning the vertical 1100x750 lockup into vertical stripes.
    expect(src).toMatch(/className="flex shrink-0 items-center gap-3"/);
  });

  it("Header.tsx desktop logo Link is followed by `<Logo />` (i.e., wraps the desktop logo, not some other item)", () => {
    const src = read("client/src/components/site/Header.tsx");
    // §194: pin that the shrink-0 Link is the actual logo wrapper,
    // not some other flex child.
    expect(src).toMatch(
      /className="flex shrink-0 items-center gap-3"[\s\S]{0,200}<Logo \/>/,
    );
  });

  it("Header.tsx mobile sheet logo Link uses inline-flex and does NOT need shrink-0", () => {
    const src = read("client/src/components/site/Header.tsx");
    // §194: the mobile sheet logo lives in a grid parent with
    // self-start alignment + inline-flex on the Link. Grid auto-
    // tracks size to content unless explicitly told otherwise, so
    // the squeeze bug doesn't apply here. Pin the inline-flex to
    // make sure a future refactor doesn't accidentally swap it for
    // a flex parent and reintroduce the bug.
    expect(src).toMatch(
      /href="\/"\s*\n\s+onClick=\{[^}]+\}\s*\n\s+aria-label=\{`\$\{BRAND_NAME\} home`\}\s*\n\s+className="-mt-1 mb-1 inline-flex items-center self-start"/,
    );
  });

  it("the parent flex row of the desktop logo uses `flex items-center justify-between gap-6 py-4 md:py-5`", () => {
    const src = read("client/src/components/site/Header.tsx");
    // §194: the squeeze bug surfaces because this row is `flex
    // justify-between` with a wide nav competing for space. Pin the
    // exact parent classes so we know our shrink-0 fix is targeting
    // the right flex context.
    expect(src).toMatch(
      /className="flex items-center justify-between gap-6 py-4 md:py-5"/,
    );
  });
});

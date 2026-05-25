/*
  §170 — Services page "What's included" wrapped-text alignment pin.

  Each card on /services renders a compact "What's included" list using
  an em-dash bullet inline with the text. In narrow columns the items
  wrap, and without a hanging indent the wrapped continuation drops to
  the left margin (under the dash) rather than tucking under the text.

  This pin guards the hanging-indent fix:

    1. Em-dash bullets are still rendered inline (we did not switch to
       a flex-row split, which would change the visual character).
    2. The list item carries the canonical hanging-indent classes
       `pl-[1.4em]` and `-indent-[1.4em]` so wrapped lines align.
    3. The pl- value and -indent- value are equal-magnitude so the
       wrap rail sits exactly under the text-start, not offset.

  These keep a future "tidy the className" pass from quietly removing
  the indent and reintroducing the broken wrap behavior.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SERVICES_PATH = resolve(
  __dirname,
  "..",
  "pages",
  "Services.tsx",
);
const SERVICES_SRC = readFileSync(SERVICES_PATH, "utf8");

describe("§170 — Services /services What's Included hanging-indent", () => {
  it("renders the em-dash bullet inline (we did not switch to a flex-row split)", () => {
    // The bullet pattern is `— {item}` literally inside the <li> body.
    expect(SERVICES_SRC).toMatch(/—\s*\{item\}/);
  });

  it("the includes <li> carries the hanging-indent classes pl-[1.4em] and -indent-[1.4em]", () => {
    // Pull the includes <li> render block and confirm both classes are present.
    const liBlock = SERVICES_SRC.match(
      /\{s\.includes\.map\(\(item\) => \(([\s\S]*?)\)\)\}/,
    );
    expect(liBlock, "includes <li> map block must exist").not.toBeNull();
    const blockSrc = liBlock?.[1] ?? "";
    expect(blockSrc).toMatch(/pl-\[1\.4em\]/);
    expect(blockSrc).toMatch(/-indent-\[1\.4em\]/);
  });

  it("hanging-indent magnitudes match (pl == -indent), so the wrap rail aligns under the text-start", () => {
    // Surface the both arbitrary values and assert they match. If a future
    // refactor changes one to e.g. pl-[1.5em] but leaves -indent-[1.4em],
    // wrapped text would offset by 0.1em and this guard would catch it.
    const pl = SERVICES_SRC.match(/pl-\[(\d+(?:\.\d+)?)em\]/);
    const indent = SERVICES_SRC.match(/-indent-\[(\d+(?:\.\d+)?)em\]/);
    expect(pl?.[1], "pl-[…em] must be set on the includes <li>").toBeDefined();
    expect(
      indent?.[1],
      "-indent-[…em] must be set on the includes <li>",
    ).toBeDefined();
    expect(pl?.[1]).toBe(indent?.[1]);
  });

  it("the includes <li> body still uses leading-snug + ink-soft so visual density is unchanged", () => {
    const liBlock = SERVICES_SRC.match(
      /\{s\.includes\.map\(\(item\) => \(([\s\S]*?)\)\)\}/,
    );
    const blockSrc = liBlock?.[1] ?? "";
    expect(blockSrc).toMatch(/leading-snug/);
    expect(blockSrc).toMatch(/text-\[color:var\(--color-ink-soft\)\]/);
  });
});

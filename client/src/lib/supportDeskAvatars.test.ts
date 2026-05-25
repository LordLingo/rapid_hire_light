/*
  §56 — Support page Desk roster avatars.

  The four Desk cards on /support used to render initials inside a
  tinted blue circle. They now render real portrait avatars (AI-
  generated headshots) inside the same envelope so the team reads
  as people, not placeholders. These pins lock down:
    - every TEAM entry carries a non-empty `avatar` field that points
      at the webdev CDN (so a future re-upload changes one place)
    - each of the four members maps to its own unique avatar URL
      (anti-regression: a copy-paste mistake that puts the same face
      on multiple cards would fail this test)
    - the rendered markup uses an <img> with object-cover inside the
      original `size-14 rounded-full` envelope, NOT the previous
      `{person.initials}` text node
    - §173: the user explicitly opted to remove BOTH placeholder
      disclaimers (the visible italic paragraph below the team grid
      AND the FAQ entry titled "Is this page describing your real
      team?") with the understanding that the placeholder names + AI
      portraits stay in place until a real roster swap. These pins
      flip from "disclaimer must be present" to "disclaimer must be
      absent" so a future edit can't silently re-introduce the old
      copy.
*/
import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

const ROOT = path.resolve(__dirname, "../../..");
const supportSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Support.tsx"),
  "utf8",
);

describe("Support Desk avatars (§56)", () => {
  it("Specialist type carries a required `avatar` field", () => {
    expect(supportSrc).toMatch(
      /type Specialist = \{[\s\S]*?\bavatar: string;[\s\S]*?\};/,
    );
  });

  it("each TEAM member has its own non-empty avatar URL on the webdev CDN", () => {
    // Pull every avatar URL literal in the TEAM array. We expect
    // exactly four — one per member. Each must be a non-empty
    // https:// URL pointing at the webdev cloudfront host.
    const matches = supportSrc.match(/avatar:\s*\n?\s*"(https:\/\/[^"]+)"/g) ?? [];
    expect(matches.length).toBe(4);
    for (const m of matches) {
      expect(m).toMatch(
        /avatar:\s*\n?\s*"https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/[^"]+\.(webp|png)"/,
      );
    }
  });

  it("the four avatar URLs are unique (no copy-paste duplicates)", () => {
    const re = /avatar:\s*\n?\s*"(https:\/\/[^"]+)"/g;
    const urls: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(supportSrc)) !== null) urls.push(m[1]);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.length).toBe(4);
  });

  it("each named Desk member is paired with its own dedicated portrait", () => {
    // Anti-regression on the mapping itself: if someone re-orders
    // the TEAM array, the pin should still ensure each name is
    // adjacent to a unique avatar URL. We assert each named
    // member's block contains an avatar literal.
    for (const name of ["Jordan M.", "Maya T.", "Priya S.", "Tyler R."]) {
      const idx = supportSrc.indexOf(name);
      expect(idx, `name not found: ${name}`).toBeGreaterThan(-1);
      // Look at the 600 chars BEFORE the name (the avatar literal
      // sits above it in the same object literal).
      const window = supportSrc.slice(Math.max(0, idx - 600), idx);
      expect(window, `no avatar URL above ${name}`).toMatch(
        /avatar:\s*\n?\s*"https:\/\/[^"]+"/,
      );
    }
  });

  it("renders an <img data-testid='desk-avatar'> inside a size-14 rounded-full envelope", () => {
    // The outer envelope is unchanged: same size-14, same rounded-full.
    // The <img> is decorative (alt="" + aria-hidden on the wrapper).
    expect(supportSrc).toMatch(
      /aria-hidden\s*\n?\s*className="size-14 shrink-0 overflow-hidden rounded-full[^"]*"/,
    );
    expect(supportSrc).toMatch(
      /<img\s+src=\{person\.avatar\}\s+alt=""[\s\S]*?data-testid="desk-avatar"/,
    );
    expect(supportSrc).toMatch(/object-cover/);
  });

  it("removed the previous initials text node from the badge", () => {
    // Anti-regression: the `{person.initials}` JSX expression that
    // used to live inside the badge must be gone, otherwise we'd
    // render initials on top of (or instead of) the portrait.
    expect(supportSrc).not.toMatch(/>\s*\{person\.initials\}\s*</);
  });

  it("§173 — visible italic placeholder disclaimer is removed", () => {
    // The italic paragraph that used to sit below the team grid is
    // gone. Both the original ("Names shown are placeholders…") and
    // the expanded ("Names and photos shown are placeholders…")
    // wordings must be absent so a future visual-editor edit cannot
    // silently restore either.
    expect(supportSrc).not.toMatch(
      /Names and photos shown are placeholders/,
    );
    expect(supportSrc).not.toMatch(
      /^\s*Names shown are placeholders for this preview/m,
    );
  });

  it("§173 — placeholder-disclosure FAQ entry is removed", () => {
    // The FAQ entry titled "Is this page describing your real team?"
    // is also gone. We pin both the question text and a distinctive
    // phrase from the answer so neither half can silently return.
    expect(supportSrc).not.toMatch(
      /Is this page describing your real team\?/,
    );
    expect(supportSrc).not.toMatch(/fabricate identities/);
  });
});

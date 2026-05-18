/*
  §107 — Footer "Client Login" routes to the client portal

  The Portals column in `Footer.tsx` previously rendered "Client Login"
  as a placeholder <button> that fired a "preview only" toast. After
  §107 it must render as a real <a> pointing at
  https://clients.rapidhiresolutions.com/, opening in a new tab with
  rel="noopener noreferrer".

  We assert against the source so the invariant is the cheapest possible
  guard against accidental rewires (e.g. someone deleting the `external`
  field, or the URL drifting after a portal migration).
*/

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FOOTER = readFileSync(
  resolve(__dirname, "..", "components", "site", "Footer.tsx"),
  "utf8",
);

const PORTAL_URL = "https://clients.rapidhiresolutions.com/";

describe("§107 footer Client Login routing", () => {
  it("Client Login carries an external href to the client portal", () => {
    expect(FOOTER).toMatch(
      new RegExp(
        `label:\\s*"Client Login"[\\s\\S]*?external:\\s*"${PORTAL_URL.replace(
          /\//g,
          "\\/",
        ).replace(/\./g, "\\.")}"`,
      ),
    );
  });

  it("Client Login is no longer the placeholder-only entry it used to be", () => {
    // Old shape: { label: "Client Login" } with no `to` and no `external`.
    // That literal must not survive in source.
    expect(FOOTER).not.toMatch(/\{\s*label:\s*"Client Login"\s*\}/);
  });
});

describe("§107 FooterItem external rendering", () => {
  it("declares an `external` field on FooterItem", () => {
    expect(FOOTER).toMatch(/external\?:\s*string/);
  });

  it("renders external entries as <a target=_blank rel=noopener noreferrer>", () => {
    // Match the JSX branch that handles `it.external`.
    const branch = FOOTER.match(
      /it\.external\s*\?\s*[\s\S]*?<a[\s\S]*?href=\{it\.external\}[\s\S]*?<\/a>/,
    );
    expect(branch).toBeTruthy();
    const block = branch![0];
    expect(block).toContain('target="_blank"');
    expect(block).toContain('rel="noopener noreferrer"');
  });

  it("preserves the toast-fallback for entries with neither `to` nor `external`", () => {
    // The escape-hatch branch is still useful for future preview-only
    // entries; we want to keep the third arm of the ternary intact.
    expect(FOOTER).toMatch(/onClick=\{\(\) => toast\(`\$\{it\.label\} \u2014 preview only`\)\}/);
  });
});

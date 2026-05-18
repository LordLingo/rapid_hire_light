/*
  Spec: pin the header logo + mobile sheet brand. The brand owner supplied a
  color Rapid Hire Solutions lockup (rhs-color-logo). The URL now lives in
  @shared/brand so the test imports it directly and can't drift.

  Assertions:
    - HEADER_LOGO_URL points at the webdev static host (/manus-storage/...).
    - Header.tsx imports + uses that exact constant.
    - The brand <Link> in the desktop nav routes to "/" with proper
      aria-label.
    - The mobile sheet renders an <img src={HEADER_LOGO_URL}> at the top so
      the brand stays visible while the menu is open on small screens.
    - The old inline-SVG ring + "Rapid Hire / Solutions" text mark is gone.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { BRAND_NAME, HEADER_LOGO_URL } from "@shared/brand";

const ROOT = path.resolve(__dirname, "../../..");
function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Header brand logo", () => {
  const src = read("client/src/components/site/Header.tsx");

  it("HEADER_LOGO_URL points at the webdev static host", () => {
    // §127: brand owner supplied a new color lockup (rapid-hire-logo).
    // The constraint is that the asset must be served from /manus-storage/
    // (the webdev static host) and end in .png; the specific filename slug
    // is allowed to change whenever the brand asset is re-uploaded.
    expect(HEADER_LOGO_URL).toMatch(
      /^\/manus-storage\/[a-zA-Z0-9._-]+\.png$/,
    );
  });

  it("Header.tsx imports HEADER_LOGO_URL + BRAND_NAME from @shared/brand", () => {
    expect(src).toMatch(
      /import\s*\{[^}]*HEADER_LOGO_URL[^}]*\}\s*from\s*"@shared\/brand"/,
    );
    expect(src).toMatch(
      /import\s*\{[^}]*BRAND_NAME[^}]*\}\s*from\s*"@shared\/brand"/,
    );
  });

  it("renders the supplied logo as an <img> with BRAND_NAME alt text", () => {
    expect(src).toMatch(/src=\{HEADER_LOGO_URL\}/);
    expect(src).toMatch(/alt=\{BRAND_NAME\}/);
    expect(BRAND_NAME).toBe("Rapid Hire Solutions");
  });

  it("keeps the brand link pointed at the homepage with aria-label", () => {
    expect(src).toMatch(/href="\/"/);
    expect(src).toMatch(/aria-label=\{`\$\{BRAND_NAME\} home`\}/);
  });

  it("renders the brand mark inside the mobile menu sheet", () => {
    // The sheet is gated behind {open && (...)} — assert that the sheet
    // block contains a logo <img> AND a self-closing onClick that resets
    // `open` so tapping the brand also closes the menu.
    const sheet = src.split("{/* Mobile sheet */}")[1] ?? "";
    expect(sheet.length).toBeGreaterThan(80);
    expect(sheet).toMatch(/src=\{HEADER_LOGO_URL\}/);
    expect(sheet).toMatch(/onClick=\{\(\)\s*=>\s*setOpen\(false\)\}/);
  });

  it("removes the placeholder inline SVG mark and old wordmark text", () => {
    expect(src).not.toContain('viewBox="0 0 34 34"');
    expect(src).not.toMatch(/Rapid Hire\s*<\/span>/);
  });
});

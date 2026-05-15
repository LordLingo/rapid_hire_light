/*
  Spec: pin the footer logo. The brand owner supplied a white Rapid Hire
  Solutions logo (rhs-white-logo) that lives on the webdev static host. The
  URL itself now lives in @shared/brand, so this test imports the constant
  directly — Footer.tsx and the test can never drift out of sync.

  Assertions:
    - FOOTER_LOGO_URL points at the webdev static host (/manus-storage/...).
    - Footer.tsx imports + uses that exact constant.
    - Brand <Link> still routes to "/" with proper aria-label + alt text.
    - The old inline-SVG placeholder mark is gone.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { BRAND_NAME, FOOTER_LOGO_URL } from "@shared/brand";

const ROOT = path.resolve(__dirname, "../../..");
function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Footer brand logo", () => {
  const src = read("client/src/components/site/Footer.tsx");

  it("FOOTER_LOGO_URL points at the webdev static host", () => {
    expect(FOOTER_LOGO_URL).toMatch(
      /^\/manus-storage\/rhs-white-logo_[a-z0-9]+\.png$/,
    );
  });

  it("Footer.tsx imports FOOTER_LOGO_URL + BRAND_NAME from @shared/brand", () => {
    expect(src).toMatch(
      /import\s*\{[^}]*FOOTER_LOGO_URL[^}]*\}\s*from\s*"@shared\/brand"/,
    );
    expect(src).toMatch(
      /import\s*\{[^}]*BRAND_NAME[^}]*\}\s*from\s*"@shared\/brand"/,
    );
  });

  it("renders the supplied logo as an <img> with brand alt text", () => {
    expect(src).toMatch(/src=\{FOOTER_LOGO_URL\}/);
    expect(src).toMatch(/alt=\{BRAND_NAME\}/);
    expect(BRAND_NAME).toBe("Rapid Hire Solutions");
  });

  it("keeps the brand link pointed at the homepage", () => {
    expect(src).toMatch(/<Link\s+href="\/"/);
  });

  it("removes the placeholder inline SVG mark", () => {
    expect(src).not.toContain('viewBox="0 0 34 34"');
  });
});

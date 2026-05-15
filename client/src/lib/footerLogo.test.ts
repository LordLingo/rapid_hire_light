/*
  Spec: pin the footer logo. The brand owner supplied a white Rapid Hire
  Solutions logo (rhs-white-logo) that lives on the webdev static host. We
  read the Footer source and assert:

    - the placeholder inline SVG mark is gone (no <svg viewBox="0 0 34 34"
      block in the file);
    - the new logo URL constant is present and references /manus-storage/;
    - the brand <Link> still routes to "/" and the <img> uses the proper
      alt text for screen readers.

  Static-text assertions are intentional — these are quick, deterministic
  guards against a copy-edit accidentally regressing the brand block.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../../..");
function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Footer brand logo", () => {
  const src = read("client/src/components/site/Footer.tsx");

  it("exposes a FOOTER_LOGO_URL pointing at the webdev static host", () => {
    expect(src).toMatch(
      /const FOOTER_LOGO_URL\s*=\s*"\/manus-storage\/rhs-white-logo_[a-z0-9]+\.png"/,
    );
  });

  it("renders the supplied logo as an <img> with brand alt text", () => {
    expect(src).toMatch(/src=\{FOOTER_LOGO_URL\}/);
    expect(src).toMatch(/alt="Rapid Hire Solutions"/);
  });

  it("keeps the brand link pointed at the homepage", () => {
    expect(src).toMatch(/<Link\s+href="\/"/);
  });

  it("removes the placeholder inline SVG mark", () => {
    expect(src).not.toContain('viewBox="0 0 34 34"');
  });
});

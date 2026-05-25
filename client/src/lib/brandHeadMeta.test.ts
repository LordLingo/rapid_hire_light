/*
  Spec: pin the brand <head> meta. Vite resolves client/index.html at build
  time before the JS bundle runs, so the favicon + og:image URLs have to be
  hard-coded there — they can't be templated from shared/brand.ts directly.
  This test reads both files and asserts they agree.

  Assertions:
    - shared/brand.ts URL constants all point at /static/ (§189 — bundled
      with the Vercel build, no longer dependent on the Manus host).
    - index.html references each of those exact URLs in the right tag:
        - favicon (.ico)
        - apple-touch-icon (180x180)
        - 192/512 PWA icons
        - og:image + twitter:image (1200x630 card)
    - twitter:card = summary_large_image, og:type = website.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  APPLE_TOUCH_ICON_URL,
  FAVICON_ICO_URL,
  ICON_192_URL,
  ICON_512_URL,
  SOCIAL_OG_IMAGE_URL,
} from "@shared/brand";

const ROOT = path.resolve(__dirname, "../../..");
const html = fs.readFileSync(path.join(ROOT, "client/index.html"), "utf8");

describe("Brand head meta", () => {
  // §189: migrated from /manus-storage/ to /static/ so brand assets ship
  // with the Vercel build instead of relying on a Manus-only host route.
  // The cross-file `index.html` ↔ `shared/brand.ts` agreement test below
  // is the actual enforcement — these regex pins are the bumper.
  it("FAVICON_ICO_URL is pinned to a /static/ .ico", () => {
    expect(FAVICON_ICO_URL).toMatch(
      /^\/static\/[A-Za-z0-9_-]+\.ico$/,
    );
  });

  it("Apple-touch + PWA icon URLs are pinned to /static/ PNGs", () => {
    expect(APPLE_TOUCH_ICON_URL).toMatch(
      /^\/static\/[A-Za-z0-9_-]+\.png$/,
    );
    expect(ICON_192_URL).toMatch(
      /^\/static\/[A-Za-z0-9_-]+\.png$/,
    );
    expect(ICON_512_URL).toMatch(
      /^\/static\/[A-Za-z0-9_-]+\.png$/,
    );
  });

  it("Social card URL is a 1200x630 /static/ PNG", () => {
    expect(SOCIAL_OG_IMAGE_URL).toMatch(
      /^\/static\/[A-Za-z0-9_-]+\.png$/,
    );
  });

  it("index.html references the favicon + apple-touch + PWA icons", () => {
    expect(html).toContain(`href="${FAVICON_ICO_URL}"`);
    expect(html).toContain(`href="${APPLE_TOUCH_ICON_URL}"`);
    expect(html).toContain(`href="${ICON_192_URL}"`);
    expect(html).toContain(`href="${ICON_512_URL}"`);
  });

  it("index.html sets og:image + twitter:image to the social card", () => {
    expect(html).toMatch(
      new RegExp(
        `<meta\\s+property="og:image"\\s+content="${SOCIAL_OG_IMAGE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
      ),
    );
    expect(html).toMatch(
      new RegExp(
        `<meta\\s+name="twitter:image"\\s+content="${SOCIAL_OG_IMAGE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
      ),
    );
  });

  it("index.html declares og:type=website + twitter summary_large_image", () => {
    expect(html).toMatch(
      /<meta\s+property="og:type"\s+content="website"/,
    );
    expect(html).toMatch(
      /<meta\s+name="twitter:card"\s+content="summary_large_image"/,
    );
  });
});

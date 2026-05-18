/*
  Single source of truth for brand assets and identity strings.

  Why this file exists
  --------------------
  The Header and Footer used to each define their own logo URL constant. That's
  fine when there's exactly one brand asset, but the moment we add a third
  surface (mobile menu sheet, OG card, favicon, email template…) the URLs start
  drifting. This module centralizes:

    - HEADER_LOGO_URL ........ color lockup, used on light surfaces
    - FOOTER_LOGO_URL ........ white lockup, used on dark surfaces
    - SOCIAL_OG_IMAGE_URL .... 1200x630 brand card for og:image / twitter:image
    - APPLE_TOUCH_ICON_URL ... 180x180 png used by iOS home-screen
    - BRAND_NAME, BRAND_TAGLINE, BRAND_HOME_HREF .... copy + nav constants

  Both consuming files (Header, Footer) and their vitest pins import the
  exact same constant, so a future swap touches only this file.
*/

// Brand mark URLs — hosted on the webdev static host. Re-upload via
// `manus-upload-file --webdev <path>` and replace the URL here when the
// asset changes; the corresponding *.test.ts files will fail loudly if the
// constant ever drifts away from "/manus-storage/...".
export const HEADER_LOGO_URL = "/manus-storage/rhs3-color-trimmed_6ea6f63b.png";
export const FOOTER_LOGO_URL = "/manus-storage/rhs3-white_0e0ccecf.png";

// Homepage hero key visual. Marketing photograph supplied by the brand owner
// (woman + laptop showing a sample report). Two crops are served via a
// <picture> element so the baked-in copy stays legible at every viewport:
//   - Desktop (>= sm): 5:4 crop, vertical dead space trimmed (1254x1003).
//   - Mobile (< sm):   original 1:1 source so neither baked-in copy region
//                      gets clipped on a narrow phone screen.
//
// Each crop is encoded three ways for `<picture>` source negotiation:
//   AVIF (best compression on modern browsers) -> WebP (broad support) ->
//   PNG (universal fallback / used by the <img> element). The PNG URLs
//   below remain the canonical "truth" of which crop is which; the AVIF
//   and WebP variants are produced by `webdev-static-assets/encode_hero_modern.py`.
export const HOME_HERO_IMAGE_URL =
  "/manus-storage/rhs-home-hero-desktop_463c89fa.png";
export const HOME_HERO_IMAGE_URL_AVIF =
  "/manus-storage/rhs-home-hero-desktop_ad433090.avif";
export const HOME_HERO_IMAGE_URL_WEBP =
  "/manus-storage/rhs-home-hero-desktop_ba3383b8.webp";
export const HOME_HERO_IMAGE_URL_MOBILE =
  "/manus-storage/rhs-home-hero_16a035cf.png";
export const HOME_HERO_IMAGE_URL_MOBILE_AVIF =
  "/manus-storage/rhs-home-hero_2d59da93.avif";
export const HOME_HERO_IMAGE_URL_MOBILE_WEBP =
  "/manus-storage/rhs-home-hero_017a8af6.webp";

// Social/share preview card. 1200x630 PNG that composes the color mark on a
// branded background. Wired into <head> via index.html.
export const SOCIAL_OG_IMAGE_URL = "/manus-storage/rhs3-og-card_f132b62c.png";

// Browser tab favicon. Multi-size .ico (16/32/48/64) generated from the
// color mark only — the wordmark is unreadable at favicon scale.
export const FAVICON_ICO_URL = "/manus-storage/rhs3-favicon_cb9100cf.ico";

// iOS home-screen icon. 180x180 PNG, transparent background, color mark
// only (no wordmark — too small to read at 60pt).
export const APPLE_TOUCH_ICON_URL = "/manus-storage/rhs3-apple-touch-icon_6f21e930.png";

// Android / PWA maskable icons. 192 + 512 PNGs from the same source.
export const ICON_192_URL = "/manus-storage/rhs3-icon-192_1a960af3.png";
export const ICON_512_URL = "/manus-storage/rhs3-icon-512_8b000206.png";

// Identity strings — kept here so a name/tagline change can't drift between
// the header link, the footer link, and the document <title>/meta tags.
export const BRAND_NAME = "Rapid Hire Solutions" as const;
export const BRAND_HOME_HREF = "/" as const;
export const BRAND_TAGLINE_SHORT =
  "The trusted standard in background checks." as const;

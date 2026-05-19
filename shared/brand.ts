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
export const HEADER_LOGO_URL = "/manus-storage/rhs5-color-trimmed_5cbbb11f.png";
export const FOOTER_LOGO_URL = "/manus-storage/rhs5-white_4026a964.png";

// Homepage hero key visual. §142 — swapped to the new SPA brand artwork
// supplied by the brand owner. The image composes the Rapid Hire Solutions
// wordmark, the SPA acronym (Speed / Price / Accuracy), the "You relax
// while we do the work" tagline, and a service strip (Staffing / Recruiting
// / Temp-to-Hire / Direct Hire) over a serene resort/spa scene. Because the
// artwork carries baked-in copy, two crops are served via a `<picture>`
// element so legibility holds at every viewport:
//   - Desktop (>= sm): 5:4 center crop, sliver trimmed from each side
//                      (1254x1003).
//   - Mobile (< sm):   centered 1:1 crop so neither the SPA pillars nor
//                      the service strip get clipped on a narrow phone
//                      screen (1254x1254).
//
// Each crop is encoded three ways for `<picture>` source negotiation:
//   AVIF (best compression on modern browsers) -> WebP (broad support) ->
//   PNG (universal fallback / used by the <img> element). The PNG URLs
//   below remain the canonical "truth" of which crop is which; all six
//   variants are produced by `webdev-static-assets/build_spa_hero.py`.
export const HOME_HERO_IMAGE_URL =
  "/manus-storage/spa-hero-desktop_980e0ed2.png";
export const HOME_HERO_IMAGE_URL_AVIF =
  "/manus-storage/spa-hero-desktop_4bda91fd.avif";
export const HOME_HERO_IMAGE_URL_WEBP =
  "/manus-storage/spa-hero-desktop_b01f329e.webp";
export const HOME_HERO_IMAGE_URL_MOBILE =
  "/manus-storage/spa-hero-mobile_18b585fe.png";
export const HOME_HERO_IMAGE_URL_MOBILE_AVIF =
  "/manus-storage/spa-hero-mobile_a1e6ba0f.avif";
export const HOME_HERO_IMAGE_URL_MOBILE_WEBP =
  "/manus-storage/spa-hero-mobile_2a681c1f.webp";

// Social/share preview card. 1200x630 PNG that composes the color mark on a
// branded background. Wired into <head> via index.html.
export const SOCIAL_OG_IMAGE_URL = "/manus-storage/rhs5-og-card_3f643ff4.png";

// Browser tab favicon. Multi-size .ico (16/32/48/64) generated from the
// color mark only — the wordmark is unreadable at favicon scale.
export const FAVICON_ICO_URL = "/manus-storage/rhs5-favicon_dc62a770.ico";

// iOS home-screen icon. 180x180 PNG, transparent background, color mark
// only (no wordmark — too small to read at 60pt).
export const APPLE_TOUCH_ICON_URL = "/manus-storage/rhs5-apple-touch-icon_ab5371f6.png";

// Android / PWA maskable icons. 192 + 512 PNGs from the same source.
export const ICON_192_URL = "/manus-storage/rhs5-icon-192_72d5cd2d.png";
export const ICON_512_URL = "/manus-storage/rhs5-icon-512_30985797.png";

// Identity strings — kept here so a name/tagline change can't drift between
// the header link, the footer link, and the document <title>/meta tags.
export const BRAND_NAME = "Rapid Hire Solutions" as const;
export const BRAND_HOME_HREF = "/" as const;
export const BRAND_TAGLINE_SHORT =
  "The trusted standard in background checks." as const;

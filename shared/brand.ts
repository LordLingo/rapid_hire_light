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

// Brand mark URLs — bundled with the build under /static/ so the assets
// ship to whatever host serves the dist (§189 — was /manus-storage/, but
// that path is Manus-only and 404s on Vercel). To swap an asset, drop the
// new file into client/public/static/ and update the path here; the
// corresponding *.test.ts files will fail loudly if the constant ever
// drifts away from "/static/...".
export const HEADER_LOGO_URL = "/static/rhs5-color-trimmed.png";
export const FOOTER_LOGO_URL = "/static/rhs5-white.png";

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
// Each crop is encoded for `<picture>` source negotiation:
//   AVIF (best compression on modern browsers) -> WebP (universal fallback,
//   supported by every browser shipping in 2026 — Safari 14+, Edge 18+,
//   Chrome 23+, FF 65+ all decode WebP). The HOME_HERO_IMAGE_URL +
//   HOME_HERO_IMAGE_URL_MOBILE constants now point at the WebP variant
//   directly because the source PNGs (1.4MB + 1.5MB) blew the 1MB-per-file
//   checkpoint limit — §189. WebP at q82 is visually identical to the PNGs
//   for this artwork. All variants are produced by
//   `webdev-static-assets/build_spa_hero.py`.
export const HOME_HERO_IMAGE_URL =
  "/static/spa-hero-desktop.webp";
export const HOME_HERO_IMAGE_URL_AVIF =
  "/static/spa-hero-desktop.avif";
export const HOME_HERO_IMAGE_URL_WEBP =
  "/static/spa-hero-desktop.webp";
export const HOME_HERO_IMAGE_URL_MOBILE =
  "/static/spa-hero-mobile.webp";
export const HOME_HERO_IMAGE_URL_MOBILE_AVIF =
  "/static/spa-hero-mobile.avif";
export const HOME_HERO_IMAGE_URL_MOBILE_WEBP =
  "/static/spa-hero-mobile.webp";

// Social/share preview card. 1200x630 PNG that composes the color mark on a
// branded background. Wired into <head> via index.html.
export const SOCIAL_OG_IMAGE_URL = "/static/rhs5-og-card.png";

// Browser tab favicon. Multi-size .ico (16/32/48/64) generated from the
// color mark only — the wordmark is unreadable at favicon scale.
export const FAVICON_ICO_URL = "/static/rhs5-favicon.ico";

// iOS home-screen icon. 180x180 PNG, transparent background, color mark
// only (no wordmark — too small to read at 60pt).
export const APPLE_TOUCH_ICON_URL = "/static/rhs5-apple-touch-icon.png";

// Android / PWA maskable icons. 192 + 512 PNGs from the same source.
export const ICON_192_URL = "/static/rhs5-icon-192.png";
export const ICON_512_URL = "/static/rhs5-icon-512.png";

// Identity strings — kept here so a name/tagline change can't drift between
// the header link, the footer link, and the document <title>/meta tags.
export const BRAND_NAME = "Rapid Hire Solutions" as const;
export const BRAND_HOME_HREF = "/" as const;
export const BRAND_TAGLINE_SHORT =
  "The trusted standard in background checks." as const;

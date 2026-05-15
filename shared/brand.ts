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
export const HEADER_LOGO_URL = "/manus-storage/rhs-color-logo_038dbc01.png";
export const FOOTER_LOGO_URL = "/manus-storage/rhs-white-logo_ba46549d.png";

// Social/share preview card. 1200x630 PNG that composes the color mark on a
// branded background. Wired into <head> via index.html.
export const SOCIAL_OG_IMAGE_URL = "/manus-storage/rhs-og-card_22bd2542.png";

// Browser tab favicon. Multi-size .ico (16/32/48/64) generated from the
// color mark only — the wordmark is unreadable at favicon scale.
export const FAVICON_ICO_URL = "/manus-storage/rhs-favicon_25880e29.ico";

// iOS home-screen icon. 180x180 PNG, transparent background, color mark
// only (no wordmark — too small to read at 60pt).
export const APPLE_TOUCH_ICON_URL = "/manus-storage/rhs-apple-touch-icon_cc5596e5.png";

// Android / PWA maskable icons. 192 + 512 PNGs from the same source.
export const ICON_192_URL = "/manus-storage/rhs-icon-192_f56f7cb1.png";
export const ICON_512_URL = "/manus-storage/rhs-icon-512_4751a040.png";

// Identity strings — kept here so a name/tagline change can't drift between
// the header link, the footer link, and the document <title>/meta tags.
export const BRAND_NAME = "Rapid Hire Solutions" as const;
export const BRAND_HOME_HREF = "/" as const;
export const BRAND_TAGLINE_SHORT =
  "The trusted standard in background checks." as const;

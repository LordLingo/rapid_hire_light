/*
  §114 — Education Verification standalone illustration on /services
  -------------------------------------------------------------------
  This is the first opt-in to the new `heroImage?` pattern on
  ServiceDetail. Pins the data shape, the URL/alt content, the
  Services.tsx render wiring, and the opt-in semantics so legacy
  services that don't declare a heroImage keep their original
  icon-only left rail unchanged.

  Why each spec exists:
   - The image must come from the manus webdev static-asset CloudFront
     URL pipeline (no /manus-storage/, no client/public). The URL ends
     with .webp because we shipped the compressed variant.
   - Alt text must be descriptive (not "image of …" filler) and
     contain a domain word so screen readers know the subject.
   - Services.tsx must render the image inside the `<div col-span-3>`
     left rail under the icon + tag eyebrow — NOT as a background
     image, NOT in the right rail — and must use a stable testid so
     other tests can hook in later.
   - The pattern must be opt-in: only entries that declare heroImage
     get the image; every other ServiceDetail entry must NOT have one
     (otherwise this test would silently allow rolling out without an
     intentional decision per service).

  When you intentionally roll the pattern out to additional services
  (criminal-records, employment-verification, etc.), update
  EXPECTED_HERO_IMAGE_SLUGS below to include those slugs and add the
  per-slug URL/alt assertions next to the education ones.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  SERVICE_CATALOG,
  findServiceBySlug,
  type ServiceDetail,
} from "./serviceCatalog";

const ROOT = path.resolve(__dirname, "../../..");
const servicesSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/Services.tsx"),
  "utf8",
);
const catalogSrc = fs.readFileSync(
  path.join(ROOT, "client/src/lib/serviceCatalog.ts"),
  "utf8",
);

/**
 * Slugs that have intentionally opted in to the §114 standalone
 * illustration pattern. §117 rolled the pattern out to all nine
 * services; if a future ServiceDetail is added without an
 * illustration, append it to a new EXPECTED_NO_HERO_IMAGE allow-list
 * rather than silently dropping coverage here.
 */
const EXPECTED_HERO_IMAGE_SLUGS = [
  "criminal-records",
  "employment-verification",
  "education-verification",
  "drug-screening",
  "motor-vehicle-records",
  "social-media-screening",
  "identity-verification",
  "healthcare-sanctions",
  "continuous-monitoring",
] as const;

/**
 * Per-slug expected hero-image URLs. Each entry pins the exact
 * CloudFront WebP path so a refactor can't quietly swap or drop an
 * illustration without an intentional code edit + test update.
 */
const EXPECTED_HERO_URLS: Record<(typeof EXPECTED_HERO_IMAGE_SLUGS)[number], string> = {
  "criminal-records":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-criminal-records-2uAmRc3MqvTidrc5QCJaxt.webp",
  "employment-verification":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-employment-verification-3vF5yaK2E2QH7Ma63tzwfY.webp",
  "education-verification":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-education-verification-eLf9rJEMmN4Suu6ZZ3rCb9.webp",
  "drug-screening":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-drug-screening-CXbWDQnxTXdT4XRfe6msbM.webp",
  "motor-vehicle-records":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-motor-vehicle-records-RUm8ra2GQECJsKnC9pHzkb.webp",
  "social-media-screening":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-social-media-screening-dAnaZhXHGGSwkMpDsDQSn2.webp",
  "identity-verification":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-identity-verification-gxEzshkVdHAh2LTkgF2c8k.webp",
  "healthcare-sanctions":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-healthcare-sanctions-ii2ZZMvnAEHkbksuZtR5GR.webp",
  "continuous-monitoring":
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-continuous-monitoring-9CaUDydXJGB2HM3b9vQtgS.webp",
};

/**
 * Per-slug subject keywords the alt text MUST contain. We don't pin
 * the exact alt strings (they're allowed to evolve for SEO/a11y) but
 * they MUST mention at least one concrete subject word so the
 * illustration is meaningfully described to assistive tech.
 */
const EXPECTED_ALT_KEYWORDS: Record<(typeof EXPECTED_HERO_IMAGE_SLUGS)[number], RegExp> = {
  "criminal-records": /gavel|courthouse|county|ledger|case file|criminal/i,
  "employment-verification": /résumé|resume|telephone|employer|employment/i,
  "education-verification": /diploma|registrar|degree|graduation|mortarboard|credential/i,
  "drug-screening": /vial|specimen|chain[- ]of[- ]custody|drug|panel|clipboard/i,
  "motor-vehicle-records": /driver|license|dmv|mvr|driving|keys/i,
  "social-media-screening": /smartphone|phone|magnifying|social|public|feed/i,
  "identity-verification": /passport|fingerprint|identity|shield|document|biometric/i,
  "healthcare-sanctions": /caduceus|exclusion|credential|medicaid|oig|register/i,
  "continuous-monitoring": /clock|monitoring|dashboard|waveform|alert|continuous/i,
};

describe("§114 ServiceDetail.heroImage type — opt-in shape", () => {
  it("ServiceDetail type declares heroImage as an optional { url, alt } pair", () => {
    // The shape is enforced statically by tsc, but we also pin the
    // documentation-bearing JSDoc fragment so a future refactor can't
    // silently drop the contract.
    expect(catalogSrc).toMatch(/heroImage\?\s*:\s*\{\s*url:\s*string;\s*alt:\s*string\s*\}/);
  });

  it("only the expected slugs declare a heroImage (every other service stays icon-only)", () => {
    const withImage = SERVICE_CATALOG.filter(
      (s): s is ServiceDetail & { heroImage: NonNullable<ServiceDetail["heroImage"]> } =>
        s.heroImage !== undefined,
    ).map((s) => s.slug);

    expect(new Set(withImage)).toEqual(new Set(EXPECTED_HERO_IMAGE_SLUGS));

    // And every other entry is genuinely undefined — not an empty
    // object, not a partially-populated record.
    for (const s of SERVICE_CATALOG) {
      if ((EXPECTED_HERO_IMAGE_SLUGS as readonly string[]).includes(s.slug)) continue;
      expect(s.heroImage).toBeUndefined();
    }
  });
});

describe("§114 Education Verification — heroImage data", () => {
  const education = findServiceBySlug("education-verification");

  it("the catalog entry exists and has tag '03 — Education'", () => {
    expect(education).toBeDefined();
    expect(education!.tag).toBe("03 — Education");
  });

  it("heroImage.url is the manus webdev static-asset CloudFront WebP", () => {
    expect(education!.heroImage).toBeDefined();
    expect(education!.heroImage!.url).toBe(EXPECTED_HERO_URLS["education-verification"]);
    // Pipeline guards: must be served from the CloudFront host the
    // generate_image tool returns, must end with .webp (compressed
    // variant), and must NOT live under /manus-storage/ or
    // client/public/.
    expect(education!.heroImage!.url).toMatch(/^https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\//);
    expect(education!.heroImage!.url).toMatch(/\.webp$/);
    expect(education!.heroImage!.url).not.toMatch(/^\/manus-storage\//);
    expect(education!.heroImage!.url).not.toMatch(/client\/public\//);
  });

  it("heroImage.alt is descriptive (no 'image of' filler, mentions the subject)", () => {
    const alt = education!.heroImage!.alt;
    expect(alt.length).toBeGreaterThan(60);
    // Anti-pattern: lazy alts like "image of …" / "picture of …".
    expect(alt.toLowerCase()).not.toMatch(/^image of\b/);
    expect(alt.toLowerCase()).not.toMatch(/^picture of\b/);
    // Must reference at least one concrete subject word so screen
    // readers convey what the illustration depicts.
    expect(alt.toLowerCase()).toMatch(/diploma|registrar|degree|graduation|mortarboard|credential/);
  });
});

describe("§114 Services.tsx render wiring", () => {
  it("Services.tsx forwards heroImage from the catalog into the SERVICES view-model", () => {
    expect(servicesSrc).toMatch(/heroImage:\s*s\.heroImage/);
  });

  it("renders a real <img> (not a background) under the icon + tag eyebrow in the left rail", () => {
    // The opt-in render lives inside the `col-span-3` left rail block.
    // We pin: the conditional, the data-testid, the alt+src bindings,
    // and the lazy-loading + decoding hints.
    expect(servicesSrc).toMatch(/\{s\.heroImage\s*\?\s*\(/);
    expect(servicesSrc).toMatch(/<img\b[\s\S]*?src=\{s\.heroImage\.url\}/);
    expect(servicesSrc).toMatch(/alt=\{s\.heroImage\.alt\}/);
    expect(servicesSrc).toMatch(/loading="lazy"/);
    expect(servicesSrc).toMatch(/decoding="async"/);
    expect(servicesSrc).toMatch(/data-testid=\{`service-hero-image-\$\{s\.slug\}`\}/);
    // Belt-and-braces: the image is NOT applied as a CSS background
    // (which would defeat the standalone, screen-reader-friendly
    // intent of §114).
    expect(servicesSrc).not.toMatch(/style=\{\{[^}]*backgroundImage[^}]*s\.heroImage/);
  });

  it("the image lives in the col-span-3 left rail (not the right rail or middle column)", () => {
    // The block under test is the left rail: col-span-12 lg:col-span-3
    // that contains the icon + eyebrow. We assert the new <img>
    // appears AFTER the eyebrow span and BEFORE the closing </div>
    // that ends the left rail (which is followed by the col-span-6
    // middle column heading).
    const eyebrowIdx = servicesSrc.indexOf('<span className="eyebrow">{s.tag}</span>');
    const imgIdx = servicesSrc.indexOf("data-testid={`service-hero-image-${s.slug}`}");
    const middleColIdx = servicesSrc.indexOf('<div className="col-span-12 lg:col-span-6">');
    expect(eyebrowIdx).toBeGreaterThan(-1);
    expect(imgIdx).toBeGreaterThan(-1);
    expect(middleColIdx).toBeGreaterThan(-1);
    expect(eyebrowIdx).toBeLessThan(imgIdx);
    expect(imgIdx).toBeLessThan(middleColIdx);
  });

  it("uses a square, rounded, bordered editorial frame with a white inner mat", () => {
    // The visual treatment matches the rest of the editorial design
    // language: rounded-2xl, border, white inner mat (so the
    // illustration reads as a framed piece of art on the paper page),
    // padding to expose that mat, and a paper-shadow lift. Pin the
    // class string so a refactor can't quietly downgrade the framing.
    expect(servicesSrc).toMatch(/rounded-2xl[\s\S]*?border[\s\S]*?border-border/);
    expect(servicesSrc).toMatch(/aspect-square/);
    expect(servicesSrc).toMatch(/object-cover/);
    expect(servicesSrc).toMatch(/paper-shadow/);
    // §114 follow-up — white mat + padding = the "nice white border"
    // around the image the user requested.
    expect(servicesSrc).toMatch(/bg-white/);
    expect(servicesSrc).toMatch(/\bp-2\b/);
  });
});

/*
  §114 follow-up — mirror the same illustration onto the dedicated
  detail page at /services/<slug> (e.g. /services/education-verification).
  We render it under the eyebrow + hairline of the left rail in PageHero
  via the new `belowEyebrow` slot, using the SAME framing classes the
  /services list view uses, so the brand language stays consistent.
*/
const serviceDetailSrc = fs.readFileSync(
  path.join(ROOT, "client/src/pages/ServiceDetail.tsx"),
  "utf8",
);
const pageHeroSrc = fs.readFileSync(
  path.join(ROOT, "client/src/components/site/PageHero.tsx"),
  "utf8",
);

describe("§114 follow-up — ServiceDetail.tsx hero image wiring", () => {
  it("PageHero exposes a `belowEyebrow` slot for left-rail editorial illustrations", () => {
    expect(pageHeroSrc).toMatch(/belowEyebrow\?:\s*React\.ReactNode/);
    // Slot must render under the hairline in the left rail.
    expect(pageHeroSrc).toMatch(/data-testid="page-hero-below-eyebrow"/);
    expect(pageHeroSrc).toMatch(/{belowEyebrow}/);
  });

  it("ServiceDetail.tsx forwards heroImage into the PageHero `belowEyebrow` slot", () => {
    expect(serviceDetailSrc).toMatch(/belowEyebrow=\{[\s\S]*?service\.heroImage/);
    // The img tag binds to the catalog data, not a hardcoded URL, so it
    // automatically picks up additional opt-ins later.
    expect(serviceDetailSrc).toMatch(/<img\b[\s\S]*?src=\{service\.heroImage\.url\}/);
    expect(serviceDetailSrc).toMatch(/alt=\{service\.heroImage\.alt\}/);
    expect(serviceDetailSrc).toMatch(/loading="lazy"/);
    expect(serviceDetailSrc).toMatch(/decoding="async"/);
    expect(serviceDetailSrc).toMatch(
      /data-testid=\{`service-hero-image-\$\{service\.slug\}`\}/,
    );
  });

  it("the detail-page frame matches the /services list-view treatment exactly", () => {
    // Same rounded square + border + white inner mat + paper-shadow as
    // the catalog page — so the user gets identical visual rhythm when
    // they click into a service.
    expect(serviceDetailSrc).toMatch(/rounded-2xl[\s\S]*?border[\s\S]*?border-border/);
    expect(serviceDetailSrc).toMatch(/aspect-square/);
    expect(serviceDetailSrc).toMatch(/object-cover/);
    expect(serviceDetailSrc).toMatch(/paper-shadow/);
    expect(serviceDetailSrc).toMatch(/bg-white/);
    expect(serviceDetailSrc).toMatch(/\bp-2\b/);
  });

  it("the image renders only when service.heroImage is defined (opt-in)", () => {
    // The conditional must live around the <img>, otherwise services
    // without an illustration would crash on undefined.url.
    expect(serviceDetailSrc).toMatch(/service\.heroImage\s*\?\s*\(/);
  });
});

/*
  §117 — every other service now has a matching framed editorial
  illustration in the same style as Education. Per-slug assertions live
  here so the catalog can't silently drop one or swap to a stale URL.
*/
describe("§117 — per-slug heroImage data integrity", () => {
  for (const slug of EXPECTED_HERO_IMAGE_SLUGS) {
    describe(`service: ${slug}`, () => {
      const svc = findServiceBySlug(slug);

      it("is registered in the catalog", () => {
        expect(svc, `expected service slug "${slug}" to exist in SERVICE_CATALOG`).toBeDefined();
      });

      it("declares heroImage as a { url, alt } pair", () => {
        expect(svc!.heroImage).toBeDefined();
        expect(typeof svc!.heroImage!.url).toBe("string");
        expect(typeof svc!.heroImage!.alt).toBe("string");
      });

      it("heroImage.url is the expected CloudFront WebP", () => {
        expect(svc!.heroImage!.url).toBe(EXPECTED_HERO_URLS[slug]);
        expect(svc!.heroImage!.url).toMatch(
          /^https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\//,
        );
        expect(svc!.heroImage!.url).toMatch(/\.webp$/);
      });

      it("heroImage.alt is descriptive (no filler, mentions a concrete subject)", () => {
        const alt = svc!.heroImage!.alt;
        expect(alt.length).toBeGreaterThan(60);
        expect(alt.toLowerCase()).not.toMatch(/^image of\b/);
        expect(alt.toLowerCase()).not.toMatch(/^picture of\b/);
        expect(alt).toMatch(EXPECTED_ALT_KEYWORDS[slug]);
      });
    });
  }

  it("every catalog entry has a heroImage (no service is left icon-only)", () => {
    for (const s of SERVICE_CATALOG) {
      expect(
        s.heroImage,
        `expected service slug "${s.slug}" to declare a heroImage (§117 rollout)`,
      ).toBeDefined();
    }
  });

  it("every CloudFront URL is unique — no two services share the same illustration", () => {
    const urls = SERVICE_CATALOG.map((s) => s.heroImage?.url).filter(Boolean) as string[];
    expect(new Set(urls).size).toBe(urls.length);
  });
});

/*
  §118 — subtle hover zoom on the framed editorial illustration. The
  framing now lives on a `.hover-zoom-image` container so the inner
  <img> can scale gently inside the rounded clip on hover. Pin the
  utility usage in both Services.tsx and ServiceDetail.tsx so a future
  refactor can't quietly drop the gesture (and so the gesture stays
  consistent across the list view and the detail page).
*/
describe("§118 — hover zoom on framed service illustrations", () => {
  /**
   * Pin the .hover-zoom-image CSS utility itself so a refactor of the
   * shared utility (1.04 scale, 350ms cubic-bezier ease-out, gated by
   * prefers-reduced-motion) doesn't silently degrade.
   */
  const indexCssSrc = fs.readFileSync(
    path.join(ROOT, "client/src/index.css"),
    "utf8",
  );

  it("defines the .hover-zoom-image utility with overflow:hidden so the scaled child stays clipped", () => {
    expect(indexCssSrc).toMatch(/\.hover-zoom-image\s*\{[\s\S]*?overflow:\s*hidden/);
  });

  it("transitions only `transform` (GPU-only) on the child image, with a snappy ease-out curve", () => {
    // The utility must animate transform exclusively (no width/height/
    // padding) so the hover stays buttery on low-end devices.
    expect(indexCssSrc).toMatch(
      /\.hover-zoom-image\s*>\s*img[\s\S]*?transition:\s*transform\s+\d+ms\s+cubic-bezier\(/,
    );
  });

  it("gates the scale gesture behind prefers-reduced-motion: no-preference", () => {
    // Users who opt out of motion must NOT see the zoom — not even a
    // diluted version. The :hover scale rule must live inside the
    // no-preference block.
    expect(indexCssSrc).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*no-preference\)[\s\S]*?\.hover-zoom-image:hover\s*>\s*img[\s\S]*?transform:\s*scale\(/,
    );
  });

  it("uses a restrained scale value (between 1.02 and 1.08 inclusive) — never an aggressive pop", () => {
    // The user asked for a SUBTLE zoom. Pin a sensible band so a
    // future tweak can't silently turn this into a 1.20 jump-scare.
    const m = indexCssSrc.match(
      /\.hover-zoom-image:hover\s*>\s*img[\s\S]*?transform:\s*scale\(([0-9.]+)\)/,
    );
    expect(m, "expected a scale(N) value on .hover-zoom-image:hover > img").not.toBeNull();
    const scale = Number(m![1]);
    expect(scale).toBeGreaterThanOrEqual(1.02);
    expect(scale).toBeLessThanOrEqual(1.08);
  });

  it("/services wraps every framed illustration in a .hover-zoom-image container", () => {
    // The utility must sit on the outer frame (not the <img>) so the
    // rounded clip contains the scaled child.
    expect(servicesSrc).toMatch(/className=\"hover-zoom-image[^\"]*\"/);
    // Frame still keeps its existing visual treatment (rounded, white
    // inner mat, paper-shadow). The framing pin survives the new
    // wrapper structure.
    expect(servicesSrc).toMatch(
      /hover-zoom-image[^\"]*rounded-2xl[\s\S]*?bg-white[\s\S]*?paper-shadow/,
    );
  });

  it("/services/:slug detail page wraps the illustration in the same .hover-zoom-image container", () => {
    expect(serviceDetailSrc).toMatch(/className=\"hover-zoom-image[^\"]*\"/);
    expect(serviceDetailSrc).toMatch(
      /hover-zoom-image[^\"]*rounded-2xl[\s\S]*?bg-white[\s\S]*?paper-shadow/,
    );
  });

  it("on both pages the inner <img> still gets the object-cover sizing class", () => {
    // We moved the framing classes to the wrapper, but the actual
    // <img> must keep object-cover so the editorial composition isn't
    // distorted on the rare non-square viewport.
    expect(servicesSrc).toMatch(/<img[\s\S]*?className=\"[^\"]*object-cover[^\"]*\"/);
    expect(serviceDetailSrc).toMatch(/<img[\s\S]*?className=\"[^\"]*object-cover[^\"]*\"/);
  });
});

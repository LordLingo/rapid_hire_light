/*
  §220 — Structure pins for the staffing landing page (StaffingLanding.tsx)
  and its route registration. These are source-text assertions (no React
  render) that lock the page's key ingredients so a future refactor can't
  silently break the campaign destination:

    - /lp/staffing route is registered in App.tsx pointing at StaffingLanding
    - the page exists and imports the shared form + tracking plumbing
    - lead form posts to the Formspree endpoint and renders hidden tracking
      fields + a honeypot
    - the success panel uses the §216 scroll-into-view pattern
    - NO invented marketing stats: every headline metric stays a bracketed
      [PLACEHOLDER]; this test fails if a bare percentage/number claim leaks
      into visible copy (CSS values inside style/className are ignored)
*/

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PAGE = resolve(__dirname, "../pages/StaffingLanding.tsx");
const APP = resolve(__dirname, "../App.tsx");

function read(p: string): string {
  return readFileSync(p, "utf8");
}

describe("§220 StaffingLanding — route registration", () => {
  it("registers /lp/staffing → StaffingLanding in App.tsx", () => {
    const app = read(APP);
    expect(app).toContain('import StaffingLanding from "./pages/StaffingLanding"');
    expect(app).toMatch(
      /<Route\s+path=\{"\/lp\/staffing"\}\s+component=\{StaffingLanding\}\s*\/>/,
    );
  });
});

describe("§220 StaffingLanding — page wiring", () => {
  const src = read(PAGE);

  it("uses the shared SEO + reveal hooks", () => {
    expect(src).toContain('from "@/hooks/useSeo"');
    expect(src).toContain('from "@/hooks/useReveal"');
  });

  it("reuses the shared form + tracking libs", () => {
    expect(src).toContain('from "@/lib/formValidation"');
    expect(src).toContain('from "@/lib/hubspotForm"');
    expect(src).toContain('from "@/lib/staffingLp"');
  });

  it("posts the lead form to the shared Formspree endpoint constant", () => {
    // §159: the form id must come from @/lib/formspree, never a literal here.
    expect(src).toContain('from "@/lib/formspree"');
    expect(src).toContain("FORMSPREE_ENDPOINT");
    expect(src).not.toContain("formspree.io/f/");
  });

  it("renders hidden tracking fields + a honeypot", () => {
    expect(src).toContain("data-tracking-field");
    expect(src).toContain('name="company_website"'); // honeypot
  });

  it("fires the lead conversion hook on successful submit", () => {
    expect(src).toContain("fireLeadConversion()");
  });

  it("scrolls the success panel into view after submit (§216 pattern)", () => {
    expect(src).toContain('data-testid="lp-success"');
    expect(src).toMatch(/successRef\.current\?\.scrollIntoView\(/);
  });

  it("shows the pre-launch placeholder reviewer banner", () => {
    expect(src).toContain('data-testid="lp-placeholder-banner"');
  });

  it("keeps section imagery on deploy-safe absolute CDN URLs (no /manus-storage)", () => {
    // §221: any retained section assets must be absolute https CDN URLs, NOT
    // /manus-storage/* signed-redirect paths (that endpoint 404s on the published
    // static build). §223 replaced the hero photo with the WebGL shader; §228
    // replaced the handshake-photo testimonial with an initials-avatar grid, so
    // SPEED_IMG is the remaining CDN-hosted section asset.
    expect(src).toMatch(/SPEED_IMG\s*=\s*"https:\/\/files\.manuscdn\.com\//);
    expect(src).not.toContain("/manus-storage/staffing-hero");
  });
});

describe("§228 StaffingLanding — testimonials grid", () => {
  const src = read(PAGE);

  it("renders the multi-card testimonials section using shadcn Card + Avatar", () => {
    expect(src).toContain('data-testid="lp-testimonials"');
    expect(src).toContain('from "@/components/ui/card"');
    expect(src).toContain('from "@/components/ui/avatar"');
    expect(src).toContain("function StaffingTestimonials()");
    expect(src).toContain("<StaffingTestimonials />");
  });

  it("keeps testimonial copy as clearly-labeled placeholders (no invented named clients)", () => {
    // Every testimonial must remain a bracketed placeholder until real approved
    // quotes are supplied. Guard against accidentally shipping demo names.
    expect(src).toContain("[Placeholder");
    expect(src).toContain("approved client quotes before launch");
    expect(src).not.toContain("Shekinah");
    expect(src).not.toContain("Tailus");
    expect(src).not.toContain("tailus.io");
  });

  it("§229 applies the subtle hover-lift effect to the testimonial cards", () => {
    // §229: cards lift + cast a soft shadow on hover via the shared
    // .hover-lift-card utility (reduced-motion gated in index.css). Pin both
    // the featured card and the supporting-card map so the affordance can't
    // silently regress.
    expect(src).toContain('className="hover-lift-card sm:col-span-2 lg:row-span-2');
    expect(src).toMatch(/"hover-lift-card rounded-\[20px\] border-border/);
  });
});

describe("§223 StaffingLanding — WebGL shader hero", () => {
  const src = read(PAGE);
  const SHADER = resolve(__dirname, "../components/StaffingShaderHero.tsx");
  const shaderSrc = read(SHADER);

  it("mounts the recolored shader background in the hero", () => {
    expect(src).toContain('from "@/components/StaffingShaderHero"');
    expect(src).toContain("<StaffingShaderBackground />");
  });

  it("uses the requested 'speed of light' headline", () => {
    // headline reads "Hiring at the speed of light." with 'light' as the accent word
    expect(src).toContain("Hiring at the speed of");
    expect(src).toMatch(/>\s*light\s*</);
  });

  it("dropped the former photo hero (no HERO_IMG constant remains)", () => {
    expect(src).not.toMatch(/const HERO_IMG\s*=/);
  });

  it("recolors the GLSL to brand blue, not the original orange demo", () => {
    // the brand recolor swaps the warm cloud tint for a deep cobalt-ink tint
    expect(shaderSrc).toContain("vec3(bg*.04,bg*.10,bg*.26)");
    // and must NOT keep the original warm-brown cloud tint
    expect(shaderSrc).not.toContain("vec3(bg*.25,bg*.137,bg*.05)");
  });

  it("gates the animation behind prefers-reduced-motion + has a static fallback", () => {
    expect(shaderSrc).toContain("prefersReducedMotion");
    // canvas only renders when motion is allowed; the gradient base always renders
    expect(shaderSrc).toContain("{animate && <StaffingShaderCanvas");
  });

  it("requires WebGL2 and cleans up the context on unmount", () => {
    expect(shaderSrc).toContain('getContext("webgl2")');
    expect(shaderSrc).toContain("cancelAnimationFrame");
    expect(shaderSrc).toContain("deleteProgram");
  });
});

describe("§225 StaffingLanding — no mobile horizontal overflow (grid gap collapses)", () => {
  const src = read(PAGE);

  it("never uses a bare gap-x-10 on a 12-col grid (forces 40px gutters on stacked mobile cols => overflow)", () => {
    // §225 fix: gap-x-10 only at lg; on mobile the columns stack (col-span-12)
    // so a 40px horizontal gap is dead space that pushed the doc to 461px > 390.
    const bareGapGrids = src.match(/grid-cols-12 gap-x-10\b/g) || [];
    expect(bareGapGrids.length).toBe(0);
  });

  it("every 12-col grid uses the responsive gap-x-0 lg:gap-x-10 pattern", () => {
    const grids = src.match(/grid grid-cols-12 [^"]*/g) || [];
    // §228 replaced the old 12-col handshake/testimonial grid with a shadcn
    // card grid, leaving 3 twelve-col grids on the page.
    expect(grids.length).toBeGreaterThanOrEqual(3);
    for (const g of grids) {
      expect(g).toContain("gap-x-0 lg:gap-x-10");
    }
  });
});

describe("§224 StaffingLanding — header uses the real brand logo", () => {
  const src = read(PAGE);

  it("renders the shared HEADER_LOGO_URL lockup in the header, not a text wordmark", () => {
    expect(src).toContain('from "@shared/brand"');
    expect(src).toContain("HEADER_LOGO_URL");
    expect(src).toMatch(/src=\{HEADER_LOGO_URL\}/);
    // the old plain-text wordmark link must be gone
    expect(src).not.toContain("Rapid Hire <span");
  });

  it("declares the correct 210x140 intrinsic ratio (matches main-site <Logo>)", () => {
    // §224 mobile fix: the lockup is 1.5:1; a wrong height (e.g. 42) squashes it.
    // Pin the logo <img> attributes together so the ratio can't drift.
    const logoImg = src.match(/<img[\s\S]*?src=\{HEADER_LOGO_URL\}[\s\S]*?\/>/);
    expect(logoImg).not.toBeNull();
    const tag = logoImg![0];
    expect(tag).toMatch(/width=\{210\}/);
    expect(tag).toMatch(/height=\{140\}/);
  });

  it("keeps the logo width-auto + shrink-0 so it scales by height and never collapses on mobile", () => {
    const logoImg = src.match(/<img[\s\S]*?src=\{HEADER_LOGO_URL\}[\s\S]*?\/>/)![0];
    // height-driven, width auto so the aspect ratio holds at every breakpoint
    expect(logoImg).toMatch(/h-\d+/);
    expect(logoImg).toContain("w-auto");
    // the wrapping Link is shrink-0 so the flex row can't squeeze the logo to ~12px
    expect(src).toMatch(/<Link href="\/"[^>]*shrink-0[^>]*aria-label=\{BRAND_NAME\}>/);
  });

  it("hides the phone link below the sm breakpoint so the mobile header only carries logo + CTA", () => {
    // phone is hidden < 640px (sm:inline-flex), leaving plenty of room on mobile
    expect(src).toMatch(/href="tel:\+18884453047"\s+className="hidden sm:inline-flex/);
  });
});

describe("§222 StaffingLanding — persistent Request a Demo sticky CTA", () => {
  const src = read(PAGE);

  it("renders a single persistent DemoCtaBar (no leftover mobile-only bar)", () => {
    expect(src).toContain("function DemoCtaBar()");
    expect(src).toContain("<DemoCtaBar />");
    expect(src).toContain('data-testid="lp-demo-cta"');
    // exactly one rendered instance of the bar (no leftover duplicate bar)
    expect(src.match(/<DemoCtaBar \/>/g)?.length).toBe(1);
  });

  it("labels the CTA 'Request a Demo' and links it to the #lead form", () => {
    expect(src).toMatch(/Request a Demo/);
    expect(src).toMatch(/href="#lead"/);
  });

  it("is fixed, spans all breakpoints, and toggles visibility on scroll", () => {
    // fixed bottom bar, NOT gated behind lg:hidden (must show on desktop too)
    expect(src).toMatch(/fixed bottom-0 inset-x-0 z-40/);
    expect(src).not.toMatch(/lg:hidden fixed bottom-0/);
    // visibility is state-driven and accessibility-aware
    expect(src).toContain("aria-hidden={!show}");
    expect(src).toContain('getElementById("lead")');
  });

  it("respects reduced-motion on the slide transition", () => {
    expect(src).toContain("motion-reduce:transition-none");
  });
});

describe("§220 StaffingLanding — no invented stats", () => {
  const src = read(PAGE);

  // Strip out CSS-ish contexts where percentages/numbers are legitimate
  // (inline style backgrounds/gradients, Tailwind opacity like /70, arbitrary
  // values like [color:...], size utilities). What remains is visible copy.
  function visibleText(s: string): string {
    return (
      s
        // remove style={{ ... }} blocks
        .replace(/style=\{\{[\s\S]*?\}\}/g, " ")
        // remove className="..." values
        .replace(/className=("[^"]*"|\{`[\s\S]*?`\})/g, " ")
        // remove import/asset URL/path strings (CDN hero assets + any storage paths)
        .replace(/["'`][^"'`]*files\.manuscdn\.com[^"'`]*["'`]/g, " ")
        .replace(/["'`][^"'`]*manus-storage[^"'`]*["'`]/g, " ")
    );
  }

  it("contains bracketed placeholders, not hard-coded headline stats", () => {
    expect(src).toContain("[XX]");
    expect(src).toMatch(/\[XX\]%/);
  });

  it("has no bare 'NN% accuracy/faster/reduction' style claims in copy", () => {
    const text = visibleText(src);
    // Catch claims like "98% accuracy", "40% faster", "99.9% ..."
    const bad = text.match(/\b\d{2,3}(\.\d+)?%\s*(accuracy|faster|reduction|of)\b/gi);
    expect(bad).toBeNull();
  });
});

/*
  §50 Hover polish — vitest pins.

  Three things we lock down:

  1. The three utility classes exist in client/src/index.css with the
     correct tokens. We assert against the raw stylesheet contents
     because the utilities are scoped under @layer components, which
     vitest's JSDOM cannot evaluate to computed style without a full
     Tailwind pipeline.

  2. The Integrations 3-step trio (Connect / Trigger / Sync) carries
     BOTH .hover-lift-card and .hover-lift-card-strong (the user's
     primary ask: "a light blue line around the 3 cards" + smooth
     hover animation), and the Integrations grid tiles carry the base
     .hover-lift-card.

  3. A sampling of card/image surfaces across the site carry the
     utilities, so a future copy edit can't accidentally strip them:
       - Homepage Workflows DiagramCard → hover-lift-card
       - Homepage Services service cards → hover-lift-card
       - Homepage Hero photo wrapper → hover-zoom-image
       - Homepage WhyUs photo wrapper → hover-zoom-image
       - Support page team/coverage/article cards → hover-lift-card
       - About page team cards → hover-lift-card
       - Contact page aside info card → hover-lift-card
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function read(rel: string): string {
  return readFileSync(resolve(process.cwd(), rel), "utf8");
}

describe("§50 hover polish utilities — index.css tokens", () => {
  const css = read("client/src/index.css");

  it("defines .hover-lift-card with the snappy ease-out cubic bezier", () => {
    expect(css).toMatch(/\.hover-lift-card\s*\{[^}]*transition[^}]*cubic-bezier\(0\.23,\s*1,\s*0\.32,\s*1\)/);
  });

  it(".hover-lift-card hover state shifts border-color toward accent-halo", () => {
    expect(css).toMatch(/\.hover-lift-card:hover\s*\{[^}]*border-color[^}]*--color-accent-halo/);
  });

  it(".hover-lift-card lifts via translateY(-3px) only when prefers-reduced-motion: no-preference", () => {
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{[\s\S]*?\.hover-lift-card:hover\s*\{[^}]*translateY\(-3px\)/
    );
  });

  it(".hover-lift-card-strong sets a sky-halo resting ring and intensifies on hover", () => {
    expect(css).toMatch(/\.hover-lift-card-strong\s*\{[^}]*--color-accent-halo/);
    expect(css).toMatch(
      /\.hover-lift-card-strong:hover\s*\{[\s\S]*?border-color:\s*var\(--color-accent-ink\)/
    );
  });

  it(".hover-zoom-image scales the child image to 1.04 only with prefers-reduced-motion: no-preference", () => {
    expect(css).toMatch(/\.hover-zoom-image\s*\{[\s\S]*?overflow:\s*hidden/);
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*no-preference\)[\s\S]*?\.hover-zoom-image:hover[\s\S]*?transform:\s*scale\(1\.04\)/
    );
  });

  it("uses cubic-bezier(0.23, 1, 0.32, 1) for hover-zoom-image transition (matches site motion vocabulary)", () => {
    expect(css).toMatch(/\.hover-zoom-image\s*>\s*img[^}]*cubic-bezier\(0\.23,\s*1,\s*0\.32,\s*1\)/);
  });
});

describe("§50 — Integrations page applications (the user's primary ask)", () => {
  const src = read("client/src/pages/Integrations.tsx");

  it("Connect/Trigger/Sync step cards carry .hover-lift-card AND .hover-lift-card-strong", () => {
    // The map renders three steps from STEPS[]; the className is shared
    // across all three. We pin the literal className string.
    expect(src).toMatch(
      /hover-lift-card hover-lift-card-strong[^"]*col-span-12 md:col-span-4/
    );
  });

  it("step cards expose data-testid={`integrations-step-${s.number}`} for QA", () => {
    expect(src).toMatch(/data-testid=\{`integrations-step-\$\{s\.number\}`\}/);
  });

  it("ATS/HRIS integrations grid tiles use .hover-lift-card", () => {
    expect(src).toMatch(/"hover-lift-card reveal-on-scroll group rounded-\[16px\]/);
  });

  it("anti-regression: the old transition-colors hover:border-accent-ink one-off is gone from the integrations grid", () => {
    // We replaced the bespoke transition-colors + hover:border treatment
    // with the single shared utility. Make sure the old pattern doesn't
    // creep back in on the integrations grid <article> className list.
    expect(src).not.toMatch(
      /transition-colors duration-300 hover:border-\[color:var\(--color-accent-ink\)\][^"]*col-span-12 md:col-span-6 lg:col-span-4/
    );
  });
});

describe("§50 — Site-wide card/image applications", () => {
  it("Homepage Workflows DiagramCard carries .hover-lift-card on its className", () => {
    const src = read("client/src/components/site/Workflows.tsx");
    expect(src).toMatch(/"hover-lift-card rounded-\[16px\] border border-border p-5 md:p-6"/);
  });

  it("Homepage Services service cards carry .hover-lift-card", () => {
    const src = read("client/src/components/site/Services.tsx");
    expect(src).toMatch(
      /"hover-lift-card reveal-on-scroll group relative rounded-\[16px\] border border-border bg-white p-6 md:p-7"/
    );
  });

  it("Homepage Hero key-visual wrapper carries .hover-zoom-image", () => {
    const src = read("client/src/components/site/Hero.tsx");
    expect(src).toMatch(
      /"hover-zoom-image relative rounded-\[20px\] border border-border bg-white paper-shadow"/
    );
  });

  it("Homepage WhyUs photo wrapper carries .hover-zoom-image", () => {
    const src = read("client/src/components/site/WhyUs.tsx");
    expect(src).toMatch(
      /"hover-zoom-image rounded-\[18px\] border border-border paper-shadow"/
    );
  });

  it("Support page team and coverage cards carry .hover-lift-card", () => {
    const src = read("client/src/pages/Support.tsx");
    // Team cards (rounded-[20px])
    expect(src).toMatch(
      /"hover-lift-card reveal-on-scroll rounded-\[20px\] border border-border bg-white p-6"/
    );
    // Coverage hours cards (rounded-[18px])
    expect(src).toMatch(
      /"hover-lift-card reveal-on-scroll rounded-\[18px\] border border-border bg-white p-6"/
    );
    // Routing cards (Candidate vs Client articles)
    expect(src).toMatch(
      /"hover-lift-card rounded-\[20px\] border border-border bg-white p-7 reveal-on-scroll"/
    );
  });

  it("About page team member cards carry .hover-lift-card", () => {
    const src = read("client/src/pages/About.tsx");
    expect(src).toMatch(
      /"hover-lift-card aspect-\[4\/5\] rounded-\[16px\] border border-border bg-white flex items-end p-5"/
    );
  });

  it("Contact page aside info card carries .hover-lift-card", () => {
    const src = read("client/src/pages/Contact.tsx");
    expect(src).toMatch(
      /"hover-lift-card mt-12 rounded-\[16px\] border border-border bg-\[color:var\(--color-paper\)\] p-6"/
    );
  });

  it("anti-regression: Pricing tier cards do NOT carry .hover-lift-card (they have an intentional bespoke treatment)", () => {
    const src = read("client/src/pages/Pricing.tsx");
    expect(src).not.toMatch(/hover-lift-card[^"]*reveal-on-scroll relative flex flex-col/);
  });

  it("anti-regression: Blog index post cards remain editorial typography, not lift-cards", () => {
    const src = read("client/src/pages/Blog.tsx");
    // The blog post cards are <article> + <Link className="group block"> editorial blocks.
    // Adding .hover-lift-card there would homogenize them. Pin that we haven't.
    expect(src).not.toMatch(/hover-lift-card/);
  });
});

describe("§51 hover polish follow-ups — Integrations icon-well glow + parking-lot guards", () => {
  it("Integrations step cards carry the `group` class so the icon well can react on hover", () => {
    const src = read("client/src/pages/Integrations.tsx");
    // The card's className must lead with `group` so descendants can use group-hover:
    // matchers. Pin the exact prefix to anti-regression future copy edits.
    expect(src).toMatch(/className="group hover-lift-card hover-lift-card-strong /);
  });

  it("Integrations step icon well shifts background to --color-tint on group-hover", () => {
    const src = read("client/src/pages/Integrations.tsx");
    expect(src).toMatch(/group-hover:bg-\[color:var\(--color-tint\)\]/);
  });

  it("Integrations step icon well border deepens to --color-accent-halo on group-hover", () => {
    const src = read("client/src/pages/Integrations.tsx");
    expect(src).toMatch(/group-hover:border-\[color:var\(--color-accent-halo\)\]/);
  });

  it("Integrations step icon well animates the wash via transition-colors duration-300 ease-out", () => {
    const src = read("client/src/pages/Integrations.tsx");
    // Pin both the transition-colors utility and the duration so a future
    // refactor doesn't accidentally swap to a slower or no-op transition.
    expect(src).toMatch(/transition-colors duration-300 ease-out group-hover:bg-\[color:var\(--color-tint\)\]/);
  });

  it("parking-lot: SampleReportCard does NOT pick up .hover-zoom-image (it's a layered mockup, not a flat photo)", () => {
    const src = read("client/src/components/site/SampleReportCard.tsx");
    expect(src).not.toMatch(/hover-zoom-image/);
  });

  it("parking-lot: Pricing add-on chips remain plain pill chips (NOT cards), so no .hover-lift-card is applied to them", () => {
    const src = read("client/src/pages/Pricing.tsx");
    // The ADDONS list renders <span> chips with rounded-full + px-4 py-2.
    // Adding .hover-lift-card to a chip would make it look clickable when it's
    // informational. Pin that we haven't.
    expect(src).toMatch(/ADDONS\.map\(/);
    // Find the line with ADDONS chip className and confirm it does NOT carry hover-lift-card.
    const chipSection = src.split("ADDONS.map(")[1]?.split("</span>")[0] ?? "";
    expect(chipSection).not.toMatch(/hover-lift-card/);
  });
});

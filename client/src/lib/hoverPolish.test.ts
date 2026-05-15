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
    // §52: DiagramCard now also carries `group` so its icon well can pick
    // up the same group-hover wash as the Integrations step cards. The
    // hover-lift-card token + dimensions stay locked exactly as in §50.
    expect(src).toMatch(/"group hover-lift-card rounded-\[16px\] border border-border p-5 md:p-6"/);
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
    // Coverage hours cards (rounded-[18px]) — §58 lifted these onto
    // the dark navy gradient, so the resting class string dropped
    // `border-border bg-white` in favor of an inline-styled
    // low-alpha warm-white border + a 4% color-mix surface tint. The
    // `hover-lift-card` lift gesture is preserved (the utility only
    // animates transform/box-shadow/border-color).
    expect(src).toMatch(
      /"hover-lift-card reveal-on-scroll rounded-\[18px\] border p-6 bg-\[color:color-mix\(in_oklch,var\(--color-footer-foreground\)_4%,transparent\)\]"/
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


describe("§52 — Workflows DiagramCard icon-well glow + Pricing chip hover", () => {
  // §52 mirrors the §51 Integrations icon-well group-hover pattern onto
  // the homepage Workflows DiagramCard so the homepage workflow stack
  // and the /integrations 3-step trio share one gesture (single source
  // of truth for "icon well glows when its parent card is hovered").
  // Separately, Pricing add-on chips finally get a chip-appropriate
  // hover gesture: subtle border deepen + tint background fade, no lift,
  // no shadow, no scale — so they feel alive without reading clickable.

  it("Workflows DiagramCard outer div carries the `group` class for group-hover", () => {
    // The icon-well wash below is gated on `group-hover:`, which only
    // fires when an ancestor with the `group` class is hovered. Pin
    // both ends of the contract here so a future refactor can't strip
    // one half and silently break the gesture.
    const src = read("client/src/components/site/Workflows.tsx");
    expect(src).toMatch(
      /"group hover-lift-card rounded-\[16px\] border border-border p-5 md:p-6"/
    );
  });

  it("Workflows DiagramCard icon well washes to tint and deepens border on group-hover", () => {
    // Single source of truth: this class string MUST match the one used
    // on the Integrations 3-step trio's icon wells (§51). Deviating
    // would split the two surfaces visually for no good reason.
    const src = read("client/src/components/site/Workflows.tsx");
    expect(src).toMatch(
      /grid place-items-center size-8 rounded-full border border-border text-\[color:var\(--color-accent-ink\)\] transition-colors duration-300 ease-out group-hover:bg-\[color:var\(--color-tint\)\] group-hover:border-\[color:var\(--color-accent-halo\)\]/
    );
  });

  it("Workflows DiagramCard icon well uses the same 300ms ease-out as the Integrations icon well (single source of truth)", () => {
    // Cross-file consistency: both files must use the same transition
    // duration + easing so the gesture reads as one motion language.
    const wf = read("client/src/components/site/Workflows.tsx");
    const integ = read("client/src/pages/Integrations.tsx");
    expect(wf).toMatch(/transition-colors duration-300 ease-out group-hover:bg-\[color:var\(--color-tint\)\]/);
    expect(integ).toMatch(/transition-colors duration-300 ease-out group-hover:bg-\[color:var\(--color-tint\)\]/);
  });

  it("does NOT apply the icon-well glow to the brand-blue PlatformCenterCard", () => {
    // The center card is the visual anchor (Section 44). It sits between
    // two flanking white DiagramCards and uses inverted tokens. Adding
    // a tint wash to its icon wells would (a) be invisible on the blue
    // surface, and (b) tempt the static badges to feel interactive,
    // which the user explicitly called out as a problem in §44.
    const src = read("client/src/components/site/Workflows.tsx");
    // The PlatformCenterCard function body must not contain the group-hover
    // wash tokens. Extract it by slicing between its declaration and the
    // closing brace immediately before the file's default export.
    const start = src.indexOf("function PlatformCenterCard");
    expect(start).toBeGreaterThan(-1);
    // Take everything from PlatformCenterCard onward (the file ends after
    // it, so this is a safe upper bound).
    const tail = src.slice(start);
    expect(tail).not.toMatch(/group-hover:bg-\[color:var\(--color-tint\)\]/);
  });

  it("Pricing add-on chips fade in a subtle tint background and deepen their border on hover", () => {
    // Chip-appropriate gesture — NO transform, NO box-shadow, NO scale,
    // NO `.hover-lift-card`. Just border-color and background-color
    // transitioning at chip scale (200ms reads tighter than the 300ms
    // used on cards, which would feel sluggish on small surfaces).
    const src = read("client/src/pages/Pricing.tsx");
    expect(src).toMatch(
      /text-\[13px\] rounded-full border border-border bg-white px-4 py-2 text-\[color:var\(--color-ink\)\] transition-colors duration-200 ease-out hover:border-\[color:var\(--color-accent-halo\)\] hover:bg-\[color:var\(--color-tint\)\]/
    );
  });

  it("Pricing add-on chip block stays presentational (NOT <button>/<a>, no btn-press, no group, no hover-lift)", () => {
    // The user explicitly told us in §44 that surfaces which look like
    // buttons but aren't clickable are a problem. The §50 anti-regression
    // is that chips don't carry `.hover-lift-card`. §52 extends that
    // guard: also no `<button>`/`<a>`/`btn-press`/`group`/`cursor-pointer`
    // anywhere inside the ADDONS.map block.
    const src = read("client/src/pages/Pricing.tsx");
    const start = src.indexOf("ADDONS.map((a) =>");
    expect(start).toBeGreaterThan(-1);
    // The block ends with `))}` after the closing </span>. Take a
    // generous 800-char window — the actual block is about 350 chars.
    const block = src.slice(start, start + 800);
    expect(block).not.toMatch(/<button/);
    expect(block).not.toMatch(/<a /);
    expect(block).not.toMatch(/btn-press/);
    // §53 update: `group` is now intentionally present on the chip
    // so the tiny ChevronRight glyph inside can animate on hover. The
    // chip itself must remain a presentational <span> with no <button>,
    // no <a>, no btn-press, no cursor-pointer, no hover-lift-card. The
    // `group` class alone (without those interactive markers) does not
    // make the chip read clickable — it just enables the child icon's
    // group-hover: animation.
    expect(block).not.toMatch(/cursor-pointer/);
    expect(block).not.toMatch(/hover-lift-card/);
  });
});

describe("§53 — Services icon-well glow + Pricing chip chevron + parked hero-zoom", () => {
  // §53 closes the loop on three follow-ups from §52:
  //   1. Mirror the icon-well group-hover wash onto homepage Services
  //      cards so all three site-wide card stacks (Workflows /
  //      Integrations / Services) share one motion vocabulary.
  //   2. Add a tiny ChevronRight glyph to Pricing add-on chips that
  //      fades + translates 2px on hover, signalling "this is alive"
  //      without making the chip read clickable.
  //   3. Park the .hover-zoom-image follow-up on /about and /support
  //      because both pages currently render code-rendered infographic
  //      cards (AboutOrgChart / SupportAnswerTimeCard), not real photos.
  //      When real photography lands, the parking-lot guards below
  //      should be lifted and .hover-zoom-image applied to the wrapper.

  it("Homepage Services icon well washes to tint AND deepens border on group-hover (parity with Workflows + Integrations)", () => {
    const src = read("client/src/components/site/Services.tsx");
    expect(src).toMatch(
      /grid place-items-center size-10 rounded-full border border-border text-\[color:var\(--color-accent-ink\)\] transition-colors duration-300 ease-out group-hover:bg-\[color:var\(--color-tint\)\] group-hover:border-\[color:var\(--color-accent-halo\)\]/
    );
  });

  it("Services + Workflows + Integrations all share the SAME icon-well wash class string (single source of truth)", () => {
    // Cross-file consistency: drift on this string would split the
    // gesture across surfaces for no good reason. Pin all three.
    const services = read("client/src/components/site/Services.tsx");
    const wf = read("client/src/components/site/Workflows.tsx");
    const integ = read("client/src/pages/Integrations.tsx");
    const expected =
      /transition-colors duration-300 ease-out group-hover:bg-\[color:var\(--color-tint\)\] group-hover:border-\[color:var\(--color-accent-halo\)\]/;
    expect(services).toMatch(expected);
    expect(wf).toMatch(expected);
    expect(integ).toMatch(expected);
  });

  it("Pricing add-on chip carries `group` so its child ChevronRight can animate on hover", () => {
    // Pin the exact prefix of the chip className so a future edit
    // can't drop the `group` class and silently break the chevron.
    const src = read("client/src/pages/Pricing.tsx");
    expect(src).toMatch(
      /className="group inline-flex items-center gap-1\.5 text-\[13px\] rounded-full border border-border bg-white px-4 py-2 text-\[color:var\(--color-ink\)\] transition-colors duration-200 ease-out hover:border-\[color:var\(--color-accent-halo\)\] hover:bg-\[color:var\(--color-tint\)\]"/
    );
  });

  it("Pricing imports ChevronRight from lucide-react", () => {
    const src = read("client/src/pages/Pricing.tsx");
    expect(src).toMatch(/import \{[^}]*\bChevronRight\b[^}]*\} from "lucide-react"/);
  });

  it("Pricing chip ChevronRight is hidden at rest and fades + translates 2px on group-hover", () => {
    // The chevron must be opacity-0 by default (so a resting chip
    // looks like a plain pill, not a button), and animate both
    // opacity and transform on group-hover. Pin all four tokens.
    const src = read("client/src/pages/Pricing.tsx");
    expect(src).toMatch(
      /<ChevronRight\s+aria-hidden="true"\s+className="size-3 text-\[color:var\(--color-ink-muted\)\] opacity-0 transition-\[opacity,transform\] duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0\.5"/
    );
  });

  it("Pricing chip remains presentational — ChevronRight is aria-hidden and the chip stays a <span> (no <button>, <a>, btn-press, cursor-pointer, hover-lift-card)", () => {
    // Updated §52 guard. `group` is now allowed (it powers the
    // chevron's group-hover: animation), but the other markers that
    // would make the chip read clickable must remain forbidden.
    const src = read("client/src/pages/Pricing.tsx");
    const start = src.indexOf("ADDONS.map((a) =>");
    expect(start).toBeGreaterThan(-1);
    const block = src.slice(start, start + 1000);
    expect(block).not.toMatch(/<button/);
    expect(block).not.toMatch(/<a /);
    expect(block).not.toMatch(/btn-press/);
    expect(block).not.toMatch(/cursor-pointer/);
    expect(block).not.toMatch(/hover-lift-card/);
    // The chevron MUST be aria-hidden so screen readers don't announce
    // it as content (the chip's text label IS the content).
    expect(block).toMatch(/<ChevronRight\s+aria-hidden="true"/);
  });

  it("parked: /about does NOT yet carry .hover-zoom-image (uses AboutOrgChart visual, not real photography)", () => {
    // Anti-regression: blindly applying .hover-zoom-image to the hero
    // visual slot would zoom an infographic card, which is a different
    // (and worse) gesture. Lift this guard ONLY when real photography
    // is swapped into the page.
    const src = read("client/src/pages/About.tsx");
    expect(src).not.toMatch(/hover-zoom-image/);
  });

  it("parked: /support does NOT yet carry .hover-zoom-image (uses SupportAnswerTimeCard visual, not real photography)", () => {
    const src = read("client/src/pages/Support.tsx");
    expect(src).not.toMatch(/hover-zoom-image/);
  });
});

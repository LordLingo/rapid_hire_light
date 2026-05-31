/*
  §211 — HubSpot Tracking Code regression pin.

  The Tracking Code in client/index.html is the load-bearing piece that
  makes the workflow form-submission trigger actually fire. Without it
  the `hubspotutk` cookie is never set, our Forms API submission ships
  an empty context.hutk, and HubSpot classifies the submission as a
  non-tracked event so workflow enrollment doesn't fire.

  This spec pins the script's existence + portal id + canonical URL so
  a future "let's clean up index.html" refactor can't silently re-break
  the HubSpot automation we just spent multiple debug rounds shipping.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../../..");
const html = readFileSync(resolve(ROOT, "client/index.html"), "utf8");

describe("§211 — HubSpot Tracking Code", () => {
  it("loads the HubSpot tracking-code script in <head>", () => {
    // Must be present at all (no script = no hubspotutk cookie = workflow
    // form-submission triggers never enroll).
    expect(html).toMatch(
      /<script[^>]*id="hs-script-loader"[^>]*src="\/\/js\.hs-scripts\.com\/24249673\.js"[^>]*><\/script>/,
    );
  });

  it("uses the canonical js.hs-scripts.com host (not a misspelled variant)", () => {
    // HubSpot's tracking script lives at //js.hs-scripts.com/{portalId}.js
    // — NOT js.hubspot.com or js.hubapi.com. Pin the canonical host so a
    // future paste/refactor can't break it with a typo.
    expect(html).toContain('src="//js.hs-scripts.com/24249673.js"');
  });

  it("includes the portal id from §209/§210 (24249673) so the script and the Forms API submission target the same portal", () => {
    expect(html).toContain("24249673");
  });

  it("loads async + defer so it never blocks first paint", () => {
    // The two attributes don't have to be in any particular order, just
    // both present on the same tag.
    const tagMatch = html.match(
      /<script[^>]*id="hs-script-loader"[^>]*><\/script>/,
    );
    expect(tagMatch).not.toBeNull();
    if (!tagMatch) return;
    const tag = tagMatch[0];
    expect(tag).toContain(" async");
    expect(tag).toContain(" defer");
  });

  it("sits inside the <head> block (so the cookie is set as early as possible)", () => {
    const headBlock = html.match(/<head>[\s\S]*?<\/head>/);
    expect(headBlock).not.toBeNull();
    if (!headBlock) return;
    expect(headBlock[0]).toContain('id="hs-script-loader"');
  });
});

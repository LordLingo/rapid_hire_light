import { describe, expect, it } from "vitest";
import { normalizeSeoPath, routeSeo } from "./routeSeo";
import pages from "@shared/route-seo.json";

describe("shared route metadata", () => {
  for (const [route, page] of Object.entries(pages)) {
    it(`normalizes and shares metadata for ${route}`, () => {
      for (const suffix of ["", "/", "/?utm_source=test", "?test=1", "#section"]) {
        expect(normalizeSeoPath(route + suffix)).toBe(route);
        expect(routeSeo(route + suffix)).toMatchObject({ title: page.title, description: page.description, canonical: page.canonical, jsonLdKey: `route-seo:${route}` });
      }
    });
  }
  it("leaves other pages' metadata alone", () => {
    expect(routeSeo("/about")).toEqual({});
    expect(normalizeSeoPath("/")).toBe("/");
  });
});

/*
  §163 — Vitest specs for the API documentation search bar.

  Covers two layers:
    1. The matcher in @/lib/apiSearch — invariants, query semantics,
       ordering, empty-query fallthrough.
    2. Source pins in the Integrations page that prove the search bar
       is wired to the matcher (state, debounce effect, render switch
       to filteredResources / filteredEndpointRecords, empty-state).

  We deliberately do NOT mount the React tree here — there's no jsdom
  in the project and the rest of the file uses the same source-pin
  pattern (see formspree.test, apiDocsPdf.test). A future migration to
  React Testing Library would extend rather than replace these specs.
*/

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  API_RESOURCES,
} from "./apiReference";
import {
  API_SEARCH_ENDPOINT_INDEX,
  API_SEARCH_RESOURCE_INDEX,
  searchApi,
  tokenizeQuery,
} from "./apiSearch";

describe("§163 apiSearch — index invariants", () => {
  it("indexes every resource exactly once", () => {
    expect(API_SEARCH_RESOURCE_INDEX).toHaveLength(API_RESOURCES.length);
    const slugs = API_SEARCH_RESOURCE_INDEX.map((r) => r.resource.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(API_RESOURCES.map((r) => r.slug));
  });

  it("indexes every endpoint across every resource", () => {
    const expectedTotal = API_RESOURCES.reduce(
      (acc, r) => acc + r.endpoints.length,
      0,
    );
    expect(API_SEARCH_ENDPOINT_INDEX).toHaveLength(expectedTotal);
  });

  it("each endpoint record carries its parent resource slug", () => {
    for (const record of API_SEARCH_ENDPOINT_INDEX) {
      const parent = API_RESOURCES.find(
        (r) => r.slug === record.resourceSlug,
      );
      expect(parent, `parent for ${record.resourceSlug}`).toBeDefined();
      expect(parent!.endpoints).toContain(record.endpoint);
    }
  });

  it("haystacks are lowercased", () => {
    for (const record of API_SEARCH_RESOURCE_INDEX) {
      expect(record.haystack).toBe(record.haystack.toLowerCase());
    }
    for (const record of API_SEARCH_ENDPOINT_INDEX) {
      expect(record.haystack).toBe(record.haystack.toLowerCase());
    }
  });

  it("endpoint haystacks include rendered snippet text (curl auth header)", () => {
    // The matcher needs to surface endpoints when a partner searches
    // for "Authorization" or "Basic" — both of which appear inside
    // the curl/Node/Python snippets we generate. Confirm at least one
    // record carries that body text.
    const someoneSeesAuth = API_SEARCH_ENDPOINT_INDEX.some((r) =>
      r.haystack.includes("authorization"),
    );
    expect(someoneSeesAuth).toBe(true);
  });

  it("endpoint haystacks include the verb-path pair in canonical form", () => {
    for (const record of API_SEARCH_ENDPOINT_INDEX) {
      const expected =
        `${record.endpoint.verb} ${record.endpoint.path}`.toLowerCase();
      expect(record.haystack).toContain(expected);
    }
  });
});

describe("§163 apiSearch — tokenizeQuery", () => {
  it("returns an empty array for empty / whitespace input", () => {
    expect(tokenizeQuery("")).toEqual([]);
    expect(tokenizeQuery("   ")).toEqual([]);
    expect(tokenizeQuery("\t\n")).toEqual([]);
  });

  it("lowercases tokens", () => {
    expect(tokenizeQuery("POST Orders")).toEqual(["post", "orders"]);
  });

  it("collapses runs of whitespace", () => {
    expect(tokenizeQuery("  GET   /orders  ")).toEqual([
      "get",
      "/orders",
    ]);
  });

  it("preserves slashes and braces inside tokens", () => {
    expect(tokenizeQuery("/branches/{id}")).toEqual([
      "/branches/{id}",
    ]);
  });
});

describe("§163 searchApi — empty query", () => {
  it("returns the full unfiltered view for empty / whitespace queries", () => {
    for (const q of ["", "   ", "\t"]) {
      const result = searchApi(q);
      expect(result.isEmpty).toBe(true);
      expect(result.resources).toEqual(API_RESOURCES);
      expect(result.endpoints).toEqual(API_SEARCH_ENDPOINT_INDEX);
    }
  });
});

describe("§163 searchApi — query semantics", () => {
  it("matches on resource name (case-insensitive)", () => {
    const result = searchApi("orders");
    expect(result.isEmpty).toBe(false);
    const ordersResource = result.resources.find(
      (r) => r.slug === "orders",
    );
    expect(ordersResource, "orders resource present").toBeDefined();
  });

  it("expands a resource match to include all its endpoints", () => {
    const orders = API_RESOURCES.find((r) => r.slug === "orders");
    expect(orders, "orders fixture").toBeDefined();
    const result = searchApi("orders");
    const slugsInEndpoints = new Set(
      result.endpoints.map((e) => e.resourceSlug),
    );
    expect(slugsInEndpoints.has("orders")).toBe(true);
    const ordersEndpointsInResult = result.endpoints.filter(
      (e) => e.resourceSlug === "orders",
    );
    expect(ordersEndpointsInResult).toHaveLength(orders!.endpoints.length);
  });

  it("matches on a verb alone (POST -> only POST endpoints)", () => {
    const result = searchApi("post");
    expect(result.isEmpty).toBe(false);
    expect(result.endpoints.length).toBeGreaterThan(0);
    for (const record of result.endpoints) {
      // Either the endpoint itself is a POST OR its parent resource
      // matched by name. We don't allow GET endpoints whose parent
      // didn't match by name into a POST-only result.
      const parentMatchedByName = result.resources.some(
        (r) => r.slug === record.resourceSlug && r.name.toLowerCase().includes("post"),
      );
      if (!parentMatchedByName) {
        expect(record.endpoint.verb).toBe("POST");
      }
    }
  });

  it("matches on a path fragment (orders -> resources whose endpoints include /orders)", () => {
    const result = searchApi("/orders");
    expect(result.isEmpty).toBe(false);
    const everyEndpointHasOrders = result.endpoints.every((r) =>
      r.endpoint.path.toLowerCase().includes("/orders"),
    );
    expect(everyEndpointHasOrders).toBe(true);
  });

  it("treats multi-token queries as AND across tokens (verb + text)", () => {
    const result = searchApi("post orders");
    expect(result.isEmpty).toBe(false);
    expect(result.endpoints.length).toBeGreaterThan(0);
    // Every endpoint in the result must be a POST AND must mention
    // 'orders' somewhere in its haystack (path, parent description,
    // or snippet body — e.g. a health-screening snippet that posts
    // orders is a legitimate hit). The strict invariant is just the
    // verb filter and the haystack containing the text token.
    for (const record of result.endpoints) {
      expect(record.endpoint.verb).toBe("POST");
      expect(record.haystack).toContain("orders");
    }
    // And the canonical POST /orders endpoint must be present.
    const ordersPost = result.endpoints.find(
      (r) =>
        r.resourceSlug === "orders" && r.endpoint.verb === "POST",
    );
    expect(ordersPost, "POST /orders should be in the result").toBeDefined();
  });

  it("matches on snippet contents (Authorization header)", () => {
    const result = searchApi("authorization");
    expect(result.isEmpty).toBe(false);
    expect(result.endpoints.length).toBeGreaterThan(0);
    // Authorization appears in every snippet, so every endpoint should match.
    expect(result.endpoints).toHaveLength(API_SEARCH_ENDPOINT_INDEX.length);
  });

  it("returns no matches for a nonsense query", () => {
    const result = searchApi("zzz-no-such-thing-xyzqq");
    expect(result.isEmpty).toBe(false);
    expect(result.resources).toHaveLength(0);
    expect(result.endpoints).toHaveLength(0);
  });

  it("preserves declaration order in the resources list", () => {
    // Filter to a multi-resource query (every resource matches "api")
    // because every endpoint snippet contains the API_HOST literal.
    const result = searchApi("api");
    const order = result.resources.map((r) => r.slug);
    const expected = API_RESOURCES.filter((r) =>
      order.includes(r.slug),
    ).map((r) => r.slug);
    expect(order).toEqual(expected);
  });

  it("when an endpoint matches but its parent did not, the parent is still included", () => {
    // Build a query that hits an endpoint by path but not its parent
    // by name — `/orders/{id}` is unique to Orders, but the resource
    // name 'Orders' would also match. Use a more specific token mix.
    const result = searchApi("get /orders");
    expect(result.isEmpty).toBe(false);
    const ordersResource = result.resources.find(
      (r) => r.slug === "orders",
    );
    expect(ordersResource).toBeDefined();
  });
});

describe("§163 Integrations page — search bar wiring (source pins)", () => {
  const PAGE_SRC = readFileSync(
    resolve(__dirname, "..", "pages", "Integrations.tsx"),
    "utf8",
  );

  it("imports searchApi from the shared module", () => {
    expect(PAGE_SRC).toMatch(
      /import\s+\{\s*searchApi\s*\}\s+from\s+["']@\/lib\/apiSearch["']/,
    );
  });

  it("declares the apiQuery + debounced apiSearchTerm state", () => {
    expect(PAGE_SRC).toContain("setApiQuery");
    expect(PAGE_SRC).toContain("setApiSearchTerm");
    expect(PAGE_SRC).toMatch(/useState\(\s*""\s*\)/);
  });

  it("debounces query into search term inside a useEffect", () => {
    // We expect a setTimeout that updates apiSearchTerm with the
    // current apiQuery value. setTimeout body contains parens, so we
    // anchor on the call shape rather than try to match the whole
    // arrow body in a single regex.
    expect(PAGE_SRC).toContain("setTimeout(() => setApiSearchTerm(apiQuery)");
    expect(PAGE_SRC).toContain("clearTimeout(id)");
  });

  it("calls searchApi(apiSearchTerm) and reads the returned arrays", () => {
    expect(PAGE_SRC).toMatch(/searchApi\(\s*apiSearchTerm\s*\)/);
    expect(PAGE_SRC).toContain("filteredResources");
    expect(PAGE_SRC).toContain("filteredEndpointRecords");
  });

  it("renders a search input with the api-doc-search testid", () => {
    expect(PAGE_SRC).toMatch(
      /data-testid=["']api-doc-search["']/,
    );
    expect(PAGE_SRC).toMatch(/role=["']searchbox["']/);
    expect(PAGE_SRC).toMatch(/aria-label=["']Search the API documentation["']/);
  });

  it("renders a clear button when the query has content", () => {
    expect(PAGE_SRC).toMatch(/data-testid=["']api-doc-search-clear["']/);
  });

  it("handles Escape to clear the query", () => {
    expect(PAGE_SRC).toMatch(/e\.key === ["']Escape["']/);
  });

  it("renders the result-count summary when a search is active", () => {
    expect(PAGE_SRC).toMatch(
      /data-testid=["']api-doc-search-summary["']/,
    );
    expect(PAGE_SRC).toMatch(/aria-live=["']polite["']/);
  });

  it("renders an empty-state card when no matches", () => {
    expect(PAGE_SRC).toMatch(
      /data-testid=["']api-doc-search-empty["']/,
    );
  });

  it("the resource cards grid iterates filteredResources, not API_RESOURCES.map", () => {
    // Find the api-resources-grid block and assert it uses filteredResources.
    const idx = PAGE_SRC.indexOf("api-resources-grid");
    expect(idx).toBeGreaterThan(-1);
    const slice = PAGE_SRC.slice(idx, idx + 800);
    expect(slice).toContain("filteredResources.map");
  });

  it("the snippets grid iterates filteredEndpointRecords, not API_RESOURCES.flatMap", () => {
    const idx = PAGE_SRC.indexOf("api-snippets-grid");
    expect(idx).toBeGreaterThan(-1);
    const slice = PAGE_SRC.slice(idx, idx + 800);
    expect(slice).toContain("filteredEndpointRecords.map");
    expect(slice).not.toContain("API_RESOURCES.flatMap");
  });

  it("hides both grids when there are no matches", () => {
    expect(PAGE_SRC).toMatch(/noApiSearchMatches\s*\?\s*"hidden"\s*:\s*""/);
  });
});

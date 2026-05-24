/*
  §163 — Search index + matcher for the API documentation section on
  /integrations.

  The Integrations page renders a list of resources (Branches, Clients,
  Orders, …) and a list of code snippet cards (one per endpoint × three
  languages). When partners are scanning for "POST orders" or
  "Authorization", they shouldn't have to scroll through nine
  resources to find it — this module powers a single search bar that
  filters both lists in lockstep.

  Design notes:
  • The index is built once at module load from apiReference + the three
    snippet generators in apiSnippets, so it can never drift from the
    canonical docs.
  • The query is normalized (lowercase, collapsed whitespace) and split
    into tokens. A record matches when EVERY token appears somewhere in
    its haystack — this lets a partner type "post orders" and get a
    union of fields rather than a brittle exact-phrase match.
  • The matcher returns a stable ordering: resource cards keep their
    original order from API_RESOURCES, and endpoint cards keep their
    declaration order inside each resource. We do not score by
    relevance — for an API reference of this size (9 resources, 13
    endpoints) flat alphabetical-by-source feels more predictable than
    a fuzzy ranker.
  • An empty / whitespace-only query returns the full list unchanged.
    The page UI uses this to render the unfiltered view without a
    separate code path.
*/

import {
  API_RESOURCES,
  type ApiEndpoint,
  type ApiResource,
} from "./apiReference";
import {
  buildCurlSnippet,
  buildNodeSnippet,
  buildPythonSnippet,
} from "./apiSnippets";

/** A single endpoint record enriched with all three rendered snippets. */
export type ApiSearchEndpointRecord = {
  resourceSlug: string;
  resourceName: string;
  endpoint: ApiEndpoint;
  /** Combined haystack for matching: lowercased + space-separated. */
  haystack: string;
};

/** A single resource record enriched with its endpoint haystacks. */
export type ApiSearchResourceRecord = {
  resource: ApiResource;
  /** Combined haystack for the resource itself (name + slug + summary). */
  haystack: string;
};

/**
 * Build the per-endpoint haystack. Combines the verb, the path, the
 * resource name + slug + description, and the rendered text of all
 * three language snippets — so a partner who types "Authorization" gets
 * back every endpoint whose snippet shows the Basic auth header, and a
 * partner who types "fetch" gets every endpoint that has a Node snippet
 * (which is all of them, but the search still works).
 */
function buildEndpointHaystack(
  resource: ApiResource,
  endpoint: ApiEndpoint,
): string {
  const parts = [
    resource.name,
    resource.slug,
    resource.shortDescription,
    endpoint.verb,
    endpoint.path,
    `${endpoint.verb} ${endpoint.path}`,
    buildCurlSnippet(endpoint),
    buildNodeSnippet(endpoint),
    buildPythonSnippet(endpoint),
  ];
  return parts.join(" \u00b7 ").toLowerCase();
}

/**
 * Build the per-resource haystack. We deliberately do NOT include
 * snippet text here — the resource cards are the high-level index; if
 * a partner is searching for snippet contents, the snippet card list
 * below is the right place to surface them.
 */
function buildResourceHaystack(resource: ApiResource): string {
  return [
    resource.name,
    resource.slug,
    resource.shortDescription,
    ...resource.endpoints.map((e) => `${e.verb} ${e.path}`),
  ]
    .join(" \u00b7 ")
    .toLowerCase();
}

/** All endpoints across all resources, in declaration order. */
export const API_SEARCH_ENDPOINT_INDEX: ReadonlyArray<ApiSearchEndpointRecord> =
  API_RESOURCES.flatMap((resource) =>
    resource.endpoints.map((endpoint) => ({
      resourceSlug: resource.slug,
      resourceName: resource.name,
      endpoint,
      haystack: buildEndpointHaystack(resource, endpoint),
    })),
  );

/** All resources in declaration order. */
export const API_SEARCH_RESOURCE_INDEX: ReadonlyArray<ApiSearchResourceRecord> =
  API_RESOURCES.map((resource) => ({
    resource,
    haystack: buildResourceHaystack(resource),
  }));

/** Tokenize a query: lowercase, trim, split on whitespace, drop empties. */
export function tokenizeQuery(query: string): string[] {
  if (!query) return [];
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

/**
 * Known HTTP verbs. When a query token equals one of these we treat it
 * as a strict verb filter — a partner who types "post" expects to see
 * only POST endpoints, not GET endpoints whose snippet bodies happen to
 * contain the word "post" in prose. This makes the search bar feel like
 * an API browser instead of a free-text grep.
 */
const HTTP_VERB_TOKENS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
]);

export function partitionTokens(tokens: string[]): {
  verbs: string[];
  text: string[];
} {
  const verbs: string[] = [];
  const text: string[] = [];
  for (const t of tokens) {
    if (HTTP_VERB_TOKENS.has(t)) verbs.push(t);
    else text.push(t);
  }
  return { verbs, text };
}

/** True when every text token appears somewhere in the haystack. */
function matchesAllTokens(haystack: string, tokens: string[]): boolean {
  for (const token of tokens) {
    if (!haystack.includes(token)) return false;
  }
  return true;
}

export type ApiSearchResult = {
  /** Resources whose haystack matched — used to filter the resource grid. */
  resources: ReadonlyArray<ApiResource>;
  /** Endpoints whose haystack matched — used to filter the snippet cards. */
  endpoints: ReadonlyArray<ApiSearchEndpointRecord>;
  /** True when the query was effectively empty (returns everything). */
  isEmpty: boolean;
};

/**
 * Filter both indexes by the query. An empty / whitespace query returns
 * the full unfiltered view. Resource matches automatically expand to
 * include every endpoint of that resource — so typing "Orders" surfaces
 * the resource card AND its three endpoint snippet cards, rather than
 * forcing the partner to refine the query.
 */
export function searchApi(query: string): ApiSearchResult {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return {
      resources: API_RESOURCES,
      endpoints: API_SEARCH_ENDPOINT_INDEX,
      isEmpty: true,
    };
  }

  const { verbs, text } = partitionTokens(tokens);

  // Resources match on text tokens only — a verb token by itself
  // shouldn't surface every resource card, since the resource haystack
  // already includes its endpoint verbs and would match overly broadly.
  const matchedResourceSlugs = new Set<string>();
  const resources: ApiResource[] = [];
  if (text.length > 0) {
    for (const record of API_SEARCH_RESOURCE_INDEX) {
      if (matchesAllTokens(record.haystack, text)) {
        resources.push(record.resource);
        matchedResourceSlugs.add(record.resource.slug);
      }
    }
  }

  const endpoints: ApiSearchEndpointRecord[] = [];
  // Endpoints are matched on text tokens AND verb tokens (verb must
  // match endpoint.verb exactly), OR included because their parent
  // resource matched the text tokens.
  for (const record of API_SEARCH_ENDPOINT_INDEX) {
    const verbOk =
      verbs.length === 0 ||
      verbs.includes(record.endpoint.verb.toLowerCase());
    const parentMatched = matchedResourceSlugs.has(record.resourceSlug);
    const textOk =
      text.length === 0 || matchesAllTokens(record.haystack, text);
    if (parentMatched && verbs.length === 0) {
      endpoints.push(record);
      continue;
    }
    if (verbOk && textOk) {
      endpoints.push(record);
    }
  }

  // If a resource didn't match by name but one of its endpoints did,
  // include the resource card too — partners scanning by a verb like
  // "POST" expect the parent card to be visible, not just the snippets.
  for (const record of endpoints) {
    if (matchedResourceSlugs.has(record.resourceSlug)) continue;
    const resource = API_RESOURCES.find(
      (r) => r.slug === record.resourceSlug,
    );
    if (!resource) continue;
    if (resources.includes(resource)) continue;
    resources.push(resource);
    matchedResourceSlugs.add(resource.slug);
  }

  // Restore original declaration order for the resource list (a Set
  // doesn't guarantee insertion === declaration order across both code
  // paths above).
  const orderedResources = API_RESOURCES.filter((r) =>
    matchedResourceSlugs.has(r.slug),
  );

  return {
    resources: orderedResources,
    endpoints,
    isEmpty: false,
  };
}

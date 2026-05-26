/*
  §162 — Downloadable API code snippets for the Rapid Hire API v2.

  This module is the single source of truth that turns any endpoint in
  @/lib/apiReference into copy-ready code in the three languages
  partners actually paste: curl (shell), JavaScript/Node (fetch), and
  Python (requests). The /integrations page renders these inline with
  per-snippet copy + download buttons, and a section-level "Download
  all snippets as ZIP" wraps every endpoint × every language into a
  single archive.

  Path params like `{id}` and `{state abbreviation}` are substituted
  with example values so the snippets run when pasted (after dropping
  in real credentials). Auth is always HTTP Basic — the same scheme
  the docs describe.

  Conventions:
    • All snippets target API_HOST_PRODUCTION; commented one-liner
      points partners at API_HOST_STAGING if they want to test first.
    • POST / PUT / PATCH bodies are documented as a stub `{ ... }`
      object — the precisehire docs don't publish a strict schema
      for every write endpoint, so we don't fabricate one.
    • Credentials are placeholders ("USERNAME" / "PASSWORD") so a
      snippet that ends up checked into version control can't leak.
*/

import {
  API_HOST_PRODUCTION,
  API_HOST_STAGING,
  API_RESOURCES,
  type ApiEndpoint,
  type ApiResource,
} from "./apiReference";

export type SnippetLanguage = "curl" | "node" | "python";

export const SNIPPET_LANGUAGES: ReadonlyArray<{
  id: SnippetLanguage;
  label: string;
  ext: string;
  mimeType: string;
}> = [
  { id: "curl", label: "curl", ext: "sh", mimeType: "text/x-shellscript" },
  { id: "node", label: "Node.js", ext: "js", mimeType: "text/javascript" },
  { id: "python", label: "Python", ext: "py", mimeType: "text/x-python" },
] as const;

const PLACEHOLDER_USER = "USERNAME";
const PLACEHOLDER_PASS = "PASSWORD";

/**
 * Replace `{...}` path params with a clearly-fake placeholder value the
 * partner can swap. We keep the original token name in the placeholder
 * so it's still self-documenting (e.g. `{id}` → `12345`,
 * `{state abbreviation}` → `CA`).
 */
export function fillPathParams(path: string): string {
  return path.replace(/\{([^}]+)\}/g, (_match, token) => {
    const norm = String(token).trim().toLowerCase();
    if (/state\s*abbreviation/.test(norm) || norm === "state") return "CA";
    if (norm === "id" || /\bid\b/.test(norm)) return "12345";
    if (/branch/.test(norm)) return "367";
    if (/package/.test(norm)) return "BASIC";
    if (/order/.test(norm)) return "98765";
    if (/invit/.test(norm)) return "INV-12345";
    // Fallback: a short opaque token. Never leak the raw {token} into
    // the snippet — that would look broken in copy/paste.
    return "EXAMPLE";
  });
}

/**
 * The fully-qualified URL with path params filled in, useful for
 * curl/fetch/requests calls. Defaults to production; pass
 * { host: "staging" } to target the staging host.
 */
export function buildEndpointUrl(
  endpoint: Pick<ApiEndpoint, "path">,
  opts: { host?: "production" | "staging" } = {},
): string {
  const host =
    opts.host === "staging" ? API_HOST_STAGING : API_HOST_PRODUCTION;
  const path = fillPathParams(endpoint.path);
  return `${host}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * True for verbs that the REST docs document as carrying a JSON body.
 */
export function verbHasBody(verb: ApiEndpoint["verb"]): boolean {
  return verb === "POST" || verb === "PUT" || verb === "PATCH";
}

/**
 * Generate a curl snippet for an endpoint.
 */
export function buildCurlSnippet(endpoint: ApiEndpoint): string {
  const url = buildEndpointUrl(endpoint);
  const lines: string[] = [
    `# ${endpoint.verb} ${endpoint.path}`,
    `# Production host. Swap for ${API_HOST_STAGING} to use staging.`,
  ];
  if (verbHasBody(endpoint.verb)) {
    lines.push(
      `curl -X ${endpoint.verb} \\`,
      `  --user ${PLACEHOLDER_USER}:${PLACEHOLDER_PASS} \\`,
      `  -H "Content-Type: application/json" \\`,
      `  -H "Accept: application/json" \\`,
      `  -d '{ "example": "replace-with-your-payload" }' \\`,
      `  ${url}`,
    );
  } else {
    lines.push(
      `curl -X ${endpoint.verb} \\`,
      `  --user ${PLACEHOLDER_USER}:${PLACEHOLDER_PASS} \\`,
      `  -H "Accept: application/json" \\`,
      `  ${url}`,
    );
  }
  return lines.join("\n") + "\n";
}

/**
 * Generate a Node.js (fetch + Buffer-based Basic auth) snippet for an
 * endpoint. Targets the global fetch in Node 18+ so partners don't
 * need to install an HTTP client.
 */
export function buildNodeSnippet(endpoint: ApiEndpoint): string {
  const url = buildEndpointUrl(endpoint);
  const hasBody = verbHasBody(endpoint.verb);
  const lines: string[] = [
    `// ${endpoint.verb} ${endpoint.path}`,
    `// Requires Node 18+ (uses the built-in global fetch).`,
    `// Swap API_HOST for "${API_HOST_STAGING}" to call staging.`,
    ``,
    `const username = process.env.RHS_USERNAME ?? "${PLACEHOLDER_USER}";`,
    `const password = process.env.RHS_PASSWORD ?? "${PLACEHOLDER_PASS}";`,
    `const credentials = Buffer.from(\`\${username}:\${password}\`).toString("base64");`,
    ``,
    `const response = await fetch(${JSON.stringify(url)}, {`,
    `  method: ${JSON.stringify(endpoint.verb)},`,
    `  headers: {`,
    `    Authorization: \`Basic \${credentials}\`,`,
    `    Accept: "application/json",`,
  ];
  if (hasBody) {
    lines.push(`    "Content-Type": "application/json",`);
    lines.push(`  },`);
    lines.push(
      `  body: JSON.stringify({ example: "replace-with-your-payload" }),`,
    );
  } else {
    lines.push(`  },`);
  }
  lines.push(
    `});`,
    ``,
    `if (!response.ok) {`,
    `  throw new Error(\`API request failed: \${response.status} \${response.statusText}\`);`,
    `}`,
    ``,
    `const payload = await response.json();`,
    `console.log(payload);`,
  );
  return lines.join("\n") + "\n";
}

/**
 * Generate a Python (requests) snippet for an endpoint.
 */
export function buildPythonSnippet(endpoint: ApiEndpoint): string {
  const url = buildEndpointUrl(endpoint);
  const hasBody = verbHasBody(endpoint.verb);
  const lines: string[] = [
    `# ${endpoint.verb} ${endpoint.path}`,
    `# pip install requests`,
    `# Swap to "${API_HOST_STAGING}" to call staging.`,
    ``,
    `import os`,
    `import requests`,
    ``,
    `username = os.environ.get("RHS_USERNAME", "${PLACEHOLDER_USER}")`,
    `password = os.environ.get("RHS_PASSWORD", "${PLACEHOLDER_PASS}")`,
    ``,
    `response = requests.request(`,
    `    ${JSON.stringify(endpoint.verb)},`,
    `    ${JSON.stringify(url)},`,
    `    auth=(username, password),`,
    `    headers={"Accept": "application/json"},`,
  ];
  if (hasBody) {
    lines.push(`    json={"example": "replace-with-your-payload"},`);
  }
  lines.push(
    `    timeout=30,`,
    `)`,
    ``,
    `response.raise_for_status()`,
    `print(response.json())`,
  );
  return lines.join("\n") + "\n";
}

/**
 * Dispatch to the language-specific generator.
 */
export function buildSnippet(
  endpoint: ApiEndpoint,
  language: SnippetLanguage,
): string {
  switch (language) {
    case "curl":
      return buildCurlSnippet(endpoint);
    case "node":
      return buildNodeSnippet(endpoint);
    case "python":
      return buildPythonSnippet(endpoint);
  }
}

/**
 * Stable filename used both for per-snippet downloads and as the
 * entry path inside the all-snippets ZIP. Format:
 *
 *   <resource-slug>/<verb>-<flattened-path>.<ext>
 *
 * Example: `branches/GET-branches.sh`,
 *          `counties/GET-counties-state.sh`.
 */
export function buildSnippetFilename(
  resource: Pick<ApiResource, "slug">,
  endpoint: ApiEndpoint,
  language: SnippetLanguage,
): string {
  const lang = SNIPPET_LANGUAGES.find((l) => l.id === language);
  if (!lang) {
    throw new Error(`Unknown snippet language: ${String(language)}`);
  }
  // Flatten `/branches` → `branches`,
  //          `/counties/{state abbreviation}` → `counties-state`.
  const flat = endpoint.path
    .replace(/\{[^}]+\}/g, (match) => {
      const token = match.slice(1, -1).trim().toLowerCase();
      if (/state/.test(token)) return "state";
      if (/branch/.test(token)) return "branch";
      if (/package/.test(token)) return "package";
      if (/order/.test(token)) return "order";
      if (/invit/.test(token)) return "invite";
      if (/id/.test(token)) return "id";
      return "param";
    })
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${resource.slug}/${endpoint.verb}-${flat}.${lang.ext}`;
}

/**
 * Filename for the all-snippets ZIP. Versioned + dated so partners
 * who download it twice in one release cycle don't end up with two
 * files that look identical in their Downloads folder.
 */
export function buildSnippetBundleFilename(
  date: Date = new Date(),
): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `rapid-hire-api-snippets-v2-${y}-${m}-${d}.zip`;
}

/**
 * The full manifest of files that go into the all-snippets ZIP.
 * Exposed as a pure function so the ZIP builder, the page, and
 * tests can all agree on the contents without re-implementing the
 * traversal.
 *
 * Each entry's `filename` doubles as the ZIP-internal path.
 */
export type SnippetManifestEntry = {
  filename: string;
  language: SnippetLanguage;
  resource: ApiResource;
  endpoint: ApiEndpoint;
  contents: string;
};

export function buildSnippetManifest(
  resources: ReadonlyArray<ApiResource> = API_RESOURCES,
): SnippetManifestEntry[] {
  const out: SnippetManifestEntry[] = [];
  for (const resource of resources) {
    for (const endpoint of resource.endpoints) {
      for (const { id: language } of SNIPPET_LANGUAGES) {
        out.push({
          filename: buildSnippetFilename(resource, endpoint, language),
          language,
          resource,
          endpoint,
          contents: buildSnippet(endpoint, language),
        });
      }
    }
  }
  return out;
}

/**
 * Build a README that ships alongside the snippets inside the ZIP, so
 * a partner who downloads the bundle has on-disk context (auth scheme,
 * host URLs, link to the live docs) without needing to keep the
 * /integrations page open.
 */
export function buildSnippetBundleReadme(
  date: Date = new Date(),
): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return [
    `# Rapid Hire Solutions — API v2 Code Snippets`,
    ``,
    `Generated on ${y}-${m}-${d} for the Rapid Hire Solutions REST API v2.`,
    ``,
    `## What's inside`,
    ``,
    `One folder per resource (branches, clients, counties, healthscreenings,`,
    `invitations, orders, packages, products, researchers), each containing`,
    `runnable code in three languages:`,
    ``,
    `* \`*.sh\`  — curl (POSIX shell)`,
    `* \`*.js\`  — Node.js 18+ (built-in fetch + Buffer-based Basic auth)`,
    `* \`*.py\`  — Python 3 (requests)`,
    ``,
    `## Authentication`,
    ``,
    `Every endpoint expects HTTP Basic auth. Drop your Rapid Hire login`,
    `credentials into the \`RHS_USERNAME\` and \`RHS_PASSWORD\` environment`,
    `variables, or replace the \`USERNAME\` / \`PASSWORD\` placeholders inline.`,
    ``,
    `## Hosts`,
    ``,
    `* Production: ${API_HOST_PRODUCTION}`,
    `* Staging:    ${API_HOST_STAGING}`,
    ``,
    `## Need a different language or webhook example?`,
    ``,
    /*
     * §192: this README ships inside the downloadable ZIP that customers
     * unpack on their own machine. The URL must point at the production
     * marketing site, not at the staging Manus webdev domain that
     * disappears as soon as the project leaves Manus hosting. Hardcoding
     * the canonical https://www.rapidhiresolutions.com here matches the
     * pattern used by SITE_BASE_URL elsewhere in the codebase.
     */
    `Request an integration at https://www.rapidhiresolutions.com/integrations`,
    `— we'll wire the snippet for you. Live API docs at the same URL.`,
    ``,
  ].join("\n");
}

/* ──────────────────────────────────────────────────────────────────
 * ZIP bundle assembly.
 *
 * We use `fflate` because it ships a tree-shakeable, no-WASM, ~16KB
 * gzip pipeline that runs in both the browser and a vitest/Node
 * environment with no extra plumbing — important because we also
 * unit-test the bundle round-trip in vitest.
 * ────────────────────────────────────────────────────────────────── */

import { zipSync, strToU8, unzipSync, strFromU8 } from "fflate";

const README_FILENAME = "README.md";

/**
 * Build a Zip archive (returned as a Uint8Array of bytes) containing
 * every snippet from `buildSnippetManifest()` plus a README. The
 * `date` parameter is exposed so tests can pin a deterministic value.
 */
export function buildSnippetBundle(
  options: {
    resources?: ReadonlyArray<ApiResource>;
    date?: Date;
  } = {},
): Uint8Array {
  const resources = options.resources ?? API_RESOURCES;
  const date = options.date ?? new Date();
  const manifest = buildSnippetManifest(resources);
  const files: Record<string, Uint8Array> = {};
  for (const entry of manifest) {
    files[entry.filename] = strToU8(entry.contents);
  }
  files[README_FILENAME] = strToU8(buildSnippetBundleReadme(date));
  // zipSync returns a Uint8Array that is structurally identical
  // across browser and Node, so the test can read it back the
  // same way the partner's unzip tool will.
  return zipSync(files, { level: 6 });
}

/**
 * Read a snippet bundle's filename list (used by tests and any
 * future "preview before download" UI).
 */
export function listSnippetBundleFiles(bytes: Uint8Array): string[] {
  const entries = unzipSync(bytes);
  return Object.keys(entries).sort();
}

/**
 * Read a single file out of a snippet bundle as text. Tests use this
 * to round-trip the README and a sample snippet.
 */
export function readSnippetBundleFile(
  bytes: Uint8Array,
  filename: string,
): string {
  const entries = unzipSync(bytes);
  const file = entries[filename];
  if (!file) {
    throw new Error(`Bundle does not contain ${filename}`);
  }
  return strFromU8(file);
}

/* ──────────────────────────────────────────────────────────────────
 * Browser-glue (single-file download + ZIP download).
 *
 * Shaped exactly like @/lib/k12Pdf / @/lib/apiDocsPdf so the test
 * can pass a `host` shim and run in Node-only without jsdom: the
 * host owns createElement + appendChild and the helper does the
 * rest. In real usage the host defaults to the real `document`.
 * ────────────────────────────────────────────────────────────────── */

export type DownloadHost = {
  createElement: (tag: "a") => HTMLAnchorElement;
  body: { appendChild: (node: Node) => void };
};

const DEFAULT_HOST: DownloadHost | null =
  typeof document === "undefined"
    ? null
    : {
        createElement: (tag) => document.createElement(tag),
        body: { appendChild: (n) => document.body.appendChild(n) },
      };

/**
 * Trigger a single text download (per-snippet copy is handled by
 * the UI separately via navigator.clipboard). The `host` parameter
 * is for tests; in browsers leave it undefined.
 */
export function triggerSnippetTextDownload(args: {
  filename: string;
  contents: string;
  mimeType: string;
  host?: DownloadHost | null;
}): { downloadAttribute: string; mimeType: string; size: number } {
  const host = args.host ?? DEFAULT_HOST;
  if (!host) {
    throw new Error("Snippet download requires a DOM host");
  }
  const bytes = strToU8(args.contents);
  const blob = new Blob([bytes], { type: args.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = host.createElement("a");
  anchor.href = url;
  anchor.download = args.filename;
  // Some browsers ignore `download` unless the anchor is in the DOM.
  host.body.appendChild(anchor);
  anchor.click();
  // Defer revocation so Safari/older Chrome can finish the navigation.
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return {
    downloadAttribute: args.filename,
    mimeType: args.mimeType,
    size: bytes.length,
  };
}

/**
 * Trigger the all-snippets ZIP download.
 */
export function triggerSnippetBundleDownload(args: {
  bytes: Uint8Array;
  filename: string;
  host?: DownloadHost | null;
}): { downloadAttribute: string; mimeType: string; size: number } {
  const host = args.host ?? DEFAULT_HOST;
  if (!host) {
    throw new Error("Snippet bundle download requires a DOM host");
  }
  const blob = new Blob([args.bytes], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const anchor = host.createElement("a");
  anchor.href = url;
  anchor.download = args.filename;
  host.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  return {
    downloadAttribute: args.filename,
    mimeType: "application/zip",
    size: args.bytes.length,
  };
}

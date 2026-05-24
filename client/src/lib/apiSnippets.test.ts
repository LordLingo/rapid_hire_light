/*
  §162 — apiSnippets generator + ZIP bundle + page-wiring spec.

  Covers four behaviors:
    1. Snippet shape: per-language, per-verb, body vs. no-body, path
       params are filled in with non-leaky placeholders.
    2. Filename + bundle: deterministic per-endpoint filenames, ZIP
       manifest covers every (resource × endpoint × language) plus a
       README, round-trip read of arbitrary entries.
    3. Page wiring: Integrations.tsx imports the generator + bundle
       triggers, renders language tabs, exposes copy + download
       testids, and the section header button posts to the same
       triggerSnippetBundleDownload entry point.
    4. Browser-glue host: triggerSnippetTextDownload and
       triggerSnippetBundleDownload accept an injected DOM-like
       host so the click contract can be verified without jsdom.
*/

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { strToU8, strFromU8, zipSync, unzipSync } from "fflate";

import {
  API_HOST_PRODUCTION,
  API_HOST_STAGING,
  API_RESOURCES,
  type ApiEndpoint,
} from "./apiReference";
import {
  SNIPPET_LANGUAGES,
  buildCurlSnippet,
  buildEndpointUrl,
  buildNodeSnippet,
  buildPythonSnippet,
  buildSnippet,
  buildSnippetBundle,
  buildSnippetBundleFilename,
  buildSnippetBundleReadme,
  buildSnippetFilename,
  buildSnippetManifest,
  fillPathParams,
  listSnippetBundleFiles,
  readSnippetBundleFile,
  triggerSnippetBundleDownload,
  triggerSnippetTextDownload,
  verbHasBody,
  type SnippetLanguage,
} from "./apiSnippets";

// ─── Phase 1 sanity-touch: silence ts-noUnusedLocals on imports
// only used by the round-trip helpers below. ────────────────────
void zipSync;
void unzipSync;
void strToU8;
void strFromU8;

const PAGE_SRC = readFileSync(
  resolve(__dirname, "../pages/Integrations.tsx"),
  "utf8",
);

const SNIPPETS_SRC = readFileSync(
  resolve(__dirname, "./apiSnippets.ts"),
  "utf8",
);

describe("§162 snippets — language registry", () => {
  it("declares the three target languages in a stable order", () => {
    expect(SNIPPET_LANGUAGES.map((l) => l.id)).toEqual([
      "curl",
      "node",
      "python",
    ]);
  });

  it("every language carries a non-empty label, ext, and mimeType", () => {
    for (const lang of SNIPPET_LANGUAGES) {
      expect(lang.label).toMatch(/\S/);
      expect(lang.ext).toMatch(/^[a-z]+$/);
      expect(lang.mimeType).toMatch(/^[\w./+-]+$/);
    }
  });
});

describe("§162 snippets — path param filling", () => {
  it("substitutes {id} with a numeric example", () => {
    expect(fillPathParams("/orders/{id}")).toBe("/orders/12345");
  });

  it("substitutes {state abbreviation} with a real two-letter code", () => {
    expect(fillPathParams("/counties/{state abbreviation}")).toBe(
      "/counties/CA",
    );
  });

  it("never leaks an unsubstituted brace into the output", () => {
    for (const r of API_RESOURCES) {
      for (const ep of r.endpoints) {
        const filled = fillPathParams(ep.path);
        expect(filled).not.toMatch(/[{}]/);
      }
    }
  });

  it("builds production URLs against the production host", () => {
    const url = buildEndpointUrl({ path: "/orders/{id}" });
    expect(url.startsWith(API_HOST_PRODUCTION)).toBe(true);
    expect(url).toBe(`${API_HOST_PRODUCTION}/orders/12345`);
  });

  it("supports staging host opt-in", () => {
    const url = buildEndpointUrl(
      { path: "/orders/{id}" },
      { host: "staging" },
    );
    expect(url.startsWith(API_HOST_STAGING)).toBe(true);
  });
});

describe("§162 snippets — verb body semantics", () => {
  it("classifies POST/PUT/PATCH as body-bearing and GET/DELETE as not", () => {
    expect(verbHasBody("GET")).toBe(false);
    expect(verbHasBody("DELETE")).toBe(false);
    expect(verbHasBody("POST")).toBe(true);
    expect(verbHasBody("PUT")).toBe(true);
    expect(verbHasBody("PATCH")).toBe(true);
  });
});

describe("§162 snippets — curl generator", () => {
  it("emits a runnable -X VERB with Basic auth and Accept header for GET", () => {
    const out = buildCurlSnippet({ verb: "GET", path: "/branches" });
    expect(out).toMatch(/^# GET \/branches/);
    expect(out).toContain("curl -X GET");
    expect(out).toContain("--user USERNAME:PASSWORD");
    expect(out).toContain('-H "Accept: application/json"');
    expect(out).toContain(`${API_HOST_PRODUCTION}/branches`);
    // No body for GET.
    expect(out).not.toContain("-d '");
  });

  it("adds a -d JSON body and Content-Type for POST", () => {
    const out = buildCurlSnippet({ verb: "POST", path: "/orders" });
    expect(out).toContain('-H "Content-Type: application/json"');
    expect(out).toContain("-d '");
  });
});

describe("§162 snippets — node generator", () => {
  it("uses global fetch, Buffer-based Basic auth, and reads env credentials", () => {
    const out = buildNodeSnippet({
      verb: "GET",
      path: "/clients",
    });
    expect(out).toContain("global fetch");
    expect(out).toContain("Buffer.from(");
    expect(out).toContain('process.env.RHS_USERNAME ?? "USERNAME"');
    expect(out).toContain('process.env.RHS_PASSWORD ?? "PASSWORD"');
    expect(out).toContain("fetch(");
    expect(out).toContain(`${API_HOST_PRODUCTION}/clients`);
    expect(out).toContain('"GET"');
    expect(out).toContain("response.ok");
  });

  it("adds a JSON body and Content-Type for POST", () => {
    const out = buildNodeSnippet({ verb: "POST", path: "/orders" });
    expect(out).toContain('"Content-Type": "application/json"');
    expect(out).toContain("JSON.stringify(");
  });
});

describe("§162 snippets — python generator", () => {
  it("uses requests, env-backed Basic auth, and raises for status", () => {
    const out = buildPythonSnippet({
      verb: "GET",
      path: "/researchers",
    });
    expect(out).toContain("import requests");
    expect(out).toContain('os.environ.get("RHS_USERNAME", "USERNAME")');
    expect(out).toContain('os.environ.get("RHS_PASSWORD", "PASSWORD")');
    expect(out).toContain("requests.request(");
    expect(out).toContain('"GET"');
    expect(out).toContain(`${API_HOST_PRODUCTION}/researchers`);
    expect(out).toContain("response.raise_for_status()");
  });

  it("adds a json= kwarg for POST", () => {
    const out = buildPythonSnippet({
      verb: "POST",
      path: "/orders",
    });
    expect(out).toContain("json={");
  });
});

describe("§162 snippets — buildSnippet dispatch", () => {
  it("dispatches to the correct language generator", () => {
    const ep: ApiEndpoint = { verb: "GET", path: "/branches" };
    expect(buildSnippet(ep, "curl")).toBe(buildCurlSnippet(ep));
    expect(buildSnippet(ep, "node")).toBe(buildNodeSnippet(ep));
    expect(buildSnippet(ep, "python")).toBe(buildPythonSnippet(ep));
  });
});

describe("§162 snippets — filename builder", () => {
  it("uses <resource>/<verb>-<flat-path>.<ext>", () => {
    const filename = buildSnippetFilename(
      { slug: "branches" },
      { verb: "GET", path: "/branches" },
      "curl",
    );
    expect(filename).toBe("branches/GET-branches.sh");
  });

  it("flattens {state abbreviation} to 'state'", () => {
    const filename = buildSnippetFilename(
      { slug: "counties" },
      { verb: "GET", path: "/counties/{state abbreviation}" },
      "python",
    );
    expect(filename).toBe("counties/GET-counties-state.py");
  });

  it("produces unique filenames across the whole manifest", () => {
    const manifest = buildSnippetManifest();
    const names = manifest.map((m) => m.filename);
    expect(new Set(names).size).toBe(names.length);
  });

  it("throws on an unknown language", () => {
    expect(() =>
      buildSnippetFilename(
        { slug: "branches" },
        { verb: "GET", path: "/branches" },
        "ruby" as unknown as SnippetLanguage,
      ),
    ).toThrow(/Unknown snippet language/);
  });
});

describe("§162 snippets — manifest scope", () => {
  it("covers every (resource × endpoint × language)", () => {
    const manifest = buildSnippetManifest();
    let expected = 0;
    for (const r of API_RESOURCES) {
      expected += r.endpoints.length * SNIPPET_LANGUAGES.length;
    }
    expect(manifest.length).toBe(expected);
  });

  it("every manifest entry has non-empty contents", () => {
    for (const e of buildSnippetManifest()) {
      expect(e.contents.length).toBeGreaterThan(40);
    }
  });
});

describe("§162 snippets — README + bundle filename", () => {
  it("README mentions both hosts, the three languages, and the auth scheme", () => {
    const readme = buildSnippetBundleReadme(new Date("2026-05-23"));
    expect(readme).toContain(API_HOST_PRODUCTION);
    expect(readme).toContain(API_HOST_STAGING);
    expect(readme).toMatch(/curl/);
    expect(readme).toMatch(/Node\.js/);
    expect(readme).toMatch(/Python/);
    expect(readme).toMatch(/HTTP Basic/);
    expect(readme).toMatch(/2026-05-23/);
  });

  it("bundle filename is versioned + ISO-dated", () => {
    const name = buildSnippetBundleFilename(new Date("2026-05-23"));
    expect(name).toBe("rapid-hire-api-snippets-v2-2026-05-23.zip");
  });
});

describe("§162 snippets — ZIP bundle round-trip", () => {
  it("packs every manifest entry plus a README", () => {
    const bytes = buildSnippetBundle({ date: new Date("2026-05-23") });
    const names = listSnippetBundleFiles(bytes);
    const manifest = buildSnippetManifest();
    expect(names.length).toBe(manifest.length + 1); // +1 README
    expect(names).toContain("README.md");
    for (const m of manifest) {
      expect(names).toContain(m.filename);
    }
  });

  it("ZIP entry contents match the in-memory generator output", () => {
    const bytes = buildSnippetBundle({ date: new Date("2026-05-23") });
    const sample = buildSnippetFilename(
      { slug: "branches" },
      { verb: "GET", path: "/branches" },
      "curl",
    );
    const text = readSnippetBundleFile(bytes, sample);
    expect(text).toBe(
      buildCurlSnippet({ verb: "GET", path: "/branches" }),
    );
    const readme = readSnippetBundleFile(bytes, "README.md");
    expect(readme).toContain("Rapid Hire Solutions");
  });

  it("readSnippetBundleFile throws on a missing path", () => {
    const bytes = buildSnippetBundle({ date: new Date("2026-05-23") });
    expect(() =>
      readSnippetBundleFile(bytes, "does/not/exist.sh"),
    ).toThrow(/does not contain/);
  });
});

describe("§162 snippets — Integrations.tsx page wiring", () => {
  it("imports the generator + ZIP triggers", () => {
    expect(PAGE_SRC).toMatch(
      /from\s+"@\/lib\/apiSnippets"/,
    );
    expect(PAGE_SRC).toContain("SNIPPET_LANGUAGES");
    expect(PAGE_SRC).toContain("buildSnippet");
    expect(PAGE_SRC).toContain("buildSnippetBundle");
    expect(PAGE_SRC).toContain("triggerSnippetBundleDownload");
    expect(PAGE_SRC).toContain("triggerSnippetTextDownload");
  });

  it("renders the API snippets section with stable testids", () => {
    expect(PAGE_SRC).toContain('data-testid="api-snippets-section"');
    expect(PAGE_SRC).toContain(
      'data-testid="api-snippets-language-tabs"',
    );
    expect(PAGE_SRC).toContain(
      'data-testid="api-snippets-bundle-download-btn"',
    );
  });

  it("wires the header ZIP button to handleDownloadBundle", () => {
    expect(PAGE_SRC).toMatch(
      /onClick=\{handleDownloadBundle\}/,
    );
    expect(PAGE_SRC).toContain("buildingBundle");
    expect(PAGE_SRC).toContain("Packaging snippets…");
  });

  it("exposes a copy and download testid pattern per snippet card", () => {
    expect(PAGE_SRC).toContain(
      "data-testid={`api-snippet-${resource.slug}",
    );
    expect(PAGE_SRC).toContain(
      "data-testid={`api-snippet-copy-${resource.slug}",
    );
    expect(PAGE_SRC).toContain(
      "data-testid={`api-snippet-download-${resource.slug}",
    );
  });

  it("renders one language tab per registered language", () => {
    for (const lang of SNIPPET_LANGUAGES) {
      expect(PAGE_SRC).toContain(
        `data-testid={\`api-snippets-lang-\${lang.id}\`}`,
      );
      // Generic template-literal source pin: the per-id render path
      // is hit via SNIPPET_LANGUAGES.map(...).
      void lang;
    }
  });
});

describe("§162 snippets — browser-glue host", () => {
  type FakeAnchor = {
    href: string;
    download: string;
    click: () => void;
    _clicked: number;
  };
  type FakeHost = {
    createElement: (tag: "a") => FakeAnchor;
    body: { appendChild: (node: unknown) => void };
    _appended: number;
    _anchors: FakeAnchor[];
  };
  function makeHost(): FakeHost {
    const host: FakeHost = {
      _appended: 0,
      _anchors: [],
      createElement(_tag) {
        const anchor: FakeAnchor = {
          href: "",
          download: "",
          _clicked: 0,
          click() {
            this._clicked += 1;
          },
        };
        host._anchors.push(anchor);
        return anchor;
      },
      body: {
        appendChild(_node) {
          host._appended += 1;
        },
      },
    };
    // Polyfill URL.createObjectURL / revokeObjectURL for Node.
    const g = globalThis as unknown as {
      URL: typeof URL & {
        createObjectURL?: (b: Blob) => string;
        revokeObjectURL?: (u: string) => void;
      };
    };
    if (!g.URL.createObjectURL) {
      g.URL.createObjectURL = () => "blob:fake";
    }
    if (!g.URL.revokeObjectURL) {
      g.URL.revokeObjectURL = () => undefined;
    }
    return host;
  }

  it("triggerSnippetTextDownload appends an anchor and clicks it", () => {
    const host = makeHost();
    const result = triggerSnippetTextDownload({
      filename: "branches/GET-branches.sh",
      contents: "curl -X GET ...\n",
      mimeType: "text/x-shellscript",
      host: host as unknown as Parameters<
        typeof triggerSnippetTextDownload
      >[0]["host"],
    });
    expect(host._appended).toBe(1);
    expect(host._anchors.length).toBe(1);
    expect(host._anchors[0]?.download).toBe(
      "branches/GET-branches.sh",
    );
    expect(host._anchors[0]?._clicked).toBe(1);
    expect(result.mimeType).toBe("text/x-shellscript");
    expect(result.size).toBeGreaterThan(0);
  });

  it("triggerSnippetBundleDownload appends an anchor for the ZIP", () => {
    const host = makeHost();
    const bytes = buildSnippetBundle({ date: new Date("2026-05-23") });
    const filename = buildSnippetBundleFilename(new Date("2026-05-23"));
    const result = triggerSnippetBundleDownload({
      bytes,
      filename,
      host: host as unknown as Parameters<
        typeof triggerSnippetBundleDownload
      >[0]["host"],
    });
    expect(host._appended).toBe(1);
    expect(host._anchors[0]?.download).toBe(filename);
    expect(host._anchors[0]?._clicked).toBe(1);
    expect(result.mimeType).toBe("application/zip");
    expect(result.size).toBe(bytes.length);
  });
});

describe("§162 snippets — source-of-truth invariants", () => {
  it("apiSnippets.ts never hard-codes the production host literal outside the import", () => {
    // The literal should appear via API_HOST_PRODUCTION, not pasted in
    // by hand. We allow exactly zero occurrences of either the current
    // host literal ('https://clients.rapidhiresolutions.com/api2') or
    // the legacy upstream-vendor host inside apiSnippets.ts itself.
    // (API_HOST_PRODUCTION lives in apiReference.ts; this file only
    // imports it.)
    expect(SNIPPETS_SRC).not.toContain(
      "https://clients.rapidhiresolutions.com/api2",
    );
    expect(SNIPPETS_SRC).not.toContain(
      "https://dot.precisehire.com/api2",
    );
  });

  it("never leaves a {placeholder} inside the request URL", () => {
    // The body of a snippet may legitimately use ${...} as JS / shell
    // template syntax (Buffer.from(`${user}:${pass}`)). What must never
    // happen is an unsubstituted path placeholder leaking into the URL
    // that the snippet calls. We scan the host substring only.
    const hostRe = new RegExp(
      `${API_HOST_PRODUCTION.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\S*`,
      "g",
    );
    for (const m of buildSnippetManifest()) {
      const urls = m.contents.match(hostRe) ?? [];
      expect(urls.length).toBeGreaterThan(0);
      for (const url of urls) {
        expect(url).not.toMatch(/[{}]/);
      }
    }
  });
});

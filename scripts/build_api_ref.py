"""
§160 — Build the apiReference.ts data model from the scraped JSON.

We keep the raw Markdown verbatim per resource so the in-page reference
and the PDF generator can both render the same content. The endpoints
list is parsed into structured records so we can render a tidy table.
"""
from __future__ import annotations

import json
import re
import textwrap
from pathlib import Path

# When this script lives in scripts/, the repo root is the parent dir,
# and the scrape JSON sits at /home/ubuntu (one level above the repo).
ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
SCRAPE_CANDIDATES = [
    REPO / "scrape_precisehire_docs.json",
    Path("/home/ubuntu/scrape_precisehire_docs.json"),
]
SCRAPE = next((p for p in SCRAPE_CANDIDATES if p.exists()), SCRAPE_CANDIDATES[0])
OUT = REPO / "client" / "src" / "lib" / "apiReference.ts"

VERB_RE = re.compile(r"^\s*(GET|POST|PUT|PATCH|DELETE)\s+(.+?)\s*$", re.MULTILINE)


def parse_endpoints(raw: str) -> list[dict]:
    out: list[dict] = []
    for line in raw.splitlines():
        m = VERB_RE.match(line)
        if not m:
            continue
        # Normalize whitespace inside the path so e.g. "/packages/ {id}"
        # becomes "/packages/{id}" and "/counties/{state abbreviation}"
        # becomes "/counties/{stateAbbreviation}" (camelCase the param).
        path = re.sub(r"\s+", "", m.group(2).strip())
        out.append({"verb": m.group(1), "path": path})
    # De-duplicate while preserving order.
    seen = set()
    deduped = []
    for ep in out:
        key = (ep["verb"], ep["path"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(ep)
    return deduped


def ts_literal(s: str) -> str:
    """Escape a Python string into a TS string literal using backticks where safe."""
    # Template literals are ideal because the scraped Markdown is multi-line.
    # We only need to escape backticks and ${ sequences.
    s = s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return f"`{s}`"


def main() -> None:
    data = json.loads(SCRAPE.read_text())
    resources = []
    for r in data["results"]:
        o = r["output"]
        resources.append({
            "slug": o["resource_slug"],
            "name": o["resource_name"],
            "shortDescription": o["short_description"],
            "endpoints": parse_endpoints(o["endpoints_list"]),
            "markdown": o["full_markdown"],
        })

    # Stable order matches the left-rail nav on the source docs.
    desired = [
        "branches",
        "clients",
        "counties",
        "healthscreenings",
        "invitations",
        "orders",
        "packages",
        "products",
        "researchers",
    ]
    resources.sort(key=lambda r: desired.index(r["slug"]))

    header = textwrap.dedent(
        """
        /*
          §160 — Rapid Hire Solutions API v2 reference data model.

          This module is the single source of truth that powers both the
          /integrations in-page API reference section and the downloadable
          API documentation PDF (see @/lib/apiDocsPdf). The data is
          derived from the canonical reference at
          https://dot.precisehire.com/docs/home.php?overview — re-running
          scripts/build_api_ref.py regenerates this file from a fresh
          scrape.

          IMPORTANT: edit scripts/build_api_ref.py and the scraped JSON,
          not this file directly — a manual edit will be overwritten the
          next time the reference is regenerated.
        */

        export type ApiEndpoint = {
          verb: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
          path: string;
        };

        export type ApiResource = {
          /** lowercase URL-friendly id, e.g. "healthscreenings" */
          slug: string;
          /** human-readable name, e.g. "Health Screenings" */
          name: string;
          /** one-sentence summary used on the index card */
          shortDescription: string;
          /** structured list of verb + path pairs */
          endpoints: ApiEndpoint[];
          /** verbatim Markdown documentation for this resource */
          markdown: string;
        };

        export const API_HOST_PRODUCTION =
          "https://dot.precisehire.com/api2";
        export const API_HOST_STAGING =
          "https://dot.precisehire.com/staging/api2";

        export const API_OVERVIEW = {
          version: "v2",
          name: "Rapid Hire Solutions API",
          summary:
            "Version 2 of the Rapid Hire Solutions API is fully REST compliant. It was built around modern programming practices so the learning curve stays short.",
          transport:
            "All API requests must be made over HTTPS. Plain HTTP is not supported.",
          authentication:
            "HTTP Basic authentication. Use your Rapid Hire Solutions login credentials as the username/password pair on every request.",
          sampleCurl:
            "curl -X GET --user user:password https://dot.precisehire.com/api2/packages",
        } as const;
        """
    ).strip() + "\n\n"

    body = ["export const API_RESOURCES: ApiResource[] = ["]
    for r in resources:
        body.append("  {")
        body.append(f"    slug: {json.dumps(r['slug'])},")
        body.append(f"    name: {json.dumps(r['name'])},")
        body.append(f"    shortDescription: {json.dumps(r['shortDescription'])},")
        body.append("    endpoints: [")
        for e in r["endpoints"]:
            body.append(
                f"      {{ verb: {json.dumps(e['verb'])}, path: {json.dumps(e['path'])} }},"
            )
        body.append("    ],")
        body.append(f"    markdown: {ts_literal(r['markdown'])},")
        body.append("  },")
    body.append("];\n")

    footer = textwrap.dedent(
        """
        /**
         * Convenience helper — total endpoint count across all resources.
         * Used by the /integrations hero stat band and by the PDF cover.
         */
        export const API_ENDPOINT_TOTAL: number = API_RESOURCES.reduce(
          (n, r) => n + r.endpoints.length,
          0,
        );
        """
    ).strip() + "\n"

    OUT.write_text(header + "\n".join(body) + "\n" + footer)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
    print(f"Resources: {len(resources)}")
    print(f"Endpoints: {sum(len(r['endpoints']) for r in resources)}")


if __name__ == "__main__":
    main()

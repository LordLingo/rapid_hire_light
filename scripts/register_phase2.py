"""Register §90 Phase 2 posts into blog-meta.json + blog-og.json."""
import json, re, sys, os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

new_slugs = [
    # Sanctions cluster
    "state-medicaid-exclusion-lists-by-state",
    "sam-gov-exclusion-check-workflow",
    "oig-leie-monthly-update-process",
    "healthcare-contractor-sanctions-screening",
    "sanctions-screening-frequency-best-practices",
    # Illinois cluster
    "illinois-bipa-background-checks",
    "illinois-salary-history-ban-employer-guide",
    "chicago-fair-chance-ordinance-employer-guide",
    "illinois-human-rights-act-conviction-record",
    "illinois-pay-data-reporting-eprc",
    # New York cluster
    "nyc-article-23a-multi-factor-analysis",
    "ny-shield-act-cra-data-security",
    "nyc-local-law-144-aedt-bias-audit",
    "westchester-county-fair-chance-act",
    "new-york-clean-slate-act-employer-guide",
    # ADA cluster
    "ada-direct-threat-defense",
    "ada-interactive-accommodation-process",
    "ada-return-to-work-fitness-for-duty",
    "ada-drug-testing-current-vs-past-use",
    "ada-mental-health-screening-employer-guide",
    # ICRAA cluster
    "icraa-investigative-consumer-report-definition",
    "icraa-penalty-exposure-class-action",
    "icraa-seven-year-reporting-cap",
    "icraa-1786-40-public-record-notice",
    "icraa-vs-ccraa-distinction",
]

def parse(slug):
    src = open(f"client/src/content/blog/{slug}.ts").read()
    title = re.search(r'title:\s*"([^"]+)"', src).group(1)
    mt = re.search(r'metaTitle:\s*"([^"]+)"', src)
    metaTitle = mt.group(1) if mt else title
    md = re.search(r'metaDescription:\s*\n?\s*"([^"]+)"', src).group(1)
    tags_str = re.search(r'tags:\s*\[([^\]]+)\]', src).group(1)
    tags = re.findall(r'"([^"]+)"', tags_str)
    pub = re.search(r'publishedAt:\s*"([^"]+)"', src).group(1)
    return {"slug": slug, "title": title, "metaTitle": metaTitle, "metaDescription": md, "tags": tags, "publishedAt": pub}

posts = [parse(s) for s in new_slugs]

# blog-meta.json
with open("shared/blog-meta.json") as f:
    meta = json.load(f)

existing = {p["slug"] for p in meta["posts"]}
for p in posts:
    if p["slug"] in existing:
        continue
    meta["posts"].append({"slug": p["slug"], "lastmod": p["publishedAt"]})

all_tags = set(meta.get("tags", []))
for p in posts:
    for t in p["tags"]:
        all_tags.add(t)
meta["tags"] = sorted(all_tags)

with open("shared/blog-meta.json", "w") as f:
    json.dump(meta, f, indent=2)
    f.write("\n")

# blog-og.json
with open("shared/blog-og.json") as f:
    og = json.load(f)

existing_og = {e["slug"] for e in og["posts"]}
for p in posts:
    if p["slug"] in existing_og:
        continue
    og["posts"].append({
        "slug": p["slug"],
        "title": p["title"],
        "tag": p["tags"][0] if p["tags"] else "compliance",
    })

with open("shared/blog-og.json", "w") as f:
    json.dump(og, f, indent=2)
    f.write("\n")

print(f"blog-meta.json: {len(meta['posts'])} posts, {len(meta['tags'])} tags")
print(f"blog-og.json: {len(og['posts'])} entries")

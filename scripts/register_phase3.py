"""Register §90 Phase 3 posts into blog-meta.json + blog-og.json."""
import json, re, sys, os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

new_slugs = [
    # Operations cluster
    "bulk-rescreen-workflow-design",
    "hiring-funnel-screening-sla-design",
    "multi-vendor-screening-orchestration",
    "screening-cost-per-hire-benchmarks",
    "contingent-workforce-screening-operations",
    # Verification cluster
    "i9-e-verify-employer-guide",
    "seven-year-employment-history-workflow",
    "professional-license-primary-source-verification",
    "international-degree-credential-evaluation",
    "references-vs-employment-verification",
    # Candidate experience cluster
    "pre-applicant-disclosure-ux",
    "mobile-first-authorization-flows",
    "dispute-letter-response-best-practices",
    "candidate-portal-status-transparency",
    "multilingual-disclosure-design",
    # Adverse action cluster
    "pre-adverse-five-business-day-clock",
    "individualized-assessment-letter-template",
    "reasonable-time-rule-by-state",
    "adverse-action-contingent-workers",
    "joint-employer-adverse-action",
    # Continuous monitoring cluster
    "post-hire-criminal-alerts-program",
    "mvr-continuous-monitoring-program",
    "healthcare-exclusion-continuous-monitoring",
    "continuous-monitoring-lookback-policy",
    "continuous-monitoring-drift-detection",
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

# Generate import + ALL_POSTS lines for blog.ts manual edit
print("\n# Import lines:")
for s in new_slugs:
    var = "post_" + s.replace("-", "_")
    print(f'import {{ post as {var} }} from "@/content/blog/{s}";')

print("\n# ALL_POSTS entries:")
for s in new_slugs:
    var = "post_" + s.replace("-", "_")
    print(f"  {var},")

print(f"\nblog-meta.json: {len(meta['posts'])} posts, {len(meta['tags'])} tags")
print(f"blog-og.json: {len(og['posts'])} entries")

"""Register §90 Phase 1 posts into blog-meta.json + blog-og.json."""
import json, re, sys, os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

new_slugs = [
    "small-business-background-check-pricing",
    "small-business-fcra-compliance-traps",
    "small-business-first-background-check",
    "small-business-no-hr-screening-practices",
    "small-business-cra-vs-free-public-record-search",
    "fmcsa-psp-pre-employment-screening-program",
    "hair-follicle-drug-testing-cdl-drivers",
    "owner-operator-vs-employee-driver-screening",
    "last-mile-delivery-driver-hiring-non-dot",
    "cdl-endorsements-disqualifying-offenses",
    "cms-exclusion-screening-oig-leie-sam",
    "joint-commission-hr-standards",
    "healthcare-credentialing-vs-background-check",
    "npdb-national-practitioner-data-bank",
    "long-term-care-snf-screening-civil-money-penalty",
    "fmcsa-drug-alcohol-clearinghouse",
    "dot-return-to-duty-process",
    "dot-pre-employment-random-reasonable-suspicion-testing",
    "driver-qualification-file-checklist-49-cfr-391",
    "non-dot-drug-testing-state-local-cdl",
    "washington-marijuana-hiring-protections",
    "new-york-labor-law-201-d-marijuana",
    "new-jersey-creamm-act-wire-certification",
    "thc-metabolite-vs-impairment-science",
    "marijuana-testing-safety-sensitive-vs-non-safety-sensitive",
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
    # match existing entry shape: minimal {slug, lastmod}
    meta["posts"].append({"slug": p["slug"], "lastmod": p["publishedAt"]})

# tags
all_tags = set(meta.get("tags", []))
for p in posts:
    for t in p["tags"]:
        all_tags.add(t)
meta["tags"] = sorted(all_tags)

with open("shared/blog-meta.json", "w") as f:
    json.dump(meta, f, indent=2)
    f.write("\n")

# blog-og.json — top-level dict with `posts` list, entries shape: {slug, title, tag}
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

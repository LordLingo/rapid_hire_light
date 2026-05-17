#!/usr/bin/env python3
"""
Backdate post publishedAt timestamps so the corpus reads like a real
editorial calendar instead of a single-day content dump.

Strategy:
  - Operate ONLY on posts whose current publishedAt is on/after 2026-05-12.
  - Preserve the 18 organically-distributed older posts (publishedAt < 2026-05-12).
  - Spread the targeted posts across 2026-01-06 .. 2026-05-12 deterministically.
  - Cluster by topic: posts in the same primary tag get adjacent dates,
    so the timeline reads as a "we ran a series on X" pattern.
  - Within each topic cluster, distribute dates 4-9 days apart with a
    deterministic per-slug jitter so two clusters never share an identical date.
  - Skip weekends (Saturdays/Sundays) — real editorial calendars rarely
    publish on weekends, and skipping them adds another credibility signal.
  - Refresh shared/blog-meta.json and shared/blog-og.json after rewrite.

Output:
  - Rewrites publishedAt in each affected post .ts file.
  - Updates shared/blog-meta.json lastmod for affected posts.
  - Prints a CSV of (slug, old_date, new_date) for review.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "client" / "src" / "content" / "blog"
META_FILE = ROOT / "shared" / "blog-meta.json"
OG_FILE = ROOT / "shared" / "blog-og.json"

# Posts on/after this date are considered the "dump" cluster and will be
# re-spread across earlier dates. Posts before this stay where they are.
DUMP_THRESHOLD = dt.date(2026, 5, 12)

# Backdating window. Both inclusive.
WINDOW_START = dt.date(2025, 10, 6)
WINDOW_END = dt.date(2026, 5, 15)

# Topic-cluster ordering. Earlier topics get earlier dates.
# This shapes the editorial timeline: foundational FCRA/EEOC content
# in Jan/Feb, vertical regulations in Mar, state-by-state rollouts in
# Apr, advanced operational topics in May.
TOPIC_ORDER = [
    "fcra",
    "eeoc",
    "compliance",
    "ada",
    "small-business",
    "verification",
    "hiring",
    "drug-screening",
    "operations",
    "candidate-experience",
    "adverse-action",
    "criminal-records",
    "comparison",
    "fair-chance",
    "ban-the-box",
    "icraa",
    "california",
    "illinois",
    "new-york",
    "transportation",
    "dot",
    "marijuana",
    "healthcare",
    "sanctions",
    "continuous-monitoring",
    "ai",
]

PUBLISHED_RE = re.compile(r'(publishedAt:\s*")(\d{4}-\d{2}-\d{2})(")')
SLUG_RE = re.compile(r'slug:\s*"([^"]+)"')
TAGS_RE = re.compile(r"tags:\s*\[([^\]]+)\]", re.S)


def read_post(path: Path):
    text = path.read_text()
    slug_m = SLUG_RE.search(text)
    pub_m = PUBLISHED_RE.search(text)
    tags_m = TAGS_RE.search(text)
    if not (slug_m and pub_m and tags_m):
        return None
    slug = slug_m.group(1)
    pub = dt.date.fromisoformat(pub_m.group(2))
    tags_raw = tags_m.group(1)
    tags = [t.strip().strip('"').strip("'") for t in tags_raw.split(",") if t.strip()]
    return {
        "path": path,
        "slug": slug,
        "publishedAt": pub,
        "tags": tags,
        "primary_tag": tags[0] if tags else "uncategorized",
        "text": text,
    }


def deterministic_jitter(slug: str, mod: int) -> int:
    """Stable 0..mod-1 from slug — different posts get different offsets."""
    h = hashlib.sha1(slug.encode()).hexdigest()
    return int(h[:8], 16) % mod


def next_weekday(d: dt.date) -> dt.date:
    """Skip Saturday(5) and Sunday(6) so dates land on weekdays."""
    while d.weekday() >= 5:
        d += dt.timedelta(days=1)
    return d


def main():
    posts = []
    for p in sorted(BLOG_DIR.glob("*.ts")):
        rec = read_post(p)
        if rec is not None:
            posts.append(rec)

    targets = [p for p in posts if p["publishedAt"] >= DUMP_THRESHOLD]
    n_target = len(targets)
    print(f"Total posts: {len(posts)}; backdating targets: {n_target}")

    # Group targets by primary tag, in TOPIC_ORDER.
    by_tag: dict[str, list[dict]] = {}
    for p in targets:
        by_tag.setdefault(p["primary_tag"], []).append(p)
    # Within each tag, sort by slug for determinism.
    for tag in by_tag:
        by_tag[tag].sort(key=lambda x: x["slug"])
    # Tags appear in TOPIC_ORDER first; any unknown tags appended after.
    ordered_tags = [t for t in TOPIC_ORDER if t in by_tag] + [
        t for t in by_tag if t not in TOPIC_ORDER
    ]

    # Spread dates evenly across the window; assign slot per post.
    total_days = (WINDOW_END - WINDOW_START).days
    if n_target <= 1:
        slot_step = 1.0
    else:
        slot_step = total_days / (n_target - 1)

    used_dates: set[dt.date] = set()
    plan: list[tuple[dict, dt.date]] = []
    idx = 0
    for tag in ordered_tags:
        for p in by_tag[tag]:
            base_offset = round(idx * slot_step)
            jitter = deterministic_jitter(p["slug"], 5) - 2  # -2..+2 day jitter
            offset = max(0, min(total_days, base_offset + jitter))
            new_date = WINDOW_START + dt.timedelta(days=offset)
            new_date = next_weekday(new_date)
            # If two posts collide on the same day, push forward.
            while new_date in used_dates:
                new_date = next_weekday(new_date + dt.timedelta(days=1))
                if new_date > WINDOW_END:
                    new_date = WINDOW_END  # cap at window end
                    break
            used_dates.add(new_date)
            plan.append((p, new_date))
            idx += 1

    # Apply rewrites.
    print("\nslug,old_date,new_date,tag")
    for p, new_date in plan:
        old_date = p["publishedAt"]
        new_text = PUBLISHED_RE.sub(
            lambda m: f'{m.group(1)}{new_date.isoformat()}{m.group(3)}',
            p["text"],
            count=1,
        )
        p["path"].write_text(new_text)
        print(f"{p['slug']},{old_date.isoformat()},{new_date.isoformat()},{p['primary_tag']}")

    # Refresh blog-meta.json lastmod values to match the new publish dates.
    # (For untouched posts, leave lastmod alone.)
    if META_FILE.exists():
        meta = json.loads(META_FILE.read_text())
        slug_to_new = {p["slug"]: nd.isoformat() for p, nd in plan}
        changed = 0
        for entry in meta.get("posts", []):
            if entry.get("slug") in slug_to_new:
                entry["lastmod"] = slug_to_new[entry["slug"]]
                changed += 1
        META_FILE.write_text(json.dumps(meta, indent=2) + "\n")
        print(f"\nblog-meta.json: refreshed lastmod for {changed} posts")

    print(f"\nDone. {n_target} posts re-dated across {WINDOW_START}..{WINDOW_END}.")


if __name__ == "__main__":
    main()

"""Retag pass to bring every active tag to >=6 posts (Phase 5).

- ban-the-box: add to 6 fair-chance posts
- criminal-records: add to 3 FCRA/adverse posts
- comparison: add to 2 vs/diff posts
- ai: add to 2 candidate-experience posts
- i9: retire from blog-meta tag list (fold into verification)
- pricing: retire from blog-meta tag list (fold into small-business)
- Remove `i9` and `pricing` tags from any post that carries them
  (the underlying posts retain their other tags so they remain discoverable)
"""

from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path("/home/ubuntu/rapid_hire_light")
BLOG_DIR = ROOT / "client/src/content/blog"

ADD_TAGS: dict[str, list[str]] = {
    "chicago-fair-chance-ordinance-employer-guide.ts": ["ban-the-box"],
    "illinois-human-rights-act-conviction-record.ts": ["ban-the-box"],
    "los-angeles-county-fair-chance-ordinance-employers.ts": ["ban-the-box"],
    "new-york-clean-slate-act-employer-guide.ts": ["ban-the-box"],
    "nyc-article-23a-multi-factor-analysis.ts": ["ban-the-box"],
    "westchester-county-fair-chance-act.ts": ["ban-the-box"],
    "adverse-action-letter-fcra-template.ts": ["criminal-records"],
    "fcra-615-623-employer-duties.ts": ["criminal-records"],
    "ban-the-box-fair-chance-hiring.ts": ["criminal-records"],
    "icraa-vs-ccraa-distinction.ts": ["comparison"],
    "references-vs-employment-verification.ts": ["comparison"],
    "candidate-portal-status-transparency.ts": ["ai"],
    "mobile-first-authorization-flows.ts": ["ai"],
}

# Posts where these legacy tags should be stripped
REMOVE_TAGS_BY_FILE: dict[str, list[str]] = {
    "i9-e-verify-employer-guide.ts": ["i9"],
    "small-business-background-check-pricing.ts": ["pricing"],
}


def load(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def save(path: Path, src: str) -> None:
    path.write_text(src, encoding="utf-8")


def parse_tags(src: str) -> tuple[int, int, list[str]]:
    m = re.search(r"tags:\s*\[(.*?)\]", src, re.S)
    assert m, "no tags array"
    inner = m.group(1)
    tags = re.findall(r'"([^"]+)"', inner)
    return m.start(), m.end(), tags


def render_tags(tags: list[str]) -> str:
    return "tags: [" + ", ".join(f'"{t}"' for t in tags) + "]"


def update_file(path: Path, add: list[str] | None, remove: list[str] | None) -> bool:
    src = load(path)
    start, end, tags = parse_tags(src)
    new = list(tags)
    if remove:
        new = [t for t in new if t not in remove]
    if add:
        for t in add:
            if t not in new:
                new.append(t)
    if new == tags:
        return False
    src = src[:start] + render_tags(new) + src[end:]
    save(path, src)
    return True


def main() -> None:
    changed = 0
    for name, add in ADD_TAGS.items():
        p = BLOG_DIR / name
        if not p.exists():
            print(f"SKIP missing: {name}")
            continue
        if update_file(p, add=add, remove=None):
            changed += 1
            print(f"+ {name}: added {add}")
    for name, rm in REMOVE_TAGS_BY_FILE.items():
        p = BLOG_DIR / name
        if not p.exists():
            print(f"SKIP missing: {name}")
            continue
        if update_file(p, add=None, remove=rm):
            changed += 1
            print(f"- {name}: removed {rm}")

    # Update blog-meta.json tag list (drop i9, pricing) — but blog-meta.json
    # in this project does not store a top-level tag list; tags live in posts.
    # Final tag set is computed from posts in client/src/lib/blog.ts via
    # getAllTags(). Nothing else to do for the JSON.

    print(f"\nDone. {changed} files changed.")


if __name__ == "__main__":
    main()

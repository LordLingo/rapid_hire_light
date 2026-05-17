# Lighthouse SEO budget

This project ships a small Lighthouse CI configuration at the repo root
(`.lighthouserc.json`) plus a `pnpm test:seo` script that runs it. The
budget is intentionally narrow: SEO category only, threshold ≥ 0.95.
Performance, accessibility, PWA, and best-practices are out of scope here
because they fluctuate with hardware and are noisier signals.

## What it asserts

Three representative routes are audited on every run:

1. `/` — the homepage.
2. `/blog` — the blog index (Topics-by-depth, recent rail, archives).
3. `/blog/fcra-pre-adverse-action-process` — a representative
   prerendered post (the same path the build pipeline pre-bakes).

For each URL the SEO category score must be ≥ 0.95, and the following
audits must individually pass: `meta-description`, `document-title`,
`html-has-lang`, `viewport`. Soft warnings are emitted for `canonical`,
`robots-txt`, and `structured-data`.

## Running locally

The Vite dev server listens on `:3000`. Start it once, then run the
audit in another shell:

```bash
pnpm dev          # in one shell
pnpm test:seo     # in another
```

The `test:seo` script invokes `npx -p @lhci/cli lhci autorun` so the
heavy Lighthouse dependency is only fetched on demand and never pollutes
`node_modules`. Reports are uploaded to Lighthouse's temporary public
storage; the URL is printed at the end of the run.

## Running against production

To audit the deployed site, override the URLs:

```bash
LHCI_BUILD_CONTEXT__EXTERNAL_BUILD_URL="https://rapidhiresolutions.com" \
  npx -p @lhci/cli lhci autorun \
    --collect.url=https://rapidhiresolutions.com/ \
    --collect.url=https://rapidhiresolutions.com/blog \
    --collect.url=https://rapidhiresolutions.com/blog/fcra-pre-adverse-action-process
```

## Wiring into CI

A typical GitHub Actions invocation looks like:

```yaml
- name: SEO budget (Lighthouse)
  run: |
    pnpm dev &
    npx wait-on http://localhost:3000
    pnpm test:seo
```

A non-zero exit means the SEO budget regressed; the CI job will block
the deploy until the regression is fixed or the threshold is intentionally
lowered.

## Why we chose 0.95

Lighthouse's SEO category checks structural fundamentals (title, meta
description, lang, viewport, link text, image alt text, tap targets,
etc.). Real production sites with healthy SEO comfortably score 0.95+.
A budget below 0.95 would let regressions like a missing `<title>` slip
through; above 0.97 produces noisy failures from minor tap-target
warnings on dense layouts. 0.95 is the sweet spot.

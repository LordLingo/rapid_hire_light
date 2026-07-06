# Rapid Hire Site Project Context

This file is the starting source of truth for work done inside the Rapid Hire Site project. Update it over time as the project changes.

## Source of truth

- Correct GitHub repository: `LordLingo/rapid_hire_light`
- Repository URL: `https://github.com/LordLingo/rapid_hire_light.git`
- Production domain: `https://www.rapidhiresolutions.com/`
- Brand name: `Rapid Hire Solutions`
- Primary website/application: Rapid Hire Solutions marketing site, blog, SEO/GEO buyer pages, lead forms, and candidate/support pages.

## Repositories to avoid for this project

Do not use `LordLingo/precisehire1` for Rapid Hire Solutions work unless the user explicitly says the task is about the old Precise Hire repo.

That repo may contain older Precise Hire / precisehire.com code, metadata, and sitemap files. It is not the source of truth for RapidHireSolutions.com.

## Safe workflow for changes

1. Work from `LordLingo/rapid_hire_light` only.
2. Create a new branch before editing anything.
3. Keep changes narrow and reviewable.
4. Open a pull request instead of merging directly unless the user explicitly asks for a direct commit/merge.
5. Do not change form behavior, routing, backend logic, deployment config, or database/persistence unless the user explicitly asks.
6. For SEO/GEO work, prefer metadata/content/crawler files first.
7. After code or content changes, run or request these checks when available:
   - `pnpm check`
   - `pnpm test`
   - `pnpm build`
   - `pnpm seo:audit`

## Known project structure

- `client/index.html` contains the homepage HTML shell, homepage SEO metadata, OG/Twitter metadata, sitemap hints, and pre-hydration SEO content.
- `scripts/prerender_top_posts.mjs` prerenders selected blog/tag/year pages and uses `SITE_BASE_URL` with a default Rapid Hire domain.
- `server/index.ts` contains the Express server, contact/candidate form handling, blog feed/OG helpers, and static route behavior.
- `shared/blog-meta.json` and `shared/blog-og.json` support blog metadata and OG generation.
- `package.json` identifies the project as `rapid_hire_light` and includes build, test, and SEO scripts.

## SEO/GEO rules

When working on SEO or GEO optimization:

- Use Rapid Hire Solutions as the brand.
- Use `https://www.rapidhiresolutions.com/` as the canonical public origin unless the code intentionally uses a no-www redirect strategy.
- Keep AI/buyer pages crawlable.
- Keep canonical URLs, Open Graph URLs, sitemap URLs, and `llms.txt` aligned to the Rapid Hire domain.
- Avoid copying old Precise Hire / precisehire.com metadata into this repo.
- Use buyer-intent language around background screening, staffing, healthcare, transportation, ATS integrations, pricing, compliance, and switching providers.

## Current safety note

Before changing any file, confirm the path is in `LordLingo/rapid_hire_light`. If a search or memory points to `LordLingo/precisehire1`, stop and verify with the user or this file.
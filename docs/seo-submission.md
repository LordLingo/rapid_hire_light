# SEO submission workflow

After a production deploy that adds, removes, or significantly updates blog
posts, run the sitemap-submission script so search engines pick up the
changes within minutes rather than days.

## Once-per-environment setup

1. **IndexNow key**. The repository ships with a deterministic key at
   `client/public/indexnow.txt` (also served at `/indexnow.txt` on the deployed
   site). The same value is what `scripts/submit-sitemap.mjs` POSTs to
   `https://api.indexnow.org/IndexNow`. If you ever need to rotate the key,
   regenerate it (any 8–128 hex chars), update both the file *and* the
   `INDEXNOW_KEY` env override, and redeploy before submitting.

2. **Google Search Console**. One-time: add the production host as a property
   and submit `https://www.rapidhiresolutions.com/sitemap.xml` once. After
   that, Google re-fetches the sitemap on its own cadence; a Search Console
   resubmission is only useful as a manual nudge after major changes.

3. **Bing Webmaster Tools**. One-time: add the host and submit the same
   sitemap URL. From then on, IndexNow handles refreshes.

## After every deploy

```bash
pnpm seo:submit
# or, against a non-prod host:
SITE_BASE_URL=https://staging.rapidhiresolutions.com \
  pnpm seo:submit
# preview without making any network calls:
pnpm seo:submit:dry
```

The `postdeploy` script runs the same submitter; CI providers that
trigger `npm run postdeploy` (GitHub Actions deploy step, Render's
`postDeploy` command, Railway's `release` phase, etc.) will fire IndexNow
automatically with no extra config beyond the Manus-managed env.

The script:

- Reads `shared/blog-meta.json` for the canonical post + tag slug list,
- POSTs the full URL list (index + every post + every tag landing page) to
  IndexNow, which fans out to Bing, Yandex, and Naver,
- Prints the Search Console + Bing Webmaster URLs to confirm visually.

It exits non-zero if IndexNow returns a non-2xx response, so you can wire it
into a CI step after deploys.

## Why no automatic Google ping

Google deprecated the unauthenticated `/ping?sitemap=...` endpoint in June
2023. Search Console is now the only supported manual-resubmission path, and
that flow requires authenticated UI access — not something a deploy script
should attempt. The script therefore prints the Search Console URL and lets
the operator finish in one click.

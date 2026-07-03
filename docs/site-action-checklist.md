# Rapid Hire Solutions Site Action Checklist

Last updated: 2026-07-03

Use this file as the working checklist for SEO, GEO / AI-search, conversion, and site expansion tasks. Check items off as they are completed and add notes under each section as needed.

## Recently completed

- [x] Add AI-search facts page at `/ai-search-facts`
- [x] Add buyer-intent page at `/best-background-check-provider`
- [x] Add background check company alternative page at `/background-check-company-alternative`
- [x] Add staffing buyer page at `/background-checks-for-staffing-companies`
- [x] Add small business buyer page at `/background-checks-for-small-business`
- [x] Add citation/source page at `/background-check-provider-citations`
- [x] Add `llms.txt`
- [x] Add homepage AI/buyer research link block
- [x] Add switch-providers page at `/switch-background-check-providers`
- [x] Add buyer pages sitemap at `/ai-buyer-pages-sitemap.xml`
- [x] Cross-link buyer pages to the switch-providers page

## Immediate follow-up checks

- [ ] Confirm the latest production Vercel deployment completed successfully
- [ ] Open and manually review `/switch-background-check-providers` on production
- [ ] Open and manually review `/ai-buyer-pages-sitemap.xml` on production
- [ ] Open and manually review `/llms.txt` on production
- [ ] Submit or resubmit sitemap URLs in Google Search Console
- [ ] Submit or resubmit sitemap URLs in Bing Webmaster Tools
- [ ] Confirm the public site has no broken links in the new buyer-page cluster
- [ ] Confirm all new pages have correct canonical URLs and meta descriptions
- [ ] Confirm all new pages have a visible quote CTA above the fold or immediately after the answer-ready summary

## Internal linking work

- [ ] Add Buyer Guides links to the footer
- [ ] Add AI facts, citation page, and buyer guides to the Resources dropdown
- [ ] Link `/switch-background-check-providers` from `/pricing`
- [ ] Link `/switch-background-check-providers` from `/integrations`
- [ ] Link `/switch-background-check-providers` from `/trust`
- [ ] Link `/switch-background-check-providers` from `/sample-report`
- [ ] Link staffing buyer pages from `/industries/staffing`
- [ ] Link small-business buyer page from `/pricing`
- [ ] Add related buyer-guide links to service detail pages
- [ ] Add related service links to buyer-intent pages
- [ ] Add related compliance links to buyer-intent pages

## Sitemap and crawler work

- [ ] Add new buyer pages directly into the generated main sitemap in `vite.config.ts`
- [ ] Add `/ai-buyer-pages-sitemap.xml` reference into generated `robots.txt`
- [ ] Add `/switch-background-check-providers` to any static route audit list
- [ ] Confirm Vercel output includes `/sitemap.xml`, `/ai-buyer-pages-sitemap.xml`, `/blog/feed.xml`, `/blog/index.json`, and `/llms.txt`
- [ ] Add structured data review for all buyer pages
- [ ] Add FAQ schema where pages include clear Q&A sections

## High-priority money pages to add next

- [ ] `/alternatives/checkr-alternative`
- [ ] `/alternatives/hireright-alternative`
- [ ] `/alternatives/sterling-alternative`
- [ ] `/alternatives/first-advantage-alternative`
- [ ] `/alternatives/goodhire-alternative`
- [ ] `/background-check-packages`
- [ ] `/staffing-background-check-package`
- [ ] `/basic-background-check-package`
- [ ] `/standard-background-check-package`
- [ ] `/healthcare-background-check-package`
- [ ] `/driver-background-check-package`
- [ ] `/executive-background-check-package`
- [ ] `/background-check-cost-calculator`

## Staffing and recruiting page cluster

- [ ] `/background-checks-for-healthcare-staffing`
- [ ] `/background-checks-for-light-industrial-staffing`
- [ ] `/background-checks-for-temp-agencies`
- [ ] `/background-checks-for-recruiting-firms`
- [ ] `/background-checks-for-travel-nurse-staffing`
- [ ] Add staffing package comparison table
- [ ] Add staffing workflow diagram: invite, screen, status, placement
- [ ] Add staffing-specific quote form variant or hidden lead source field

## ATS and integration page cluster

- [ ] `/integrations/bullhorn-background-check-integration`
- [ ] `/integrations/avionte-background-check-integration`
- [ ] `/integrations/jobdiva-background-check-integration`
- [ ] `/integrations/icims-background-check-integration`
- [ ] `/integrations/greenhouse-background-check-integration`
- [ ] `/integrations/adp-background-check-integration`
- [ ] `/integrations/paylocity-background-check-integration`
- [ ] `/integrations/bamboohr-background-check-integration`
- [ ] Add integration detail-page template backed by shared integration data
- [ ] Add integration request CTA to every integration detail page

## Compliance action pages

- [ ] `/compliance/adverse-action`
- [ ] `/compliance/fcra-disclosure-authorization`
- [ ] `/compliance/background-check-consent-form`
- [ ] `/compliance/individualized-assessment`
- [ ] `/compliance/background-check-dispute-process`
- [ ] Add downloadable checklist or short form capture to compliance action pages
- [ ] Cross-link compliance pages from criminal records, staffing, and small business pages

## Candidate trust and support pages

- [ ] `/candidates/is-this-background-check-request-real`
- [ ] `/candidates/how-to-dispute-a-background-check`
- [ ] `/candidates/background-check-taking-too-long`
- [ ] `/candidates/what-shows-up-on-a-background-check`
- [ ] Link candidate trust pages from `/candidates`
- [ ] Link candidate trust pages from `/trust`
- [ ] Add candidate support links to any candidate-facing email or SMS templates if those templates live in this repo

## Local and Texas page cluster

- [ ] `/texas-background-checks-for-employers`
- [ ] `/dallas-background-check-company`
- [ ] `/dfw-background-checks-for-staffing-companies`
- [ ] `/prosper-tx-background-check-company`
- [ ] Link Texas page from `/resources/background-checks-by-state/texas`
- [ ] Link Dallas/DFW pages from `/contact`
- [ ] Add local business schema where appropriate

## Conversion and lead-generation improvements

- [ ] Add hidden source fields to quote forms for buyer-guide pages
- [ ] Track conversions from `/switch-background-check-providers`
- [ ] Track conversions from each future competitor-alternative page
- [ ] Add a "compare your current package" CTA variant
- [ ] Add a short package-comparison form for current-provider switchers
- [ ] Add thank-you page or confirmation state for buyer-guide form submissions
- [ ] Confirm HubSpot/Formspree tags separate quote, integration, compliance audit, and switch-provider leads

## Content quality and proof work

- [ ] Add anonymized customer proof blocks to switch-provider and staffing pages
- [ ] Add sample report screenshots or callouts where useful
- [ ] Add pricing explanation blocks to buyer pages
- [ ] Add "who this is for / who this is not for" sections to competitor-alternative pages
- [ ] Add "questions to ask your provider" section to switch-provider page
- [ ] Add source/citation sections to pages intended for AI search

## Technical checks

- [ ] Run local build before larger page clusters are merged
- [ ] Run TypeScript check before larger page clusters are merged
- [ ] Run link checker after each page-cluster PR
- [ ] Confirm no static file links are routed through Wouter when they should be plain anchor tags
- [ ] Confirm every new route renders inside `SiteShell`
- [ ] Confirm every new page uses `useSeo`
- [ ] Confirm every new page has a canonical URL
- [ ] Confirm every new page has a quote CTA

## Notes

- Prioritize staffing, switch-provider, ATS integration, and competitor-alternative pages first because they map closest to buyer intent.
- Keep competitor pages professional and comparison-based. Avoid negative or unsupported claims.
- Build page clusters in small PRs so Vercel issues are easier to isolate.
- After each merged PR, verify the Vercel production deployment and update this checklist.

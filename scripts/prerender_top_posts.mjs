#!/usr/bin/env node
/*
 * Build-time prerender for high-traffic blog routes.
 *
 * Strategy (head-only prerender):
 *   - Reads the SPA shell at dist/public/index.html.
 *   - Emits per-slug HTML stubs at dist/public/blog/<slug>/index.html for the
 *     top 20 posts (ranked by lastmod desc, then publishedAt desc).
 *   - Emits per-tag HTML stubs at dist/public/blog/tag/<tag>/index.html for
 *     the top 4 tags (ranked by post count, then alpha).
 *   - Emits per-year hub stubs at dist/public/blog/year/<yyyy>/index.html for
 *     every year with at least one post.
 *   - Each stub preserves the SPA shell, replaces <title> + meta description,
 *     and injects canonical + OG meta + JSON-LD just before </head>.
 *   - Body remains the SPA mount (#root); React still hydrates client-side.
 *   - Same HTML is served to humans and crawlers — no UA-based cloaking.
 *   - When PRERENDER_MINIFY is enabled (default in production), HTML is
 *     collapsed (no comment markers stripped — they're useful for diagnostics).
 *
 * Manifest is written to dist/public/_prerender-manifest.json so vitest can
 * verify the output without re-deriving the rank.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DIST = path.resolve(PROJECT_ROOT, "dist", "public");
const META_FILE = path.resolve(PROJECT_ROOT, "shared", "blog-meta.json");
const OG_FILE = path.resolve(PROJECT_ROOT, "shared", "blog-og.json");
const LANDING_PAGE_CONFIG_SOURCE = path.resolve(
  PROJECT_ROOT,
  "client",
  "src",
  "content",
  "employerScreeningLandingPages.ts",
);
const SHELL = path.join(DIST, "index.html");

const TOP_POSTS = 20;
const TOP_TAGS = 4;
const SITE_BASE = (process.env.SITE_BASE_URL || "https://www.rapidhiresolutions.com").replace(/\/+$/, "");
const POST_OG = (slug) => `${SITE_BASE}/api/og/blog/${slug}.svg`;
const TAG_OG = (tag) => `${SITE_BASE}/api/og/blog/tag/${tag}.svg`;
// Default OG for year hubs falls back to the brand card.
const SITE_OG = `${SITE_BASE}/og.svg`;
const SHOULD_MINIFY = process.env.PRERENDER_MINIFY !== "0";

const LANDING_PAGES = [
  {
    clientConst: "staffing",
    route: "/lp/staffing-background-checks",
    slug: "staffing-background-checks",
    title: "Background Checks for Staffing & Recruiting Firms",
    description:
      "Employer background screening for staffing and recruiting firms, with mobile candidate intake, role-based packages, workflow options, and U.S.-based support.",
    canonical:
      "https://www.rapidhiresolutions.com/lp/staffing-background-checks",
    ogImage: "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
  },
  {
    clientConst: "healthcare",
    route: "/lp/healthcare-employee-screening",
    slug: "healthcare-employee-screening",
    title: "Healthcare Employee Background Screening",
    description:
      "Role-specific employee screening for hospitals, clinics, home health, and care teams, including exclusions, license checks, verifications, and drug testing.",
    canonical:
      "https://www.rapidhiresolutions.com/lp/healthcare-employee-screening",
    ogImage: "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
  },
  {
    clientConst: "criminal",
    route: "/lp/employer-criminal-background-checks",
    slug: "employer-criminal-background-checks",
    title: "Criminal Background Checks for Employers",
    description:
      "Employer criminal background checks with national database, federal, state, county, and sex-offender registry options plus candidate-focused workflows.",
    canonical:
      "https://www.rapidhiresolutions.com/lp/employer-criminal-background-checks",
    ogImage: "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
  },
  {
    clientConst: "preEmployment",
    route: "/lp/pre-employment-screening",
    slug: "pre-employment-screening",
    title: "Pre-Employment Screening & Employment Verification",
    description:
      "Pre-employment screening and employment verification for employers, with mobile candidate intake, role-based services, and verified integration options.",
    canonical: "https://www.rapidhiresolutions.com/lp/pre-employment-screening",
    ogImage: "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
  },
];

const PARTNER_PAGES = [
  {
    route: "/hirequest-partner/",
    slug: "hirequest-partner",
    marker: "prerendered:hirequest-partner",
    title: "HireQuest Background Checks | Rapid Hire Solutions",
    description:
      "HireQuest franchise offices can access Rapid Hire Solutions background screening, group-rate packages, and dedicated account onboarding.",
    canonical:
      "https://www.rapidhiresolutions.com/hirequest-partner/",
    ogImage:
      "https://www.rapidhiresolutions.com/static/partners/hirequest/hirequest-logo.webp",
  },
];
const MARKETING_PAGES = [
  {
    route: "/get-a-quote",
    slug: "get-a-quote",
    marker: "prerendered:get-a-quote",
    title: "Get a Background Check Quote | Rapid Hire Solutions",
    description:
      "Tell us your hiring volume and screening needs. Get a clear, line-itemized background screening quote from Rapid Hire Solutions.",
    canonical: "https://www.rapidhiresolutions.com/get-a-quote",
    ogImage: "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
    preHydrationBody:
      `        <h1>Get a screening plan built around how you hire.</h1>\n` +
      `        <p>Tell us your hiring volume, role mix, and screening needs. A Rapid Hire specialist will review your request and send a clear, line-itemized recommendation.</p>\n` +
      `        <p><a href="/services">Explore screening services</a> or <a href="/">return to the Rapid Hire Solutions homepage</a>.</p>`,
  },
];

const INDUSTRY_PAGES = [
  {
    route: "/industries/cleaning-companies",
    slug: "cleaning-companies",
    marker: "prerendered:industries/cleaning-companies",
    title: "Background Checks for Cleaning Companies | Rapid Hire Solutions",
    description:
      "Build a faster, role-specific employee screening program for residential and commercial cleaning teams, including criminal checks, MVRs, employment verification and more.",
    canonical:
      "https://www.rapidhiresolutions.com/industries/cleaning-companies",
    ogImage: "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
    name: "Cleaning Companies",
    h1: "Hire Cleaning Staff You Can Confidently Send Into a Customer’s Home.",
    faq: [
      {
        question: "Should a cleaning company background check every employee?",
        answer:
          "A cleaning company should define screening by the duties, access, work location, customer commitments, and applicable law for each role. A residential cleaner, commercial crew leader, office coordinator, and driver may not need identical packages. Employers should document a consistent, job-related process rather than assume one universal package fits every worker.",
      },
      {
        question: "What background checks are commonly considered for residential cleaners?",
        answer:
          "Depending on the position, employers may consider identity inputs, appropriate county-level criminal searches, a broader criminal database used as a pointer, federal criminal searches, sex offender registry searches where appropriate and legally permissible, and employment verification. The final scope should reflect the role, jurisdiction, and level of access to customers' homes.",
      },
      {
        question: "Should cleaning-company drivers receive MVR checks?",
        answer:
          "When driving a company vehicle or routinely traveling between customer locations is an essential duty, a Motor Vehicle Record can help an employer review license status and relevant driving history. The employer should define the driving criteria in advance and apply them consistently under applicable law.",
      },
      {
        question: "Can screening packages differ by role?",
        answer:
          "Yes. A role-specific structure lets a cleaning company align checks with actual responsibilities. Drivers may warrant MVR screening, supervisors may have added access responsibilities, and specialty crews may need checks driven by a facility or customer contract. Rapid Hire can help organize those packages without treating every position the same.",
      },
      {
        question: "How should a cleaning company handle criminal-history information?",
        answer:
          "Employers should evaluate screening information according to the Fair Credit Reporting Act, applicable state and local requirements, and their documented hiring policies. Decisions should consider job relevance and any required individualized assessment. This page provides general information, not legal advice.",
      },
      {
        question: "Can Rapid Hire support multi-location cleaning companies?",
        answer:
          "Rapid Hire can help structure repeatable packages for different roles, branches, and service environments. The employer remains responsible for identifying the positions, locations, customer commitments, and policies that shape each package.",
      },
      {
        question: "Can screening requirements vary by customer contract?",
        answer:
          "Yes. Property managers, healthcare facilities, schools, government contractors, and other customers may set their own access or screening terms. Those requirements are not universal, so they should be reviewed contract by contract and translated into a documented package for the affected roles.",
      },
    ],
    preHydrationBody:
      `        <nav aria-label="Breadcrumb"><a href="/">Home</a> &middot; <a href="/industries">Industries</a></nav>\n` +
      `        <h1>Hire Cleaning Staff You Can Confidently Send Into a Customer’s Home.</h1>\n` +
      `        <p>Your employees may work inside homes, offices, healthcare facilities, schools, and other spaces where customers expect trust from the moment the door opens. Rapid Hire helps cleaning companies build practical screening programs without turning hiring into a bottleneck.</p>\n` +
      `        <p><a href="/services/criminal-records">Criminal screening</a>, <a href="/services/employment-verification">employment verification</a>, <a href="/services/motor-vehicle-records">Motor Vehicle Records</a>, and <a href="/get-a-quote?industry=cleaning-companies">a custom cleaning-company quote</a>.</p>`,
  },
  {
    route: "/industries/moving-companies",
    slug: "moving-companies",
    marker: "prerendered:industries/moving-companies",
    title: "Background Checks for Moving Companies | Rapid Hire Solutions",
    description:
      "Screen movers, drivers, crew leaders and storage staff with role-specific background checks built for residential and commercial moving companies.",
    canonical:
      "https://www.rapidhiresolutions.com/industries/moving-companies",
    ogImage: "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
    name: "Moving Companies",
    h1: "Screen the People Customers Trust With Everything They Own.",
    faq: [
      {
        question: "What background checks are commonly used for movers?",
        answer:
          "Depending on the role, a moving company may consider identity inputs, role-appropriate county and broader criminal searches, employment verification, and driving-record checks for employees who operate company vehicles. The package should follow the person's actual duties, locations, and applicable law.",
      },
      {
        question: "Should every moving-company employee receive the same package?",
        answer:
          "No. Movers, helpers, crew leaders, drivers, warehouse employees, and dispatch staff carry different responsibilities. A role-based screening matrix helps the employer apply relevant checks consistently without ordering driving or regulated-role components for positions that do not need them.",
      },
      {
        question: "Do moving-company drivers need MVR checks?",
        answer:
          "An MVR is commonly considered when driving is an essential job duty because it can confirm license status and report relevant driving history. The scope and decision criteria should be tied to the role, vehicle, jurisdiction, insurance requirements, and documented employer policy.",
      },
      {
        question: "Does every mover fall under DOT regulations?",
        answer:
          "No. DOT and FMCSA applicability depends on the employee's duties, vehicle, operating authority, jurisdiction, and operating circumstances. A non-regulated moving driver is not automatically a DOT driver. Employers should determine the applicable requirements for each operation and seek qualified legal or compliance guidance when needed.",
      },
      {
        question: "Can Rapid Hire screen seasonal moving crews?",
        answer:
          "Rapid Hire can help a moving company define repeatable packages and a consistent invitation workflow for seasonal or surge hiring. Turnaround still varies by service, jurisdiction, court access, source availability, and third-party response.",
      },
      {
        question: "Can we use different packages for drivers and helpers?",
        answer:
          "Yes. A helper package can focus on the checks relevant to home access and property handling, while a driver package can add MVR, license-status, or drug-screening components when appropriate. Regulated-driver requirements should be scoped separately when they apply.",
      },
      {
        question: "Can Rapid Hire support multiple branches?",
        answer:
          "Rapid Hire can help organize consistent role packages across branches while accounting for different locations, customer requirements, and job duties. That gives operations leaders a common process without assuming every jurisdiction is identical.",
      },
      {
        question: "Can driver monitoring continue after hire?",
        answer:
          "Continuous monitoring is available as a screening component and may be considered for appropriate driving roles. Its use, notices, authorization, review process, and employment decisions should follow applicable law and the employer's documented policy.",
      },
    ],
    preHydrationBody:
      `        <nav aria-label="Breadcrumb"><a href="/">Home</a> &middot; <a href="/industries">Industries</a></nav>\n` +
      `        <h1>Screen the People Customers Trust With Everything They Own.</h1>\n` +
      `        <p>Moving crews enter homes, handle valuable property, operate vehicles, and represent your company during one of the most stressful days your customer will experience. Rapid Hire helps moving companies build role-specific screening programs without unnecessarily slowing down hiring.</p>\n` +
      `        <p>Built for residential movers and household-goods movers, this guide also covers local moving companies, interstate movers, storage and moving companies, furniture/appliance delivery crews, white-glove delivery businesses, door-to-door moving companies, and last-mile household delivery operations.</p>\n` +
      `        <p><a href="/industries/transportation">Transportation screening</a>, <a href="/services/motor-vehicle-records">Motor Vehicle Records</a>, <a href="/services/drug-screening">drug screening</a>, and <a href="/get-a-quote?industry=moving-companies">a custom moving-company quote</a>.</p>`,
  },
];

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleCase(slug) {
  return slug
    .split("-")
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function loadInputs() {
  if (!fs.existsSync(META_FILE) || !fs.existsSync(OG_FILE)) {
    throw new Error(`prerender: missing inputs (${META_FILE} or ${OG_FILE})`);
  }
  const meta = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
  const og = JSON.parse(fs.readFileSync(OG_FILE, "utf-8"));
  const titleBySlug = new Map();
  const tagBySlug = new Map();
  for (const p of og.posts ?? []) {
    if (typeof p.slug === "string") {
      if (typeof p.title === "string") titleBySlug.set(p.slug, p.title);
      if (typeof p.tag === "string") tagBySlug.set(p.slug, p.tag);
    }
  }

  const allPosts = (meta.posts ?? [])
    .filter((p) => typeof p.slug === "string" && titleBySlug.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      lastmod: typeof p.lastmod === "string" ? p.lastmod : "",
      publishedAt: typeof p.publishedAt === "string" ? p.publishedAt : "",
      title: titleBySlug.get(p.slug),
      tag: tagBySlug.get(p.slug) ?? "",
    }));

  const rankedPosts = [...allPosts].sort((a, b) => {
    if (b.lastmod !== a.lastmod) return b.lastmod.localeCompare(a.lastmod);
    if (b.publishedAt !== a.publishedAt) return b.publishedAt.localeCompare(a.publishedAt);
    return a.slug.localeCompare(b.slug);
  });

  // Tag counts come from primary tags in blog-og.json. Mirror what the OG endpoint uses.
  const tagCounts = new Map();
  for (const p of allPosts) {
    if (!p.tag) continue;
    tagCounts.set(p.tag, (tagCounts.get(p.tag) ?? 0) + 1);
  }
  const rankedTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag));

  // Active years come from publishedAt; lastmod is intentionally ignored
  // because backdating made lastmod cluster on the build day.
  const yearSet = new Set();
  for (const p of allPosts) {
    const src = p.publishedAt || p.lastmod;
    const m = /^(\d{4})/.exec(src);
    if (m) yearSet.add(m[1]);
  }
  const years = Array.from(yearSet).sort();

  return {
    posts: rankedPosts.slice(0, TOP_POSTS),
    tags: rankedTags.slice(0, TOP_TAGS),
    years,
  };
}

function buildPostHtml(post, shell) {
  const url = `${SITE_BASE}/blog/${post.slug}`;
  const og = POST_OG(post.slug);
  const title = post.title;
  const description = post.title;
  const datePublished = post.publishedAt || post.lastmod;
  const dateModified = post.lastmod || post.publishedAt;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    url,
    image: og,
    datePublished: datePublished ? `${datePublished}T00:00:00Z` : undefined,
    dateModified: dateModified ? `${dateModified}T00:00:00Z` : undefined,
    keywords: post.tag || undefined,
    author: { "@type": "Organization", name: "Rapid Hire Solutions" },
    publisher: { "@type": "Organization", name: "Rapid Hire Solutions" },
  };
  return injectHead(shell, {
    marker: `prerendered:${post.slug}`,
    title,
    description,
    canonical: url,
    ogType: "article",
    ogImage: og,
    jsonld,
    preHydrationBody: buildPostBody(post),
  });
}

function buildLandingPageHtml(page, shell) {
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    url: page.canonical,
    description: page.description,
    publisher: {
      "@type": "Organization",
      name: "Rapid Hire Solutions",
    },
  };
  const jsonld = page.jsonld ?? defaultJsonLd;
  return injectHead(shell, {
    marker: page.marker ?? `prerendered:lp/${page.slug}`,
    title: page.title,
    description: page.description,
    canonical: page.canonical,
    ogType: "website",
    ogImage: page.ogImage,
    ogDescription: page.description,
    twitterDescription: page.description,
    jsonld,
    jsonLdKey: page.jsonLdKey,
    dedupeRouteMetadata: true,
    preHydrationBody: page.preHydrationBody,
  });
}

function buildIndustryPageHtml(page, shell) {
  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Industries",
          item: `${SITE_BASE}/industries`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.name,
          item: page.canonical,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title.replace(" | Rapid Hire Solutions", ""),
      description: page.description,
      url: page.canonical,
      provider: {
        "@type": "Organization",
        name: "Rapid Hire Solutions",
        url: SITE_BASE,
      },
      areaServed: "US",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
  return buildLandingPageHtml({
    ...page,
    jsonld,
    jsonLdKey: `industry-company-${page.slug}`,
  }, shell);
}

function buildTagHtml(tagEntry, shell) {
  const url = `${SITE_BASE}/blog/tag/${tagEntry.tag}`;
  const og = TAG_OG(tagEntry.tag);
  const title = `${titleCase(tagEntry.tag)} — Rapid Hire Solutions Blog`;
  const description = `${tagEntry.count} article${tagEntry.count === 1 ? "" : "s"} on ${titleCase(tagEntry.tag)} from the Rapid Hire Solutions compliance team.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url,
    description,
  };
  return injectHead(shell, {
    marker: `prerendered:tag/${tagEntry.tag}`,
    title,
    description,
    canonical: url,
    ogType: "website",
    ogImage: og,
    jsonld,
    preHydrationBody: buildTagBody(tagEntry),
  });
}

function buildYearHtml(year, shell) {
  const url = `${SITE_BASE}/blog/year/${year}`;
  const title = `${year} in review — Rapid Hire Solutions Blog`;
  const description = `Every Rapid Hire Solutions blog post published in ${year}, grouped by quarter.`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url,
    description,
  };
  return injectHead(shell, {
    marker: `prerendered:year/${year}`,
    title,
    description,
    canonical: url,
    ogType: "website",
    ogImage: SITE_OG,
    jsonld,
    preHydrationBody: buildYearBody(year),
  });
}

function stripRouteMetadata(html) {
  let out = html.replace(
    /^[ \t]*<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>\s*\n?/gim,
    "",
  );
  const propertyMeta = [
    "og:type",
    "og:title",
    "og:description",
    "og:url",
    "og:image",
  ];
  const namedMeta = [
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ];
  for (const property of propertyMeta) {
    out = out.replace(
      new RegExp(
        `^[ \\t]*<meta\\b(?=[^>]*\\bproperty=["']${property}["'])[^>]*>\\s*\\n?`,
        "gim",
      ),
      "",
    );
  }
  for (const name of namedMeta) {
    out = out.replace(
      new RegExp(
        `^[ \\t]*<meta\\b(?=[^>]*\\bname=["']${name}["'])[^>]*>\\s*\\n?`,
        "gim",
      ),
      "",
    );
  }
  return out;
}

function injectHead(shell, opts) {
  // 1) Replace <title>.
  let html = shell.replace(/<title>[\s\S]*?<\/title>/i, `<title>${htmlEscape(opts.title)}</title>`);
  // 2) Replace meta description.
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${htmlEscape(opts.description)}" />`,
  );
  if (opts.dedupeRouteMetadata) html = stripRouteMetadata(html);

  // 3) Inject canonical + OG meta + JSON-LD just before </head> (idempotent block).
  const jsonLdKeyAttribute = opts.jsonLdKey
    ? ` data-use-seo-key="${htmlEscape(opts.jsonLdKey)}"`
    : "";
  const inject =
    `\n    <!-- ${opts.marker} -->\n` +
    `    <link rel="canonical" href="${htmlEscape(opts.canonical)}" />\n` +
    `    <meta property="og:type" content="${htmlEscape(opts.ogType)}" />\n` +
    `    <meta property="og:title" content="${htmlEscape(opts.title)}" />\n` +
    `    <meta property="og:url" content="${htmlEscape(opts.canonical)}" />\n` +
    (opts.ogDescription ? `    <meta property="og:description" content="${htmlEscape(opts.ogDescription)}" />\n` : "") +
    `    <meta property="og:image" content="${htmlEscape(opts.ogImage)}" />\n` +
    `    <meta name="twitter:card" content="summary_large_image" />\n` +
    `    <meta name="twitter:title" content="${htmlEscape(opts.title)}" />\n` +
    `    <meta name="twitter:image" content="${htmlEscape(opts.ogImage)}" />\n` +
    (opts.twitterDescription ? `    <meta name="twitter:description" content="${htmlEscape(opts.twitterDescription)}" />\n` : "") +
    `    <script type="application/ld+json"${jsonLdKeyAttribute}>${JSON.stringify(opts.jsonld)}</script>\n  `;
  html = html.replace(/<\/head>/i, `${inject}</head>`);
  // 4) Replace whatever's inside <div id="root">...</div> with a route-aware
  //    pre-hydration SEO block. Same crawler/auditor rationale as the homepage
  //    shell in client/index.html: bots that don't execute JS see a real H1,
  //    intro paragraph, and crawlable links instead of an empty div.
  if (opts.preHydrationBody) {
    // Find <div id="root"> ... </div> by walking the string and balancing
    // <div>/</div> pairs. Regex won't do this safely once the production
    // shell carries the §101 SEO block (potentially nested elements).
    // The real shell documents <div id="root"> in a comment before the mount node.
    // The last exact match is the actual React root, not that comment text.
    const startIdx = html.lastIndexOf('<div id="root">');
    if (startIdx >= 0) {
      const openLen = '<div id="root">'.length;
      let depth = 1;
      let i = startIdx + openLen;
      while (i < html.length && depth > 0) {
        const nextOpen = html.indexOf("<div", i);
        const nextClose = html.indexOf("</div>", i);
        if (nextClose === -1) break;
        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth += 1;
          i = nextOpen + 4;
        } else {
          depth -= 1;
          i = nextClose + "</div>".length;
        }
      }
      if (depth === 0) {
        const replacement =
          `<div id="root">\n      <main hidden aria-hidden="true" data-pre-hydration-seo="${htmlEscape(opts.marker)}">\n${opts.preHydrationBody}\n      </main>\n    </div>`;
        html = html.slice(0, startIdx) + replacement + html.slice(i);
      }
    }
  }
  return html;
}

function renderBreadcrumb() {
  return `        <nav aria-label="Breadcrumb">\n` +
    `          <a href="/">Home</a> &middot; <a href="/blog">Blog</a>\n` +
    `        </nav>`;
}

function renderSiteLinks() {
  return `        <h2>Explore Rapid Hire Solutions</h2>\n` +
    `        <ul>\n` +
    `          <li><a href="/services">Background screening services</a></li>\n` +
    `          <li><a href="/industries">Industries we serve</a></li>\n` +
    `          <li><a href="/integrations">ATS &amp; HRIS integrations</a></li>\n` +
    `          <li><a href="/pricing">Pricing</a></li>\n` +
    `          <li><a href="/compliance">Compliance &amp; FCRA resources</a></li>\n` +
    `          <li><a href="/about">About Rapid Hire Solutions</a></li>\n` +
    `          <li><a href="/blog">Background screening blog</a></li>\n` +
    `          <li><a href="/contact">Contact our team</a></li>\n` +
    `        </ul>`;
}

function buildPostBody(post) {
  const tagLabel = post.tag ? titleCase(post.tag) : "";
  const tagLine = post.tag
    ? `        <p>Filed under <a href="/blog/tag/${htmlEscape(post.tag)}">${htmlEscape(tagLabel)}</a> on the Rapid Hire Solutions blog. <a href="/blog">See all posts</a>.</p>`
    : `        <p>Published on the Rapid Hire Solutions blog. <a href="/blog">See all posts</a>.</p>`;
  return [
    renderBreadcrumb(),
    `        <h1>${htmlEscape(post.title)}</h1>`,
    tagLine,
    `        <p>This article from Rapid Hire Solutions — a U.S.-based, FCRA-certified consumer reporting agency that delivers employment background checks, pre-employment screening, criminal background checks, motor vehicle records, drug screening, and continuous monitoring with 85%+ of standard checks completing in under 24 hours — covers ${htmlEscape(tagLabel || "background screening")} for hiring and compliance teams.</p>`,
    renderSiteLinks(),
  ].join("\n");
}

function buildTagBody(tagEntry) {
  const label = titleCase(tagEntry.tag);
  return [
    renderBreadcrumb(),
    `        <h1>${htmlEscape(label)} — Rapid Hire Solutions Blog</h1>`,
    `        <p>${tagEntry.count} article${tagEntry.count === 1 ? "" : "s"} on ${htmlEscape(label)} from the Rapid Hire Solutions compliance team. We are an FCRA-certified, U.S.-based consumer reporting agency that delivers employment background checks, pre-employment screening, criminal background checks, motor vehicle records, drug screening, and continuous monitoring; 85%+ of standard checks complete in under 24 hours.</p>`,
    `        <p><a href="/blog/tag/${htmlEscape(tagEntry.tag)}">View every ${htmlEscape(label)} article</a> or <a href="/blog">browse the full Rapid Hire Solutions blog</a>.</p>`,
    renderSiteLinks(),
  ].join("\n");
}

function buildYearBody(year) {
  return [
    renderBreadcrumb(),
    `        <h1>${htmlEscape(year)} in review — Rapid Hire Solutions Blog</h1>`,
    `        <p>Every Rapid Hire Solutions blog post published in ${htmlEscape(year)}, grouped by quarter. Rapid Hire Solutions is an FCRA-certified, U.S.-based consumer reporting agency that delivers employment background checks, pre-employment screening, criminal background checks, motor vehicle records, drug screening, and continuous monitoring; 85%+ of standard checks complete in under 24 hours.</p>`,
    `        <p><a href="/blog/year/${htmlEscape(year)}">Open the ${htmlEscape(year)} archive</a> or <a href="/blog">browse the full Rapid Hire Solutions blog</a>.</p>`,
    renderSiteLinks(),
  ].join("\n");
}

/**
 * Conservative HTML minifier: collapses runs of inter-tag whitespace and
 * trims line-leading whitespace. Does not touch contents inside <pre>,
 * <textarea>, or <script> blocks.
 */
function minifyHtml(html) {
  if (!SHOULD_MINIFY) return html;
  // Protect <pre>, <script>, <style>, <textarea> blocks from collapsing.
  const placeholders = [];
  const protectedTags = /<(pre|script|style|textarea)[\s\S]*?<\/\1>/gi;
  const guarded = html.replace(protectedTags, (m) => {
    placeholders.push(m);
    return `__PRERENDER_PROTECTED_${placeholders.length - 1}__`;
  });
  let out = guarded
    // Collapse runs of whitespace between tags.
    .replace(/>\s+</g, "><")
    // Trim leading whitespace at the start of each line.
    .replace(/^\s+/gm, "")
    // Collapse remaining whitespace runs (keep at least one space).
    .replace(/[ \t]{2,}/g, " ")
    // Remove blank lines.
    .replace(/\n+/g, "\n")
    .trim();
  out = out.replace(/__PRERENDER_PROTECTED_(\d+)__/g, (_, i) => placeholders[Number(i)]);
  return out;
}

function assertLandingMetadataMatchesClientConfig() {
  if (!fs.existsSync(LANDING_PAGE_CONFIG_SOURCE)) {
    throw new Error(
      `prerender: missing landing page config (${LANDING_PAGE_CONFIG_SOURCE})`,
    );
  }
  const source = fs.readFileSync(LANDING_PAGE_CONFIG_SOURCE, "utf-8");
  for (const page of LANDING_PAGES) {
    const marker = `const ${page.clientConst}: EmployerScreeningLandingPageConfig = {`;
    const start = source.indexOf(marker);
    const end = start >= 0 ? source.indexOf("\n};", start) : -1;
    if (start === -1 || end === -1) {
      throw new Error(
        `prerender: missing landing page config block for ${page.clientConst}`,
      );
    }
    const block = source.slice(start, end);
    for (const [label, value] of [
      ["route", page.route],
      ["title", page.title],
      ["description", page.description],
      ["canonical", page.canonical],
    ]) {
      if (!block.includes(JSON.stringify(value))) {
        throw new Error(
          `prerender: ${page.route} ${label} does not match client config`,
        );
      }
    }
    if (
      !source.includes(JSON.stringify(page.ogImage)) ||
      !block.includes("image: SOCIAL_IMAGE")
    ) {
      throw new Error(
        `prerender: ${page.route} image does not match client config`,
      );
    }
  }
}

function main() {
  if (!fs.existsSync(SHELL)) {
    console.warn(`[prerender] no shell at ${SHELL}; skipping (likely a dev build)`);
    return;
  }
  const shell = fs.readFileSync(SHELL, "utf-8");
  const { posts, tags, years } = loadInputs();
  assertLandingMetadataMatchesClientConfig();

  const writtenPosts = [];
  for (const post of posts) {
    const dir = path.join(DIST, "blog", post.slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildPostHtml(post, shell)), "utf-8");
    writtenPosts.push({ slug: post.slug, file: path.relative(DIST, out), title: post.title });
  }

  const writtenTags = [];
  for (const tag of tags) {
    const dir = path.join(DIST, "blog", "tag", tag.tag);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildTagHtml(tag, shell)), "utf-8");
    writtenTags.push({ tag: tag.tag, count: tag.count, file: path.relative(DIST, out) });
  }

  const writtenYears = [];
  for (const year of years) {
    const dir = path.join(DIST, "blog", "year", year);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildYearHtml(year, shell)), "utf-8");
    writtenYears.push({ year, file: path.relative(DIST, out) });
  }

  const writtenLandingPages = [];
  for (const page of LANDING_PAGES) {
    const dir = path.join(DIST, "lp", page.slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildLandingPageHtml(page, shell)), "utf-8");
    writtenLandingPages.push({ route: page.route, file: path.relative(DIST, out), title: page.title });
  }

  const writtenPartnerPages = [];
  for (const page of PARTNER_PAGES) {
    const dir = path.join(DIST, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildLandingPageHtml(page, shell)), "utf-8");
    writtenPartnerPages.push({ route: page.route, file: path.relative(DIST, out), title: page.title });
  }

  const writtenMarketingPages = [];
  for (const page of MARKETING_PAGES) {
    const dir = path.join(DIST, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildLandingPageHtml(page, shell)), "utf-8");
    writtenMarketingPages.push({ route: page.route, file: path.relative(DIST, out), title: page.title });
  }

  const writtenIndustryPages = [];
  for (const page of INDUSTRY_PAGES) {
    const dir = path.join(DIST, "industries", page.slug);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, "index.html");
    fs.writeFileSync(out, minifyHtml(buildIndustryPageHtml(page, shell)), "utf-8");
    writtenIndustryPages.push({ route: page.route, file: path.relative(DIST, out), title: page.title });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    siteBaseUrl: SITE_BASE,
    minified: SHOULD_MINIFY,
    count: writtenPosts.length,
    posts: writtenPosts,
    tags: writtenTags,
    years: writtenYears,
    landingPages: writtenLandingPages,
    partnerPages: writtenPartnerPages,
    marketingPages: writtenMarketingPages,
    industryPages: writtenIndustryPages,
  };
  fs.writeFileSync(
    path.join(DIST, "_prerender-manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8",
  );
  console.log(
    `[prerender] wrote ${writtenPosts.length} post stubs, ${writtenTags.length} tag stubs, ${writtenYears.length} year stubs (minified=${SHOULD_MINIFY})`,
  );
  console.log(
    `[prerender] wrote ${writtenLandingPages.length} landing page stubs`,
  );
  console.log(
    `[prerender] wrote ${writtenPartnerPages.length} partner page stubs`,
  );
  console.log(
    `[prerender] wrote ${writtenMarketingPages.length} marketing page stubs`,
  );
  console.log(
    `[prerender] wrote ${writtenIndustryPages.length} industry page stubs`,
  );
}

main();

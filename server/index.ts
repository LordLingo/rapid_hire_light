import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persist contact submissions to a JSON file co-located with the running server.
const DATA_DIR = path.resolve(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "contact_submissions.json");
const CANDIDATE_FILE = path.join(DATA_DIR, "candidate_contact_submissions.json");
const BLOG_OG_FILE = path.resolve(__dirname, "..", "shared", "blog-og.json");
const BLOG_META_FILE = path.resolve(__dirname, "..", "shared", "blog-meta.json");

function ensureContactStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf-8");
}

function readContactSubmissions(): unknown[] {
  ensureContactStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function appendContactSubmission(entry: Record<string, unknown>) {
  const list = readContactSubmissions();
  list.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2) + "\n", "utf-8");
}

// ---- Candidate-contact (mirror of vite.config.ts plugin) -------------------

function ensureCandidateStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CANDIDATE_FILE)) fs.writeFileSync(CANDIDATE_FILE, "[]\n", "utf-8");
}
function readCandidateSubmissions(): unknown[] {
  ensureCandidateStore();
  try {
    const raw = fs.readFileSync(CANDIDATE_FILE, "utf-8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function appendCandidateSubmission(entry: Record<string, unknown>) {
  const list = readCandidateSubmissions();
  list.push(entry);
  fs.writeFileSync(CANDIDATE_FILE, JSON.stringify(list, null, 2) + "\n", "utf-8");
}
function validateCandidatePayload(payload: any) {
  if (!payload || typeof payload !== "object") return { ok: false as const, error: "Invalid payload" };
  const fullName = String(payload.fullName ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const reportId = String(payload.reportId ?? "").trim();
  const message = String(payload.message ?? "").trim();
  if (!fullName) return { ok: false as const, error: "Full name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false as const, error: "A valid email address is required." };
  if (!message) return { ok: false as const, error: "A short message about your inquiry is required." };
  if (fullName.length > 200 || email.length > 320 || reportId.length > 80 || message.length > 5000) {
    return { ok: false as const, error: "One or more fields are too long." };
  }
  return { ok: true as const, value: { fullName, email, reportId, message } };
}

// ---- Blog OG image (mirror of vite.config.ts plugin) ------------------------

type BlogOgEntry = { slug: string; title: string; tag: string };

function loadBlogOgEntries(): BlogOgEntry[] {
  if (!fs.existsSync(BLOG_OG_FILE)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(BLOG_OG_FILE, "utf-8")) as { posts?: BlogOgEntry[] };
    return Array.isArray(raw.posts) ? raw.posts : [];
  } catch {
    return [];
  }
}

function wrapTitleForOg(title: string, maxChars: number, maxLines: number): string[] {
  const words = title.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (!line) { line = w; continue; }
    if ((line + " " + w).length <= maxChars) {
      line += " " + w;
    } else {
      lines.push(line);
      line = w;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (line) lines.push(line);
  const usedWords = lines.join(" ").split(/\s+/).length;
  if (usedWords < words.length && lines.length > 0) {
    let last = lines[lines.length - 1];
    if (last.length > maxChars - 1) last = last.slice(0, maxChars - 1);
    lines[lines.length - 1] = last + "…";
  }
  return lines.slice(0, maxLines);
}
function xmlEscapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// ---- Blog index feed (mirror of vite.config.ts) ----------------------------

type BlogIndexEntry = {
  slug: string;
  title: string;
  tag: string;
  lastmod: string;
  url: string;
};

type BlogIndexFeed = {
  generatedAt: string;
  count: number;
  posts: BlogIndexEntry[];
};

function buildBlogIndexFeed(): BlogIndexFeed {
  const lastmodBySlug = new Map<string, string>();
  if (fs.existsSync(BLOG_META_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(BLOG_META_FILE, "utf-8")) as {
        posts?: { slug?: string; lastmod?: string }[];
      };
      const posts = Array.isArray(raw.posts) ? raw.posts : [];
      for (const p of posts) {
        if (typeof p.slug === "string" && typeof p.lastmod === "string") {
          lastmodBySlug.set(p.slug, p.lastmod);
        }
      }
    } catch { /* ignore */ }
  }
  const entries: BlogIndexEntry[] = [];
  if (fs.existsSync(BLOG_OG_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(BLOG_OG_FILE, "utf-8")) as {
        posts?: { slug?: string; title?: string; tag?: string }[];
      };
      const posts = Array.isArray(raw.posts) ? raw.posts : [];
      for (const p of posts) {
        if (
          typeof p.slug !== "string" ||
          typeof p.title !== "string" ||
          typeof p.tag !== "string"
        ) continue;
        entries.push({
          slug: p.slug,
          title: p.title,
          tag: p.tag,
          lastmod: lastmodBySlug.get(p.slug) ?? "",
          url: `/blog/${p.slug}`,
        });
      }
    } catch { /* ignore */ }
  }
  entries.sort((a, b) => {
    if (a.lastmod !== b.lastmod) return a.lastmod < b.lastmod ? 1 : -1;
    return a.slug.localeCompare(b.slug);
  });
  return {
    generatedAt: new Date().toISOString(),
    count: entries.length,
    posts: entries,
  };
}

// ---- Atom feed for /blog/feed.xml ----------------------------------------

function inferSiteOrigin(host?: string | undefined): string {
  // Prefer explicit env override; otherwise use the request host header.
  const env = process.env.SITE_ORIGIN;
  if (env && /^https?:\/\//.test(env)) return env.replace(/\/$/, "");
  if (host) return `https://${host}`.replace(/\/$/, "");
  return "https://rapidhiresolutions.com";
}

function buildAtomFeed(origin: string): string {
  const feed = buildBlogIndexFeed();
  const entries = feed.posts.slice(0, 50);
  const updated = entries[0]?.lastmod ? `${entries[0].lastmod}T00:00:00Z` : new Date().toISOString();
  const items = entries.map((e) => {
    const updatedAt = e.lastmod ? `${e.lastmod}T00:00:00Z` : new Date().toISOString();
    const link = `${origin}${e.url}`;
    const id = link;
    return `  <entry>
    <title>${xmlEscapeText(e.title)}</title>
    <link href="${xmlEscapeText(link)}"/>
    <id>${xmlEscapeText(id)}</id>
    <updated>${updatedAt}</updated>
    <category term="${xmlEscapeText(e.tag)}"/>
    <summary>${xmlEscapeText(e.title)}</summary>
  </entry>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Rapid Hire Solutions Blog</title>
  <subtitle>Background screening, FCRA compliance, and the hiring workflow.</subtitle>
  <link href="${origin}/blog" rel="alternate" type="text/html"/>
  <link href="${origin}/blog/feed.xml" rel="self" type="application/atom+xml"/>
  <id>${origin}/blog</id>
  <updated>${updated}</updated>
  <author><name>Rapid Hire Solutions</name></author>
${items}
</feed>
`;
}

// ---- Per-tag OG card (mirror of vite.config.ts) ----------------------------

type BlogMetaForOg = {
  tags: string[];
  countByTag: Map<string, number>;
};

function loadBlogMetaForOg(): BlogMetaForOg {
  let tags: string[] = [];
  if (fs.existsSync(BLOG_META_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(BLOG_META_FILE, "utf-8")) as { tags?: string[] };
      if (Array.isArray(raw.tags)) tags = raw.tags;
    } catch { /* ignore */ }
  }
  const countByTag = new Map<string, number>();
  if (fs.existsSync(BLOG_OG_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(BLOG_OG_FILE, "utf-8")) as { posts?: { tag?: string }[] };
      const posts = Array.isArray(raw.posts) ? raw.posts : [];
      for (const p of posts) {
        const t = typeof p.tag === "string" ? p.tag : "";
        if (!t) continue;
        countByTag.set(t, (countByTag.get(t) ?? 0) + 1);
      }
    } catch { /* ignore */ }
  }
  return { tags, countByTag };
}

function toTitleCase(s: string): string {
  return s.split("-").map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1))).join(" ");
}

function renderBlogTagOgSvg(input: { tag: string; count: number }): string {
  const human = toTitleCase(input.tag);
  const titleLines = wrapTitleForOg(human, 22, 2);
  const lineHeight = 92;
  const startY = 280;
  const tspans = titleLines
    .map((ln, i) => `<tspan x="96" y="${startY + i * lineHeight}">${xmlEscapeText(ln)}</tspan>`)
    .join("");
  const subtitle = `${input.count} ${input.count === 1 ? "article" : "articles"} · Topic landing page`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="halo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0ecff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#fafaf7" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#FAFAF7" />
  <circle cx="1080" cy="120" r="360" fill="url(#halo)" />
  <rect x="96" y="96" width="6" height="42" fill="#3b82f6" />
  <text x="118" y="126" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="4" fill="#1f2937">RAPID HIRE SOLUTIONS</text>
  <text x="96" y="180" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="600" letter-spacing="4" fill="#3b82f6">TOPIC · BLOG</text>
  <text font-family="Fraunces, Georgia, serif" font-size="82" font-weight="500" fill="#0f172a" letter-spacing="-1">${tspans}</text>
  <text x="96" y="500" font-family="Inter, system-ui, sans-serif" font-size="24" fill="#475569">${xmlEscapeText(subtitle)}</text>
  <line x1="96" y1="540" x2="1104" y2="540" stroke="#e7e5dc" stroke-width="1" />
  <text x="96" y="580" font-family="Inter, system-ui, sans-serif" font-size="20" fill="#475569">A US-based CRA · Prosper, TX · FCRA certified</text>
  <text x="1104" y="580" text-anchor="end" font-family="Inter, system-ui, sans-serif" font-size="20" fill="#475569">rapidhiresolutions.com</text>
</svg>
`;
}

function renderBlogOgSvg(entry: BlogOgEntry): string {
  const titleLines = wrapTitleForOg(entry.title, 28, 4);
  const lineHeight = 78;
  const startY = 240;
  const tspans = titleLines
    .map((ln, i) => `<tspan x="96" y="${startY + i * lineHeight}">${xmlEscapeText(ln)}</tspan>`)
    .join("");
  const tagLabel = entry.tag.replace(/-/g, " ").toUpperCase();
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="halo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0ecff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#fafaf7" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#FAFAF7" />
  <circle cx="1080" cy="120" r="360" fill="url(#halo)" />
  <rect x="96" y="96" width="6" height="42" fill="#3b82f6" />
  <text x="118" y="126" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="4" fill="#1f2937">RAPID HIRE SOLUTIONS</text>
  <text x="96" y="180" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="600" letter-spacing="3" fill="#3b82f6">${xmlEscapeText(tagLabel)}</text>
  <text font-family="Fraunces, Georgia, serif" font-size="64" font-weight="500" fill="#0f172a" letter-spacing="-1">${tspans}</text>
  <line x1="96" y1="540" x2="1104" y2="540" stroke="#e7e5dc" stroke-width="1" />
  <text x="96" y="580" font-family="Inter, system-ui, sans-serif" font-size="20" fill="#475569">A US-based CRA · Prosper, TX · FCRA certified</text>
  <text x="1104" y="580" text-anchor="end" font-family="Inter, system-ui, sans-serif" font-size="20" fill="#475569">rapidhiresolutions.com</text>
</svg>
`;
}

function validateContactPayload(payload: any) {
  if (!payload || typeof payload !== "object") return { ok: false as const, error: "Invalid payload" };
  const fullName = String(payload.fullName ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const company = String(payload.company ?? "").trim();
  const volume = String(payload.volume ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const servicesRaw = Array.isArray(payload.services) ? payload.services : [];
  const services = servicesRaw.map((s: unknown) => String(s)).filter(Boolean);
  if (!fullName) return { ok: false as const, error: "Full name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false as const, error: "A valid work email is required." };
  if (!company) return { ok: false as const, error: "Company is required." };
  if (fullName.length > 200 || email.length > 320 || company.length > 200 || message.length > 5000) {
    return { ok: false as const, error: "One or more fields are too long." };
  }
  return { ok: true as const, value: { fullName, email, company, volume, services, message } };
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "1mb" }));

  // POST /api/contact — append a new submission
  app.post("/api/contact", (req, res) => {
    const result = validateContactPayload(req.body);
    if (!result.ok) {
      res.status(400).json({ ok: false, error: result.error });
      return;
    }
    const entry = {
      id: `cs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...result.value,
    };
    try {
      appendContactSubmission(entry);
    } catch {
      res.status(500).json({ ok: false, error: "Could not persist submission" });
      return;
    }
    res.status(201).json({ ok: true, id: entry.id });
  });

  // GET /api/contact — list recent submissions (preview-only convenience)
  app.get("/api/contact", (_req, res) => {
    const list = readContactSubmissions();
    res.json({ count: list.length, submissions: list.slice(-50).reverse() });
  });

  // POST /api/candidate-contact — candidate-care inbox (separate from /contact)
  app.post("/api/candidate-contact", (req, res) => {
    const result = validateCandidatePayload(req.body);
    if (!result.ok) {
      res.status(400).json({ ok: false, error: result.error });
      return;
    }
    const entry = {
      id: `cc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...result.value,
    };
    try {
      appendCandidateSubmission(entry);
    } catch {
      res.status(500).json({ ok: false, error: "Could not persist submission" });
      return;
    }
    res.status(201).json({ ok: true, id: entry.id });
  });

  app.get("/api/candidate-contact", (_req, res) => {
    const list = readCandidateSubmissions();
    res.json({ count: list.length, submissions: list.slice(-50).reverse() });
  });

  // GET /api/og/blog/:slug.svg — dynamic Open Graph image per blog post
  app.get("/api/og/blog/:slug.svg", (req, res) => {
    const slug = String(req.params.slug || "");
    if (!/^[a-z0-9-]+$/i.test(slug)) {
      res.status(400).type("text/plain").send("Bad slug");
      return;
    }
    const entry = loadBlogOgEntries().find((e) => e.slug === slug);
    if (!entry) {
      res.status(404).type("text/plain").send("Unknown post");
      return;
    }
    res.set("Content-Type", "image/svg+xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.send(renderBlogOgSvg(entry));
  });

  // GET /blog/index.json — machine-readable feed of every post.
  app.get("/blog/index.json", (_req, res) => {
    const feed = buildBlogIndexFeed();
    res.set("Content-Type", "application/json; charset=utf-8");
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    res.send(JSON.stringify(feed));
  });

  // GET /blog/feed.xml — Atom 1.0 feed for RSS aggregators.
  app.get("/blog/feed.xml", (req, res) => {
    const origin = inferSiteOrigin(req.headers.host as string | undefined);
    res.set("Content-Type", "application/atom+xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    res.send(buildAtomFeed(origin));
  });

  // GET /api/og/blog/tag/:tag.svg — dynamic OG image per blog tag
  app.get("/api/og/blog/tag/:tag.svg", (req, res) => {
    const tag = String(req.params.tag || "");
    if (!/^[a-z0-9-]+$/i.test(tag)) {
      res.status(400).type("text/plain").send("Bad tag");
      return;
    }
    const meta = loadBlogMetaForOg();
    if (!meta.tags.includes(tag)) {
      res.status(404).type("text/plain").send("Unknown tag");
      return;
    }
    const count = meta.countByTag.get(tag) ?? 0;
    res.set("Content-Type", "image/svg+xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.send(renderBlogTagOgSvg({ tag, count }));
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Prerender resolver: when /blog/<slug> has a prerendered HTML stub, serve it.
  // This makes head metadata + JSON-LD available in the initial response
  // without UA-based cloaking; the SPA still hydrates on top.
  app.get("/blog/:slug", (req, res, next) => {
    const slug = String(req.params.slug || "");
    if (!/^[a-z0-9-]+$/.test(slug)) return next();
    const candidate = path.join(staticPath, "blog", slug, "index.html");
    fs.access(candidate, fs.constants.R_OK, (err) => {
      if (err) return next();
      res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
      res.sendFile(candidate);
    });
  });

  // Handle client-side routing — serve index.html for any non-API GET
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

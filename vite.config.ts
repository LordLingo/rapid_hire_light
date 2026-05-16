import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map((entry) => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to collect browser debug logs
 * - POST /__manus__/logs: Browser sends logs, written directly to files
 * - Files: browserConsole.log, networkRequests.log, sessionReplay.log
 * - Auto-trimmed when exceeding 1MB (keeps newest entries)
 */
function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true,
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      // POST /__manus__/logs: Browser sends logs (written directly to files)
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = (payload: any) => {
          // Write logs directly to files
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };

        const reqBody = (req as { body?: unknown }).body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    },
  };
}

// =============================================================================
// Contact form API plugin
// POST /api/contact — validates payload, appends to data/contact_submissions.json
// GET  /api/contact — returns recent submissions (preview convenience)
// =============================================================================

const CONTACT_DATA_DIR = path.join(PROJECT_ROOT, "data");
const CONTACT_DATA_FILE = path.join(CONTACT_DATA_DIR, "contact_submissions.json");

function ensureContactStore() {
  if (!fs.existsSync(CONTACT_DATA_DIR)) fs.mkdirSync(CONTACT_DATA_DIR, { recursive: true });
  if (!fs.existsSync(CONTACT_DATA_FILE)) fs.writeFileSync(CONTACT_DATA_FILE, "[]\n", "utf-8");
}

function readContactSubmissions(): unknown[] {
  ensureContactStore();
  try {
    const raw = fs.readFileSync(CONTACT_DATA_FILE, "utf-8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function appendContactSubmission(entry: Record<string, unknown>) {
  const list = readContactSubmissions();
  list.push(entry);
  fs.writeFileSync(CONTACT_DATA_FILE, JSON.stringify(list, null, 2) + "\n", "utf-8");
}

function validateContactPayload(payload: any):
  | { ok: true; value: { fullName: string; email: string; company: string; volume: string; services: string[]; message: string } }
  | { ok: false; error: string } {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Invalid payload" };
  const fullName = String(payload.fullName ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const company = String(payload.company ?? "").trim();
  const volume = String(payload.volume ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const servicesRaw = Array.isArray(payload.services) ? payload.services : [];
  const services = servicesRaw.map((s: unknown) => String(s)).filter(Boolean);
  if (!fullName) return { ok: false, error: "Full name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "A valid work email is required." };
  if (!company) return { ok: false, error: "Company is required." };
  if (fullName.length > 200 || email.length > 320 || company.length > 200 || message.length > 5000) {
    return { ok: false, error: "One or more fields are too long." };
  }
  return { ok: true, value: { fullName, email, company, volume, services, message } };
}

function vitePluginContactApi(): Plugin {
  return {
    name: "manus-contact-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/contact", (req, res) => {
        if (req.method === "GET") {
          const list = readContactSubmissions();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ count: list.length, submissions: list.slice(-50).reverse() }));
          return;
        }
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json", Allow: "GET, POST" });
          res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
          if (body.length > 1_000_000) {
            req.destroy();
          }
        });
        req.on("end", () => {
          let payload: unknown;
          try {
            payload = JSON.parse(body || "{}");
          } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
            return;
          }
          const result = validateContactPayload(payload);
          if (!result.ok) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: result.error }));
            return;
          }
          const entry = {
            id: `cs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            ...result.value,
          };
          try {
            appendContactSubmission(entry);
          } catch (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: "Could not persist submission" }));
            return;
          }
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, id: entry.id }));
        });
      });
    },
  };
}

// =============================================================================
// Candidate-Contact API plugin
// POST /api/candidate-contact — validates payload, persists to
//                              data/candidate_contact_submissions.json
// GET  /api/candidate-contact — returns recent submissions (preview convenience)
// Modeled on /api/contact but with a candidate-specific schema:
//   { fullName, email, reportId?, message }
// Kept separate from /api/contact so candidate inquiries don't pollute the
// employer/sales submission stream — they get triaged by a different desk.
// =============================================================================

const CANDIDATE_DATA_FILE = path.join(CONTACT_DATA_DIR, "candidate_contact_submissions.json");

function ensureCandidateStore() {
  if (!fs.existsSync(CONTACT_DATA_DIR)) fs.mkdirSync(CONTACT_DATA_DIR, { recursive: true });
  if (!fs.existsSync(CANDIDATE_DATA_FILE)) fs.writeFileSync(CANDIDATE_DATA_FILE, "[]\n", "utf-8");
}

function readCandidateSubmissions(): unknown[] {
  ensureCandidateStore();
  try {
    const raw = fs.readFileSync(CANDIDATE_DATA_FILE, "utf-8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function appendCandidateSubmission(entry: Record<string, unknown>) {
  const list = readCandidateSubmissions();
  list.push(entry);
  fs.writeFileSync(CANDIDATE_DATA_FILE, JSON.stringify(list, null, 2) + "\n", "utf-8");
}

export type CandidateContactPayload = {
  fullName: string;
  email: string;
  reportId: string;
  message: string;
};

export function validateCandidateContactPayload(payload: any):
  | { ok: true; value: CandidateContactPayload }
  | { ok: false; error: string } {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Invalid payload" };
  const fullName = String(payload.fullName ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const reportId = String(payload.reportId ?? "").trim();
  const message = String(payload.message ?? "").trim();
  if (!fullName) return { ok: false, error: "Full name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "A valid email address is required." };
  }
  if (!message) return { ok: false, error: "A short message about your inquiry is required." };
  if (fullName.length > 200 || email.length > 320 || reportId.length > 80 || message.length > 5000) {
    return { ok: false, error: "One or more fields are too long." };
  }
  return { ok: true, value: { fullName, email, reportId, message } };
}

function vitePluginCandidateContactApi(): Plugin {
  return {
    name: "manus-candidate-contact-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/candidate-contact", (req, res) => {
        if (req.method === "GET") {
          const list = readCandidateSubmissions();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ count: list.length, submissions: list.slice(-50).reverse() }));
          return;
        }
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json", Allow: "GET, POST" });
          res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
          if (body.length > 1_000_000) req.destroy();
        });
        req.on("end", () => {
          let payload: unknown;
          try {
            payload = JSON.parse(body || "{}");
          } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
            return;
          }
          const result = validateCandidateContactPayload(payload);
          if (!result.ok) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: result.error }));
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
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: false, error: "Could not persist submission" }));
            return;
          }
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, id: entry.id }));
        });
      });
    },
  };
}

// =============================================================================
// Dynamic blog Open Graph image plugin
// GET /api/og/blog/:slug.svg — emits a 1200x630 SVG OG card for a single post,
//                              built from shared/blog-meta.json + a tiny
//                              meta-only registry mirror in shared/blog-og.json.
// SVG is small (~3 KB), cache-safe, and renders crisply on every social card.
// =============================================================================

type BlogOgEntry = { slug: string; title: string; tag: string };

function loadBlogOgEntries(): BlogOgEntry[] {
  const p = path.join(PROJECT_ROOT, "shared", "blog-og.json");
  if (!fs.existsSync(p)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf-8")) as { posts?: BlogOgEntry[] };
    return Array.isArray(raw.posts) ? raw.posts : [];
  } catch {
    return [];
  }
}

/** Wrap a string into <= maxChars per line, breaking on word boundaries. */
export function wrapTitleForOg(title: string, maxChars: number, maxLines: number): string[] {
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
  // If words remain after maxLines, append ellipsis to the last line.
  const usedWords = lines.join(" ").split(/\s+/).length;
  if (usedWords < words.length && lines.length > 0) {
    let last = lines[lines.length - 1];
    if (last.length > maxChars - 1) last = last.slice(0, maxChars - 1);
    lines[lines.length - 1] = last + "…";
  }
  return lines.slice(0, maxLines);
}

function xmlEscapeText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderBlogOgSvg(entry: BlogOgEntry): string {
  const titleLines = wrapTitleForOg(entry.title, 28, 4);
  // Approximate line height matching the 64px serif title size.
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

function vitePluginBlogOgImage(): Plugin {
  return {
    name: "manus-blog-og-image",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/og/blog/", (req, res) => {
        const url = req.url || "";
        // Match `/<slug>.svg` (the leading `/api/og/blog` prefix is stripped by Vite middleware).
        const m = url.match(/^\/?([a-z0-9-]+)\.svg(?:\?|$)/i);
        if (!m) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not found");
          return;
        }
        const slug = m[1];
        const entry = loadBlogOgEntries().find((e) => e.slug === slug);
        if (!entry) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Unknown post");
          return;
        }
        const svg = renderBlogOgSvg(entry);
        res.writeHead(200, {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        });
        res.end(svg);
      });
    },
  };
}

// =============================================================================
// Sitemap + robots.txt generator
// Emits dist/public/sitemap.xml and dist/public/robots.txt at the end of
// `vite build`. Slugs and tags come from shared/blog-meta.json so the plugin
// stays a pure Node module (no @/ alias resolution needed). The runtime blog
// registry (client/src/lib/blog.ts) and this JSON are kept in sync by a
// vitest spec that fails CI if they diverge.
//
// SITE_BASE_URL env var lets staging vs production emit different absolute
// URLs without a code change. Falls back to a sensible production default.
// =============================================================================

type BlogMeta = {
  posts: { slug: string; lastmod: string }[];
  tags: string[];
};

const STATIC_ROUTES: { path: string; priority: number; changefreq: string }[] = [
  { path: "/",             priority: 1.0,  changefreq: "weekly"  },
  { path: "/services",     priority: 0.9,  changefreq: "monthly" },
  // §83: per-check service detail pages — dedicated SEO surface area
  // and the link target the footer + blog crosslinks now point to.
  { path: "/services/criminal-records",        priority: 0.85, changefreq: "monthly" },
  { path: "/services/employment-verification", priority: 0.85, changefreq: "monthly" },
  { path: "/services/education-verification",  priority: 0.85, changefreq: "monthly" },
  { path: "/services/drug-screening",          priority: 0.85, changefreq: "monthly" },
  { path: "/services/motor-vehicle-records",   priority: 0.85, changefreq: "monthly" },
  { path: "/services/social-media-screening",  priority: 0.85, changefreq: "monthly" },
  { path: "/services/identity-verification",   priority: 0.85, changefreq: "monthly" },
  { path: "/services/healthcare-sanctions",    priority: 0.85, changefreq: "monthly" },
  { path: "/services/continuous-monitoring",   priority: 0.85, changefreq: "monthly" },
  { path: "/integrations", priority: 0.7,  changefreq: "monthly" },
  { path: "/pricing",      priority: 0.9,  changefreq: "monthly" },
  { path: "/about",        priority: 0.6,  changefreq: "yearly"  },
  { path: "/contact",      priority: 0.7,  changefreq: "yearly"  },
  { path: "/support",      priority: 0.8,  changefreq: "monthly" },
  { path: "/blog",         priority: 0.8,  changefreq: "weekly"  },
  { path: "/resources",                priority: 0.8, changefreq: "weekly"  },
  { path: "/resources/ban-the-box",    priority: 0.8, changefreq: "monthly" },
  { path: "/resources/marijuana-laws",       priority: 0.8, changefreq: "monthly" },
  { path: "/resources/legislative-updates",  priority: 0.8, changefreq: "weekly"  },
  { path: "/resources/white-papers",         priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state",                priority: 0.8, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/california",     priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/texas",          priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/new-york",       priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/florida",        priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/illinois",       priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/pennsylvania",   priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/ohio",           priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/georgia",        priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/north-carolina", priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/michigan",       priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/new-jersey",     priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/virginia",       priority: 0.7, changefreq: "monthly" },
  { path: "/resources/background-checks-by-state/washington",     priority: 0.7, changefreq: "monthly" },
  { path: "/privacy",      priority: 0.3,  changefreq: "yearly"  },
  { path: "/terms",        priority: 0.3,  changefreq: "yearly"  },
];

function loadBlogMeta(): BlogMeta {
  const metaPath = path.join(PROJECT_ROOT, "shared", "blog-meta.json");
  const raw = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as Partial<BlogMeta>;
  return {
    posts: Array.isArray(raw.posts) ? raw.posts : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  };
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemap(baseUrl: string, meta: BlogMeta): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls: string[] = [];

  for (const r of STATIC_ROUTES) {
    urls.push(
      `  <url>\n    <loc>${xmlEscape(baseUrl + r.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
    );
  }

  for (const p of meta.posts) {
    urls.push(
      `  <url>\n    <loc>${xmlEscape(`${baseUrl}/blog/${p.slug}`)}</loc>\n    <lastmod>${xmlEscape(p.lastmod)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    );
  }

  for (const t of meta.tags) {
    urls.push(
      `  <url>\n    <loc>${xmlEscape(`${baseUrl}/blog/tag/${t}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.5</priority>\n  </url>`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function buildRobots(baseUrl: string): string {
  return `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
}

function vitePluginSitemap(): Plugin {
  return {
    name: "manus-sitemap",
    apply: "build",
    closeBundle() {
      const baseUrl = (process.env.SITE_BASE_URL || "https://www.rapidhiresolutions.com").replace(/\/+$/, "");
      const outDir = path.resolve(PROJECT_ROOT, "dist/public");
      try {
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const meta = loadBlogMeta();
        fs.writeFileSync(path.join(outDir, "sitemap.xml"), buildSitemap(baseUrl, meta), "utf-8");
        fs.writeFileSync(path.join(outDir, "robots.txt"), buildRobots(baseUrl), "utf-8");
        // eslint-disable-next-line no-console
        console.log(`[sitemap] wrote sitemap.xml (${STATIC_ROUTES.length + meta.posts.length + meta.tags.length} URLs) and robots.txt`);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[sitemap] generation failed:", e);
      }
    },
  };
}

function vitePluginStorageProxy(): Plugin {
  return {
    name: "manus-storage-proxy",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/manus-storage", async (req, res) => {
        const key = req.url?.replace(/^\//, "");
        if (!key) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing storage key");
          return;
        }

        const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
        const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

        if (!forgeBaseUrl || !forgeKey) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Storage proxy not configured");
          return;
        }

        try {
          const forgeUrl = new URL("v1/storage/presign/get", forgeBaseUrl + "/");
          forgeUrl.searchParams.set("path", key);

          const forgeResp = await fetch(forgeUrl, {
            headers: { Authorization: `Bearer ${forgeKey}` },
          });

          if (!forgeResp.ok) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Storage backend error");
            return;
          }

          const { url } = (await forgeResp.json()) as { url: string };
          if (!url) {
            res.writeHead(502, { "Content-Type": "text/plain" });
            res.end("Empty signed URL");
            return;
          }

          res.writeHead(307, { Location: url, "Cache-Control": "no-store" });
          res.end();
        } catch {
          res.writeHead(502, { "Content-Type": "text/plain" });
          res.end("Storage proxy error");
        }
      });
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector(), vitePluginStorageProxy(), vitePluginContactApi(), vitePluginCandidateContactApi(), vitePluginBlogOgImage(), vitePluginSitemap()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

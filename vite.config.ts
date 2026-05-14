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
  { path: "/integrations", priority: 0.7,  changefreq: "monthly" },
  { path: "/pricing",      priority: 0.9,  changefreq: "monthly" },
  { path: "/about",        priority: 0.6,  changefreq: "yearly"  },
  { path: "/contact",      priority: 0.7,  changefreq: "yearly"  },
  { path: "/support",      priority: 0.8,  changefreq: "monthly" },
  { path: "/blog",         priority: 0.8,  changefreq: "weekly"  },
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

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector(), vitePluginStorageProxy(), vitePluginContactApi(), vitePluginSitemap()];

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

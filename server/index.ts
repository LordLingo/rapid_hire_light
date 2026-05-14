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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

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

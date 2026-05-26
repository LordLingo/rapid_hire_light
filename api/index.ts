/*
 * §190 — Vercel serverless function entrypoint.
 *
 * Vercel auto-detects this file because it's under /api at the repo root and
 * mounts whatever the default export is as a serverless function. Express
 * apps are valid Vercel function handlers — Vercel passes Node's IncomingMessage
 * and ServerResponse through directly, and Express's request handler accepts
 * that signature.
 *
 * The function only handles the dynamic paths listed in vercel.json — API
 * routes plus the dynamic blog feed / OG SVG endpoints. Static assets, the
 * prerendered /blog/<slug>/index.html stubs, and the SPA fallback are served
 * by Vercel's edge directly (no function invocation needed). See vercel.json
 * for the rewrite rules that route requests here.
 *
 * Local dev still uses `pnpm dev` / `pnpm start` against server/index.ts —
 * this file is only loaded by Vercel's build step.
 */
import { createApp } from "../server/index.js";

const app = createApp({ apiOnly: true });

export default app;

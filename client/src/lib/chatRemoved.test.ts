/*
  §103 — Chat feature removal invariant.

  The user asked to remove the floating sales chat launcher (the §83
  ChatLauncher) for now, with the option to re-install later. This test
  pins the removal so it can't get re-introduced silently:

   1. The component file `ChatLauncher.tsx` must not exist.
   2. `SiteShell.tsx` must not import or mount `ChatLauncher`.
   3. The visible /support hours card must not advertise "chat" as a
      live channel (only phone + email).

  When you intentionally re-install the chat feature, expect this file
  to be the first thing failing — that's by design. Update or delete it
  alongside the re-install.
*/
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const SHELL_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "SiteShell.tsx",
);
const CHAT_LAUNCHER_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "ChatLauncher.tsx",
);
const SUPPORT_PATH = resolve(__dirname, "..", "pages", "Support.tsx");

describe("§103 — chat feature is removed", () => {
  it("ChatLauncher.tsx does not exist on disk", () => {
    expect(existsSync(CHAT_LAUNCHER_PATH)).toBe(false);
  });

  it("SiteShell.tsx does not import ChatLauncher", () => {
    const src = readFileSync(SHELL_PATH, "utf8");
    // Strip JSX `{/* ... */}` comments and `// ...` line comments so an
    // explanatory note like "<ChatLauncher /> intentionally not mounted"
    // doesn't trigger a false positive.
    const stripped = src
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    // No active import line.
    expect(stripped).not.toMatch(/^\s*import\s+ChatLauncher\b/m);
    // No JSX mount in the executed code path.
    expect(stripped).not.toMatch(/<ChatLauncher\b/);
  });

  it("/support hours card no longer advertises chat as a live channel", () => {
    const src = readFileSync(SUPPORT_PATH, "utf8");
    expect(src).not.toMatch(/Live phone, email, and chat/);
  });
});

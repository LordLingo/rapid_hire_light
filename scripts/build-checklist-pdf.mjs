/*
  scripts/build-checklist-pdf.mjs

  Renders the 24-point employer compliance checklist as a branded,
  print-ready PDF. Runs locally on the sandbox via Python's weasyprint
  (pre-installed) and writes the resulting PDF to /tmp so it can be
  uploaded with `manus-upload-file --webdev` and used as a stable
  /manus-storage/ asset on the live site.

  This script is NOT part of the deployed runtime — it lives alongside
  other ad-hoc build helpers and is invoked by hand whenever the
  checklist content changes.

  Source of truth: client/src/pages/ComplianceChecklist.tsx (SURFACES[]).
  The script keeps its own structural copy below so it doesn't have to
  parse TS/JSX. Keep these two arrays in sync — the vitest pin in
  complianceChecklistPdf.test.ts asserts the count parity.
*/
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/* ---------- canonical content (mirrors ComplianceChecklist.tsx SURFACES) ---------- */

const SURFACES = [
  {
    n: "01",
    title: "Disclosure & authorization",
    accent: "the most-litigated artifact",
    intro:
      "The pre-hire FCRA disclosure is the single most-litigated artifact in employer screening. Standalone-document defects are the cleanest plaintiff's exhibit a class-action firm can assemble.",
    items: [
      ["Disclosure is a clear, conspicuous, standalone document.", "FCRA §604(b)(2)(A); Syed v. M-I LLC (9th Cir. 2017); Gilberg v. CCC (9th Cir. 2019)"],
      ["Disclosure contains no liability waivers, releases, or extraneous information.", "Syed v. M-I LLC; Gilberg v. CCC"],
      ["Authorization is a separately signed document — not bundled into the offer letter or employment agreement.", "FCRA §604(b)(2)(A)"],
      ["If the program runs continuous monitoring, the disclosure explicitly contemplates ongoing post-hire screening.", "FCRA §604(b)(2)(A) (interpretive)"],
    ],
  },
  {
    n: "02",
    title: "Pre-adverse action workflow",
    accent: "before any decision is communicated",
    intro:
      "When a consumer report contains information that may lead to a denial, FCRA §604(b)(3) requires a pre-adverse notice plus a copy of the report and the current CFPB Summary of Rights — delivered before any final decision is communicated to the candidate.",
    items: [
      ["Pre-adverse notice is issued before any adverse decision is communicated to the candidate.", "FCRA §604(b)(3)(A)"],
      ["A copy of the consumer report is enclosed with the pre-adverse notice — not just a summary.", "FCRA §604(b)(3)(A)(i)"],
      ["Current CFPB Summary of Rights is enclosed (March 2024 revision or later).", "12 C.F.R. §1022 App. K"],
      ["Pre-adverse template includes a clear dispute pathway and CRA contact information.", "FCRA §611; §1681g(c)"],
    ],
  },
  {
    n: "03",
    title: "Waiting-period cushion by jurisdiction",
    accent: "five days is the floor, not the answer",
    intro:
      "The federal floor is a reasonable waiting period — case law and FTC guidance settle on five business days. California, New York City, Los Angeles, and Philadelphia each layer specific cushions on top, and the ATS or screening platform must enforce them per candidate location.",
    items: [
      ["Default waiting period is at least five business days from candidate receipt of the pre-adverse notice.", "FTC informal guidance; case-law consensus"],
      ["California candidates: full five business days plus an extension if a dispute is filed during the window.", "Cal. Civ. Code §1786 (ICRAA)"],
      ["New York City candidates: pre-adverse window plus the Fair Chance Act response window applied on top.", "NYC Fair Chance Act; NYC Admin. Code §8-107(11-a)"],
      ["Los Angeles County and Philadelphia overlays are applied automatically by the ATS based on candidate location.", "LA County Fair Chance Ord. (eff. 9/3/2024); Phila. FCRSA"],
    ],
  },
  {
    n: "04",
    title: "EEOC individualized assessment",
    accent: "documented on the record",
    intro:
      "When a criminal record drives a denial, the EEOC's 2012 enforcement guidance requires a three-factor individualized assessment — nature of the offense, time elapsed, and nature of the job — on the record.",
    items: [
      ["Decision documentation captures nature of the offense, time elapsed since the offense, and nature of the job.", "EEOC Enforcement Guidance N-915.002 (Apr. 25, 2012)"],
      ["Candidate is given a meaningful opportunity to provide context before the final decision is made.", "EEOC 2012 Guidance §V.B.9; Green v. Mo. Pac. R.R. (8th Cir. 1975)"],
      ["Disqualifying-offense lists are job-related and consistent with business necessity rather than blanket bans.", "Title VII §703(a); Griggs v. Duke Power Co. (1971)"],
      ["Decision documentation is retained for at least four years for disparate-impact discovery purposes.", "29 C.F.R. §1602.14"],
    ],
  },
  {
    n: "05",
    title: "Dispute handling under FCRA §611",
    accent: "a real reinvestigation, not a re-run",
    intro:
      "FCRA §611 gives candidates 30 days to dispute a record. The CRA must reinvestigate, the employer must pause the adverse-action clock, and any final decision must be made on the corrected report — not the original.",
    items: [
      ["CRA conducts a real reinvestigation (not just a database re-run) within 30 days.", "FCRA §611 (15 U.S.C. §1681i)"],
      ["Pre-adverse waiting clock pauses while the dispute is open and resumes only on resolution.", "FCRA §611(a)(5); FTC informal guidance"],
      ["Updated report is delivered, and the final adverse-action decision is made on the corrected version.", "FCRA §611(a)(5)(A); §615(a)"],
      ["Dispute close-rate metric is tracked; a frivolous-close rate above 0.5% warrants a vendor review.", "Internal benchmark"],
    ],
  },
  {
    n: "06",
    title: "Continuous-monitoring posture",
    accent: "every alert is a new consumer report",
    intro:
      "Every continuous-monitoring alert is a new consumer report. The same disclosure, authorization, pre-adverse, and final adverse-action obligations apply on every alert the employer plans to act on — there is no informal channel.",
    items: [
      ["Original disclosure explicitly contemplates ongoing post-hire monitoring.", "FCRA §604(b)(2)(A) (interpretive)"],
      ["Authorization for continuous monitoring is a standalone document, not embedded in onboarding paperwork.", "Syed v. M-I LLC (9th Cir. 2017)"],
      ["Each actionable alert flows through the full pre-adverse and final adverse-action sequence.", "FCRA §604(b)(3); §615(a)"],
      ["Alert handling includes the EEOC individualized-assessment workflow, not just an automated threshold rule.", "EEOC Enforcement Guidance N-915.002 (2012)"],
    ],
  },
];

const TOTAL = SURFACES.reduce((acc, s) => acc + s.items.length, 0);
if (TOTAL !== 24) {
  console.error(`expected 24 items, got ${TOTAL}`);
  process.exit(1);
}

/* ---------- HTML template ---------- */

function escape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const html = /* html */ `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>The 24-point employer compliance checklist — Rapid Hire Solutions</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

    @page {
      size: Letter;
      margin: 18mm 16mm 22mm 16mm;
      @bottom-left {
        content: "Rapid Hire Solutions · The 24-point employer compliance checklist";
        font-family: 'Inter', sans-serif;
        font-size: 8.5pt;
        color: #6b7280;
      }
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 8.5pt;
        color: #6b7280;
      }
    }

    * { box-sizing: border-box; }
    html, body {
      font-family: 'Inter', sans-serif;
      color: #1d2433;
      font-size: 10.5pt;
      line-height: 1.55;
      margin: 0;
    }
    .display { font-family: 'Fraunces', serif; font-weight: 500; letter-spacing: -0.005em; }
    .accent  { color: #2563eb; font-style: italic; font-weight: 300; }
    .muted   { color: #6b7280; }
    .rule    { border-top: 1px solid #e5e7eb; }

    /* cover */
    .cover {
      page-break-after: always;
      padding-top: 18mm;
    }
    .cover .eyebrow {
      letter-spacing: 0.18em; text-transform: uppercase; font-size: 8.5pt;
      color: #6b7280;
    }
    .cover h1 {
      font-family: 'Fraunces', serif; font-weight: 500;
      font-size: 38pt; line-height: 1.05; margin: 14pt 0 18pt 0;
      letter-spacing: -0.01em;
    }
    .cover .lede {
      max-width: 150mm; font-size: 11pt; line-height: 1.6;
    }
    .cover .meta {
      margin-top: 30mm;
      display: flex; gap: 14mm; font-size: 9pt;
    }
    .cover .meta div p:first-child {
      letter-spacing: 0.18em; text-transform: uppercase;
      color: #6b7280; font-size: 8pt; margin: 0 0 4pt 0;
    }
    .cover .meta div p { margin: 0; }
    .badge {
      display: inline-block;
      padding: 3pt 8pt; border-radius: 999px;
      background: #eff6ff; color: #1d4ed8;
      font-size: 8.5pt; font-weight: 600; letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    /* surfaces */
    .surface {
      page-break-inside: avoid;
      margin-top: 14mm;
    }
    .surface:first-of-type { margin-top: 0; }
    .surface .num {
      font-family: 'Fraunces', serif; font-size: 11pt;
      color: #2563eb; letter-spacing: -0.005em;
    }
    .surface .surface-eyebrow {
      letter-spacing: 0.18em; text-transform: uppercase; font-size: 8.5pt;
      color: #6b7280;
    }
    .surface h2 {
      font-family: 'Fraunces', serif; font-weight: 500;
      font-size: 18pt; line-height: 1.15; margin: 4pt 0 2pt 0;
      letter-spacing: -0.005em;
    }
    .surface .accent-line {
      font-family: 'Fraunces', serif; font-style: italic; font-weight: 300;
      font-size: 12pt; color: #2563eb; margin: 0 0 6pt 0;
    }
    .surface .intro {
      max-width: 165mm; color: #374151; font-size: 10.5pt; line-height: 1.6;
      margin: 0 0 8pt 0;
    }
    .item {
      page-break-inside: avoid;
      display: flex; gap: 8pt;
      padding: 7pt 9pt;
      border: 0.6pt solid #e5e7eb;
      border-radius: 5pt;
      margin: 5pt 0;
      background: #ffffff;
    }
    .item .box {
      flex-shrink: 0;
      width: 11pt; height: 11pt; margin-top: 2pt;
      border: 0.8pt solid #cbd5e1; border-radius: 999px;
      background: #ffffff;
    }
    .item .text { font-family: 'Fraunces', serif; font-weight: 500; font-size: 11.5pt; line-height: 1.4; color: #1d2433; }
    .item .citation { color: #6b7280; font-size: 8.8pt; margin-top: 2pt; line-height: 1.5; }

    /* closing */
    .closing {
      page-break-before: always;
      padding-top: 12mm;
    }
    .closing h2 {
      font-family: 'Fraunces', serif; font-weight: 500; font-size: 22pt;
      line-height: 1.15; letter-spacing: -0.005em; margin: 0 0 10pt 0;
    }
    .closing p { font-size: 10.5pt; line-height: 1.65; max-width: 160mm; }
    .closing ul { padding-left: 14pt; }
    .closing li { margin: 3pt 0; }
    .closing .cta-row {
      margin-top: 10mm; display: flex; gap: 10pt; align-items: center;
    }
    .closing .cta {
      display: inline-block; padding: 5pt 11pt; border-radius: 999px;
      font-weight: 600; font-size: 10pt; letter-spacing: 0.01em;
      background: #2563eb; color: #ffffff;
      border: 0.8pt solid #2563eb;
    }
    .closing .cta-secondary {
      background: #ffffff; color: #1d2433; border: 0.8pt solid #1d2433;
    }
  </style>
</head>
<body>

  <!-- cover -->
  <section class="cover">
    <p class="eyebrow">Rapid Hire Solutions · Compliance desk</p>
    <h1>The <span class="accent">24-point</span><br/>employer compliance checklist.</h1>
    <p class="lede">
      Six surfaces — disclosure and authorization, pre-adverse workflow, waiting-period
      cushion, EEOC individualized assessment, dispute handling under FCRA §611,
      and continuous-monitoring posture — with the federal statute, regulation, or
      case-law citation behind every line. Walk through it interactively at
      <strong>rapidhire.com/compliance/checklist</strong>, or work this PDF with
      your team.
    </p>
    <div class="meta">
      <div>
        <p>Edition</p>
        <p>v.2026.05 · free</p>
      </div>
      <div>
        <p>Coverage</p>
        <p>Federal floor + CA / NYC / LA / Philadelphia overlays</p>
      </div>
      <div>
        <p>Audience</p>
        <p>Heads of People · TA leads · in-house counsel</p>
      </div>
    </div>
    <p style="margin-top: 20mm; font-size: 8.5pt; color: #6b7280; max-width: 160mm;">
      This checklist is provided for general informational purposes only and is not legal
      advice. Compliance obligations vary by jurisdiction, role, and program design.
      Consult qualified counsel before relying on any item below.
    </p>
  </section>

  <!-- surfaces -->
  ${SURFACES.map((s) => /* html */ `
    <section class="surface">
      <p class="surface-eyebrow"><span class="num">${escape(s.n)}</span> &nbsp;—&nbsp; Surface</p>
      <h2 class="display">${escape(s.title)}</h2>
      <p class="accent-line">${escape(s.accent)}</p>
      <p class="intro">${escape(s.intro)}</p>
      ${s.items
        .map(
          ([text, citation]) => /* html */ `
        <div class="item">
          <div class="box"></div>
          <div>
            <div class="text">${escape(text)}</div>
            <div class="citation">${escape(citation)}</div>
          </div>
        </div>
      `,
        )
        .join("")}
    </section>
  `).join("")}

  <!-- closing -->
  <section class="closing">
    <p class="badge">Next step</p>
    <h2 class="display">
      Couldn't confidently check four or more boxes? Walk them through with our
      <span class="accent">compliance desk</span>.
    </h2>
    <p>
      Most teams we audit can confidently check 16 to 20 of the 24 boxes without
      further work. The remaining four to eight are typically where the real
      litigation risk lives — and the patterns repeat across employers. The
      15-minute audit is built specifically to surface them on the record so you
      can fix them before a class-action firm finds them for you.
    </p>
    <ul>
      <li>15 minutes on Zoom or by phone with a U.S.-based, owner-operated, FCRA-certified compliance lead.</li>
      <li>Written one-page summary delivered within three business days.</li>
      <li>Statute, regulation, or case-law citation on every finding.</li>
      <li>No PII required on the call. No sales follow-up unless you ask.</li>
    </ul>
    <div class="cta-row">
      <span class="cta">Book the 15-minute audit  ·  rapidhire.com/compliance/audit</span>
    </div>
    <p style="margin-top: 12mm; font-size: 8.5pt; color: #6b7280;">
      © Rapid Hire Solutions · Made for high-volume hiring.
    </p>
  </section>

</body>
</html>
`;

const tmpDir = fs.mkdtempSync(path.join("/tmp", "checklist-pdf-"));
const htmlPath = path.join(tmpDir, "checklist.html");
const pdfPath = path.join(tmpDir, "RapidHire-24-Point-Compliance-Checklist.pdf");
fs.writeFileSync(htmlPath, html, "utf8");

console.log(`[build-checklist-pdf] wrote HTML → ${htmlPath}`);
console.log(`[build-checklist-pdf] running weasyprint → ${pdfPath}`);

execFileSync("weasyprint", [htmlPath, pdfPath], { stdio: "inherit" });

const stat = fs.statSync(pdfPath);
console.log(
  `[build-checklist-pdf] PDF written: ${pdfPath} (${(stat.size / 1024).toFixed(1)} KB)`,
);

// also drop a copy at a stable path for the upload step
const stablePath = path.join(
  ROOT,
  "..",
  "webdev-static-assets",
  "RapidHire-24-Point-Compliance-Checklist.pdf",
);
fs.mkdirSync(path.dirname(stablePath), { recursive: true });
fs.copyFileSync(pdfPath, stablePath);
console.log(`[build-checklist-pdf] copied → ${stablePath}`);
console.log(`PDF_PATH=${stablePath}`);

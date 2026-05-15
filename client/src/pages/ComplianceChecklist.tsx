/*
  ComplianceChecklist — /compliance/checklist

  An interactive, free-to-read 24-point employer compliance checklist. Reached
  from the Compliance hero secondary CTA ("Get the 24-point checklist") and
  designed as a sibling to /compliance/audit.

  Structure (six surfaces × four items = 24):
    01  Disclosure & authorization               (4)
    02  Pre-adverse action workflow              (4)
    03  Waiting-period cushion by jurisdiction   (4)
    04  EEOC individualized assessment           (4)
    05  Dispute handling (FCRA §611)             (4)
    06  Continuous-monitoring posture            (4)

  Every item carries the statute, regulation, or case-law citation it sits on.
  Progress is persisted to localStorage on the user's device only — no signup,
  no email gate, no server roundtrip.

  Design:
    - Inherits the warm-paper / sky-halo / Fraunces system used across the
      Compliance and ComplianceAudit pages.
    - Hero with a sticky-feeling "Your self-audit progress" card on the right
      rail (X / 24 checked + Reset).
    - Print affordance via window.print(), preserved through @media print
      rules in client/src/index.css (existing).
    - Closing dark navy CTA band that links to /compliance/audit (because
      the next step after the self-check is usually to walk it through with
      our compliance desk).
*/
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  CalendarCheck2,
  Check,
  Printer,
  RotateCcw,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";

/* ---------- checklist content ---------- */

type ChecklistItem = {
  /** Stable id used for the localStorage key. Never rename. */
  id: string;
  /** The auditable statement. */
  text: string;
  /** Statute, regulation, or case-law citation that backs the item. */
  citation: string;
};

type ChecklistSurface = {
  /** Two-digit zero-padded surface number, e.g. "01". */
  n: string;
  /** Short anchor slug, e.g. "disclosure". */
  slug: string;
  /** Surface heading. */
  title: string;
  /** Italic accent fragment used inside the heading. */
  accent: string;
  /** One-paragraph framing the surface. */
  intro: string;
  /** Exactly four items per surface — the count is enforced by vitest. */
  items: ReadonlyArray<ChecklistItem>;
};

const SURFACES: ReadonlyArray<ChecklistSurface> = [
  {
    n: "01",
    slug: "disclosure",
    title: "Disclosure & authorization",
    accent: "the most-litigated artifact",
    intro:
      "The pre-hire FCRA disclosure is the single most-litigated artifact in employer screening. Standalone-document defects are the cleanest plaintiff's exhibit a class-action firm can assemble.",
    items: [
      {
        id: "disclosure-standalone",
        text: "Disclosure is a clear, conspicuous, standalone document.",
        citation:
          "FCRA §604(b)(2)(A); Syed v. M-I LLC (9th Cir. 2017); Gilberg v. CCC (9th Cir. 2019)",
      },
      {
        id: "disclosure-no-extras",
        text: "Disclosure contains no liability waivers, releases, or extraneous information.",
        citation: "Syed v. M-I LLC; Gilberg v. CCC",
      },
      {
        id: "auth-separate",
        text: "Authorization is a separately signed document — not bundled into the offer letter or employment agreement.",
        citation: "FCRA §604(b)(2)(A)",
      },
      {
        id: "auth-monitoring",
        text: "If the program runs continuous monitoring, the disclosure explicitly contemplates ongoing post-hire screening.",
        citation: "FCRA §604(b)(2)(A) (interpretive)",
      },
    ],
  },
  {
    n: "02",
    slug: "pre-adverse",
    title: "Pre-adverse action workflow",
    accent: "before any decision is communicated",
    intro:
      "When a consumer report contains information that may lead to a denial, FCRA §604(b)(3) requires a pre-adverse notice plus a copy of the report and the current CFPB Summary of Rights — delivered before any final decision is communicated to the candidate.",
    items: [
      {
        id: "pre-adverse-notice",
        text: "Pre-adverse notice is issued before any adverse decision is communicated to the candidate.",
        citation: "FCRA §604(b)(3)(A)",
      },
      {
        id: "pre-adverse-report",
        text: "A copy of the consumer report is enclosed with the pre-adverse notice — not just a summary.",
        citation: "FCRA §604(b)(3)(A)(i)",
      },
      {
        id: "pre-adverse-rights",
        text: "Current CFPB Summary of Rights is enclosed (March 2024 revision or later).",
        citation: "12 C.F.R. §1022 App. K",
      },
      {
        id: "pre-adverse-dispute-path",
        text: "Pre-adverse template includes a clear dispute pathway and CRA contact information.",
        citation: "FCRA §611; §1681g(c)",
      },
    ],
  },
  {
    n: "03",
    slug: "waiting",
    title: "Waiting-period cushion by jurisdiction",
    accent: "five days is the floor, not the answer",
    intro:
      "The federal floor is a reasonable waiting period — case law and FTC guidance settle on five business days. California, New York City, Los Angeles, and Philadelphia each layer specific cushions on top, and the ATS or screening platform must enforce them per candidate location.",
    items: [
      {
        id: "wait-default",
        text: "Default waiting period is at least five business days from candidate receipt of the pre-adverse notice.",
        citation: "FTC informal guidance; case-law consensus",
      },
      {
        id: "wait-california",
        text: "California candidates: full five business days plus an extension if a dispute is filed during the window.",
        citation: "Cal. Civ. Code §1786 (ICRAA)",
      },
      {
        id: "wait-nyc",
        text: "New York City candidates: pre-adverse window plus the Fair Chance Act response window applied on top.",
        citation: "NYC Fair Chance Act; NYC Admin. Code §8-107(11-a)",
      },
      {
        id: "wait-la-phila",
        text: "Los Angeles County and Philadelphia overlays are applied automatically by the ATS based on candidate location.",
        citation: "LA County Fair Chance Ord. (eff. 9/3/2024); Phila. FCRSA",
      },
    ],
  },
  {
    n: "04",
    slug: "eeoc",
    title: "EEOC individualized assessment",
    accent: "documented on the record",
    intro:
      "When a criminal record drives a denial, the EEOC's 2012 enforcement guidance requires a three-factor individualized assessment — nature of the offense, time elapsed, and nature of the job — on the record.",
    items: [
      {
        id: "eeoc-three-factors",
        text: "Decision documentation captures nature of the offense, time elapsed since the offense, and nature of the job.",
        citation: "EEOC Enforcement Guidance N-915.002 (Apr. 25, 2012)",
      },
      {
        id: "eeoc-context",
        text: "Candidate is given a meaningful opportunity to provide context before the final decision is made.",
        citation:
          "EEOC 2012 Guidance §V.B.9; Green v. Mo. Pac. R.R. (8th Cir. 1975)",
      },
      {
        id: "eeoc-job-related",
        text: "Disqualifying-offense lists are job-related and consistent with business necessity rather than blanket bans.",
        citation: "Title VII §703(a); Griggs v. Duke Power Co. (1971)",
      },
      {
        id: "eeoc-retention",
        text: "Decision documentation is retained for at least four years for disparate-impact discovery purposes.",
        citation: "29 C.F.R. §1602.14",
      },
    ],
  },
  {
    n: "05",
    slug: "disputes",
    title: "Dispute handling under FCRA §611",
    accent: "a real reinvestigation, not a re-run",
    intro:
      "FCRA §611 gives candidates 30 days to dispute a record. The CRA must reinvestigate, the employer must pause the adverse-action clock, and any final decision must be made on the corrected report — not the original.",
    items: [
      {
        id: "dispute-reinvest",
        text: "CRA conducts a real reinvestigation (not just a database re-run) within 30 days.",
        citation: "FCRA §611 (15 U.S.C. §1681i)",
      },
      {
        id: "dispute-clock",
        text: "Pre-adverse waiting clock pauses while the dispute is open and resumes only on resolution.",
        citation: "FCRA §611(a)(5); FTC informal guidance",
      },
      {
        id: "dispute-corrected-report",
        text: "Updated report is delivered, and the final adverse-action decision is made on the corrected version.",
        citation: "FCRA §611(a)(5)(A); §615(a)",
      },
      {
        id: "dispute-metric",
        text: "Dispute close-rate metric is tracked; a frivolous-close rate above 0.5% warrants a vendor review.",
        citation: "Internal benchmark",
      },
    ],
  },
  {
    n: "06",
    slug: "monitoring",
    title: "Continuous-monitoring posture",
    accent: "every alert is a new consumer report",
    intro:
      "Every continuous-monitoring alert is a new consumer report. The same disclosure, authorization, pre-adverse, and final adverse-action obligations apply on every alert the employer plans to act on — there is no informal channel.",
    items: [
      {
        id: "monitor-disclosure",
        text: "Original disclosure explicitly contemplates ongoing post-hire monitoring.",
        citation: "FCRA §604(b)(2)(A) (interpretive)",
      },
      {
        id: "monitor-auth-standalone",
        text: "Authorization for continuous monitoring is a standalone document, not embedded in onboarding paperwork.",
        citation: "Syed v. M-I LLC (9th Cir. 2017)",
      },
      {
        id: "monitor-full-sequence",
        text: "Each actionable alert flows through the full pre-adverse and final adverse-action sequence.",
        citation: "FCRA §604(b)(3); §615(a)",
      },
      {
        id: "monitor-individualized",
        text: "Alert handling includes the EEOC individualized-assessment workflow, not just an automated threshold rule.",
        citation: "EEOC Enforcement Guidance N-915.002 (2012)",
      },
    ],
  },
];

const TOTAL_ITEMS = SURFACES.reduce((acc, s) => acc + s.items.length, 0);
const STORAGE_KEY = "rhs.compliance-checklist.progress.v1";

/* ---------- progress hook ---------- */

function useChecklistProgress() {
  // We hydrate from localStorage on mount (not in initialState) to keep
  // SSR-safe behavior and avoid mismatched markup if the page is ever
  // pre-rendered.
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        if (parsed && typeof parsed === "object") {
          setChecked(parsed);
        }
      }
    } catch {
      // Ignore parse / quota errors — checklist still works in-memory.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // Ignore quota errors.
    }
  }, [checked, hydrated]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = () => {
    setChecked({});
  };

  const checkedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked],
  );

  return { checked, toggle, reset, checkedCount, hydrated };
}

/* ---------- page ---------- */

export default function ComplianceChecklist() {
  useSeo({
    title:
      "The 24-point employer compliance checklist — Rapid Hire Solutions",
    description:
      "Rapid Hire Solutions' free 24-point employer compliance checklist. Six litigated surfaces — disclosure and authorization, pre-adverse workflow, waiting-period cushion, EEOC individualized assessment, dispute handling, and continuous-monitoring posture — with the FCRA section, regulation, or case-law citation behind every line. Free, no email required, save progress on your device.",
  });

  const { checked, toggle, reset, checkedCount } = useChecklistProgress();

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow="00 — 24-point checklist"
        title={
          <>
            The{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              24-point
            </span>{" "}
            employer compliance checklist.
          </>
        }
        lede="Six surfaces — disclosure and authorization, pre-adverse workflow, waiting-period cushion, EEOC individualized assessment, dispute handling, and continuous-monitoring posture — with the federal statute, regulation, or case-law citation behind every line. Walk through it interactively below, or print it and run the audit with your team."
        afterLede={
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#checklist"
                data-testid="checklist-cta-start"
                className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]"
              >
                <Check aria-hidden className="size-4" strokeWidth={2.5} />
                Start the self-audit
              </a>
              <button
                type="button"
                onClick={handlePrint}
                data-testid="checklist-cta-print"
                className="btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-border)] bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] transition-colors duration-200 ease-out hover:border-[color:var(--color-ink-soft)]"
              >
                <Printer
                  aria-hidden
                  className="size-4 text-[color:var(--color-accent-ink)]"
                />
                Print this page
              </button>
            </div>
            <ul
              data-testid="checklist-trust-strip"
              className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13.5px] text-[color:var(--color-ink-soft)]"
            >
              {[
                "Free · no email required",
                "Statute & case-law on every line",
                "Progress saved on this device only",
                "Print or work through it on screen",
              ].map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <Check
                    aria-hidden
                    className="size-4 shrink-0 text-[color:var(--color-accent-ink)]"
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </>
        }
        visual={
          <div
            data-testid="checklist-progress-card"
            className="relative w-full"
          >
            <div className="rounded-[18px] border border-border paper-shadow bg-white p-7 md:p-8">
              <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-ink-muted)]">
                Your self-audit progress
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <p
                  data-testid="checklist-progress-count"
                  className="font-display text-[64px] leading-none text-[color:var(--color-ink)]"
                >
                  {checkedCount}
                </p>
                <p className="text-[15px] text-[color:var(--color-ink-soft)]">
                  / {TOTAL_ITEMS} checked
                </p>
              </div>
              <div
                aria-hidden
                className="mt-5 h-[6px] rounded-full bg-[color:var(--color-rule)] overflow-hidden"
              >
                <div
                  data-testid="checklist-progress-bar"
                  className="h-full bg-[color:var(--color-accent-ink)] transition-[width] duration-500 ease-out"
                  style={{
                    width: `${(checkedCount / TOTAL_ITEMS) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-5 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Most teams we audit can confidently check 16 to 20 of the 24
                boxes without further work. The remaining four to eight are
                typically where the real litigation risk lives.
              </p>
              <button
                type="button"
                onClick={reset}
                data-testid="checklist-reset"
                className="btn-press mt-6 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-transparent px-4 py-2 text-[12.5px] font-medium text-[color:var(--color-ink)] transition-colors duration-200 ease-out hover:border-[color:var(--color-ink-soft)]"
              >
                <RotateCcw aria-hidden className="size-3.5" />
                Reset progress
              </button>
            </div>
          </div>
        }
      />

      {/* 01–06 Surfaces */}
      <section
        id="checklist"
        data-testid="checklist-body"
        className="bg-white scroll-mt-24"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-16">
            {SURFACES.map((surface) => (
              <SurfaceBlock
                key={surface.slug}
                surface={surface}
                checked={checked}
                toggle={toggle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Closing dark CTA band — back to /compliance/audit */}
      <section
        data-testid="checklist-closing"
        className="bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
        style={{ colorScheme: "dark" }}
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <p className="text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--color-footer-muted)]">
                When the gaps are real, walk them through with us
              </p>
              <h2 className="mt-5 font-display text-[36px] md:text-[44px] leading-[1.1] text-[color:var(--color-footer-foreground)]">
                Couldn't confidently check four or more boxes? That's exactly
                what the 15-minute audit is for.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:col-start-8 reveal-on-scroll">
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <Link
                  href="/compliance/audit"
                  data-testid="checklist-closing-cta-audit"
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-white text-[color:var(--color-ink)] px-5 py-3 text-[14px] font-medium hover:bg-[color:var(--color-paper)]"
                >
                  <CalendarCheck2 aria-hidden className="size-4" />
                  Book the 15-minute audit
                </Link>
                <Link
                  href="/compliance"
                  data-testid="checklist-closing-cta-back"
                  className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-footer-soft-text)]/40 bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-footer-foreground)] hover:border-[color:var(--color-footer-foreground)]"
                >
                  Back to compliance
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

/* ---------- surface block ---------- */

function SurfaceBlock({
  surface,
  checked,
  toggle,
}: {
  surface: ChecklistSurface;
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
}) {
  return (
    <article
      id={surface.slug}
      data-testid={`checklist-surface-${surface.slug}`}
      className="col-span-12 grid grid-cols-12 gap-x-10 gap-y-8 scroll-mt-24"
    >
      {/* Surface heading column */}
      <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
        <p className="text-[11.5px] tracking-[0.18em] uppercase text-[color:var(--color-ink-muted)]">
          <span className="font-display text-[15px] tracking-normal text-[color:var(--color-accent-ink)]">
            {surface.n}
          </span>
          <span className="mx-2 text-[color:var(--color-ink-muted)]">—</span>
          Surface
        </p>
        <h2 className="mt-3 font-display text-[28px] md:text-[32px] leading-[1.15] text-[color:var(--color-ink)]">
          {surface.title}
          <span className="block mt-1 italic font-light text-[18px] text-[color:var(--color-accent-ink)]">
            {surface.accent}
          </span>
        </h2>
        <p className="mt-4 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          {surface.intro}
        </p>
      </div>

      {/* Items column */}
      <ul className="col-span-12 lg:col-span-8 space-y-3">
        {surface.items.map((item) => {
          const isChecked = !!checked[item.id];
          const inputId = `chk-${item.id}`;
          return (
            <li
              key={item.id}
              data-testid={`checklist-item-${item.id}`}
              className="reveal-on-scroll"
            >
              <label
                htmlFor={inputId}
                className={[
                  "group block cursor-pointer rounded-[14px] border bg-white px-5 py-4 transition-colors",
                  isChecked
                    ? "border-[color:var(--color-accent-halo)] bg-[color:var(--color-tint)]/40"
                    : "border-border hover:border-[color:var(--color-ink-soft)]",
                ].join(" ")}
              >
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className={[
                      "mt-[2px] grid place-items-center size-5 shrink-0 rounded-full border transition-colors",
                      isChecked
                        ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                        : "border-[color:var(--color-rule)] bg-white text-transparent",
                    ].join(" ")}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(item.id)}
                    className="sr-only"
                    data-testid={`checklist-input-${item.id}`}
                  />
                  <div className="min-w-0">
                    <p
                      className={[
                        "font-display text-[16.5px] leading-[1.4] transition-colors",
                        isChecked
                          ? "text-[color:var(--color-ink)]"
                          : "text-[color:var(--color-ink)]",
                      ].join(" ")}
                    >
                      {item.text}
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-[1.55] text-[color:var(--color-ink-muted)]">
                      {item.citation}
                    </p>
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

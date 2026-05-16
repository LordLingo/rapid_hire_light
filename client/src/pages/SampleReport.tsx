/*
  §83 — Sample report page (/sample-report)
  ------------------------------------------
  A standalone destination page that wraps the existing SampleReportImage
  (§55, click-to-enlarge dialog with PNG download) in long-form
  explanatory copy. Two reasons this lives as its own page rather than an
  in-page anchor:

   1. Lead-magnet attribution: every top-5 BGC competitor (HireRight,
      Sterling, Checkr, First Advantage, GoodHire) gates a sample report
      behind a dedicated page with its own URL, which lets sales / SEO
      attribute traffic to the asset distinctly from the homepage hero.
   2. Linkable surface for future PDF gating: when we swap from the PNG
      preview to a gated PDF download, this page is the obvious form
      target. Today the page links straight through to the existing
      lightbox + PNG download (no friction); when sales is ready, this
      same URL becomes the gate.

  Design rhythm matches the rest of the marketing site:
    01 — Hero (eyebrow + title + lede + 3-stat band)
    02 — The image with click-to-enlarge dialog (existing SampleReportImage)
    03 — Anatomy of the report (line-by-line callouts of what each section
         contains and why it matters)
    04 — How to read your first report (four micro-steps for new clients)
    05 — Cross-links: pricing, services hub, candidate FAQ
    + CtaBanner
*/
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  Download,
  Eye,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import SampleReportImage, {
  SAMPLE_REPORT_IMAGE_URL,
} from "@/components/site/SampleReportImage";
import { useSeo } from "@/hooks/useSeo";

const ANATOMY: { label: string; body: string }[] = [
  {
    label: "Status pill",
    body:
      "The single most-glanced element on the report. CLEAR / REVIEW / ADVERSE in plain English at the top, so a hiring manager can triage in two seconds.",
  },
  {
    label: "Candidate identity block",
    body:
      "Name, DOB, last 4 of SSN, and the date the report was generated. The identity-verification trace is summarized here; the full SSN-trace evidence is collapsed in section 03.",
  },
  {
    label: "Per-check rows",
    body:
      "One row per check (criminal, employment, education, MVR, drug, etc.) with status, time-to-clear, and a click-through to the supporting court record / verifier confirmation / lab result.",
  },
  {
    label: "FCRA stamp",
    body:
      "A single line at the bottom that confirms the report was prepared under the Fair Credit Reporting Act with disclosure + consent on file, plus the 5-day pre-adverse window if any flag is open.",
  },
  {
    label: "Adjudication notes",
    body:
      "Optional: when our adjudication service is enabled, this block summarizes the matrix decision and the EEOC individualized-assessment chain that supports it.",
  },
];

const HOW_TO_READ: { num: string; head: string; body: string }[] = [
  {
    num: "01",
    head: "Read the status pill first",
    body:
      "If it's CLEAR, the rest of the report is informational. If it's REVIEW or ADVERSE, jump straight to the row that triggered it.",
  },
  {
    num: "02",
    head: "Open the supporting record",
    body:
      "Every flag is linked to its source — the county court record, the prior-employer verification, the MRO-reviewed lab result. Don't adjudicate on the row alone; read the source.",
  },
  {
    num: "03",
    head: "Apply your matrix",
    body:
      "We surface the adjudication matrix decision when you've enabled it; otherwise treat the row as raw input to your existing policy.",
  },
  {
    num: "04",
    head: "Run pre-adverse if needed",
    body:
      "Pre-adverse-action template is one click; the 5-day FCRA waiting clock starts on the date the candidate is notified, not the date the report cleared.",
  },
];

export default function SampleReport() {
  useSeo({
    title: "Sample Background Check Report — Rapid Hire Solutions",
    description:
      "See exactly what lands in your inbox. A real Rapid Hire sample report — status pill, per-check rows, supporting records, and FCRA stamp.",
    canonical: "https://www.rapidhiresolutions.com/sample-report",
    ogType: "article",
    image: SAMPLE_REPORT_IMAGE_URL,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Sample Background Check Report",
      description:
        "Anatomy of a Rapid Hire Solutions background check report.",
      url: "https://www.rapidhiresolutions.com/sample-report",
    },
  });

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="Sample Report · Preview"
        title={
          <>
            What lands in your{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              inbox.
            </span>
          </>
        }
        lede="A real Rapid Hire Solutions report — same layout, same FCRA stamp, same status pill that hiring managers triage in two seconds. Click the image below to open it full-size, or download the PNG for your procurement team."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#preview"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
              data-testid="sample-report-preview-cta"
            >
              <Eye className="h-4 w-4" />
              View the sample
            </a>
            <a
              href={SAMPLE_REPORT_IMAGE_URL}
              download="rapid-hire-sample-report.png"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
              data-testid="sample-report-download-cta"
            >
              <Download className="h-4 w-4" />
              Download (PNG)
            </a>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                FCRA stamp
              </p>
              <p className="mt-2 font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
                On every report
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                Disclosure, consent, pre-adverse window
              </p>
            </div>
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Triage in
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                ~2s
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                Status pill at the top
              </p>
            </div>
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Sources
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                Linked
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                Court records, verifier confirmations
              </p>
            </div>
          </div>
        }
      />

      {/* Breadcrumb chip */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container -mt-6 pb-4 text-[12px] text-[color:var(--color-ink-soft)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-[color:var(--color-ink)]">Sample report</span>
        </div>
      </section>

      {/* 02 — THE IMAGE */}
      <section id="preview" className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-center">
            <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
              <SampleReportImage />
            </div>
            <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
              <p className="eyebrow">02 — Preview</p>
              <h2 className="mt-4 font-display text-[28px] sm:text-[34px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The same layout for every package.
              </h2>
              <p className="mt-5 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Whether you order Employment alone or every line in the
                catalog, hiring managers see the same clean structure —
                status pill, candidate, time-to-clear, a row per check,
                and an FCRA stamp. No legalese, no surprise PDFs.
              </p>
              <div className="mt-8 grid gap-3">
                <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-ink-soft)]">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--color-accent-ink)]" />
                  FCRA-prepared with disclosure + consent on file
                </span>
                <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-ink-soft)]">
                  <Stamp className="h-4 w-4 text-[color:var(--color-accent-ink)]" />
                  Pre-adverse / adverse action workflow built in
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — ANATOMY */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — Anatomy</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Every block, line by line.
              </h2>
              <ul className="mt-8 max-w-3xl divide-y divide-border">
                {ANATOMY.map((a) => (
                  <li key={a.label} className="py-5 grid grid-cols-12 gap-x-6">
                    <p className="col-span-12 sm:col-span-3 font-display text-[16px] leading-tight text-[color:var(--color-ink)]">
                      {a.label}
                    </p>
                    <p className="col-span-12 sm:col-span-9 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {a.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — HOW TO READ */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — How to read it</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Four steps, end-to-end.
              </h2>
              <ol className="mt-8 grid sm:grid-cols-2 gap-6 max-w-4xl">
                {HOW_TO_READ.map((s) => (
                  <li
                    key={s.num}
                    className="rounded-[14px] border border-border bg-white p-6"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                      {s.num}
                    </p>
                    <p className="mt-2 font-display text-[19px] leading-tight text-[color:var(--color-ink)]">
                      {s.head}
                    </p>
                    <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — CROSS-LINKS */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              href="/services"
              className="group rounded-[14px] border border-border bg-white p-6 hover:border-[color:var(--color-accent-ink)] transition"
            >
              <p className="eyebrow">Catalog</p>
              <p className="mt-3 font-display text-[20px] leading-tight text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)]">
                See every check we run
              </p>
              <p className="mt-2 text-[13px] text-[color:var(--color-ink-soft)]">
                9 detail pages with SLA, inclusions, and compliance notes.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-brand-blue)]">
                /services <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              href="/pricing"
              className="group rounded-[14px] border border-border bg-white p-6 hover:border-[color:var(--color-accent-ink)] transition"
            >
              <p className="eyebrow">Pricing</p>
              <p className="mt-3 font-display text-[20px] leading-tight text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)]">
                Get an estimate in 30 seconds
              </p>
              <p className="mt-2 text-[13px] text-[color:var(--color-ink-soft)]">
                Mix package + add-ons; we'll show your monthly per-check cost.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-brand-blue)]">
                /pricing <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              href="/candidates"
              className="group rounded-[14px] border border-border bg-white p-6 hover:border-[color:var(--color-accent-ink)] transition"
            >
              <p className="eyebrow">Candidates</p>
              <p className="mt-3 font-display text-[20px] leading-tight text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)]">
                Are you the candidate?
              </p>
              <p className="mt-2 text-[13px] text-[color:var(--color-ink-soft)]">
                Status check, FCRA rights, dispute process — all in one place.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-brand-blue)]">
                /candidates <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}

void ArrowRight; // keep import alive for future use

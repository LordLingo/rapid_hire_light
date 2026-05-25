/*
  SampleReportImage — §55.

  Replaces the synthetic SampleReportCard (the inline "Report 24a-08821"
  mockup) with the brand owner's real Rapid Hire sample report PNG.
  Used in three places:
    • SampleReportSection (homepage proof column)
    • Services.tsx (#sample-report block)
    • Pricing.tsx (#sample-report block)
  Every "View Sample Report" CTA across the site already deep-links to
  the #sample-report anchor, so they all converge on this image.

  Behavior
    Resting:   shows the report as a paper card with paper-shadow + a
               soft halo wash (mirrors the affordance the previous
               synthetic card carried), with `role="button"` so it is
               focusable and announces as clickable. A small "Expand"
               affordance in the top-right corner reinforces the hint.
    Hover:     image lifts subtly via the existing .hover-lift-card
               utility + a ring deepens to accent-halo so the card
               reads "alive".
    Click:     opens a Radix Dialog lightbox at viewport width, with
               the full-resolution sample report rendered un-cropped,
               a close button in the top-right, and a "Download PDF"
               link below for users who want to keep a copy. Esc /
               overlay click / close button all dismiss.
    Keyboard:  Enter and Space both open the lightbox (matches button
               semantics). Tab order: card → expand chip → next item.

  The image asset lives at /static/samplereport.webp (§189 — re-encoded
  from PNG to WebP at q82 to fit under the 1MB-per-file checkpoint limit;
  visually identical, 93% smaller). The URL is shared as a constant so a
  future re-upload only changes one source of truth.
*/
import { useState } from "react";
import { Maximize2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Single source of truth for the sample report asset URL. If the
// brand owner re-uploads the report (different PDF rev, updated
// branding), bump this constant and every entry point updates.
export const SAMPLE_REPORT_IMAGE_URL = "/static/samplereport.webp";

// Alt text used in BOTH the inline card and the lightbox image. Kept
// explicit so screen readers convey what the visual is — a sample
// background-check report — without relying on surrounding copy.
const SAMPLE_REPORT_ALT =
  "Sample Rapid Hire Solutions background check report — applicant John Doe, package: Standard Criminal Package, all eight searches cleared.";

export default function SampleReportImage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/*
        Resting card. We use a <button> (not a styled <div role=button>)
        so it picks up native focus ring, native Enter/Space activation,
        and the browser's built-in disabled state semantics.
      */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Open the full sample background-check report"
        data-testid="sample-report-image-trigger"
        className="group relative block w-full overflow-hidden rounded-[18px] border border-border bg-white paper-shadow hover-lift-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-halo)] focus-visible:ring-offset-2 transition-[border-color] duration-300 ease-out hover:border-[color:var(--color-accent-halo)]"
      >
        <img
          src={SAMPLE_REPORT_IMAGE_URL}
          alt={SAMPLE_REPORT_ALT}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
        />
        {/*
          Expand affordance overlay — appears on hover/focus, makes
          the click target unmistakable. Top-right placement mirrors
          the report's own "Download PDF version" CTA position so the
          interaction reads as a continuation of the report's design.
        */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-ink)]/85 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-white opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Maximize2 className="size-3" />
          Expand
        </span>
      </button>

      {/*
        Lightbox. We override the default DialogContent max-width
        (`sm:max-w-lg`) so the report renders at a comfortable reading
        size — the source PNG is ~1056 × 1500, so capping width at
        920px on desktop preserves legibility while keeping breathing
        room around the image. On mobile the dialog falls back to the
        default `max-w-[calc(100%-2rem)]` rule baked into DialogContent.
      */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[920px] p-0 overflow-hidden bg-white"
          data-testid="sample-report-image-dialog"
        >
          {/*
            Visually hidden DialogTitle / DialogDescription so Radix's
            a11y contract is satisfied without rendering competing
            copy on top of the image. Screen readers still announce
            "Sample background check report" + the longer description.
          */}
          <DialogTitle className="sr-only">
            Sample background-check report
          </DialogTitle>
          <DialogDescription className="sr-only">
            {SAMPLE_REPORT_ALT}
          </DialogDescription>

          <div className="max-h-[85vh] overflow-y-auto">
            <img
              src={SAMPLE_REPORT_IMAGE_URL}
              alt={SAMPLE_REPORT_ALT}
              className="block w-full h-auto"
            />
          </div>

          {/*
            Footer affordance: download as PDF. The asset itself is a
            PNG today; we still expose a "Download" entry so the
            pattern is in place for when the brand owner supplies the
            PDF version. Until then we link to the same asset via
            `download` which triggers a browser download instead of
            a navigation. The href is the canonical asset URL.
          */}
          <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-6 py-3">
            <p className="text-[12px] text-[color:var(--color-ink-muted)]">
              Sample report — illustrative only.
            </p>
            <a
              href={SAMPLE_REPORT_IMAGE_URL}
              download="rapid-hire-sample-report.png"
              className="btn-press inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-accent-ink)] px-4 py-2 text-[12.5px] font-medium text-white hover:opacity-90"
            >
              <Download className="size-3.5" />
              Download
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

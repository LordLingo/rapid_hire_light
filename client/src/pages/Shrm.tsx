/*
  §139 — /shrm landing page (SHRM 2026 Annual, Orlando, June 21-24).

  This is the destination for:
    (a) booth visitors who scan the booth's QR code
    (b) prospects clicking through from pre-event LinkedIn / email
        prospecting
    (c) post-event follow-up traffic from badge-scan lists

  The page is intentionally a SHRM-flavored extension of the SPA brand,
  not a standalone microsite. Visitors who scan the booth's QR code
  already saw "Speed · Price · Accuracy" on the booth artwork — the
  page picks up there rather than re-introducing the brand from
  scratch.

  Page structure (5 sections):
    01 — Hero: event details + booth number + primary CTA
    02 — What to expect at the booth (3 bullets)
    03 — SPA pillars (reused, hero variant) — the substance
    04 — Virtual fallback for buyers who can't make it to Orlando
    05 — Final CTA: "Step into the SPA at SHRM 2026"

  When the conference ends (June 24, 2026), the page itself stays up
  but the announcement strip auto-hides and the page can be redirected
  to /spa later if desired (post-mortem traffic still has a home in
  the meantime).
*/
import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  MapPin,
  Phone,
  Sparkles,
  Video,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import SpaPillars from "@/components/site/SpaPillars";
import ShrmBookingPicker from "@/components/site/ShrmBookingPicker";
import { useSeo } from "@/hooks/useSeo";
import { SPA_TAGLINE, SPA_TREATMENT_CTA } from "@/lib/spa";
import {
  SHRM_EVENT,
  SHRM_HEADLINE,
  SHRM_TAGLINE,
  SHRM_UTM_KEY,
  buildShrmContactUrl,
  isUpcoming,
} from "@/lib/shrm";

/*
  §139.2 — "What to expect" bullets. Three is the right number here —
  it's enough to make the booth visit feel concrete (the buyer knows
  what they're walking into) without burying the page in copy. Each
  bullet leads with what the buyer gets, not what we want.
*/
const WHAT_TO_EXPECT = [
  {
    icon: Coffee,
    title: "A 15-minute SPA Treatment.",
    body: "Sit down with a U.S.-based, FCRA-accredited rep — not an SDR. We walk you through your current vendor's published numbers and ours, side by side. No slide deck. No sales cadence.",
  },
  {
    icon: Clock,
    title: "A live TAT comparison.",
    body: "Bring the name of your current screening provider. We'll pull our median turnaround for the month against theirs and you'll see exactly where the gap is. Most reps walk away with a number they didn't have when they walked in.",
  },
  {
    icon: Sparkles,
    title: "A custom price built around your real roles.",
    body: "Tell us the volume, geography, and screen mix you actually run. We'll quote a real package on the spot — emailed before you leave the floor — that you can compare against your existing contract.",
  },
] as const;

/*
  §139.5 — On mount, capture any UTM params present in the URL into
  sessionStorage. Contact.tsx reads them and appends to the message
  body so the user gets attribution data from booked meetings without
  needing a real analytics platform.
*/
function captureUtmParams() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const k of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]) {
      const v = params.get(k);
      if (v) utm[k] = v;
    }
    if (Object.keys(utm).length > 0) {
      window.sessionStorage.setItem(SHRM_UTM_KEY, JSON.stringify(utm));
    }
  } catch {
    /* sessionStorage may be blocked (Safari Private, etc.) — fail silently */
  }
}

export default function Shrm() {
  useSeo({
    title:
      "Meet Rapid Hire at SHRM 2026 — Orlando, June 21-24 | Rapid Hire Solutions",
    description:
      "Step into the SPA — Speed, Price, Accuracy — at the largest HR conference of the year. Book your 15-minute SPA Treatment with a U.S.-based, FCRA-accredited rep at SHRM 2026, June 21-24, Orange County Convention Center, Orlando.",
  });

  useEffect(() => {
    captureUtmParams();
  }, []);

  const upcoming = useMemo(() => isUpcoming(), []);
  const contactUrl = useMemo(() => buildShrmContactUrl(), []);

  return (
    <SiteShell>
      {/* ---------- 01 — Hero ---------- */}
      <section
        id="shrm-hero"
        data-testid="shrm-hero"
        className="relative overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-[640px] w-[640px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.82 0.09 250 / 0.6), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.95 0.04 75 / 0.9), transparent 70%)",
          }}
        />
        <div className="container relative pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
              <span className="eyebrow">SHRM 2026</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              {/* Event marquee strip */}
              <div
                className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] uppercase tracking-[0.2em] text-[color:var(--color-ink-muted)]"
                data-testid="shrm-event-meta"
              >
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-3.5" />
                  {SHRM_EVENT.dateRange}
                </span>
                <span aria-hidden className="text-[color:var(--color-rule)]">·</span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-3.5" />
                  {SHRM_EVENT.city}
                </span>
                <span aria-hidden className="text-[color:var(--color-rule)]">·</span>
                <span className="inline-flex items-center gap-2 font-semibold text-[color:var(--color-accent-ink)]">
                  Booth #{SHRM_EVENT.booth}
                </span>
              </div>

              <h1 className="font-display text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[56px] md:text-[68px] lg:text-[80px]">
                <span className="block">Meet us at</span>
                <span className="block italic font-light text-[color:var(--color-accent-ink)]">
                  SHRM 2026.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-[20px] leading-[1.55] font-medium text-[color:var(--color-accent-ink)]">
                {SHRM_TAGLINE}
              </p>
              <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {SPA_TAGLINE} We're at the {SHRM_EVENT.venue} for three days
                running 15-minute SPA Treatments with HR leaders evaluating
                their current screening vendor. Book your slot below — and if
                you can't make it to Orlando, the same call works on Zoom.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href={contactUrl}
                  data-testid="shrm-hero-primary-cta"
                  className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-4 text-[15px] font-semibold text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                >
                  Book your SPA Treatment at the booth
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={contactUrl + "&virtual=1"}
                  data-testid="shrm-hero-virtual-cta"
                  className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule)] bg-white px-7 py-4 text-[15px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                >
                  <Video className="size-4" />
                  Can't make it? Book virtual
                </Link>
              </div>

              {!upcoming && (
                <p
                  data-testid="shrm-past-event-notice"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)] px-4 py-2 text-[13px] text-[color:var(--color-ink-muted)]"
                >
                  <Sparkles className="size-3.5" />
                  SHRM {SHRM_EVENT.year} has wrapped — but the SPA Treatment
                  is still on. Same call, any time of year.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 02 — What to expect at the booth ---------- */}
      <section
        id="shrm-what-to-expect"
        data-testid="shrm-what-to-expect"
        className="border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
              <span className="eyebrow">01 — At the booth</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
            <div className="col-span-12 lg:col-span-10 reveal-on-scroll">
              <p className="font-display text-[28px] leading-[1.25] tracking-[-0.01em] text-[color:var(--color-ink)] md:text-[36px]">
                What you walk away with after 15 minutes at our booth.
              </p>
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {WHAT_TO_EXPECT.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="reveal-on-scroll"
                      data-testid="shrm-expect-card"
                    >
                      <div className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-[color:var(--color-accent-ink)] text-white">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-display text-[20px] leading-[1.3] tracking-[-0.01em] text-[color:var(--color-ink)]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-[1.6] text-[color:var(--color-ink-soft)]">
                        {item.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 03 — Booking picker (§148) ---------- */}
      <ShrmBookingPicker />

      {/* ---------- 04 — SPA pillars (the substance) ---------- */}
      <section
        id="shrm-pillars"
        data-testid="shrm-pillars-section"
        className="border-t border-[color:var(--color-rule)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
              <span className="eyebrow">03 — Why we're worth the walk</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
            <div className="col-span-12 lg:col-span-10 reveal-on-scroll">
              <p className="font-display text-[28px] leading-[1.25] tracking-[-0.01em] text-[color:var(--color-ink)] md:text-[36px]">
                Three letters, three commitments, one full-service program.
              </p>
              <p className="mt-4 max-w-3xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                The SPA framework is what we put on the booth, but it's
                also how we run the company. Speed because slow background
                checks kill time-to-hire. Price because pricing should be
                in the open. Accuracy because the alternative is hiring
                the wrong person — or rejecting the right one.
              </p>
              <div className="mt-10">
                <SpaPillars variant="hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 05 — Virtual fallback ---------- */}
      <section
        id="shrm-virtual"
        data-testid="shrm-virtual-section"
        className="border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
              <span className="eyebrow">04 — Can't make it?</span>
              <span className="hidden lg:block hairline mt-3" />
            </div>
            <div className="col-span-12 lg:col-span-10 reveal-on-scroll">
              <p className="font-display text-[28px] leading-[1.25] tracking-[-0.01em] text-[color:var(--color-ink)] md:text-[36px]">
                Orlando's a long flight. The SPA Treatment isn't.
              </p>
              <p className="mt-4 max-w-3xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Same 15-minute call, same FCRA-accredited rep, same
                line-by-line vendor comparison — over Zoom from your
                desk. Pick a slot during conference week (we run them
                between booth shifts) or any business day before or
                after. Bring your current vendor's pricing sheet and
                the volume you ran last quarter; we'll do the math live.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--color-rule)] bg-white p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[color:var(--color-accent-ink)]" />
                  <div>
                    <div className="text-[15px] font-semibold text-[color:var(--color-ink)]">
                      No slide deck
                    </div>
                    <div className="text-[13px] text-[color:var(--color-ink-muted)]">
                      We talk numbers, not narrative.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--color-rule)] bg-white p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[color:var(--color-accent-ink)]" />
                  <div>
                    <div className="text-[15px] font-semibold text-[color:var(--color-ink)]">
                      No SDR handoff
                    </div>
                    <div className="text-[13px] text-[color:var(--color-ink-muted)]">
                      Direct to a U.S.-based, FCRA-accredited rep.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--color-rule)] bg-white p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[color:var(--color-accent-ink)]" />
                  <div>
                    <div className="text-[15px] font-semibold text-[color:var(--color-ink)]">
                      Custom quote in writing
                    </div>
                    <div className="text-[13px] text-[color:var(--color-ink-muted)]">
                      Emailed before we hang up.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 06 — Final CTA ---------- */}
      <section
        id="shrm-final-cta"
        data-testid="shrm-final-cta"
        className="border-t border-[color:var(--color-rule)]"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-10 lg:col-start-2 text-center reveal-on-scroll">
              <h2 className="font-display text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)] md:text-[52px]">
                {SHRM_HEADLINE}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {SHRM_EVENT.dateRange}, {SHRM_EVENT.venue}, Booth #
                {SHRM_EVENT.booth}. Or anywhere with a Zoom link.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={contactUrl}
                  data-testid="shrm-final-cta-primary"
                  className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-4 text-[15px] font-semibold text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                >
                  {SPA_TREATMENT_CTA}
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="tel:+18005551234"
                  className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-rule)] bg-white px-7 py-4 text-[15px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                >
                  <Phone className="size-4" />
                  Call us
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
              <p className="mt-6 text-[13px] text-[color:var(--color-ink-muted)]">
                We're a small team. Pre-book to get a guaranteed slot.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

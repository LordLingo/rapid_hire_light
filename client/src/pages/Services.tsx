/*
  Editorial Calm — Services detail page
  Layout:
   - PageHero with eyebrow "Services" + accent on "every screen we run".
   - Long-form services: 6 deeper service entries, alternating left rail
     (number + tag) and right column (title, body, what's included list,
     SLA chip). Hairline rules between entries — same editorial cadence as
     the homepage, deeper detail.
   - Closing CTA strip routes to /contact.
*/
import { Link } from "wouter";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { ServicesStack } from "@/components/heroes/HeroCards";
import HeroMiniStats from "@/components/heroes/HeroMiniStats";
import SampleReportImage from "@/components/site/SampleReportImage";
import { SERVICE_CATALOG } from "@/lib/serviceCatalog";

// §83: source the on-page list from the shared SERVICE_CATALOG so the
// hub renders all 9 detail pages, the link slugs are guaranteed to
// match, and edits to copy/SLA/inclusions land in one place.
const SERVICES = SERVICE_CATALOG.map((s, i) => ({
  icon: s.icon,
  slug: s.slug,
  tag: s.tag.replace(/^\d+/, String(i + 1).padStart(2, "0")),
  title: s.title,
  body: s.summary,
  includes: s.includes.slice(0, 5),
  sla: s.sla,
  // §114 — opt-in standalone illustration for the article left rail.
  heroImage: s.heroImage,
}));

// Legacy literal removed: the original 6-entry array used inline
// lucide icon symbols (BriefcaseBusiness, Gavel, etc.). The catalog
// imports them per-entry now, so the literal here is no longer needed.
// See git history for the prior version.
const _LEGACY_SERVICES_REFERENCE: unknown[] = [
];
void _LEGACY_SERVICES_REFERENCE;

export default function Services() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="01 — Services"
        title={
          <>
            Every screen we run, in one{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              honest list.
            </span>
          </>
        }
        lede="Comprehensive background screening services tailored to elevate your hiring process and boost your team's success — with the SLAs and inclusions written down where you can see them."
        visual={<ServicesStack />}
        belowVisual={<HeroMiniStats page="services" />}
      />

      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid">
            {SERVICES.map((s, i) => (
              <article
                key={s.title}
                className={[
                  "reveal-on-scroll grid grid-cols-12 gap-x-8 gap-y-6 py-12 md:py-16",
                  i === 0 ? "" : "border-t border-border",
                ].join(" ")}
              >
                <div className="col-span-12 lg:col-span-3">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center size-10 rounded-full border border-border text-[color:var(--color-accent-ink)]">
                      <s.icon className="size-4" strokeWidth={1.5} />
                    </span>
                    <span className="eyebrow">{s.tag}</span>
                  </div>
                  {/*
                    §114 — optional standalone editorial illustration.
                    Renders directly under the icon + tag eyebrow when
                    the catalog entry opts in via `heroImage`. Services
                    without `heroImage` keep the original icon-only rail
                    untouched.
                  */}
                  {s.heroImage ? (
                    <img
                      src={s.heroImage.url}
                      alt={s.heroImage.alt}
                      loading="lazy"
                      decoding="async"
                      data-testid={`service-hero-image-${s.slug}`}
                      className="mt-5 w-full max-w-[260px] aspect-square rounded-2xl border border-border bg-white p-2 object-cover paper-shadow"
                    />
                  ) : null}
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <h2 className="font-display text-[28px] md:text-[36px] leading-tight text-[color:var(--color-ink)]">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                    {s.body}
                  </p>
                </div>
                <div className="col-span-12 lg:col-span-3">
                  <p className="eyebrow">What&apos;s included</p>
                  <ul className="mt-3 grid gap-1.5">
                    {s.includes.map((item) => (
                      <li
                        key={item}
                        className="text-[13.5px] leading-snug text-[color:var(--color-ink-soft)]"
                      >
                        — {item}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 inline-block rounded-full border border-[color:var(--color-accent-ink)]/20 bg-[color:var(--color-tint)] px-3 py-1 text-[11.5px] font-medium text-[color:var(--color-accent-ink)] tracking-wide">
                    {s.sla}
                  </span>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-brand-blue)] hover:underline"
                    data-testid={`service-detail-link-${s.slug}`}
                  >
                    Read full spec
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* §83 — International screening pillar callout. Sits between
          the services list and the sample report so the international
          surface gets equal weight to the domestic checks. */}
      <section
        data-testid="services-international-callout"
        className="bg-[color:var(--color-paper-soft)] border-y border-border"
      >
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-12 gap-x-8 gap-y-6 items-center">
            <div className="col-span-12 lg:col-span-7">
              <p className="eyebrow">10 — International</p>
              <h3 className="mt-3 font-display text-[28px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Screening across{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  borders.
                </span>
              </h3>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                12+ countries today. GDPR-compliant consent, country-specific
                criminal-record retrieval, education and employment
                verification calibrated to the local registrar, and a single
                desk that runs the dispute when one is needed.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-5 flex flex-col items-start lg:items-end gap-3">
              <Link
                href="/services/international"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
                data-testid="services-international-link"
              >
                Open the country selector
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-[12px] text-[color:var(--color-ink-muted)]">
                US · Canada · Mexico · UK · Ireland · Germany · France · Spain · NL · Poland · Italy · India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample of what every service returns. The real Rapid Hire
          sample report PNG (§55) renders here too — same image used
          on /home and /pricing, with the same click-to-enlarge
          lightbox. Lives between the long-form list and the closing CTA. */}
      <section
        id="sample-report"
        aria-labelledby="services-sample-heading"
        className="bg-white border-t border-border"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-center">
            <div className="col-span-12 lg:col-span-5">
              <SampleReportImage />
            </div>
            <div className="col-span-12 lg:col-span-7">
              <p className="eyebrow">07 — What lands in your inbox</p>
              <h3
                id="services-sample-heading"
                className="mt-4 font-display text-[30px] sm:text-[38px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]"
              >
                Six services. One{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  audit-ready report.
                </span>
              </h3>
              <p className="mt-5 max-w-xl text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Whether you order Employment alone or every line above,
                hiring managers see the same clean layout — status pill,
                candidate, time-to-clear, a row per check, and an FCRA
                stamp. No legalese, no surprise PDFs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*
        §45: Services bottom CTA band — dark footer-family gradient.

        Previously a thin white card on warm paper. Restyled to share
        the same dark gradient surface as the homepage Switch CTA
        band (`CtaBanner`) and the homepage StopGambling section, so
        all three branded surfaces on the marketing site read as one
        family. Mirrors CtaBanner's pattern exactly:
          • 90deg gradient from --color-footer → --color-footer-soft
          • top-edge sky-halo hairline glow
          • soft halo behind the headline column
          • inverted footer-foreground/footer-soft-text/footer-muted text
          • italic accent on "in minutes." swaps to --color-accent-halo
          • Get a quote button keeps the site's brand-blue --color-accent-ink
            fill (per user request) but picks up `.cta-banner-cta` so it
            inherits the same 6px hover-lift + sky-halo glow gesture
            already used by the Switch CTA and Hero Start Screening.
      */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20">
          <div
            data-testid="services-cta-band"
            className="reveal-on-scroll cta-banner-dark relative grid grid-cols-12 gap-6 rounded-[20px] border border-[color:var(--color-footer-border)] px-6 md:px-10 py-10 md:py-14 paper-shadow overflow-hidden text-[color:var(--color-footer-foreground)]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--color-footer) 0%, var(--color-footer) 35%, var(--color-footer-soft) 100%)",
              colorScheme: "dark",
            }}
          >
            {/* Top-edge sky-halo hairline (matches CtaBanner). */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-6 right-6 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-accent-halo) 60%, transparent) 25%, color-mix(in oklch, var(--color-accent-halo) 60%, transparent) 75%, transparent)",
              }}
            />
            {/* Soft halo behind the headline column. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, var(--color-accent-halo), transparent 70%)",
              }}
            />
            <div className="col-span-12 md:col-span-8 relative">
              <p className="eyebrow text-[color:var(--color-footer-muted)]">
                Ready when you are
              </p>
              <h2 className="mt-3 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-footer-foreground)]">
                Build a package that fits the role —{" "}
                <span className="italic font-normal text-[color:var(--color-accent-halo)]">
                  in minutes.
                </span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:justify-end items-end relative">
              {/* §111: dedicated quote page (Formspree mvzyoyoz). */}
              <Link
                href="/get-a-quote"
                data-testid="services-cta-banner-quote"
                className="cta-banner-cta btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Get a quote
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

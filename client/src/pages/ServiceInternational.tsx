/*
  §83 — /services/international
  ------------------------------
  International screening pillar with a 12-country selector (US,
  Canada, Mexico, UK, Ireland, Germany, France, Spain, Netherlands,
  Poland, Italy, India). Country selector uses URL hash to drive a
  detail panel below — bookmark-friendly, no JS state required for
  initial render, and degrades gracefully without JS.

  Section rhythm:
    01 — paper        Hero
    02 — paper-soft   Country selector strip
    03 — paper        Selected country detail panel
    04 — paper-soft   How international screens work
    + CtaBanner
*/
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import { COUNTRIES, getCountryByIso2 } from "@/lib/internationalCountries";

const REGIONS = ["Americas", "EMEA", "APAC"] as const;

export default function ServiceInternational() {
  useSeo({
    title: "International background checks — 12+ countries | Rapid Hire",
    description:
      "Coordinated international screening across 12+ countries with GDPR-compliant consent, country-specific criminal-record retrieval, and education + employment verification. UK DBS, Canada CPIC, India police verification, and more.",
    canonical: "https://www.rapidhiresolutions.com/services/international",
  });

  // Read initial selection from URL hash (e.g. #gb -> United Kingdom).
  const [selected, setSelected] = useState<string>(() => {
    if (typeof window === "undefined") return "us";
    const hash = window.location.hash.replace("#", "").toLowerCase();
    return getCountryByIso2(hash) ? hash : "us";
  });

  // Keep URL hash in sync with the selected country so deep-links work.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash !== selected) {
      window.history.replaceState(null, "", `#${selected}`);
    }
  }, [selected]);

  const country = getCountryByIso2(selected) ?? COUNTRIES[0]!;

  return (
    <SiteShell>
      <PageHero
        eyebrow="Services · International"
        title={
          <>
            <span className="block">Background checks across</span>
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              borders.
            </span>
          </>
        }
        lede="Coordinated international screening across 12+ countries — GDPR-compliant consent, country-specific criminal-record retrieval, education and employment verification calibrated to the local registrar, and a single point of accountability when something needs to be expedited."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact?topic=international"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Get a tailored quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              Browse all services
            </Link>
          </div>
        }
        visual={
          <div className="rounded-[18px] border border-border paper-shadow bg-white p-6 md:p-7">
            <div className="flex items-center gap-3 text-[color:var(--color-accent-ink)]">
              <Globe2 className="h-5 w-5" />
              <p className="font-display text-[20px] tracking-[-0.005em] text-[color:var(--color-ink)]">
                {COUNTRIES.length} countries — first edition.
              </p>
            </div>
            <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Selected by inbound demand from US-headquartered clients with
              global workforces. New countries added quarterly; ad-hoc
              jurisdictions handled on a case-by-case basis with the same
              chain-of-custody discipline.
            </p>
          </div>
        }
      />

      {/* 02 — Country selector */}
      <section
        id="countries"
        data-testid="international-country-selector"
        className="bg-[color:var(--color-paper-soft)] scroll-mt-24"
      >
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-12 gap-x-8 gap-y-6 items-end mb-10">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — Country selector</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Pick a country to see the standard package.
              </h2>
              <p className="mt-5 max-w-3xl text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Each country has its own quirks — consent posture, criminal-record
                source, education registrar, and a turnaround range that reflects
                how long the issuing authority actually takes.
              </p>
            </div>
          </div>

          {REGIONS.map((region) => {
            const countriesInRegion = COUNTRIES.filter((c) => c.region === region);
            if (countriesInRegion.length === 0) return null;
            return (
              <div key={region} className="mb-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)] mb-3">
                  {region}
                </p>
                <div className="flex flex-wrap gap-2">
                  {countriesInRegion.map((c) => {
                    const isSelected = c.iso2 === selected;
                    return (
                      <button
                        key={c.iso2}
                        type="button"
                        onClick={() => setSelected(c.iso2)}
                        data-testid={`international-country-${c.iso2}`}
                        aria-pressed={isSelected}
                        className={
                          isSelected
                            ? "inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-4 py-1.5 text-[13px] font-medium text-white"
                            : "inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-[13px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-tint)] hover:border-[color:var(--color-accent-halo)] transition-colors"
                        }
                      >
                        <span className="font-mono text-[10px] uppercase opacity-70">
                          {c.iso2}
                        </span>
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 03 — Selected country detail panel */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — {country.name}</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                Region
              </p>
              <p className="mt-1 text-[15px] text-[color:var(--color-ink)]">
                {country.region}
              </p>
              <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                Turnaround
              </p>
              <p className="mt-1 text-[15px] text-[color:var(--color-ink)]">
                {country.turnaround}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Standard package — {country.name}.
              </h2>

              <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                Checks we run
              </p>
              <ul className="mt-3 grid sm:grid-cols-2 gap-3 max-w-3xl">
                {country.checks.map((c) => (
                  <li
                    key={c}
                    className="rounded-[12px] border border-border bg-white p-4 text-[14px] leading-[1.65] text-[color:var(--color-ink)]"
                  >
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-3xl">
                <div className="rounded-[14px] border border-border bg-[color:var(--color-paper-soft)] p-5">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Candidate consent
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink)]">
                    {country.consent}
                  </p>
                </div>
                <div className="rounded-[14px] border border-border bg-[color:var(--color-paper-soft)] p-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                    Operational note
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink)]">
                    {country.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — How international screens work */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — How it works</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                One desk, many jurisdictions.
              </h2>
              <p className="mt-6 max-w-3xl text-[15.5px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                Every international screen runs through a single specialist
                desk in Prosper, Texas, with in-country research partners we
                have vetted under the same accuracy and chain-of-custody
                standard our domestic checks meet. The candidate sees one
                consent flow, the employer sees one report, and the dispute
                process — when it is needed — runs through the same desk
                that ordered the original record.
              </p>
              <p className="mt-4 max-w-3xl text-[15.5px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                Consent posture is calibrated per jurisdiction: GDPR plus the
                local statute in EMEA, PIPEDA in Canada (with a Quebec Law 25
                layer where applicable), LFPDPPP in Mexico, the Digital
                Personal Data Protection Act 2023 in India. We do not run a
                single global consent template — that is a shortcut that
                fails under audit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}

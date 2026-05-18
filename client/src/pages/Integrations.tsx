/*
  Editorial Calm — Integrations / ATS page
  Layout:
   - PageHero with eyebrow "Integrations" and italic accent on "tools".
   - "How it works" 3-step horizontal flow (Connect → Trigger → Sync) using
     the same DiagramCard cadence as the homepage workflow.
   - ATS / HRIS / Payroll grid: card per integration with category chip,
     short body, and "Docs" / "Request" inline link.
   - Closing CTA strip.
*/
import { Link } from "wouter";
import { Plug, Zap, RefreshCcw, ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { IntegrationsGrid } from "@/components/heroes/HeroCards";
import HeroMiniStats from "@/components/heroes/HeroMiniStats";
import integrationsData from "@shared/integrations.json";

type IntegrationCategory = "ATS" | "HRIS" | "Payroll" | "CRM";
type IntegrationStatus = "Live" | "Beta" | "Request";
type IntegrationItem = {
  name: string;
  mark: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  body: string;
};
const INTEGRATIONS: IntegrationItem[] = (
  integrationsData as { items: IntegrationItem[] }
).items;

const STEPS = [
  {
    icon: <Plug className="size-4" strokeWidth={1.5} />,
    number: "01",
    title: "Connect",
    body:
      "Two-way OAuth with your ATS / HRIS in under 5 minutes. No engineering tickets, no SFTP files.",
  },
  {
    icon: <Zap className="size-4" strokeWidth={1.5} />,
    number: "02",
    title: "Trigger",
    body:
      "Move a candidate to a stage and a screening package fires automatically — with the right disclosures attached.",
  },
  {
    icon: <RefreshCcw className="size-4" strokeWidth={1.5} />,
    number: "03",
    title: "Sync",
    body:
      "Status, completed reports, and adjudication decisions write back to your ATS in real time.",
  },
];

const CATS = ["All", "ATS", "HRIS", "Payroll", "CRM"] as const;

export default function Integrations() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="02 — Integrations"
        title={
          <>
            Plug Rapid Hire into the{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              tools you already use.
            </span>
          </>
        }
        lede="From day-one ATS triggers to writing adjudication decisions back into your HRIS, our integrations turn the screening step from a manual hand-off into a quiet background process."
        visual={<IntegrationsGrid />}
        belowVisual={<HeroMiniStats page="integrations" />}
      />

      {/* How it works */}
      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — How integrations work</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[32px] md:text-[48px] leading-[1.05] tracking-[-0.025em] text-[color:var(--color-ink)] max-w-3xl">
                Three steps. Then it{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  runs itself.
                </span>
              </h2>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-6 reveal-on-scroll">
            {STEPS.map((s) => (
              <div
                key={s.number}
                data-testid={`integrations-step-${s.number}`}
                className="group hover-lift-card hover-lift-card-strong col-span-12 md:col-span-4 rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6 md:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center size-8 rounded-full border border-border text-[color:var(--color-accent-ink)] bg-white transition-colors duration-300 ease-out group-hover:bg-[color:var(--color-tint)] group-hover:border-[color:var(--color-accent-halo)]">
                    {s.icon}
                  </span>
                  <span className="eyebrow">{s.number} · Step</span>
                </div>
                <h3 className="mt-4 font-display text-[22px] leading-tight text-[color:var(--color-ink)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §123 — Restored: user's portrait infographic at the §121 layout
          (4-col copy + 8-col figure, max-w-[560px], paper-bg figure mat).
          Replaces the §122 editorial portrait — user feedback was that
          the original infographic read better in the page's center even
          if it carries embedded type. */}
      <section className="bg-[color:var(--color-paper-soft)] border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-start">
            <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
              <p className="eyebrow">04 — The handshake</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-6 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                One picture of the whole{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  data flow.
                </span>
              </h2>
              <p className="mt-5 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                ATS/HRIS on one side, our screening engine on the other,
                with a secure handshake in the middle. The candidate is
                added once in your system of record, and the rest — identity,
                criminal records, employment, and education verification —
                rides through the integration without manual re-entry.
              </p>
              <p className="mt-3 text-[12.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                SOC 2 Type II · GDPR-aligned · end-to-end encrypted in transit
                and at rest.
              </p>
            </div>
            <div
              data-testid="integrations-handshake-figure"
              className="col-span-12 lg:col-span-8 reveal-on-scroll"
            >
              <figure className="mx-auto max-w-[560px] overflow-hidden rounded-[20px] border border-border bg-[color:var(--color-paper)] p-3 shadow-[0_1px_2px_rgba(16,42,75,0.08),0_12px_32px_-16px_rgba(16,42,75,0.22)]">
                <img
                  src="/manus-storage/integrations-infographic_ad1c2dd4.png"
                  alt="Vertical infographic showing how Rapid Hire integrates with ATS and HRIS systems: candidate hire → secure data sync → background check software running identity verification, criminal records, employment verification, and education verification, with status updates flowing back into the ATS/HRIS, ending in saved time, reduced risk, improved efficiency, and a better candidate experience. Footer notes SOC 2 Type II, GDPR compliance, and end-to-end encryption."
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-[14px]"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations grid */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Available today</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.025em] text-[color:var(--color-ink)]">
                Native integrations across{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  every category.
                </span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {CATS.map((c) => (
                  <span
                    key={c}
                    className="text-[11.5px] tracking-wide uppercase rounded-full border border-border bg-white px-3 py-1.5 text-[color:var(--color-ink-muted)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-6">
            {INTEGRATIONS.map((it, i) => (
              <article
                key={it.name}
                className={[
                  "hover-lift-card reveal-on-scroll group rounded-[16px] border border-border bg-white p-6",
                  i % 6 === 0
                    ? "col-span-12 md:col-span-6 lg:col-span-4"
                    : "col-span-12 md:col-span-6 lg:col-span-4",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center size-9 rounded-full border border-border text-[color:var(--color-accent-ink)] font-display text-[15px]">
                      {it.name.charAt(0)}
                    </div>
                    <span className="eyebrow text-[10px]">{it.category}</span>
                  </div>
                  <span
                    className={[
                      "text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full border",
                      it.status === "Live"
                        ? "border-[color:var(--color-accent-ink)]/25 text-[color:var(--color-accent-ink)] bg-[color:var(--color-tint)]"
                        : it.status === "Beta"
                        ? "border-border text-[color:var(--color-ink-muted)] bg-[color:var(--color-paper)]"
                        : "border-border text-[color:var(--color-ink-muted)] bg-white",
                    ].join(" ")}
                  >
                    {it.status}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[22px] leading-tight text-[color:var(--color-ink)]">
                  {it.name}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {it.body}
                </p>
                <Link
                  href="/contact"
                  className="ink-link mt-5 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
                >
                  {it.status === "Request" ? "Request access" : "Talk to sales"}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-border">
        <div className="container py-20">
          <div className="reveal-on-scroll grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-8">
              <p className="eyebrow">Don&apos;t see your tool?</p>
              <h2 className="mt-3 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                We&apos;ll build the integration.{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  Just ask.
                </span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:justify-end">
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Request an integration
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

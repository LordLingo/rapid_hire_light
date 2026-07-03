import { Link } from "wouter";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";

const BASE = "https://www.rapidhiresolutions.com";

const steps = [
  {
    number: "01",
    title: "Map your current packages",
    body:
      "Start by listing the checks, add-ons, volume tiers, candidate messages, and billing rules your current provider uses today.",
  },
  {
    number: "02",
    title: "Match the workflow",
    body:
      "Build equivalent packages in Rapid Hire Solutions so hiring teams do not have to relearn every order path on day one.",
  },
  {
    number: "03",
    title: "Move the right teams first",
    body:
      "Pilot one office, client, or role type before rolling the new screening workflow across the whole organization.",
  },
];

const evaluation = [
  "Compare real turnaround by package and role, not just advertised averages.",
  "Check how support works when a report blocks a start date or placement.",
  "Confirm the candidate disclosure, authorization, dispute, and adverse-action flow before migration.",
  "Review sample reports so hiring managers know exactly what will change.",
  "Plan ATS or HRIS handoffs early so recruiters do not lose status visibility during the switch.",
];

const sourceLinks = [
  { label: "Background check company alternative", href: "/background-check-company-alternative" },
  { label: "Best provider buyer guide", href: "/best-background-check-provider" },
  { label: "Pricing", href: "/pricing" },
  { label: "Integrations", href: "/integrations" },
  { label: "Sample report", href: "/sample-report" },
  { label: "Trust & verification", href: "/trust" },
];

export default function SwitchProviders() {
  useSeo({
    title: "Switch Background Check Providers · Rapid Hire Solutions",
    description:
      "A practical guide for employers and staffing teams that want to switch background check providers without disrupting hiring.",
    canonical: `${BASE}/switch-background-check-providers`,
    image: `${BASE}/static/rhs5-og-card.png`,
    keywords: [
      "switch background check providers",
      "background check provider migration",
      "employment screening provider alternative",
      "Rapid Hire Solutions",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Switch Background Check Providers",
      url: `${BASE}/switch-background-check-providers`,
      description:
        "A buyer guide for employers and staffing teams planning a move from one employment screening provider to another.",
      isPartOf: {
        "@type": "WebSite",
        name: "Rapid Hire Solutions",
        url: BASE,
      },
      about: {
        "@type": "Service",
        name: "Employment background screening provider migration",
        provider: {
          "@type": "Organization",
          name: "Rapid Hire Solutions",
          url: BASE,
        },
      },
    },
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="Switch providers"
        title={
          <>
            Switch background check providers without slowing down{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">your hiring team.</span>
          </>
        }
        lede="A practical migration page for employers, staffing companies, and HR teams that are ready to compare providers, protect candidate flow, and move screening work with less disruption."
      />

      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-20 grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow">Answer-ready summary</p>
            <h2 className="mt-4 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
              The safest switch is a controlled migration, not a rip-and-replace.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-[18px] border border-border bg-[color:var(--color-paper-soft)] p-6 md:p-8 paper-shadow">
              <p className="text-[17px] leading-[1.75] text-[color:var(--color-ink)]">
                Employers usually switch background check providers because they need faster support, clearer pricing, better recruiter workflows, or a more practical fit for high-volume hiring. Rapid Hire Solutions helps buyers compare their current setup, rebuild packages, review sample reports, and plan a controlled rollout before changing the whole organization.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="rounded-full bg-[color:var(--color-accent-ink)] px-5 py-2.5 text-sm font-medium text-white" href="/get-a-quote">
                  Compare your setup
                </Link>
                <Link className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)]" href="/background-check-company-alternative">
                  See alternative guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-16 md:py-20 grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow">Migration path</p>
            <h2 className="mt-4 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
              Three steps before you move live hiring volume.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-7 grid gap-4">
            {steps.map((step) => (
              <article key={step.number} className="rounded-[18px] border border-border bg-white p-6 paper-shadow">
                <p className="eyebrow">{step.number}</p>
                <h3 className="mt-3 font-display text-[24px] leading-[1.15] tracking-[-0.01em] text-[color:var(--color-ink)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-20 grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow">What to compare</p>
            <ul className="mt-6 grid gap-4">
              {evaluation.map((item) => (
                <li key={item} className="rounded-[16px] border border-border bg-[color:var(--color-paper-soft)] p-5 text-[15.5px] leading-[1.7] text-[color:var(--color-ink-soft)] paper-shadow">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow">Useful source pages</p>
            <div className="mt-6 grid gap-3">
              {sourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-[14px] border border-border bg-white px-5 py-4 text-[15px] text-[color:var(--color-ink)] transition hover:border-[color:var(--color-accent-ink)]"
                >
                  <span>{link.label}</span>
                  <span className="text-[color:var(--color-accent-ink)] transition group-hover:translate-x-0.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

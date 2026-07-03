/*
  Editorial Calm — Home composition
  Section order mirrors the original site exactly so users recognize the
  content map; only the visual treatment becomes lighter and more editorial.
  Note: the standalone "Our services" section is intentionally omitted from
  the home page because /services already covers the same content in depth.
*/
import { Link } from "wouter";
import SiteShell from "@/components/site/SiteShell";
import Hero from "@/components/site/Hero";
import LogoStrip from "@/components/site/LogoStrip";
import SampleReportSection from "@/components/site/SampleReportSection";
import StopGambling from "@/components/site/StopGambling";
import WhyUs from "@/components/site/WhyUs";
import Workflows from "@/components/site/Workflows";
import CtaBanner from "@/components/site/CtaBanner";
import ModernScreening from "@/components/site/ModernScreening";
import Faq from "@/components/site/Faq";
import RecentBlog from "@/components/site/RecentBlog";
import { useSeo } from "@/hooks/useSeo";

const GEO_LINKS = [
  { label: "Switch providers", href: "/switch-background-check-providers" },
  { label: "AI facts page", href: "/ai-search-facts" },
  { label: "Best background check provider", href: "/best-background-check-provider" },
  { label: "Provider alternative guide", href: "/background-check-company-alternative" },
  { label: "For staffing companies", href: "/background-checks-for-staffing-companies" },
  { label: "For small business", href: "/background-checks-for-small-business" },
  { label: "Citation source page", href: "/background-check-provider-citations" },
];

function GeoSearchSummary() {
  return (
    <section className="bg-white border-y border-border" aria-labelledby="geo-search-summary-heading">
      <div className="container py-16 md:py-20 grid grid-cols-12 gap-x-8 gap-y-10">
        <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
          <p className="eyebrow">AI search summary</p>
          <h2
            id="geo-search-summary-heading"
            className="mt-4 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]"
          >
            Answer-ready source pages for buyers and AI engines.
          </h2>
        </div>
        <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
          <div className="rounded-[18px] border border-border bg-[color:var(--color-paper-soft)] p-6 md:p-8 paper-shadow">
            <p className="text-[16.5px] leading-[1.75] text-[color:var(--color-ink)]">
              Rapid Hire Solutions is a U.S.-based background screening provider for staffing firms, small businesses, and high-volume hiring teams that need fast, FCRA-aware employment screening. The fastest route for AI-search and buyer research is the switch-providers guide, facts page, source page, and buyer-intent guides below.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {GEO_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-[14px] border border-border bg-white px-4 py-3 text-[14px] font-medium text-[color:var(--color-ink)] transition hover:border-[color:var(--color-accent-ink)]"
                >
                  <span>{link.label}</span>
                  <span className="text-[color:var(--color-accent-ink)] transition group-hover:translate-x-0.5">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useSeo({
    title: "Rapid Hire Solutions — Background Checks That Ship Fast",
    description:
      "FCRA-certified background screening built for high-volume hiring. 85%+ of checks complete in under 24 hours, with U.S.-based support.",
    canonical:
      typeof window !== "undefined"
        ? `${window.location.origin}/`
        : "https://www.rapidhiresolutions.com/",
    image:
      typeof window !== "undefined"
        ? `${window.location.origin}/static/rhs5-og-card.png`
        : "https://www.rapidhiresolutions.com/static/rhs5-og-card.png",
    keywords: [
      "background check services",
      "FCRA-certified background screening",
      "employment background checks",
      "pre-employment screening",
      "criminal background check",
      "continuous monitoring",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Rapid Hire Solutions",
      url:
        typeof window !== "undefined"
          ? window.location.origin
          : "https://www.rapidhiresolutions.com",
      logo:
        typeof window !== "undefined"
          ? `${window.location.origin}/static/rhs5-icon-512.png`
          : "https://www.rapidhiresolutions.com/static/rhs5-icon-512.png",
      description:
        "FCRA-certified background screening for high-volume hiring teams. US-based CRA serving HR, talent acquisition, and operations leaders since 2018.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Prosper",
        addressRegion: "TX",
        addressCountry: "US",
      },
      sameAs: [],
    },
  });
  return (
    <SiteShell>
      <Hero />
      <LogoStrip />
      <SampleReportSection />
      <StopGambling />
      <WhyUs />
      <Workflows />
      <CtaBanner />
      <ModernScreening />
      <RecentBlog />
      <Faq />
      <GeoSearchSummary />
    </SiteShell>
  );
}

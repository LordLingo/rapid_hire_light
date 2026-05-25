/*
  Editorial Calm — Home composition
  Section order mirrors the original site exactly so users recognize the
  content map; only the visual treatment becomes lighter and more editorial.
  Note: the standalone "Our services" section is intentionally omitted from
  the home page because /services already covers the same content in depth.
*/
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

export default function Home() {
  useSeo({
    title: "Rapid Hire Solutions \u2014 Background Checks That Ship Fast",
    description:
      "FCRA-certified background screening built for high-volume hiring. 85%+ of checks complete in under 24 hours, with U.S.-based support.",
    canonical:
      typeof window !== "undefined"
        ? `${window.location.origin}/`
        : "https://rapidhiresolutions.com/",
    image:
      typeof window !== "undefined"
        ? `${window.location.origin}/static/rhs-og-card.png`
        : "https://rapidhiresolutions.com/static/rhs-og-card.png",
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
          : "https://rapidhiresolutions.com",
      logo:
        typeof window !== "undefined"
          ? `${window.location.origin}/static/rhs-icon-512.png`
          : "https://rapidhiresolutions.com/static/rhs-icon-512.png",
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
    </SiteShell>
  );
}

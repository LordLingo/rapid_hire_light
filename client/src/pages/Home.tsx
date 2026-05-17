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

export default function Home() {
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

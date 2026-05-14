/*
  Editorial Calm — Home composition
  Section order mirrors the original site exactly so users recognize the
  content map; only the visual treatment becomes lighter and more editorial.
*/
import SiteShell from "@/components/site/SiteShell";
import Hero from "@/components/site/Hero";
import LogoStrip from "@/components/site/LogoStrip";
import StopGambling from "@/components/site/StopGambling";
import WhyUs from "@/components/site/WhyUs";
import Workflows from "@/components/site/Workflows";
import Services from "@/components/site/Services";
import CtaBanner from "@/components/site/CtaBanner";
import ModernScreening from "@/components/site/ModernScreening";
import Faq from "@/components/site/Faq";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <LogoStrip />
      <StopGambling />
      <WhyUs />
      <Workflows />
      <Services />
      <CtaBanner />
      <ModernScreening />
      <Faq />
    </SiteShell>
  );
}

/*
  Editorial Calm — Home composition
  Section order mirrors the original site exactly so users recognize the
  content map; only the visual treatment becomes lighter and more editorial.
*/
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import LogoStrip from "@/components/site/LogoStrip";
import StopGambling from "@/components/site/StopGambling";
import WhyUs from "@/components/site/WhyUs";
import Workflows from "@/components/site/Workflows";
import Services from "@/components/site/Services";
import CtaBanner from "@/components/site/CtaBanner";
import ModernScreening from "@/components/site/ModernScreening";
import Faq from "@/components/site/Faq";
import Footer from "@/components/site/Footer";
import { useReveal } from "@/hooks/useReveal";

export default function Home() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <LogoStrip />
        <StopGambling />
        <WhyUs />
        <Workflows />
        <Services />
        <CtaBanner />
        <ModernScreening />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

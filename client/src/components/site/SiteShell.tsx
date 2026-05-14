/*
  Editorial Calm — site shell
  Wraps every page with the shared Header + Footer and resets scroll on
  route change. Keeps the reveal-on-scroll observer live for any reveal
  classes used inside child pages.
*/
import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "./Header";
import Footer from "./Footer";
import { useReveal } from "@/hooks/useReveal";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  useReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

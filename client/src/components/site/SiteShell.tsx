/*
  Editorial Calm — site shell
  Wraps every page with the shared Header + Footer.
  - Smooth page-transition crossfade + lift on route change (CSS keyframe via
    .page-transition class, keyed by location so it replays per page).
  - Re-runs the reveal-on-scroll observer when the route changes so newly-
    mounted sections get observed.
  - Resets scroll to top on route change.
*/
import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "./Header";
import Footer from "./Footer";
import ChatLauncher from "./ChatLauncher";
import { useReveal } from "@/hooks/useReveal";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  useReveal(location);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* `key` forces React to remount the wrapper on every route change,
            which restarts the .page-transition keyframe animation. */}
        <div key={location} className="page-transition">
          {children}
        </div>
      </main>
      <Footer />
      {/* §83: floating sales chat launcher (hidden on /contact + /support). */}
      <ChatLauncher />
    </div>
  );
}

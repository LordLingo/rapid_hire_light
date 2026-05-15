/*
  Editorial Calm — header
  Hairline rules, ink wordmark, sparse nav, single ink-cobalt CTA.
  Does NOT replicate the dark utility bar with bright pills; the
  HIPAA / SOC 2 trust signals live as quiet small-caps eyebrow text.
*/
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

// Header brand mark for the light surface. Color logo provided by the brand
// owner. Hosted on the webdev static host so it doesn't bloat the bundle and
// survives across deploys; if it ever changes, just re-upload and update the
// URL constant below (and the headerLogo test that pins it).
const HEADER_LOGO_URL = "/manus-storage/rhs-color-logo_038dbc01.png";

type NavItem = { label: string; href: string; type: "route" | "placeholder" };

const NAV: NavItem[] = [
  { label: "Services", href: "/services", type: "route" },
  { label: "Integrations", href: "/integrations", type: "route" },
  { label: "Pricing", href: "/pricing", type: "route" },
  { label: "Support", href: "/support", type: "route" },
  { label: "Contact Us", href: "/contact", type: "route" },
  { label: "Client Login", href: "#login", type: "placeholder" },
  { label: "Blog", href: "/blog", type: "route" },
];

function notImplemented(label: string) {
  toast(`${label} — coming soon in this preview`, { duration: 2400 });
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled
          ? "bg-[color:var(--color-paper)]/85 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      {/* Trust strip */}
      <div className="container">
        <div className="flex items-center justify-between gap-6 py-2.5 text-[11px]">
          <div className="hidden md:flex items-center gap-5 eyebrow">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
              HIPAA Compliant
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
              SOC 2 Compliant
            </span>
          </div>
          <div className="ml-auto eyebrow text-[color:var(--color-ink-muted)]">
            Made for high-volume hiring
          </div>
        </div>
        <div className="hairline" />
      </div>

      {/* Main nav */}
      <div className="container">
        <div className="flex items-center justify-between gap-6 py-4 md:py-5">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Rapid Hire Solutions home"
          >
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) =>
              item.type === "route" ? (
                <NavLink key={item.label} href={item.href}>
                  {item.label}
                </NavLink>
              ) : (
                <button
                  key={item.label}
                  onClick={() => notImplemented(item.label)}
                  className="ink-link text-[13.5px] tracking-tight text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden md:inline-flex btn-press items-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]"
            >
              Get a Quote
              <span aria-hidden>→</span>
            </Link>
            <button
              className="lg:hidden grid place-items-center size-10 rounded-full border border-border"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open navigation"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="lg:hidden border-t border-border bg-[color:var(--color-paper)]">
          <div className="container py-5 grid gap-3">
            {NAV.map((item) =>
              item.type === "route" ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-[15px] py-1.5 text-[color:var(--color-ink-soft)]"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    notImplemented(item.label);
                  }}
                  className="text-left text-[15px] py-1.5 text-[color:var(--color-ink-soft)]"
                >
                  {item.label}
                </button>
              )
            )}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 btn-press inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [location] = useLocation();
  const active = location === href;
  return (
    <Link
      href={href}
      className={[
        "ink-link text-[13.5px] tracking-tight transition-colors",
        active
          ? "text-[color:var(--color-ink)]"
          : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function Logo() {
  // Native <img> with locked intrinsic ratio so the supplied color lockup
  // (mark + "RAPID HIRE / SOLUTIONS" wordmark) sits cleanly in the header at
  // every breakpoint. Heights are chosen to keep the lockup at the same
  // visual weight as the previous text-only mark (~34px high on desktop).
  return (
    <img
      src={HEADER_LOGO_URL}
      alt="Rapid Hire Solutions"
      width={210}
      height={140}
      decoding="async"
      fetchPriority="high"
      draggable={false}
      className="block h-14 sm:h-16 lg:h-20 w-auto select-none"
    />
  );
}

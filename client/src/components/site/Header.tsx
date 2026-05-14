/*
  Editorial Calm — header
  Hairline rules, ink wordmark, sparse nav, single ink-cobalt CTA.
  Does NOT replicate the dark utility bar with bright pills; the
  HIPAA / SOC 2 trust signals live as quiet small-caps eyebrow text.
*/
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { label: "Pricing", href: "#pricing" },
  { label: "Services", href: "#services" },
  { label: "Integrations", href: "#workflows" },
  { label: "Site Info", href: "#why" },
  { label: "Contact Us", href: "#contact" },
  { label: "Client Login", href: "#login" },
  { label: "Blog", href: "#blog" },
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
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label="Rapid Hire Solutions home"
          >
            <Logo />
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="ink-link text-[13.5px] tracking-tight text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => notImplemented("Get A Quote")}
              className="hidden md:inline-flex btn-press items-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]"
            >
              Get a Quote
              <span aria-hidden>→</span>
            </button>
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
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[15px] py-1.5 text-[color:var(--color-ink-soft)]"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                notImplemented("Get A Quote");
              }}
              className="mt-2 btn-press inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <span className="inline-flex items-center gap-3">
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden
        className="text-[color:var(--color-accent-ink)]"
      >
        <circle cx="17" cy="17" r="16.25" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <path
          d="M9 21c2.5-3 4.5-4.5 8-4.5s5.5 1.5 8 4.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M11 16c1.7-2 3.4-3 6-3s4.3 1 6 3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M13 11.5c1-1 2.2-1.6 4-1.6s3 0.6 4 1.6"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[18px] tracking-[-0.01em] text-[color:var(--color-ink)]">
          Rapid Hire
        </span>
        <span className="eyebrow mt-1 text-[9px]">Solutions</span>
      </span>
    </span>
  );
}

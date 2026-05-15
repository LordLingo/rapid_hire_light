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
import { BRAND_NAME, HEADER_LOGO_URL } from "@shared/brand";

type NavItem = { label: string; href: string; type: "route" | "placeholder" };

const NAV: NavItem[] = [
  { label: "Services", href: "/services", type: "route" },
  { label: "Integrations", href: "/integrations", type: "route" },
  { label: "Pricing", href: "/pricing", type: "route" },
  { label: "Support", href: "/support", type: "route" },
  { label: "Compliance", href: "/compliance", type: "route" },
  { label: "Contact Us", href: "/contact", type: "route" },
  { label: "Client Login", href: "#login", type: "placeholder" },
  { label: "Blog", href: "/blog", type: "route" },
];

function notImplemented(label: string) {
  toast(`${label} — coming soon in this preview`, { duration: 2400 });
}

/*
  §46: active-route helper.

  Returns true when the current pathname matches `href` exactly or
  is a deep child of `href` (e.g. /blog/some-post should still mark
  the Blog nav item as active). Exported for vitest pinning.
*/
export function isActivePath(location: string, href: string): boolean {
  if (location === href) return true;
  if (href === "/") return location === "/";
  return location.startsWith(href + "/");
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
      data-scrolled={scrolled ? "true" : undefined}
      className={[
        "sticky top-0 z-40 w-full transition-[colors,box-shadow] duration-300 ease-out",
        // §48: once the page is scrolled past ~12px the header floats with a
        // soft downward shadow so the active-link underline reads against
        // content underneath. The shadow is intentionally subtle so it
        // never competes with the page's editorial calm at rest.
        scrolled
          ? "bg-[color:var(--color-paper)]/85 backdrop-blur-md border-b border-border shadow-[0_4px_18px_-8px_rgba(15,23,42,0.18)]"
          : "bg-transparent border-b border-transparent shadow-none",
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
            aria-label={`${BRAND_NAME} home`}
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
            {/* Brand mark stays visible inside the open sheet so users
                always know whose nav they're inside on small screens.
                Smaller than the desktop lockup so it doesn't crowd the
                stacked links below. */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label={`${BRAND_NAME} home`}
              className="-mt-1 mb-1 inline-flex items-center self-start"
            >
              <img
                src={HEADER_LOGO_URL}
                alt={BRAND_NAME}
                width={210}
                height={140}
                decoding="async"
                draggable={false}
                className="block h-12 w-auto select-none"
              />
            </Link>
            <div className="hairline" aria-hidden />
            {NAV.map((item) =>
              item.type === "route" ? (
                <MobileNavLink
                  key={item.label}
                  href={item.href}
                  onNavigate={() => setOpen(false)}
                >
                  {item.label}
                </MobileNavLink>
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

/*
  §46: desktop NavLink with active-route indicator.

  When active, the link bumps to medium weight + ink color and gets
  a brand-blue 2px hairline underline rendered as an absolutely
  positioned span 6px below the baseline. Rendering the underline
  as an absolute child instead of a `border-bottom` keeps the link's
  vertical metrics identical between active and inactive states, so
  the nav row never shifts when the user navigates.
*/
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const active = isActivePath(location, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : undefined}
      className={[
        "ink-link relative text-[13.5px] tracking-tight transition-colors",
        active
          ? "font-medium text-[color:var(--color-ink)]"
          : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
      ].join(" ")}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 -bottom-1.5 h-[2px] rounded-full bg-[color:var(--color-accent-ink)]"
        />
      )}
    </Link>
  );
}

/*
  §46: mobile drawer nav link with active-route indicator.

  On mobile the underline pattern doesn't read well because the
  links are stacked vertically and full-width. Use a left-edge
  brand-blue rail instead, plus medium weight + ink color, to
  communicate the active page without changing vertical metrics.
*/
function MobileNavLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  const [location] = useLocation();
  const active = isActivePath(location, href);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : undefined}
      className={[
        "relative text-[15px] py-1.5 pl-3 -ml-3 transition-colors",
        active
          ? "font-medium text-[color:var(--color-ink)]"
          : "text-[color:var(--color-ink-soft)]",
      ].join(" ")}
    >
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[color:var(--color-accent-ink)]"
        />
      )}
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
      alt={BRAND_NAME}
      width={210}
      height={140}
      decoding="async"
      fetchPriority="high"
      draggable={false}
      className="block h-14 sm:h-16 lg:h-20 w-auto select-none"
    />
  );
}

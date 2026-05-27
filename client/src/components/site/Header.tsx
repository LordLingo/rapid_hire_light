/*
  Editorial Calm — header
  Hairline rules, ink wordmark, sparse nav, single ink-cobalt CTA.
  Does NOT replicate the dark utility bar with bright pills; the
  HIPAA / SOC 2 trust signals live as quiet small-caps eyebrow text.

  §79: the standalone "Blog" slot in the primary nav was promoted to a
  "Resources" dropdown that groups four buyer-facing resource pages
  (Blog, 24-point Checklist, Free 15-min Audit, Trust & Verification).
  The trigger lights up as active when any of its children matches the
  current pathname (so a deep /blog/<slug> path still highlights
  Resources). On mobile the group becomes a collapsible accordion
  inside the existing sheet so we keep parity without duplicating
  nav surface.
*/
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { BRAND_NAME, HEADER_LOGO_URL } from "@shared/brand";
import ConferenceStrip from "@/components/site/ConferenceStrip";
import { SPA_ROUTE } from "@/lib/spa";

type ResourceChild = {
  label: string;
  href: string;
  description: string;
};

type NavItem =
  | { kind: "route"; label: string; href: string }
  | { kind: "placeholder"; label: string }
  | { kind: "group"; label: string; children: ResourceChild[] };

const RESOURCES_CHILDREN: ResourceChild[] = [
  {
    label: "All resources",
    href: "/resources",
    description:
      "The hub: pillar references, practitioner tools, and the latest writing.",
  },
  {
    label: "Background checks by state",
    href: "/resources/background-checks-by-state",
    description:
      "50-state directory and 13 deep-dive state guides for multi-state hiring teams.",
  },
  {
    label: "Ban the Box guide",
    href: "/resources/ban-the-box",
    description:
      "40-row jurisdiction matrix, employer playbook, and FAQ \u2014 updated monthly.",
  },
  {
    label: "Marijuana laws",
    href: "/resources/marijuana-laws",
    description:
      "State-by-state cannabis testing and off-duty protections, current to 2026.",
  },
  {
    label: "Legislative updates",
    href: "/resources/legislative-updates",
    description:
      "Federal, state, and municipal updates with citations and employer actions.",
  },
  {
    label: "White papers",
    href: "/resources/white-papers",
    description:
      "Long-form references for compliance, operations, and industry programs.",
  },
  {
    label: "Case studies",
    href: "/resources/case-studies",
    description:
      "Three industry case studies \u2014 staffing, last-mile logistics, and healthcare \u2014 with metrics and quotes.",
  },
  {
    label: "Learn (videos)",
    href: "/learn",
    description:
      "Short, plain-English video explainers — the four-minute version of every guide on the blog.",
  },
  {
    label: "Subscribe (newsletter)",
    href: "/subscribe",
    description:
      "One short email a week — FCRA, state-law, and drug-testing rulings distilled for hiring teams.",
  },
  {
    label: "Blog",
    href: "/blog",
    description:
      "Compliance how-tos, hiring playbooks, and screening explainers.",
  },
  {
    label: "24-point checklist",
    href: "/compliance/checklist",
    description:
      "Audit your current screening program against FCRA, EEOC, and state law.",
  },
  {
    label: "Free 15-min audit",
    href: "/compliance/audit",
    description:
      "A working session with our compliance desk on the gap that's hurting most.",
  },
  {
    label: "Trust & verification",
    href: "/trust",
    description:
      "SOC 2 Type II, PBSA, FCRA-aligned — the attestation pack for procurement.",
  },
];

const NAV: NavItem[] = [
  { kind: "route", label: "Services", href: "/services" },
  { kind: "route", label: "Why SPA?", href: SPA_ROUTE },
  { kind: "route", label: "Industries", href: "/industries" },
  { kind: "route", label: "Integrations", href: "/integrations" },
  { kind: "route", label: "Pricing", href: "/pricing" },
  { kind: "route", label: "Support", href: "/support" },
  { kind: "route", label: "Compliance", href: "/compliance" },
  { kind: "route", label: "About", href: "/about" },
  { kind: "route", label: "Contact Us", href: "/contact" },
  { kind: "group", label: "Resources", children: RESOURCES_CHILDREN },
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

/*
  §79: a Resources group is "active" when any of its children matches
  the current pathname under the same prefix-aware logic. Exported so
  the §79 vitest pin can verify the deep-blog → Resources link.
*/
export function isActiveGroup(
  location: string,
  children: { href: string }[],
): boolean {
  return children.some((c) => isActivePath(location, c.href));
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
      {/* §139.6 — Site-wide SHRM 2026 announcement strip, placed
           above the trust strip so it's the very first thing every
           visitor sees. Component handles its own visibility (auto-
           hides post-event + per-session dismissal) so this insertion
           is unconditional. */}
      <ConferenceStrip />

      {/* Trust strip — §83 upgrade. The competitor audit found that
           Sterling/HireRight surface 4–6 attestations in their persistent
           top bar; we previously surfaced two. Adding FCRA-certified +
           PBSA-accredited and turning the band into a single Link to
           /trust closes the gap without breaking the editorial-calm
           cadence (still small-caps eyebrow, same hairline divider). */}
      <div className="container">
        <div className="flex items-center justify-between gap-6 py-2.5 text-[11px]">
          <Link
            href="/trust"
            className="hidden md:flex items-center gap-5 eyebrow group"
            data-testid="trust-strip"
          >
            <span className="inline-flex items-center gap-2 group-hover:text-[color:var(--color-accent-ink)] transition-colors">
              <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
              FCRA Certified
            </span>
            <span className="inline-flex items-center gap-2 group-hover:text-[color:var(--color-accent-ink)] transition-colors">
              <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
              SOC 2 Type II
            </span>
            <span className="inline-flex items-center gap-2 group-hover:text-[color:var(--color-accent-ink)] transition-colors">
              <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
              HIPAA Compliant
            </span>
            <span className="inline-flex items-center gap-2 group-hover:text-[color:var(--color-accent-ink)] transition-colors">
              <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
              PBSA Accredited
            </span>
          </Link>
          <div className="ml-auto eyebrow text-[color:var(--color-ink-muted)]">
            Made for high-volume hiring
          </div>
        </div>
        <div className="hairline" />
      </div>

      {/* Main nav */}
      <div className="container">
        <div className="flex items-center justify-between gap-6 py-4 md:py-5">
          {/*
            §194: shrink-0 on the Link wrapper prevents the flex
            algorithm from squeezing the logo to ~12px wide when the
            nav row gets crowded. The template's customized .flex
            default sets min-width: 0 on flex children, so without
            shrink-0 the leftmost flex item (the logo) collapses
            past its content. min-w-fit on the inner <Logo> is a
            belt-and-suspenders backup.
          */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            aria-label={`${BRAND_NAME} home`}
          >
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => {
              if (item.kind === "route") {
                return (
                  <NavLink key={item.label} href={item.href}>
                    {item.label}
                  </NavLink>
                );
              }
              if (item.kind === "group") {
                return (
                  <ResourcesMenu
                    key={item.label}
                    label={item.label}
                    children={item.children}
                  />
                );
              }
              return (
                <button
                  key={item.label}
                  onClick={() => notImplemented(item.label)}
                  className="ink-link text-[13.5px] tracking-tight text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/*
              §60: outlined "Sign in" pill, sibling of Get a Quote.
              §106: now a real anchor pointing at the existing client portal
              at clients.rapidhiresolutions.com. Opens in a new tab so the
              marketing site doesn't lose state, with rel="noopener
              noreferrer" for tab-nabbing protection.
            */}
            <a
              data-testid="header-signin"
              href="https://clients.rapidhiresolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              /* §136: matched to the new Get-a-Quote pill height (text-[13.5px]
                 / py-2.5) so the two CTAs read as siblings of equal weight,
                 with Sign-in clearly the secondary one (transparent fill,
                 hairline border).
              */
              className="hidden md:inline-flex btn-press items-center whitespace-nowrap rounded-full border border-[color:var(--color-border)] bg-transparent px-5 py-2.5 text-[13.5px] font-medium text-[color:var(--color-ink)] transition-colors duration-200 ease-out hover:border-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-soft)]"
            >
              Sign in
            </a>
{/*
  §111: Get a Quote CTAs site-wide point at the dedicated /get-a-quote page (Formspree mvzyoyoz).
  §136: premium-pill treatment.
   - Resting shadow `shadow-[0_2px_8px_-2px_rgba(...)]` lifts the pill
     subtly off the paper background so it reads as the primary action.
   - Hover ramps the shadow + nudges it down 1px, simulating a
     hold-to-press response. Arrow icon translates 2px on hover; a
     small touch but it telegraphs “forward motion”.
   - Transition duration 200ms with ease-out keeps the interaction
     snappy per the design-system animation guide. We avoid `transform:
     scale` here on the resting/hover states because the row sits
     directly under the trust strip and a scaled element would push the
     surrounding nav-row metrics. Translating the arrow inside the pill
     scratches the same itch without affecting layout.
*/}
            <Link
              href="/get-a-quote"
              data-testid="header-get-a-quote"
              className={[
                "hidden md:inline-flex btn-press group/cta items-center gap-2 whitespace-nowrap rounded-full",
                "border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-5 py-2.5",
                "text-[13.5px] font-semibold text-white",
                "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.18)] transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out",
                "hover:bg-[color:var(--color-accent-ink-strong)] hover:border-[color:var(--color-accent-ink-strong)]",
                "hover:shadow-[0_8px_22px_-6px_rgba(15,23,42,0.28)] hover:-translate-y-px",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-[color:var(--color-paper)]",
              ].join(" ")}
            >
              Get a Quote
              <span
                aria-hidden
                className="transition-transform duration-200 ease-out group-hover/cta:translate-x-0.5"
              >
                →
              </span>
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
        /*
          §88: cap the sheet to the viewport and own the scroll inside
          it. Without `overscroll-contain` the wheel/touch event leaks
          to the page behind once the inner list reaches its end (or
          when the sheet content is shorter than the viewport on
          short laptops). The outer wrapper sets the max-height; the
          inner scrollable child does the actual scrolling. `pb-8`
          keeps the bottom CTAs reachable above any iOS safe area.
        */
        <div
          data-testid="header-mobile-sheet"
          className="lg:hidden border-t border-border bg-[color:var(--color-paper)] max-h-[calc(100vh-64px)] overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
        >
          <div className="container py-5 pb-8 grid gap-3">
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
              {/*
                §191: this logo only renders inside the mobile sheet, which
                is closed by default. Marking it loading="lazy" defers the
                fetch until the user actually opens the hamburger menu, so
                we don't pay for it on every mobile pageload.
              */}
              <img
                src={HEADER_LOGO_URL}
                alt={BRAND_NAME}
                width={210}
                height={140}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="block h-16 w-auto select-none"
              />
            </Link>
            <div className="hairline" aria-hidden />
            {NAV.map((item) => {
              if (item.kind === "route") {
                return (
                  <MobileNavLink
                    key={item.label}
                    href={item.href}
                    onNavigate={() => setOpen(false)}
                  >
                    {item.label}
                  </MobileNavLink>
                );
              }
              if (item.kind === "group") {
                return (
                  <MobileResourcesGroup
                    key={item.label}
                    label={item.label}
                    children={item.children}
                    onNavigate={() => setOpen(false)}
                  />
                );
              }
              return (
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
              );
            })}
<Link
              href="/get-a-quote"
              data-testid="header-get-a-quote-mobile"
              onClick={() => setOpen(false)}
              className="mt-2 btn-press inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-ink)] px-5 py-3 text-[14px] font-medium text-white"
            >
              Get a Quote
            </Link>
            {/* §60/§106: mobile counterpart — same client-portal target,
                closes the mobile drawer on click for a clean handoff. */}
            <a
              data-testid="header-signin-mobile"
              href="https://clients.rapidhiresolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-press inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] bg-transparent px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] hover:border-[color:var(--color-ink-soft)]"
            >
              Sign in
            </a>
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
/*
  §136 — Nav menu styling refresh.

  Each NavLink now renders two underline spans:
   - The "active rail" (only mounted when `active`) is the persistent
     2.5px indicator that names the current section. It anchors the
     full width of the link — it isn't an animation, it's a tab
     indicator.
   - The "hover rail" (always mounted on inactive links) is a 2px
     underline that scales-X from 0 to 1 on hover/focus-visible, with
     `transform-origin: center`, so the line grows out from the
     midpoint of the label rather than wiping in from one edge. Uses
     180ms cubic-bezier(0.23, 1, 0.32, 1) per the design-system
     animation guide.
  Typography: 14px / font-medium (slightly heavier than the previous
  13.5px / regular default) for stronger presence in the nav, with
  `tracking-tight`. Active links push to font-semibold so the indicator
  feels reinforced rather than redundant.
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
        // §185 — nav-link choreography upgraded to match the
        // .filter-chip-press / .hero-primary-cta easing curve so the
        // hover feel is consistent across the whole site. Color +
        // transform animate together on the snappy curve; the lift is
        // gated to motion-safe so reduced-motion users never get the
        // translate but do still get the color/rail transitions.
        "nav-link-press group relative whitespace-nowrap text-[14px] tracking-tight",
        active
          ? "font-semibold text-[color:var(--color-ink)]"
          : "font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] focus-visible:text-[color:var(--color-ink)]",
      ].join(" ")}
    >
      {children}
      {active ? (
        <span
          aria-hidden
          data-testid="nav-active-rail"
          className="pointer-events-none absolute left-0 right-0 -bottom-1.5 h-[2.5px] rounded-full bg-[color:var(--color-accent-ink)]"
        />
      ) : (
        <span
          aria-hidden
          data-testid="nav-hover-rail"
          className="pointer-events-none absolute left-0 right-0 -bottom-1.5 h-[2.5px] origin-center rounded-full bg-[color:var(--color-accent-ink)] scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        />
      )}
    </Link>
  );
}

/*
  §79: desktop Resources dropdown.

  Hover/focus-aware. Trigger reads the same as a NavLink but carries
  a chevron. Panel sits below the trigger with paper bg + hairline
  border, an editorial 4-row list, and per-row description copy that
  helps the buyer self-route. Closes on Esc, click-outside, and any
  child link click. Active state on the trigger fires whenever the
  current pathname matches one of the children (so /blog/<slug> still
  lights up Resources).
*/
function ResourcesMenu({
  label,
  children: items,
}: {
  label: string;
  children: ResourceChild[];
}) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const active = isActiveGroup(location, items);

  // Click-outside + Esc.
  useEffect(() => {
    if (!isOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // Small grace delay on mouse leave so the cursor can travel from
  // the trigger to the panel without the menu snapping shut.
  function scheduleClose() {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setIsOpen(false), 140);
  }
  function cancelClose() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setIsOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        data-active={active ? "true" : undefined}
        data-testid="header-resources-trigger"
        onClick={() => setIsOpen((v) => !v)}
        onFocus={() => setIsOpen(true)}
        className={[
          // §136: same typography + animated-rail treatment as NavLink so
          // the trigger reads as a peer of the other items, not as a
          // distinct UI primitive.
          // §185: upgraded to .nav-link-press for shared easing curve
          // and motion-safe lift parity with the rest of the nav.
          "nav-link-press group relative inline-flex items-center gap-1 whitespace-nowrap text-[14px] tracking-tight",
          active
            ? "font-semibold text-[color:var(--color-ink)]"
            : "font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] focus-visible:text-[color:var(--color-ink)]",
        ].join(" ")}
      >
        {label}
        <ChevronDown
          className={[
            "size-3.5 transition-transform duration-200 ease-out",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden
        />
        {active ? (
          <span
            aria-hidden
            data-testid="nav-active-rail"
            className="pointer-events-none absolute left-0 right-4 -bottom-1.5 h-[2.5px] rounded-full bg-[color:var(--color-accent-ink)]"
          />
        ) : (
          <span
            aria-hidden
            data-testid="nav-hover-rail"
            className={[
              "pointer-events-none absolute left-0 right-4 -bottom-1.5 h-[2.5px] origin-center rounded-full bg-[color:var(--color-accent-ink)] transition-transform duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)]",  // §185
              // §136: keep the hover rail expanded while the panel is
              // open so closing it doesn't feel like the link "un-hit".
              isOpen
                ? "scale-x-100"
                : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100",
            ].join(" ")}
          />
        )}
      </button>

      {/*
        Panel. Mounted only when open so we get a clean enter
        transform without a lingering pointer-events surface. Origin
        is top-left so the scale-in reads from the trigger.
      */}
      {isOpen && (
        <div
          role="menu"
          data-testid="header-resources-panel"
          /*
            §88: cap the panel height to the viewport (minus header + a
            small gutter) and confine wheel/touch scroll inside it.
            `overscroll-contain` is the CSS contract that stops the
            wheel/touch event from chaining to the page behind once the
            panel has nothing more to scroll. `[scrollbar-gutter:stable]`
            keeps the layout stable so links don't shift when the
            scrollbar appears.
          */
          className="absolute left-0 top-full z-50 mt-3 w-[360px] max-h-[calc(100vh-160px)] origin-top-left overflow-y-auto overscroll-contain rounded-[18px] border border-border bg-[color:var(--color-paper)] p-2 shadow-[0_18px_42px_-22px_rgba(15,23,42,0.35)] [scrollbar-gutter:stable]"
          style={{
            animation: "resourcesMenuIn 220ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {/* Inline keyframes so the menu doesn't depend on a
              global @keyframes that another section might rename. */}
          <style>{`
            @keyframes resourcesMenuIn {
              0% { opacity: 0; transform: scale(0.97) translateY(-4px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
          <ul className="grid gap-1">
            {items.map((it) => {
              const childActive = isActivePath(location, it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                    aria-current={childActive ? "page" : undefined}
                    data-active={childActive ? "true" : undefined}
                    className={[
                      "block rounded-[12px] px-3.5 py-3 transition-colors",
                      childActive
                        ? "bg-[color:var(--color-paper-soft)]"
                        : "hover:bg-[color:var(--color-paper-soft)]",
                    ].join(" ")}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span
                        className={[
                          "text-[14px] tracking-tight",
                          childActive
                            ? "font-medium text-[color:var(--color-ink)]"
                            : "text-[color:var(--color-ink)]",
                        ].join(" ")}
                      >
                        {it.label}
                      </span>
                      <span className="eyebrow text-[10px] text-[color:var(--color-ink-muted)]">
                        {it.href}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[12.5px] leading-[1.55] text-[color:var(--color-ink-soft)]">
                      {it.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/*
  §79: mobile counterpart to the desktop dropdown.

  In the existing mobile sheet we render Resources as a collapsible
  accordion: tapping the trigger row expands the four child links
  beneath it, indented and rail-marked, matching the existing
  MobileNavLink visual rhythm. Group is auto-expanded when any
  child path is currently active so a deep-link arrival shows the
  right context without a tap.
*/
function MobileResourcesGroup({
  label,
  children: items,
  onNavigate,
}: {
  label: string;
  children: ResourceChild[];
  onNavigate: () => void;
}) {
  const [location] = useLocation();
  const groupActive = isActiveGroup(location, items);
  const [expanded, setExpanded] = useState<boolean>(groupActive);

  return (
    <div className="grid">
      <button
        type="button"
        aria-expanded={expanded}
        data-testid="header-resources-mobile-trigger"
        onClick={() => setExpanded((v) => !v)}
        className={[
          "relative flex items-center justify-between text-left text-[15px] py-1.5 pl-3 -ml-3 transition-colors",
          groupActive
            ? "font-medium text-[color:var(--color-ink)]"
            : "text-[color:var(--color-ink-soft)]",
        ].join(" ")}
      >
        {groupActive && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[color:var(--color-accent-ink)]"
          />
        )}
        <span>{label}</span>
        <ChevronDown
          className={[
            "size-4 transition-transform duration-200 ease-out",
            expanded ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden
        />
      </button>
      {expanded && (
        <div className="mt-1 mb-1 ml-3 grid gap-1 border-l border-border pl-4">
          {items.map((it) => {
            const childActive = isActivePath(location, it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={onNavigate}
                aria-current={childActive ? "page" : undefined}
                data-active={childActive ? "true" : undefined}
                className={[
                  "text-[14px] py-1.5 transition-colors",
                  childActive
                    ? "font-medium text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
                ].join(" ")}
              >
                {it.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
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
        // §185: the mobile nav link gets the same snappy color easing
        // as the desktop NavLink so transitions read consistent across
        // breakpoints. No transform-lift here — vertical drag in a
        // sheet that's already scrollable would feel jittery.
        "relative text-[15px] py-1.5 pl-3 -ml-3 transition-colors duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[color:var(--color-ink)]",
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
      className="block h-16 sm:h-20 lg:h-28 w-auto select-none"
    />
  );
}

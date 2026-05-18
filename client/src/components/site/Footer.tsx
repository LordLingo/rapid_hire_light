/*
  Editorial Calm — footer
  4-column hairline grid: brand mark + tagline | services | company | portals.
  Surface: deep ink-cobalt (--color-footer), warm-white text. Site-wide via SiteShell.
*/
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Rss, ShieldCheck } from "lucide-react";
import { BRAND_NAME, FOOTER_LOGO_URL } from "@shared/brand";
import { isActivePath } from "./Header";

/*
  §107: FooterItem now also supports an external href via `external`.
  Used by "Client Login" to open the existing client portal at
  clients.rapidhiresolutions.com in a new tab. Internal routes still
  use `to` (wouter <Link>); items with neither field fall through to a
  preview-only toast (kept as a developer escape hatch).
*/
type FooterItem = { label: string; to?: string; external?: string };

// §83: each footer service link now resolves to its own detail page
// at /services/<slug>. See client/src/lib/serviceCatalog.ts for the
// shared dataset; the page hub at /services remains the index.
const SERVICES: FooterItem[] = [
  { label: "Criminal Records", to: "/services/criminal-records" },
  { label: "Drug Screening", to: "/services/drug-screening" },
  { label: "MVR", to: "/services/motor-vehicle-records" },
  { label: "Social Background Checks", to: "/services/social-media-screening" },
  { label: "Employment Verification", to: "/services/employment-verification" },
  { label: "Education Checks", to: "/services/education-verification" },
  { label: "Healthcare Sanctions", to: "/services/healthcare-sanctions" },
  { label: "Continuous Monitoring", to: "/services/continuous-monitoring" },
];
const COMPANY: FooterItem[] = [
  { label: "About Us", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Pricing", to: "/pricing" },
  // §69: surface Industries from the global footer alongside the other
  // top-level routes, so procurement teams can reach a sector-specific
  // package without going back through the header.
  { label: "Industries", to: "/industries" },
  { label: "Support", to: "/support" },
  // §66: surface the dedicated compliance funnel from every page so the
  // 24-point checklist (§65) and the free 15-minute audit (§64) are
  // reachable from the global footer, not only the Compliance hero.
  { label: "Compliance", to: "/compliance" },
  // §67: surface the dedicated Trust & verification page (SOC 2 Type II,
  // PBSA, FCRA-aligned) from every page so procurement / vendor-risk
  // teams can reach the attestation pack without going through the
  // Compliance hub first.
  { label: "Trust & verification", to: "/trust" },
  { label: "24-point checklist", to: "/compliance/checklist" },
  { label: "Free 15-min audit", to: "/compliance/audit" },
  // §83: surface candidate self-service + sample-report destination.
  { label: "For candidates", to: "/candidates" },
  { label: "Sample report", to: "/sample-report" },
  { label: "Customer stories", to: "/customers" },
  { label: "Contact", to: "/contact" },
];
const PORTALS: FooterItem[] = [
  // §107: Client Login routes to the existing customer-facing portal.
  { label: "Client Login", external: "https://clients.rapidhiresolutions.com/" },
  // §111: "Get A Quote" routes to the dedicated /get-a-quote page (Formspree mvzyoyoz).
  { label: "Get A Quote", to: "/get-a-quote" },
];

export default function Footer() {
  // §49: read the current pathname so footer column links can mirror
  // the header's active-route indicator. We reuse the exact same
  // `isActivePath` helper from Header.tsx so the prefix-aware match
  // logic stays in one place — a deep /blog/some-post path will
  // light up Blog in both header AND footer.
  const [location] = useLocation();
  return (
    <footer
      className="relative bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
      style={{ colorScheme: "dark" }}
    >
      {/* hairline accent at the top to bridge from light page → dark footer */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, color-mix(in oklch, var(--color-accent-ink) 35%, transparent) 30%, color-mix(in oklch, var(--color-accent-ink) 35%, transparent) 70%, transparent)",
        }}
      />

      <div className="container py-20">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 md:col-span-5 reveal-on-scroll">
            <Link
              href="/"
              aria-label={`${BRAND_NAME} — home`}
              className="inline-flex items-center"
            >
              <img
                src={FOOTER_LOGO_URL}
                alt={BRAND_NAME}
                width={180}
                height={180}
                loading="lazy"
                decoding="async"
                className="block h-auto w-[160px] sm:w-[180px] select-none"
                draggable={false}
              />
            </Link>
            <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[color:var(--color-footer-soft-text)]">
              Scale your hiring team with a platform built for speed,
              compliance, and accurate results that don&apos;t slow you down.
            </p>
            <div className="mt-6 flex items-center gap-3 eyebrow text-[color:var(--color-footer-muted)]">
              <span>HIPAA Compliant</span>
              <span aria-hidden>·</span>
              <span>SOC 2 Compliant</span>
              <span aria-hidden>·</span>
              <span>FCRA</span>
            </div>
          </div>

          <FooterCol title="Services" items={SERVICES} location={location} className="col-span-6 md:col-span-3" />
          <FooterCol title="Company" items={COMPANY} location={location} className="col-span-6 md:col-span-2" />
          <FooterCol title="Portals" items={PORTALS} location={location} className="col-span-6 md:col-span-2" />
        </div>

        {/* social-proof anchor above the bottom bar */}
        <div className="mt-16 pt-8 border-t border-[color:var(--color-footer-border)] flex flex-wrap items-center justify-between gap-4 reveal-on-scroll">
          <p className="flex items-center gap-2.5 font-display text-[18px] sm:text-[20px] tracking-[-0.01em] text-[color:var(--color-footer-foreground)]">
            <span
              aria-hidden
              className="inline-flex size-7 items-center justify-center rounded-full border border-[color:color-mix(in_oklch,var(--color-accent-halo)_45%,transparent)] bg-[color:color-mix(in_oklch,var(--color-accent-halo)_12%,transparent)] text-[color:var(--color-accent-halo)] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--color-accent-halo)_25%,transparent)]"
            >
              <ShieldCheck className="size-4" strokeWidth={2} />
            </span>
            <span>
              Trusted by{" "}
              <span className="text-[color:var(--color-accent-halo)]">800+</span>{" "}
              HR &amp; staffing teams
            </span>
          </p>
          <p className="eyebrow text-[color:var(--color-footer-muted)]">
            Avg. 20-min turnaround · 99.4% on-time SLA
          </p>
        </div>
      </div>
      <div className="border-t border-[color:var(--color-footer-border)]">
        <div className="container py-6 flex flex-wrap items-center justify-between gap-3 eyebrow text-[color:var(--color-footer-muted)]">
          <span>© {new Date().getFullYear()} {BRAND_NAME}</span>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="footer-link text-[color:var(--color-footer-muted)]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="footer-link text-[color:var(--color-footer-muted)]"
            >
              Terms &amp; Conditions
            </Link>
            <a
              href="/blog/feed.xml"
              className="footer-link inline-flex items-center gap-1.5 text-[color:var(--color-footer-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-halo)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer)]"
              aria-label="Subscribe to the blog Atom feed"
              type="application/atom+xml"
            >
              <Rss aria-hidden="true" className="size-3.5" />
              <span>RSS</span>
            </a>
          </div>
          <span>Made for high-volume hiring.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
  location,
  className = "",
}: {
  title: string;
  items: FooterItem[];
  location: string;
  className?: string;
}) {
  return (
    <div className={["reveal-on-scroll", className].join(" ")}>
      <p className="eyebrow text-[color:var(--color-footer-muted)]">{title}</p>
      <ul className="mt-5 grid gap-3">
        {items.map((it) => {
          // §49: mark a routed footer link as active when the current
          // page matches its href (or is a deep child via the shared
          // helper). On the dark footer surface we lift the active item
          // by font-weight and color only — no underline/rail — because
          // a brand-blue stripe would compete with the column rhythm,
          // and the weight + color shift is enough at footer scale.
          const active = it.to ? isActivePath(location, it.to) : false;
          return (
            <li key={it.label}>
              {it.to ? (
                <Link
                  href={it.to}
                  aria-current={active ? "page" : undefined}
                  data-active={active ? "true" : undefined}
                  className={[
                    "footer-link text-[14px]",
                    active
                      ? "font-medium text-[color:var(--color-footer-foreground)]"
                      : "text-[color:var(--color-footer-soft-text)]",
                  ].join(" ")}
                >
                  {it.label}
                </Link>
              ) : it.external ? (
                /*
                  §107: external link — opens in a new tab so the
                  marketing site doesn't lose state, with rel="noopener
                  noreferrer" for tab-nabbing protection.
                */
                <a
                  data-testid={`footer-external-${it.label.toLowerCase().replace(/\s+/g, "-")}`}
                  href={it.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link text-[14px] text-[color:var(--color-footer-soft-text)]"
                >
                  {it.label}
                </a>
              ) : (
                <button
                  onClick={() => toast(`${it.label} — preview only`)}
                  className="footer-link text-[14px] text-[color:var(--color-footer-soft-text)] text-left"
                >
                  {it.label}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

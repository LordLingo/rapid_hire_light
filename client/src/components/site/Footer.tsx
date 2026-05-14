/*
  Editorial Calm — footer
  4-column hairline grid: brand mark + tagline | services | company | portals.
  Items with a `to` route via Wouter Link; otherwise they show a preview toast.
*/
import { Link } from "wouter";
import { toast } from "sonner";

type FooterItem = { label: string; to?: string };

const SERVICES: FooterItem[] = [
  { label: "Background Checks", to: "/services" },
  { label: "Drug Screening", to: "/services" },
  { label: "MVR", to: "/services" },
  { label: "Social Background Checks", to: "/services" },
  { label: "Employment Verification", to: "/services" },
  { label: "Education Checks", to: "/services" },
];
const COMPANY: FooterItem[] = [
  { label: "About Us" },
  { label: "Contact", to: "/contact" },
];
const PORTALS: FooterItem[] = [
  { label: "Client Login" },
  { label: "Get A Quote", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="container py-20">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 md:col-span-5 reveal-on-scroll">
            <Link href="/" className="flex items-center gap-3">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                aria-hidden
                className="text-[color:var(--color-accent-ink)]"
              >
                <circle
                  cx="17"
                  cy="17"
                  r="16.25"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.35"
                />
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
              </svg>
              <span className="font-display text-[20px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                Rapid Hire Solutions
              </span>
            </Link>
            <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Scale your hiring team with a platform built for speed,
              compliance, and accurate results that don&apos;t slow you down.
            </p>
            <div className="mt-6 flex items-center gap-3 eyebrow text-[color:var(--color-ink-muted)]">
              <span>HIPAA Compliant</span>
              <span aria-hidden>·</span>
              <span>SOC 2 Compliant</span>
              <span aria-hidden>·</span>
              <span>FCRA</span>
            </div>
          </div>

          <FooterCol title="Services" items={SERVICES} className="col-span-6 md:col-span-3" />
          <FooterCol title="Company" items={COMPANY} className="col-span-6 md:col-span-2" />
          <FooterCol title="Portals" items={PORTALS} className="col-span-6 md:col-span-2" />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-6 flex flex-wrap items-center justify-between gap-3 eyebrow text-[color:var(--color-ink-muted)]">
          <span>© {new Date().getFullYear()} Rapid Hire Solutions</span>
          <div className="flex items-center gap-5">
            <button
              onClick={() => toast("Privacy Policy — preview only")}
              className="ink-link text-[color:var(--color-ink-muted)]"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => toast("Terms — preview only")}
              className="ink-link text-[color:var(--color-ink-muted)]"
            >
              Terms &amp; Conditions
            </button>
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
  className = "",
}: {
  title: string;
  items: FooterItem[];
  className?: string;
}) {
  return (
    <div className={["reveal-on-scroll", className].join(" ")}>
      <p className="eyebrow">{title}</p>
      <ul className="mt-5 grid gap-3">
        {items.map((it) => (
          <li key={it.label}>
            {it.to ? (
              <Link
                href={it.to}
                className="ink-link text-[14px] text-[color:var(--color-ink-soft)]"
              >
                {it.label}
              </Link>
            ) : (
              <button
                onClick={() => toast(`${it.label} — preview only`)}
                className="ink-link text-[14px] text-[color:var(--color-ink-soft)]"
              >
                {it.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

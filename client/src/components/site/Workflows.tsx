/*
  Editorial Calm — Workflows / Architecture
  Redraws the original dark architecture diagram natively as a 3-column
  light-card flow: System Integrations → RHS Platform (chips) → Outputs.
  Hairline arrows drawn with simple → glyphs and CSS dashed lines.
*/
import {
  Network,
  ServerCog,
  FileCheck2,
  Rocket,
  ClipboardCheck,
  ShieldCheck,
  Target,
  TrendingUp,
  Puzzle,
  Handshake,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const INPUTS = ["ATS", "HRIS", "Staffing CRM", "Online Forms", "Bulk Uploads"];

/*
  Section 44: the eight platform descriptors are now an explicit list
  of [label, icon] tuples instead of a flat string array. They are
  rendered inside the brand-blue PlatformCenterCard as static badges,
  not pill-shaped chips, so they no longer read like clickable buttons.
  Order is locked by `workflowsCenterCard.test.ts` so a future refactor
  can't silently reshuffle them.
*/
const PLATFORM_BADGES: ReadonlyArray<{ label: string; icon: LucideIcon }> = [
  { label: "Speed", icon: Rocket },
  { label: "Comprehensive", icon: ClipboardCheck },
  { label: "Compliant", icon: ShieldCheck },
  { label: "Accurate", icon: Target },
  { label: "Scalable", icon: TrendingUp },
  { label: "Integrated", icon: Puzzle },
  { label: "Trusted", icon: Handshake },
  { label: "Efficient", icon: RefreshCw },
];
const OUTPUTS = [
  {
    title: "Fast, clear reports",
    body: "Readable, mobile-friendly background check results.",
  },
  {
    title: "Compliance audit trail",
    body: "Every status change and document is time-stamped.",
  },
  {
    title: "Client-ready dashboards",
    body: "Give your clients self-service visibility into every order.",
  },
];

export default function Workflows() {
  return (
    <section id="workflows" className="relative bg-[color:var(--color-paper)]">
      <div className="container py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow">04 — Rapid Hire workflows</p>
            <div className="mt-3 hairline" />
          </div>
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
            <h2 className="font-display text-[36px] sm:text-[48px] md:text-[60px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)] max-w-3xl">
              Making compliant hiring and accurate reports{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                non-negotiable.
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-[16.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              See exactly how Rapid Hire Solutions plugs into your existing
              tools, automates background checks, and keeps every hiring
              decision audit-ready.
            </p>
          </div>
        </div>

        {/* Diagram */}
        <div className="mt-16 grid grid-cols-12 gap-6 reveal-on-scroll">
          {/* Left: System integrations */}
          <DiagramCard
            number="01"
            title="System Integrations"
            icon={<Network className="size-4" strokeWidth={1.5} />}
            description="Pull applicant details, packages, and client preferences from the systems you already use."
            className="col-span-12 lg:col-span-3"
          >
            <ul className="mt-5 grid gap-2.5">
              {INPUTS.map((row) => (
                <li
                  key={row}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-white px-3.5 py-2.5 text-[13.5px] text-[color:var(--color-ink-soft)]"
                >
                  <span>{row}</span>
                  <span className="eyebrow text-[10px]">Connected</span>
                </li>
              ))}
            </ul>
          </DiagramCard>

          {/* Connector */}
          <Connector className="hidden lg:flex col-span-1" />

          {/* Center: Platform — dedicated brand-blue card.
             Section 44: previously rendered as a featured DiagramCard
             (white surface, eight pill-shaped chips that read like
             clickable buttons). Now its own component so the surface
             color and badge grid don't poison the shared shell. */}
          <PlatformCenterCard className="col-span-12 lg:col-span-4" />

          {/* Connector */}
          <Connector className="hidden lg:flex col-span-1" />

          {/* Right: Outputs */}
          <DiagramCard
            number="03"
            title="Outputs"
            icon={<FileCheck2 className="size-4" strokeWidth={1.5} />}
            description="Reports and audit-ready artifacts your team and clients can act on instantly."
            className="col-span-12 lg:col-span-3"
          >
            <ul className="mt-5 grid gap-3">
              {OUTPUTS.map((o) => (
                <li
                  key={o.title}
                  className="rounded-md border border-border bg-white px-3.5 py-3"
                >
                  <p className="text-[13.5px] font-medium text-[color:var(--color-ink)]">
                    {o.title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-snug text-[color:var(--color-ink-muted)]">
                    {o.body}
                  </p>
                </li>
              ))}
            </ul>
          </DiagramCard>
        </div>
      </div>
    </section>
  );
}

function DiagramCard({
  number,
  title,
  icon,
  description,
  children,
  className = "",
  featured = false,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        "group hover-lift-card rounded-[16px] border border-border p-5 md:p-6",
        featured
          ? "bg-white paper-shadow"
          : "bg-white/70 backdrop-blur-[2px]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="grid place-items-center size-8 rounded-full border border-border text-[color:var(--color-accent-ink)] transition-colors duration-300 ease-out group-hover:bg-[color:var(--color-tint)] group-hover:border-[color:var(--color-accent-halo)]">
          {icon}
        </span>
        <span className="eyebrow">{number} · Layer</span>
      </div>
      <h3 className="mt-4 font-display text-[22px] leading-tight text-[color:var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[color:var(--color-ink-muted)]">
        {description}
      </p>
      {children}
    </div>
  );
}

/*
  PlatformCenterCard — the brand-blue hero of the workflow stack.

  Section 44 redesign: the user pointed out that the previous version's
  eight pill-shaped chips inside a white DiagramCard made the labels
  read like clickable buttons (they aren't). The new design:

    • Surface: --color-accent-ink (brand blue used on the site's CTAs
      and brand mark), so this card visually anchors the three-card
      stack against the two flanking white DiagramCards.
    • Eyebrow: "02 · Layer" rendered as a translucent-white pill on
      the blue surface, mirroring the eyebrow rhythm of the flanking
      cards without inheriting their ring-on-white treatment.
    • Headline + body: inverted to white and warm-white-foreground.
    • Badges: 2-column × 4-row grid of static <div>s. Each cell is a
      soft translucent-white rounded rectangle with a circular icon
      well on the left (white surface, brand-blue lucide icon) and a
      white label on the right. NO <button>/<a>, no cursor-pointer,
      no hover state — these are presentational descriptors, not
      interactive controls. The constraint is pinned in
      `client/src/lib/workflowsCenterCard.test.ts`.
*/
function PlatformCenterCard({ className = "" }: { className?: string }) {
  return (
    <div
      data-testid="platform-center-card"
      className={[
        "rounded-[16px] paper-shadow p-5 md:p-6",
        "bg-[color:var(--color-footer)] text-white",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="grid place-items-center size-8 rounded-full bg-white/15 ring-1 ring-inset ring-white/25 text-white">
          <ServerCog className="size-4" strokeWidth={1.5} />
        </span>
        <span className="eyebrow text-white/85">02 · Layer</span>
      </div>
      <h3 className="mt-4 font-display text-[22px] leading-tight text-white">
        Rapid Hire Solutions Platform
      </h3>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-white/80">
        Orchestrates background checks, compliance rules, and real-time status
        updates.
      </p>

      {/* 2 × 4 static badge grid. The grid switches to 2 columns at all
          widths so the eight badges always read as a tidy block; the
          parent card already collapses to col-span-12 on mobile, so
          this stays comfortable on phones. */}
      <ul
        data-testid="platform-badge-grid"
        className="mt-5 grid grid-cols-2 gap-2.5"
      >
        {PLATFORM_BADGES.map(({ label, icon: Icon }) => (
          <li
            key={label}
            className="flex items-center gap-2.5 rounded-[10px] bg-white/10 ring-1 ring-inset ring-white/15 px-3 py-2.5"
          >
            <span className="grid place-items-center size-7 rounded-full bg-white text-[color:var(--color-accent-ink)] shrink-0">
              <Icon className="size-3.5" strokeWidth={2} />
            </span>
            <span className="text-[13px] font-medium text-white">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Connector({ className = "" }: { className?: string }) {
  return (
    <div className={["items-center justify-center", className].join(" ")}>
      <div className="relative w-full h-px">
        <div
          aria-hidden
          className="absolute inset-0 border-t border-dashed border-border"
        />
        <span
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[color:var(--color-ink-muted)] text-[14px]"
        >
          →
        </span>
      </div>
    </div>
  );
}

/*
  Editorial Calm — Workflows / Architecture
  Redraws the original dark architecture diagram natively as a 3-column
  light-card flow: System Integrations → RHS Platform (chips) → Outputs.
  Hairline arrows drawn with simple → glyphs and CSS dashed lines.
*/
import { Network, ServerCog, FileCheck2 } from "lucide-react";

const INPUTS = ["ATS", "HRIS", "Staffing CRM", "Online Forms", "Bulk Uploads"];
const PLATFORM_CHIPS = [
  "Speed",
  "Comprehensive",
  "Compliant",
  "Accurate",
  "Scalable",
  "Integrated",
  "Trusted",
  "Efficient",
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

          {/* Center: Platform */}
          <DiagramCard
            number="02"
            title="Rapid Hire Solutions Platform"
            icon={<ServerCog className="size-4" strokeWidth={1.5} />}
            description="Orchestrates background checks, compliance rules, and real-time status updates."
            className="col-span-12 lg:col-span-4"
            featured
          >
            <div className="mt-5 flex flex-wrap gap-2">
              {PLATFORM_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[color:var(--color-accent-ink)]/15 bg-[color:var(--color-tint)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--color-accent-ink)]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </DiagramCard>

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
        "rounded-[16px] border border-border p-5 md:p-6",
        featured
          ? "bg-white paper-shadow"
          : "bg-white/70 backdrop-blur-[2px]",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="grid place-items-center size-8 rounded-full border border-border text-[color:var(--color-accent-ink)]">
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

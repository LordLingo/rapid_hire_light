/*
  HeroCards — page-specific product/infographic visuals used in the right
  column of `PageHero`. Each card is intentionally small, code-rendered in
  the existing brand vocabulary (warm paper background, rounded-18 frame
  with paper-shadow, accent-ink as the only color), and designed to look
  more like a product surface than a marketing illustration. The shared
  card chrome (header strip + body + footer) mirrors the Home `ReportCard`
  so the whole site reads as one product.

  All cards are presentational and aria-hidden=false-by-default but they
  use plain text so they remain readable to assistive tech.
*/
import * as React from "react";
import {
  ShieldCheck,
  Phone,
  PhoneIncoming,
  Receipt,
  CheckCircle2,
  Clock,
  Plug,
  ListChecks,
  Network,
  Building2,
  Users,
  FileSearch,
  Headphones,
} from "lucide-react";
import integrationsData from "@shared/integrations.json";

type IntegrationItem = {
  name: string;
  mark: string;
  category: "ATS" | "HRIS" | "Payroll" | "CRM";
  status: "Live" | "Beta" | "Request";
  body: string;
};
export const INTEGRATIONS: IntegrationItem[] = (
  integrationsData as unknown as { items: IntegrationItem[] }
).items;

/** Helper: stagger style for hero-card child rows. */
function staggerDelay(i: number, step = 70) {
  return { ["--stagger-delay" as never]: `${i * step}ms` } as React.CSSProperties;
}

/* ---------- shared chrome ---------- */

function CardChrome({
  eyebrow,
  status,
  children,
  footer,
}: {
  eyebrow: string;
  status?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[color:var(--color-accent-ink)]" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
        {status ? (
          <span className="text-[10px] text-[color:var(--color-ink-muted)] tracking-wider uppercase">
            {status}
          </span>
        ) : null}
      </div>
      <div className="px-5 py-5">{children}</div>
      {footer ? (
        <div className="border-t border-border px-5 py-3 text-[11px] text-[color:var(--color-ink-muted)] flex items-center justify-between">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

/* ---------- About: org chart ---------- */

export function AboutOrgChart() {
  const nodes = [
    { icon: ShieldCheck, label: "Compliance", line: "FCRA · audit trail" },
    { icon: FileSearch, label: "Verifications", line: "Court-runner network" },
    { icon: Headphones, label: "Support", line: "US-based · zero offshore" },
  ];
  return (
    <CardChrome
      eyebrow="Org · Prosper, TX"
      status="Since 2014"
      footer={
        <>
          <span>3 functions · one floor</span>
          <span className="inline-flex items-center gap-1">
            <Building2 className="size-3.5" aria-hidden /> 4261 E University Dr
          </span>
        </>
      }
    >
      <p className="font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
        Built around the report
      </p>
      <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-muted)]">
        Three teams, one shared queue
      </p>

      <div className="mt-5 grid gap-3">
        {nodes.map((n, i) => (
          <div
            key={n.label}
            className="hero-stagger-child flex items-center gap-3 rounded-[12px] border border-border px-3 py-2.5"
            style={staggerDelay(i)}
          >
            <span className="grid place-items-center size-8 rounded-full bg-[color:var(--color-paper)] text-[color:var(--color-accent-ink)]">
              <n.icon className="size-4" strokeWidth={1.6} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] text-[color:var(--color-ink)]">
                {n.label}
              </p>
              <p className="text-[11.5px] text-[color:var(--color-ink-muted)]">
                {n.line}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardChrome>
  );
}

/* ---------- Services: stack of screens ---------- */

export function ServicesStack() {
  const rows = [
    { label: "Identity & SSN trace", tat: "Instant" },
    { label: "Criminal — federal + county", tat: "85% < 24h" },
    { label: "Employment verification", tat: "18h avg" },
    { label: "Education & credentials", tat: "2 days" },
    { label: "MVR (state-level)", tat: "Same day" },
    { label: "Drug & occupational health", tat: "24h" },
  ];
  return (
    <CardChrome
      eyebrow="Screens · ordered"
      status="Stacked"
      footer={
        <>
          <span>6 services · 1 audit trail</span>
          <span className="inline-flex items-center gap-1">
            <ListChecks className="size-3.5" aria-hidden /> FCRA ✓
          </span>
        </>
      }
    >
      <p className="font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
        Every check, in one stack
      </p>
      <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-muted)]">
        Run them à la carte or as a bundle
      </p>

      <ul className="mt-5 grid gap-2">
        {rows.map((r, i) => (
          <li
            key={r.label}
            className="hero-stagger-child flex items-center justify-between gap-3 rounded-[10px] border border-border px-3 py-2"
            style={staggerDelay(i)}
          >
            <span className="text-[13px] text-[color:var(--color-ink-soft)] truncate">
              {r.label}
            </span>
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10.5px] text-[color:var(--color-accent-ink)]">
              <Clock className="size-3" aria-hidden />
              {r.tat}
            </span>
          </li>
        ))}
      </ul>
    </CardChrome>
  );
}

/* ---------- Pricing: line-item invoice ---------- */

export function PricingLineItem() {
  const lines = [
    { label: "Standard package · 12 candidates", amount: "$348.00" },
    { label: "Federal criminal add-on · 3", amount: "$36.00" },
    { label: "Drug — 5-panel · 2", amount: "$78.00" },
  ];
  return (
    <CardChrome
      eyebrow="Invoice · sample"
      status="Net 15"
      footer={
        <>
          <span>No setup fee · no minimums</span>
          <span className="inline-flex items-center gap-1">
            <Receipt className="size-3.5" aria-hidden /> RH-9824
          </span>
        </>
      }
    >
      <p className="font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
        What you actually pay
      </p>
      <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-muted)]">
        Per-screen pricing, itemized line by line
      </p>

      <div className="mt-5 grid gap-2">
        {lines.map((l, i) => (
          <div
            key={l.label}
            className="hero-stagger-child flex items-center justify-between gap-3 border-b border-border last:border-0 py-2"
            style={staggerDelay(i)}
          >
            <span className="text-[13px] text-[color:var(--color-ink-soft)]">
              {l.label}
            </span>
            <span className="text-[12.5px] font-medium text-[color:var(--color-ink)]">
              {l.amount}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[10px] bg-[color:var(--color-paper)] px-3 py-2.5">
        <span className="text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
          Total this month
        </span>
        <span className="font-display text-[20px] tracking-[-0.01em] text-[color:var(--color-ink)]">
          $462.00
        </span>
      </div>
    </CardChrome>
  );
}

/* ---------- Integrations: chrome window + tile grid ---------- */

export function IntegrationsGrid() {
  // Show the first 6 LIVE integrations from the shared source of truth so
  // the hero stays in sync with the /integrations page list.
  const tiles = INTEGRATIONS.filter((it) => it.status === "Live")
    .slice(0, 6)
    .map((it) => ({ mark: it.mark, label: it.name }));
  return (
    <CardChrome
      eyebrow="Stack · connected"
      status="Live"
      footer={
        <>
          <span>ATS · HRIS · SSO</span>
          <span className="inline-flex items-center gap-1">
            <Plug className="size-3.5" aria-hidden /> Webhooks
          </span>
        </>
      }
    >
      <p className="font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
        Plugs into your stack
      </p>
      <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-muted)]">
        Same-day SSO, two-way ATS sync, signed webhooks
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {tiles.map((t, i) => (
          <div
            key={t.mark}
            className="hero-stagger-child flex flex-col items-center gap-1 rounded-[10px] border border-border bg-[color:var(--color-paper)] px-2 py-3"
            style={staggerDelay(i, 60)}
          >
            <span className="grid place-items-center size-9 rounded-full bg-white border border-border text-[10.5px] font-medium tracking-wider text-[color:var(--color-accent-ink)]">
              {t.mark}
            </span>
            <span className="text-[10.5px] text-[color:var(--color-ink-muted)] truncate max-w-full">
              {t.label}
            </span>
          </div>
        ))}
      </div>
    </CardChrome>
  );
}

/* ---------- Contact: inbound call card ---------- */

export function ContactCallCard() {
  return (
    <CardChrome
      eyebrow="Inbound · live"
      status="Picked up"
      footer={
        <>
          <span>Direct extension · no IVR</span>
          <span className="inline-flex items-center gap-1">
            <Phone className="size-3.5" aria-hidden /> (888) 445-3047
          </span>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span className="grid place-items-center size-10 rounded-full bg-[color:var(--color-paper)] text-[color:var(--color-accent-ink)]">
          <PhoneIncoming className="size-5" strokeWidth={1.6} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
            Reach a human
          </p>
          <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-muted)]">
            Average pickup: 14 seconds
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5">
        <div
          className="hero-stagger-child flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5"
          style={staggerDelay(0)}
        >
          <span className="text-[12.5px] text-[color:var(--color-ink-muted)]">
            Caller
          </span>
          <span className="text-[13px] text-[color:var(--color-ink)]">
            Atlas Staffing · Prosper, TX
          </span>
        </div>
        <div
          className="hero-stagger-child flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5"
          style={staggerDelay(1)}
        >
          <span className="text-[12.5px] text-[color:var(--color-ink-muted)]">
            Wait time
          </span>
          <span className="text-[13px] text-[color:var(--color-accent-ink)] inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden /> 11s
          </span>
        </div>
        <div
          className="hero-stagger-child flex items-center justify-between rounded-[10px] border border-border px-3 py-2.5"
          style={staggerDelay(2)}
        >
          <span className="text-[12.5px] text-[color:var(--color-ink-muted)]">
            Picked up by
          </span>
          <span className="text-[13px] text-[color:var(--color-ink)] inline-flex items-center gap-1">
            Maya R. <span className="text-[color:var(--color-ink-muted)]">· ext. 204</span>
          </span>
        </div>
      </div>
    </CardChrome>
  );
}

/* ---------- Support: refined answer-time card ---------- */

export function SupportAnswerTimeCard() {
  return (
    <CardChrome
      eyebrow="Live · Prosper desk"
      status="Open"
      footer={
        <>
          <span>Updated weekly</span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" aria-hidden /> 4 specialists on
          </span>
        </>
      }
    >
      <p className="font-display text-[44px] sm:text-[56px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)]">
        14 sec
      </p>
      <p className="mt-2 text-[13.5px] text-[color:var(--color-ink-soft)]">
        average time to a US-based human on the phone
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div>
          <p className="eyebrow text-[10.5px]">Answered this week</p>
          <p className="mt-1.5 text-[14px] text-[color:var(--color-ink)]">
            612 calls
          </p>
          <p className="text-[11.5px] text-[color:var(--color-ink-muted)]">
            Week of May 5–11
          </p>
        </div>
        <div>
          <p className="eyebrow text-[10.5px]">Where we are</p>
          <p className="mt-1.5 text-[14px] text-[color:var(--color-ink)]">
            Prosper, TX
          </p>
          <p className="text-[11.5px] text-[color:var(--color-accent-ink)] inline-flex items-center gap-1">
            <ShieldCheck className="size-3.5" aria-hidden /> Zero offshore
          </p>
        </div>
      </div>
    </CardChrome>
  );
}

/* ---------- Re-usable section infographics (not in the hero card) ---------- */

/** Tiny "Trust ledger" used to replace the editorial photo on About story. */
export function TrustLedger() {
  const events = [
    {
      time: "07:31 CT",
      label: "Report 24A-08821 returned",
      detail: "5 components · clear · 06h 12m",
    },
    {
      time: "07:44 CT",
      label: "Adverse-action notice sent",
      detail: "Auto-paused 5 business days · candidate notified",
    },
    {
      time: "07:52 CT",
      label: "Court-runner dispatched",
      detail: "Hidalgo County, TX · estimated 1 business day",
    },
  ];
  return (
    <div className="rounded-[18px] border border-border paper-shadow bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[color:var(--color-accent-ink)]" />
          <span className="eyebrow">Trust ledger · today</span>
        </div>
        <span className="text-[10px] text-[color:var(--color-ink-muted)] tracking-wider uppercase">
          Audit trail
        </span>
      </div>
      <ul className="px-5 py-4 grid gap-3">
        {events.map((e) => (
          <li
            key={e.time}
            className="grid grid-cols-[80px_1fr] items-start gap-3"
          >
            <span className="text-[11.5px] text-[color:var(--color-ink-muted)] tabular-nums tracking-wider uppercase pt-0.5">
              {e.time}
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] text-[color:var(--color-ink)]">
                {e.label}
              </p>
              <p className="text-[12px] text-[color:var(--color-ink-muted)]">
                {e.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-border px-5 py-3 text-[11px] text-[color:var(--color-ink-muted)] flex items-center justify-between">
        <span>Every event signed · FCRA-compliant retention</span>
        <span className="inline-flex items-center gap-1 text-[color:var(--color-accent-ink)]">
          <CheckCircle2 className="size-3.5" aria-hidden /> Verified
        </span>
      </div>
    </div>
  );
}

/** Wide "On the line right now" strip used above the four specialist cards on Support. */
export function OnTheLineNow() {
  const seats = [
    { name: "Jordan M.", role: "Account", calls: "in call · 02:14" },
    { name: "Maya T.", role: "Compliance", calls: "available" },
    { name: "Priya S.", role: "Client success", calls: "in call · 04:38" },
    { name: "Tyler R.", role: "Verifications", calls: "wrap-up · 00:21" },
  ];
  return (
    <div className="rounded-[18px] border border-border paper-shadow bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[color:var(--color-accent-ink)] support-status-dot-live" />
          <span className="eyebrow">On the line right now · Prosper desk</span>
        </div>
        <span className="text-[10px] text-[color:var(--color-ink-muted)] tracking-wider uppercase inline-flex items-center gap-1">
          <Network className="size-3.5" aria-hidden /> Live
        </span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {seats.map((s) => (
          <li key={s.name} className="px-5 py-4">
            <p className="text-[13.5px] text-[color:var(--color-ink)]">
              {s.name}
            </p>
            <p className="text-[11.5px] text-[color:var(--color-ink-muted)]">
              {s.role}
            </p>
            <p className="mt-2 text-[11.5px] text-[color:var(--color-accent-ink)] tabular-nums">
              {s.calls}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

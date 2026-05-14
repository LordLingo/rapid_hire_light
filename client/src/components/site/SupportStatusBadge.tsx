/*
  SupportStatusBadge — live status panel on the /support page hero.

  Reads /shared/support-status.json (imported as static data, replaced at
  build time). The owner can update the JSON file weekly without touching
  code; shape is intentionally tiny and typed.

  The badge has two visual states:
    - Live (true): subtle pulsing dot in accent-ink, "Live now" label.
    - Off-hours (false): muted dot, voicemail SLA copy.

  Both states show the answer-time hero number, "answered this week" count,
  the reporting week, and an "updated" date footer.
*/
import { ShieldCheck } from "lucide-react";
import status from "../../../../shared/support-status.json";

export type SupportStatus = {
  answerTimeSeconds: number;
  answerTimeLabel: string;
  weekLabel: string;
  answeredThisWeek: number;
  live: boolean;
  liveLabel: string;
  offlineLabel: string;
  updatedAt: string;
};

export const SUPPORT_STATUS: SupportStatus = status as SupportStatus;

/** Format the updated-at ISO date as a short, locale-stable English label. */
function formatUpdatedAt(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function SupportStatusBadge() {
  const s = SUPPORT_STATUS;
  const dotClass = s.live
    ? "bg-[color:var(--color-accent-ink)] support-status-dot-live"
    : "bg-[color:var(--color-ink-muted)]";
  const stateLabel = s.live ? s.liveLabel : s.offlineLabel;
  return (
    <div
      className="rounded-[20px] border border-border bg-white p-6 sm:p-7 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 eyebrow text-[color:var(--color-ink-muted)]">
        <span
          aria-hidden
          className={["inline-block size-2.5 rounded-full", dotClass].join(" ")}
        />
        <span>{stateLabel}</span>
      </div>
      <p className="mt-4 font-display text-[56px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)]">
        {s.answerTimeLabel}
      </p>
      <p className="mt-2 text-[14px] text-[color:var(--color-ink-soft)]">
        average time to a US-based human on the phone
      </p>
      <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5">
        <div>
          <p className="eyebrow text-[10.5px] text-[color:var(--color-ink-muted)]">
            Answered this week
          </p>
          <p className="mt-2 text-[14px] text-[color:var(--color-ink)]">
            {s.answeredThisWeek.toLocaleString("en-US")} calls
          </p>
          <p className="text-[14px] text-[color:var(--color-ink-soft)]">
            {s.weekLabel}
          </p>
        </div>
        <div>
          <p className="eyebrow text-[10.5px] text-[color:var(--color-ink-muted)]">
            Where we are
          </p>
          <p className="mt-2 text-[14px] text-[color:var(--color-ink)]">
            Houston, TX
          </p>
          <p className="text-[14px] text-[color:var(--color-accent-ink)] inline-flex items-center gap-1">
            <ShieldCheck className="size-3.5" aria-hidden />
            Zero offshore
          </p>
        </div>
      </div>
      <p className="mt-5 eyebrow text-[10.5px] text-[color:var(--color-ink-muted)]">
        Updated {formatUpdatedAt(s.updatedAt)}
      </p>
    </div>
  );
}

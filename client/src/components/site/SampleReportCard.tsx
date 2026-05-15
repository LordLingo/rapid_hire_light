/*
  SampleReportCard — extracted from the original homepage Hero.

  When the brand owner supplied a marketing photograph (Aug 2026), the
  inline structured "Report 24A-08821" card was lifted out of Hero.tsx so
  the photo could occupy the right column. This component preserves that
  editorial product preview so we don't lose a high-conviction proof
  element. It is now embedded mid-page on Home (see SampleReportSection)
  and is available to any future page that wants to show "what a Rapid
  Hire report looks like" without screenshotting the real product.

  Visual: rounded paper card on a soft halo wash, status pill in the
  header, five labeled rows mirroring the most-requested verifications,
  audit + FCRA confirmation in the footer.
*/
export default function SampleReportCard() {
  return (
    <div className="relative">
      <div className="relative rounded-[18px] border border-border bg-white paper-shadow">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[color:var(--color-accent-ink)]" />
            <span className="eyebrow">Report · 24a-08821</span>
          </div>
          <span className="text-[10px] text-[color:var(--color-ink-muted)] tracking-wider uppercase">
            Cleared
          </span>
        </div>
        <div className="px-5 py-5">
          <p className="font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
            Maya R. — Logistics Lead
          </p>
          <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-muted)]">
            Returned in 06h 12m
          </p>

          <div className="mt-5 grid gap-3">
            {[
              { label: "Identity", state: "Verified" },
              { label: "Criminal — Federal & County", state: "Clear" },
              { label: "Employment History", state: "3 / 3 Verified" },
              { label: "MVR — Texas", state: "No incidents" },
              { label: "Drug — 5 Panel", state: "Negative" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 border-b border-border last:border-0 py-2"
              >
                <span className="text-[13px] text-[color:var(--color-ink-soft)]">
                  {row.label}
                </span>
                <span className="text-[12.5px] font-medium text-[color:var(--color-accent-ink)]">
                  {row.state}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between text-[11px] text-[color:var(--color-ink-muted)]">
            <span>Audit trail · 14 events</span>
            <span>FCRA ✓</span>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[28px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, oklch(0.95 0.04 250 / 0.6), transparent 70%)",
        }}
      />
    </div>
  );
}

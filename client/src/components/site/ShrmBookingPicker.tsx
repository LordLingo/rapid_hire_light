/*
  §148 — SHRM 2026 booking-slot picker.

  Lives between section "What to expect at the booth" and the SPA
  pillars on /shrm. Lets a visitor pick a specific 15-minute slot from
  the booth calendar before opening the contact form, so the rep gets a
  concrete time-of-arrival to confirm instead of a generic meeting
  request. The picker is intentionally static: SHRM_SLOTS is a const
  catalog in lib/shrmSlots.ts. When we have a real calendar back-end
  later we can swap it without touching this component's UI.

  UX notes:
   - Day tabs (Mon / Tue / Wed) — three tabs, never four. The same
     three-letter keys match the slot ids (mon-0930, tue-1015, ...).
   - 4-column grid of 15-minute cells per day. Each cell shows the
     start time only (full range shown in the selection summary). Taken
     slots render disabled with a strikethrough so the page still feels
     "live" even though every slot is hard-coded.
   - Tap-to-toggle: clicking the active slot deselects.
   - Selection card renders below the grid with the full "Mon Jun 22,
     9:30 – 9:45 am ET" string + a primary "Reserve this slot" CTA that
     opens /contact?subject=…&source=shrm-2026&slot={id}. Contact.tsx
     reads the slot id, looks it up via getShrmSlot, and (a) prefills
     the message body with the slot, (b) flips the success-state lede
     to mention it specifically.
   - Empty selection: CTA disabled with a hint to pick a slot first.
   - Keyboard: every cell is a real <button> so Tab + Enter "just work";
     active cells get a focus ring matching the brand accent.

  This component is intentionally a self-contained island — Shrm.tsx
  only wires it in, doesn't pass state. The selection lives in local
  React state and resets on page reload.
*/

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Calendar, Check } from "lucide-react";
import {
  SHRM_BOOKING_DAYS,
  SHRM_SLOTS,
  formatShrmSlot,
  getShrmSlot,
  type ShrmSlot,
} from "@/lib/shrmSlots";
import { buildShrmContactUrl } from "@/lib/shrm";

export default function ShrmBookingPicker() {
  const [dayKey, setDayKey] = useState<ShrmSlot["dayKey"]>("mon");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Group slots by day for cheap rendering.
  const slotsForDay = useMemo(
    () => SHRM_SLOTS.filter((s) => s.dayKey === dayKey),
    [dayKey],
  );

  // Available-count per day for the tab subtitle ("12 open").
  const availableCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const day of SHRM_BOOKING_DAYS) {
      m[day.key] = SHRM_SLOTS.filter(
        (s) => s.dayKey === day.key && s.available,
      ).length;
    }
    return m;
  }, []);

  const selected = getShrmSlot(selectedId);
  const reserveUrl = selectedId
    ? buildShrmContactUrl({ slotId: selectedId })
    : buildShrmContactUrl();

  return (
    <section
      id="shrm-booking-picker"
      data-testid="shrm-booking-picker"
      className="border-t border-[color:var(--color-rule)]"
    >
      <div className="container py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8">
          <div className="col-span-12 lg:col-span-2 reveal-on-scroll">
            <span className="eyebrow">02 — Pick a slot</span>
            <span className="hidden lg:block hairline mt-3" />
          </div>
          <div className="col-span-12 lg:col-span-10 reveal-on-scroll">
            <p className="font-display text-[28px] leading-[1.25] tracking-[-0.01em] text-[color:var(--color-ink)] md:text-[36px]">
              Reserve your 15-minute slot at the booth.
            </p>
            <p className="mt-4 max-w-3xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              We run the SPA Treatment in back-to-back 15-minute blocks
              from 9 a.m. to 5 p.m. ET. Pick a time below — we'll
              confirm by email same business day, and hold the slot for
              you at Booth 1619.
            </p>

            {/* Day tabs */}
            <div
              role="tablist"
              aria-label="Pick a SHRM 2026 booth day"
              data-testid="shrm-booking-day-tabs"
              className="mt-10 flex flex-wrap gap-2"
            >
              {SHRM_BOOKING_DAYS.map((day) => {
                const active = day.key === dayKey;
                return (
                  <button
                    key={day.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`shrm-booking-grid-${day.key}`}
                    data-testid="shrm-booking-day-tab"
                    data-day={day.key}
                    data-active={active ? "true" : "false"}
                    onClick={() => setDayKey(day.key)}
                    className={[
                      "rounded-full border px-5 py-2.5 text-[14px] tracking-tight transition-colors",
                      active
                        ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                        : "border-border bg-white text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
                    ].join(" ")}
                  >
                    <span className="font-medium">{day.label}</span>
                    <span className="ml-2 text-[12.5px] opacity-80">
                      {availableCounts[day.key]} open
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Slot grid */}
            <div
              id={`shrm-booking-grid-${dayKey}`}
              role="tabpanel"
              data-testid="shrm-booking-grid"
              data-day={dayKey}
              className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
            >
              {slotsForDay.map((slot) => {
                const isSelected = slot.id === selectedId;
                const disabled = !slot.available;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    data-testid="shrm-booking-slot"
                    data-slot-id={slot.id}
                    data-available={slot.available ? "true" : "false"}
                    data-selected={isSelected ? "true" : "false"}
                    disabled={disabled}
                    onClick={() =>
                      setSelectedId((cur) => (cur === slot.id ? null : slot.id))
                    }
                    aria-label={`${slot.dayLabel} ${slot.startLabel} – ${slot.endLabel} Eastern`}
                    aria-pressed={isSelected}
                    className={[
                      "rounded-xl border px-3 py-2.5 text-[13.5px] tracking-tight transition-colors",
                      disabled
                        ? "cursor-not-allowed border-dashed border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)] text-[color:var(--color-ink-muted)] line-through"
                        : isSelected
                          ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                          : "border-border bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]",
                    ].join(" ")}
                  >
                    {slot.startLabel}
                  </button>
                );
              })}
            </div>

            {/* Selection summary + reserve CTA */}
            <div
              data-testid="shrm-booking-summary"
              className="mt-10 flex flex-col items-start gap-5 rounded-2xl border border-[color:var(--color-rule)] bg-[color:var(--color-paper-soft)] p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex size-10 items-center justify-center rounded-full bg-[color:var(--color-accent-ink)] text-white">
                  {selected ? <Check className="size-5" /> : <Calendar className="size-5" />}
                </span>
                <div>
                  <p
                    data-testid="shrm-booking-summary-label"
                    className="text-[12.5px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]"
                  >
                    {selected ? "Your slot" : "No slot selected yet"}
                  </p>
                  <p
                    data-testid="shrm-booking-summary-value"
                    className="mt-1 text-[18px] font-semibold leading-snug text-[color:var(--color-ink)]"
                  >
                    {selected
                      ? formatShrmSlot(selected)
                      : "Pick a 15-minute block above to lock it in."}
                  </p>
                </div>
              </div>
              {selected ? (
                <Link
                  href={reserveUrl}
                  data-testid="shrm-booking-reserve-cta"
                  className="btn-press inline-flex shrink-0 items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-[14.5px] font-semibold text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                >
                  Reserve this slot
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  data-testid="shrm-booking-reserve-cta-disabled"
                  disabled
                  className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-[color:var(--color-rule)] bg-white px-6 py-3 text-[14.5px] font-medium text-[color:var(--color-ink-muted)]"
                >
                  Reserve this slot
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
            <p className="mt-3 text-[13px] text-[color:var(--color-ink-muted)]">
              All times Eastern. Confirmation arrives same business day,
              usually within 8 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
  §148 — SHRM 2026 booking slot catalog (static).

  We don't have a live calendar back-end yet so this file hardcodes
  every 15-minute slot the team has booth coverage for, across the
  three SHRM 2026 booth days (Mon Jun 22 / Tue Jun 23 / Wed Jun 24,
  2026). All times are in U.S. Eastern (the show is in Orlando, FL).

  Each slot exposes:
   - id: stable slug ("mon-0930") used in URLs (?slot=mon-0930) and
     deep links. Format: {dayKey}-{HHmm} so a future contributor can
     read it without lookup.
   - dayIso / dayLabel: redundant fields for sort + display.
   - startEt / endEt: 24h HH:mm strings for sort + comparison.
   - startLabel / endLabel: human-readable ("9:30 am" / "9:45 am").
   - available: false marks the slot as taken/blocked (lunch, booth
     shifts, internal sync). Vitest pins that at least 60% remain open.

  Helpers:
   - getShrmSlot(id) — O(1) lookup by id.
   - formatShrmSlot(slot) — canonical display string used by both the
     picker confirmation card and the Contact.tsx success message.

  Pure module, exhaustively testable. Edits should be made here only —
  the picker UI iterates over SHRM_SLOTS rather than hard-coding times.
*/

export type ShrmSlot = {
  /** Stable slug used in URLs (?slot=…) and deep links. */
  id: string;
  /** ISO yyyy-mm-dd of the slot's day. */
  dayIso: string;
  /** Three-letter abbreviation for tabs ("Mon" / "Tue" / "Wed"). */
  dayKey: "mon" | "tue" | "wed";
  /** Long-form day label used in confirmations ("Mon Jun 22"). */
  dayLabel: string;
  /** 24h HH:mm — lexicographically sortable. */
  startEt: string;
  /** 24h HH:mm — lexicographically sortable. */
  endEt: string;
  /** Human-readable start ("9:30 am"). */
  startLabel: string;
  /** Human-readable end ("9:45 am"). */
  endLabel: string;
  /** false when the slot is taken/blocked. */
  available: boolean;
};

// 15-minute increments from 9:00 to 17:00 ET. 32 slots/day × 3 days = 96.
const DAYS: { key: "mon" | "tue" | "wed"; iso: string; label: string }[] = [
  { key: "mon", iso: "2026-06-22", label: "Mon Jun 22" },
  { key: "tue", iso: "2026-06-23", label: "Tue Jun 23" },
  { key: "wed", iso: "2026-06-24", label: "Wed Jun 24" },
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function ampm(h24: number, m: number): string {
  const period = h24 >= 12 ? "pm" : "am";
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return m === 0 ? `${h12}:00 ${period}` : `${h12}:${pad(m)} ${period}`;
}

/*
  Slots pre-blocked across all three days for realism. The booth needs:
   - 12:00–13:00 ET lunch coverage swap (4 slots blocked)
   - one mid-morning + one mid-afternoon internal sync per day
   - a handful of slots already "booked" so the grid feels live
*/
function isBlocked(dayKey: "mon" | "tue" | "wed", startEt: string): boolean {
  // Universal lunch hour: 12:00 – 13:00 unavailable on every day.
  if (startEt >= "12:00" && startEt < "13:00") return true;

  // Per-day blocks — gives prospects realistic constraints without
  // overwhelming them. Tuned so 64+ of 96 slots remain available.
  const perDay: Record<typeof dayKey, string[]> = {
    mon: ["09:00", "09:15", "14:30", "16:45"], // morning warm-up + late afternoon shift
    tue: ["10:30", "10:45", "15:00"], // mid-morning sync + a "booked" slot
    wed: ["09:00", "13:00", "13:15", "16:30", "16:45"], // last-day teardown overlap
  };
  return perDay[dayKey].includes(startEt);
}

function buildSlots(): ShrmSlot[] {
  const out: ShrmSlot[] = [];
  for (const day of DAYS) {
    for (let h = 9; h < 17; h++) {
      for (const m of [0, 15, 30, 45]) {
        const startEt = `${pad(h)}:${pad(m)}`;
        const endMin = m + 15;
        const endH = endMin === 60 ? h + 1 : h;
        const endM = endMin === 60 ? 0 : endMin;
        const endEt = `${pad(endH)}:${pad(endM)}`;
        out.push({
          id: `${day.key}-${pad(h)}${pad(m)}`,
          dayIso: day.iso,
          dayKey: day.key,
          dayLabel: day.label,
          startEt,
          endEt,
          startLabel: ampm(h, m),
          endLabel: ampm(endH, endM),
          available: !isBlocked(day.key, startEt),
        });
      }
    }
  }
  return out;
}

/**
 * Canonical catalog of every SHRM 2026 booking slot.
 * Locked by shrmBookingSlots.test.ts.
 */
export const SHRM_SLOTS: readonly ShrmSlot[] = buildSlots();

/**
 * Quick lookup by slot id. Returns undefined when the id doesn't match
 * any known slot (defensive — Contact.tsx receives the id from the URL
 * and must tolerate stale or malformed inputs gracefully).
 */
export function getShrmSlot(id: string | null | undefined): ShrmSlot | undefined {
  if (!id) return undefined;
  return SHRM_SLOTS.find((s) => s.id === id);
}

/**
 * Canonical display string used by the picker confirmation panel and
 * the Contact.tsx success message. Example: "Mon Jun 22, 9:30 – 9:45 am ET".
 */
export function formatShrmSlot(slot: ShrmSlot): string {
  return `${slot.dayLabel}, ${slot.startLabel} – ${slot.endLabel} ET`;
}

/**
 * Convenience: slots grouped by day, useful for the tab UI.
 */
export function slotsByDay(): { day: typeof DAYS[number]; slots: ShrmSlot[] }[] {
  return DAYS.map((day) => ({
    day,
    slots: SHRM_SLOTS.filter((s) => s.dayKey === day.key),
  }));
}

/**
 * Convenience: the day tab metadata, exported so the picker UI and
 * vitest can both reference the same source of truth.
 */
export const SHRM_BOOKING_DAYS = DAYS;

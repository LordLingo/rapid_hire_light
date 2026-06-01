/*
  §148 — Pin the SHRM 2026 booking-slot picker contract.

  This spec locks four moving parts together:

   1. lib/shrmSlots.ts — pure module with the 96-slot static catalog
      (Mon/Tue/Wed × 32 slots/day) and its lookup/format helpers.
   2. lib/shrm.ts — buildShrmContactUrl now optionally takes a slotId.
   3. components/site/ShrmBookingPicker.tsx — UI source pins for every
      stable testid + the day-tab/slot-grid/summary wiring.
   4. pages/Shrm.tsx — booking picker rendered between section 02 and
      the SPA pillars.
   5. pages/Contact.tsx — reads ?slot=, looks it up via getShrmSlot,
      weaves the slot into the prefilled message + ContactSuccess, and
      forwards shrmSlotId + shrmSlot to the Formspree payload.

  All source-pin style, like every other spec under client/src/lib —
  we don't spin up jsdom for this contract because the inputs are
  static (a URL param) and the outputs are deterministic strings.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SHRM_BOOKING_DAYS,
  SHRM_SLOTS,
  formatShrmSlot,
  getShrmSlot,
  slotsByDay,
  type ShrmSlot,
} from "@/lib/shrmSlots";
import { buildShrmContactUrl, SHRM_MEETING_SUBJECT } from "@/lib/shrm";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const picker = readFileSync(
  join(ROOT, "client/src/components/site/ShrmBookingPicker.tsx"),
  "utf8",
);
const shrmPage = readFileSync(
  join(ROOT, "client/src/pages/Shrm.tsx"),
  "utf8",
);
const contactPage = readFileSync(
  join(ROOT, "client/src/pages/Contact.tsx"),
  "utf8",
);

describe("§148 — SHRM_BOOKING_DAYS catalog", () => {
  it("ships exactly three days (Tue/Wed/Thu) in show order", () => {
    expect(SHRM_BOOKING_DAYS.map((d) => d.key)).toEqual(["tue", "wed", "thu"]);
  });

  it("each day has an ISO date in 2026 and a human label", () => {
    for (const day of SHRM_BOOKING_DAYS) {
      expect(day.iso).toMatch(/^2026-06-(16|17|18)$/);
      expect(day.label).toMatch(/^(Tue|Wed|Thu) Jun (16|17|18)$/);
    }
  });
});

describe("§148 — SHRM_SLOTS catalog shape", () => {
  it("yields 96 slots total (32 per day × 3 days)", () => {
    expect(SHRM_SLOTS).toHaveLength(96);
  });

  it("each slot id matches `{day}-HHmm` and is unique", () => {
    const ids = SHRM_SLOTS.map((s) => s.id);
    for (const id of ids) {
      expect(id).toMatch(/^(tue|wed|thu)-\d{4}$/);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every slot has parsable 24h start/end times exactly 15 minutes apart", () => {
    const toMinutes = (hhmm: string) => {
      const [h, m] = hhmm.split(":").map(Number);
      return h * 60 + m;
    };
    for (const s of SHRM_SLOTS) {
      expect(s.startEt).toMatch(/^\d{2}:\d{2}$/);
      expect(s.endEt).toMatch(/^\d{2}:\d{2}$/);
      expect(toMinutes(s.endEt) - toMinutes(s.startEt)).toBe(15);
    }
  });

  it("start times cover 09:00 through 16:45 inclusive", () => {
    const sorted = [...SHRM_SLOTS]
      .filter((s) => s.dayKey === "tue")
      .map((s) => s.startEt);
    expect(sorted[0]).toBe("09:00");
    expect(sorted[sorted.length - 1]).toBe("16:45");
  });

  it("12:00–12:45 is universally blocked (lunch hour)", () => {
    const lunchSlots = SHRM_SLOTS.filter(
      (s) => s.startEt >= "12:00" && s.startEt < "13:00",
    );
    expect(lunchSlots.length).toBe(12); // 4 slots × 3 days
    expect(lunchSlots.every((s) => !s.available)).toBe(true);
  });

  it("leaves at least 60% of slots available so the grid reads as live", () => {
    const available = SHRM_SLOTS.filter((s) => s.available).length;
    expect(available / SHRM_SLOTS.length).toBeGreaterThanOrEqual(0.6);
  });

  it("human labels use 12-hour format with am/pm", () => {
    for (const s of SHRM_SLOTS) {
      expect(s.startLabel).toMatch(/^\d{1,2}:\d{2} (am|pm)$/);
      expect(s.endLabel).toMatch(/^\d{1,2}:\d{2} (am|pm)$/);
    }
  });
});

describe("§148 — getShrmSlot helper", () => {
  it("returns undefined for empty / null / unknown inputs", () => {
    expect(getShrmSlot(null)).toBeUndefined();
    expect(getShrmSlot(undefined)).toBeUndefined();
    expect(getShrmSlot("")).toBeUndefined();
    expect(getShrmSlot("tue-9999")).toBeUndefined();
    expect(getShrmSlot("not-a-slot")).toBeUndefined();
  });

  it("returns the exact matching slot for a valid id", () => {
    const found = getShrmSlot("tue-0930");
    expect(found).toBeDefined();
    expect(found?.dayKey).toBe("tue");
    expect(found?.startEt).toBe("09:30");
    expect(found?.endEt).toBe("09:45");
  });
});

describe("§148 — formatShrmSlot helper", () => {
  it("renders the canonical 'Tue Jun 16, 9:30 – 9:45 am ET' shape", () => {
    const slot = getShrmSlot("tue-0930") as ShrmSlot;
    expect(formatShrmSlot(slot)).toBe("Tue Jun 16, 9:30 am – 9:45 am ET");
  });

  it("crosses noon correctly (am → pm boundary)", () => {
    const slot = getShrmSlot("wed-1145") as ShrmSlot;
    // 11:45 am → 12:00 pm — display strings flip period correctly.
    expect(slot.startLabel).toBe("11:45 am");
    expect(slot.endLabel).toBe("12:00 pm");
    expect(formatShrmSlot(slot)).toBe("Wed Jun 17, 11:45 am – 12:00 pm ET");
  });
});

describe("§148 — slotsByDay convenience", () => {
  it("groups every slot into exactly its day bucket, preserving order", () => {
    const groups = slotsByDay();
    expect(groups).toHaveLength(3);
    expect(groups.map((g) => g.day.key)).toEqual(["tue", "wed", "thu"]);
    for (const g of groups) {
      expect(g.slots.length).toBe(32);
      expect(g.slots.every((s) => s.dayKey === g.day.key)).toBe(true);
    }
  });
});

describe("§148 — buildShrmContactUrl(slotId)", () => {
  it("returns the SHRM-funnel URL without a slot when no option is passed", () => {
    const url = buildShrmContactUrl();
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("subject")).toBe(SHRM_MEETING_SUBJECT);
    expect(params.get("source")).toBe("shrm-2026");
    expect(params.has("slot")).toBe(false);
  });

  it("appends slot= when slotId is provided", () => {
    const url = buildShrmContactUrl({ slotId: "wed-1015" });
    expect(url).toContain("slot=wed-1015");
    // existing SHRM params still present
    expect(url).toContain("source=shrm-2026");
  });

  it("encodes the slot id as a URL-safe value", () => {
    // ids are already safe but the call site should round-trip cleanly
    const url = buildShrmContactUrl({ slotId: "thu-0900" });
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("slot")).toBe("thu-0900");
  });
});

describe("§148 — ShrmBookingPicker source pins", () => {
  it("imports the static catalog + helpers from lib/shrmSlots", () => {
    expect(picker).toMatch(/from\s+["']@\/lib\/shrmSlots["']/);
    expect(picker).toMatch(/SHRM_BOOKING_DAYS/);
    expect(picker).toMatch(/SHRM_SLOTS/);
    expect(picker).toMatch(/formatShrmSlot/);
    expect(picker).toMatch(/getShrmSlot/);
  });

  it("uses buildShrmContactUrl from lib/shrm for the reserve CTA", () => {
    expect(picker).toMatch(/from\s+["']@\/lib\/shrm["']/);
    expect(picker).toMatch(/buildShrmContactUrl\(\s*\{?\s*slotId/);
  });

  it("renders every stable testid the contract documents", () => {
    const required = [
      "shrm-booking-picker",
      "shrm-booking-day-tabs",
      "shrm-booking-day-tab",
      "shrm-booking-grid",
      "shrm-booking-slot",
      "shrm-booking-summary",
      "shrm-booking-summary-label",
      "shrm-booking-summary-value",
      "shrm-booking-reserve-cta",
      "shrm-booking-reserve-cta-disabled",
    ];
    for (const id of required) {
      expect(picker).toContain(`data-testid="${id}"`);
    }
  });

  it("day tabs expose data-active + data-day for selection state", () => {
    expect(picker).toMatch(/data-active=\{active \? "true" : "false"\}/);
    expect(picker).toMatch(/data-day=\{day\.key\}/);
  });

  it("slot cells expose data-slot-id + data-available + data-selected", () => {
    expect(picker).toMatch(/data-slot-id=\{slot\.id\}/);
    expect(picker).toMatch(/data-available=\{slot\.available \? "true" : "false"\}/);
    expect(picker).toMatch(/data-selected=\{isSelected \? "true" : "false"\}/);
  });

  it("disabled cells render a dashed border + line-through visual treatment", () => {
    // Source pin so a future contributor can't silently drop the
    // affordance that says "this slot is taken".
    expect(picker).toMatch(/border-dashed/);
    expect(picker).toMatch(/line-through/);
  });

  it("disables the reserve CTA when no slot is selected", () => {
    // A disabled stand-in renders when selectedId is null.
    expect(picker).toMatch(/shrm-booking-reserve-cta-disabled/);
    expect(picker).toMatch(/disabled/);
  });

  it("renders only one of the two CTA variants at a time (selected ? Link : button)", () => {
    expect(picker).toMatch(/selected\s*\?\s*\(/);
  });

  it("uses the brand accent for the active slot + active day tab", () => {
    // Active states share the same accent — source pin so a refactor
    // can't accidentally drift the active treatment away from brand.
    expect(picker).toMatch(/var\(--color-accent-ink\)/);
  });
});

describe("§148 — Shrm.tsx wires the picker between section 02 and the SPA pillars", () => {
  it("imports ShrmBookingPicker", () => {
    expect(shrmPage).toMatch(
      /import\s+ShrmBookingPicker\s+from\s+["']@\/components\/site\/ShrmBookingPicker["']/,
    );
  });

  it("renders <ShrmBookingPicker /> exactly once", () => {
    const occurrences = shrmPage.match(/<ShrmBookingPicker\s*\/>/g) ?? [];
    expect(occurrences).toHaveLength(1);
  });

  it("re-numbers the pillars section eyebrow to 03 so the booking picker takes the 02→03 slot", () => {
    // After the picker sits between section 02 and the pillars, the
    // pillars eyebrow must read 03 — otherwise the page would have
    // two sections labeled "02".
    expect(shrmPage).toMatch(/03 \u2014 Why we're worth the walk/);
  });

  it("re-numbers the virtual section to 04 and the final CTA section to 06", () => {
    expect(shrmPage).toMatch(/04 \u2014 Can't make it\?/);
    expect(shrmPage).toMatch(/06 \u2014 Final CTA/);
  });
});

describe("§148 — Contact.tsx reads ?slot= and threads it through", () => {
  it("imports getShrmSlot + formatShrmSlot", () => {
    expect(contactPage).toMatch(
      /from\s+["']@\/lib\/shrmSlots["']/,
    );
    expect(contactPage).toMatch(/getShrmSlot/);
    expect(contactPage).toMatch(/formatShrmSlot/);
  });

  it("parses ?slot= from the URL via params.get", () => {
    expect(contactPage).toMatch(/params\.get\(["']slot["']\)/);
  });

  it("memoizes prefillSlot via getShrmSlot(prefillSlotId)", () => {
    expect(contactPage).toMatch(/getShrmSlot\(prefillSlotId\s*\|\|\s*null\)/);
  });

  it("derives a human prefillSlotLabel from formatShrmSlot", () => {
    expect(contactPage).toMatch(/prefillSlotLabel\s*=\s*prefillSlot\s*\?\s*formatShrmSlot\(prefillSlot\)/);
  });

  it("forwards shrmSlotLabel into ContactSuccess", () => {
    expect(contactPage).toMatch(/shrmSlotLabel=\{prefillSlotLabel \|\| null\}/);
  });

  it("ContactSuccess accepts shrmSlotLabel as a typed prop", () => {
    expect(contactPage).toMatch(/shrmSlotLabel:\s*string\s*\|\s*null/);
  });

  it("Formspree payload carries shrmSlotId + shrmSlot when present", () => {
    expect(contactPage).toMatch(/shrmSlotId:\s*prefillSlot\.id/);
    expect(contactPage).toMatch(/shrmSlot:\s*formatShrmSlot\(prefillSlot\)/);
  });

  it("SHRM-lede prefers slot-specific copy when a slot is present", () => {
    // "lock in the {slot} slot at your SHRM 2026 booth (Booth 1619)…"
    expect(contactPage).toMatch(/lock in the \$\{formatShrmSlot\(prefillSlot\)\} slot/);
    expect(contactPage).toMatch(/Booth 1619/);
  });

  it("falls back to generic SHRM prefill when no slot is selected", () => {
    expect(contactPage).toMatch(/stopped by your booth at SHRM 2026/);
  });

  it("ContactSuccess weaves shrmSlotLabel into the SHRM-branch lede", () => {
    expect(contactPage).toMatch(/slotPhrase\s*=\s*fromShrm && shrmSlotLabel/);
    expect(contactPage).toMatch(/SHRM 2026 booth queue\$\{slotPhrase\}/);
  });
});

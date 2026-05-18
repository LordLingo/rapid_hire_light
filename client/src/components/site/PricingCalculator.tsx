/*
  Editorial Calm — Pricing calculator.
  Stateful estimator built on top of transparent, demo-only price assumptions
  (we surface the assumptions in the fine print so visitors don't mistake the
  estimate for a binding quote — that's still gated by the "Get this quote"
  CTA which routes to /get-a-quote pre-filled with the configuration. §111
  moved this from /contact to the dedicated quote page so calculator-driven
  intent lands on the Formspree mvzyoyoz form rather than the generic
  Contact xnjrqler form).

  Pricing model (illustrative, mirrors the public Pricing page tier story):
    Base SSN trace + nationwide criminal: $24 / check (Starter base)
    Each Add-on adds an incremental per-check fee.
    Package presets are just convenient bundles of those add-ons.
    Volume discounts apply per-check above 50 hires/month thresholds.
*/
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check, RotateCcw } from "lucide-react";
import {
  ADDONS,
  BASE_PER_CHECK,
  DEFAULT_HIRES,
  DEFAULT_PACKAGE,
  MAX_HIRES,
  MIN_HIRES,
  PACKAGES,
  type PackageId,
  buildEstimateQuery,
  clampHires,
  computeEstimate,
  isDefaultState,
  normalizeAddons,
  normalizePackage,
  parseEstimateFromQuery,
} from "@/lib/pricing";

/**
 * localStorage persistence for the calculator. Versioned key keeps us safe
 * against future schema changes — if the shape evolves, bump V to invalidate
 * older saved blobs gracefully (no migration logic, just fall back to defaults).
 */
const LS_KEY = "rh:calc:v1";
type PersistedState = {
  hires: number;
  pkg: PackageId | null;
  selected: string[];
};
function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (typeof parsed.hires !== "number" || !Array.isArray(parsed.selected)) {
      return null;
    }
    return {
      hires: clampHires(parsed.hires),
      pkg: normalizePackage(parsed.pkg),
      selected: normalizeAddons(parsed.selected),
    };
  } catch {
    return null;
  }
}

export type CalculatorEstimate = {
  perCheckNet: number;
  perCheckList: number;
  monthly: number;
  annual: number;
  hires: number;
  selected: string[];
  /** Currently active package preset (or null when the user has manually edited add-ons). */
  pkg: PackageId | null;
};

/**
 * Initial-state resolver with explicit precedence:
 *   1. URL query string (?v= / ?pkg= / ?adds=)  — sharable links win
 *   2. localStorage                              — returning visitor's last config
 *   3. Hard-coded defaults                       — first-time visitor
 *
 * Kept outside the component so the resolution rules are obvious and unit-
 * testable from one place.
 */
function resolveInitialState(): {
  hires: number;
  pkg: PackageId | null;
  selected: string[];
  source: "url" | "ls" | "defaults";
} {
  if (typeof window !== "undefined") {
    const fromUrl = parseEstimateFromQuery(window.location.search);
    if (fromUrl) return { ...fromUrl, source: "url" };
  }
  const fromLs = loadPersisted();
  if (fromLs) return { ...fromLs, source: "ls" };
  return {
    hires: DEFAULT_HIRES,
    pkg: DEFAULT_PACKAGE,
    selected: PACKAGES.find((p) => p.id === DEFAULT_PACKAGE)!.addons,
    source: "defaults",
  };
}

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function fmtMoney2(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PricingCalculator({
  onEstimateChange,
}: {
  onEstimateChange?: (e: CalculatorEstimate) => void;
} = {}) {
  // Resolve initial state once. Precedence: URL > localStorage > defaults.
  const initial = useMemo(() => resolveInitialState(), []);
  const [hires, setHires] = useState<number>(initial.hires);
  const [pkg, setPkg] = useState<PackageId | null>(initial.pkg);
  const [selected, setSelected] = useState<string[]>(initial.selected);

  // Persist any change back to localStorage. Mirror of the URL-sync rule:
  // the default state writes *nothing* and removes any stale blob, so a
  // visitor who clicks Reset doesn't carry a synthetic "defaults" payload
  // around in storage. Errors are intentionally swallowed (private mode /
  // quota / disabled storage) — the calculator must keep working.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (isDefaultState({ hires, pkg, selected })) {
        window.localStorage.removeItem(LS_KEY);
        return;
      }
      const payload: PersistedState = { hires, pkg, selected };
      window.localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [hires, pkg, selected]);

  // URL sync. Mirrors current state into the URL with replaceState (no history
  // entries) so the visible URL is always shareable. Skips writes when the
  // resulting query is identical to what's already there to avoid pointless
  // history churn during fast-typed input. When the state matches defaults,
  // `buildEstimateQuery` returns "" and we render a paramless URL.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = buildEstimateQuery({ hires, pkg, selected });
    const current = window.location.search.replace(/^\?/, "");
    if (next === current) return;
    const url = next === ""
      ? `${window.location.pathname}${window.location.hash}`
      : `${window.location.pathname}?${next}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [hires, pkg, selected]);

  function applyPackage(id: PackageId) {
    setPkg(id);
    setSelected(PACKAGES.find((p) => p.id === id)!.addons);
  }

  function toggleAddon(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setPkg(null); // any manual change escapes the preset (null = no exact match)
  }

  /**
   * Reset to first-visit defaults. The LS and URL effects both treat the
   * default state as "no payload," so simply rewinding state is enough —
   * the visible URL collapses to `/pricing` and the LS blob is removed.
   */
  function resetToDefaults() {
    setHires(DEFAULT_HIRES);
    setPkg(DEFAULT_PACKAGE);
    setSelected(PACKAGES.find((p) => p.id === DEFAULT_PACKAGE)!.addons);
  }

  const { perCheckList, perCheckNet, monthly, annual, discountPct, tier } =
    useMemo(() => computeEstimate(hires, selected), [hires, selected]);

  // Selected add-on objects, sorted to ADDONS display order
  const selectedAddons = useMemo(
    () => ADDONS.filter((a) => selected.includes(a.id)),
    [selected],
  );

  // Notify parent (Pricing page) of live estimate changes for tier-aware highlight.
  useEffect(() => {
    onEstimateChange?.({
      perCheckNet,
      perCheckList,
      monthly,
      annual,
      hires,
      selected,
      pkg,
    });
  }, [perCheckNet, perCheckList, monthly, annual, hires, selected, pkg, onEstimateChange]);

  // Build pre-filled query string for /get-a-quote (§111)
  const quoteQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.set("volume", String(hires));
    params.set("services", selected.join(","));
    const summary = `Calculator estimate: ~${hires} hires/mo · ${tier} tier · ~${fmtMoney2(perCheckNet)}/check · ~${fmtMoney(monthly)}/mo · ~${fmtMoney(annual)}/yr`;
    params.set("note", summary);
    return params.toString();
  }, [hires, selected, perCheckNet, monthly, annual, tier]);

  return (
    <section id="estimate" className="bg-white border-y border-border scroll-mt-24">
      <div className="container py-20 md:py-28">
        {/* Eyebrow + title row */}
        <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow">06 — Estimate</p>
            <div className="mt-3 hairline" />
          </div>
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
            <h2 className="font-display text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
              Estimate your{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                spend.
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-[1.8] text-[color:var(--color-ink-soft)]">
              Pick your monthly hiring volume, choose a package, and tweak the
              add-ons. The estimate updates live. When the configuration looks
              right, send it to our team for a written quote inside one
              business day.
            </p>
          </div>
        </div>

        {/* Calculator grid */}
        <div className="mt-14 grid grid-cols-12 gap-x-10 gap-y-10">
          {/* LEFT — controls */}
          <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
            {/* Monthly searches input. Replaces the prior range slider per user
                feedback ("the slider numbers don't match what you select; just
                let me type the number"). The +/- steppers cover quick fine
                adjustments without needing to focus the field. */}
            <div className="rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6 md:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <label htmlFor="calc-monthly-searches" className="eyebrow">
                    Monthly searches
                  </label>
                  <p className="mt-1 text-[13px] text-[color:var(--color-ink-soft)]">
                    How many background checks you run per month.
                  </p>
                </div>
                <div className="text-right">
                  <p className="eyebrow">Tier</p>
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-accent-ink)]">
                    <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
                    {tier}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setHires((h) => Math.max(MIN_HIRES, Math.min(MAX_HIRES, h - 1)))
                  }
                  aria-label="Decrease monthly searches by 1"
                  className="btn-press grid place-items-center size-12 shrink-0 rounded-[12px] border border-border bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                >
                  <span aria-hidden="true" className="text-[20px] leading-none">−</span>
                </button>
                <input
                  id="calc-monthly-searches"
                  type="number"
                  inputMode="numeric"
                  min={MIN_HIRES}
                  max={MAX_HIRES}
                  step={1}
                  value={hires}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return;
                    const n = Number(raw);
                    if (Number.isFinite(n)) setHires(clampHires(n));
                  }}
                  onBlur={(e) => setHires(clampHires(e.target.value))}
                  className="w-full flex-1 rounded-[12px] border border-border bg-white px-4 py-3 font-display text-[28px] leading-none tracking-[-0.01em] text-[color:var(--color-ink)] tabular-nums focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-ink)]/40 focus:border-[color:var(--color-accent-ink)]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setHires((h) => Math.max(MIN_HIRES, Math.min(MAX_HIRES, h + 1)))
                  }
                  aria-label="Increase monthly searches by 1"
                  className="btn-press grid place-items-center size-12 shrink-0 rounded-[12px] border border-border bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                >
                  <span aria-hidden="true" className="text-[20px] leading-none">+</span>
                </button>
              </div>

              {/* Quick volume jumps + discount hints. Static buttons replace the
                  earlier slider tick marks; they make the discount tiers easy
                  to compare without dragging. */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                  Quick set
                </span>
                {[
                  { v: 25, label: "25" },
                  { v: 50, label: "50 (−5%)" },
                  { v: 100, label: "100 (−10%)" },
                  { v: 200, label: "200 (−16%)" },
                  { v: 500, label: "500 (−22%)" },
                ].map(({ v, label }) => {
                  const active = hires === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setHires(v)}
                      className={[
                        "btn-press rounded-full border px-3 py-1.5 text-[12px] tabular-nums transition-colors",
                        active
                          ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                          : "border-border bg-white text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[11.5px] text-[color:var(--color-ink-muted)]">
                  Volume discounts kick in at 50, 100, 200, and 500 searches per month.
                </p>
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="btn-press inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-[11.5px] text-[color:var(--color-ink-soft)] hover:border-border hover:text-[color:var(--color-accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)]/40"
                  aria-label="Reset estimate to defaults"
                  title="Restore the default Standard package at 40 monthly searches"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Reset to defaults
                </button>
              </div>
            </div>

            {/* Package picker */}
            <div className="mt-8">
              <p className="eyebrow">Choose a package</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PACKAGES.map((p) => {
                  const active = pkg === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPackage(p.id)}
                      className={[
                        "btn-press text-left rounded-[14px] border p-4 transition-colors duration-200",
                        active
                          ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-paper)]"
                          : "border-border bg-white hover:border-[color:var(--color-accent-ink)]",
                      ].join(" ")}
                    >
                      <span className="flex items-center justify-between">
                        <span className="font-display text-[18px] tracking-tight text-[color:var(--color-ink)]">
                          {p.label}
                        </span>
                        {active && (
                          <span className="grid place-items-center size-5 rounded-full bg-[color:var(--color-accent-ink)] text-white">
                            <Check className="size-3" strokeWidth={2.4} />
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-[12.5px] text-[color:var(--color-ink-muted)] leading-snug">
                        {p.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add-ons */}
            <div className="mt-8">
              <p className="eyebrow">Add-ons</p>
              <p className="mt-1 text-[12px] text-[color:var(--color-ink-muted)]">
                Stack only what you need — pricing per check, no commitments.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ADDONS.map((a) => {
                  const active = selected.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAddon(a.id)}
                      className={[
                        "btn-press inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition-colors duration-200",
                        active
                          ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                          : "border-border bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)]",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      <span>{a.label}</span>
                      <span
                        className={[
                          "tabular-nums text-[11.5px]",
                          active
                            ? "text-white/85"
                            : "text-[color:var(--color-ink-muted)]",
                        ].join(" ")}
                      >
                        +${a.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — totals */}
          <aside className="col-span-12 lg:col-span-5 reveal-on-scroll">
            <div className="rounded-[20px] border border-[color:var(--color-accent-ink)] bg-[color:var(--color-paper)] p-7 md:p-9 paper-shadow">
              <p className="eyebrow">Estimate</p>
              <div className="mt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px] text-[color:var(--color-ink-soft)]">
                    Per check
                  </span>
                  <span className="text-right">
                    {discountPct > 0 && (
                      <span className="mr-2 text-[12.5px] line-through text-[color:var(--color-ink-muted)] tabular-nums">
                        {fmtMoney2(perCheckList)}
                      </span>
                    )}
                    <span className="font-display text-[28px] leading-none tracking-[-0.01em] text-[color:var(--color-ink)] tabular-nums">
                      {fmtMoney2(perCheckNet)}
                    </span>
                  </span>
                </div>
                {discountPct > 0 && (
                  <p className="mt-2 text-right text-[12px] text-[color:var(--color-accent-ink-strong)]">
                    Volume discount applied · −{discountPct.toFixed(0)}%
                  </p>
                )}
              </div>

              <div className="mt-6 hairline" />

              {/* Live “Included in this quote” preview */}
              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">Included in this quote</p>
                  <p className="text-[11.5px] text-[color:var(--color-ink-muted)] tabular-nums">
                    {1 + selectedAddons.length} {1 + selectedAddons.length === 1 ? "screen" : "screens"}
                  </p>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {/* Always-on base */}
                  <li className="flex items-start justify-between gap-3 text-[13px]">
                    <span className="flex items-start gap-2.5 text-[color:var(--color-ink)]">
                      <span className="mt-[5px] grid place-items-center size-4 shrink-0 rounded-full border border-[color:var(--color-accent-ink)] text-[color:var(--color-accent-ink)]">
                        <Check className="size-2.5" strokeWidth={2.4} />
                      </span>
                      <span className="leading-snug">
                        SSN trace + nationwide criminal
                        <span className="ml-1.5 text-[11px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                          Base
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums text-[color:var(--color-ink-muted)]">
                      ${BASE_PER_CHECK}
                    </span>
                  </li>

                  {selectedAddons.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-start justify-between gap-3 text-[13px] reveal-on-scroll"
                    >
                      <span className="flex items-start gap-2.5 text-[color:var(--color-ink)]">
                        <span className="mt-[5px] grid place-items-center size-4 shrink-0 rounded-full border border-[color:var(--color-accent-ink)] text-[color:var(--color-accent-ink)]">
                          <Check className="size-2.5" strokeWidth={2.4} />
                        </span>
                        <span className="leading-snug">{a.label}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-[color:var(--color-ink-muted)]">
                        +${a.price}
                      </span>
                    </li>
                  ))}

                  {selectedAddons.length === 0 && (
                    <li className="text-[12.5px] italic text-[color:var(--color-ink-muted)] pl-6">
                      No add-ons selected — just the base check.
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-6 hairline" />

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="eyebrow">Monthly</p>
                  <p className="mt-2 font-display text-[34px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)] tabular-nums">
                    {fmtMoney(monthly)}
                  </p>
                  <p className="mt-1 text-[11.5px] text-[color:var(--color-ink-muted)]">
                    {hires.toLocaleString()} checks / mo
                  </p>
                </div>
                <div>
                  <p className="eyebrow">Annual</p>
                  <p className="mt-2 font-display text-[34px] leading-none tracking-[-0.02em] text-[color:var(--color-accent-ink)] tabular-nums">
                    {fmtMoney(annual)}
                  </p>
                  <p className="mt-1 text-[11.5px] text-[color:var(--color-ink-muted)]">
                    {(hires * 12).toLocaleString()} checks / yr
                  </p>
                </div>
              </div>

              <Link
                href={`/get-a-quote?${quoteQuery}`}
                data-testid="calculator-quote-cta"
                className="mt-8 btn-press inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Get this quote in writing
                <ArrowUpRight className="size-4" />
              </Link>

              <p className="mt-5 text-[11.5px] leading-relaxed text-[color:var(--color-ink-muted)]">
                Estimate only. Final pricing depends on jurisdiction mix, court
                access fees, and volume — typically{" "}
                <span className="text-[color:var(--color-ink-soft)]">
                  within 10% of this number
                </span>{" "}
                for U.S. domestic packages. Court access and lab fees are
                passed through at cost.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

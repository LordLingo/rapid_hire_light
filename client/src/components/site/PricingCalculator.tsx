/*
  Editorial Calm — Pricing calculator.
  Stateful estimator built on top of transparent, demo-only price assumptions
  (we surface the assumptions in the fine print so visitors don't mistake the
  estimate for a binding quote — that's still gated by the "Get this quote"
  CTA which routes to /contact pre-filled with the configuration).

  Pricing model (illustrative, mirrors the public Pricing page tier story):
    Base SSN trace + nationwide criminal: $24 / check (Starter base)
    Each Add-on adds an incremental per-check fee.
    Package presets are just convenient bundles of those add-ons.
    Volume discounts apply per-check above 50 hires/month thresholds.
*/
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check } from "lucide-react";

type Addon = { id: string; label: string; price: number };

const ADDONS: Addon[] = [
  { id: "county", label: "Additional county criminal (per jurisdiction)", price: 8 },
  { id: "federal", label: "Federal criminal", price: 10 },
  { id: "mvr", label: "Motor Vehicle Report (MVR)", price: 9 },
  { id: "drug5", label: "Drug screen — 5 panel", price: 38 },
  { id: "education", label: "Education verification", price: 14 },
  { id: "employment", label: "Employment verification (per employer)", price: 14 },
  { id: "intl", label: "International criminal", price: 55 },
  { id: "credit", label: "Credit report (FCRA)", price: 16 },
  { id: "social", label: "Social media screening", price: 12 },
  { id: "monitoring", label: "Continuous monitoring (annualized)", price: 6 },
];

type PackageId = "basic" | "standard" | "comprehensive";
const PACKAGES: { id: PackageId; label: string; sub: string; addons: string[] }[] = [
  {
    id: "basic",
    label: "Basic",
    sub: "Identity + nationwide criminal",
    addons: [],
  },
  {
    id: "standard",
    label: "Standard",
    sub: "Adds county + employment + education",
    addons: ["county", "employment", "education"],
  },
  {
    id: "comprehensive",
    label: "Comprehensive",
    sub: "Adds federal, MVR, drug, monitoring",
    addons: ["county", "federal", "employment", "education", "mvr", "drug5", "monitoring"],
  },
];

const BASE_PER_CHECK = 24; // SSN trace + nationwide criminal — Starter base

/** Tiered volume discount applied to per-check total. */
function volumeDiscount(hiresPerMonth: number) {
  if (hiresPerMonth >= 500) return 0.22;
  if (hiresPerMonth >= 200) return 0.16;
  if (hiresPerMonth >= 100) return 0.1;
  if (hiresPerMonth >= 50) return 0.05;
  return 0;
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

export default function PricingCalculator() {
  const [hires, setHires] = useState(40);
  const [pkg, setPkg] = useState<PackageId>("standard");
  const [selected, setSelected] = useState<string[]>(
    PACKAGES.find((p) => p.id === "standard")!.addons,
  );

  function applyPackage(id: PackageId) {
    setPkg(id);
    setSelected(PACKAGES.find((p) => p.id === id)!.addons);
  }

  function toggleAddon(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setPkg("basic"); // any manual change escapes the preset; left as Basic visually
  }

  const { perCheckList, perCheckNet, monthly, annual, discountPct, tier } = useMemo(() => {
    const addonTotal = selected.reduce(
      (sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price ?? 0),
      0,
    );
    const list = BASE_PER_CHECK + addonTotal;
    const d = volumeDiscount(hires);
    const net = list * (1 - d);
    const m = net * hires;
    const a = m * 12;
    const t = hires < 50 ? "Starter" : "Volume";
    return {
      perCheckList: list,
      perCheckNet: net,
      monthly: m,
      annual: a,
      discountPct: d * 100,
      tier: t,
    };
  }, [hires, selected]);

  // Selected add-on objects, sorted to ADDONS display order
  const selectedAddons = useMemo(
    () => ADDONS.filter((a) => selected.includes(a.id)),
    [selected],
  );

  // Build pre-filled query string for /contact
  const quoteQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.set("volume", String(hires));
    params.set("services", selected.join(","));
    const summary = `Calculator estimate: ~${hires} hires/mo · ${tier} tier · ~${fmtMoney2(perCheckNet)}/check · ~${fmtMoney(monthly)}/mo · ~${fmtMoney(annual)}/yr`;
    params.set("note", summary);
    return params.toString();
  }, [hires, selected, perCheckNet, monthly, annual, tier]);

  return (
    <section className="bg-white border-y border-border">
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
            {/* Volume slider */}
            <div className="rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6 md:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">Monthly hires</p>
                  <p className="mt-2 font-display text-[40px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)]">
                    {hires.toLocaleString()}
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

              <input
                type="range"
                min={1}
                max={1000}
                step={1}
                value={hires}
                onChange={(e) => setHires(Number(e.target.value))}
                className="calc-range mt-6 w-full"
                aria-label="Monthly hires"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                <span>1</span>
                <span>50</span>
                <span>200</span>
                <span>500</span>
                <span>1,000+</span>
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
                href={`/contact?${quoteQuery}`}
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

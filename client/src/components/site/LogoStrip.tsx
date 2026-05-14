/*
  Editorial Calm — logo strip
  Quiet wordmarks in slate-300, separated by hairline rules instead of gaps,
  drifting at half normal marquee speed for restraint.
*/
const CLIENTS = [
  "H&R Block",
  "Frito-Lay",
  "Kraft",
  "TaylorMade",
  "Meadow Gold",
  "Pepsi",
];

export default function LogoStrip() {
  const loop = [...CLIENTS, ...CLIENTS, ...CLIENTS];
  return (
    <section aria-label="Trusted by" className="border-y border-border bg-white">
      <div className="container py-10">
        <div className="grid grid-cols-12 items-center gap-6">
          <div className="col-span-12 md:col-span-3">
            <p className="eyebrow">Trusted by high-volume hiring teams</p>
          </div>
          <div className="col-span-12 md:col-span-9 overflow-hidden relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10"
            />
            <div className="marquee-track flex w-max items-center">
              {loop.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="font-display text-[22px] tracking-tight text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-ink)] transition-colors duration-300 px-8 whitespace-nowrap"
                  style={{ fontWeight: 400 }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

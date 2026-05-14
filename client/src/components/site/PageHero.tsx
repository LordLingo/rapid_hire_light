/*
  Editorial Calm — page hero
  Compact masthead used on inner pages. Numbered eyebrow rail on the left,
  large Fraunces headline + body lede on the right. No image, lots of
  whitespace, soft halo wash.
*/
type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
};

export default function PageHero({ eyebrow, title, lede }: Props) {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.85 0.12 250 / 0.6), transparent 70%)",
        }}
      />
      <div className="container relative pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow">{eyebrow}</p>
            <div className="mt-3 hairline" />
          </div>
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
            <h1 className="font-display text-[44px] sm:text-[60px] md:text-[80px] leading-[1.04] tracking-[-0.025em] text-[color:var(--color-ink)] max-w-4xl">
              {title}
            </h1>
            <p className="mt-7 max-w-2xl text-[16.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              {lede}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

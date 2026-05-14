/*
  Editorial Calm — page hero
  Compact masthead used on inner pages. Numbered eyebrow rail on the left,
  large Fraunces headline + body lede on the right.

  Optional `image` prop adds a framed editorial photograph to the right
  column on lg+ screens, matching the WhyUs treatment (rounded-18 +
  paper-shadow + hairline border). When no image is passed, the hero
  falls back to the original text-only layout used by Privacy/Terms.
*/
type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  image?: string;
  imageAlt?: string;
};

export default function PageHero({ eyebrow, title, lede, image, imageAlt }: Props) {
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
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow">{eyebrow}</p>
            <div className="mt-3 hairline" />
          </div>

          {image ? (
            <>
              <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
                <h1 className="font-display text-[40px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-[-0.025em] text-[color:var(--color-ink)]">
                  {title}
                </h1>
                <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {lede}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
                <div className="overflow-hidden rounded-[18px] border border-border paper-shadow bg-white">
                  <img
                    src={image}
                    alt={imageAlt ?? ""}
                    className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[420px] object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h1 className="font-display text-[44px] sm:text-[60px] md:text-[80px] leading-[1.04] tracking-[-0.025em] text-[color:var(--color-ink)] max-w-4xl">
                {title}
              </h1>
              <p className="mt-7 max-w-2xl text-[16.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {lede}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

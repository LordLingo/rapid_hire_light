/*
  Editorial Calm — Stop Gambling
  Asymmetric: numbered eyebrow on left rail, big serif headline + two body
  paragraphs on right column, italic accent on "compliance".
*/
export default function StopGambling() {
  return (
    <section className="relative bg-[color:var(--color-paper)]">
      <div className="container py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow">02 — The problem</p>
            <div className="mt-3 hairline" />
          </div>
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
            <h2 className="font-display text-[44px] leading-[1.04] tracking-[-0.025em] text-[color:var(--color-ink)] sm:text-[60px] md:text-[76px]">
              Stop gambling with{" "}
              <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                compliance.
              </span>
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl">
              <p className="text-[16.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                If you&apos;re hiring at scale, you&apos;re probably spending
                too much time chasing candidate consent forms and deciphering
                court records.
              </p>
              <p className="text-[16.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                This manual work leaves you vulnerable to costly errors and
                lawsuits, not to mention slow turnaround times that cost you
                talent.
              </p>
            </div>
            <p className="mt-10 font-display italic text-[24px] md:text-[28px] text-[color:var(--color-ink-muted)]">
              There&apos;s got to be a better way…
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

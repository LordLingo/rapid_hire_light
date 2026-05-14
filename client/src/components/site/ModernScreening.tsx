/*
  Editorial Calm — "Modern screening, built for speed"
  Large editorial display sentence with italic accent on "speed", hairline
  rule above and below, single ink CTA. No box, no gradient.
*/
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ModernScreening() {
  return (
    <section className="bg-white border-y border-border">
      <div className="container py-24 md:py-32 grain">
        <div className="reveal-on-scroll relative">
          <p className="eyebrow text-center">06 — In summary</p>
          <h2 className="mt-6 font-display text-center text-[44px] sm:text-[64px] md:text-[88px] lg:text-[104px] leading-[0.98] tracking-[-0.025em] text-[color:var(--color-ink)]">
            Modern screening,{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)] block md:inline">
              built for speed.
            </span>
          </h2>
          <div className="mt-10 flex justify-center">
            <Link
              href="/contact"
              className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
            >
              Start Screening
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
  Editorial Calm — Switch CTA banner
  Two-column horizontal banner with hairline frame and ink button.
*/
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function CtaBanner() {
  return (
    <section className="relative bg-[color:var(--color-paper)]">
      <div className="container py-20 md:py-24">
        <div className="reveal-on-scroll relative grid grid-cols-12 gap-6 rounded-[20px] border border-border bg-white px-6 md:px-10 py-10 md:py-14 paper-shadow overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.82 0.09 250 / 0.6), transparent 70%)",
            }}
          />
          <div className="col-span-12 md:col-span-8 relative">
            <p className="eyebrow">06 — Switch</p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[42px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
              Ready to switch to{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                Rapid Hire Solutions?
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Great service matters. Switching is the easiest decision
              you&apos;ll make.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end items-end relative">
            <button
              onClick={() => toast("See how it works — preview only")}
              className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)] bg-white px-6 py-3.5 text-[14px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)] hover:text-white"
            >
              See how it works
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

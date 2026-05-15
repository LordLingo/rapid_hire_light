/*
  Editorial Calm — Switch CTA banner (dark gradient variant).

  Design intent
    - Anchor the bottom of the homepage with a dark surface that
      visually rhymes with the site footer just below it. The gradient
      runs left-to-right: starts at --color-footer (the deep ink-cobalt
      used by the footer surface) and lightens to --color-footer-soft
      (one step lighter, same hue family) so the right edge feels open
      and invites the eye toward the action button.
    - Type is inverted to use the same warm-white / cobalt-tinted
      foreground tokens already proven on the footer, so contrast and
      hue are guaranteed AA across the gradient.
    - The accent halo (sky blue, --color-accent-halo) carries the
      italic in the headline + the button border on dark, the same
      treatment used by the footer brand wordmark, so the two surfaces
      read as one continuous dark band.

  Tokens (defined in client/src/index.css)
      --color-footer            #1a1f2c-ish (deep ink-cobalt)
      --color-footer-soft       one step lighter
      --color-footer-foreground warm white text
      --color-footer-muted      secondary copy
      --color-accent-halo       sky-blue accent for emphasis on dark
*/
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CtaBanner() {
  return (
    <section className="relative bg-[color:var(--color-paper)]">
      <div className="container py-20 md:py-24">
        <div
          className="reveal-on-scroll relative grid grid-cols-12 gap-6 rounded-[20px] border border-[color:var(--color-footer-border)] px-6 md:px-10 py-10 md:py-14 paper-shadow overflow-hidden text-[color:var(--color-footer-foreground)]"
          style={{
            // Dark on the left, lighter on the right. Both stops live in
            // the same hue family as the footer so the redesigned card
            // feels like a continuation of the footer treatment.
            backgroundImage:
              "linear-gradient(90deg, var(--color-footer) 0%, var(--color-footer) 35%, var(--color-footer-soft) 100%)",
            colorScheme: "dark",
          }}
        >
          {/* Soft halo behind the headline copy — same accent halo the
              footer brand link uses, kept very subtle so it doesn't
              compete with the button. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, var(--color-accent-halo), transparent 70%)",
            }}
          />
          <div className="col-span-12 md:col-span-8 relative">
            <p className="eyebrow text-[color:var(--color-footer-muted)]">
              05 — Switch
            </p>
            <h2 className="mt-4 font-display text-[34px] sm:text-[42px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-footer-foreground)]">
              Ready to switch to{" "}
              <span className="italic font-light text-[color:var(--color-accent-halo)]">
                Rapid Hire Solutions?
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-footer-soft-text)]">
              Great service matters. Switching is the easiest decision
              you&apos;ll make.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end items-end relative">
            {/*
              On the dark surface the button now uses the warm-white
              foreground (footer foreground) as its fill so it reads
              with maximum punch against the cobalt gradient. Hover
              swaps to the brighter sky halo, mirroring the footer
              link interaction.
            */}
            <Link
              href="/integrations"
              className="btn-press inline-flex items-center gap-2 rounded-full border border-[color:var(--color-footer-foreground)] bg-[color:var(--color-footer-foreground)] px-6 py-3.5 text-[14px] font-medium text-[color:var(--color-footer)] hover:bg-[color:var(--color-accent-halo)] hover:border-[color:var(--color-accent-halo)] hover:text-[color:var(--color-footer)]"
            >
              See how it works
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

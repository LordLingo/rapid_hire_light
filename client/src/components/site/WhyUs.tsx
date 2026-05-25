/*
  Editorial Calm — Why HR & Staffing Teams Choose Rapid Hire Solutions
  Layout: photo on the left with rotating "Why Us" badge overlay (light
  variant — slate text on white). Right column: section meta + 3 stacked
  features separated by hairline rules with single-line line-icons.
*/
import { Clock, Sparkles, ShieldCheck } from "lucide-react";

const POINTS = [
  {
    icon: Sparkles,
    title: "Get faster, clearer results",
    body:
      "We turn background checks around in hours, not days, with easy-to-read reports your hiring managers can act on immediately.",
  },
  {
    icon: Clock,
    title: "Save time for your recruiters",
    body:
      "Automated workflows, candidate self-service links, and status alerts mean less chasing paperwork and more time actually filling roles.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted customer support",
    body:
      "Our clients stay long term because our U.S.-based, FCRA-certified team delivers fast, accurate, reliable support — no tickets, no overseas delays, just experts who know your business and have your back.",
  },
];

export default function WhyUs() {
  return (
    <section id="why" className="relative bg-white border-y border-border">
      <div className="container py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-8 gap-y-14">
          {/* Image with badge */}
          <div className="col-span-12 lg:col-span-5 reveal-on-scroll">
            <div className="relative">
              <div className="hover-zoom-image rounded-[18px] border border-border paper-shadow">
                <img
                  src="/static/why_us_interview.webp"
                  alt="A hiring manager shaking hands with a candidate at a sunlit office, with a HIRED sign on the desk."
                  className="w-full h-[420px] md:h-[520px] object-cover"
                  loading="lazy"
                />
              </div>
              <Badge />
            </div>
          </div>

          {/* Content column */}
          <div className="col-span-12 lg:col-span-1 hidden lg:block" />

          <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
            <p className="eyebrow">03 — Why HR & Staffing teams choose us</p>
            <h2 className="mt-5 font-display text-[36px] sm:text-[44px] md:text-[52px] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink)]">
              Built for the teams who can&apos;t afford a{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                bad hire.
              </span>
            </h2>

            <div className="mt-10 grid">
              {POINTS.map((p, i) => (
                <div
                  key={p.title}
                  className={[
                    "grid grid-cols-[44px_1fr] gap-5 py-7",
                    i === 0 ? "" : "border-t border-border",
                  ].join(" ")}
                >
                  <div className="flex items-start">
                    <div className="grid place-items-center size-10 rounded-full border border-border bg-[color:var(--color-paper)]">
                      <p.icon className="size-4 text-[color:var(--color-accent-ink)]" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-[22px] leading-snug text-[color:var(--color-ink)]">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-[15.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge() {
  // Light variant of the rotating "Why Us" sticker; slate text on white,
  // pinned to the bottom-right corner of the photo.
  return (
    <div className="absolute -bottom-7 -right-6 md:-right-8 grid place-items-center">
      <div className="relative size-[120px] md:size-[140px] rounded-full bg-white border border-border paper-shadow grid place-items-center">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 badge-spin text-[color:var(--color-ink-muted)]"
          aria-hidden
        >
          <defs>
            <path
              id="why-circle"
              d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
            />
          </defs>
          <text
            fontFamily="Inter, sans-serif"
            fontSize="13"
            fontWeight="500"
            letterSpacing="3.6"
            fill="currentColor"
          >
            <textPath href="#why-circle">
              WHY US · WHY US · WHY US · WHY US ·
            </textPath>
          </text>
        </svg>
        <span className="font-display text-[20px] md:text-[24px] tracking-[-0.01em] text-[color:var(--color-accent-ink)]">
          RHS
        </span>
      </div>
    </div>
  );
}

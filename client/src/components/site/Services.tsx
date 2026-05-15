/*
  Editorial Calm — Services
  Asymmetric varying-row grid (2/3/2 layout on desktop) with hairline-only
  card frames and ink hover state. "Learn more" uses ink-link underline,
  not a colored button.
*/
import {
  BriefcaseBusiness,
  Gavel,
  FlaskConical,
  GraduationCap,
  Car,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "wouter";

const SERVICES = [
  {
    icon: BriefcaseBusiness,
    title: "Employment Screening",
    body:
      "Effortlessly streamline your hiring with verified employment history, gap analysis, and reference checks.",
  },
  {
    icon: Gavel,
    title: "Criminal Records",
    body:
      "Comprehensive federal, state, and county criminal history searches to ensure workplace safety.",
  },
  {
    icon: FlaskConical,
    title: "Drug & Health",
    body:
      "Fast and reliable 5, 10, and 12-panel drug testing plus occupational health screening services.",
  },
  {
    icon: GraduationCap,
    title: "Education Verification",
    body:
      "Instantly verify degrees, diplomas, and technical certifications directly with institutions.",
  },
  {
    icon: Car,
    title: "Motor Vehicle Reports (MVR)",
    body:
      "Check driving records in real-time across all 50 states for positions involving company vehicles.",
  },
  {
    icon: Globe,
    title: "Social Media Checks",
    body:
      "Compliant screening of public online behavior to identify potential behavioral risks.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-white border-t border-border">
      <div className="container py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
            <p className="eyebrow">05 — Services</p>
            <div className="mt-3 hairline" />
          </div>
          <div className="col-span-12 lg:col-span-7 reveal-on-scroll">
            <h2 className="font-display text-[40px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
              Our{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                services.
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-[16.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Comprehensive background screening services tailored to elevate
              your hiring process and boost your team&apos;s success.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 lg:text-right reveal-on-scroll">
            <Link
              href="/services"
              className="ink-link inline-flex items-center gap-1.5 text-[13.5px] text-[color:var(--color-ink)]"
            >
              All services
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-6">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className={[
                "hover-lift-card reveal-on-scroll group relative rounded-[16px] border border-border bg-white p-6 md:p-7",
                // varying widths to break grid monotony
                i % 5 === 0
                  ? "col-span-12 md:col-span-6 lg:col-span-5"
                  : i % 5 === 1
                  ? "col-span-12 md:col-span-6 lg:col-span-4"
                  : i % 5 === 2
                  ? "col-span-12 md:col-span-6 lg:col-span-3"
                  : i % 5 === 3
                  ? "col-span-12 md:col-span-6 lg:col-span-4"
                  : "col-span-12 md:col-span-6 lg:col-span-4",
              ].join(" ")}
              style={{
                gridColumn:
                  i === 2 ? "span 12 / span 12" : undefined,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid place-items-center size-10 rounded-full border border-border text-[color:var(--color-accent-ink)] group-hover:bg-[color:var(--color-tint)] transition-colors duration-300">
                  <s.icon className="size-4" strokeWidth={1.4} />
                </div>
                <span className="eyebrow text-[10px]">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-[24px] leading-tight text-[color:var(--color-ink)]">
                {s.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {s.body}
              </p>
              <Link
                href="/services"
                className="ink-link mt-6 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
              >
                Learn more
                <ArrowUpRight className="size-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

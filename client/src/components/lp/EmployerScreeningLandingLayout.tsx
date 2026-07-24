import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmployerLeadForm from "@/components/lp/EmployerLeadForm";
import type {
  EmployerScreeningLandingPageConfig,
  LandingLink,
  LandingSection,
} from "@/content/employerScreeningLandingPages";
import "./employer-screening-landing.css";

interface EmployerScreeningLandingLayoutProps {
  readonly config: EmployerScreeningLandingPageConfig;
}

function gridColumns(columns: LandingSection["columns"]): string {
  if (columns === 4) return "md:grid-cols-2 xl:grid-cols-4";
  if (columns === 3) return "md:grid-cols-2 lg:grid-cols-3";
  return "md:grid-cols-2";
}

function ActionLink({
  link,
  primary = false,
}: {
  readonly link: LandingLink;
  readonly primary?: boolean;
}) {
  const className = primary
    ? "lp-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[color:var(--color-accent-ink-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2 motion-reduce:transition-none"
    : "lp-cta inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-[14px] font-medium text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2 motion-reduce:transition-none";

  if (link.href.startsWith("#")) {
    return (
      <a href={link.href} className={className}>
        {link.label}
        <ArrowRight aria-hidden="true" className="lp-cta-arrow size-4" />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
      <ArrowRight aria-hidden="true" className="lp-cta-arrow size-4" />
    </Link>
  );
}

function LandingSectionBlock({
  section,
  index,
}: {
  readonly section: LandingSection;
  readonly index: number;
}) {
  const isSample = section.kind === "sample";
  const sectionBg = isSample
    ? "bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
    : index % 2 === 0
      ? "bg-white text-[color:var(--color-ink)]"
      : "bg-[color:var(--color-paper)] text-[color:var(--color-ink)]";
  const bodyColor = isSample
    ? "text-[color:var(--color-footer-soft-text)]"
    : "text-[color:var(--color-ink-soft)]";

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className={`border-t border-border ${sectionBg}`}
      data-section={section.id}
    >
      <div
        className="container py-16 md:py-20 lg:py-24"
        data-lp-reveal
      >
        <div className={isSample ? "max-w-3xl" : "max-w-4xl"}>
          <h2
            id={`${section.id}-heading`}
            className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[42px] lg:text-[50px]"
          >
            {section.heading}
          </h2>
          {section.intro && (
            <p className={`mt-5 text-[16px] leading-[1.75] ${bodyColor}`}>
              {section.intro}
            </p>
          )}
          {section.body && section.kind !== "cards" && (
            <p className={`mt-5 text-[16px] leading-[1.75] ${bodyColor}`}>
              {section.body}
            </p>
          )}
        </div>

        {section.items && section.items.length > 0 && (
          <div
            className={`mt-10 grid grid-cols-1 gap-4 ${gridColumns(section.columns)}`}
          >
            {section.items.map((item) => (
              <article
                key={item.title}
                className="rounded-[20px] border border-border bg-white p-6 shadow-[0_14px_45px_-38px_rgba(15,23,42,0.38)]"
              >
                <h3 className="font-display text-[23px] leading-tight text-[color:var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        )}

        {section.body && section.kind === "cards" && (
          <p className={`mt-8 max-w-4xl text-[16px] leading-[1.75] ${bodyColor}`}>
            {section.body}
          </p>
        )}

        {section.steps && section.steps.length > 0 && (
          <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {section.steps.map((step, stepIndex) => (
              <li
                key={step}
                className="flex gap-4 rounded-[18px] border border-border bg-white p-5 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]"
              >
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-[color:var(--color-tint)] text-[12px] font-semibold text-[color:var(--color-accent-ink)]"
                >
                  {stepIndex + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}

        {section.bullets && section.bullets.length > 0 && (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {section.bullets.map((bullet) => (
              <li
                key={bullet}
                className="rounded-[16px] border border-border bg-white px-5 py-4 text-[15px] leading-[1.6] text-[color:var(--color-ink-soft)]"
              >
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {section.disclaimer && (
          <p
            className={`mt-7 max-w-4xl text-[14px] leading-[1.7] ${bodyColor}`}
          >
            {section.disclaimer}
          </p>
        )}

        {(section.links?.length || section.cta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {section.links?.map((link) => (
              <ActionLink key={`${link.href}-${link.label}`} link={link} />
            ))}
            {section.cta && (
              <ActionLink link={section.cta} primary={isSample} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function EmployerScreeningLandingLayout({
  config,
}: EmployerScreeningLandingLayoutProps) {
  const pageRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    page.classList.add("lp-motion-ready");
    const sections = Array.from(
      page.querySelectorAll<HTMLElement>("[data-lp-reveal]"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      sections.forEach((section) => section.classList.add("is-visible"));
      return () => page.classList.remove("lp-motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      page.classList.remove("lp-motion-ready");
    };
  }, [config.route]);

  return (
    <div
      ref={pageRef}
      className="lp-page min-h-screen overflow-x-clip bg-[color:var(--color-paper)] text-[color:var(--color-ink)]"
    >
      <header className="border-b border-border bg-[color:var(--color-paper)]">
        <div className="container flex min-h-24 items-center py-4">
          <img
            src="/static/rhs5-color-trimmed.png"
            alt="Rapid Hire Solutions"
            className="h-14 w-auto sm:h-16"
          />
        </div>
      </header>

      <main id="main-content">
        <section
          aria-labelledby="landing-page-heading"
          className="relative overflow-hidden bg-[color:var(--color-paper)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-44 size-[520px] rounded-full bg-[color:var(--color-tint)] opacity-80 blur-3xl"
          />
          <div className="container relative grid grid-cols-1 gap-12 py-14 md:py-18 lg:grid-cols-12 lg:gap-10 lg:py-20">
            <div className="lg:col-span-7 lg:pr-6">
              <p className="lp-hero-item lp-hero-delay-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent-ink)]">
                {config.eyebrow}
              </p>
              <h1
                id="landing-page-heading"
                className="lp-hero-item lp-hero-delay-2 mt-5 max-w-4xl font-display text-[43px] leading-[1.02] tracking-[-0.03em] text-[color:var(--color-ink)] sm:text-[55px] lg:text-[68px]"
              >
                {config.h1}
              </h1>
              <p className="lp-hero-item lp-hero-delay-3 mt-6 max-w-3xl text-[20px] leading-[1.55] text-[color:var(--color-ink)] sm:text-[22px]">
                {config.subhead}
              </p>
              <p className="lp-hero-item lp-hero-delay-4 mt-5 max-w-2xl text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                {config.supporting}
              </p>
              <a
                href="#lead-form"
                className="lp-cta lp-hero-item lp-hero-delay-5 mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[color:var(--color-accent-ink-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                {config.cta}
                <ArrowRight aria-hidden="true" className="lp-cta-arrow size-4" />
              </a>
              <p className="lp-hero-item lp-hero-delay-6 mt-7 max-w-3xl border-l-2 border-[color:var(--color-accent-ink)] pl-4 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-muted)]">
                {config.caveat}
              </p>
              <div className="lp-hero-item lp-hero-delay-7 lp-hero-visual mt-8 overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)]">
                <img
                  src={config.heroVisual.src}
                  alt={config.heroVisual.alt}
                  width={config.heroVisual.width}
                  height={config.heroVisual.height}
                  loading="eager"
                  decoding="async"
                  className="block aspect-[3/2] w-full object-contain"
                />
              </div>
            </div>
            <div className="lp-hero-item lp-hero-delay-3 lp-hero-form lg:col-span-5">
              <EmployerLeadForm config={config} />
            </div>
          </div>
        </section>

        {config.sections.map((section, index) => (
          <LandingSectionBlock
            key={section.id}
            section={section}
            index={index}
          />
        ))}

        <section
          aria-labelledby="landing-faq-heading"
          className="border-t border-border bg-white"
        >
          <div
            className="container grid grid-cols-1 gap-10 py-16 md:py-20 lg:grid-cols-12 lg:py-24"
            data-lp-reveal
          >
            <div className="lg:col-span-4">
              <h2
                id="landing-faq-heading"
                className="font-display text-[42px] leading-tight tracking-[-0.02em] text-[color:var(--color-ink)]"
              >
                FAQ
              </h2>
            </div>
            <div className="lg:col-span-8">
              <Accordion type="single" collapsible className="w-full">
                {config.faq.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`faq-${index}`}
                    className="border-border"
                  >
                    <AccordionTrigger className="min-h-12 py-5 text-[16px] leading-[1.5] text-[color:var(--color-ink)] hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pr-8 text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="landing-final-cta-heading"
          className="border-t border-[color:var(--color-footer-border)] bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]"
        >
          <div
            className="container py-16 text-center md:py-20 lg:py-24"
            data-lp-reveal
          >
            <h2
              id="landing-final-cta-heading"
              className="mx-auto max-w-4xl font-display text-[38px] leading-[1.08] tracking-[-0.02em] sm:text-[48px] lg:text-[56px]"
            >
              {config.finalCta.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.75] text-[color:var(--color-footer-soft-text)]">
              {config.finalCta.body}
            </p>
            <a
              href="#lead-form"
              className="lp-cta mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-[color:var(--color-footer)] transition-colors hover:bg-[color:var(--color-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-halo)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer)] motion-reduce:transition-none"
            >
              {config.finalCta.cta}
              <ArrowRight aria-hidden="true" className="lp-cta-arrow size-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-[color:var(--color-paper)]">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-6">
          <img
            src="/static/rhs5-color-trimmed.png"
            alt="Rapid Hire Solutions"
            className="h-10 w-auto"
          />
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[color:var(--color-ink-soft)]"
          >
            <Link
              href="/privacy"
              className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)]"
            >
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

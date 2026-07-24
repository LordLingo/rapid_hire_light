import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Headphones,
  Scale,
  Search,
} from "lucide-react";
import { Link } from "wouter";
import HireQuestRegistrationForm from "@/components/partners/HireQuestRegistrationForm";
import "@/components/partners/hirequest-partner.css";
import { useSeo } from "@/hooks/useSeo";
import {
  HIREQUEST_PACKAGES,
  type HireQuestPackageValue,
} from "@/lib/hireQuestPartnerForm";

const BOOK_DEMO_URL =
  "https://meetings.hubspot.com/david-keller/hirequest-rhs-meeting";
const CANONICAL_URL =
  "https://www.rapidhiresolutions.com/hirequest-partner/";
const META_DESCRIPTION =
  "HireQuest franchise offices can access Rapid Hire Solutions background screening, group-rate packages, and dedicated account onboarding.";
const TIMING_QUALIFICATION =
  "Average turnaround is based on standard checks and varies by service, jurisdiction, court access, source availability, and third-party response. Employment and other manual verifications may take longer.";

const BENEFITS = [
  {
    heading: "Rapid",
    body: "Average turnaround time is just 8 hours, so you can keep hiring moving.",
    icon: Clock3,
  },
  {
    heading: "Higher Quality",
    body: "We source directly from court record systems, ensuring accurate and comprehensive results.",
    icon: Search,
  },
  {
    heading: "Sensibly Priced",
    body: "Cost-effective, without cutting corners — and HireQuest group rates apply.",
    icon: Scale,
  },
  {
    heading: "Responsive Support",
    body: "Our friendly customer service team is trained to get the job done right, the first time.",
    icon: Headphones,
  },
] as const;

function BookDemoLink({
  className,
}: {
  readonly className: string;
}) {
  return (
    <a
      href={BOOK_DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book a Demo (opens in a new tab)"
      className={className}
    >
      Book a Demo
      <ArrowUpRight aria-hidden="true" className="hq-button-arrow" />
    </a>
  );
}

export default function HireQuestPartner() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<
    HireQuestPackageValue | ""
  >("");

  useSeo({
    title: "HireQuest Background Checks | Rapid Hire Solutions",
    description: META_DESCRIPTION,
    canonical: CANONICAL_URL,
    image:
      "https://www.rapidhiresolutions.com/static/partners/hirequest/hirequest-logo.webp",
    ogType: "website",
  });

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sections = Array.from(
      page.querySelectorAll<HTMLElement>("[data-hq-reveal]"),
    );
    const frame = requestAnimationFrame(() => {
      page.classList.add("hq-motion-ready");
    });

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      sections.forEach((section) => section.classList.add("is-visible"));
      return () => {
        cancelAnimationFrame(frame);
        page.classList.remove("hq-motion-ready");
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      page.classList.remove("hq-motion-ready");
    };
  }, []);

  useEffect(() => {
    const rawHash = window.location.hash;
    if (!rawHash || rawHash === "#") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(rawHash.slice(1));
      target?.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function choosePackage(value: HireQuestPackageValue) {
    setSelectedPackage(value);
    requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document.getElementById("account-registration")?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  return (
    <div ref={pageRef} className="hq-page">
      <header className="hq-header">
        <div className="container hq-header-inner">
          <Link href="/" aria-label="Rapid Hire Solutions home">
            <img
              src="/static/rhs5-color-trimmed.png"
              alt="Rapid Hire Solutions"
              width={180}
              height={64}
              className="hq-header-logo"
            />
          </Link>
          <div className="hq-header-actions">
            <BookDemoLink className="hq-header-demo" />
            <a
              href="#account-registration"
              className="hq-button hq-button-primary hq-header-account"
            >
              Create an Account
            </a>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hq-hero" aria-labelledby="hirequest-heading">
          <div className="container hq-hero-grid">
            <div className="hq-hero-copy">
              <div className="hq-partnership-lockup hq-hero-logo">
                <img
                  src="/static/rhs5-color-trimmed.png"
                  alt="Rapid Hire Solutions"
                  width={200}
                  height={72}
                  className="hq-lockup-rhs"
                />
                <span aria-hidden="true" className="hq-lockup-plus">
                  +
                </span>
                <img
                  src="/static/partners/hirequest/hirequest-logo.webp"
                  alt="HireQuest"
                  width={300}
                  height={80}
                  className="hq-lockup-hirequest"
                />
              </div>
              <p className="hq-eyebrow hq-hero-item hq-hero-delay-1">
                Rapid Hire Solutions + HireQuest
              </p>
              <h1
                id="hirequest-heading"
                className="hq-hero-item hq-hero-delay-2"
              >
                Fast, Reliable Background Checks — Now Available to HireQuest
                Franchise Offices
              </h1>
              <div className="hq-hero-body hq-hero-item hq-hero-delay-3">
                <p>
                  Rapid Hire Solutions is proud to be an approved vendor for
                  HireQuest.
                </p>
                <p>
                  We help staffing firms make same-day hiring decisions with
                  background checks that average just 8 hours turnaround —
                  empowering your team to approve candidates quickly and
                  fast-track onboarding.
                </p>
              </div>
              <div className="hq-hero-actions hq-hero-item hq-hero-delay-4">
                <BookDemoLink className="hq-button hq-button-primary" />
                <a
                  href="#account-registration"
                  className="hq-button hq-button-secondary"
                >
                  Create an Account
                  <ArrowRight
                    aria-hidden="true"
                    className="hq-button-arrow"
                  />
                </a>
              </div>
              <p className="hq-qualification hq-hero-item hq-hero-delay-5">
                {TIMING_QUALIFICATION}
              </p>
            </div>

            <aside className="hq-hero-panel hq-hero-item hq-hero-delay-3">
              <p className="hq-panel-kicker">Approved partner access</p>
              <img
                src="/static/partners/hirequest/hirequest-logo.webp"
                alt="HireQuest"
                width={300}
                height={80}
                className="hq-panel-logo"
              />
              <p>
                Group-rate background screening packages created for
                HireQuest franchise offices.
              </p>
              <a
                href="#packages"
                className="hq-panel-link"
              >
                View packages
                <ArrowRight aria-hidden="true" />
              </a>
            </aside>
          </div>
        </section>

        <section
          className="hq-partner-strip"
          aria-label="HireQuest partner brands"
        >
          <div className="container" data-hq-reveal>
            <p>Partner brands</p>
            <div className="hq-partner-logos">
              <img
                src="/static/partners/hirequest/hirequest-logo.webp"
                alt="HireQuest"
                width={300}
                height={80}
                className="hq-partner-primary"
              />
              <span aria-hidden="true" className="hq-partner-divider" />
              <img
                src="/static/partners/hirequest/mri-network-logo.svg"
                alt="MRI Network"
                className="hq-partner-secondary"
              />
              <img
                src="/static/partners/hirequest/snelling-logo.svg"
                alt="Snelling"
                className="hq-partner-secondary"
              />
            </div>
          </div>
        </section>

        <section className="hq-section hq-benefits">
          <div className="container" data-hq-reveal>
            <div className="hq-section-heading">
              <p className="hq-eyebrow">The Rapid Hire approach</p>
              <h2>Why Choose Rapid Hire?</h2>
            </div>
            <div className="hq-benefit-grid">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article key={benefit.heading} className="hq-benefit-card">
                    <span className="hq-benefit-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{benefit.heading}</h3>
                    <p>{benefit.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="packages" className="hq-section hq-packages">
          <div className="container" data-hq-reveal>
            <div className="hq-section-heading hq-section-heading-centered">
              <p className="hq-eyebrow">Preferred partner pricing</p>
              <h2>HireQuest Group-Rate Packages</h2>
              <p>
                Choose the package that best matches your office’s hiring
                workflow.
              </p>
            </div>
            <div className="hq-package-grid">
              {HIREQUEST_PACKAGES.map((packageOption) => {
                const selected = selectedPackage === packageOption.value;
                return (
                  <article
                    key={packageOption.name}
                    className={[
                      "hq-package-card",
                      selected ? "hq-package-card--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div>
                      <p className="hq-package-name">{packageOption.name}</p>
                      <p className="hq-package-price">
                        {packageOption.price}
                      </p>
                    </div>
                    <ul>
                      {packageOption.services.map((service) => (
                        <li key={service}>
                          <Check aria-hidden="true" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      aria-pressed={selected}
                      className="hq-button hq-button-package"
                      onClick={() => choosePackage(packageOption.value)}
                    >
                      {selected ? "Package Selected" : "Select This Package"}
                      <ArrowRight
                        aria-hidden="true"
                        className="hq-button-arrow"
                      />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="account-registration"
          className="hq-section hq-registration"
          aria-labelledby="account-registration-heading"
        >
          <div className="container hq-registration-grid" data-hq-reveal>
            <div className="hq-registration-copy">
              <p className="hq-eyebrow">Account registration</p>
              <h2 id="account-registration-heading">
                Create Your HireQuest Account
              </h2>
              <p>
                Tell us about your franchise office and select your preferred
                HireQuest package. Our team will confirm your account setup
                and group-rate configuration.
              </p>
              <div className="hq-registration-note">
                <strong>What happens next</strong>
                <p>
                  Submit your account request and our team will follow up to
                  confirm setup details separately.
                </p>
              </div>
            </div>
            <HireQuestRegistrationForm
              selectedPackage={selectedPackage}
              onPackageChange={setSelectedPackage}
            />
          </div>
        </section>

        <section className="hq-final-cta">
          <div className="container" data-hq-reveal>
            <h2>Ready to See the Difference?</h2>
            <div className="hq-final-actions">
              <BookDemoLink className="hq-button hq-button-light" />
              <a
                href="#account-registration"
                className="hq-button hq-button-outline-light"
              >
                Create an Account
                <ArrowRight aria-hidden="true" className="hq-button-arrow" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="hq-footer">
        <div className="container hq-footer-inner">
          <Link href="/" aria-label="Rapid Hire Solutions home">
            <img
              src="/static/rhs5-color-trimmed.png"
              alt="Rapid Hire Solutions"
              width={180}
              height={64}
              className="hq-footer-logo"
            />
          </Link>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

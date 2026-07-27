import {
  ArrowRight,
  BriefcaseBusiness,
  Car,
  Check,
  CircleDollarSign,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  Headphones,
  HeartPulse,
  Link2,
  ListChecks,
  SearchCheck,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import LogoStrip from "@/components/site/LogoStrip";
import SampleReportSection from "@/components/site/SampleReportSection";
import SiteShell from "@/components/site/SiteShell";
import "@/components/site/homepage-quote-redesign.css";
import { useSeo } from "@/hooks/useSeo";

const DEMO_URL =
  "https://meetings.hubspot.com/david-keller/hirequest-rhs-meeting";

const TIMING_QUALIFICATION =
  "Timing varies by service, jurisdiction, court access, source availability, and third-party response. Employment, education, and other manual verifications may take longer.";

const PROBLEMS = [
  "Great candidates disappear while reports are pending.",
  "Recruiters waste time chasing statuses and answering updates.",
  "Managers lose confidence in the hiring timeline.",
  "Screening costs are difficult to predict.",
  "Compliance questions become last-minute fire drills.",
] as const;

const OUTCOMES = [
  {
    title: "Fill positions faster",
    body: "Keep qualified candidates moving before competitors win them.",
    Icon: BriefcaseBusiness,
  },
  {
    title: "Reduce recruiter workload",
    body: "Spend less time tracking reports and more time filling roles.",
    Icon: ListChecks,
  },
  {
    title: "Improve candidate experience",
    body: "Give candidates a clear, low-friction screening process.",
    Icon: Users,
  },
  {
    title: "Control screening costs",
    body: "Build packages around the checks your roles actually require.",
    Icon: CircleDollarSign,
  },
  {
    title: "Support confident decisions",
    body: "Use role-appropriate screening information and clear documentation.",
    Icon: ShieldCheck,
  },
  {
    title: "Get help quickly",
    body: "Reach a responsive team when a report needs attention.",
    Icon: Headphones,
  },
] as const;

const SCREENING_TOOLS = [
  {
    title: "Criminal and identity screening",
    body: "Give hiring teams a clearer view of identity and relevant records with role-appropriate criminal searches.",
    href: "/services/criminal-records",
    cta: "Explore criminal screening",
    Icon: SearchCheck,
  },
  {
    title: "Employment and education verification",
    body: "Confirm the experience and credentials a role depends on without adding more follow-up work for recruiters.",
    href: "/services/employment-verification",
    cta: "Explore verifications",
    Icon: GraduationCap,
  },
  {
    title: "Drug testing and occupational health",
    body: "Coordinate role-appropriate testing through a screening workflow that keeps candidates and recruiters informed.",
    href: "/services/drug-screening",
    cta: "Explore drug screening",
    Icon: FlaskConical,
  },
  {
    title: "Motor vehicle records",
    body: "Review driving history for vehicle-related roles and keep safety-sensitive hiring decisions moving.",
    href: "/services/motor-vehicle-records",
    cta: "Explore MVR screening",
    Icon: Car,
  },
  {
    title: "Continuous monitoring",
    body: "Stay aware of relevant changes after hire instead of relying only on a one-time pre-employment check.",
    href: "/services/continuous-monitoring",
    cta: "Explore monitoring",
    Icon: FileCheck2,
  },
  {
    title: "ATS and HRIS integrations",
    body: "Reduce duplicate data entry and give recruiters more time to hire by connecting screening to existing workflows.",
    href: "/integrations",
    cta: "Explore integrations",
    Icon: Link2,
  },
] as const;

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Build the right package",
    body: "Choose screening services based on the role, industry, and risk.",
  },
  {
    number: "02",
    title: "Invite the candidate",
    body: "Give candidates a clear, mobile-friendly way to submit their information.",
  },
  {
    number: "03",
    title: "Track progress",
    body: "See what is complete, what is pending, and what needs attention.",
  },
  {
    number: "04",
    title: "Keep hiring moving",
    body: "Review results, get support when needed, and move qualified candidates forward.",
  },
] as const;

const SUPPORT_ITEMS = [
  "Help during setup",
  "Clear answers about report status",
  "Support when a result needs attention",
  "Guidance on building role-appropriate packages",
] as const;

const INDUSTRIES = [
  {
    title: "Staffing",
    body: "High-volume workflows that help recruiters keep placements moving.",
    href: "/industries/staffing",
    Icon: Users,
  },
  {
    title: "Healthcare",
    body: "Screening workflows shaped around care teams, credentials, and exclusions.",
    href: "/industries/healthcare",
    Icon: HeartPulse,
  },
  {
    title: "Transportation",
    body: "Driver-focused screening for safety-sensitive hiring workflows.",
    href: "/industries/transportation",
    Icon: Truck,
  },
] as const;

function DemoLink({ className }: { readonly className: string }) {
  return (
    <a
      href={DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book a 15-Minute Demo (opens in a new tab)"
      className={className}
    >
      Book a 15-Minute Demo
      <ArrowRight aria-hidden="true" className="conversion-arrow" />
    </a>
  );
}

export default function Home() {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.rapidhiresolutions.com";

  useSeo({
    title: "Faster Hiring Background Checks | Rapid Hire Solutions",
    description:
      "Keep hiring moving with fast, transparent background screening, clear pricing, and responsive support for employers and staffing teams.",
    canonical: `${origin}/`,
    image: `${origin}/static/rhs5-og-card.png`,
    keywords: [
      "background check services",
      "FCRA-certified background screening",
      "employment background checks",
      "pre-employment screening",
      "criminal background check",
      "continuous monitoring",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Rapid Hire Solutions",
      url: origin,
      logo: `${origin}/static/rhs5-icon-512.png`,
      description:
        "FCRA-certified background screening for high-volume hiring teams. US-based CRA serving HR, talent acquisition, and operations leaders since 2018.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Prosper",
        addressRegion: "TX",
        addressCountry: "US",
      },
      sameAs: [],
    },
  });

  return (
    <SiteShell>
      <div className="home-outcome-page">
        <section className="home-outcome-hero" aria-labelledby="home-outcome-heading">
          <div className="container home-outcome-hero-grid">
            <div className="home-outcome-hero-copy">
              <p className="conversion-eyebrow home-hero-enter home-hero-delay-1">
                Background screening built for faster hiring
              </p>
              <h1 id="home-outcome-heading" className="home-hero-enter home-hero-delay-2">
                Stop Losing Great Candidates While Waiting on Background Checks.
              </h1>
              <p className="home-outcome-lede home-hero-enter home-hero-delay-3">
                Rapid Hire helps employers move from offer to start date faster
                with straightforward screening, transparent pricing, and
                responsive <span className="whitespace-nowrap">U.S.-based support.</span>
              </p>
              <div className="conversion-actions home-hero-enter home-hero-delay-4">
                <Link href="/get-a-quote" className="conversion-button conversion-button-primary">
                  Get a Custom Quote
                  <ArrowRight aria-hidden="true" className="conversion-arrow" />
                </Link>
                <DemoLink className="conversion-button conversion-button-secondary" />
              </div>
              <div className="home-proof-row home-hero-enter home-hero-delay-5" aria-label="Rapid Hire proof points">
                <div aria-label="85% of standard checks completed within 24 hours">
                  <strong>85%</strong>
                  <span>of standard checks completed within 24 hours</span>
                </div>
                <div>
                  <strong>Clear</strong>
                  <span>line-item pricing</span>
                </div>
                <div>
                  <strong>Human</strong>
                  <span>responsive support from a real person</span>
                </div>
              </div>
              <p className="home-timing-note home-hero-enter home-hero-delay-5">
                {TIMING_QUALIFICATION}
              </p>
            </div>

            <div className="home-workflow-visual home-hero-visual" aria-label="Candidate screening workflow from accepted offer to ready to start">
              <div className="home-workflow-heading">
                <span>Candidate workflow</span>
                <span className="home-workflow-status">On track</span>
              </div>
              <ol>
                {[
                  ["Offer accepted", "Candidate ready"],
                  ["Screening in progress", "Checks underway"],
                  ["Cleared", "Review complete"],
                  ["Ready to start", "Hiring can move"],
                ].map(([title, detail], index) => (
                  <li key={title} className={index === 3 ? "is-current" : ""}>
                    <span className="home-workflow-check"><Check aria-hidden="true" /></span>
                    <div>
                      <strong>{title}</strong>
                      <span>{detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <p>One clear path from offer to first day.</p>
            </div>
          </div>
        </section>

        <LogoStrip />

        <section className="conversion-section home-problem-section" aria-labelledby="home-problem-heading">
          <div className="container home-problem-grid">
            <div className="reveal-on-scroll">
              <p className="conversion-eyebrow">The real cost of slow screening</p>
              <h2 id="home-problem-heading">Is your screening process slowing down hiring?</h2>
              <p className="conversion-intro">
                A delayed report does more than hold up a file. It gives
                candidates time to accept another offer, adds work for
                recruiters, and leaves hiring managers waiting.
              </p>
            </div>
            <div className="home-problem-list reveal-on-scroll">
              {PROBLEMS.map((problem, index) => (
                <div key={problem}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{problem}</p>
                </div>
              ))}
              <strong className="home-problem-close">
                Rapid Hire gives your team a faster, clearer path from offer
                accepted to first day.
              </strong>
            </div>
          </div>
        </section>

        <section className="conversion-section home-outcomes-section" aria-labelledby="home-outcomes-heading">
          <div className="container">
            <div className="conversion-heading reveal-on-scroll">
              <p className="conversion-eyebrow">What changes after you switch</p>
              <h2 id="home-outcomes-heading">A better screening process should improve the way your whole team hires.</h2>
            </div>
            <div className="home-outcome-card-grid">
              {OUTCOMES.map(({ title, body, Icon }) => (
                <article key={title} className="home-outcome-card reveal-on-scroll">
                  <Icon aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="conversion-section home-tools-section" aria-labelledby="home-tools-heading">
          <div className="container">
            <div className="conversion-heading conversion-heading-split reveal-on-scroll">
              <div>
                <p className="conversion-eyebrow">How Rapid Hire helps</p>
                <h2 id="home-tools-heading">The screening tools behind a faster hiring process.</h2>
              </div>
              <Link href="/services" className="conversion-text-link">
                Explore Screening Services
                <ArrowRight aria-hidden="true" className="conversion-arrow" />
              </Link>
            </div>
            <div className="home-tool-list">
              {SCREENING_TOOLS.map(({ title, body, href, cta, Icon }, index) => (
                <article key={title} className="home-tool-row reveal-on-scroll">
                  <span className="home-tool-number">0{index + 1}</span>
                  <Icon aria-hidden="true" className="home-tool-icon" />
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                  <Link href={href} className="conversion-text-link">
                    {cta}
                    <ArrowRight aria-hidden="true" className="conversion-arrow" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SampleReportSection />

        <section className="conversion-section home-process-section" aria-labelledby="home-process-heading">
          <div className="container">
            <div className="conversion-heading reveal-on-scroll">
              <p className="conversion-eyebrow">A simpler way to keep hiring moving</p>
              <h2 id="home-process-heading">From candidate invitation to hiring decision—with less friction.</h2>
            </div>
            <ol className="home-process-grid">
              {PROCESS_STEPS.map((step) => (
                <li key={step.number} className="reveal-on-scroll">
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="conversion-section home-support-section" aria-labelledby="home-support-heading">
          <div className="container home-support-grid">
            <div className="reveal-on-scroll">
              <p className="conversion-eyebrow">Service that keeps hiring moving</p>
              <h2 id="home-support-heading">You should never have to chase your screening provider.</h2>
              <p className="conversion-intro">
                When hiring is urgent, support should be easy to reach. Rapid
                Hire gives employers responsive help from people who understand
                hiring deadlines and screening workflows.
              </p>
            </div>
            <ul className="home-support-list reveal-on-scroll">
              {SUPPORT_ITEMS.map((item) => (
                <li key={item}><Check aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="conversion-section home-industries-section" aria-labelledby="home-industries-heading">
          <div className="container">
            <div className="conversion-heading conversion-heading-split reveal-on-scroll">
              <div>
                <p className="conversion-eyebrow">Built for real hiring workflows</p>
                <h2 id="home-industries-heading">Screening built around the way your industry hires.</h2>
              </div>
              <Link href="/industries" className="conversion-text-link">
                Explore all industries
                <ArrowRight aria-hidden="true" className="conversion-arrow" />
              </Link>
            </div>
            <div className="home-industry-grid">
              {INDUSTRIES.map(({ title, body, href, Icon }) => (
                <Link key={title} href={href} className="home-industry-card reveal-on-scroll">
                  <Icon aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <span>Explore {title}<ArrowRight aria-hidden="true" className="conversion-arrow" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="home-final-cta" aria-labelledby="home-final-cta-heading">
          <div className="container reveal-on-scroll">
            <h2 id="home-final-cta-heading">Ready to make screening the easiest part of hiring?</h2>
            <p>Tell us how you hire. We’ll recommend a practical screening plan and clear pricing for your team.</p>
            <div className="conversion-actions">
              <Link href="/get-a-quote" className="conversion-button conversion-button-light">
                Get My Custom Quote
                <ArrowRight aria-hidden="true" className="conversion-arrow" />
              </Link>
              <DemoLink className="conversion-button conversion-button-outline-light" />
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
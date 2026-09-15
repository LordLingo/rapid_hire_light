import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  KeyRound,
  MapPin,
  PackageCheck,
  Scale,
  ShieldCheck,
  Truck,
  UserRoundCheck,
  Warehouse,
} from "lucide-react";
import { Link } from "wouter";
import EmployerLeadForm from "@/components/lp/EmployerLeadForm";
import SiteShell from "@/components/site/SiteShell";
import type { IndustryCompanyPageConfig } from "@/content/industryCompanyPages";
import { LEAD_FORM_IDS } from "@/lib/leadAnalytics";
import "./industry-company-page.css";

type InfoItem = {
  readonly title: string;
  readonly body: string;
};

type ServiceItem = InfoItem & {
  readonly href: string;
};

const CLEANING_RISKS = [
  "Enter private homes when a customer is not present",
  "Receive keys, door codes, badges, or alarm instructions",
  "Work around personal property or inside offices after hours",
  "Work around children, older adults, patients, or other vulnerable populations, depending on the customers and facilities served",
  "Drive company vehicles between appointments",
  "Shape the customer’s perception of the cleaning company’s brand",
] as const;

const CLEANING_PROBLEMS: readonly InfoItem[] = [
  {
    title: "A new contract creates an immediate hiring deadline.",
    body: "Set the package before recruiting starts so candidate invitations can move without rebuilding the order for every hire.",
  },
  {
    title: "Customers want confidence in who enters their property.",
    body: "Use a documented, role-relevant process that your sales and operations teams can explain accurately.",
  },
  {
    title: "Owners cannot spend the day chasing reports.",
    body: "Keep invitations, status, and completed results in one repeatable screening workflow.",
  },
  {
    title: "Customer requirements are not always the same.",
    body: "Separate standard role packages from contract- or facility-specific additions instead of over-screening every worker.",
  },
  {
    title: "Drivers and field leaders carry different responsibilities.",
    body: "Add driving or access-related components only where the actual job calls for them.",
  },
  {
    title: "Turnover makes every manual step expensive.",
    body: "Standardized packages reduce avoidable setup work while preserving the review steps your policy requires.",
  },
] as const;

const CLEANING_ROLES: readonly InfoItem[] = [
  {
    title: "Residential cleaners",
    body: "Workers entering customers’ homes may warrant identity and criminal-history screening appropriate to the position and applicable law.",
  },
  {
    title: "Commercial janitorial staff",
    body: "Teams working after hours in offices or commercial facilities can be screened according to the role, employer policy, and customer requirements.",
  },
  {
    title: "Supervisors and crew leaders",
    body: "Leaders may hold keys, access credentials, customer information, equipment, or responsibility for a company vehicle and field team.",
  },
  {
    title: "Drivers",
    body: "Employees who operate company vehicles or drive routinely between appointments may need Motor Vehicle Record screening.",
  },
  {
    title: "Specialty cleaning crews",
    body: "Post-construction, restoration-related, industrial, and healthcare-facility cleaning should be scoped to the actual environment and duties.",
  },
] as const;

const CLEANING_SERVICES: readonly ServiceItem[] = [
  {
    title: "Identity / SSN trace",
    href: "/services/identity-verification",
    body: "Helps establish the identity and address history used to guide jurisdictional research when appropriate to the package.",
  },
  {
    title: "County criminal searches",
    href: "/services/criminal-records",
    body: "Provides courthouse-level research in relevant jurisdictions rather than relying on a broad database alone.",
  },
  {
    title: "Multi-jurisdictional criminal database search",
    href: "/services/criminal-records",
    body: "Can help identify records or jurisdictions for follow-up; it is a supplemental pointer, not a substitute for appropriate county-level research.",
  },
  {
    title: "Federal criminal search",
    href: "/services/criminal-records",
    body: "May surface relevant federal-court records that are not held in county criminal repositories.",
  },
  {
    title: "Sex offender registry search",
    href: "/services/criminal-records",
    body: "May be considered for appropriate roles and environments when legally permissible and supported by documented policy.",
  },
  {
    title: "Employment verification",
    href: "/services/employment-verification",
    body: "Can help confirm work history for supervisors, crew leaders, specialty technicians, or other positions where experience matters.",
  },
  {
    title: "Motor Vehicle Records",
    href: "/services/motor-vehicle-records",
    body: "Supports a role-based review of license status and reported driving history when operating a vehicle is part of the job.",
  },
  {
    title: "Drug screening",
    href: "/services/drug-screening",
    body: "Can be added where employer policy, customer commitments, safety-sensitive duties, and applicable law support it.",
  },
  {
    title: "Continuous monitoring",
    href: "/services/continuous-monitoring",
    body: "Can extend an appropriate screening program beyond the hiring date, subject to notice, authorization, policy, and legal requirements.",
  },
] as const;

const MOVING_ROLES: readonly InfoItem[] = [
  {
    title: "Movers / helpers",
    body: "Identity inputs and criminal-history screening may be considered based on home access, property handling, jurisdiction, and the position’s duties.",
  },
  {
    title: "Drivers",
    body: "MVR, license-status, criminal screening, and drug-testing components can be scoped to the vehicle, duties, policy, and applicable requirements.",
  },
  {
    title: "CDL / regulated drivers",
    body: "When applicable, DOT or FMCSA requirements should be addressed according to vehicle, operation, CDL status, and regulated activity. Not every moving-company driver is regulated.",
  },
  {
    title: "Crew leaders / foremen",
    body: "The package can reflect customer interaction, home access, equipment responsibility, driving duties, and supervision of the crew.",
  },
  {
    title: "Warehouse / storage employees",
    body: "Screening can be tailored to access to stored household goods, facilities, inventory systems, and equipment.",
  },
  {
    title: "Office / dispatch staff",
    body: "Scope checks around access to customer records, payment information, routing systems, and operational controls.",
  },
] as const;

const MOVING_AUDIENCES: readonly InfoItem[] = [
  {
    title: "Residential and household-goods moving",
    body: "Residential movers, household-goods movers, and local moving companies.",
  },
  {
    title: "Interstate moving operations",
    body: "Interstate moving companies and interstate movers.",
  },
  {
    title: "Storage and specialty delivery",
    body: "Storage and moving companies, furniture/appliance delivery crews, white-glove delivery businesses, door-to-door moving companies, and last-mile household delivery operations.",
  },
] as const;

const MOVING_SERVICES: readonly ServiceItem[] = [
  {
    title: "Identity / SSN trace",
    href: "/services/identity-verification",
    body: "Helps establish identity inputs and relevant address history for the rest of a role-specific search.",
  },
  {
    title: "Criminal records",
    href: "/services/criminal-records",
    body: "Combine appropriate county research with broader and federal sources based on the role and jurisdictions involved.",
  },
  {
    title: "Employment verification",
    href: "/services/employment-verification",
    body: "Can help confirm relevant work history for drivers, crew leaders, warehouse roles, and customer-facing positions.",
  },
  {
    title: "Motor Vehicle Records",
    href: "/services/motor-vehicle-records",
    body: "Reviews reported license status and driving history when operating a company vehicle is an essential duty.",
  },
  {
    title: "Drug screening",
    href: "/services/drug-screening",
    body: "Can support an employer policy or an applicable regulated-driver program; the correct workflow depends on the role and operation.",
  },
  {
    title: "Continuous monitoring",
    href: "/services/continuous-monitoring",
    body: "Can provide post-hire alerts for appropriate criminal or driving programs when implemented with the required notices and review process.",
  },
] as const;

const MOVING_MATRIX = [
  {
    role: "Mover / Helper",
    criminal: "Commonly considered",
    identity: "Commonly considered",
    employment: "Role-dependent",
    mvr: "When driving",
    drug: "Policy-dependent",
    monitoring: "Role-dependent",
  },
  {
    role: "Crew Leader",
    criminal: "Commonly considered",
    identity: "Commonly considered",
    employment: "Commonly considered",
    mvr: "When driving",
    drug: "Policy-dependent",
    monitoring: "Role-dependent",
  },
  {
    role: "Non-CDL Driver",
    criminal: "Commonly considered",
    identity: "Commonly considered",
    employment: "Role-dependent",
    mvr: "Commonly considered",
    drug: "When applicable",
    monitoring: "When applicable",
  },
  {
    role: "CDL / Regulated Driver",
    criminal: "Role-dependent",
    identity: "Commonly considered",
    employment: "When applicable",
    mvr: "Regulated roles only",
    drug: "Regulated roles only",
    monitoring: "When applicable",
  },
  {
    role: "Warehouse / Storage",
    criminal: "Commonly considered",
    identity: "Commonly considered",
    employment: "Role-dependent",
    mvr: "When driving",
    drug: "Policy-dependent",
    monitoring: "Role-dependent",
  },
  {
    role: "Dispatcher / Office",
    criminal: "Role-dependent",
    identity: "Commonly considered",
    employment: "Role-dependent",
    mvr: "Not typical",
    drug: "Policy-dependent",
    monitoring: "Role-dependent",
  },
] as const;

function SectionHeading({
  eyebrow,
  heading,
  intro,
}: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro?: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-x-8 gap-y-5">
      <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
        <p className="eyebrow">{eyebrow}</p>
        <div className="mt-3 hairline" />
      </div>
      <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
        <h2 className="max-w-4xl font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[42px] md:text-[52px]">
          {heading}
        </h2>
        {intro && (
          <p className="mt-5 max-w-3xl text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)] md:text-[16.5px]">
            {intro}
          </p>
        )}
      </div>
    </div>
  );
}

function InfoCards({
  items,
  columns = 3,
}: {
  readonly items: readonly InfoItem[];
  readonly columns?: 2 | 3;
}) {
  return (
    <ul
      className={`mt-10 grid gap-4 ${columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className="industry-company__card reveal-on-scroll rounded-[18px] border border-border bg-white p-6 md:p-7"
        >
          <CheckCircle2
            aria-hidden="true"
            className="size-5 text-[color:var(--color-accent-ink)]"
            strokeWidth={1.7}
          />
          <h3 className="mt-5 font-display text-[21px] leading-[1.2] text-[color:var(--color-ink)]">
            {item.title}
          </h3>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

function ServiceCards({ items }: { readonly items: readonly ServiceItem[] }) {
  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className="reveal-on-scroll">
          <Link
            href={item.href}
            className="industry-company__card industry-company__service group flex h-full flex-col rounded-[18px] border border-border bg-white p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2"
          >
            <span className="flex items-start justify-between gap-4">
              <span className="font-display text-[20px] leading-[1.2] text-[color:var(--color-ink)]">
                {item.title}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="industry-company__arrow mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]"
              />
            </span>
            <span className="mt-3 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              {item.body}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CleaningContent() {
  return (
    <>
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="01 — Trust starts before the first job"
            heading="Your employees are being trusted with more than a mop and a vacuum."
            intro="A cleaning technician often works beyond a customer’s line of sight. The right screening plan starts with the access and responsibilities of the job—not an assumption that every cleaning role carries the same risk."
          />
          <ul className="mt-10 grid gap-3 md:ml-[25%] md:grid-cols-2">
            {CLEANING_RISKS.map((risk) => (
              <li
                key={risk}
                className="reveal-on-scroll flex gap-3 border-t border-border py-4 text-[15px] leading-[1.65] text-[color:var(--color-ink-soft)]"
              >
                <KeyRound
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]"
                />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="02 — Problems we solve"
            heading="Screening problems that slow down growing cleaning companies."
            intro="Rapid Hire helps you build a repeatable screening process so hiring can move quickly without treating every role the same."
          />
          <InfoCards items={CLEANING_PROBLEMS} />
        </div>
      </section>

      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="03 — Who to screen"
            heading="Screening packages built around the work your team actually performs."
            intro="Start with duties, access, driving, work environment, and customer commitments. Then assign the checks that support those responsibilities. No universal package fits every cleaning company."
          />
          <InfoCards items={CLEANING_ROLES} />
        </div>
      </section>

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="04 — Screening components"
            heading="Build the package around the role—not around a generic checklist."
            intro="Each component should answer a specific business need. A reported record does not automatically disqualify a candidate; employers should apply documented, job-related criteria and applicable law."
          />
          <ServiceCards items={CLEANING_SERVICES} />
        </div>
      </section>

      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="05 — Residential and commercial"
            heading="Let the work environment shape the screening conversation."
            intro="Your screening package should follow the actual risk and responsibilities of the job."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="industry-company__card reveal-on-scroll rounded-[20px] border border-border bg-white p-7 md:p-9">
              <Building2
                aria-hidden="true"
                className="size-6 text-[color:var(--color-accent-ink)]"
              />
              <h3 className="mt-5 font-display text-[28px] text-[color:var(--color-ink)]">
                Residential cleaning
              </h3>
              <ul className="mt-6 space-y-3 text-[15px] text-[color:var(--color-ink-soft)]">
                {["Private home access", "Keys and door codes", "Unsupervised work", "Customer property", "Driving between appointments"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span aria-hidden className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </article>
            <article className="industry-company__card reveal-on-scroll rounded-[20px] border border-border bg-white p-7 md:p-9">
              <BriefcaseBusiness
                aria-hidden="true"
                className="size-6 text-[color:var(--color-accent-ink)]"
              />
              <h3 className="mt-5 font-display text-[28px] text-[color:var(--color-ink)]">
                Commercial cleaning
              </h3>
              <ul className="mt-6 space-y-3 text-[15px] text-[color:var(--color-ink-soft)]">
                {["After-hours building access", "Security badges", "Customer contract requirements", "Facility-specific screening", "Larger crews and multiple locations", "Supervisor accountability"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span aria-hidden className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="reveal-on-scroll rounded-[22px] border border-border bg-[color:var(--color-tint)] p-7 md:p-10">
              <FileCheck2
                aria-hidden="true"
                className="size-8 text-[color:var(--color-accent-ink)]"
              />
              <p className="mt-6 eyebrow">Customer requirements</p>
              <p className="mt-4 font-display text-[26px] leading-[1.2] text-[color:var(--color-ink)]">
                Turn a contract requirement into a repeatable role package.
              </p>
            </div>
            <div className="reveal-on-scroll">
              <h2 className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[44px]">
                When your customer asks, “Are your cleaners background checked?” have a clear answer.
              </h2>
              <p className="mt-5 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Large commercial clients, property managers, healthcare facilities, schools, government contractors, and other customers may have their own screening requirements. Not every customer asks for the same checks. Rapid Hire can help organize packages around the commitments in the contract and the roles that perform the work.
              </p>
              <a
                href="#industry-lead-form"
                className="industry-company__cta mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-[14px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2"
              >
                Talk Through My Requirements
                <ArrowRight aria-hidden className="industry-company__arrow size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]">
        <div className="container py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="reveal-on-scroll">
              <Clock3 aria-hidden="true" className="size-7 text-[color:var(--color-accent-halo)]" />
              <p className="mt-5 eyebrow text-[color:var(--color-footer-muted)]">06 — Faster onboarding</p>
            </div>
            <div className="reveal-on-scroll">
              <h2 className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[46px]">
                A cleaning contract can start quickly. Your screening process should be ready.
              </h2>
              <p className="mt-5 max-w-3xl text-[15.5px] leading-[1.75] text-[color:var(--color-footer-soft-text)]">
                Winning a customer can suddenly create the need to staff several cleaners. A prepared workflow helps your team invite candidates quickly, see status clearly, reduce owner or recruiter follow-up, move completed candidates toward onboarding, and keep the process consistent across locations.
              </p>
              <p className="mt-5 text-[13px] leading-[1.65] text-[color:var(--color-footer-muted)]">
                Timing varies by service, jurisdiction, court access, source availability, and third-party response.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function MovingContent() {
  return (
    <>
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="01 — Why moving is different"
            heading="Your crew does not just show up at the customer’s workplace. They enter their home."
            intro="Moving teams handle household goods, vehicles, schedules, and face-to-face customer relationships during a high-stress day. Screening is one part of a broader hiring, training, supervision, and risk-management process."
          />
          <div className="mt-10 grid gap-4 md:ml-[25%] md:grid-cols-2 xl:grid-cols-3">
            {["Entering private residences", "Handling furniture, electronics, and personal belongings", "Loading and unloading valuable property", "Operating company vehicles", "Working with temporary or seasonal crews", "Driving between homes, warehouses, and storage facilities", "Representing the company during stressful moves"].map(
              (item) => (
                <div key={item} className="industry-company__card reveal-on-scroll rounded-[16px] border border-border bg-white p-5">
                  <PackageCheck aria-hidden="true" className="size-5 text-[color:var(--color-accent-ink)]" />
                  <p className="mt-4 text-[14.5px] leading-[1.6] text-[color:var(--color-ink)]">{item}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="02 — Roles and responsibilities"
            heading="Different moving-company roles carry different responsibilities."
            intro="Define the package from the job description and actual operating environment. Driving, home access, warehouse access, customer records, and regulated activity should not be treated as interchangeable."
          />
          <div
            data-testid="moving-company-audiences"
            className="mt-10 border-y border-border py-7 md:ml-[25%]"
          >
            <p className="eyebrow">Moving operations this guide supports</p>
            <ul className="mt-5 grid gap-5 md:grid-cols-3">
              {MOVING_AUDIENCES.map((audience) => (
                <li key={audience.title}>
                  <h3 className="font-display text-[19px] leading-[1.25] text-[color:var(--color-ink)]">
                    {audience.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                    {audience.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <InfoCards items={MOVING_ROLES} />
        </div>
      </section>

      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="reveal-on-scroll">
              <p className="eyebrow">03 — Driver screening</p>
              <h2 className="mt-5 font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink)] sm:text-[44px]">
                When driving is part of the job, the screening package should reflect it.
              </h2>
              <p className="mt-5 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                A Motor Vehicle Record reports license status and relevant driving history from the issuing jurisdiction. Employers can use it alongside documented driving criteria, insurance requirements, and the duties of the job.
              </p>
              <p className="mt-5 rounded-[14px] border border-[color:var(--color-accent-ink)]/20 bg-white p-5 text-[14px] leading-[1.7] text-[color:var(--color-ink)]">
                <strong>Important distinction:</strong> a non-regulated moving driver is not automatically a DOT driver. DOT and FMCSA obligations depend on duties, vehicles, operating authority, jurisdiction, and operating circumstances.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/industries/transportation" className="industry-company__text-link inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)]">
                  Transportation screening guide <ArrowRight aria-hidden className="industry-company__arrow size-4" />
                </Link>
                <Link href="/services/motor-vehicle-records" className="industry-company__text-link inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)]">
                  Motor Vehicle Records <ArrowRight aria-hidden className="industry-company__arrow size-4" />
                </Link>
              </div>
            </div>
            <div className="reveal-on-scroll rounded-[22px] border border-border bg-white p-7 md:p-9">
              <Truck aria-hidden="true" className="size-7 text-[color:var(--color-accent-ink)]" />
              <h3 className="mt-5 font-display text-[27px] text-[color:var(--color-ink)]">Potential driver components</h3>
              <ul className="mt-6 space-y-4">
                {["MVR and license status", "CDL-related screening where applicable", "Drug and alcohol screening when required or supported by employer policy", "Continuous driver or license monitoring where appropriate"].map(
                  (item) => (
                    <li key={item} className="flex gap-3 text-[14.5px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                      <BadgeCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <Link href="/services/drug-screening" className="industry-company__text-link mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)]">
                Review drug-screening options <ArrowRight aria-hidden className="industry-company__arrow size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="04 — Household-goods trust"
            heading="Customers are handing your crew access to their home and possessions."
            intro="A professional screening process can support customer confidence, brand reputation, repeat and referral business, and a consistent response to access-sensitive roles. It cannot promise to eliminate theft, damage, accidents, or misconduct. Background screening is one part of a broader hiring, training, and supervision process."
          />
          <div className="mt-10 grid gap-4 md:ml-[25%] md:grid-cols-3">
            {[
              { title: "Trust at the door", body: "Give managers a clear, accurate way to explain the company’s role-based screening process." },
              { title: "Reputation after the move", body: "Support the professionalism customers remember in reviews, referrals, and repeat business." },
              { title: "Consistent operations", body: "Pair screening with training, supervision, claims procedures, and documented hiring criteria." },
            ].map((item) => (
              <div key={item.title} className="industry-company__card reveal-on-scroll rounded-[18px] border border-border bg-white p-6">
                <h3 className="font-display text-[21px] text-[color:var(--color-ink)]">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-footer)] text-[color:var(--color-footer-foreground)]">
        <div className="container py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="reveal-on-scroll">
              <Warehouse aria-hidden="true" className="size-7 text-[color:var(--color-accent-halo)]" />
              <p className="mt-5 eyebrow text-[color:var(--color-footer-muted)]">05 — Seasonal scale</p>
            </div>
            <div className="reveal-on-scroll">
              <h2 className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[46px]">
                Peak moving season should not turn screening into the bottleneck.
              </h2>
              <p className="mt-5 max-w-3xl text-[15.5px] leading-[1.75] text-[color:var(--color-footer-soft-text)]">
                Seasonal volume, crew expansion, multiple branches, temporary demand spikes, and new-market launches all create pressure on recruiters and operations managers. Standard role packages make it easier to send invitations, track status, and move completed candidates toward onboarding without rebuilding the scope every time.
              </p>
              <p className="mt-5 text-[13px] leading-[1.65] text-[color:var(--color-footer-muted)]">
                Timing varies by service, jurisdiction, court access, source availability, and third-party response.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="06 — Role-based package"
            heading="Use a matrix to start the scoping conversation—not to declare every check mandatory."
            intro="These labels are planning guidance only. Final packages depend on the job, location, operation, employer policy, and applicable law."
          />
          <div
            role="region"
            aria-label="Moving company role-based screening matrix"
            tabIndex={0}
            data-testid="moving-role-matrix"
            className="industry-company__matrix mt-10 overflow-x-auto rounded-[18px] border border-border bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2"
          >
            <table className="w-full min-w-[900px] border-collapse text-left">
              <caption className="sr-only">Common role-based screening considerations for moving companies</caption>
              <thead>
                <tr className="border-b border-border bg-[color:var(--color-tint)] text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)]">
                  <th scope="col" className="px-5 py-4">Role</th>
                  <th scope="col" className="px-4 py-4">Criminal screening</th>
                  <th scope="col" className="px-4 py-4">Identity trace</th>
                  <th scope="col" className="px-4 py-4">Employment verification</th>
                  <th scope="col" className="px-4 py-4">MVR</th>
                  <th scope="col" className="px-4 py-4">Drug screening</th>
                  <th scope="col" className="px-4 py-4">Continuous monitoring</th>
                </tr>
              </thead>
              <tbody>
                {MOVING_MATRIX.map((row) => (
                  <tr key={row.role} className="border-b border-border last:border-b-0">
                    <th scope="row" className="whitespace-nowrap px-5 py-4 font-display text-[16px] text-[color:var(--color-ink)]">{row.role}</th>
                    <td className="px-4 py-4 text-[13px] text-[color:var(--color-ink-soft)]">{row.criminal}</td>
                    <td className="px-4 py-4 text-[13px] text-[color:var(--color-ink-soft)]">{row.identity}</td>
                    <td className="px-4 py-4 text-[13px] text-[color:var(--color-ink-soft)]">{row.employment}</td>
                    <td className="px-4 py-4 text-[13px] text-[color:var(--color-ink-soft)]">{row.mvr}</td>
                    <td className="px-4 py-4 text-[13px] text-[color:var(--color-ink-soft)]">{row.drug}</td>
                    <td className="px-4 py-4 text-[13px] text-[color:var(--color-ink-soft)]">{row.monitoring}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="07 — Screening components"
            heading="Combine the checks that match the crew, vehicle, and operation."
            intro="Rapid Hire helps map the role to a practical package. Criminal history should be evaluated under applicable federal, state, and local requirements and the employer’s documented hiring policies—not treated as an automatic disqualifier."
          />
          <ServiceCards items={MOVING_SERVICES} />
        </div>
      </section>
    </>
  );
}

function IndustryFaq({ config }: { readonly config: IndustryCompanyPageConfig }) {
  return (
    <section id="faq" className="bg-[color:var(--color-paper-soft)] scroll-mt-24">
      <div className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Frequently asked questions"
          heading={`${config.name} screening, explained clearly.`}
          intro="These answers provide general information and are not legal advice. Package decisions should reflect the role, jurisdiction, policy, and applicable law."
        />
        <div className="mt-10 grid gap-3 lg:ml-[25%]">
          {config.faq.map((item) => (
            <details
              key={item.question}
              className="industry-company__faq reveal-on-scroll rounded-[16px] border border-border bg-white px-5 py-1 open:pb-5 md:px-7"
            >
              <summary className="cursor-pointer py-5 font-display text-[19px] leading-[1.3] text-[color:var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2">
                {item.question}
              </summary>
              <p className="max-w-3xl text-[14.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function IndustryCompanyPage({
  config,
}: {
  readonly config: IndustryCompanyPageConfig;
}) {
  const formId =
    config.kind === "cleaning"
      ? LEAD_FORM_IDS.cleaningCompanies
      : LEAD_FORM_IDS.movingCompanies;

  return (
    <SiteShell>
      <div
        className="industry-company overflow-x-clip bg-[color:var(--color-paper)]"
        data-industry-page={config.slug}
      >
        <section className="border-b border-border bg-[color:var(--color-paper)]">
          <div className="container grid min-h-[680px] items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
            <div className="industry-company__hero-copy">
              <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-[12px] text-[color:var(--color-ink-muted)]">
                <Link href="/industries" className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)]">
                  Industries
                </Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{config.name}</span>
              </nav>
              <p className="eyebrow">{config.eyebrow}</p>
              <h1 className="mt-6 max-w-[13ch] font-display text-[clamp(2.65rem,5.5vw,5.35rem)] leading-[0.98] tracking-[-0.035em] text-[color:var(--color-ink)]">
                {config.h1}
              </h1>
              <p className="mt-7 max-w-2xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)] md:text-[18px]">
                {config.subhead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#industry-lead-form"
                  className="industry-company__cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-center text-[14px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2"
                >
                  {config.primaryCta}
                  <ArrowRight aria-hidden="true" className="industry-company__arrow size-4" />
                </a>
                <Link
                  href={`/get-a-quote?industry=${config.slug}`}
                  className="industry-company__cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-center text-[14px] font-medium text-[color:var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2"
                >
                  {config.secondaryCta}
                  <ArrowUpRight aria-hidden="true" className="industry-company__arrow size-4" />
                </Link>
              </div>
              <p className="mt-6 max-w-xl text-[12.5px] leading-[1.65] text-[color:var(--color-ink-muted)]">
                {config.qualification}
              </p>
            </div>

            <div className="industry-company__hero-visual relative mx-auto w-full max-w-[620px] lg:justify-self-end">
              <div aria-hidden="true" className="absolute -inset-5 rounded-[30px] bg-[color:var(--color-tint)]" />
              <div className="relative overflow-hidden rounded-[24px] border border-border bg-white p-3 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.38)]">
                <img
                  src={config.illustration.src}
                  alt={config.illustration.alt}
                  width={config.illustration.width}
                  height={config.illustration.height}
                  loading="eager"
                  decoding="async"
                  className="block h-auto w-full rounded-[18px]"
                />
              </div>
              <div className="relative -mt-5 ml-5 mr-5 grid grid-cols-3 divide-x divide-border rounded-[16px] border border-border bg-white shadow-[0_14px_45px_-32px_rgba(15,23,42,0.4)] sm:ml-8 sm:mr-8">
                {[
                  ["Role-based", "Match duties"],
                  ["Location-aware", "Scope by market"],
                  ["Repeatable", "Reduce follow-up"],
                ].map(([title, body]) => (
                  <div key={title} className="min-w-0 px-3 py-4 text-center sm:px-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-accent-ink)]">{title}</p>
                    <p className="mt-1 text-[11px] leading-snug text-[color:var(--color-ink-muted)]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {config.kind === "cleaning" ? <CleaningContent /> : <MovingContent />}

        <section className="bg-[color:var(--color-paper)]">
          <div className="container py-20 md:py-28">
            <div className="grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
              <div className="reveal-on-scroll lg:sticky lg:top-28">
                <ShieldCheck aria-hidden="true" className="size-8 text-[color:var(--color-accent-ink)]" strokeWidth={1.6} />
                <p className="mt-6 eyebrow">Build your package</p>
                <h2 className="mt-5 font-display text-[36px] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink)] md:text-[48px]">
                  Tell us how your team hires and what the work requires.
                </h2>
                <p className="mt-5 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                  Share your roles, locations, volume, and customer or driver requirements. A specialist can help translate those details into a practical screening scope.
                </p>
                <div className="mt-7 space-y-3 text-[14px] text-[color:var(--color-ink-soft)]">
                  <p className="flex gap-3"><UserRoundCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]" />Employer screening inquiries only</p>
                  <p className="flex gap-3"><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]" />Packages can vary by role and location</p>
                  <p className="flex gap-3"><ClipboardCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[color:var(--color-accent-ink)]" />No one-size-fits-all requirement claims</p>
                </div>
              </div>
              <div className="reveal-on-scroll">
                <EmployerLeadForm
                  config={config.formConfig}
                  formId={formId}
                  anchorId="industry-lead-form"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-[color:var(--color-tint)]">
          <div className="container py-12">
            <div className="reveal-on-scroll flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <Scale aria-hidden="true" className="mt-1 size-5 shrink-0 text-[color:var(--color-accent-ink)]" />
                <p className="max-w-3xl text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  Employers should evaluate screening information according to applicable federal, state, and local requirements and their documented hiring policies. Rapid Hire Solutions does not provide legal advice.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-4">
                <Link href="/compliance" className="industry-company__text-link inline-flex items-center gap-2 text-[13.5px] font-medium text-[color:var(--color-accent-ink)]">Compliance resources <ArrowRight aria-hidden className="industry-company__arrow size-4" /></Link>
                <Link href="/resources/background-checks-by-state" className="industry-company__text-link inline-flex items-center gap-2 text-[13.5px] font-medium text-[color:var(--color-accent-ink)]">State guides <ArrowRight aria-hidden className="industry-company__arrow size-4" /></Link>
              </div>
            </div>
          </div>
        </section>

        <IndustryFaq config={config} />
      </div>
    </SiteShell>
  );
}

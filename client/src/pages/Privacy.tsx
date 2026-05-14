/*
  Editorial Calm — Privacy Policy
  Long-form legal page rendered with the shared SiteShell + PageHero.
  - Numbered eyebrow + italic accent for visual continuity with About.
  - Two-column layout: sticky in-page TOC on the left, body on the right.
  - SEO meta + JSON-LD WebPage schema via useSeo.
  - Visible "Last updated" line for trust + Google freshness signal.

  The copy below is template legalese suitable for a marketing website that
  is FCRA-aligned and explicitly NOT yet reviewed by counsel. It is meant to
  be edited by the brand's legal team before publication, but is grammatical,
  jurisdictionally specific (US, CCPA/CPRA, GDPR), and structured to match
  what auditors and procurement teams expect to see.
*/
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";

const LAST_UPDATED = "May 1, 2026";

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "scope",
    title: "1. Scope of this policy",
    body: (
      <>
        <p>
          This Privacy Policy explains how Rapid Hire Solutions
          (&ldquo;<strong>Rapid Hire</strong>,&rdquo; &ldquo;<strong>we</strong>,&rdquo;
          &ldquo;<strong>us</strong>&rdquo;) collects, uses, discloses, and
          safeguards personal information when you visit our website, request
          a quote, or otherwise interact with our marketing properties at
          rapidhiresolutions.com (the &ldquo;<strong>Site</strong>&rdquo;).
        </p>
        <p>
          When Rapid Hire is engaged by an employer to perform background
          screening services, the personal information processed about
          candidates is governed by our <em>Consumer Reporting Services
          Agreement</em> with that employer and the federal Fair Credit
          Reporting Act (15 U.S.C. § 1681 et seq.), not by this Site policy.
          A separate <em>Candidate Privacy Notice</em> is delivered with each
          background-check disclosure.
        </p>
      </>
    ),
  },
  {
    id: "information",
    title: "2. Information we collect",
    body: (
      <>
        <p>
          We collect information you provide directly when you contact us,
          request a quote, attend a demo, subscribe to our newsletter, or
          apply for a role: name, business email, employer, phone number,
          job title, hiring volume, and any free-text comments you include
          in the message.
        </p>
        <p>
          We also automatically collect technical information through
          first-party cookies and standard server logs: IP address, user
          agent, referring URL, timestamps, and the pages you visit. We do
          not deploy third-party advertising trackers on the Site.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "3. How we use information",
    body: (
      <>
        <p>
          We use the information collected through the Site to respond to
          your inquiries, schedule demonstrations, deliver requested content,
          send service-related communications, secure the Site against fraud
          and abuse, and produce aggregated, de-identified analytics that
          help us improve the experience.
        </p>
        <p>
          We do not sell personal information. We do not share personal
          information with third parties for cross-context behavioral
          advertising as those terms are defined under the California
          Consumer Privacy Act (CCPA/CPRA).
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. When we share information",
    body: (
      <>
        <p>
          We share Site information only with vetted service providers acting
          on our behalf — for example, our email-delivery and form-processing
          vendors — and only to the extent needed to perform their service.
          Each provider is bound by a written agreement that restricts use of
          the data to the contracted purpose.
        </p>
        <p>
          We may disclose information when required by law, in response to
          valid legal process, or to protect the rights, property, or safety
          of Rapid Hire, our customers, or the public. In the event of a
          merger, acquisition, or asset sale, information may be transferred
          to the successor entity, subject to this Policy.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "5. Your rights",
    body: (
      <>
        <p>
          Depending on your jurisdiction, you may have the right to access,
          correct, delete, port, or restrict the processing of your personal
          information; to opt out of certain disclosures; and to lodge a
          complaint with a supervisory authority. California residents may
          additionally exercise the rights granted by the CCPA/CPRA. Residents
          of the EEA, UK, and Switzerland may exercise the rights granted by
          the GDPR / UK GDPR.
        </p>
        <p>
          To exercise any of these rights, email{" "}
          <a className="ink-link" href="mailto:privacy@rapidhiresolutions.com">
            privacy@rapidhiresolutions.com
          </a>
          . We will respond within the timeframe required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "6. Retention",
    body: (
      <p>
        We retain Site information only as long as necessary to fulfill the
        purposes described above, comply with legal obligations, resolve
        disputes, and enforce our agreements. Inquiry and demo records are
        typically retained for 36 months from last contact.
      </p>
    ),
  },
  {
    id: "security",
    title: "7. Security",
    body: (
      <p>
        We maintain administrative, technical, and physical safeguards aligned
        with SOC 2 Type II and HIPAA requirements: encrypted transport (TLS
        1.2+), encrypted storage (AES-256), least-privilege access, audit
        logging, and annual third-party penetration testing. No system can
        guarantee absolute security; if you have reason to believe your
        information has been compromised, contact us immediately.
      </p>
    ),
  },
  {
    id: "children",
    title: "8. Children",
    body: (
      <p>
        The Site is intended for business users and is not directed to
        children under 16. We do not knowingly collect personal information
        from children. If you believe a child has provided us with personal
        information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "international",
    title: "9. International transfers",
    body: (
      <p>
        Rapid Hire is headquartered in the United States and processes Site
        information in the U.S. If you access the Site from outside the U.S.,
        you consent to the transfer of your information to the U.S. for the
        purposes described above. Where required, we rely on Standard
        Contractual Clauses or other approved transfer mechanisms.
      </p>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to this policy",
    body: (
      <p>
        We may update this Policy from time to time. The &ldquo;Last
        updated&rdquo; date at the top reflects the most recent change.
        Material changes will be highlighted in a banner on the Site for at
        least 30 days.
      </p>
    ),
  },
  {
    id: "contact",
    title: "11. Contact us",
    body: (
      <p>
        Questions, requests, or complaints about this Policy can be directed
        to our Privacy team at{" "}
        <a className="ink-link" href="mailto:privacy@rapidhiresolutions.com">
          privacy@rapidhiresolutions.com
        </a>
        .
      </p>
    ),
  },
];

export default function Privacy() {
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/privacy`
      : "/privacy";

  useSeo({
    title: "Privacy Policy",
    description:
      "How Rapid Hire Solutions collects, uses, and protects information from visitors to our website. Includes CCPA/CPRA and GDPR rights, retention, and contact details.",
    canonical,
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy — Rapid Hire Solutions",
      url: canonical,
      dateModified: "2026-05-01",
    },
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal — Privacy"
        title={
          <>
            Privacy{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              policy.
            </span>
          </>
        }
        lede="How Rapid Hire Solutions collects, uses, and protects personal information from visitors to our marketing website."
      />

      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28 grid grid-cols-12 gap-x-10 gap-y-10">
          {/* Sticky TOC */}
          <aside className="col-span-12 lg:col-span-3 reveal-on-scroll lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Contents</p>
            <div className="mt-3 hairline" />
            <ul className="mt-6 space-y-3 text-[14px] leading-snug">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
              Last updated
            </p>
            <p className="mt-2 text-[14px] text-[color:var(--color-ink-soft)]">
              {LAST_UPDATED}
            </p>
          </aside>

          {/* Body */}
          <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
            <div className="prose-legal max-w-3xl space-y-12">
              {SECTIONS.map((s) => (
                <article key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="font-display text-[26px] sm:text-[30px] leading-snug tracking-[-0.015em] text-[color:var(--color-ink)]">
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-[15.5px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                    {s.body}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

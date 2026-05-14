/*
  Editorial Calm — Terms & Conditions
  Same shell + sticky TOC layout as the Privacy page so the two legal pages
  feel like a matched pair. Copy is a starter set suitable for a marketing
  website governing a B2B background-screening service. Substantive screening
  obligations live in the separate Consumer Reporting Services Agreement.
*/
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";

const LAST_UPDATED = "May 1, 2026";

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of these terms",
    body: (
      <p>
        These Terms &amp; Conditions (&ldquo;<strong>Terms</strong>&rdquo;)
        govern your access to and use of rapidhiresolutions.com and any
        associated content, forms, or web tools (the &ldquo;
        <strong>Site</strong>&rdquo;). By using the Site you agree to these
        Terms. If you do not agree, do not use the Site. These Terms apply
        only to the Site; provision of background screening services is
        governed by a separately executed Consumer Reporting Services
        Agreement.
      </p>
    ),
  },
  {
    id: "use",
    title: "2. Permitted use",
    body: (
      <p>
        You may access the Site for your internal business evaluation of
        Rapid Hire&apos;s services. You may not (a) reverse engineer or
        scrape the Site at scale, (b) use the Site to send unsolicited
        commercial communications, (c) probe, scan, or test the
        vulnerability of the Site without prior written consent, or (d) use
        the Site to violate any law or third-party right.
      </p>
    ),
  },
  {
    id: "content",
    title: "3. Content & intellectual property",
    body: (
      <p>
        The Site, including all text, graphics, logos, software, and design,
        is owned by Rapid Hire Solutions or its licensors and is protected
        by U.S. and international intellectual property laws. We grant you a
        limited, revocable, non-transferable license to view the Site for
        the permitted use above. All other rights are reserved. Trademarks
        used on the Site are the property of their respective owners.
      </p>
    ),
  },
  {
    id: "submissions",
    title: "4. Submissions",
    body: (
      <p>
        Any feedback, suggestions, or other materials you submit through the
        Site (excluding personal information governed by our{" "}
        <a className="ink-link" href="/privacy">
          Privacy Policy
        </a>
        ) are non-confidential and may be used by Rapid Hire without
        restriction. You represent that you have the authority to make such
        submission and that it does not infringe any third-party right.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "5. Disclaimer of warranties",
    body: (
      <p>
        THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
        INCLUDING WITHOUT LIMITATION ANY WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY OF
        CONTENT. Statistics, sample reports, and pricing examples on the
        Site are illustrative and do not constitute a binding offer or
        guarantee of results.
      </p>
    ),
  },
  {
    id: "liability",
    title: "6. Limitation of liability",
    body: (
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL RAPID HIRE
        OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE,
        OR DATA, ARISING FROM YOUR USE OF THE SITE, EVEN IF ADVISED OF THE
        POSSIBILITY OF SUCH DAMAGES. Our aggregate liability arising out of
        or related to the Site is limited to one hundred U.S. dollars
        ($100). The substantive obligations and remedies that govern
        background screening services are addressed in the separately
        executed services agreement.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "7. Third-party links",
    body: (
      <p>
        The Site may link to third-party websites or services we do not
        control. We are not responsible for the content, privacy practices,
        or terms of those third parties. Your use of any linked site or
        service is at your own risk and subject to the terms of that third
        party.
      </p>
    ),
  },
  {
    id: "termination",
    title: "8. Termination",
    body: (
      <p>
        We may suspend or terminate your access to the Site at any time and
        for any reason, including for breach of these Terms. The disclaimer
        of warranties, limitation of liability, and governing law sections
        survive termination.
      </p>
    ),
  },
  {
    id: "law",
    title: "9. Governing law",
    body: (
      <p>
        These Terms are governed by the laws of the State of Delaware,
        without regard to its conflict-of-laws principles. Any dispute
        arising out of or relating to these Terms or the Site shall be
        brought exclusively in the state or federal courts located in
        Wilmington, Delaware, and the parties consent to personal
        jurisdiction there.
      </p>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to these terms",
    body: (
      <p>
        We may update these Terms from time to time. The &ldquo;Last
        updated&rdquo; date at the top reflects the most recent change.
        Material changes will be highlighted in a banner on the Site for at
        least 30 days. Continued use of the Site after the effective date
        constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "11. Contact us",
    body: (
      <p>
        Questions about these Terms can be directed to{" "}
        <a className="ink-link" href="mailto:legal@rapidhiresolutions.com">
          legal@rapidhiresolutions.com
        </a>
        .
      </p>
    ),
  },
];

export default function Terms() {
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/terms`
      : "/terms";

  useSeo({
    title: "Terms & Conditions",
    description:
      "Terms governing use of the Rapid Hire Solutions marketing website, including permitted use, intellectual property, disclaimers, limitation of liability, and governing law.",
    canonical,
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms & Conditions — Rapid Hire Solutions",
      url: canonical,
      dateModified: "2026-05-01",
    },
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal — Terms"
        title={
          <>
            Terms{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              of use.
            </span>
          </>
        }
        lede="The rules that govern your use of the Rapid Hire Solutions marketing website. Substantive screening obligations live in the separately executed services agreement."
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

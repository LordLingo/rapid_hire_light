/*
  §83 — /resources/glossary
  --------------------------
  A–Z definition list for the background-screening industry, designed
  to serve two audiences at once: HR teams who need a quick definition
  during a procurement evaluation, and search engines indexing the
  long tail of "what is X" queries that competitor sites currently
  monopolize. Anchored alphabet jump-strip across the top, alphabetical
  groups below, with a closing CTA banner.
*/
import { useMemo } from "react";
import { Link } from "wouter";
import { ArrowUpRight, BookOpen } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import { GLOSSARY } from "@/lib/glossary";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function ResourcesGlossary() {
  useSeo({
    title: "Background-check glossary — Rapid Hire Solutions",
    description:
      "A–Z definitions of the terms that show up across background-check contracts, FCRA paperwork, and DOT/healthcare/finance hiring decisions.",
    canonical: "https://www.rapidhiresolutions.com/resources/glossary",
  });

  // Group entries by first letter of `term`.
  const grouped = useMemo(() => {
    const map: Record<string, typeof GLOSSARY[number][]> = {};
    for (const e of GLOSSARY) {
      const letter = e.term[0]!.toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter]!.push(e);
    }
    // alphabetize within each letter
    for (const letter of Object.keys(map)) {
      map[letter]!.sort((a, b) => a.term.localeCompare(b.term));
    }
    return map;
  }, []);

  const presentLetters = ALPHABET.filter((L) => Boolean(grouped[L]));

  return (
    <SiteShell>
      <PageHero
        eyebrow="Resources · Glossary"
        title={
          <>
            <span className="block">The terms that show up</span>
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              before, during, and after
            </span>{" "}
            a background check.
          </>
        }
        lede="A–Z definitions for the vocabulary we use across our white papers, services, and compliance pages — written in plain English, with a pointer to the governing rule or our deeper resource where one exists."
        afterLede={
          <div className="mt-8 flex flex-wrap gap-2">
            {presentLetters.map((L) => (
              <a
                key={L}
                href={`#letter-${L}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-[13px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-tint)] hover:border-[color:var(--color-accent-halo)] transition-colors"
                aria-label={`Jump to ${L}`}
              >
                {L}
              </a>
            ))}
          </div>
        }
        visual={
          <div className="rounded-[18px] border border-border paper-shadow bg-white p-6 md:p-7">
            <div className="flex items-center gap-3 text-[color:var(--color-accent-ink)]">
              <BookOpen className="h-5 w-5" />
              <p className="font-display text-[20px] tracking-[-0.005em] text-[color:var(--color-ink)]">
                {GLOSSARY.length} entries — first edition.
              </p>
            </div>
            <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Spot a missing term? Reply to any thread with our specialist
              desk and we'll add it to the next edition. The list is
              versioned the same way our white papers and state matrices are.
            </p>
          </div>
        }
      />

      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24 max-w-4xl">
          {presentLetters.map((L) => (
            <div key={L} id={`letter-${L}`} className="scroll-mt-24 mb-12">
              <p className="font-display text-[28px] md:text-[36px] leading-none text-[color:var(--color-accent-ink)]">
                {L}
              </p>
              <div className="mt-3 hairline" />
              <dl className="mt-6 space-y-6">
                {grouped[L]!.map((entry) => (
                  <div
                    key={entry.id}
                    id={entry.id}
                    data-testid={`glossary-entry-${entry.id}`}
                    className="scroll-mt-24 rounded-[14px] border border-border bg-white p-5 md:p-6"
                  >
                    <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-[19px] tracking-[-0.005em] text-[color:var(--color-ink)]">
                        {entry.term}
                      </span>
                      {entry.aka && entry.aka.length > 0 ? (
                        <span className="text-[12.5px] text-[color:var(--color-ink-muted)]">
                          {entry.aka.join(" · ")}
                        </span>
                      ) : null}
                    </dt>
                    <dd className="mt-3 text-[14.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                      {entry.definition}
                    </dd>
                    {entry.see ? (
                      <Link
                        href={entry.see.href}
                        className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[color:var(--color-accent-ink)] hover:underline"
                      >
                        See also: {entry.see.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}

/*
  Editorial Calm — Common Questions
  Hairline-divided accordion. Item rows have no boxes — just a serif
  question, body answer, and a + / – glyph that rotates on open.
*/
import { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "wouter";

const QA = [
  {
    q: "How fast do background checks usually take?",
    a:
      "Most checks (over 85%) are completed within 24 hours. Some specialized searches take 2–3 days.",
  },
  {
    q: "Is Rapid Hire Solutions FCRA compliant?",
    a:
      "Absolutely. Our platform automates compliance steps including disclosure and authorization forms.",
  },
  {
    q: "Do you integrate with our existing ATS?",
    a:
      "Yes — we integrate with Greenhouse, Bullhorn, Workable, BambooHR, and JazzHR.",
  },
  {
    q: "What does the candidate experience look like?",
    a:
      "We prioritize a smooth candidate experience. Applicants receive a secure, mobile-friendly link to submit their details.",
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="contact" className="relative bg-[color:var(--color-paper)]">
      <div className="container py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
            <p className="eyebrow">08 — Common questions</p>
            <h2 className="mt-5 font-display text-[34px] sm:text-[42px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
              Need specifics on packages or{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                compliance?
              </span>
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
              Our team is U.S.-based, FCRA-certified, and built for high-volume
              hiring environments. Reach out and we&apos;ll get back the same
              business day.
            </p>
            <Link
              href="/contact"
              className="btn-press mt-7 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] bg-white px-5 py-3 text-[13.5px] font-medium text-[color:var(--color-accent-ink)] hover:bg-[color:var(--color-accent-ink)] hover:text-white"
            >
              Contact our support team
            </Link>
          </div>

          <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
            <div className="border-t border-border">
              {QA.map((item, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div
                    key={item.q}
                    className="border-b border-border"
                  >
                    <button
                      className="w-full flex items-center justify-between gap-5 py-6 md:py-7 text-left"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-[20px] md:text-[24px] leading-snug text-[color:var(--color-ink)]">
                        {item.q}
                      </span>
                      <span
                        className={[
                          "grid place-items-center size-9 rounded-full border border-border text-[color:var(--color-ink)] transition-transform duration-300",
                          isOpen ? "rotate-45" : "rotate-0",
                        ].join(" ")}
                        aria-hidden
                      >
                        <Plus className="size-4" strokeWidth={1.5} />
                      </span>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 md:pb-8 max-w-2xl text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

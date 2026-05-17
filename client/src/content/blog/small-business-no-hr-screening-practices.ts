import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "small-business-no-hr-screening-practices",
  title: "Hiring Without an HR Team: DIY-Safe Background Screening Practices",
  metaTitle: "Small Business No-HR Background Screening Guide",
  metaDescription:
    "A defensible 2026 screening playbook for small businesses without an HR team. Five practices that keep founders out of FCRA, EEOC, and state-law trouble.",
  excerpt:
    "Most small businesses do not have an HR team. That does not exempt them from FCRA, EEOC, or state-law screening requirements. Here are five DIY-safe practices founders can put in place without dedicated compliance staff.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["small-business", "hiring", "compliance"],
  body: `Small businesses without dedicated HR staff carry the same screening compliance obligations as enterprise employers. The Fair Credit Reporting Act, EEOC guidance on [arrest and conviction records](/blog/eeoc-arrest-conviction-employer-guidance), and state-level fair-chance laws apply identically whether the company has five hundred employees or five. The challenge for small businesses is procedural: how does a founder build a defensible screening program without an HR generalist on staff to maintain the playbook? Five practices, used consistently, get a no-HR shop most of the way to a defensible program.

## Practice 1: Standardize on one CRA and one package by role family

Every screening decision a small business makes carries audit risk if the program looks ad hoc. The single highest-leverage practice is consistency: pick **one CRA** (FCRA-registered, ideally PBSA-accredited), define **two or three role-family packages**, and apply them uniformly. A typical structure looks like: a "general" package (SSN + national criminal + county) for office roles, a "driver" package that adds [MVR and DOT-relevant components](/blog/dot-driver-background-checks-mvr) for any role driving on company business, and a "trust" package that adds employment + education verification for roles handling money or sensitive data.

Standardizing the packages does two things. It removes hiring-manager discretion that creates disparate-impact exposure under [Title VII](/blog/eeoc-title-vii-disparate-impact-screening). And it lets the founder defend the program later as a documented, neutral hiring practice rather than a series of one-off decisions.

## Practice 2: Treat the disclosure-and-authorization templates as untouchable

Many small businesses inherit disclosure-and-authorization templates from their applicant tracking system, an attorney friend, or a payroll vendor. Most of these templates were drafted before the *Syed v. M-I* and *Gilberg v. CalNova* decisions narrowed what counts as a [standalone disclosure](/blog/fcra-604b-disclosure-authorization), and many include the very provisions courts have invalidated. The DIY-safe practice is to use the disclosure-and-authorization templates supplied by your CRA, do not modify them, and do not bundle them with offer-letter language.

If the offer letter and the disclosure currently sit on the same PDF, separate them today. The cost is zero and the FCRA exposure savings can be six figures.

## Practice 3: Calendar the seven-day adverse-action waiting period

The most-litigated procedural error in small-business FCRA work is not the disclosure form — it is the [pre-adverse-action waiting period](/blog/adverse-action-letter-fcra-template). When a report comes back with adverse information, federal courts treat **seven business days** as the safe-harbor window between pre-adverse and final adverse-action notices. The DIY-safe practice is to set the calendar reminder *before* sending the pre-adverse notice. Use whatever calendar tool the company already uses. Title the event "FCRA hold — final adverse action OK on \\<date\\>". The cost is two minutes per case and the procedural defense is airtight.

## Practice 4: Document every adjudication in two paragraphs

If a background check returns findings and the company decides not to hire, that decision needs an [individualized assessment](/blog/eeoc-arrest-conviction-employer-guidance) under EEOC guidance. The DIY-safe version of an individualized assessment is two paragraphs in a shared Google Doc. Paragraph one summarizes what the report found: the offense, the date, the disposition. Paragraph two explains why the offense is relevant to the specific job duties: the EEOC's three-factor test (nature/gravity, time elapsed, job-relatedness) is the framework, and the documentation does not need to be more sophisticated than a few honest sentences. What it cannot be is silent.

Save the document with the candidate's file. If the decision is challenged a year later, the contemporaneous record is the entire defense.

## Practice 5: Run a one-hour annual review

Small business screening programs decay quietly. State laws change ([Illinois JOQAA](/blog/illinois-joqaa-background-checks), [California ICRAA](/blog/california-icraa-disclosure-requirements), and [NYC Fair Chance Act](/blog/nyc-fair-chance-act-background-checks) all expanded materially in the last three years), CRA contract terms shift, and the company's own role mix evolves. The DIY-safe practice is a **one-hour annual review** on a recurring calendar invite. Pull the disclosure-and-authorization templates and confirm they match what the CRA is using. Pull two or three recent adjudication files and verify the documentation. Check whether any new states are in scope (a single remote hire in California subjects the company to ICRAA; a single remote hire in NYC subjects the company to the Fair Chance Act).

The review is not a comprehensive audit. It is a check-in. An hour per year, run consistently, keeps small business screening programs out of the territory where simple errors compound into serious litigation. The [services page](/services) lays out what a typical small-business screening program covers, and the [pricing calculator](/pricing) models the cost.`,
};

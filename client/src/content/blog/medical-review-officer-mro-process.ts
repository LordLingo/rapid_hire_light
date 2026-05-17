import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "medical-review-officer-mro-process",
  title:
    "The Medical Review Officer (MRO) Process: How a Drug Test Becomes a Result",
  metaTitle: "Medical Review Officer (MRO) Process Guide",
  metaDescription:
    "Every non-negative drug test goes through a Medical Review Officer before reaching the employer. The 2026 guide to MRO verification, defenses, and the five-day clock.",
  excerpt:
    "Every non-negative drug test in the United States is required to go through a Medical Review Officer before the result reaches the employer. Here is how the MRO process actually works in 2026, what counts as a legitimate medical explanation, and where employers most often act on a result before MRO verification is complete.",
  publishedAt: "2026-02-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["drug-screening", "compliance", "verification"],
  body: `Every non-negative drug test in the United States — DOT-regulated and most non-DOT — passes through a **Medical Review Officer** before the result reaches the employer. The MRO is a licensed physician trained in substance-abuse testing whose job is to look at a laboratory's confirmed positive, adulterated, substituted, or invalid result and determine whether there is a **legitimate medical explanation** that downgrades the result. It is the single most under-understood step in the testing chain. Employers that act on lab-direct results without MRO verification routinely lose wrongful-discharge cases, and under DOT rules it is a per-se violation.

## What the MRO actually does

The MRO's role is defined in 49 CFR Part 40 Subpart G for DOT testing and mirrored by the **AAMRO** and **MROCC** standards for non-DOT testing. The MRO receives the laboratory's verified non-negative result, reviews the chain of custody and the federal Custody and Control Form, contacts the donor by phone, and conducts a structured interview about prescription medications, OTC medications, and medical conditions that could explain the result.

The MRO then either **verifies** the result as positive or **downgrades** it to negative based on a legitimate medical explanation. For DOT testing, the MRO has up to five business days to complete verification; non-DOT contracts mirror that window.

For where the MRO sits in the broader DOT chain, our [49 CFR Part 40 employer playbook](/blog/dot-drug-testing-49-cfr-part-40) walks through the full sequence from collection to Clearinghouse query.

## The legitimate medical explanations

Under §40.137 of Part 40, the MRO is required to evaluate four categories of explanation. **Valid prescriptions** that match the detected substance and were taken consistent with the prescription label downgrade the result — a hydrocodone prescription explains an opiate positive, an Adderall prescription explains an amphetamine positive. **Over-the-counter medications** that contain the substance can explain certain results — a documented Sudafed regimen, for example, can explain a low-level amphetamine result in jurisdictions that test for it. **Legitimate medical procedures** can explain a positive — recent dental surgery with codeine analgesia explains an opiate positive. And in non-DOT testing, **valid state-issued medical marijuana cards** in states that recognize them can downgrade a marijuana result, depending on employer policy and state law. For the state-by-state cannabis texture, see our [marijuana drug testing state laws guide](/blog/marijuana-drug-testing-state-laws).

The MRO is **not** allowed to downgrade a result for "I had a poppy-seed bagel" alone — the federal opiate cutoff was raised to 2,000 ng/mL precisely to eliminate that defense — and is not allowed to downgrade based on second-hand exposure (passive marijuana smoke) at the federal cutoffs. Both are common employee defenses; both fail.

## What employers must wait for

The most-violated rule in the MRO process is also the simplest: **the employer cannot act on a result until the MRO has reported the verified result.** Section 40.149 prohibits an employer from contacting the laboratory directly for a result and from acting on a "preliminary positive" or "non-negative" notification. The verified MRO report is the only lawful trigger for adverse action.

In practice, this means the FCRA pre-adverse-action sequence — which our [adverse-action letter template guide](/blog/adverse-action-letter-fcra-template) walks through — does not start until the MRO report is in hand. Bundling the pre-adverse-action notice and the final adverse action on the same day is a common FCRA error, and starting the sequence before MRO verification is a common Part 40 error.

## The shy bladder, refusal, and split specimen layers

Three procedural events sit on top of the MRO review. **Shy bladder** under §40.193 requires a five-day medical evaluation when an employee cannot produce 45 mL of urine after three hours; the MRO directs the evaluation. **Refusal to test** under §40.191 is treated as a positive result. **Split specimen retest** under §40.171 lets the employee request Bottle B be tested at a different HHS-certified lab within 72 hours of MRO notification; if Bottle B does not reconfirm, the original result is canceled.

These are the primary defenses an employee has after a non-negative result, and the MRO is the gatekeeper for all three.

## What we recommend for 2026

Treat the MRO verification step as a hard gate in the workflow. No adverse action, no notice to the candidate or employee, and no FCRA pre-adverse letter goes out before the verified MRO report is in the file. Use a single MRO vendor across DOT and non-DOT testing so the verification logic is consistent. Train the talent-acquisition team on the §40.171 split-specimen window so a candidate who asks about it gets the right answer. Document the SAP referral path in writing for any verified positive on a regulated employee. For unregulated employees, define in policy whether legitimate medical explanations downgrade results consistent with the AAMRO standards or whether you require a stricter posture.

Rapid Hire's drug-screening lane includes MRO verification by default. To see how it fits your hiring process, [view pricing](/pricing) or [talk to a specialist](/contact).`,
};

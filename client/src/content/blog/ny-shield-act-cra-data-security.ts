import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "ny-shield-act-cra-data-security",
  title: "NY SHIELD Act: Data Security Duties for CRAs and Employers",
  metaTitle: "NY SHIELD Act CRA Data Security Compliance Guide 2026",
  metaDescription:
    "NY SHIELD Act imposes data security and breach notification duties on any business holding NY resident data. Here is how it applies to background screening in 2026.",
  excerpt:
    "NY SHIELD Act extends data security and breach-notification duties to any business that holds private information of New York residents. Here is the CRA and employer compliance map for 2026.",
  publishedAt: "2026-04-13",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["new-york", "compliance"],
  body: `New York's **Stop Hacks and Improve Electronic Data Security (SHIELD) Act**, effective March 21, 2020, imposed data security and breach-notification duties that reach far beyond New York-based businesses. Any company that holds "private information" of a New York resident is in scope, regardless of where the company is headquartered. For consumer reporting agencies and the employers who use them, the SHIELD Act overlays federal FCRA-derived security expectations and the FTC Safeguards Rule with a state-specific compliance regime that carries real teeth. Below is the 2026 map for background-screening operations.

## Who is covered

The SHIELD Act applies to any business — irrespective of state of incorporation or headquarters location — that owns or licenses **private information** of a New York resident. The trigger is data possession plus New York residency of the data subject, not the holder's location. A CRA in Texas processing a New York applicant's report is in scope. An out-of-state employer authorizing a screen on a New York candidate is in scope.

## What "private information" means

The SHIELD Act defines private information as personal information consisting of any of the following data elements when in combination with the personal information that identifies the resident:

Social security number. Driver's license number or non-driver identification card number. Account number, credit or debit card number — alone or in combination with any required security code, access code, or password. Biometric information used to authenticate or ascertain identity. Username or email address in combination with password or security question/answer permitting access to an online account.

A consumer report typically contains the SSN, often a state ID, and may carry biometric identifiers (Live Scan fingerprint records). Each of these triggers SHIELD Act coverage on its own.

## The three operational duties

**Reasonable safeguards.** The SHIELD Act requires every covered entity to implement and maintain reasonable safeguards under three categories: administrative (employee training, designated security personnel, risk assessments), technical (access controls, encryption, intrusion detection), and physical (physical access controls, secure disposal). Compliance with one of the listed federal or state regimes — HIPAA, GLBA, NYDFS Part 500, or a substantially similar state law — is treated as compliance with the SHIELD safeguards requirement.

**Breach notification.** Covered entities must notify affected New York residents and the New York Attorney General "in the most expedient time possible and without unreasonable delay" upon discovery of a breach. Notification content must include the categories of data exposed and the steps the entity is taking to address the breach. For breaches affecting more than 5,000 New York residents, notification to credit reporting agencies is also required.

**Disposal.** Records containing private information must be disposed of by shredding, erasing, or otherwise modifying to make the information unreadable.

## How this hits CRAs

CRAs holding consumer-report data with NY-resident SSNs are squarely in scope. The 2026 baseline a CRA must run for SHIELD compliance:

A **written information security program (WISP)** with named security officer, periodic risk assessments, employee training, vendor management, incident response, and secure disposal protocols. **Encryption** of private information at rest and in transit. **Access controls** with least-privilege defaults and periodic review. **Vendor due diligence** on subprocessors with documented security attestations. **Breach response** with the New York-specific 5,000-resident credit-reporting-agency notification trigger built into the playbook.

Most established CRAs are SOC 2 Type II audited. SOC 2 alignment is a strong but not automatically dispositive proxy for SHIELD Act safeguards compliance. The SHIELD Act expressly recognizes compliance with HIPAA, GLBA, and NYDFS Part 500 as safe harbor. SOC 2 is not on the safe-harbor list, so the CRA must still document the SHIELD-specific safeguards mapping even when SOC 2 audited.

## How this hits employers

Employers ordering reports on New York applicants hold a copy of the report after delivery. Even if the CRA bears primary processing duties, the employer's storage of the report containing private information triggers employer-side SHIELD obligations. The employer must implement reasonable safeguards on report storage, control access on a least-privilege basis, encrypt the data at rest, and dispose of reports under retention policy timeframes.

Employer-side breach notification is also possible: a stolen laptop containing screening reports on New York residents is a SHIELD-actionable breach for the employer regardless of whether the CRA's systems were involved.

## Enforcement

The New York Attorney General enforces the SHIELD Act. Civil penalties for failure to provide notice run \\$20 per affected resident up to \\$250,000 per violation, plus injunctive relief and consumer remedies. Civil penalties for failure to implement reasonable safeguards run up to \\$5,000 per violation, with each affected resident potentially treated as a separate violation in egregious cases.

The enforcement docket includes settlements with online retailers and a regional payroll provider for SHIELD violations, with values commonly in the \\$500K–\\$3M range.

## What to do today

Three operational items. **(1) Vendor diligence.** Confirm CRA vendor SHIELD compliance with documented WISP, encryption, access controls, and breach playbook. **(2) Internal storage hygiene.** Build the employer-side WISP, encrypt report storage, set retention deletion timestamps, and document disposal. **(3) Breach playbook update.** Add the New York-specific notification triggers — including the 5,000-resident CRA notification trigger — to the existing incident response plan.

Our [Article 23-A multi-factor analysis](/blog/nyc-article-23a-multi-factor-analysis), [NYC Fair Chance Act primer](/blog/nyc-fair-chance-act-background-checks), and [federal FCRA Section 615 employer duties](/blog/fcra-615-623-employer-duties) cover the connected pieces. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};

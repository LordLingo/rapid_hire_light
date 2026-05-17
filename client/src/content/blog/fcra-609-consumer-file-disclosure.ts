import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "fcra-609-consumer-file-disclosure",
  title:
    "FCRA §609 Consumer File Disclosure: What Candidates See and What Employers Must Honor",
  metaTitle: "FCRA 609 Consumer File Disclosure Guide",
  metaDescription:
    "FCRA §609 gives consumers the right to see their full CRA file. Here is the 2026 employer guide to how §609 disclosures interact with the hiring decision and dispute process.",
  excerpt:
    "FCRA §609 grants consumers the right to receive their full CRA file on request. For employment screening, the §609 file is the document candidates use to identify reporting errors and trigger §611 disputes. Here is the 2026 employer playbook.",
  publishedAt: "2026-01-09",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["fcra", "compliance", "candidate-experience"],
  body: `Most employers know the FCRA gives candidates a copy of the consumer report when adverse action is contemplated under §604(b)(3). Far fewer know about **§609** (15 U.S.C. §1681g), which gives every consumer the right to obtain their full CRA file on demand — at any time, free once per year, and at the moment a §615 adverse action notice is received. The §609 disclosure is the document candidates use to identify reporting errors and trigger §611 disputes, and it is the single most important compliance touchpoint between the candidate and the CRA.

This guide walks through what §609 requires, what the file actually contains, and how employers should respond when a candidate produces their §609 file during the pre-adverse-action window.

## What §609 requires the CRA to disclose

§609(a) requires a CRA to disclose to the consumer "all information in the consumer's file at the time of the request" and to identify the sources of that information. "File" is defined at §603(g) as all the information on a consumer that is recorded and retained by a CRA, regardless of how the information is stored. In practice, an employment-purpose §609 file disclosure includes the following items.

| Element | Section | Note |
| --- | --- | --- |
| All information in the file | §609(a)(1) | Including raw source data, not just the reported summary |
| Sources of information | §609(a)(2) | Original courthouse, original employer, original school |
| Recipients in the past 2 years | §609(a)(3) | Employers who pulled the report |
| Date, original payee, amount of any check | §609(a)(4) | For check-services CRAs |
| Credit score (if held) | §609(f) | Free once per year via §612(a) |

The CRA must deliver the §609 disclosure within 15 days of a verified consumer request. Delivery may be electronic if the consumer consents. Free disclosures under §612 (one per 12 months, plus on identity-theft alert, plus on adverse action) are the most common. Beyond that, the CRA may charge a "reasonable fee" capped at the §612(f) statutory maximum, adjusted annually by the CFPB.

## How §609 interacts with adverse action

When a candidate receives a pre-adverse-action notice under §604(b)(3), the FCRA gives them a window — typically five business days — to identify reporting errors and challenge the basis for the adverse decision. The §609 file is the primary tool candidates use during that window. They request the file from the CRA, identify a record they believe is wrong (an arrest that was dismissed, a civil judgment that was vacated, a credit account that was paid), and file a §611 dispute.

Once a §611 dispute is open, three things happen at once. The CRA has 30 days to reinvestigate (45 days if the consumer files supporting documents during the reinvestigation). The candidate can ask the employer to hold the hiring decision pending the dispute outcome. The employer is not required to wait under FCRA, but waiting is the safe posture and is required by some state laws. Our companion guide on [§611 reinvestigation](/blog/fcra-611-dispute-reinvestigation) walks through the dispute mechanics in detail.

For how the pre-adverse-action notice itself should look, see our [adverse action letter template](/blog/adverse-action-letter-fcra-template).

## What employers should do during a §609 challenge

When a candidate produces a §609 file and disputes a record, the employer's posture should be procedural, not substantive. The employer is not the entity that verifies public records — that is the CRA's job under §613. The employer's role is to (a) acknowledge receipt of the dispute, (b) put the hiring decision on hold pending CRA reinvestigation, (c) re-pull a corrected report once the CRA closes the dispute, and (d) then proceed to either retract the pre-adverse-action notice or finalize adverse action under §615.

The single most common employer error during this window is finalizing adverse action while the dispute is still open. Doing so does not create direct §615 liability if the §615 notice was procedurally clean, but it is the single best evidence in a §616 willfulness claim that the employer treated the FCRA process as a paperwork exercise rather than a meaningful candidate right. The candidate who disputes a record on a §609 file and is then terminated five days later, before the CRA has reinvestigated, is the candidate who certifies a class.

## What we recommend for 2026

Train recruiters and hiring managers to recognize a §609 file when a candidate sends one in. Build a hold-hiring-decision workflow that triggers automatically when a candidate references a §611 dispute, a §609 file, or a CRA reinvestigation. Document the candidate's request, the CRA's response, and the employer's hold decision in the candidate file — this paper trail is the §616 willfulness defense. For a CRA partner that handles §609 and §611 cleanly with consumer-portal access and 24-hour dispute acknowledgment, see [our pricing](/pricing) and [request a quote](/contact).`,
};

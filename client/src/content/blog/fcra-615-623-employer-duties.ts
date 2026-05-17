import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "fcra-615-623-employer-duties",
  title:
    "FCRA §615 and §623: The Two Sections Most Employers Get Wrong",
  metaTitle: "FCRA 615 & 623 Employer Duties Guide",
  metaDescription:
    "FCRA §615 imposes the adverse-action notice duty; §623 imposes furnisher accuracy duties. Here is the 2026 employer playbook for both sections in employment screening.",
  excerpt:
    "FCRA §615 is the adverse-action duty — the obligation to notify a candidate when a report drives an adverse hiring decision. §623 is the furnisher accuracy duty. Both apply to employers in specific scenarios most compliance programs miss. Here is the 2026 playbook.",
  publishedAt: "2026-01-14",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["fcra", "compliance", "adverse-action", "criminal-records"],
  body: `Two FCRA sections drive a disproportionate share of employer enforcement risk and are routinely misunderstood by even experienced HR teams. **§615** (15 U.S.C. §1681m) governs the adverse-action notice — what the employer tells a candidate when a consumer report drives an unfavorable hiring decision. **§623** (15 U.S.C. §1681s-2) governs the duties of furnishers — entities that report information to a CRA — and most employers do not realize they become §623 furnishers when they verify employment for outbound reference checks.

This guide walks through what each section actually requires in 2026 and where the two intersect with employment screening.

## What §615 requires when a report drives adverse action

§615(a) imposes three independent disclosure duties on any "user of a consumer report" that takes adverse action based in whole or in part on the report. First, the user must provide **oral, written, or electronic notice** of the adverse action. Second, the user must disclose the **name, address, and telephone number** of the CRA that furnished the report. Third, the user must include a **statement that the CRA did not make the adverse decision** and is unable to provide reasons for it, along with notice of the consumer's rights under §609 to obtain a free file disclosure and under §611 to dispute the report's accuracy.

For employment, §615 sits on top of the §604(b)(3) **pre-adverse-action duty** that runs first: before adverse action, the employer must give the candidate a copy of the report and the FTC's "A Summary of Your Rights Under the Fair Credit Reporting Act." After a reasonable waiting period (typically five business days), the employer can finalize adverse action with the §615 notice. Our companion guide on the [adverse action letter template](/blog/adverse-action-letter-fcra-template) walks through the exact two-letter sequence.

The single most-litigated §615 issue is **what counts as adverse action based on the report**. Courts have held that withdrawing a contingent offer after a positive criminal record finding is adverse action, even if the employer would also have rejected the candidate for unrelated reasons. The "in whole or in part" language is read broadly. Employers that rely on a "not the report's fault" defense are the ones that face §616 willfulness exposure.

## When §623 makes an employer a furnisher

§623 applies to any entity that **furnishes information to a consumer reporting agency**. Most employers think of themselves as users of consumer reports, not furnishers — but the line crosses when the employer responds to an outbound reference check from another employer's CRA. The dates of employment, position, and reason-for-leaving the employer reports to that CRA are §623-furnished information, and §623 imposes the same accuracy and reinvestigation duties on the employer that it imposes on credit-bureau-feeding furnishers.

§623(a)(1)(A) prohibits a furnisher from reporting information the furnisher "knows or has reasonable cause to believe" is inaccurate. §623(a)(2) requires the furnisher to correct and notify the CRA when the furnisher learns of an inaccuracy. §623(b), as discussed in our [§611 reinvestigation guide](/blog/fcra-611-dispute-reinvestigation), requires the furnisher to investigate any dispute the CRA forwards within the same 30-day window the CRA itself faces.

## The two most common §623 traps

The first trap is the **"reason for leaving" data point**. An employer reporting that a former employee was "terminated for misconduct" — when the actual reason was a layoff, a performance plan, or a mutual separation — is reporting information the employer knows or should know is inaccurate. This is one of the most-litigated §623 issues, and one of the few with a private right of action under §616.

The second trap is the **non-response problem**. When a CRA conducts an employment verification and the employer's HR team simply does not respond, the lack of response can itself become a §623 issue if the employer has a documented practice of providing employment data to some CRAs but not others. The defense to a §623 non-response claim is a written policy that applies consistently — either the employer responds to all verification requests through a single channel (e.g., The Work Number) or the employer responds to none.

## How §615 and §623 interact in screening

The two sections converge at a single moment: when a candidate disputes an item on a background check that came from a former employer's verification response. The candidate uses the §609 file to identify the contested item, files a §611 dispute with the CRA, and the CRA forwards the dispute to the former employer under §611(a)(2). The former employer, now wearing its §623 furnisher hat, must investigate within 30 days. If the former employer fails to investigate or knowingly verifies inaccurate information, the candidate has a private right of action under §616.

The current employer's exposure under §615 is independent. Even if the underlying §623 issue is resolved against the former employer, the current employer is still on the hook for the §615 notice if it took adverse action based on the disputed report.

## What we recommend for 2026

Treat §615 as a process duty, not a paperwork duty. Build a workflow where the §615 notice is generated automatically only after the §604(b)(3) pre-adverse-action window has run and any pending §611 dispute has been resolved. Train HR on the §623 furnisher posture: have a single, written, consistent policy for responding to outbound verification requests, and have the legal team review the policy annually. For both, see our [compliance services overview](/services/employment-verification) and [request a §615/§623 audit](/contact).`,
};

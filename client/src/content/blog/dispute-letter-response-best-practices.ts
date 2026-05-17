import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "dispute-letter-response-best-practices",
  title: "Responding to a Background Check Dispute: A Practical Playbook",
  metaTitle: "Background Check Dispute Letter Response Guide 2026",
  metaDescription:
    "How an employer responds to a candidate dispute determines FCRA exposure. Here is the 2026 playbook for the pre-adverse-action dispute window.",
  excerpt:
    "How an employer handles a candidate dispute during the pre-adverse-action window decides whether the FCRA case lives or dies. Here is the 2026 playbook.",
  publishedAt: "2026-05-14",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["candidate-experience", "fcra", "adverse-action"],
  body: `When a candidate disputes the content of a background check during the pre-adverse-action window, how the employer handles the dispute determines whether the requisition closes cleanly or generates an FCRA class-action exhibit. The dispute window is a procedural protection codified in FCRA §1681i (CRA reinvestigation) and the §1681b(b)(3) sequence (employer pre-adverse process). Most employers handle the technical pieces correctly and lose ground on the operational details. Below is the 2026 playbook.

## The dispute window in context

The pre-adverse-action sequence under §1681b(b)(3)(A) requires the employer to provide:

A copy of the consumer report (the actual report, not a summary). A copy of the FCRA Summary of Rights ("A Summary of Your Rights Under the Fair Credit Reporting Act"). A "reasonable" period for the consumer to respond.

The candidate's response is the dispute. The dispute may challenge accuracy ("that conviction is not mine"), completeness ("the case was dismissed but the report shows it as a conviction"), interpretation ("that record relates to a different person"), or applicability ("that record is older than the seven-year window"). Each dispute type triggers a slightly different process.

## The five-business-day floor

The "reasonable period" is not statutorily defined. The consensus floor is **five business days** between pre-adverse notice and adverse-action notice. Several federal courts have read shorter windows as inadequate. California Civil Code §1786.22 and §1786.16 have been interpreted as applying a similar floor for ICRAA-covered investigative reports.

The defensible practice is at least five business days plus mailing time if the notice is sent by mail. Electronic delivery (when authorized by the candidate) compresses the mailing tail, but the dispute window itself should not compress below five business days.

## The two-track response

A dispute should trigger a two-track response.

### Track 1: CRA reinvestigation

Forward the dispute to the CRA for reinvestigation under §1681i. The CRA has 30 days (45 days if the candidate provides additional information) to reinvestigate and report results. The reinvestigation involves the CRA contacting the original source of the disputed information and confirming or correcting.

The CRA's reinvestigation result is binding on the CRA but not on the employer's decision. If the CRA confirms the disputed information, the employer can proceed with adverse action; if the CRA corrects the disputed information, the employer should consider whether the corrected information changes the adverse-action decision.

### Track 2: Employer hold

Hold the adverse-action decision pending the reinvestigation. Some employers proceed with adverse action while reinvestigation is pending; this is technically permissible under FCRA but exposes the employer to liability if the reinvestigation surfaces a defect that the employer did not consider.

The defensible practice is to hold the adverse-action decision until the reinvestigation completes, or until the candidate withdraws the dispute, or until a defined operational deadline (e.g., 30 days) is reached. The hold is documented in the requisition record.

## What the dispute response letter should say

The employer's response to the candidate's dispute communication should address three elements:

**Acknowledgment.** Confirm receipt of the dispute, identify the specific items being disputed, and state that the items are being reviewed.

**Process description.** Explain that the dispute will be forwarded to the CRA for reinvestigation under FCRA, describe the typical 30-day reinvestigation window, and identify what the candidate can expect during the window.

**Holding pattern.** Confirm that the adverse-action decision is held pending the reinvestigation outcome.

The letter should not include legal arguments, character assessments, or substantive discussion of the disputed items. Those discussions should happen, if at all, after the reinvestigation completes.

## Common operational failures

Three failure modes account for most dispute-related FCRA litigation:

**Treating the dispute as adverse action.** Candidate disputes the report; employer treats the dispute as confirmation of the underlying issue and proceeds to adverse action. This is the most damaging failure mode. The dispute is procedural, not substantive — it triggers reinvestigation, not validation of the adverse content.

**Not holding the decision.** Candidate disputes; employer proceeds with adverse action while reinvestigation is pending; reinvestigation surfaces a defect; employer is on the hook for the adverse action plus FCRA willful-violation exposure.

**Inadequate reinvestigation cooperation.** Candidate disputes; employer forwards to CRA; CRA seeks supplemental information from the employer; employer doesn't respond promptly. The reinvestigation stalls, the dispute lives unresolved, and the candidate's eventual FCRA filing names both the CRA and the employer.

The fix is workflow: a defined dispute-receipt SLA, defined CRA cooperation procedures, defined hold-tracking on requisitions, and defined post-reinvestigation decision processes.

## Documentation for the file

Each dispute should produce a documented file with:

The original consumer report. The candidate's dispute communication. The employer's acknowledgment. The CRA reinvestigation request. The CRA reinvestigation result. The post-reinvestigation decision. The final adverse-action notice (if applicable) or the offer extension (if the dispute resolves in the candidate's favor).

The documented file is the FCRA defense if the candidate later files. Programs that produce all seven elements survive litigation; programs that document only two or three become FCRA defendants whose defense rests on partial recollection.

Our [adverse action letter template](/blog/adverse-action-letter-fcra-template), [pre-applicant disclosure UX](/blog/pre-applicant-disclosure-ux), and [FCRA 615/623 employer duties](/blog/fcra-615-623-employer-duties) cover the connected pieces. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};

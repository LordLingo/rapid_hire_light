import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "i9-e-verify-employer-guide",
  title: "I-9 and E-Verify: A 2026 Employer Operating Guide",
  metaTitle: "I-9 and E-Verify Employer Operating Guide 2026",
  metaDescription:
    "I-9 and E-Verify run on different timelines and different rules. Here is the 2026 employer guide that keeps both compliant without slowing onboarding.",
  excerpt:
    "I-9 and E-Verify are different programs with different timelines, audit risks, and state mandates. Here is the 2026 employer operating guide.",
  publishedAt: "2026-05-13",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["verification", "compliance"],
  body: `Every U.S. employer must complete Form I-9 to verify employment authorization for new hires. A growing share — including all federal contractors above defined thresholds and employers in 21 mandate states as of 2026 — must also use **E-Verify** to electronically confirm work authorization with the Social Security Administration and the Department of Homeland Security. The two programs intersect but operate on different timelines, different evidence rules, and different audit risks. Below is the 2026 employer guide that keeps both compliant without slowing onboarding.

## Form I-9: the federal floor

Form I-9 is the federal employment-eligibility verification document required of every employer for every new hire under the Immigration Reform and Control Act of 1986. The current form (revised August 2023, with revisions valid through July 31, 2026) requires:

**Section 1** — completed by the employee no later than the first day of employment, attesting to citizenship/immigration status and providing biographic data.

**Section 2** — completed by the employer within three business days of the employee's first day of employment, documenting the employer's examination of acceptable identity and work-authorization documents from List A, or one each from List B and List C.

**Supplement A (preparer/translator certification)** and **Supplement B (reverification and rehire)** as needed.

The 2023 revision permits employers enrolled in E-Verify in good standing to remotely examine documents under the alternative procedure adopted by USCIS. Non-E-Verify employers must conduct in-person physical document examination.

## E-Verify: the layered electronic check

E-Verify is the electronic system operated by USCIS that compares Form I-9 information against SSA and DHS records. Employers create a case in E-Verify within three business days of the employee's first day of employment using the data from the completed I-9. The system returns one of three initial results: **Employment Authorized**, **Tentative Nonconfirmation (TNC)**, or **Case in Continuance**.

A TNC result triggers a defined process. The employer notifies the employee of the TNC, provides the further-action notice, and the employee chooses whether to contest. A contesting employee has 8 federal-government working days to resolve the TNC with SSA or DHS. The employer cannot terminate, suspend, delay training, or take any other adverse action against the employee during the resolution period.

## Where the two programs diverge

Three operational divergences matter.

**Document examination.** I-9 requires the employer to examine identity and authorization documents. E-Verify validates the data on those documents but does not examine the documents themselves. An employer that conducts a thorough I-9 document examination but submits incorrect data to E-Verify still produces an E-Verify violation; an employer that submits accurate data to E-Verify but fails to conduct adequate I-9 document examination still produces an I-9 violation.

**Timeline.** I-9 Section 2 must be complete by day 3. E-Verify case must be created within day 3. The two timelines run in parallel but produce different audit findings if missed.

**Audit risk.** Immigration and Customs Enforcement (ICE) audits I-9 forms; USCIS Office of Compliance audits E-Verify case data. The audits are separate and can run concurrently. ICE I-9 audits can result in civil penalties of \\$281–\\$2,789 per substantive violation under 2026 inflation adjustments, with higher penalties for paperwork-only violations and for employers with prior violations.

## State E-Verify mandates

As of 2026, 21 states mandate E-Verify for some category of employer. The most aggressive mandates apply to all employers regardless of size (Alabama, Arizona, Mississippi, North Carolina for 25+ employees, South Carolina, Tennessee, Utah). Other states limit the mandate to public-sector employers, public contractors, or employers above specified size thresholds. Florida's 2023 mandate, expanded in 2024, applies to all private employers with 25 or more employees.

Out-of-state employers placing workers in mandate states should check the specific mandate trigger — some apply to the employer's domicile, some apply to the worksite, and some apply to the contracting entity.

## Common operational failures

Three patterns produce the bulk of I-9/E-Verify enforcement actions.

**Late completion.** Section 2 completed past day 3 is a substantive violation. E-Verify cases created past day 3 are USCIS findings. Both are easy to spot in audit and easy to avoid through workflow automation that locks Section 2 and E-Verify case creation into day-1-to-day-3 windows.

**Document over-specification.** Demanding specific documents from List A, B, or C beyond what the form requires is **document abuse** under 8 U.S.C. §1324b — an unfair immigration-related employment practice. The fix is to allow the employee to choose which acceptable documents to present.

**Failure to reverify.** Employees with work authorization that expires (TPS, certain visa categories) must be reverified using Supplement B before the expiration date. Missing reverification for an employee whose authorization has expired is a substantive I-9 violation and can result in civil penalties.

## What good looks like

A defensive program operates four controls: workflow that locks Section 2 to day-3, automatic E-Verify case creation, calendar-based reverification triggers, and a quarterly internal I-9 audit. The audit catches drift before ICE finds it. Most established HRIS platforms can run all four; smaller employers can buy purpose-built I-9/E-Verify tools at \\$3–\\$8 per hire.

Our [education verification process](/blog/education-verification-process), [how to run a background check on an employee](/blog/how-to-run-a-background-check-on-an-employee), and [healthcare credentialing vs background check](/blog/healthcare-credentialing-vs-background-check) cover the related verification topics. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};

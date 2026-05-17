import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "nyc-local-law-144-aedt-bias-audit",
  title: "NYC Local Law 144 AEDT Bias Audit: An Employer Compliance Guide",
  metaTitle: "NYC Local Law 144 AEDT Bias Audit Compliance Guide 2026",
  metaDescription:
    "NYC Local Law 144 requires bias audits for automated employment decision tools used in hiring. Here is the 2026 employer compliance map and audit standard.",
  excerpt:
    "NYC Local Law 144 requires annual independent bias audits of automated employment decision tools used to substantially screen NYC candidates. Here is the 2026 compliance map.",
  publishedAt: "2026-04-16",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["new-york", "ai", "compliance"],
  body: `New York City's **Local Law 144 of 2021**, effective in operative form on July 5, 2023, imposes the first U.S. bias-audit requirement on **Automated Employment Decision Tools (AEDTs)** used in hiring. The law applies to any employer using an AEDT to "substantially assist or replace" discretionary employment decisions for positions located in New York City. Three years on, the law's operative scope is reasonably settled and the audit market is mature enough that the compliance playbook is concrete. Below is the 2026 employer guide.

## What an AEDT is

The Department of Consumer and Worker Protection (DCWP) defines an AEDT as any "computational process derived from machine learning, statistical modeling, data analytics, or artificial intelligence" that issues a "simplified output (such as a score, classification, or recommendation)" used to "substantially assist or replace discretionary decision making for making employment decisions that impact natural persons."

Three pieces matter operationally. First, "computational process" is read broadly to include any data-driven scoring or classification model, not just deep neural networks. Second, "substantially assist or replace" is the jurisdictional hook — a tool used as one of multiple inputs into a human decision is in scope; a tool used purely as informational reference may not be. The DCWP rules clarify that "substantially assist" includes weighting, exclusively considering output, or relying solely on output. Third, "employment decisions" includes hiring and promotion, but not solely-internal performance reviews.

## What background-screening tools are covered

Pure background-check reports — criminal history, employment verifications, drug-test results — are not AEDTs. They are factual reports without scoring or classification. **Adjudication scoring tools** that output a simplified pass/fail or risk-tier classification for the candidate based on the report **are** AEDTs and are in scope when they substantially assist a hiring decision for an NYC-located position.

CRAs offering automated adjudication products to NYC employers fall within the AEDT scope. Employers using those products bear the Local Law 144 compliance duty.

## The three employer duties

**Annual independent bias audit.** The employer must obtain, within the year preceding use of the AEDT, an independent bias audit conducted by an "independent auditor" — a person or group with no employment, contractual, or other material relationship with the AEDT vendor or the employer that would compromise objectivity. The audit must compute and disclose the **selection rate** and **impact ratio** for each combination of sex category, race/ethnicity category, and intersectional categories.

**Public summary of audit results.** The employer must publish a summary of the most recent bias audit results and the date of the AEDT's distribution on a publicly accessible page on the employer's website. The published summary must include the selection rates, impact ratios, and the number of individuals scored.

**Candidate notice.** The employer must notify candidates at least ten business days before AEDT use that the tool will be used, identify the job qualifications and characteristics it considers, identify the data type collected and the source of the data, and provide an opportunity to request an alternative selection process or accommodation.

## What the bias audit measures

The audit computes selection rate (proportion of candidates of a given category passing the AEDT screen) and impact ratio (selection rate of a category divided by the selection rate of the highest-performing category). Categories include sex (male/female), race/ethnicity (the EEO-1 classifications), and intersectional combinations.

The DCWP rules permit either historical-data audits (computed from the AEDT's actual scoring outputs) or, where historical data is unavailable, test-data audits (computed from a representative sample). Most established CRAs running adjudication products produce historical-data audits at a multi-employer aggregate level and individual employer audits for high-volume customers.

## Documentation and audit posture

The DCWP enforces Local Law 144 with civil penalties of \\$500 per violation for first violations and up to \\$1,500 per violation for subsequent violations. Each day of continued non-compliance can be treated as a separate violation. The DCWP's enforcement focus has been on the **public summary publication** requirement and the **candidate notice** requirement — both visible compliance failures that can be confirmed by the DCWP from the employer's public website without an active investigation.

Programs that source AEDT scoring through a CRA but have not published the audit summary or do not provide the ten-business-day candidate notice are exposed even if the CRA's underlying audit is sound.

## What to operationalize for 2026

Five steps. **(1) AEDT inventory.** Identify every scoring or classification tool in the hiring funnel — sourcing, ranking, adjudication, video-interview scoring, skills assessment — that touches NYC positions. **(2) Scope determination.** For each tool, document whether it "substantially assists or replaces" decisions or is purely informational. **(3) Audit procurement.** For in-scope tools, obtain the independent bias audit either from the vendor's audit pool or through a separately engaged auditor. **(4) Public summary.** Publish the audit summary on a public page and link it from the careers site for NYC postings. **(5) Candidate notice.** Build the ten-business-day notice into the application workflow with the qualification, data-type, and alternative-process disclosures.

The California parallel — see our [California ADS regulations guide](/blog/california-ads-ai-employment-screening-regulations) and [California AI bias hiring rules](/blog/california-ai-algorithmic-bias-hiring-rules) — covers a similar regulatory direction with different operational specifics. Our [Article 23-A](/blog/nyc-article-23a-multi-factor-analysis) and [NYC Fair Chance Act](/blog/nyc-fair-chance-act-background-checks) posts cover the parallel conviction-record duties. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};

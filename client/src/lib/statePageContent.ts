/**
 * §81 — Per-state page copy for the 13 pillar states.
 * Generated from a parallel authoring batch and validated for length bounds.
 * Source of truth for /resources/background-checks-by-state/<slug>.
 */

export interface StatePageHeroStat { label: string; value: string; context: string }
export interface StatePageFaqPair { q: string; a: string }

export interface StatePageContent {
  slug: string;
  stateName: string;
  abbr: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroLede: string;
  heroStats: StatePageHeroStat[];
  whatMakesDifferent: string;
  fcraLayering: string;
  banTheBoxBody: string;
  cannabisBody: string;
  hiringFlowSteps: string[];
  faqPairs: StatePageFaqPair[];
  ctaParagraph: string;
  seoMetaDescription: string;
}

export const STATE_PAGE_CONTENT: StatePageContent[] = [
  {
    "slug": "california",
    "stateName": "California",
    "abbr": "CA",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Navigating California hiring: a screener's compliance compass",
    "heroLede": "California imposes some of the most intricate screening requirements in the nation, demanding precision from talent acquisition teams. This guide unpacks the overlapping state and federal mandates that govern criminal history, drug testing, and salary inquiries across the Golden State.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public & Private",
        "context": "Applies to employers with five or more employees statewide."
      },
      {
        "label": "Salary History",
        "value": "Banned",
        "context": "Employers cannot ask about past compensation during the hiring process."
      },
      {
        "label": "Cannabis",
        "value": "Lawful Use Protected",
        "context": "Off-duty use is protected, limiting traditional pre-employment testing."
      }
    ],
    "whatMakesDifferent": "California requires employers to navigate a dual-disclosure framework, layering the federal FCRA alongside the state-specific mandates of Cal. Civ. Code §1786 (ICRAA). Hiring teams must also adapt to localized ordinances in cities like San Francisco and Los Angeles, which often impose stricter individualized assessment rules than the baseline state law.",
    "fcraLayering": "While the federal FCRA sets baseline rules, California employers must also comply with the Investigative Consumer Reporting Agencies Act. This creates a mandatory two-tier disclosure process for all background screenings.\n\nCandidates must receive a standalone state disclosure and explicitly opt-in to the check. Employers must also provide a checkbox allowing applicants to request a free copy of their completed.",
    "banTheBoxBody": "Under Cal. Gov. Code §12952 (Fair Chance Act), employers with five or more workers cannot ask about criminal history until after making a conditional offer. This applies to both public and private sector roles across the state.\n\nIf a check reveals a conviction, employers must conduct an individualized assessment before taking adverse action. This assessment must weigh the nature of the offense, the time passed, and the specific duties of the job.",
    "cannabisBody": "Recent updates via AB 2188 and SB 700 fundamentally alter how California employers handle drug screening. These laws protect an applicant's right to off-duty cannabis use and prohibit discrimination based on non-psychoactive metabolites.\n\nTraditional pre-employment tests that only detect past use are now largely obsolete for hiring decisions. Employers must shift to impairment-based testing methods if they choose to screen for cannabis.",
    "hiringFlowSteps": [
      "Remove all questions regarding criminal history and salary expectations from initial job applications.",
      "Provide the mandatory two-tier FCRA and ICRAA disclosures before initiating any background screening.",
      "Extend a formal conditional offer of employment before requesting a criminal history background check.",
      "Ensure drug testing protocols comply with AB 2188 by excluding non-psychoactive cannabis metabolites.",
      "Conduct a documented individualized assessment if a criminal record is found before taking adverse action.",
      "Issue a preliminary notice of adverse action and allow the candidate at least five days to respond."
    ],
    "faqPairs": [
      {
        "q": "Does California law prohibit employers from asking about an applicant's salary history?",
        "a": "Yes, under Cal. Lab. Code §432.3, employers are strictly prohibited from asking applicants about their past compensation or benefits. Employers must also provide the pay scale for a position upon reasonable request, ensuring transparency throughout the hiring process."
      },
      {
        "q": "Can employers in California still test for cannabis during the pre-employment screening process?",
        "a": "While testing is not entirely banned, AB 2188 prohibits employers from penalizing applicants based on tests that only detect non-psychoactive cannabis metabolites. Employers must use tests that measure active impairment rather than past, off-duty consumption."
      }
    ],
    "ctaParagraph": "Navigating California's complex web of screening regulations doesn't have to slow down your hiring pipeline. Partner with Rapid Hire to implement compliant, automated background checks tailored to your specific operational needs.",
    "seoMetaDescription": "Master California background check compliance with our comprehensive guide. Learn how to navigate the Fair Chance Act, ICRAA, and new cannabis testing laws."
  },
  {
    "slug": "texas",
    "stateName": "Texas",
    "abbr": "TX",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in Texas: navigating state and local compliance",
    "heroLede": "Texas employers operate in a largely employer-friendly environment, but localized ordinances and strict reporting limits require careful attention. This guide outlines how to structure compliant screening programs across the state.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public Only",
        "context": "Statewide restrictions apply only to public employers, though Austin has local rules."
      },
      {
        "label": "Salary History",
        "value": "Permitted",
        "context": "Texas does not prohibit employers from asking candidates about past compensation."
      },
      {
        "label": "Cannabis",
        "value": "No Protections",
        "context": "There are no statewide employment protections for recreational or medical cannabis use."
      }
    ],
    "whatMakesDifferent": "While Texas generally favors employer discretion, the state imposes strict seven-year reporting limits on certain criminal records under Tex. Bus. & Com. Code §20.05. Additionally, access to DPS records is governed by Tex. Gov't Code §411.122, requiring hiring teams to balance statewide frameworks with localized requirements.",
    "fcraLayering": "Texas aligns with federal FCRA rules but adds specific state-level constraints. Under state law, CRAs are generally prohibited from reporting criminal records older than seven years, subject to certain salary exceptions.\n\nEmployers must ensure screening partners configure filters to comply with these strict limitations. Relying solely on federal defaults may yield non-compliant data for Texas candidates.",
    "banTheBoxBody": "Texas lacks a statewide ban-the-box law for private employers, allowing most companies to ask about criminal history on initial applications. Public sector employers, however, must delay these inquiries.\n\nPrivate employers in Austin must comply with the Travis County Fair Chance hiring policy, which mandates delaying criminal history questions until after a conditional offer. Hiring teams must segment application workflows based on location.",
    "cannabisBody": "Texas maintains strict drug policies and offers no statewide employment protections for cannabis use. Employers retain broad discretion to test for marijuana and take adverse action based on positive results, consistent with Tex. Lab. Code §21.\n\nOrganizations must maintain clear drug testing policies. While the state permits zero-tolerance approaches, employers should ensure testing protocols do not violate broader EEO guidelines.",
    "hiringFlowSteps": [
      "1. Determine if the role is located in Austin to apply local Fair Chance rules.",
      "2. Provide standard FCRA disclosures and obtain written authorization from the candidate.",
      "3. Request background reports, ensuring the CRA applies Texas seven-year reporting limits.",
      "4. Review returned records against company policy and Tex. Lab. Code §21 EEO guidelines.",
      "5. Conduct individualized assessments for any potentially disqualifying criminal records.",
      "6. Execute the two-step adverse action process if deciding not to hire based on the report."
    ],
    "faqPairs": [
      {
        "q": "Does Texas limit how far back a background check can go?",
        "a": "Yes. Under Texas law, consumer reporting agencies are generally prohibited from reporting criminal records, including arrests and convictions, that are older than seven years. However, this limitation does not apply if the candidate's expected salary exceeds $75,000."
      },
      {
        "q": "Are private employers in Texas required to ban the box?",
        "a": "There is no statewide ban-the-box law for private employers in Texas. However, employers operating in Austin must comply with the local Fair Chance hiring policy, which requires delaying criminal history inquiries until after a conditional job offer has been made."
      }
    ],
    "ctaParagraph": "Navigating the intersection of Texas state laws and local ordinances requires a precise screening strategy. Partner with Rapid Hire to build a compliant, efficient background check program tailored to your specific footprint.",
    "seoMetaDescription": "Explore our comprehensive 2026 guide to Texas background check compliance. Learn about state laws, local Austin ordinances, and FCRA requirements for employers."
  },
  {
    "slug": "new-york",
    "stateName": "New York",
    "abbr": "NY",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Navigating New York hiring and compliance mandates",
    "heroLede": "New York imposes distinct procedural hurdles on employers, requiring careful navigation of criminal history assessments and automated employment decision tools. This guide breaks down the statutory frameworks governing candidate screening across the Empire State, ensuring your hiring workflows remain fully compliant.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public & Private",
        "context": "New York restricts criminal history inquiries until after a conditional offer."
      },
      {
        "label": "Salary History",
        "value": "Banned",
        "context": "Employers cannot ask candidates about their past compensation during the hiring process."
      },
      {
        "label": "Cannabis",
        "value": "Lawful Use",
        "context": "Recreational marijuana use outside of work hours is protected under state labor laws."
      }
    ],
    "whatMakesDifferent": "Employers operating in this jurisdiction must rigorously apply the N.Y. Correction Law Art. 23-A eight-factor balancing test before taking adverse action based on a candidate's criminal conviction. Furthermore, organizations utilizing automated employment decision tools must comply with NYC Local Law 144 by conducting independent bias audits and providing explicit candidate notices.",
    "fcraLayering": "While the federal FCRA establishes baseline rules, N.Y. Gen. Bus. Law §380 imposes additional obligations on employers requesting consumer reports. Candidates must be informed of their right to request a copy of the report.\\n\\nThis framework demands that screening workflows incorporate localized notices alongside standard federal forms. Failure to integrate these disclosures exposes organizations to regulatory.",
    "banTheBoxBody": "New York mandates strict adherence to fair chance hiring practices. Under NYC Admin. Code §8-107(11)(a), employers cannot inquire about criminal history until after extending a conditional offer of employment.\\n\\nIf a check reveals a conviction, the employer must perform a documented analysis using the Article 23-A balancing test. This ensures adverse actions occur only when a direct relationship exists between the offense and the job duties.",
    "cannabisBody": "Employers must navigate specific restrictions regarding applicant drug testing. N.Y. Lab. Law §201-i protects a candidate's lawful use of cannabis outside of work hours, prohibiting adverse actions based on recreational consumption.\\n\\nOrganizations should remove marijuana from standard pre-employment drug panels unless required by federal mandates. Adjusting these protocols prevents compliance violations and expands the talent pool.",
    "hiringFlowSteps": [
      "Remove all criminal history and salary inquiries from initial job applications and interview scripts.",
      "Provide NYC Local Law 144 notices if utilizing automated employment decision tools during candidate screening.",
      "Extend a conditional offer of employment before initiating any criminal background checks.",
      "Provide state-specific N.Y. Gen. Bus. Law §380 disclosures alongside standard federal FCRA authorization forms.",
      "Conduct the Article 23-A eight-factor balancing test if a criminal conviction is identified during the background check.",
      "Issue a Fair Chance Notice and allow the candidate sufficient time to respond before finalizing any adverse action."
    ],
    "faqPairs": [
      {
        "q": "Can employers in New York test applicants for marijuana use?",
        "a": "Generally, no. Under state labor laws, employers are prohibited from testing for cannabis or taking adverse action based on lawful, off-duty recreational use. Exceptions exist only for positions where testing is mandated by federal law or specific safety regulations."
      },
      {
        "q": "What is required before taking adverse action based on a conviction?",
        "a": "Employers must perform a documented analysis using the Article 23-A eight-factor balancing test. This evaluation determines if there is a direct relationship between the offense and the job, or if hiring the individual poses an unreasonable risk to property or safety."
      }
    ],
    "ctaParagraph": "Navigating New York's complex screening regulations doesn't have to slow down your hiring pipeline. Partner with Rapid Hire to automate compliance and confidently scale your workforce across the Empire State.",
    "seoMetaDescription": "Master New York background check compliance with our comprehensive guide. Learn how to navigate fair chance laws, cannabis rules, and FCRA requirements."
  },
  {
    "slug": "florida",
    "stateName": "Florida",
    "abbr": "FL",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in Florida: navigating Level 2 screening requirements",
    "heroLede": "Florida employers operate in a regulatory environment that closely mirrors federal standards for general hiring, while imposing strict fingerprint-based mandates for vulnerable sectors. This guide outlines how to structure compliant screening workflows across the Sunshine State.",
    "heroStats": [
      {
        "label": "Ban-the-box",
        "value": "None",
        "context": "Florida has no statewide ban-the-box law for private employers."
      },
      {
        "label": "Salary history",
        "value": "Allowed",
        "context": "Employers may ask about salary history during the hiring process."
      },
      {
        "label": "Cannabis",
        "value": "Unprotected",
        "context": "There are no employment protections for off-duty cannabis use."
      }
    ],
    "whatMakesDifferent": "Unlike states with complex fair chance frameworks, Florida private employers generally operate close to the federal FCRA floor for standard roles. However, organizations hiring for healthcare, childcare, or education must navigate the rigorous Level 2 fingerprint screening mandates outlined in Fla. Stat. §435.04.",
    "fcraLayering": "Florida law generally aligns with the federal Fair Credit Reporting Act for standard private-sector roles. Employers must adhere to standard FCRA disclosure and authorization protocols before initiating any consumer report.\n\nWhen evaluating criminal history, hiring teams must account for Fla. Stat. §943.0585 regarding record sealing. Sealed or expunged records generally cannot be used to disqualify candidates.",
    "banTheBoxBody": "Florida lacks a statewide ban-the-box law for private employers, allowing hiring teams to inquire about criminal history on initial job applications. Local ordinances in cities like Miami may impose restrictions on public vendors.\n\nWithout state-level fair chance mandates, employers retain broad discretion in criminal record assessments. Still, implementing individualized assessments remains a best practice to mitigate discrimination risks.",
    "cannabisBody": "Florida provides no employment protections for off-duty cannabis use, even for registered medical marijuana patients. Employers maintain the right to enforce zero-tolerance drug policies and conduct pre-employment testing.\n\nAdditionally, hiring teams must note that Fla. Stat. §760.50 strictly prohibits discrimination based on HIV status. Medical or drug testing protocols must be carefully structured to avoid unlawful inquiries.",
    "hiringFlowSteps": [
      "Determine if the role requires Level 2 fingerprint screening under state law.",
      "Provide standard FCRA disclosures and obtain written authorization.",
      "Conduct standard background checks or initiate Level 2 fingerprinting.",
      "Review results while excluding sealed records per Fla. Stat. §943.0585.",
      "Execute standard FCRA adverse action steps if disqualifying a candidate."
    ],
    "faqPairs": [
      {
        "q": "What is a Level 2 background screening in Florida?",
        "a": "A Level 2 screening is a state and national fingerprint-based check required for specific roles involving vulnerable populations, such as healthcare, childcare, and education. It involves submitting fingerprints to the FDLE and FBI."
      },
      {
        "q": "Are Florida employers permitted to conduct pre-employment testing for marijuana?",
        "a": "Yes. Florida does not protect off-duty cannabis use, including for medical marijuana patients. Employers can legally conduct pre-employment drug testing and enforce zero-tolerance policies without violating state employment laws."
      }
    ],
    "ctaParagraph": "Navigating Florida's specific screening requirements doesn't have to slow down your hiring. Partner with Rapid Hire to streamline your background checks and maintain compliance effortlessly.",
    "seoMetaDescription": "Learn how to navigate Florida background check requirements, from standard FCRA compliance to Level 2 fingerprint screening mandates for employers."
  },
  {
    "slug": "illinois",
    "stateName": "Illinois",
    "abbr": "IL",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Navigating Illinois hiring: a compliance roadmap",
    "heroLede": "Illinois presents a complex regulatory environment for employers, requiring careful attention to both criminal history inquiries and off-duty conduct protections. This guide outlines the essential compliance steps for screening candidates across the state, from Chicago to Springfield.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public & Private",
        "context": "Applies to employers with 15 or more employees under state law."
      },
      {
        "label": "Salary History",
        "value": "Banned",
        "context": "Employers cannot request or rely on past wage history for hiring."
      },
      {
        "label": "Cannabis",
        "value": "Lawful Use",
        "context": "Off-duty consumption is protected absent articulable impairment."
      }
    ],
    "whatMakesDifferent": "What sets Illinois apart is the intersection of the Right to Privacy in the Workplace Act (820 ILCS 55/10) and the Cannabis Regulation and Tax Act, which together protect lawful off-duty conduct. Employers must also navigate strict pay transparency rules, as the Equal Pay Act (820 ILCS 112/10) mandates pay-scale postings and bans salary history inquiries.",
    "fcraLayering": "While the federal Fair Credit Reporting Act establishes the baseline for disclosures, Illinois law imposes additional restrictions on how consumer information is utilized. Employers must integrate these mandates into their workflows.\n\nState regulations dictate the timing of inquiries and limit the records considered. This requires hiring teams to carefully sequence background checks to avoid premature.",
    "banTheBoxBody": "Under the Job Opportunities for Qualified Applicants Act (820 ILCS 75), employers cannot ask about criminal history until after a conditional offer is made. This ensures applicants are evaluated on their merits first.\n\nAdditionally, the state EEO framework (775 ILCS 5/2-103) restricts the use of non-conviction arrest records. Employers must conduct an individualized assessment before taking adverse action based on any conviction.",
    "cannabisBody": "The Cannabis Regulation and Tax Act (410 ILCS 705) fundamentally alters how employers handle drug screening in Illinois. It protects an employee's lawful off-duty consumption of cannabis products when away from the workplace.\n\nEmployers cannot penalize applicants for failing a pre-employment marijuana test unless they demonstrate articulable impairment. This requires a shift from zero-tolerance policies to impairment-based evaluations.",
    "hiringFlowSteps": [
      "Post job openings with required pay-scale information to comply with the Equal Pay Act.",
      "Evaluate candidates based on qualifications without requesting any salary history.",
      "Extend a conditional offer of employment before initiating any criminal background checks.",
      "Provide standard FCRA disclosures and obtain written authorization for the background check.",
      "Review background results, ensuring non-conviction arrest records are excluded from consideration.",
      "Conduct an individualized assessment if a conviction is found before initiating adverse action.",
      "Follow the two-step adverse action process if the candidate is disqualified based on the report."
    ],
    "faqPairs": [
      {
        "q": "Can Illinois employers test for cannabis during the pre-employment screening process?",
        "a": "While employers can still conduct drug tests, Illinois law protects lawful off-duty cannabis use. You cannot take adverse action against an applicant solely for a positive marijuana test unless you can establish articulable impairment or fall under specific federal safety exemptions."
      },
      {
        "q": "When is the appropriate time to ask about criminal history in Illinois?",
        "a": "Under the Job Opportunities for Qualified Applicants Act, employers must wait until after a conditional offer of employment has been extended before inquiring about criminal history or running a background check. This applies to all private employers with 15 or more employees."
      }
    ],
    "ctaParagraph": "Navigating Illinois compliance doesn't have to slow down your hiring process. Partner with Rapid Hire to implement automated, state-specific screening workflows that keep your team protected.",
    "seoMetaDescription": "Master Illinois background check compliance with our comprehensive guide. Learn about ban-the-box rules, cannabis testing, and salary history bans."
  },
  {
    "slug": "pennsylvania",
    "stateName": "Pennsylvania",
    "abbr": "PA",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in Pennsylvania: navigating CHRIA and local mandates",
    "heroLede": "Pennsylvania requires employers to balance statewide criminal history rules with stringent local ordinances in major hubs like Philadelphia. This guide breaks down the operational requirements for compliant screening across the Commonwealth, from job-relevance tests to salary history bans.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public & Local",
        "context": "Statewide rules apply to public roles, while Philadelphia extends mandates to private employers."
      },
      {
        "label": "Salary History",
        "value": "Banned Locally",
        "context": "Philadelphia prohibits employers from inquiring about an applicant's wage history."
      },
      {
        "label": "Cannabis",
        "value": "Medical Only",
        "context": "Registered medical marijuana cardholders receive specific employment protections under state law."
      }
    ],
    "whatMakesDifferent": "What sets Pennsylvania apart is the strict job-relevance requirement embedded in 18 Pa. C.S. §9125, known as the Criminal History Record Information Act (CHRIA). Additionally, local mandates like the Phila. Wage Equity Ordinance require employers to adapt their screening practices, completely prohibiting salary history inquiries during the hiring process.",
    "fcraLayering": "While the federal FCRA sets the baseline for consent and adverse action, Pennsylvania introduces strict restrictions on evaluating criminal records. Employers must integrate state-level relevance tests into their standard workflows.\n\nA standard FCRA check is insufficient without localized review. Hiring teams must document their rationale when disqualifying candidates to satisfy both federal rules and state mandates.",
    "banTheBoxBody": "Pennsylvania applies ban-the-box rules to public employers statewide, but private employers face strict local requirements. Under the Phila. Fair Criminal Records Screening Standards (FCRSS) §9-3404, employers cannot ask about criminal history until after a conditional offer.\n\nThis requires hiring teams to segment workflows. Recruiters in Philadelphia must remove criminal history questions from applications and delay background checks until the final.",
    "cannabisBody": "While recreational cannabis remains illegal, the Pa. Med. Marijuana Act §2103(b)(1) provides explicit employment protections. Employers cannot discriminate against an employee solely based on their status as a medical marijuana cardholder.\n\nEmployers need not accommodate marijuana use on the job site. Hiring teams must review positive drug tests to ensure they do not penalize lawful off-duty medical use while maintaining safety.",
    "hiringFlowSteps": [
      "Remove salary history questions from all applications for candidates based in Philadelphia.",
      "Delay criminal history inquiries until after extending a conditional offer in Philadelphia.",
      "Provide standard FCRA disclosures and obtain written consent before initiating the background check.",
      "Evaluate any criminal records strictly for job relevance as required by CHRIA guidelines.",
      "Verify medical marijuana cardholder status before taking adverse action on a positive THC test.",
      "Execute the two-step FCRA adverse action process if disqualifying a candidate based on the report."
    ],
    "faqPairs": [
      {
        "q": "Can Pennsylvania employers consider all felony convictions during hiring?",
        "a": "No. Under the Criminal History Record Information Act (CHRIA), employers must evaluate whether a conviction is directly relevant to the applicant's suitability for the specific position. Blanket bans on candidates with felony records violate state law and expose employers to significant compliance risks."
      },
      {
        "q": "Are private employers in Pennsylvania subject to ban-the-box laws?",
        "a": "Statewide ban-the-box rules only apply to public employers, but local ordinances create exceptions. For example, the Philadelphia Fair Criminal Records Screening Standards prohibit private employers from asking about criminal history until after a conditional employment offer has been made."
      }
    ],
    "ctaParagraph": "Navigating Pennsylvania's complex web of state statutes and local ordinances doesn't have to slow down your hiring process. Partner with Rapid Hire to automate compliance and build a screening workflow that scales effortlessly across the Commonwealth.",
    "seoMetaDescription": "Master Pennsylvania background check compliance with our comprehensive guide. Learn how to navigate CHRIA, local ban-the-box rules, and medical cannabis protections."
  },
  {
    "slug": "ohio",
    "stateName": "Ohio",
    "abbr": "OH",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in Ohio: navigating local and state rules",
    "heroLede": "Ohio presents a complex landscape for employers, blending statewide mandates with localized ordinances in major cities. This guide breaks down the essential compliance requirements for screening candidates across the Buckeye State.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Mixed",
        "context": "Public employers statewide, plus private employers in Cincinnati and Columbus."
      },
      {
        "label": "Salary History",
        "value": "Allowed",
        "context": "No statewide ban prevents asking about past compensation."
      },
      {
        "label": "Cannabis",
        "value": "Employer Choice",
        "context": "Recent legalization preserves the right to enforce drug-free policies."
      }
    ],
    "whatMakesDifferent": "What sets Ohio apart is the distinct division between state-level regulations and municipal ordinances. While Ohio Rev. Code §109.572 governs criminal records checks through the BCI&I, cities like Cincinnati and Columbus have enacted their own strict Fair Chance laws that private employers must navigate.",
    "fcraLayering": "Federal FCRA rules form the baseline for background checks in Ohio, dictating strict disclosure and authorization protocols. Employers must ensure their disclosures meet federal standards before initiating any screening.\n\nBeyond this federal floor, employers must account for state nuances, particularly regarding sealed records under Ohio Rev. Code §2953.32. Integrating these protections is critical for compliance.",
    "banTheBoxBody": "Ohio enforces a statewide ban-the-box policy for public employers. Private employers must also be vigilant, as the Cincinnati and Columbus private-sector Fair Chance ordinances extend these restrictions to private businesses within city limits.\n\nIn these jurisdictions, employers cannot ask about criminal history until after a conditional offer. Hiring teams must tailor their application processes based on the role's location to ensure strict compliance.",
    "cannabisBody": "Issue 2 (2023) legalized recreational cannabis in Ohio, but explicitly preserves the rights of employers to maintain drug-free workplace policies. Hiring teams can still test for marijuana and take adverse action based on positive results.\n\nEmployers are not required to accommodate recreational cannabis use. It remains crucial to clearly communicate testing policies to candidates upfront, ensuring transparency and compliance.",
    "hiringFlowSteps": [
      "Determine if the role falls under Cincinnati or Columbus Fair Chance ordinances.",
      "Provide a clear, standalone FCRA disclosure and obtain written authorization.",
      "Conduct the background check, ensuring sealed records are excluded.",
      "Review results against internal policies and applicable local ordinances.",
      "Issue a pre-adverse action notice if considering rescinding an offer.",
      "Allow the candidate sufficient time to dispute the findings.",
      "Send the final adverse action notice if the decision stands."
    ],
    "faqPairs": [
      {
        "q": "Does Ohio have a statewide ban-the-box law for private employers?",
        "a": "No, Ohio's statewide ban-the-box law only applies to public employers. However, private employers in Cincinnati and Columbus must comply with local Fair Chance ordinances that restrict criminal history inquiries until after a conditional offer."
      },
      {
        "q": "Can Ohio employers still test for marijuana after Issue 2?",
        "a": "Yes. While Issue 2 legalized recreational cannabis, it explicitly allows employers to maintain drug-free workplace policies. Employers can still test for marijuana and make hiring decisions based on positive test results without violating the law."
      }
    ],
    "ctaParagraph": "Navigating Ohio's mix of state laws and local ordinances doesn't have to be overwhelming. Partner with Rapid Hire to streamline your screening process and keep your hiring compliant.",
    "seoMetaDescription": "Navigate Ohio background check compliance with our comprehensive guide. Learn about state laws, local ban-the-box rules, and cannabis testing for employers."
  },
  {
    "slug": "georgia",
    "stateName": "Georgia",
    "abbr": "GA",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in Georgia: navigating southern screening rules",
    "heroLede": "Employers expanding into the South must navigate a landscape where statewide mandates remain sparse, but local ordinances and record restriction laws demand attention. This guide outlines how to build compliant screening workflows across the Peach State.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public Only",
        "context": "Private employers face no statewide restrictions on criminal history inquiries."
      },
      {
        "label": "Salary History",
        "value": "Permitted",
        "context": "No statewide bans prevent employers from asking candidates about past compensation."
      },
      {
        "label": "Cannabis",
        "value": "Schedule 1",
        "context": "Recreational use remains illegal, offering no employment protections for applicants."
      }
    ],
    "whatMakesDifferent": "Unlike jurisdictions with sweeping private-sector mandates, this state relies heavily on O.C.G.A. §35-3-37, which governs record restriction and limits the visibility of certain dismissed or non-conviction records. Hiring teams must carefully calibrate their adjudication matrices to account for these restricted records while navigating a patchwork of local ordinances in major metropolitan areas.",
    "fcraLayering": "Federal law establishes the baseline for consumer reporting, but local regulations impose nuances on how criminal history is disseminated. Employers must ensure disclosure forms align with federal standards and state rules.\n\nUnder O.C.G.A. §35-3-34, the state outlines specific parameters for accessing criminal history records. Organizations must integrate these access requirements into their compliance strategy.",
    "banTheBoxBody": "Private employers operate without a statewide mandate restricting when they can inquire about a candidate's criminal history. This affords commercial enterprises flexibility in designing their application workflows.\n\nHowever, public-sector hiring is subject to localized constraints, notably the Atlanta and DeKalb County public-employer Fair Chance ordinances. These municipal rules require public entities to delay criminal history inquiries.",
    "cannabisBody": "The state maintains a strict prohibition on recreational marijuana, offering no employment protections for applicants who use the substance. Employers retain full authority to enforce zero-tolerance drug policies and conduct pre-employment testing.\n\nUnder O.C.G.A. §16-13-2, cannabis remains a Schedule 1 substance, though a narrow exception exists for low-THC oil. This exception does not require employers to accommodate workplace use.",
    "hiringFlowSteps": [
      "1. Present standard federal FCRA disclosure and authorization forms before initiating any background checks.",
      "2. Review local ordinances if hiring for public-sector roles in Atlanta or DeKalb County to ensure compliance.",
      "3. Conduct initial interviews and assess candidate qualifications before requesting criminal history records.",
      "4. Initiate the background check, ensuring the screening provider properly filters restricted records.",
      "5. Evaluate returned records against an established adjudication matrix that accounts for state-specific rules.",
      "6. Execute the standard two-step adverse action process if a candidate is disqualified based on the report."
    ],
    "faqPairs": [
      {
        "q": "Are private employers in Georgia required to remove criminal history questions from applications?",
        "a": "No, there is currently no statewide ban-the-box law applying to private employers in the state. Private organizations may ask about criminal history on initial applications, though public employers in certain jurisdictions like Atlanta face restrictions."
      },
      {
        "q": "How does Georgia handle the reporting of expunged or restricted criminal records?",
        "a": "The state utilizes a record restriction process rather than traditional expungement. Restricted records are generally shielded from public view and should not be reported by consumer reporting agencies or considered by employers during the hiring process."
      }
    ],
    "ctaParagraph": "Navigating the nuances of southern screening regulations requires a partner who understands both federal mandates and local intricacies. Contact Rapid Hire today to build a compliant, efficient background check program tailored to your organization's specific needs.",
    "seoMetaDescription": "Explore our comprehensive guide to conducting a compliant background check in Georgia. Learn about record restriction, local ordinances, and screening best practices."
  },
  {
    "slug": "north-carolina",
    "stateName": "North Carolina",
    "abbr": "NC",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in North Carolina: a screener's compass",
    "heroLede": "Navigating the hiring landscape in North Carolina requires a firm grasp of both statewide statutes and emerging municipal ordinances. This guide unpacks the critical compliance layers, from lawful products protections to localized fair chance hiring rules, ensuring your screening process remains legally sound.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public Only",
        "context": "Statewide rules apply to public employers, with growing municipal momentum."
      },
      {
        "label": "Salary History",
        "value": "No Ban",
        "context": "Employers may freely inquire about a candidate's previous compensation."
      },
      {
        "label": "Cannabis",
        "value": "Illegal",
        "context": "Marijuana remains illegal, though lawful products statutes protect some off-duty conduct."
      }
    ],
    "whatMakesDifferent": "What sets North Carolina apart is the interplay between strict statewide mandates, like the N.C. Gen. Stat. §14-208.6 sex offender registry, and localized progressive policies. While the state maintains a traditional stance on many employment issues, major municipalities are actively reshaping the screening landscape through targeted public-sector initiatives.",
    "fcraLayering": "North Carolina employers operate where federal FCRA requirements serve as the primary baseline. The state does not impose sweeping consumer reporting restrictions beyond the federal floor.\n\nHowever, hiring teams must remain vigilant regarding local jurisdictions that introduce additional procedural steps. Integrating these municipal nuances with standard FCRA adverse action processes is essential.",
    "banTheBoxBody": "While North Carolina lacks a statewide private-sector ban-the-box law, public employers face specific restrictions. The Durham, Charlotte, Mecklenburg County, and Buncombe County Fair Chance public-sector rules mandate delaying criminal inquiries.\n\nPrivate employers in these hubs should monitor this growing municipal momentum. Adopting fair chance practices voluntarily can streamline operations and mitigate future compliance risks.",
    "cannabisBody": "Cannabis remains illegal statewide in North Carolina, allowing employers to maintain strict drug-free workplace policies. There are no medical accommodations required for marijuana use.\n\nHowever, recruiters must navigate the lawful products statute under N.C. Gen. Stat. §95-28.2. This law protects employees engaging in the lawful use of legal products during non-working hours, complicating certain off-duty conduct evaluations.",
    "hiringFlowSteps": [
      "Provide standard FCRA disclosures and obtain written authorization before initiating any background checks.",
      "Conduct interviews and evaluate candidate qualifications without inquiring about criminal history in restricted public sectors.",
      "Extend a conditional offer of employment before requesting a comprehensive criminal background screening.",
      "Review the returned report, ensuring compliance with N.C. Gen. Stat. §15A-145 regarding expunged records.",
      "Execute the standard two-step FCRA adverse action process if the background report influences a negative hiring decision."
    ],
    "faqPairs": [
      {
        "q": "Are employers in North Carolina permitted to ask candidates about their salary history?",
        "a": "Yes, North Carolina does not currently have a statewide salary history ban. Employers are legally permitted to inquire about a candidate's previous compensation during the interview process, though many organizations are voluntarily dropping this practice to promote pay equity."
      },
      {
        "q": "How do expunged records impact the background screening process in North Carolina?",
        "a": "Under N.C. Gen. Stat. §15A-145, candidates are not required to disclose expunged criminal records. Employers must ensure their screening partners properly filter out these sealed records, as relying on expunged information for hiring decisions can lead to significant compliance liabilities."
      }
    ],
    "ctaParagraph": "Ready to streamline your North Carolina hiring process? Partner with Rapid Hire to implement a compliant, efficient screening program tailored to your specific regional needs and operational goals.",
    "seoMetaDescription": "Navigate North Carolina background check requirements with our comprehensive guide. Learn about local fair chance laws, compliance rules, and screening best practices."
  },
  {
    "slug": "michigan",
    "stateName": "Michigan",
    "abbr": "MI",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in Michigan: a screener's compass",
    "heroLede": "Navigating applicant screening in Michigan requires balancing statewide mandates with localized ordinances in major cities. This guide breaks down the essential compliance steps for hiring teams operating across the Great Lakes State.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public & Local",
        "context": "Statewide for public employers, with private mandates in Detroit and Kalamazoo."
      },
      {
        "label": "Cannabis",
        "value": "Off-Duty Protected",
        "context": "Recreational use is lawful, though employers may still test for impairment."
      },
      {
        "label": "Salary History",
        "value": "Permitted",
        "context": "Michigan does not currently ban inquiries into an applicant's past compensation."
      }
    ],
    "whatMakesDifferent": "Michigan presents a unique screening environment where statewide rules often intersect with municipal regulations, particularly concerning criminal history inquiries. While MCL §37.2205a establishes baseline expectations for public employers, hiring teams must also navigate localized mandates like the Detroit Fair Chance ordinance when evaluating candidates.",
    "fcraLayering": "While the federal Fair Credit Reporting Act establishes the foundational requirements for applicant consent and adverse action, Michigan employers must integrate these rules with state-specific privacy standards.\n\nHiring teams should ensure their disclosure forms remain distinct from other onboarding paperwork, maintaining strict adherence to federal timelines while accommodating local municipal restrictions.",
    "banTheBoxBody": "Under MCL §37.2205a, public employers in Michigan cannot inquire about criminal history on initial job applications. This ensures candidates are evaluated on their qualifications before their background is scrutinized.\n\nFor private employers, the landscape is dictated by local jurisdictions. The Detroit Fair Chance ordinance requires private businesses with five or more workers to delay criminal history inquiries until later in the hiring process.",
    "cannabisBody": "The MRTMA Initiated Law 1 of 2018 legalized recreational cannabis, altering how employers approach drug screening. While the law permits off-duty consumption, it does not restrict an employer's ability to discipline for on-the-job impairment.\n\nCase law like Eplee v. Lansing highlights the complexities of off-duty protections. Employers must calibrate testing protocols to avoid penalizing lawful use while ensuring workplace safety.",
    "hiringFlowSteps": [
      "Determine if your organization falls under public sector rules or local municipal ordinances.",
      "Provide a standalone FCRA-compliant disclosure before initiating any background checks.",
      "Obtain explicit written authorization from the candidate to proceed with the screening.",
      "Delay criminal history inquiries until after the initial application if mandated locally.",
      "Review drug testing policies to ensure compliance with off-duty cannabis protections.",
      "Follow standard two-step adverse action procedures if considering a rescinded offer."
    ],
    "faqPairs": [
      {
        "q": "Does Michigan have a statewide ban-the-box law for private employers?",
        "a": "No, Michigan does not have a statewide ban-the-box mandate for private employers. However, public employers are restricted by state law, and private businesses in cities like Detroit and Kalamazoo must comply with local ordinances that delay criminal inquiries."
      },
      {
        "q": "Can employers in Michigan still test applicants for marijuana use?",
        "a": "Yes, employers can still test for marijuana, but they must navigate protections for lawful off-duty use established by state law and recent court decisions. Policies should focus on identifying actual impairment rather than penalizing legal recreational consumption."
      }
    ],
    "ctaParagraph": "Navigating Michigan's patchwork of state laws and municipal ordinances doesn't have to be overwhelming. Partner with Rapid Hire to streamline your screening process and keep your hiring workflows compliant across every jurisdiction.",
    "seoMetaDescription": "Navigate Michigan background check compliance with our comprehensive guide for employers, covering ban-the-box rules and cannabis testing."
  },
  {
    "slug": "new-jersey",
    "stateName": "New Jersey",
    "abbr": "NJ",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in New Jersey: a screener's compass",
    "heroLede": "Navigating candidate screening in the Garden State requires a precise understanding of overlapping state and local mandates. This guide details how to operationalize compliance across major employment hubs from Newark to Trenton.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public & Private",
        "context": "Applies to employers with 15 or more employees over 20 calendar weeks."
      },
      {
        "label": "Salary History",
        "value": "Banned",
        "context": "Employers cannot screen applicants based on their previous wage or salary history."
      },
      {
        "label": "Cannabis",
        "value": "Lawful Use",
        "context": "Adverse action based solely on the presence of cannabinoid metabolites is prohibited."
      }
    ],
    "whatMakesDifferent": "New Jersey distinguishes itself through a complex interplay of statewide mandates and municipal ordinances, notably the N.J.S.A. §34:6B-11 (Opportunity to Compete Act) which fundamentally alters the initial screening timeline. Furthermore, the state's robust protections under the N.J.S.A. §10:5-12 (LAD) demand that hiring teams meticulously document their assessment processes to avoid discriminatory practices.",
    "fcraLayering": "While the federal Fair Credit Reporting Act establishes the baseline for disclosure, New Jersey employers face additional procedural hurdles. State mandates require more granular adverse action notices during the screening lifecycle.\n\nTeams operating in jurisdictions like Newark must integrate local ordinances into their FCRA workflows. Federal compliance alone is insufficient to mitigate litigation risks here.",
    "banTheBoxBody": "Under N.J.S.A. §34:6B-11 (Opportunity to Compete Act), employers cannot inquire about criminal history until after the first interview concludes. This mandate applies to public and private sectors, shifting when background checks initiate.\n\nHiring teams must also account for stricter local rules like the Newark Fair Chance Ordinance. These municipal regulations impose rigorous individualized assessment requirements before adverse actions are finalized.",
    "cannabisBody": "The N.J.S.A. §24:6I-52 (CREAMM Act) bars employers from taking adverse action against candidates solely based on cannabis metabolites. This lawful-use protection requires recalibrating traditional screening protocols.\n\nTo establish impairment, employers must follow N.J.A.C. 17:30B (CRC WIRE rules, 2025) which mandates a paired impairment determination. A positive test alone is no longer sufficient to disqualify an applicant.",
    "hiringFlowSteps": [
      "1. Remove all criminal history and salary inquiries from initial employment applications.",
      "2. Conduct the first interview before initiating any background screening processes.",
      "3. Provide clear FCRA disclosures and obtain written authorization from the candidate.",
      "4. Perform the background check, ensuring compliance with state and local ordinances.",
      "5. Conduct an individualized assessment if criminal records are identified.",
      "6. Issue a pre-adverse action notice with a copy of the report if considering rejection.",
      "7. Wait the required period before sending the final adverse action notification."
    ],
    "faqPairs": [
      {
        "q": "Can we ask about a candidate's salary history during the interview process in New Jersey?",
        "a": "No, New Jersey law strictly prohibits employers from inquiring about a candidate's previous wage or salary history at any stage of the hiring process. This ban applies to all employers and is designed to promote pay equity across the state. Hiring teams must ensure all interview templates are updated."
      },
      {
        "q": "How does the CREAMM Act affect our pre-employment drug testing policies?",
        "a": "The CREAMM Act prevents employers from disqualifying candidates solely due to a positive test for cannabis metabolites. To take adverse action, employers must conduct a paired impairment determination as outlined in the CRC WIRE rules. Standard drug panels may need adjustment to align with these requirements."
      }
    ],
    "ctaParagraph": "Navigating New Jersey's complex web of state and municipal screening laws doesn't have to be a manual burden. Contact Rapid Hire today to discover how our automated compliance workflows can streamline your hiring process.",
    "seoMetaDescription": "Master New Jersey background check compliance with our comprehensive guide. Learn how to navigate the Opportunity to Compete Act and local ordinances."
  },
  {
    "slug": "virginia",
    "stateName": "Virginia",
    "abbr": "VA",
    "heroEyebrow": "Virginia background-check guide · 2026",
    "heroHeadline": "Navigating hiring compliance in the Commonwealth of Virginia",
    "heroLede": "Virginia employers face a rapidly evolving compliance landscape, marked by recent shifts in cannabis protections and expanded fair chance hiring rules. This guide outlines the essential steps for building a compliant screening program across the Commonwealth.",
    "heroStats": [
      {
        "label": "Ban-the-Box",
        "value": "Public & Private",
        "context": "Virginia restricts criminal history inquiries for both public and private employers."
      },
      {
        "label": "Salary History",
        "value": "Permitted",
        "context": "Employers may still ask candidates about their previous compensation during interviews."
      },
      {
        "label": "Cannabis",
        "value": "Lawful Use",
        "context": "Recent statutes provide significant protections for off-duty recreational cannabis use."
      }
    ],
    "whatMakesDifferent": "Virginia distinguishes itself through a progressive approach to record sealing and applicant privacy, particularly regarding past offenses. Under Va. Code §19.2-389.3, the state automatically seals records for simple possession, meaning employers must ensure their screening partners do not report these shielded infractions.",
    "fcraLayering": "The federal Fair Credit Reporting Act establishes the baseline for applicant consent, but Virginia employers must navigate additional state-level nuances. The state generally aligns with federal disclosure requirements.\\n\\nRecruiters must maintain rigorous adherence to the standard two-step adverse action process. Providing candidates a copy of their report before final decisions is critical to mitigating litigation.",
    "banTheBoxBody": "Virginia has significantly expanded its fair chance hiring initiatives. Under Va. Code §15.2-1500.1, public employers are prohibited from inquiring about criminal history on initial applications, setting a strong precedent.\\n\\nFollowing the passage of HB 2299 in 2021, these restrictions were extended to private employers across the state. Hiring teams must delay criminal history inquiries until after an initial interview or conditional offer.",
    "cannabisBody": "The landscape for drug testing in Virginia has transformed with the legalization of adult-use marijuana under Va. Code §4.1-1109. Employers must carefully evaluate their screening panels to ensure compliance with these new protections.\\n\\nFurthermore, Va. Code §40.1-27.4 introduces specific safeguards for off-duty cannabis consumption. Recruiters cannot take adverse action against candidates solely based on lawful, off-premises use.",
    "hiringFlowSteps": [
      "1. Remove all criminal history questions from initial job applications to comply with Virginia's statewide ban-the-box requirements.",
      "2. Provide candidates with a clear, standalone FCRA disclosure and obtain written consent before initiating any background check.",
      "3. Conduct interviews and evaluate candidate qualifications without factoring in past criminal records or off-duty cannabis use.",
      "4. Extend a conditional offer of employment before requesting a comprehensive criminal background and drug screening report.",
      "5. Review the background report, ensuring that automatically sealed simple-possession records are not improperly considered.",
      "6. Issue a pre-adverse action notice with a copy of the report if considering rescinding the offer based on the findings.",
      "7. Allow the candidate sufficient time to dispute the report before sending the final adverse action notice to close the process."
    ],
    "faqPairs": [
      {
        "q": "Can Virginia employers ask candidates about their salary history during interviews?",
        "a": "Yes, Virginia does not currently have a statewide salary history ban. Employers are permitted to ask candidates about their previous compensation and use that information when formulating job offers, though many organizations are voluntarily moving away from this practice to promote pay equity."
      },
      {
        "q": "Are private employers in Virginia required to follow ban-the-box regulations?",
        "a": "Yes, following the passage of HB 2299 in 2021, Virginia extended ban-the-box restrictions to private employers. Hiring teams must remove criminal history questions from initial applications and delay such inquiries until later in the hiring process, typically after an interview."
      }
    ],
    "ctaParagraph": "Navigating Virginia's complex web of fair chance hiring laws and cannabis protections doesn't have to be overwhelming. Partner with Rapid Hire to streamline your screening process and build a compliant, efficient hiring workflow today.",
    "seoMetaDescription": "Master Virginia background check compliance with our comprehensive guide. Learn about ban-the-box rules, cannabis protections, and FCRA requirements for employers."
  },
  {
    "slug": "washington",
    "stateName": "Washington",
    "abbr": "WA",
    "heroEyebrow": "State background-check guide · 2026",
    "heroHeadline": "Hiring in Washington: a screener's compass",
    "heroLede": "Navigating the compliance landscape in the Pacific Northwest requires a firm grasp of both state and local screening mandates. This guide outlines the essential requirements for conducting compliant background checks across Washington, from statewide fair chance rules to municipal ordinances.",
    "heroStats": [
      {
        "label": "Ban the Box",
        "value": "Public & Private",
        "context": "Statewide rules apply to nearly all employers."
      },
      {
        "label": "Salary History",
        "value": "Banned",
        "context": "Employers cannot seek applicant wage history."
      },
      {
        "label": "Cannabis",
        "value": "Pre-hire Limits",
        "context": "Testing for non-psychoactive metabolites is restricted."
      }
    ],
    "whatMakesDifferent": "Washington presents a layered regulatory environment where statewide mandates frequently intersect with strict municipal ordinances. Employers must navigate the requirements of RCW §49.94 (Fair Chance Act) alongside local rules like the Seattle Fair Chance Employment Ordinance (FCEO), which imposes additional notice and case-by-case analysis obligations.",
    "fcraLayering": "While the federal Fair Credit Reporting Act establishes the baseline, Washington employers must also comply with RCW §19.182 (state FCRA). This statute introduces specific consumer protection requirements for background information.\n\nApplicants are entitled to distinct disclosures regarding their consumer reports. Hiring teams must ensure their adverse action processes satisfy both federal standards and state law.",
    "banTheBoxBody": "Under RCW §49.94 (Fair Chance Act), public and private employers across Washington cannot inquire about criminal history until determining the applicant is otherwise qualified. This ensures candidates are evaluated on their merits.\n\nEmployers in major cities must also adhere to stricter local rules. The Seattle Fair Chance Employment Ordinance (FCEO) requires a case-by-case analysis and specific notices before taking adverse action.",
    "cannabisBody": "Under RCW §49.44.240, Washington employers are prohibited from discriminating against a candidate based on a pre-employment drug test that identifies non-psychoactive cannabis metabolites.\n\nThis restriction alters pre-employment screening practices for most roles starting in 2024. While employers can still test for active impairment, they must update their drug testing panels to ensure compliance with these new limitations.",
    "hiringFlowSteps": [
      "Remove all criminal history questions from initial employment applications.",
      "Evaluate the candidate's qualifications before initiating any background inquiries.",
      "Provide required state and federal disclosures before requesting a consumer report.",
      "Conduct a case-by-case analysis of any criminal records, especially in Seattle.",
      "Follow the two-step adverse action process if considering disqualification.",
      "Ensure pre-employment drug panels exclude non-psychoactive cannabis metabolites."
    ],
    "faqPairs": [
      {
        "q": "Does Washington state law prohibit salary history inquiries?",
        "a": "Yes, Washington law prohibits employers from seeking the wage or salary history of an applicant. Employers cannot require that a candidate's prior wage history meet certain criteria, ensuring compensation is based on the role rather than past earnings."
      },
      {
        "q": "Are private employers covered by Washington's Ban the Box law?",
        "a": "Yes, the statewide Fair Chance Act applies to both public and private employers. It prohibits inquiries into an applicant's criminal record until after the employer has determined the individual is otherwise qualified for the position."
      }
    ],
    "ctaParagraph": "Navigating Washington's complex web of state and municipal screening laws requires a reliable partner. Contact Rapid Hire today to streamline your background check process and maintain compliance across the Pacific Northwest.",
    "seoMetaDescription": "Navigate Washington background check compliance with our comprehensive guide. Learn about state laws, local ordinances, and best practices for employers."
  }
];

export function findStatePageContent(slug: string): StatePageContent | undefined {
  return STATE_PAGE_CONTENT.find((s) => s.slug === slug);
}

export const STATE_PAGE_SLUGS: string[] = STATE_PAGE_CONTENT.map((s) => s.slug);

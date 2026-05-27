/*
  §201 — Resources Case Studies registry.

  These are anonymized, industry-level case studies surfaced from the
  Resources hub (/resources/case-studies). They are intentionally kept
  in a separate registry from the named-customer CASE_STUDIES used by
  /customers (Frito-Lay, H&R Block, TaylorMade) — those are sales-stage
  reference assets with explicit logos and quote attributions; these are
  resource-stage assets that buyer teams typically read before talking
  to sales.

  Each entry mirrors the shape of the source content:
    eyebrow         — the industry vertical ("High-Volume Industrial Staffing")
    headline        — the result-led one-liner ("Dallas Staffing Agency Slashes…")
    problem         — narrative paragraph
    whatWasBroken   — narrative paragraph
    whySwitched     — narrative paragraph
    resultsLede     — narrative paragraph that introduces the metrics table
    metrics         — 4 rows × {metric, legacy, rapid, improvement}
    quote           — pull-quote string
    quoteAttribution— "Director of Human Resources, Dallas Industrial Staffing Solutions"

  Source: customer-supplied document, captured 2026-05-27 from
  https://manus.im/share/file/36b81ce1-1886-4270-909d-4fb003f20828.
*/

export type CaseStudyMetric = {
  metric: string;
  legacy: string;
  rapid: string;
  improvement: string;
};

export type CaseStudyResource = {
  slug: string;
  industry: string;
  headline: string;
  problem: string;
  whatWasBroken: string;
  whySwitched: string;
  resultsLede: string;
  metrics: [CaseStudyMetric, CaseStudyMetric, CaseStudyMetric, CaseStudyMetric];
  quote: string;
  quoteAttribution: string;
};

export const CASE_STUDY_RESOURCES: CaseStudyResource[] = [
  {
    slug: "high-volume-industrial-staffing",
    industry: "High-Volume Industrial Staffing",
    headline:
      "Dallas Staffing Agency Slashes Onboarding Time by 37% and Cuts Screening Costs by 28%",
    problem:
      "A premier industrial staffing agency in Dallas, Texas, responsible for placing over twelve thousand light industrial and logistics workers annually, was losing qualified candidates to competitors due to sluggish background check turnarounds. In high-volume staffing, speed is the ultimate competitive advantage; a delay of even forty-eight hours means candidates find work elsewhere.",
    whatWasBroken:
      "The agency's legacy screening vendor promised twenty-four-hour turnarounds but consistently averaged three to five business days. Reports were delivered as dense, confusing multi-page PDFs buried in an outdated portal. When checks stalled, recruiters spent hours in automated phone trees or waiting for offshore customer support email replies. Candidates dropped out of the pipeline, client fulfillment rates plummeted, and administrative overhead skyrocketed.",
    whySwitched:
      "The staffing agency needed a partner that understood the high-stakes, fast-moving nature of industrial staffing. They switched to Rapid Hire Solutions for the SPA Standard: a guaranteed median turnaround time of eight hours, transparent flat-rate pricing, and instant access to U.S.-based, FCRA-accredited support specialists who answer the phone on the first ring.",
    resultsLede:
      "By integrating Rapid Hire directly into their staffing CRM, the agency automated candidate invitations and screening workflows.",
    metrics: [
      {
        metric: "Median Turnaround Time",
        legacy: "72–120 Hours",
        rapid: "6.5 Hours",
        improvement: "89% Faster",
      },
      {
        metric: "Onboarding Cycle Time",
        legacy: "5.4 Days",
        rapid: "3.4 Days",
        improvement: "37% Reduction",
      },
      {
        metric: "Direct Screening Cost",
        legacy: "$45.00 / candidate",
        rapid: "$32.40 / candidate",
        improvement: "28% Savings",
      },
      {
        metric: "Recruiter Admin Time",
        legacy: "45 mins / file",
        rapid: "8 mins / file",
        improvement: "82% Reduction",
      },
    ],
    quote:
      "Before Rapid Hire, our recruiters spent half their day chasing background checks and apologizing to clients. Now, checks clear in hours, not days. We reduced onboarding time by 37% and cut screening costs by 28%, but the real victory is that our recruiters are back to doing what they do best: filling roles and keeping our clients happy.",
    quoteAttribution:
      "Director of Human Resources, Dallas Industrial Staffing Solutions",
  },
  {
    slug: "nationwide-last-mile-delivery",
    industry: "Nationwide Last-Mile Delivery",
    headline:
      "Logistics Giant Scales Seasonal Hiring to 5,000 Drivers While Maintaining 99.9% Accuracy",
    problem:
      "A nationwide last-mile delivery provider faced the monumental task of onboarding five thousand delivery drivers across twenty states in preparation for the peak holiday season. Operating under strict Department of Transportation (DOT) regulations and corporate safety standards, they could not afford to compromise on screening quality, yet they had a hard deadline to get drivers on the road.",
    whatWasBroken:
      "Their previous background check provider struggled with high-volume spikes, leading to massive bottlenecks. Worse, the accuracy of Motor Vehicle Records (MVR) and criminal checks began to slip. The provider frequently flagged minor, non-disqualifying infractions or missed critical records entirely, leading to a wave of manual disputes. The company's internal compliance team was overwhelmed by a \u201cwall of legalese\u201d and was forced to manually audit every single report.",
    whySwitched:
      "The logistics giant required a highly scalable, automated solution that combined extreme speed with ironclad compliance. They chose Rapid Hire Solutions because of our PBSA-accredited, SOC 2 Type II-certified platform and our clear, audit-ready reports that present status pills and time-to-clear metrics visible at a glance.",
    resultsLede:
      "Rapid Hire's automated workflow allowed candidates to securely upload their driver's licenses and complete disclosures on their mobile phones, eliminating manual data entry errors.",
    metrics: [
      {
        metric: "MVR Clear Rate (Under 12h)",
        legacy: "42%",
        rapid: "94%",
        improvement: "123% Increase",
      },
      {
        metric: "Report Accuracy Rate",
        legacy: "97.2%",
        rapid: "99.9%",
        improvement: "Zero Disputes",
      },
      {
        metric: "Seasonal Onboarding Target",
        legacy: "Missed by 12%",
        rapid: "Exceeded by 4%",
        improvement: "100% On-Time",
      },
      {
        metric: "Compliance Audit Prep",
        legacy: "3 Weeks",
        rapid: "Instant (Dashboard)",
        improvement: "100% Automated",
      },
    ],
    quote:
      "In last-mile logistics, an idle truck is a massive loss. Rapid Hire didn't just speed up our MVR and criminal checks; they gave us absolute confidence in our compliance. Their clean, mobile-friendly reports let our managers make hiring decisions in seconds. We onboarded five thousand drivers ahead of schedule with zero compliance issues.",
    quoteAttribution:
      "VP of Talent Acquisition & Safety, National Logistics Group",
  },
  {
    slug: "enterprise-healthcare-services",
    industry: "Enterprise Healthcare Services",
    headline:
      "Healthcare Network Automates Sanction Checks and Eliminates Manual Credentialing Overhead",
    problem:
      "A multi-state healthcare network with over eight thousand clinical and administrative staff was struggling to manage the complex credentialing and continuous monitoring required for healthcare compliance. Failing to identify a sanctioned provider could result in millions of dollars in federal fines and the immediate loss of Medicare and Medicaid funding.",
    whatWasBroken:
      "The network's credentialing process was entirely manual. Recruiters had to cross-reference multiple federal and state databases\u2014including OIG, SAM, and state licensing boards\u2014for every single hire. The legacy screening provider took up to two weeks to verify education and professional licenses, leaving critical nursing and administrative roles vacant. Furthermore, they had no mechanism for continuous monitoring, leaving the network vulnerable to post-hire sanctions.",
    whySwitched:
      "The healthcare network required an enterprise-grade, HIPAA-compliant screening platform that could automate primary source verifications and provide ongoing, continuous monitoring. They switched to Rapid Hire Solutions for our comprehensive healthcare screening suite, robust ATS integrations, and dedicated, U.S.-based FCRA-certified support.",
    resultsLede:
      "Rapid Hire integrated seamlessly with the network's enterprise ATS, triggering background checks, education verifications, and healthcare sanction checks the moment a candidate reached the offer stage.",
    metrics: [
      {
        metric: "Credentialing Cycle Time",
        legacy: "11.2 Days",
        rapid: "2.8 Days",
        improvement: "75% Reduction",
      },
      {
        metric: "Education & License Verification",
        legacy: "8.5 Days",
        rapid: "24 Hours",
        improvement: "71% Faster",
      },
      {
        metric: "Sanction Check Accuracy",
        legacy: "Manual / Spotty",
        rapid: "100% Automated",
        improvement: "Risk Eliminated",
      },
      {
        metric: "Continuous Monitoring Cost",
        legacy: "N/A (Manual)",
        rapid: "Flat Annual Fee",
        improvement: "64% Cost Savings",
      },
    ],
    quote:
      "Rapid Hire Solutions transformed our credentialing process from a compliance headache into a seamless, automated workflow. Their platform handles everything from education verification to continuous sanction monitoring. We cut our credentialing cycle time by seventy-five percent, allowing us to get nurses on the floor and caring for patients days faster than before.",
    quoteAttribution: "Chief Compliance Officer, Apex Health Network",
  },
];

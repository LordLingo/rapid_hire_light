export const RHS_LEAD_SUBMIT_SUCCESS_EVENT = "rhs_lead_submit_success" as const;

export const LEAD_FORM_IDS = {
  getAQuote: "get_a_quote",
  staffing: "staffing_background_checks",
  healthcare: "healthcare_employee_screening",
  criminal: "employer_criminal_background_checks",
  preEmployment: "pre_employment_screening",
  hireQuest: "hirequest_partner",
  contact: "contact",
  complianceAudit: "compliance_audit",
  integrations: "integrations_request",
  referral: "referral_partner",
  staffingLegacy: "staffing_legacy",
  cleaningCompanies: "cleaning_companies",
  movingCompanies: "moving_companies",
} as const;

export type LeadFormId =
  (typeof LEAD_FORM_IDS)[keyof typeof LEAD_FORM_IDS];

export const LEAD_FORM_PAGE_PATHS: Record<LeadFormId, string> = {
  get_a_quote: "/get-a-quote",
  staffing_background_checks: "/lp/staffing-background-checks",
  healthcare_employee_screening: "/lp/healthcare-employee-screening",
  employer_criminal_background_checks:
    "/lp/employer-criminal-background-checks",
  pre_employment_screening: "/lp/pre-employment-screening",
  hirequest_partner: "/hirequest-partner/",
  contact: "/contact",
  compliance_audit: "/compliance/audit",
  integrations_request: "/integrations",
  referral_partner: "/referral",
  staffing_legacy: "/lp/staffing",
  cleaning_companies: "/industries/cleaning-companies",
  moving_companies: "/industries/moving-companies",
};

export interface LeadSubmitSuccessEvent {
  readonly event: typeof RHS_LEAD_SUBMIT_SUCCESS_EVENT;
  readonly lead_id: string;
  readonly lead_source: string;
  readonly form_id: LeadFormId;
  readonly page_path: string;
}

const pushedSubmissionIds = new Set<string>();

/**
 * Pushes the privacy-safe employer lead-success event expected by GTM.
 * Callers are responsible for invoking this only after their endpoint has
 * confirmed success and for guarding against duplicate calls per submission.
 */
export function pushLeadSubmitSuccess(formId: LeadFormId, leadId: string, leadSource: string): boolean {
  if (typeof window === "undefined" || pushedSubmissionIds.has(leadId)) {
    return false;
  }

  const event: LeadSubmitSuccessEvent = {
    event: RHS_LEAD_SUBMIT_SUCCESS_EVENT,
    lead_id: leadId,
    lead_source: leadSource,
    form_id: formId,
    page_path: window.location.pathname || LEAD_FORM_PAGE_PATHS[formId],
  };

  try {
    const browserWindow = window as unknown as { dataLayer?: unknown[] };
    browserWindow.dataLayer = browserWindow.dataLayer || [];
    browserWindow.dataLayer.push(event);
    pushedSubmissionIds.add(leadId);
    return true;
  } catch {
    // Analytics must never block or change the confirmed form success state.
    return false;
  }
}

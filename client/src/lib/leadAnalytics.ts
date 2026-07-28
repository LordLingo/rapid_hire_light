export const RHS_LEAD_SUBMIT_SUCCESS_EVENT = "rhs_lead_submit_success" as const;

export const LEAD_FORM_IDS = {
  getAQuote: "get_a_quote",
  staffing: "staffing_background_checks",
  healthcare: "healthcare_employee_screening",
  criminal: "employer_criminal_background_checks",
  preEmployment: "pre_employment_screening",
  hireQuest: "hirequest_partner",
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
};

export interface LeadSubmitSuccessEvent {
  readonly event: typeof RHS_LEAD_SUBMIT_SUCCESS_EVENT;
  readonly form_id: LeadFormId;
  readonly page_path: string;
}

/**
 * Pushes the privacy-safe employer lead-success event expected by GTM.
 * Callers are responsible for invoking this only after their endpoint has
 * confirmed success and for guarding against duplicate calls per submission.
 */
export function pushLeadSubmitSuccess(formId: LeadFormId): boolean {
  if (typeof window === "undefined") return false;

  const event: LeadSubmitSuccessEvent = {
    event: RHS_LEAD_SUBMIT_SUCCESS_EVENT,
    form_id: formId,
    page_path: LEAD_FORM_PAGE_PATHS[formId],
  };

  try {
    const browserWindow = window as unknown as { dataLayer?: unknown[] };
    browserWindow.dataLayer = browserWindow.dataLayer || [];
    browserWindow.dataLayer.push(event);
    return true;
  } catch {
    // Analytics must never block or change the confirmed form success state.
    return false;
  }
}
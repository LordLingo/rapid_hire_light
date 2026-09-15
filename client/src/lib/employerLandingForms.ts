import type {
  EmployerLandingFormConfig,
  EmployerLandingPageKey,
  LandingDetailField,
} from "@/content/employerScreeningLandingPages";
import {
  buildHubspotFields,
  formatQuoteRequestDetails,
  type HubspotSubmitBody,
} from "@/lib/hubspotForm";
import {
  TRACKING_PARAM_KEYS,
  type TrackingParams,
} from "@/lib/staffingLp";

export const EMPLOYER_LANDING_LEAD_SOURCE = "Get Started Form";

/**
 * The shared employer form only needs this narrow page contract. Keeping the
 * contract independent from the four-page /lp/ registry lets other approved
 * employer pages reuse the same submission, attribution, and CRM plumbing.
 */
export interface EmployerLeadFormPageConfig {
  readonly key?: EmployerLandingPageKey;
  readonly route: string;
  readonly seo: {
    readonly title: string;
    readonly canonical: string;
  };
  readonly cta: string;
  readonly form: EmployerLandingFormConfig;
}

export interface EmployerLandingFormValues {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly company: string;
  readonly volume: string;
  readonly services: string;
  readonly details: Readonly<Record<string, string>>;
}

function trimmed(value: string | undefined): string {
  return (value ?? "").trim();
}

function detailMessageLines(
  fields: readonly LandingDetailField[],
  values: Readonly<Record<string, string>>,
): string[] {
  const lines: string[] = [];
  for (const field of fields) {
    const value = trimmed(values[field.id]);
    if (!value) continue;
    lines.push(`${field.messageLabel}: ${value}`);
  }
  return lines;
}

export function buildEmployerLandingMessage(
  config: EmployerLeadFormPageConfig,
  values: EmployerLandingFormValues,
  tracking: TrackingParams,
): string {
  const lines = detailMessageLines(config.form.details, values.details);
  const trackingEntries = TRACKING_PARAM_KEYS.flatMap((key) => {
    const value = trimmed(tracking[key]);
    return value ? ([[key, value]] as const) : [];
  });
  if (trackingEntries.length > 0) {
    lines.push(
      `Tracking: ${JSON.stringify(Object.fromEntries(trackingEntries))}`,
    );
  }
  return lines.join("\n");
}

export function buildEmployerLandingPayload(
  config: EmployerLeadFormPageConfig,
  values: EmployerLandingFormValues,
  tracking: TrackingParams,
): Record<string, string> {
  const payload: Record<string, string> = {
    name: trimmed(values.name),
    email: trimmed(values.email),
    company: trimmed(values.company),
    volume: trimmed(values.volume),
    lead_source: EMPLOYER_LANDING_LEAD_SOURCE,
    source: config.route,
    _subject: config.form.subject,
  };

  const phone = trimmed(values.phone);
  if (phone) payload.phone = phone;

  const industry = trimmed(config.form.industry);
  if (industry) payload.industry = industry;

  const services = trimmed(values.services);
  if (services) payload.services = services;

  const message = buildEmployerLandingMessage(config, values, tracking);
  if (message) payload.message = message;

  for (const key of TRACKING_PARAM_KEYS) {
    const value = trimmed(tracking[key]);
    if (value) payload[key] = value;
  }

  return payload;
}

export function buildEmployerLandingHubspotBody(
  config: EmployerLeadFormPageConfig,
  values: EmployerLandingFormValues,
  tracking: TrackingParams,
  pageUri: string,
  hutk?: string,
): HubspotSubmitBody {
  const message = buildEmployerLandingMessage(config, values, tracking);
  const quoteRequestDetails = formatQuoteRequestDetails({
    volume: trimmed(values.volume),
    services: trimmed(values.services),
    message,
    sourcePageUri: pageUri,
  });

  return {
    fields: buildHubspotFields({
      firstname: trimmed(values.name),
      email: trimmed(values.email),
      phone: trimmed(values.phone),
      company: trimmed(values.company),
      industry: trimmed(config.form.industry),
      lead_source: EMPLOYER_LANDING_LEAD_SOURCE,
      quote_request_details: quoteRequestDetails,
    }),
    context: {
      pageUri,
      pageName: `${config.seo.title} | Rapid Hire Solutions`,
      hutk,
    },
  };
}

import {
  buildHubspotFields,
  formatQuoteRequestDetails,
  type HubspotSubmitBody,
} from "@/lib/hubspotForm";
import {
  TRACKING_PARAM_KEYS,
  type TrackingParams,
} from "@/lib/staffingLp";

export const HIREQUEST_SOURCE = "hirequest-partner";
export const HIREQUEST_LEAD_SOURCE = "Get Started Form";
export const HIREQUEST_FORM_SUBJECT = "HireQuest account setup request";

export const HIREQUEST_PACKAGES = [
  {
    name: "Standard Package",
    price: "$17",
    value: "Standard Package — $17",
    services: [
      "SSN Trace / Address History — 7-year history",
      "Nationwide Criminal / Sex Offender / OFAC / OIG / GSA / SAM",
      "County Criminal Search — Unlimited",
      "Nationwide Federal Criminal",
    ],
  },
  {
    name: "Staffing Package",
    price: "$23",
    value: "Staffing Package — $23",
    services: [
      "SSN Trace / Address History — 7-year history",
      "Nationwide Criminal / Sex Offender / OFAC / OIG / GSA / SAM",
      "County Criminal Search — Unlimited",
      "Nationwide Federal Criminal",
      "Statewide Criminal",
      "Employment Verification",
    ],
  },
  {
    name: "Driver Package",
    price: "$20",
    value: "Driver Package — $20",
    services: [
      "SSN Trace / Address History — 7-year history",
      "Nationwide Criminal / Sex Offender / OFAC / OIG / GSA / SAM",
      "County Criminal Search — Unlimited",
      "Nationwide Federal Criminal",
      "Driving History (MVR)",
    ],
  },
] as const;

export type HireQuestPackageValue =
  (typeof HIREQUEST_PACKAGES)[number]["value"];

export interface HireQuestRegistrationValues {
  readonly fullName: string;
  readonly workEmail: string;
  readonly phone: string;
  readonly officeName: string;
  readonly officeCity: string;
  readonly state: string;
  readonly officeId: string;
  readonly jobTitle: string;
  readonly monthlyHires: string;
  readonly packageSelection: string;
  readonly additionalNotes: string;
}

function trimmed(value: string | undefined): string {
  return (value ?? "").trim();
}

export function buildHireQuestMessage(
  values: HireQuestRegistrationValues,
  tracking: TrackingParams,
): string {
  const lines = [
    `Office City: ${trimmed(values.officeCity)}`,
    `State: ${trimmed(values.state)}`,
  ];

  const optionalLines: ReadonlyArray<readonly [string, string]> = [
    ["HireQuest Office or Franchise ID", values.officeId],
    ["Job Title", values.jobTitle],
    ["Package Selection", values.packageSelection],
    ["Additional Notes", values.additionalNotes],
  ];
  for (const [label, value] of optionalLines) {
    const clean = trimmed(value);
    if (clean) lines.push(`${label}: ${clean}`);
  }

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

export function buildHireQuestPayload(
  values: HireQuestRegistrationValues,
  tracking: TrackingParams,
): Record<string, string> {
  const payload: Record<string, string> = {
    name: trimmed(values.fullName),
    email: trimmed(values.workEmail),
    phone: trimmed(values.phone),
    company: trimmed(values.officeName),
    volume: trimmed(values.monthlyHires),
    services: trimmed(values.packageSelection),
    lead_source: HIREQUEST_LEAD_SOURCE,
    source: HIREQUEST_SOURCE,
    _subject: HIREQUEST_FORM_SUBJECT,
    message: buildHireQuestMessage(values, tracking),
  };

  for (const key of TRACKING_PARAM_KEYS) {
    const value = trimmed(tracking[key]);
    if (value) payload[key] = value;
  }

  return payload;
}

export function buildHireQuestHubspotBody(
  values: HireQuestRegistrationValues,
  tracking: TrackingParams,
  pageUri: string,
  hutk?: string,
): HubspotSubmitBody {
  const message = buildHireQuestMessage(values, tracking);
  return {
    fields: buildHubspotFields({
      firstname: trimmed(values.fullName),
      email: trimmed(values.workEmail),
      phone: trimmed(values.phone),
      company: trimmed(values.officeName),
      lead_source: HIREQUEST_LEAD_SOURCE,
      quote_request_details: formatQuoteRequestDetails({
        role: trimmed(values.jobTitle),
        volume: trimmed(values.monthlyHires),
        services: trimmed(values.packageSelection),
        message,
        sourcePageUri: pageUri,
      }),
    }),
    context: {
      pageUri,
      pageName: "HireQuest Background Checks | Rapid Hire Solutions",
      hutk,
    },
  };
}

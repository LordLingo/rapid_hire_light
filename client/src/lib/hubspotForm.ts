/*
  §209 — HubSpot Forms API direct submission.

  Posts the /get-a-quote form payload directly to HubSpot's public Forms
  Submissions API, bypassing the Formspree → HubSpot integration mapping
  that was silently dropping the `lead_source` field.

  The endpoint is a documented PUBLIC API — it requires no auth header
  and accepts CORS from any origin, by design (HubSpot wants any site
  to be able to embed-or-replace their tracked-form HTML).

  Reference: https://legacydocs.hubspot.com/docs/methods/forms/submit_form

  Endpoint shape:
    POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formId}
    Content-Type: application/json
    Body: {
      fields: [{ name: "<contact_property_internal_name>", value: "..." }, ...],
      context?: { pageUri, pageName, hutk? },
      legalConsentOptions?: ...
    }

  This helper is intentionally fire-and-forget at the call site: any
  HubSpot-side failure (missing custom property, invalid value for a
  dropdown enum, etc.) MUST NOT block the user's success state on the
  primary Formspree submission.
*/

export const HUBSPOT_PORTAL_ID = "24249673" as const;
export const HUBSPOT_QUOTE_FORM_ID = "e0120c0d-1fad-4556-a0ee-bb0684797042" as const;

/**
 * Build the HubSpot Forms API endpoint URL from a portal + form ID. Pure
 * function so it can be regression-pinned without network calls.
 */
export function hubspotFormsEndpoint(
  portalId: string,
  formId: string,
): string {
  return `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
}

/**
 * The shape HubSpot's Forms API expects. Each form submission is a flat
 * list of `{ name, value }` pairs — `name` MUST match the *internal* name
 * of the corresponding HubSpot contact property, NOT its display label.
 */
export interface HubspotField {
  readonly name: string;
  readonly value: string;
}

export interface HubspotSubmitContext {
  readonly pageUri?: string;
  readonly pageName?: string;
  /** HubSpot tracking cookie value (`hubspotutk`), if present. */
  readonly hutk?: string;
}

export interface HubspotSubmitBody {
  readonly fields: readonly HubspotField[];
  readonly context?: HubspotSubmitContext;
}

/**
 * Read the HubSpot tracking cookie (`hubspotutk`) from `document.cookie`
 * if it exists. The cookie is set by the HubSpot tracking script when it
 * loads on the site; if there's no tracking script (or the user blocks
 * cookies) this returns undefined and HubSpot still accepts the
 * submission, just without the prior-page-view attribution.
 */
export function readHubspotUtkCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

/**
 * Map a flat record of `{ <internal_name>: value }` to the array shape
 * HubSpot's Forms API expects, dropping any empty-string values so a
 * blank optional field doesn't overwrite an existing contact property
 * with empty data. Pure function.
 */
export function buildHubspotFields(
  record: Readonly<Record<string, string>>,
): readonly HubspotField[] {
  const out: HubspotField[] = [];
  for (const [name, value] of Object.entries(record)) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed.length === 0) continue;
    out.push({ name, value: trimmed });
  }
  return out;
}

/**
 * POST a submission to the HubSpot Forms API. Fire-and-forget at the
 * call site — caller should NOT `await` this in a way that blocks the
 * user's success state. Returns the HTTP status + parsed body so a
 * curious caller can log it for diagnostics, but never throws on a
 * non-2xx response (HubSpot returns rich JSON error bodies that we
 * surface for dev-console debugging without breaking the UX).
 */
export async function submitToHubspot(
  body: HubspotSubmitBody,
  options?: { portalId?: string; formId?: string; signal?: AbortSignal },
): Promise<{
  ok: boolean;
  status: number;
  body: unknown;
}> {
  const portalId = options?.portalId ?? HUBSPOT_PORTAL_ID;
  const formId = options?.formId ?? HUBSPOT_QUOTE_FORM_ID;
  const url = hubspotFormsEndpoint(portalId, formId);
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: options?.signal,
    });
    const json = (await resp.json().catch(() => ({}))) as unknown;
    return { ok: resp.ok, status: resp.status, body: json };
  } catch (err) {
    return { ok: false, status: 0, body: { error: String(err) } };
  }
}

export const ATTRIBUTION_STORAGE_KEY = "rhs_attribution_v1";
export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

const CAMPAIGN_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "partner_id", "ref"] as const;
type CampaignKey = (typeof CAMPAIGN_KEYS)[number];

export interface AttributionRecord {
  version: 1;
  expires_at: number;
  original_landing_page: string;
  first_touch_timestamp: string;
  first_touch_referrer?: string;
  first_touch: Partial<Record<CampaignKey, string>>;
  last_touch_timestamp: string;
  last_touch_referrer?: string;
  last_touch: Partial<Record<CampaignKey, string>>;
}

let memory: AttributionRecord | null = null;
const clean = (value: string | null) => (value ?? "").trim().slice(0, 1000) || undefined;

function externalReferrer(value: string | undefined, currentHost: string): string | undefined {
  if (!value) return undefined;
  try { const url = new URL(value); return url.hostname !== currentHost ? `${url.origin}${url.pathname}` : undefined; } catch { return undefined; }
}

function read(now = Date.now()): AttributionRecord | null {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) as AttributionRecord : memory;
    return parsed?.version === 1 && parsed.expires_at > now ? parsed : null;
  } catch { return memory?.expires_at && memory.expires_at > now ? memory : null; }
}

function write(value: AttributionRecord) {
  memory = value;
  try { localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(value)); } catch { /* memory fallback */ }
}

export function captureAttribution(href?: string, referrer?: string, now = new Date()): AttributionRecord | null {
  if (typeof window === "undefined") return null;
  let url: URL;
  try { url = new URL(href ?? window.location.href, window.location.origin); } catch { return read(now.getTime()); }
  const campaign: Partial<Record<CampaignKey, string>> = {};
  for (const key of CAMPAIGN_KEYS) { const value = clean(url.searchParams.get(key)); if (value) campaign[key] = value; }
  const external = externalReferrer(referrer ?? document.referrer, url.hostname);
  const prior = read(now.getTime());
  const hasNewCampaignValue = Object.entries(campaign).some(
    ([key, value]) => prior?.last_touch[key as CampaignKey] !== value,
  );
  const newExternalReferrer =
    external &&
    external !== prior?.first_touch_referrer &&
    external !== prior?.last_touch_referrer
      ? external
      : undefined;
  const meaningful = hasNewCampaignValue || Boolean(newExternalReferrer);
  const timestamp = now.toISOString();
  const safeLandingParams = new URLSearchParams();
  for (const key of CAMPAIGN_KEYS) {
    if (campaign[key]) safeLandingParams.set(key, campaign[key]);
  }
  const landing = `${url.pathname}${safeLandingParams.size ? `?${safeLandingParams}` : ""}`;
  const record: AttributionRecord = prior ? {
    ...prior,
    ...(meaningful ? { last_touch_timestamp: timestamp, last_touch_referrer: newExternalReferrer ?? prior.last_touch_referrer, last_touch: { ...prior.last_touch, ...campaign } } : {}),
  } : {
    version: 1,
    expires_at: now.getTime() + ATTRIBUTION_TTL_MS,
    original_landing_page: landing,
    first_touch_timestamp: timestamp,
    first_touch_referrer: external,
    first_touch: campaign,
    last_touch_timestamp: timestamp,
    last_touch_referrer: external,
    last_touch: campaign,
  };
  write(record); return record;
}

export function classifyLeadSource(record: AttributionRecord | null): "Google Ads" | "Sales Referral" | "Organic Search" | "Direct/Unknown" {
  const a = record?.last_touch ?? {};
  const source = a.utm_source?.toLowerCase(); const medium = a.utm_medium?.toLowerCase();
  if (a.gclid || a.gbraid || a.wbraid || (source === "google" && ["cpc", "ppc", "paid", "paidsearch"].includes(medium ?? ""))) return "Google Ads";
  if (a.partner_id || a.ref || medium === "referral") return "Sales Referral";
  const ref = record?.last_touch_referrer ?? record?.first_touch_referrer ?? "";
  if (medium === "organic" || /google\.|bing\.|yahoo\.|duckduckgo\./i.test(ref)) return "Organic Search";
  return "Direct/Unknown";
}

export function createClientSubmissionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `rhs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
}

export function buildAttributionSubmission() {
  const record = read() ?? captureAttribution();
  const first = record?.first_touch ?? {}; const last = record?.last_touch ?? {};
  const fields: Record<string, string> = {
    client_submission_id: createClientSubmissionId(),
    lead_source: classifyLeadSource(record),
    gclid: last.gclid ?? first.gclid ?? "", gbraid: last.gbraid ?? first.gbraid ?? "", wbraid: last.wbraid ?? first.wbraid ?? "",
    utm_source: last.utm_source ?? "", utm_medium: last.utm_medium ?? "", utm_campaign: last.utm_campaign ?? "", utm_term: last.utm_term ?? "", utm_content: last.utm_content ?? "",
    first_touch_source: first.utm_source ?? "", first_touch_medium: first.utm_medium ?? "", first_touch_campaign: first.utm_campaign ?? "", first_touch_term: first.utm_term ?? "", first_touch_content: first.utm_content ?? "",
    first_touch_referrer: record?.first_touch_referrer ?? "", original_landing_page: record?.original_landing_page ?? "", first_touch_timestamp: record?.first_touch_timestamp ?? "",
    last_touch_source: last.utm_source ?? "", last_touch_medium: last.utm_medium ?? "", last_touch_campaign: last.utm_campaign ?? "", last_touch_term: last.utm_term ?? "", last_touch_content: last.utm_content ?? "",
    last_touch_referrer: record?.last_touch_referrer ?? "", last_touch_timestamp: record?.last_touch_timestamp ?? "",
    submission_page: typeof window !== "undefined" ? window.location.pathname : "",
    partner_id: last.partner_id ?? first.partner_id ?? "", ref: last.ref ?? first.ref ?? "",
  };
  return { clientSubmissionId: fields.client_submission_id, leadSource: fields.lead_source, fields: Object.fromEntries(Object.entries(fields).filter(([, value]) => value)) };
}

export function resetAttributionForTests() { memory = null; try { localStorage.removeItem(ATTRIBUTION_STORAGE_KEY); } catch { /* no-op */ } }

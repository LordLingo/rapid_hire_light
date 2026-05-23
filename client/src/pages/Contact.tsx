/*
  Editorial Calm — Contact page
  Layout:
   - PageHero with eyebrow "Contact" and italic accent on "talk".
   - Two-column form region: left rail (contact details + trust line),
     right column (form). Inputs use hairline underlines (no boxy fields)
     to stay editorial. Submit shows a sonner toast (preview-only).
   - Closing strip with FAQ shortcut back to home.
*/
import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { ArrowUpRight, Mail, Phone, MapPin, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { ContactCallCard } from "@/components/heroes/HeroCards";
import HeroMiniStats from "@/components/heroes/HeroMiniStats";
// §134: shared field-level validation — surfaces inline red borders
// (.form-field--invalid) and short helper text per field instead of
// relying on a single page-level toast for missing data.
import {
  validateFields,
  hasErrors,
  clearFieldError,
  type FieldErrors,
} from "@/lib/formValidation";
import { SHRM_UTM_KEY } from "@/lib/shrm";
import { getShrmSlot, formatShrmSlot } from "@/lib/shrmSlots";
// §159 — Formspree endpoint centralized in @/lib/formspree so all
// quote/contact forms post to the same mvzyoyoz inbox and cannot drift.
import { FORMSPREE_ENDPOINT } from "@/lib/formspree";

/*
  §140.3 — UTM attribution helper.

  Reads any UTM params previously captured into sessionStorage by
  /shrm (Shrm.tsx#captureUtmParams) and returns them as a flat
  Record<string, string>. Returns an empty object if storage is
  blocked, the entry is missing, or the entry is malformed.

  Exported as a named function-style constant so the vitest spec can
  import and exercise it without rendering the React tree.
*/
export function readShrmUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(SHRM_UTM_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "string" && v.length > 0) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/*
  §140.3 — Build a one-line attribution footer from a UTM map.
  Returns an empty string when the map is empty so call sites can
  conditionally append. Keys are emitted in a stable canonical order
  so the spec can pin the exact string.
*/
export function formatUtmAttribution(
  utm: Record<string, string>,
): string {
  const ORDER = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  const parts: string[] = [];
  for (const k of ORDER) {
    const v = utm[k];
    if (typeof v === "string" && v.length > 0) {
      parts.push(`${k}=${v}`);
    }
  }
  if (parts.length === 0) return "";
  return `\n\n— via ${parts.join(", ")}`;
}

/**
 * Service-interest options shown as toggle chips on the Contact form.
 * Submitted to Formspree as the `services` field (comma-joined). Renamed
 * "Employment Screening" → "Employment Verifications" per §105.
 *
 * §159 — The previous local literal (xnjrqler) was replaced by the
 * shared @/lib/formspree endpoint so every form posts to mvzyoyoz.
 */

const SERVICES = [
  "Employment Verifications",
  "Criminal Records",
  "Drug & Health",
  "Education Verification",
  "Motor Vehicle Reports",
  "Social Media Checks",
];

const TEAM_SIZES = [
  "1 — 10",
  "11 — 50",
  "51 — 200",
  "201 — 1,000",
  "1,000+",
];

/** Map monthly hires (from calculator) to the closest annual TEAM_SIZES bucket. */
function monthlyHiresToTeamSize(monthly: number): string {
  const yearly = monthly * 12;
  if (yearly <= 10) return "1 — 10";
  if (yearly <= 50) return "11 — 50";
  if (yearly <= 200) return "51 — 200";
  if (yearly <= 1000) return "201 — 1,000";
  return "1,000+";
}

/** Map calculator addon ids to friendly Service chip labels used here. */
const ADDON_TO_SERVICE: Record<string, string> = {
  county: "Criminal Records",
  federal: "Criminal Records",
  mvr: "Motor Vehicle Reports",
  drug5: "Drug & Health",
  education: "Education Verification",
  employment: "Employment Verifications",
  social: "Social Media Checks",
};

export default function Contact() {
  const search = useSearch();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const prefillNote = params.get("note") ?? "";
  const prefillVolumeRaw = params.get("volume");
  const prefillVolume = prefillVolumeRaw ? Number(prefillVolumeRaw) : NaN;
  const prefillTeamSize = Number.isFinite(prefillVolume) && prefillVolume > 0
    ? monthlyHiresToTeamSize(prefillVolume)
    : "";
  const prefillServiceIds = (params.get("services") ?? "")
    .split(",")
    .filter(Boolean);
  const prefillInterests = Array.from(
    new Set(
      prefillServiceIds
        .map((id) => ADDON_TO_SERVICE[id])
        .filter((s): s is string => Boolean(s)),
    ),
  );
  const cameFromCalculator = Boolean(prefillNote || prefillVolumeRaw || prefillServiceIds.length);

  /*
    §140.2 — SHRM 2026 attribution. /shrm CTAs build their /contact
    URL via buildShrmContactUrl(), which sets `subject=SHRM 2026 —
    request meeting&source=shrm-2026`. We read those here so the
    contact form can render a "from SHRM 2026" eyebrow and so the
    Formspree _subject reflects the SHRM funnel rather than a generic
    contact request.
  */
  const prefillSubject = params.get("subject") ?? "";
  const prefillSource = params.get("source") ?? "";
  const cameFromShrm = prefillSource === "shrm-2026";

  /*
    §148 — SHRM booking-picker slot. /shrm CTAs may pass
    `?slot=mon-0930` after the user picks a specific 15-minute block.
    We look the id up in the static catalog so we can render the full
    "Mon Jun 22, 9:30 – 9:45 am ET" string in the prefilled message,
    success card, and Formspree payload. Stale/unknown ids resolve to
    undefined and fall back to the generic SHRM prefill copy.
  */
  const prefillSlotId = params.get("slot") ?? "";
  const prefillSlot = useMemo(
    () => getShrmSlot(prefillSlotId || null),
    [prefillSlotId],
  );
  const prefillSlotLabel = prefillSlot ? formatShrmSlot(prefillSlot) : "";

  /*
    §140.3 — SHRM UTM attribution. Hydrate any UTM params previously
    captured on /shrm into local state so the message body can include
    a one-line attribution footer ("— via utm_source=…, utm_medium=…")
    without the user having to type or paste it. The map is also sent
    as a top-level `utm` JSON string in the Formspree payload so
    structured downstream parsing is possible.

    Read once on mount so a mid-session sessionStorage clear doesn't
    cause the prefilled textarea to lurch.
  */
  const [shrmUtm] = useState<Record<string, string>>(() => readShrmUtm());
  const utmAttribution = useMemo(
    () => formatUtmAttribution(shrmUtm),
    [shrmUtm],
  );
  const prefillMessage = useMemo(() => {
    if (!prefillNote && !cameFromShrm && !utmAttribution) return prefillNote;
    let base = prefillNote;
    if (cameFromShrm && !base) {
      base = prefillSlot
        ? `Hi — I'd like to lock in the ${formatShrmSlot(prefillSlot)} slot at your SHRM 2026 booth (Booth 1619) for a 15-minute SPA Treatment.`
        : "Hi — I stopped by your booth at SHRM 2026 and would like to book a 15-minute SPA Treatment.";
    } else if (cameFromShrm && prefillSlot && !base.includes(formatShrmSlot(prefillSlot))) {
      base = `${base}\n\nRequested slot: ${formatShrmSlot(prefillSlot)} (Booth 1619).`;
    }
    return base + utmAttribution;
  }, [prefillNote, cameFromShrm, prefillSlot, utmAttribution]);

  const [interests, setInterests] = useState<string[]>(prefillInterests);
  const [submitted, setSubmitted] = useState(false);
  // §141.4 — keep the submitted company name around so the success
  // block can address the user by their organization ("… routed your
  // request for {company}…") instead of a generic message.
  const [submittedCompany, setSubmittedCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // §134: per-field inline errors. Keyed by `name` attribute so the
  // markup binding stays trivial. Cleared on input/change so users see
  // the red state vanish as they fix the field.
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Re-sync if user navigates between calculator quotes within the SPA.
  useEffect(() => {
    if (prefillInterests.length) setInterests(prefillInterests);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function toggle(v: string) {
    setInterests((cur) =>
      cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    // §134: client-side required + email validation. Runs BEFORE the
    // network call so users see field-level errors instantly without a
    // round-trip to Formspree (which would reject empty fields with a
    // generic message anyway).
    const values = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      teamSize: String(fd.get("teamSize") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const errs = validateFields(values, {
      requiredFields: ["name", "email", "company", "teamSize", "message"],
      emailFields: ["email"],
    });
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      // Focus the first invalid field so keyboard users land on what
      // they need to fix rather than scrolling back up themselves.
      const firstName = Object.keys(errs)[0];
      const firstEl = formEl.elements.namedItem(firstName) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      firstEl?.focus();
      return;
    }
    // §105 / §159: submit to the shared Formspree endpoint (mvzyoyoz, see
    // @/lib/formspree) using its JSON endpoint so we keep structured fields
    // (services as an array, etc). Formspree responds with { ok: true } on
    // success and surfaces validation errors via { errors }.
    const payload = {
      name: values.name,
      email: values.email,
      company: values.company,
      teamSize: values.teamSize,
      message: values.message,
      services: interests.join(", "),
      // §140.2 — if this submission came from a SHRM CTA, surface that
      // in the Formspree subject line so the user can immediately tell
      // SHRM-funnel leads apart from generic web traffic.
      _subject: cameFromShrm
        ? `SHRM 2026 — meeting request — ${values.company}`.trim()
        : `New contact request — ${values.company}`.trim(),
      // §140.2 — carry source through as a structured field so it can
      // be filtered server-side without scraping the subject line.
      ...(prefillSource ? { source: prefillSource } : {}),
      ...(prefillSubject ? { subject: prefillSubject } : {}),
      // §148 — if the visitor picked a specific slot via the SHRM
      // booking picker, carry the id + the human-readable label
      // through so the rep can confirm without parsing the message.
      ...(prefillSlot
        ? {
            shrmSlotId: prefillSlot.id,
            shrmSlot: formatShrmSlot(prefillSlot),
          }
        : {}),
      // §140.3 — attach UTM map as a JSON string. Empty map omitted to
      // keep submissions clean. Downstream consumers can JSON.parse() to
      // get the structured Record<string, string>.
      ...(Object.keys(shrmUtm).length > 0
        ? { utm: JSON.stringify(shrmUtm) }
        : {}),
    };
    setSubmitting(true);
    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await resp
        .json()
        .catch(() => ({}))) as { ok?: boolean; errors?: Array<{ message?: string }> };
      if (!resp.ok) {
        const msg =
          data?.errors?.[0]?.message ||
          `Submission failed (${resp.status}). Please try again.`;
        setError(msg);
        toast.error(msg);
        return;
      }
      setSubmittedCompany(values.company);
      setSubmitted(true);
      toast.success(
        cameFromShrm
          ? "Booth queue confirmed — we'll email your meeting slot the same business day."
          : "Request received — we'll be in touch the same business day.",
      );
    } catch {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow={cameFromCalculator ? "03 — Contact · from your estimate" : "03 — Contact"}
        title={
          <>
            Let&apos;s{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              talk
            </span>{" "}
            screening.
          </>
        }
        lede="Tell us about your hiring volume and the roles you screen for. Our U.S.-based, FCRA-certified team will respond the same business day with a tailored package."
        visual={<ContactCallCard />}
        belowVisual={<HeroMiniStats page="contact" />}
      />

      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-12">
            {/* Left rail */}
            <aside className="col-span-12 lg:col-span-4 reveal-on-scroll">
              <p className="eyebrow">04 — Reach us directly</p>
              <div className="mt-3 hairline" />

              <ul className="mt-8 space-y-6">
                <li className="flex items-start gap-3">
                  <span className="grid place-items-center size-9 rounded-full border border-border text-[color:var(--color-accent-ink)] shrink-0">
                    <Mail className="size-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Email
                    </p>
                    <p className="mt-1 text-[15px] text-[color:var(--color-ink)]">
                      <a className="ink-link" href="mailto:sales@rapidhiresolutions.com">
                        sales@rapidhiresolutions.com
                      </a>
                    </p>
                    <p className="mt-0.5 text-[13px] text-[color:var(--color-ink-muted)]">
                      Quotes & new accounts
                    </p>
                    <p className="mt-2 text-[15px] text-[color:var(--color-ink)]">
                      <a className="ink-link" href="mailto:info@rapidhiresolutions.com">
                        info@rapidhiresolutions.com
                      </a>
                    </p>
                    <p className="mt-0.5 text-[13px] text-[color:var(--color-ink-muted)]">
                      Existing accounts & general
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid place-items-center size-9 rounded-full border border-border text-[color:var(--color-accent-ink)] shrink-0">
                    <Phone className="size-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Phone
                    </p>
                    <p className="mt-1 text-[15px] text-[color:var(--color-ink)]">
                      <a className="ink-link" href="tel:+18884453047">
                        (888) 445-3047
                      </a>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid place-items-center size-9 rounded-full border border-border text-[color:var(--color-accent-ink)] shrink-0">
                    <MapPin className="size-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Headquarters
                    </p>
                    <p className="mt-1 text-[15px] leading-[1.55] text-[color:var(--color-ink)]">
                      4261 E University Dr
                      <br />
                      Prosper, TX 75078 · United States
                    </p>
                  </div>
                </li>
              </ul>

              <div className="hover-lift-card mt-12 rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6">
                <p className="eyebrow">Why teams reach out</p>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  We respond the same business day, share a sample report,
                  and never put you in a queue. FCRA-certified, U.S.-based,
                  built for high-volume hiring.
                </p>
              </div>
            </aside>

            {/* Form */}
            <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
              {submitted ? (
                <ContactSuccess
                  company={submittedCompany}
                  fromShrm={cameFromShrm}
                  shrmSlotLabel={prefillSlotLabel || null}
                />
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="grid gap-10"
                  noValidate
                  onChange={(e) => {
                    // §134: as soon as a user edits a field that had an
                    // error, clear that error so the red state isn't sticky.
                    const target = e.target as
                      | HTMLInputElement
                      | HTMLTextAreaElement
                      | HTMLSelectElement;
                    if (target?.name && fieldErrors[target.name]) {
                      setFieldErrors((cur) => clearFieldError(cur, target.name));
                    }
                  }}
                >
                  <div className="grid grid-cols-12 gap-x-8 gap-y-8">
                    <Field
                      label="Full name"
                      name="name"
                      required
                      autoComplete="name"
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.name}
                    />
                    <Field
                      label="Work email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.email}
                    />
                    <Field
                      label="Company"
                      name="company"
                      required
                      autoComplete="organization"
                      className="col-span-12 md:col-span-6"
                      error={fieldErrors.company}
                    />
                    <div className="col-span-12 md:col-span-6">
                      <label
                        htmlFor="contact-teamSize"
                        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                      >
                        Hiring volume
                      </label>
                      <select
                        id="contact-teamSize"
                        name="teamSize"
                        defaultValue={prefillTeamSize}
                        required
                        aria-invalid={fieldErrors.teamSize ? "true" : undefined}
                        aria-describedby={
                          fieldErrors.teamSize ? "contact-teamSize-error" : undefined
                        }
                        className={[
                          "form-field",
                          fieldErrors.teamSize ? "form-field--invalid" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <option value="" disabled>
                          Select a range —
                        </option>
                        {TEAM_SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s} hires / year
                          </option>
                        ))}
                      </select>
                      {fieldErrors.teamSize && (
                        <p
                          id="contact-teamSize-error"
                          role="alert"
                          className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
                        >
                          {fieldErrors.teamSize}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Services you&apos;re interested in
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {SERVICES.map((s) => {
                        const active = interests.includes(s);
                        return (
                          <button
                            type="button"
                            key={s}
                            onClick={() => toggle(s)}
                            className={[
                              "btn-press text-[13px] rounded-full border px-4 py-2 transition-colors",
                              active
                                ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                                : "border-border bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]",
                            ].join(" ")}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                    >
                      Tell us about your hiring
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      defaultValue={prefillMessage}
                      placeholder="Roles, jurisdictions, ATS in use, anything else we should know."
                      aria-invalid={fieldErrors.message ? "true" : undefined}
                      aria-describedby={
                        fieldErrors.message ? "contact-message-error" : undefined
                      }
                      className={[
                        "form-field",
                        fieldErrors.message ? "form-field--invalid" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                    {fieldErrors.message && (
                      <p
                        id="contact-message-error"
                        role="alert"
                        className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
                      >
                        {fieldErrors.message}
                      </p>
                    )}
                    {cameFromCalculator && (
                      <p className="mt-3 text-[12px] text-[color:var(--color-ink-muted)]">
                        Pre-filled from your pricing estimate. Edit anything before sending.
                      </p>
                    )}
                    {cameFromShrm && (
                      <p
                        data-testid="contact-shrm-attribution-note"
                        className="mt-3 text-[12px] text-[color:var(--color-ink-muted)]"
                      >
                        Routed from SHRM 2026. We'll prioritize this in our
                        booth queue — edit anything before sending.
                      </p>
                    )}
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="text-[13px] text-red-600 -mt-4"
                    >
                      {error}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-[12px] text-[color:var(--color-ink-muted)] max-w-md">
                      By submitting, you agree to be contacted about Rapid
                      Hire Solutions services. We never share your details.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          Sending
                          <Loader2 className="size-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Send request
                          <ArrowUpRight className="size-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

/* --------------------------------------------------------------------------
   §141 — ContactSuccess

   The animated success state we swap in once a submission completes.
   This component is intentionally co-located in Contact.tsx (rather
   than promoted to its own file) because:
     - the SHRM branch and the calculator branch share the same data
       (cameFromShrm, submittedCompany) that already lives in the
       parent's render scope, and
     - the success block is a single render path — there is no other
       page that needs to reuse it.

   Animation choreography lives entirely in `client/src/index.css`
   under the `.contact-success-*` selectors. This component just
   stamps the markup and the `--contact-success-delay` custom
   properties that orchestrate the staggered fade-up.

   Stable testids exposed to vitest:
     - contact-success                        (root)
     - contact-success-icon                   (the animated icon container)
     - contact-success-icon-halo              (the soft halo span)
     - contact-success-check                  (the SVG element)
     - contact-success-title                  (h3)
     - contact-success-message                (p)
     - contact-success-timeline               (ol)
     - contact-success-timeline-item          (each li)
     - contact-success-actions                (footer actions wrapper)
     - contact-success-cta-home               (primary back-to-home link)
     - contact-success-cta-calendar           (SHRM-only "Add to Calendar")
     - contact-success-cta-sample             (non-SHRM "View sample report")
-------------------------------------------------------------------------- */
function ContactSuccess({
  company,
  fromShrm,
  shrmSlotLabel,
}: {
  company: string;
  fromShrm: boolean;
  shrmSlotLabel: string | null;
}) {
  // §141.4 — personalize the lede when we have a company name. We
  // intentionally fall back to neutral phrasing when company is empty
  // so the success state never reads like "… for .".
  const trimmedCompany = company.trim();
  const personalized = trimmedCompany.length > 0;

  // §141.3 — SHRM branch headline + lede.
  const title = fromShrm ? "Booth queue confirmed." : "Request received.";
  const slotPhrase = fromShrm && shrmSlotLabel ? ` for ${shrmSlotLabel} at Booth 1619` : "";
  const lede = fromShrm
    ? personalized
      ? `We've routed ${trimmedCompany} into the SHRM 2026 booth queue${slotPhrase}. Expect a confirmation email the same business day with your 15-minute SPA Treatment slot.`
      : `We've routed your meeting request into the SHRM 2026 booth queue${slotPhrase}. Expect a confirmation email the same business day with your 15-minute SPA Treatment slot.`
    : personalized
      ? `A specialist is preparing a tailored screening package for ${trimmedCompany} and will follow up the same business day with pricing.`
      : "A specialist will follow up the same business day with a tailored screening package and pricing.";

  // §141.5 — "What's next" three-step mini-timeline. Pure visual,
  // no logic. The SHRM branch reflects the booth flow; the default
  // branch reflects the standard intro flow.
  const timeline: Array<{ id: string; label: string; detail: string }> = fromShrm
    ? [
        {
          id: "reply",
          label: "Same-day reply",
          detail: "A U.S.-based, FCRA-certified rep emails your meeting slot.",
        },
        {
          id: "booth",
          label: "15-min SPA Treatment",
          detail: "Quick booth visit — we tailor a package to your hiring volume.",
        },
        {
          id: "sample",
          label: "Sample report",
          detail: "You leave with a real sample report and written quote.",
        },
      ]
    : [
        {
          id: "reply",
          label: "Same-day reply",
          detail: "A U.S.-based, FCRA-certified rep reviews your request.",
        },
        {
          id: "call",
          label: "15-min intro call",
          detail: "We learn the roles, jurisdictions, and ATS you're using.",
        },
        {
          id: "quote",
          label: "Sample report + quote",
          detail: "You receive a tailored package, sample report, and pricing.",
        },
      ];

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="contact-success"
      data-from-shrm={fromShrm ? "true" : "false"}
      className="rounded-[20px] border border-border bg-[color:var(--color-paper)] px-8 py-16 text-center"
    >
      {/* §141.2 — animated icon: pop + halo + stroke-drawn check */}
      <div
        data-testid="contact-success-icon"
        className="contact-success-icon"
      >
        <span
          aria-hidden
          data-testid="contact-success-icon-halo"
          className="sr-only"
        >
          {/* Visually hidden; the halo itself is rendered via the
              `.contact-success-icon::after` pseudo-element. This span
              exists only so a vitest static-analysis spec can verify
              the halo affordance is intentional. */}
          success halo
        </span>
        <svg
          data-testid="contact-success-check"
          className="contact-success-check"
          viewBox="0 0 24 24"
          aria-hidden
          focusable="false"
        >
          {/* Standard checkmark path; matches the lucide "Check" geometry
             so it reads as the same icon family as the rest of the site. */}
          <path d="M5 12.5 L10 17.5 L19 7.5" />
        </svg>
      </div>

      {/* §141.2 — staggered body. Each direct child opts in to the
          fade-up animation; we pace them with --contact-success-delay
          so they arrive after the icon settles. */}
      <div className="contact-success-body mt-8">
        <h3
          data-testid="contact-success-title"
          className="font-display text-[32px] leading-tight text-[color:var(--color-ink)]"
          style={{ "--contact-success-delay": "260ms" } as React.CSSProperties}
        >
          {title}
        </h3>
        <p
          data-testid="contact-success-message"
          className="mt-3 max-w-md mx-auto text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]"
          style={{ "--contact-success-delay": "320ms" } as React.CSSProperties}
        >
          {lede}
        </p>

        <ol
          data-testid="contact-success-timeline"
          className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3 sm:gap-4"
          style={{ "--contact-success-delay": "380ms" } as React.CSSProperties}
        >
          {timeline.map((step, i) => (
            <li
              key={step.id}
              data-testid="contact-success-timeline-item"
              className="rounded-[14px] border border-border bg-white px-4 py-3"
            >
              <p className="text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--color-accent-ink)]">
                Step {i + 1}
              </p>
              <p className="mt-1 text-[14px] font-medium text-[color:var(--color-ink)]">
                {step.label}
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.55] text-[color:var(--color-ink-muted)]">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>

        <div
          data-testid="contact-success-actions"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          style={{ "--contact-success-delay": "440ms" } as React.CSSProperties}
        >
          <Link
            href="/"
            data-testid="contact-success-cta-home"
            className="ink-link inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
          >
            Back to home
            <ArrowUpRight className="size-3.5" />
          </Link>
          {fromShrm ? (
            // §141.3 — SHRM-only Add-to-Calendar shortcut. Points at
            // the static .ics in `client/public` so it works without a
            // server round-trip. The file is generated under public/
            // and gives the user a calendar block they can drop into
            // their day at the conference.
            <a
              href="/shrm-2026.ics"
              data-testid="contact-success-cta-calendar"
              className="ink-link inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
            >
              Add SHRM 2026 to calendar
              <ArrowUpRight className="size-3.5" />
            </a>
          ) : (
            <Link
              href="/sample-report"
              data-testid="contact-success-cta-sample"
              className="ink-link inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
            >
              View sample report
              <ArrowUpRight className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  className,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  /** §134 — inline error message to surface beneath the field. */
  error?: string;
}) {
  const fieldId = `contact-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={["form-field", error ? "form-field--invalid" : ""]
          .filter(Boolean)
          .join(" ")}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

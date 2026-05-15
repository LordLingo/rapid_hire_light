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

const SERVICES = [
  "Employment Screening",
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
  employment: "Employment Screening",
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

  const [interests, setInterests] = useState<string[]>(prefillInterests);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const payload = {
      fullName: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      volume: String(fd.get("teamSize") ?? ""),
      message: String(fd.get("message") ?? ""),
      services: interests,
    };
    setSubmitting(true);
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await resp.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!resp.ok || !data?.ok) {
        const msg = data?.error || `Submission failed (${resp.status}). Please try again.`;
        setError(msg);
        toast.error(msg);
        return;
      }
      setSubmitted(true);
      toast.success("Request received — we'll be in touch the same business day.");
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
                <div className="rounded-[20px] border border-border bg-[color:var(--color-paper)] px-8 py-16 text-center">
                  <div className="mx-auto grid place-items-center size-12 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
                    <Check className="size-5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-6 font-display text-[32px] leading-tight text-[color:var(--color-ink)]">
                    Request received.
                  </h3>
                  <p className="mt-3 max-w-md mx-auto text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    A specialist will follow up the same business day with a
                    tailored screening package and pricing.
                  </p>
                  <Link
                    href="/"
                    className="ink-link mt-8 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
                  >
                    Back to home
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-10">
                  <div className="grid grid-cols-12 gap-x-8 gap-y-8">
                    <Field
                      label="Full name"
                      name="name"
                      required
                      autoComplete="name"
                      className="col-span-12 md:col-span-6"
                    />
                    <Field
                      label="Work email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="col-span-12 md:col-span-6"
                    />
                    <Field
                      label="Company"
                      name="company"
                      required
                      autoComplete="organization"
                      className="col-span-12 md:col-span-6"
                    />
                    <div className="col-span-12 md:col-span-6">
                      <label className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                        Hiring volume
                      </label>
                      <select
                        name="teamSize"
                        defaultValue={prefillTeamSize}
                        required
                        className="mt-2 w-full bg-transparent border-0 border-b border-[color:var(--color-rule)] py-2.5 text-[15px] text-[color:var(--color-ink)] focus:outline-none focus:border-[color:var(--color-accent-ink)] transition-colors"
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
                    <label className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      Tell us about your hiring
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      defaultValue={prefillNote}
                      placeholder="Roles, jurisdictions, ATS in use, anything else we should know."
                      className="mt-2 w-full bg-transparent border-0 border-b border-[color:var(--color-rule)] py-2.5 text-[15px] leading-[1.7] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] focus:outline-none focus:border-[color:var(--color-accent-ink)] transition-colors resize-none"
                    />
                    {cameFromCalculator && (
                      <p className="mt-3 text-[12px] text-[color:var(--color-ink-muted)]">
                        Pre-filled from your pricing estimate. Edit anything before sending.
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

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full bg-transparent border-0 border-b border-[color:var(--color-rule)] py-2.5 text-[15px] text-[color:var(--color-ink)] focus:outline-none focus:border-[color:var(--color-accent-ink)] transition-colors"
      />
    </div>
  );
}

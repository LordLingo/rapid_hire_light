/*
  Editorial Calm — Integrations / ATS page
  Layout:
   - PageHero with eyebrow "Integrations" and italic accent on "tools".
   - "How it works" 3-step horizontal flow (Connect → Trigger → Sync) using
     the same DiagramCard cadence as the homepage workflow.
   - The handshake editorial figure (§121/§123).
   - ATS / HRIS / Payroll grid: card per integration with category chip,
     short body, and "Docs" / "Request" inline link.
   - §160 — API Reference section: card-per-resource index of the Rapid
     Hire Solutions API v2, plus a Download PDF button (powered by
     @/lib/apiDocsPdf, which mirrors the same data model so the export
     can never drift from the on-screen surface).
   - §160 — Dedicated Integration Request form: a /#request-integration
     anchored block that POSTs to the shared Formspree endpoint with
     integration-specific fields (ATS name, who builds it, monthly
     volume) so submissions arrive tagged in the same inbox as quote
     and contact forms but stay easy to triage.
   - Closing CTA strip now scrolls to the in-page form (not /contact).
*/
import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileArchive,
  Loader2,
  Plug,
  RefreshCcw,
  Search,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { IntegrationsGrid } from "@/components/heroes/HeroCards";
import HeroMiniStats from "@/components/heroes/HeroMiniStats";
import integrationsData from "@shared/integrations.json";
import {
  API_ENDPOINT_TOTAL,
  API_OVERVIEW,
  API_RESOURCES,
} from "@/lib/apiReference";
import {
  buildApiDocsPdf,
  buildApiDocsPdfFilename,
  triggerApiDocsPdfDownload,
} from "@/lib/apiDocsPdf";
import {
  SNIPPET_LANGUAGES,
  buildSnippet,
  buildSnippetBundle,
  buildSnippetBundleFilename,
  buildSnippetFilename,
  triggerSnippetBundleDownload,
  triggerSnippetTextDownload,
  type SnippetLanguage,
} from "@/lib/apiSnippets";
import { searchApi } from "@/lib/apiSearch";
import { FORMSPREE_INTEGRATIONS_ENDPOINT } from "@/lib/formspree";
import {
  clearFieldError,
  hasErrors,
  validateFields,
  type FieldErrors,
} from "@/lib/formValidation";

type IntegrationCategory = "ATS" | "HRIS" | "Payroll" | "CRM";
type IntegrationStatus = "Live" | "Beta" | "Request";
type IntegrationItem = {
  name: string;
  mark: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  body: string;
};
const INTEGRATIONS: IntegrationItem[] = (
  integrationsData as { items: IntegrationItem[] }
).items;

const STEPS = [
  {
    icon: <Plug className="size-4" strokeWidth={1.5} />,
    number: "01",
    title: "Connect",
    body:
      "Two-way OAuth with your ATS / HRIS in under 5 minutes. No engineering tickets, no SFTP files.",
  },
  {
    icon: <Zap className="size-4" strokeWidth={1.5} />,
    number: "02",
    title: "Trigger",
    body:
      "Move a candidate to a stage and a screening package fires automatically — with the right disclosures attached.",
  },
  {
    icon: <RefreshCcw className="size-4" strokeWidth={1.5} />,
    number: "03",
    title: "Sync",
    body:
      "Status, completed reports, and adjudication decisions write back to your ATS in real time.",
  },
];

// §188 — "CRM" was retired from the canonical 33-partner list. Keeping it
// in this filter would render a chip with zero matches, so the filter row
// was narrowed to the three categories actually present on the cards.
const CATS = ["All", "ATS", "HRIS", "Payroll"] as const;

/** §160 — fixed-position option lists for the Integration Request form. */
export const INTEGRATION_DIRECTIONS = [
  "We build to your API",
  "You build to our API",
  "Joint build (paired engineering)",
  "Not sure yet — please advise",
] as const;

export const INTEGRATION_VOLUMES = [
  "Under 50 / month",
  "50–250 / month",
  "250–1,000 / month",
  "1,000–5,000 / month",
  "5,000+ / month",
] as const;

export const INTEGRATION_TIMELINES = [
  "Within 30 days",
  "30–60 days",
  "60–90 days",
  "Exploratory (90+ days)",
] as const;

export default function Integrations() {
  // §160 — Download PDF state. Mirrors the K-12 guide pattern.
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownloadPdf() {
    if (downloading) return;
    setDownloadError(null);
    setDownloading(true);
    try {
      const bytes = await buildApiDocsPdf();
      triggerApiDocsPdfDownload(bytes, buildApiDocsPdfFilename());
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : "Could not build PDF.",
      );
    } finally {
      setDownloading(false);
    }
  }

  // §162 — Snippet bundle state. The 'Download all snippets (ZIP)' button
  // gathers every endpoint × every language plus a README into a single
  // archive. Same defensive try/catch/loading pattern as the PDF handler so
  // a runtime failure surfaces inline rather than silently failing.
  const [buildingBundle, setBuildingBundle] = useState(false);
  const [bundleError, setBundleError] = useState<string | null>(null);

  function handleDownloadBundle() {
    if (buildingBundle) return;
    setBundleError(null);
    setBuildingBundle(true);
    try {
      const bytes = buildSnippetBundle();
      triggerSnippetBundleDownload({
        bytes,
        filename: buildSnippetBundleFilename(),
      });
    } catch (err) {
      setBundleError(
        err instanceof Error ? err.message : "Could not build snippet bundle.",
      );
    } finally {
      setBuildingBundle(false);
    }
  }

  // §162 — Per-snippet copy + language tab state. We keep this all at the
  // page level (rather than per-CodeBlock-instance) so the page can be
  // tested without mounting all 13 endpoint cards.
  const [activeLanguage, setActiveLanguage] =
    useState<SnippetLanguage>("curl");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // §163 — Search bar for the API documentation section. The raw input
  // is held in `apiQuery`; we debounce it into `apiSearchTerm` (180ms)
  // before computing the filter so each keystroke doesn't reflow every
  // resource card and snippet card. An empty term returns the full
  // unfiltered view (handled inside searchApi).
  const [apiQuery, setApiQuery] = useState("");
  const [apiSearchTerm, setApiSearchTerm] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setApiSearchTerm(apiQuery), 180);
    return () => window.clearTimeout(id);
  }, [apiQuery]);

  const apiSearchResult = searchApi(apiSearchTerm);
  const filteredResources = apiSearchResult.resources;
  const filteredEndpointRecords = apiSearchResult.endpoints;
  const apiSearchActive = !apiSearchResult.isEmpty;
  const noApiSearchMatches =
    apiSearchActive &&
    filteredResources.length === 0 &&
    filteredEndpointRecords.length === 0;

  async function handleCopySnippet(key: string, contents: string) {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(contents);
      }
      setCopiedKey(key);
      window.setTimeout(
        () =>
          setCopiedKey((current) => (current === key ? null : current)),
        1800,
      );
    } catch {
      // Clipboard write can fail silently in restricted contexts;
      // we don't surface this as an error toast — the partner can
      // still click 'Download' to get the bytes.
    }
  }

  // §160 — Integration Request form state. Posts to
  // FORMSPREE_INTEGRATIONS_ENDPOINT (xgoqzprv) per §161 — partner / ATS
  // integration requests route to a dedicated inbox so they don't dilute
  // the sales pipeline. Tagged with `_subject: "Integration request — {ATS}"`.
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleIntegrationSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const values = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      ats: String(fd.get("ats") ?? "").trim(),
      direction: String(fd.get("direction") ?? "").trim(),
      volume: String(fd.get("volume") ?? "").trim(),
    };
    const errs = validateFields(values, {
      requiredFields: ["name", "email", "company", "ats", "direction", "volume"],
      emailFields: ["email"],
    });
    if (hasErrors(errs)) {
      setFieldErrors(errs);
      const firstName = Object.keys(errs)[0];
      const firstEl = formEl.elements.namedItem(firstName) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null;
      if (firstEl) firstEl.focus();
      return;
    }
    setFieldErrors({});
    const payload: Record<string, string> = {
      name: values.name,
      email: values.email,
      company: values.company,
      role: String(fd.get("role") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      ats: values.ats,
      ats_version: String(fd.get("ats_version") ?? "").trim(),
      direction: values.direction,
      volume: values.volume,
      timeline: String(fd.get("timeline") ?? "").trim(),
      api_docs_link: String(fd.get("api_docs_link") ?? "").trim(),
      notes: String(fd.get("notes") ?? "").trim(),
      _subject: `Integration request — ${values.ats}`,
      _source: "Integrations page · /integrations#request-integration",
    };
    setSubmitting(true);
    try {
      const resp = await fetch(FORMSPREE_INTEGRATIONS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        errors?: { message?: string }[];
      };
      if (!resp.ok) {
        const msg =
          data?.errors?.[0]?.message ??
          "Something went wrong. Please try again.";
        setSubmitError(msg);
        return;
      }
      setSubmitted(true);
      formEl.reset();
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function clearFieldOnChange(name: string) {
    return () => {
      if (fieldErrors[name]) {
        setFieldErrors((prev) => clearFieldError(prev, name));
      }
    };
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="02 — Integrations"
        belowEyebrow={
          <div
            data-testid="integrations-hero-image"
            className="hover-zoom-image mt-6 aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-[0_1px_2px_rgba(16,42,75,0.08),0_8px_24px_-12px_rgba(16,42,75,0.18)]"
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/integrations-portrait-XH6BidmDFbRqVY2bnuYWAp.webp"
              alt="Tall editorial illustration in cream and navy with soft sage accents. At the top, a stylized ATS / HRIS dashboard window shows three candidate rows with avatars and small status pills. A graceful navy arrow flows downward into two interlocking circular link rings at the center, with a small sage-green check pip at their intersection — representing the secure handshake between Rapid Hire and the customer system. A second navy arrow flows from the rings down into a background-check report card at the bottom, showing four icon-led rows (identity, criminal records, employment, education) and a small sage shield-with-check badge in the upper-right corner."
              width={1056}
              height={1408}
              loading="lazy"
              decoding="async"
              className="block h-full w-full rounded-xl object-cover"
            />
          </div>
        }
        title={
          <>
            Plug Rapid Hire into the{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              tools you already use.
            </span>
          </>
        }
        lede="From day-one ATS triggers to writing adjudication decisions back into your HRIS, our integrations turn the screening step from a manual hand-off into a quiet background process."
        visual={<IntegrationsGrid />}
        belowVisual={<HeroMiniStats page="integrations" />}
      />

      {/* How it works */}
      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — How integrations work</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[32px] md:text-[48px] leading-[1.05] tracking-[-0.025em] text-[color:var(--color-ink)] max-w-3xl">
                Three steps. Then it{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  runs itself.
                </span>
              </h2>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-6 reveal-on-scroll">
            {STEPS.map((s) => (
              <div
                key={s.number}
                data-testid={`integrations-step-${s.number}`}
                className="group hover-lift-card hover-lift-card-strong col-span-12 md:col-span-4 rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6 md:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center size-8 rounded-full border border-border text-[color:var(--color-accent-ink)] bg-white transition-colors duration-300 ease-out group-hover:bg-[color:var(--color-tint)] group-hover:border-[color:var(--color-accent-halo)]">
                    {s.icon}
                  </span>
                  <span className="eyebrow">{s.number} · Step</span>
                </div>
                <h3 className="mt-4 font-display text-[22px] leading-tight text-[color:var(--color-ink)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §123 — handshake editorial figure */}
      <section className="bg-[color:var(--color-paper-soft)] border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-start">
            <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
              <p className="eyebrow">04 — The handshake</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-6 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                One picture of the whole{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  data flow.
                </span>
              </h2>
              <p className="mt-5 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                ATS/HRIS on one side, our screening engine on the other,
                with a secure handshake in the middle. The candidate is
                added once in your system of record, and the rest — identity,
                criminal records, employment, and education verification —
                rides through the integration without manual re-entry.
              </p>
              <p className="mt-3 text-[12.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                SOC 2 Type II · GDPR-aligned · end-to-end encrypted in transit
                and at rest.
              </p>
            </div>
            <div
              data-testid="integrations-handshake-figure"
              className="col-span-12 lg:col-span-8 reveal-on-scroll"
            >
              <figure className="mx-auto max-w-[560px] overflow-hidden rounded-[20px] border border-border bg-[color:var(--color-paper)] p-3 shadow-[0_1px_2px_rgba(16,42,75,0.08),0_12px_32px_-16px_rgba(16,42,75,0.22)]">
                <img
                  src="/static/integrations-infographic.webp"
                  alt="Vertical infographic showing how Rapid Hire integrates with ATS and HRIS systems: candidate hire → secure data sync → background check software running identity verification, criminal records, employment verification, and education verification, with status updates flowing back into the ATS/HRIS, ending in saved time, reduced risk, improved efficiency, and a better candidate experience. Footer notes SOC 2 Type II, GDPR compliance, and end-to-end encryption."
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-[14px]"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations grid */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Available today</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.025em] text-[color:var(--color-ink)]">
                Native integrations across{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  every category.
                </span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {CATS.map((c) => (
                  <span
                    key={c}
                    className="text-[11.5px] tracking-wide uppercase rounded-full border border-border bg-white px-3 py-1.5 text-[color:var(--color-ink-muted)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-6">
            {INTEGRATIONS.map((it, i) => (
              <article
                key={it.name}
                className={[
                  "hover-lift-card reveal-on-scroll group rounded-[16px] border border-border bg-white p-6",
                  i % 6 === 0
                    ? "col-span-12 md:col-span-6 lg:col-span-4"
                    : "col-span-12 md:col-span-6 lg:col-span-4",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center size-9 rounded-full border border-border text-[color:var(--color-accent-ink)] font-display text-[15px]">
                      {it.name.charAt(0)}
                    </div>
                    <span className="eyebrow text-[10px]">{it.category}</span>
                  </div>
                  <span
                    className={[
                      "text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full border",
                      it.status === "Live"
                        ? "border-[color:var(--color-accent-ink)]/25 text-[color:var(--color-accent-ink)] bg-[color:var(--color-tint)]"
                        : it.status === "Beta"
                        ? "border-border text-[color:var(--color-ink-muted)] bg-[color:var(--color-paper)]"
                        : "border-border text-[color:var(--color-ink-muted)] bg-white",
                    ].join(" ")}
                  >
                    {it.status}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[22px] leading-tight text-[color:var(--color-ink)]">
                  {it.name}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {it.body}
                </p>
                <a
                  href="#request-integration"
                  className="ink-link mt-5 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]"
                >
                  {it.status === "Request" ? "Request access" : "Talk to sales"}
                  <ArrowUpRight className="size-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* §160 — API REFERENCE */}
      <section
        id="api-reference"
        data-testid="integrations-api-reference"
        className="bg-white border-y border-border"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">06 — Developer reference</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.025em] text-[color:var(--color-ink)]">
                Build straight to our{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  REST API.
                </span>
              </h2>
              <p className="mt-5 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)] max-w-xl">
                {API_OVERVIEW.summary}{" "}
                Authentication is HTTP Basic; transport is HTTPS only.
                Every resource below links to the same source of truth
                used by the downloadable PDF reference.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll flex flex-col items-stretch gap-3 lg:items-end">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloading}
                data-testid="api-docs-download-btn"
                className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-5 py-3 text-[13.5px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] disabled:opacity-60"
              >
                {downloading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Building your PDF…
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    Download API documentation
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadBundle}
                disabled={buildingBundle}
                data-testid="api-snippets-bundle-download-btn"
                className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-accent-ink)]/30 bg-white px-5 py-3 text-[13.5px] font-medium text-[color:var(--color-accent-ink)] hover:bg-[color:var(--color-tint)] disabled:opacity-60"
              >
                {buildingBundle ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Packaging snippets…
                  </>
                ) : (
                  <>
                    <FileArchive className="size-4" />
                    Download all snippets (ZIP)
                  </>
                )}
              </button>
              {downloadError ? (
                <p
                  role="alert"
                  data-testid="api-docs-download-error"
                  className="text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
                >
                  {downloadError}
                </p>
              ) : null}
              {bundleError ? (
                <p
                  role="alert"
                  data-testid="api-snippets-bundle-download-error"
                  className="text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
                >
                  {bundleError}
                </p>
              ) : null}
            </div>
          </div>

          <div
            data-testid="api-overview-band"
            className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-[16px] border border-border bg-border"
          >
            {(
              [
                ["Version", API_OVERVIEW.version],
                ["Resources", String(API_RESOURCES.length)],
                ["Endpoints", String(API_ENDPOINT_TOTAL)],
                ["Auth", "HTTP Basic"],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="bg-white p-5">
                <p className="eyebrow text-[10.5px]">{label}</p>
                <p className="mt-2 font-display text-[24px] leading-none text-[color:var(--color-ink)]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* §163 — Search bar. Filters BOTH the resource cards grid
              below and the code-snippets cards in 06.b. Debounced 180ms;
              Esc clears; raw input mirrors what the partner typed so the
              UI stays responsive between debounce ticks. */}
          <div className="mt-12">
            <label
              htmlFor="api-doc-search"
              className="sr-only"
            >
              Search API documentation
            </label>
            <div
              data-testid="api-doc-search-shell"
              className="relative flex items-center rounded-full border border-border bg-white shadow-[0_1px_2px_rgba(16,42,75,0.04)] focus-within:border-[color:var(--color-accent-ink)] focus-within:ring-2 focus-within:ring-[color:var(--color-accent-ink)]/20 transition-colors"
            >
              <Search
                className="absolute left-4 size-4 text-[color:var(--color-ink-soft)] pointer-events-none"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <input
                id="api-doc-search"
                type="search"
                role="searchbox"
                inputMode="search"
                autoComplete="off"
                spellCheck="false"
                placeholder="Search endpoints, resources, or code (e.g. 'POST orders' or 'Authorization')…"
                aria-label="Search the API documentation"
                data-testid="api-doc-search"
                value={apiQuery}
                onChange={(e) => setApiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault();
                    setApiQuery("");
                    setApiSearchTerm("");
                  }
                }}
                className="flex-1 bg-transparent border-0 outline-none rounded-full pl-11 pr-12 py-3 text-[14px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)]"
              />
              {apiQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setApiQuery("");
                    setApiSearchTerm("");
                  }}
                  data-testid="api-doc-search-clear"
                  aria-label="Clear API search"
                  className="btn-press absolute right-3 inline-flex items-center justify-center size-7 rounded-full text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-soft)] hover:text-[color:var(--color-ink)]"
                >
                  <X className="size-4" strokeWidth={1.75} />
                </button>
              ) : null}
            </div>
            {apiSearchActive ? (
              <p
                data-testid="api-doc-search-summary"
                className="mt-3 text-[12.5px] text-[color:var(--color-ink-soft)]"
                aria-live="polite"
              >
                {filteredResources.length} resource
                {filteredResources.length === 1 ? "" : "s"} ·{" "}
                {filteredEndpointRecords.length} endpoint
                {filteredEndpointRecords.length === 1 ? "" : "s"}
                {" "}match “{apiSearchTerm}”
              </p>
            ) : null}
          </div>

          {noApiSearchMatches ? (
            <div
              data-testid="api-doc-search-empty"
              role="status"
              className="mt-12 rounded-[16px] border border-dashed border-border bg-[color:var(--color-paper-soft)] p-10 text-center"
            >
              <Search
                className="mx-auto size-7 text-[color:var(--color-ink-soft)]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="mt-3 font-display text-[18px] text-[color:var(--color-ink)]">
                No matches for “{apiSearchTerm}”
              </h3>
              <p className="mt-2 text-[13px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Try a verb (GET, POST), a resource name (Orders, Branches),
                or a snippet keyword (Authorization, fetch, requests).
              </p>
              <button
                type="button"
                onClick={() => {
                  setApiQuery("");
                  setApiSearchTerm("");
                }}
                className="btn-press mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-[12.5px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper)]"
              >
                <X className="size-3.5" strokeWidth={1.75} />
                Clear search
              </button>
            </div>
          ) : null}

          <div
            data-testid="api-resources-grid"
            className={`mt-12 grid grid-cols-12 gap-6 ${noApiSearchMatches ? "hidden" : ""}`}
          >
            {filteredResources.map((r) => (
              <article
                key={r.slug}
                data-testid={`api-resource-${r.slug}`}
                className="hover-lift-card reveal-on-scroll col-span-12 md:col-span-6 lg:col-span-4 rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow text-[10px]">{r.slug}</span>
                  <span className="text-[10.5px] uppercase tracking-wider px-2 py-1 rounded-full border border-[color:var(--color-accent-ink)]/25 text-[color:var(--color-accent-ink)] bg-[color:var(--color-tint)]">
                    {r.endpoints.length} endpoint
                    {r.endpoints.length === 1 ? "" : "s"}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
                  {r.name}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {r.shortDescription}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {r.endpoints.map((ep) => (
                    <li
                      key={`${ep.verb} ${ep.path}`}
                      className="flex items-center gap-2 text-[12.5px]"
                    >
                      <span className="font-mono font-semibold uppercase tracking-wider text-[11px] rounded-full border border-[color:var(--color-accent-ink)]/30 bg-white px-2 py-0.5 text-[color:var(--color-accent-ink)]">
                        {ep.verb}
                      </span>
                      <code className="font-mono text-[12.5px] text-[color:var(--color-ink)]">
                        {ep.path}
                      </code>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* §162 — Code snippets. One CodeBlock per endpoint, language tabs
              shared across all endpoints (so a partner who picks Python once
              keeps reading Python). Per-snippet copy + download buttons sit
              inside the toolbar; the page-level 'Download all snippets (ZIP)'
              button at the section header bundles the entire matrix. */}
          <div
            id="api-snippets"
            data-testid="api-snippets-section"
            className="mt-20"
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="eyebrow">06.b — Code snippets</p>
                <div className="mt-3 hairline" />
                <h3 className="mt-6 font-display text-[24px] md:text-[28px] leading-[1.15] tracking-[-0.02em] text-[color:var(--color-ink)]">
                  Paste-ready code for every endpoint.
                </h3>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  Snippets are generated from the same source of truth as
                  the on-page reference and the PDF, so they can never
                  drift. Drop in your credentials and the calls run.
                </p>
              </div>
              <div
                data-testid="api-snippets-language-tabs"
                role="tablist"
                aria-label="Snippet language"
                className="inline-flex items-center rounded-full border border-border bg-white p-1 shadow-[0_1px_2px_rgba(16,42,75,0.05)]"
              >
                {SNIPPET_LANGUAGES.map((lang) => {
                  const active = lang.id === activeLanguage;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveLanguage(lang.id)}
                      data-testid={`api-snippets-lang-${lang.id}`}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors duration-150",
                        active
                          ? "bg-[color:var(--color-accent-ink)] text-white"
                          : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
                      ].join(" ")}
                    >
                      <Terminal className="size-3.5" strokeWidth={1.5} />
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              data-testid="api-snippets-grid"
              className={`mt-10 grid grid-cols-12 gap-6 ${noApiSearchMatches ? "hidden" : ""}`}
            >
              {filteredEndpointRecords.map((record) => {
                const resource = API_RESOURCES.find(
                  (r) => r.slug === record.resourceSlug,
                );
                if (!resource) return null;
                const endpoint = record.endpoint;
                const key = `${resource.slug}--${endpoint.verb}-${endpoint.path}`;
                const snippet = buildSnippet(endpoint, activeLanguage);
                const filename =
                  buildSnippetFilename(
                    resource,
                    endpoint,
                    activeLanguage,
                  )
                    .split("/")
                    .pop() ?? "snippet.txt";
                const lang = SNIPPET_LANGUAGES.find(
                  (l) => l.id === activeLanguage,
                );
                const copied = copiedKey === key;
                return (
                  <article
                    key={key}
                    data-testid={`api-snippet-${resource.slug}-${endpoint.verb.toLowerCase()}`}
                    className="col-span-12 lg:col-span-6 rounded-[16px] border border-border bg-white overflow-hidden"
                  >
                      <header className="flex items-center justify-between gap-3 border-b border-border bg-[color:var(--color-paper-soft)] px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono font-semibold uppercase tracking-wider text-[11px] rounded-full border border-[color:var(--color-accent-ink)]/30 bg-white px-2 py-0.5 text-[color:var(--color-accent-ink)]">
                            {endpoint.verb}
                          </span>
                          <code className="font-mono text-[12.5px] text-[color:var(--color-ink)] truncate">
                            {endpoint.path}
                          </code>
                          <span className="hidden md:inline text-[11px] uppercase tracking-wider text-[color:var(--color-ink-soft)]">
                            · {resource.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(key, snippet)}
                            data-testid={`api-snippet-copy-${resource.slug}-${endpoint.verb.toLowerCase()}`}
                            aria-label={`Copy ${endpoint.verb} ${endpoint.path} ${lang?.label ?? activeLanguage} snippet`}
                            className="btn-press inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-[11.5px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)]"
                          >
                            {copied ? (
                              <>
                                <Check className="size-3.5" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5" />
                                Copy
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              triggerSnippetTextDownload({
                                filename,
                                contents: snippet,
                                mimeType:
                                  lang?.mimeType ?? "text/plain",
                              })
                            }
                            data-testid={`api-snippet-download-${resource.slug}-${endpoint.verb.toLowerCase()}`}
                            aria-label={`Download ${endpoint.verb} ${endpoint.path} ${lang?.label ?? activeLanguage} snippet`}
                            className="btn-press inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-2.5 py-1 text-[11.5px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)]"
                          >
                            <Download className="size-3.5" />
                            Download
                          </button>
                        </div>
                      </header>
                      <pre className="m-0 overflow-x-auto bg-[color:var(--color-ink)] px-5 py-4 text-[12.5px] leading-[1.6] text-[color:var(--color-paper-soft)]">
                        <code className="font-mono whitespace-pre">
                          {snippet}
                        </code>
                      </pre>
                    </article>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* §160 — REQUEST AN INTEGRATION */}
      <section
        id="request-integration"
        data-testid="request-integration-section"
        className="bg-[color:var(--color-paper-soft)] border-b border-border"
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
              <p className="eyebrow">07 — Request an integration</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-6 font-display text-[32px] md:text-[40px] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Don&apos;t see your tool?{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  Tell us about it.
                </span>
              </h2>
              <p className="mt-5 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Tell us the ATS or HRIS you use, who&apos;s building (us
                to you, you to us, or paired), and your monthly volume.
                We&apos;ll scope the work and reply within one business
                day. If you have an API doc link we should review, drop
                it in the form and we&apos;ll come back with a build plan.
              </p>
              <p className="mt-5 text-[13px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Already have our API docs?{" "}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  data-testid="api-docs-download-btn-inline"
                  className="ink-link inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-accent-ink)]"
                >
                  <Download className="size-3.5" />
                  Download the PDF reference
                </button>
                .
              </p>
            </div>

            <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
              {submitted ? (
                <div
                  data-testid="integration-request-success"
                  className="rounded-[20px] border border-[color:var(--color-accent-ink)]/30 bg-white p-8 shadow-[0_1px_2px_rgba(16,42,75,0.08),0_12px_32px_-16px_rgba(16,42,75,0.22)]"
                >
                  <p className="eyebrow text-[color:var(--color-accent-ink)]">
                    Received
                  </p>
                  <h3 className="mt-3 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                    Thanks — we&apos;ll be in touch within one business
                    day.
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    A solutions engineer will review your request and
                    follow up with a scoped build plan. If you also
                    downloaded the PDF reference, you&apos;re ready to
                    walk through it together on the first call.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/pricing"
                      className="btn-press inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-5 py-2.5 text-[13.5px] text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper)]"
                    >
                      See pricing
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                    <Link
                      href="/contact"
                      className="btn-press inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-accent-ink)] px-5 py-2.5 text-[13.5px] text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                    >
                      General contact
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={handleIntegrationSubmit}
                  data-testid="integration-request-form"
                  className="rounded-[20px] border border-border bg-white p-8 shadow-[0_1px_2px_rgba(16,42,75,0.06),0_10px_28px_-18px_rgba(16,42,75,0.18)]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <IntField
                      label="Name"
                      name="name"
                      required
                      autoComplete="name"
                      onChange={clearFieldOnChange("name")}
                      error={fieldErrors.name}
                    />
                    <IntField
                      label="Work email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      onChange={clearFieldOnChange("email")}
                      error={fieldErrors.email}
                    />
                    <IntField
                      label="Company"
                      name="company"
                      required
                      autoComplete="organization"
                      onChange={clearFieldOnChange("company")}
                      error={fieldErrors.company}
                    />
                    <IntField
                      label="Role"
                      name="role"
                      autoComplete="organization-title"
                    />
                    <IntField
                      label="ATS / HRIS name"
                      name="ats"
                      required
                      onChange={clearFieldOnChange("ats")}
                      error={fieldErrors.ats}
                    />
                    <IntField
                      label="ATS version (if known)"
                      name="ats_version"
                    />
                    <IntSelect
                      label="Who builds it?"
                      name="direction"
                      options={INTEGRATION_DIRECTIONS}
                      required
                      onChange={clearFieldOnChange("direction")}
                      error={fieldErrors.direction}
                    />
                    <IntSelect
                      label="Estimated monthly volume"
                      name="volume"
                      options={INTEGRATION_VOLUMES}
                      required
                      onChange={clearFieldOnChange("volume")}
                      error={fieldErrors.volume}
                    />
                    <IntSelect
                      label="Target timeline"
                      name="timeline"
                      options={INTEGRATION_TIMELINES}
                    />
                    <IntField
                      label="Phone (optional)"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                    />
                    <IntField
                      label="Your API documentation link (optional)"
                      name="api_docs_link"
                      type="url"
                      className="sm:col-span-2"
                    />
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="int-notes"
                        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                      >
                        Notes
                      </label>
                      <textarea
                        id="int-notes"
                        name="notes"
                        rows={4}
                        className="form-field mt-1.5 w-full resize-y"
                        placeholder="What are you trying to automate? Any edge cases (multi-tenant, branch-level scoping, custom statuses) we should know about?"
                      />
                    </div>
                  </div>

                  {submitError ? (
                    <p
                      role="alert"
                      data-testid="integration-request-error"
                      className="mt-5 text-[13px] text-[color:var(--color-destructive,#dc2626)]"
                    >
                      {submitError}
                    </p>
                  ) : null}

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-[12.5px] text-[color:var(--color-ink-muted)] max-w-md">
                      We&apos;ll reply within one business day. By
                      submitting, you agree to be contacted by Rapid
                      Hire Solutions about your integration request.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      data-testid="integration-request-submit"
                      className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Request integration
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

      {/* Closing CTA — now anchors to the in-page form. */}
      <section className="bg-white border-t border-border">
        <div className="container py-20">
          <div className="reveal-on-scroll grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-8">
              <p className="eyebrow">Don&apos;t see your tool?</p>
              <h2 className="mt-3 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                We&apos;ll build the integration.{" "}
                <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                  Just ask.
                </span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:justify-end">
              <a
                href="#request-integration"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Request an integration
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

// §160 — small labeled input/select helpers scoped to the integration form.
// We intentionally use a different field-id prefix (`int-`) from the quote
// form (`quote-`) so DOM ids stay unique when both pages render in tests.
function IntField({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  className,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  onChange?: () => void;
  error?: string;
}) {
  const fieldId = `int-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={fieldId}
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        onChange={onChange}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={[
          "form-field mt-1.5 w-full",
          error ? "form-field--invalid" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function IntSelect({
  label,
  name,
  options,
  required,
  defaultValue,
  className,
  onChange,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  defaultValue?: string;
  className?: string;
  onChange?: () => void;
  error?: string;
}) {
  const fieldId = `int-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}
        {required ? " *" : ""}
      </label>
      <select
        id={fieldId}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        onChange={onChange}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={[
          "form-field mt-1.5 w-full",
          error ? "form-field--invalid" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-[12.5px] text-[color:var(--color-destructive,#dc2626)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

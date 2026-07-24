import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useSearch } from "wouter";
import type {
  EmployerScreeningLandingPageConfig,
  LandingDetailField,
} from "@/content/employerScreeningLandingPages";
import { EMPLOYER_LANDING_CONSENT } from "@/content/employerScreeningLandingPages";
import { FORMSPREE_ENDPOINT } from "@/lib/formspree";
import {
  clearFieldError,
  hasErrors,
  validateFields,
  type FieldErrors,
} from "@/lib/formValidation";
import {
  readHubspotUtkCookie,
  submitToHubspot,
} from "@/lib/hubspotForm";
import {
  buildEmployerLandingHubspotBody,
  buildEmployerLandingPayload,
  type EmployerLandingFormValues,
} from "@/lib/employerLandingForms";
import {
  initTracking,
  loadTrackingParams,
  type TrackingParams,
} from "@/lib/staffingLp";

interface EmployerLeadFormProps {
  readonly config: EmployerScreeningLandingPageConfig;
}

function initialDetailValues(
  fields: readonly LandingDetailField[],
): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.id, ""]));
}

function fieldClasses(error?: string): string {
  return ["form-field", error ? "form-field--invalid" : ""]
    .filter(Boolean)
    .join(" ");
}

interface ServicesMultiSelectProps {
  readonly label: string;
  readonly required: boolean;
  readonly options: readonly string[];
  readonly selected: readonly string[];
  readonly error?: string;
  readonly onToggle: (service: string) => void;
}

function ServicesMultiSelect({
  label,
  required,
  options,
  selected,
  error,
  onToggle,
}: ServicesMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const errorId = error ? "lp-services-error" : undefined;
  const selectedLabel =
    selected.length > 0 ? selected.join(", ") : "Select services...";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      optionRefs.current[activeIndex]?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, open]);

  function closeAndFocusTrigger() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function moveActive(nextIndex: number) {
    const normalized = (nextIndex + options.length) % options.length;
    setActiveIndex(normalized);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(event.key === "ArrowDown" ? 0 : options.length - 1);
      setOpen(true);
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  }

  function onOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocusTrigger();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <span
        id="lp-services-label"
        className="text-[12.5px] font-medium uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}
        {required ? " *" : ""}
      </span>
      <button
        ref={triggerRef}
        id="lp-services"
        name="services"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="lp-services-options"
        aria-labelledby="lp-services-label lp-services-value"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
        className={[
          "mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-[12px] border bg-white px-4 py-3 text-left text-[14px] leading-snug text-[color:var(--color-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2 motion-reduce:transition-none",
          error
            ? "border-[color:var(--color-destructive,#dc2626)]"
            : "border-border hover:border-[color:var(--color-accent-ink)]",
        ].join(" ")}
      >
        <span
          id="lp-services-value"
          className={
            selected.length > 0
              ? "min-w-0 text-[color:var(--color-ink)]"
              : "min-w-0 text-[color:var(--color-ink-muted)]"
          }
        >
          {selectedLabel}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={[
            "size-4 shrink-0 transition-transform motion-reduce:transition-none",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <div
          id="lp-services-options"
          role="listbox"
          aria-labelledby="lp-services-label"
          aria-multiselectable="true"
          aria-required={required}
          className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-[14px] border border-border bg-white p-2 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.42)]"
        >
          {options.map((service, index) => {
            const checked = selected.includes(service);
            return (
              <button
                key={service}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={checked}
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => {
                  setActiveIndex(index);
                  onToggle(service);
                }}
                onKeyDown={(event) => onOptionKeyDown(event, index)}
                className={[
                  "flex min-h-11 w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--color-accent-ink)] motion-reduce:transition-none",
                  checked
                    ? "bg-[color:var(--color-tint)] text-[color:var(--color-ink)]"
                    : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper)]",
                ].join(" ")}
              >
                <span>{service}</span>
                <Check
                  aria-hidden="true"
                  className={[
                    "size-4 shrink-0 text-[color:var(--color-accent-ink)]",
                    checked ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      )}

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

export default function EmployerLeadForm({
  config,
}: EmployerLeadFormProps) {
  const search = useSearch();
  const [tracking, setTracking] = useState<TrackingParams>(() =>
    initTracking(search),
  );
  const [detailValues, setDetailValues] = useState<Record<string, string>>(
    () => initialDetailValues(config.form.details),
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  const servicesValue = useMemo(
    () => selectedServices.join(", "),
    [selectedServices],
  );

  useEffect(() => {
    setTracking(initTracking(search));
  }, [search]);

  useEffect(() => {
    setDetailValues(initialDetailValues(config.form.details));
    setSelectedServices([]);
    setFieldErrors({});
    setError(null);
    setSubmitted(false);
  }, [config]);

  useEffect(() => {
    if (!submitted) return;
    const frame = requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      successRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
      successRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [submitted]);

  function clearError(name: string) {
    setFieldErrors((current) => clearFieldError(current, name));
  }

  function updateDetail(field: LandingDetailField, value: string) {
    setDetailValues((current) => ({ ...current, [field.id]: value }));
    clearError(field.id);
  }

  function toggleService(service: string) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((value) => value !== service)
        : [...current, service],
    );
    clearError("services");
  }

  function focusFirstError(
    form: HTMLFormElement,
    fieldName: string,
  ): void {
    const named = form.elements.namedItem(fieldName);
    if (
      named instanceof HTMLInputElement ||
      named instanceof HTMLSelectElement ||
      named instanceof HTMLTextAreaElement
    ) {
      named.focus();
      return;
    }
    const byId = document.getElementById(fieldName);
    if (
      byId instanceof HTMLInputElement ||
      byId instanceof HTMLSelectElement ||
      byId instanceof HTMLTextAreaElement
    ) {
      byId.focus();
      return;
    }
    if (fieldName === "services") {
      form
        .querySelector<HTMLElement>(
          '[name="services"]',
        )
        ?.focus();
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("_gotcha") ?? "").trim()) {
      setSubmitted(true);
      return;
    }

    const values: EmployerLandingFormValues = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
      volume: String(data.get("volume") ?? ""),
      services: servicesValue,
      details: detailValues,
    };

    const validationValues: Record<string, string> = {
      name: values.name,
      email: values.email,
      company: values.company,
      volume: values.volume,
      services: values.services,
      ...detailValues,
    };
    const requiredFields = [
      "name",
      "email",
      "company",
      "volume",
      ...config.form.details
        .filter((field) => field.required)
        .map((field) => field.id),
      ...(config.form.services?.required ? ["services"] : []),
    ];
    const validationErrors = validateFields(validationValues, {
      requiredFields,
      emailFields: ["email"],
    });

    if (hasErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      focusFirstError(form, Object.keys(validationErrors)[0]);
      return;
    }

    setSubmitting(true);
    const effectiveTracking = {
      ...loadTrackingParams(),
      ...tracking,
    };
    const pageUri =
      typeof window !== "undefined" ? window.location.href : config.seo.canonical;
    const payload = buildEmployerLandingPayload(
      config,
      values,
      effectiveTracking,
    );
    const hubspotBody = buildEmployerLandingHubspotBody(
      config,
      values,
      effectiveTracking,
      pageUri,
      readHubspotUtkCookie(),
    );

    void submitToHubspot(hubspotBody)
      .then((result) => {
        if (!result.ok && typeof console !== "undefined") {
          console.warn("[HubSpot Forms] non-2xx response", result);
        }
      })
      .catch(() => {});

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseData = (await response.json().catch(() => ({}))) as {
        errors?: Array<{ message?: string }>;
      };
      if (!response.ok) {
        const message =
          responseData.errors?.[0]?.message ||
          `Submission failed (${response.status}). Please try again.`;
        setError(message);
        toast.error(message);
        return;
      }
      setSubmitted(true);
      toast.success(
        "A U.S.-based specialist will review your request and follow up.",
      );
    } catch {
      const message = "Network error. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        id="lead-form"
        className="scroll-mt-24"
      >
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          data-testid="employer-landing-success"
          className="rounded-[24px] border border-border bg-white p-8 text-center shadow-[0_20px_60px_-38px_rgba(15,23,42,0.35)] outline-none md:p-10"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mx-auto size-11 text-[color:var(--color-accent-ink)]"
            strokeWidth={1.6}
          />
          <h2 className="mt-5 font-display text-[30px] leading-tight text-[color:var(--color-ink)]">
            Request received.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
            A U.S.-based specialist will review your request and follow up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="lead-form" className="scroll-mt-24">
    <form
      noValidate
      onSubmit={onSubmit}
      onInput={(event) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        if (target.name) clearError(target.name);
      }}
      onChange={(event) => {
        const target = event.target as HTMLSelectElement;
        if (target.name) clearError(target.name);
      }}
      aria-labelledby="employer-lead-form-title"
      data-testid="employer-lead-form"
      className="scroll-mt-24 rounded-[24px] border border-border bg-white p-6 shadow-[0_22px_70px_-40px_rgba(15,23,42,0.42)] md:p-8"
    >
      <h2
        id="employer-lead-form-title"
        className="font-display text-[28px] leading-tight text-[color:var(--color-ink)]"
      >
        {config.cta}
      </h2>

      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
        }}
      />
      <input
        type="hidden"
        name="lead_source"
        value="Get Started Form"
      />
      <input type="hidden" name="source" value={config.route} />
      {Object.entries(tracking).map(([name, value]) => (
        <input
          key={name}
          type="hidden"
          name={name}
          value={value ?? ""}
          data-tracking-field={name}
        />
      ))}

      <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          id="lp-name"
          name="name"
          label="Full name"
          required
          autoComplete="name"
          error={fieldErrors.name}
        />
        <TextField
          id="lp-email"
          name="email"
          label="Work email"
          type="email"
          required
          autoComplete="email"
          error={fieldErrors.email}
        />
        <TextField
          id="lp-company"
          name="company"
          label={config.form.companyLabel}
          required
          autoComplete="organization"
          error={fieldErrors.company}
        />
        <TextField
          id="lp-phone"
          name="phone"
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
        />
        <SelectField
          id="lp-volume"
          name="volume"
          label={config.form.volumeLabel}
          required
          options={config.form.volumeOptions}
          error={fieldErrors.volume}
          className="sm:col-span-2"
        />
      </div>

      {config.form.details.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-6">
          {config.form.details.map((field) => (
            <DetailField
              key={field.id}
              field={field}
              value={detailValues[field.id] ?? ""}
              error={fieldErrors[field.id]}
              onChange={(value) => updateDetail(field, value)}
            />
          ))}
        </div>
      )}

      {config.form.services && (
        <div className="mt-6">
          {config.form.services.type === "select" ? (
            <SelectField
              id="lp-services"
              name="services"
              label={config.form.services.label}
              required={config.form.services.required}
              options={config.form.services.options}
              value={selectedServices[0] ?? ""}
              onChange={(value) => {
                setSelectedServices(value ? [value] : []);
                clearError("services");
              }}
              error={fieldErrors.services}
            />
          ) : (
            <ServicesMultiSelect
              label={config.form.services.label}
              required={config.form.services.required}
              options={config.form.services.options}
              selected={selectedServices}
              error={fieldErrors.services}
              onToggle={toggleService}
            />
          )}
        </div>
      )}

      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="mt-6 text-[13px] text-[color:var(--color-destructive,#dc2626)]"
        >
          {error}
        </p>
      )}

      <p className="mt-7 text-[12px] leading-[1.65] text-[color:var(--color-ink-muted)]">
        {EMPLOYER_LANDING_CONSENT}
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[color:var(--color-accent-ink-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
      >
        {submitting ? (
          <>
            Sending
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
          </>
        ) : (
          <>
            {config.cta}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </>
        )}
      </button>
    </form>
    </div>
  );
}

interface TextFieldProps {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly type?: "text" | "email" | "tel";
  readonly required?: boolean;
  readonly autoComplete?: string;
  readonly error?: string;
}

function TextField({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
  error,
}: TextFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label
        htmlFor={id}
        className="text-[12.5px] font-medium uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={fieldClasses(error)}
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

interface SelectFieldProps {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly options: readonly string[];
  readonly required?: boolean;
  readonly error?: string;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  readonly className?: string;
}

function SelectField({
  id,
  name,
  label,
  options,
  required,
  error,
  value,
  onChange,
  className,
}: SelectFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const controlled = value !== undefined;
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-[12.5px] font-medium uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {label}
        {required ? " *" : ""}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        value={controlled ? value : undefined}
        defaultValue={controlled ? undefined : ""}
        onChange={
          onChange ? (event) => onChange(event.target.value) : undefined
        }
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={fieldClasses(error)}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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

interface DetailFieldProps {
  readonly field: LandingDetailField;
  readonly value: string;
  readonly error?: string;
  readonly onChange: (value: string) => void;
}

function DetailField({
  field,
  value,
  error,
  onChange,
}: DetailFieldProps) {
  const errorId = error ? `${field.id}-error` : undefined;
  const shared = {
    id: field.id,
    name: "message",
    required: field.required,
    value,
    onChange: (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => onChange(event.target.value),
    "aria-invalid": error ? ("true" as const) : undefined,
    "aria-describedby": errorId,
    className: fieldClasses(error),
  };

  return (
    <div>
      <label
        htmlFor={field.id}
        className="text-[12.5px] font-medium uppercase tracking-wider text-[color:var(--color-ink-muted)]"
      >
        {field.label}
        {field.required ? " *" : ""}
      </label>
      {field.type === "textarea" ? (
        <textarea {...shared} rows={4} />
      ) : field.type === "select" ? (
        <select {...shared}>
          <option value="" disabled>
            Select…
          </option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input {...shared} type="text" />
      )}
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

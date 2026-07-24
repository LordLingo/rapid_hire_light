import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearch } from "wouter";
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
  buildHireQuestHubspotBody,
  buildHireQuestPayload,
  HIREQUEST_LEAD_SOURCE,
  HIREQUEST_PACKAGES,
  HIREQUEST_SOURCE,
  type HireQuestPackageValue,
  type HireQuestRegistrationValues,
} from "@/lib/hireQuestPartnerForm";
import {
  initTracking,
  loadTrackingParams,
  type TrackingParams,
} from "@/lib/staffingLp";

interface HireQuestRegistrationFormProps {
  readonly selectedPackage: HireQuestPackageValue | "";
  readonly onPackageChange: (value: HireQuestPackageValue | "") => void;
}

interface FieldProps {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly required?: boolean;
  readonly type?: string;
  readonly autoComplete?: string;
  readonly inputMode?: "numeric" | "tel";
  readonly error?: string;
  readonly className?: string;
}

function fieldClass(error?: string): string {
  return [
    "hq-form-control",
    error ? "hq-form-control--invalid" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function FormError({
  id,
  message,
}: {
  readonly id: string;
  readonly message?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="hq-field-error">
      {message}
    </p>
  );
}

function TextField({
  id,
  name,
  label,
  required,
  type = "text",
  autoComplete,
  inputMode,
  error,
  className = "",
}: FieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="hq-form-label">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        className={fieldClass(error)}
      />
      <FormError id={`${id}-error`} message={error} />
    </div>
  );
}

export default function HireQuestRegistrationForm({
  selectedPackage,
  onPackageChange,
}: HireQuestRegistrationFormProps) {
  const search = useSearch();
  const [tracking, setTracking] = useState<TrackingParams>(() =>
    initTracking(search),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTracking(initTracking(search));
  }, [search]);

  useEffect(() => {
    if (!submitted) return;
    const frame = requestAnimationFrame(() => {
      successRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [submitted]);

  function clearError(name: string) {
    setFieldErrors((current) => clearFieldError(current, name));
  }

  function focusFirstError(form: HTMLFormElement, fieldName: string) {
    const field = form.elements.namedItem(fieldName);
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement ||
      field instanceof HTMLTextAreaElement
    ) {
      field.focus();
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmissionError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("_gotcha") ?? "").trim()) {
      setSubmitted(true);
      return;
    }

    const values: HireQuestRegistrationValues = {
      fullName: String(data.get("fullName") ?? ""),
      workEmail: String(data.get("workEmail") ?? ""),
      phone: String(data.get("phone") ?? ""),
      officeName: String(data.get("officeName") ?? ""),
      officeCity: String(data.get("officeCity") ?? ""),
      state: String(data.get("state") ?? ""),
      officeId: String(data.get("officeId") ?? ""),
      jobTitle: String(data.get("jobTitle") ?? ""),
      monthlyHires: String(data.get("monthlyHires") ?? ""),
      packageSelection: selectedPackage,
      additionalNotes: String(data.get("additionalNotes") ?? ""),
    };

    const validationErrors = validateFields(
      {
        fullName: values.fullName,
        workEmail: values.workEmail,
        phone: values.phone,
        officeName: values.officeName,
        officeCity: values.officeCity,
        state: values.state,
        monthlyHires: values.monthlyHires,
        packageSelection: values.packageSelection,
      },
      {
        requiredFields: [
          "fullName",
          "workEmail",
          "phone",
          "officeName",
          "officeCity",
          "state",
          "monthlyHires",
          "packageSelection",
        ],
        emailFields: ["workEmail"],
      },
    );

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
      typeof window !== "undefined"
        ? window.location.href
        : "https://www.rapidhiresolutions.com/hirequest-partner/";
    const payload = buildHireQuestPayload(values, effectiveTracking);
    const hubspotBody = buildHireQuestHubspotBody(
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
        setSubmissionError(message);
        toast.error(message);
        return;
      }
      setSubmitted(true);
      toast.success("Your HireQuest account request was received.");
    } catch {
      const message = "Network error. Please try again.";
      setSubmissionError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        data-testid="hirequest-registration-success"
        className="hq-success"
      >
        <CheckCircle2 aria-hidden="true" className="hq-success-icon" />
        <h3>Account request received.</h3>
        <p>
          Our team will confirm your account setup and HireQuest group-rate
          configuration separately.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onInput={(event) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        if (target.name) clearError(target.name);
      }}
      aria-labelledby="hirequest-registration-form-title"
      data-testid="hirequest-registration-form"
      className="hq-registration-form"
    >
      <h3 id="hirequest-registration-form-title" className="sr-only">
        HireQuest account request form
      </h3>

      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hq-honeypot"
      />
      <input
        type="hidden"
        name="lead_source"
        value={HIREQUEST_LEAD_SOURCE}
      />
      <input type="hidden" name="source" value={HIREQUEST_SOURCE} />
      {Object.entries(tracking).map(([name, value]) => (
        <input
          key={name}
          type="hidden"
          name={name}
          value={value ?? ""}
          data-tracking-field={name}
        />
      ))}

      <div className="hq-form-grid">
        <TextField
          id="hq-full-name"
          name="fullName"
          label="Full Name"
          required
          autoComplete="name"
          error={fieldErrors.fullName}
        />
        <TextField
          id="hq-work-email"
          name="workEmail"
          label="Work Email"
          type="email"
          required
          autoComplete="email"
          error={fieldErrors.workEmail}
        />
        <TextField
          id="hq-phone"
          name="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          error={fieldErrors.phone}
        />
        <TextField
          id="hq-office-name"
          name="officeName"
          label="Franchise or Office Name"
          required
          autoComplete="organization"
          error={fieldErrors.officeName}
        />
        <TextField
          id="hq-office-city"
          name="officeCity"
          label="Office City"
          required
          autoComplete="address-level2"
          error={fieldErrors.officeCity}
        />
        <TextField
          id="hq-state"
          name="state"
          label="State"
          required
          autoComplete="address-level1"
          error={fieldErrors.state}
        />
        <TextField
          id="hq-office-id"
          name="officeId"
          label="HireQuest Office or Franchise ID (optional)"
          autoComplete="off"
        />
        <TextField
          id="hq-job-title"
          name="jobTitle"
          label="Job Title (optional)"
          autoComplete="organization-title"
        />
        <TextField
          id="hq-monthly-hires"
          name="monthlyHires"
          label="Estimated Monthly Hires"
          required
          inputMode="numeric"
          error={fieldErrors.monthlyHires}
        />
        <div>
          <label htmlFor="hq-package-selection" className="hq-form-label">
            Package Selection *
          </label>
          <select
            id="hq-package-selection"
            name="packageSelection"
            required
            value={selectedPackage}
            aria-invalid={
              fieldErrors.packageSelection ? "true" : undefined
            }
            aria-describedby={
              fieldErrors.packageSelection
                ? "hq-package-selection-error"
                : undefined
            }
            className={fieldClass(fieldErrors.packageSelection)}
            onChange={(event) => {
              onPackageChange(
                event.target.value as HireQuestPackageValue | "",
              );
              clearError("packageSelection");
            }}
          >
            <option value="">Select a package...</option>
            {HIREQUEST_PACKAGES.map((packageOption) => (
              <option key={packageOption.value} value={packageOption.value}>
                {packageOption.value}
              </option>
            ))}
          </select>
          <FormError
            id="hq-package-selection-error"
            message={fieldErrors.packageSelection}
          />
        </div>
        <div className="hq-form-span">
          <label htmlFor="hq-additional-notes" className="hq-form-label">
            Additional Notes (optional)
          </label>
          <textarea
            id="hq-additional-notes"
            name="additionalNotes"
            rows={5}
            className={fieldClass()}
          />
        </div>
      </div>

      {submissionError && (
        <p role="alert" aria-live="assertive" className="hq-submit-error">
          {submissionError}
        </p>
      )}

      <p className="hq-form-consent">{EMPLOYER_LANDING_CONSENT}</p>

      <button
        type="submit"
        disabled={submitting}
        className="hq-button hq-button-primary hq-submit-button"
      >
        {submitting ? (
          <>
            Sending
            <Loader2 aria-hidden="true" className="hq-spinner" />
          </>
        ) : (
          <>
            Submit Account Request
            <ArrowUpRight aria-hidden="true" className="hq-button-arrow" />
          </>
        )}
      </button>
    </form>
  );
}

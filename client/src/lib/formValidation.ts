/*
  §134 — Shared form-validation helpers used by Contact.tsx, GetAQuote.tsx,
  and ComplianceAudit.tsx so all three forms surface the same inline error
  treatment (red border via `.form-field--invalid` + a short helper line
  beneath the field) instead of relying solely on a single toast.

  Design notes:
   - Pure functions; no React imports here so the helpers can be unit-tested
     without a DOM.
   - Validation rules are intentionally minimal: "required" + a permissive
     RFC-5322-lite email regex. We do not enforce phone formats, company
     length, or anything else the back-office wants flexibility on.
   - The error messages are deliberately short ("Required" / "Enter a
     valid email") because they live directly under the field; verbose
     copy would force the form to grow vertically and disrupt the grid.
   - The shape `FieldErrors` is just `Record<string, string>`. An empty
     record means "no errors". Pages call `hasErrors(errors)` rather than
     `Object.keys(errors).length` so we can change the representation later
     without touching every caller.
*/

/** Map of fieldName → human-readable error message. Empty = valid. */
export type FieldErrors = Record<string, string>;

/**
 * Permissive email regex — accepts the practical 99% of what real
 * candidates type (`alice@example.com`, `alice+tag@sub.example.co.uk`)
 * without trying to be RFC-5322 strict (which would reject valid
 * addresses and is impossible in a regex anyway). Runs after a trim so
 * leading/trailing whitespace from copy-paste doesn't fail validation.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pretty-print "X is required" / "Enter a valid X" without verbosity. */
export const ERR_REQUIRED = "Required";
export const ERR_EMAIL = "Enter a valid email";

/**
 * Validate a flat object of form values. `requiredFields` is the list of
 * field names that must be non-empty after trim. The optional
 * `emailFields` array names fields that must additionally match
 * `EMAIL_REGEX` when non-empty. (Required + email = both checks; the
 * required check fires first so an empty email shows "Required" not
 * "Enter a valid email".)
 */
export function validateFields(
  values: Record<string, string | undefined | null>,
  options: {
    requiredFields: ReadonlyArray<string>;
    emailFields?: ReadonlyArray<string>;
  },
): FieldErrors {
  const { requiredFields, emailFields = [] } = options;
  const errors: FieldErrors = {};

  for (const name of requiredFields) {
    const v = String(values[name] ?? "").trim();
    if (v.length === 0) {
      errors[name] = ERR_REQUIRED;
    }
  }

  for (const name of emailFields) {
    if (errors[name]) continue; // required already failed; don't overwrite
    const v = String(values[name] ?? "").trim();
    if (v.length > 0 && !EMAIL_REGEX.test(v)) {
      errors[name] = ERR_EMAIL;
    }
  }

  return errors;
}

/** True if the errors map has any entries. */
export function hasErrors(errors: FieldErrors): boolean {
  for (const _ in errors) return true;
  return false;
}

/**
 * Helper for the page-level submit handler: clear a single field's error
 * after the user starts editing it. Returns a new map (immutable update)
 * so React's setState diffs cleanly. Cheap; no-op if the key wasn't in
 * the map.
 */
export function clearFieldError(
  errors: FieldErrors,
  name: string,
): FieldErrors {
  if (!(name in errors)) return errors;
  const next = { ...errors };
  delete next[name];
  return next;
}

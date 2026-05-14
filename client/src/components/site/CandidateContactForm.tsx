/*
  CandidateContactForm — embedded on /support so candidates can submit a
  question about their report directly. Pure HTML form + tRPC-free fetch
  to /api/candidate-contact (validated and persisted by the candidate-contact
  vite/express plugin in vite.config.ts and server/index.ts).

  Fields:
    - Full name (required)
    - Email     (required, regex-validated)
    - Report ID (optional — surfaced for candidates who already have one)
    - Message   (required, max 5000 chars)

  UX matches the marketing /contact form: hairline underline inputs, sonner
  toasts for confirm/error, swap-to-success-panel on submit. Disabled submit
  while in-flight.
*/
import { useState } from "react";
import { Check, Loader2, ArrowUpRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function CandidateContactForm({
  candidateEmail,
}: {
  candidateEmail: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      reportId: String(fd.get("reportId") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };
    setSubmitting(true);
    try {
      const resp = await fetch("/api/candidate-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!resp.ok || !data?.ok) {
        const msg =
          data?.error || `Submission failed (${resp.status}). Please try again.`;
        setError(msg);
        toast.error(msg);
        return;
      }
      setSubmitted(true);
      toast.success("Message received — a candidate-care specialist will reach out the same business day.");
    } catch {
      const msg = "Network error. Please try again or email us directly.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[20px] border border-border bg-[color:var(--color-paper)] px-7 py-12 text-center">
        <div className="mx-auto grid place-items-center size-12 rounded-full bg-[color:var(--color-tint)] text-[color:var(--color-accent-ink)]">
          <Check className="size-5" strokeWidth={2} />
        </div>
        <h3 className="mt-5 font-display text-[26px] leading-tight text-[color:var(--color-ink)]">
          Message received.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          A US-based candidate-care specialist will reach out the same business
          day. If your question is time-sensitive, you can also email{" "}
          <a className="ink-link" href={`mailto:${candidateEmail}`}>
            {candidateEmail}
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-7" aria-describedby="cand-form-trust">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
        <CFField
          label="Full name"
          name="fullName"
          required
          autoComplete="name"
        />
        <CFField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <CFField
          label="Report ID (optional)"
          name="reportId"
          placeholder="e.g. 24A-08821"
          className="md:col-span-2"
        />
        <div className="md:col-span-2">
          <label className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
            Your question
          </label>
          <textarea
            name="message"
            required
            rows={4}
            maxLength={5000}
            placeholder="A quick description of what you're trying to resolve. We'll route you to the right specialist."
            className="mt-2 w-full bg-transparent border-0 border-b border-[color:var(--color-rule)] py-2.5 text-[15px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)]/70 focus:outline-none focus:border-[color:var(--color-accent-ink)] transition-colors resize-y min-h-[96px]"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="text-[13.5px] text-[color:var(--color-accent-ink-strong)]"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
        <p
          id="cand-form-trust"
          className="text-[12.5px] text-[color:var(--color-ink-muted)] inline-flex items-center gap-1.5"
        >
          <ShieldCheck className="size-3.5 text-[color:var(--color-accent-ink)]" aria-hidden />
          Replies from a US-based human · same business day
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              Sending
              <Loader2 className="size-4 animate-spin" />
            </>
          ) : (
            <>
              Send message
              <ArrowUpRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function CFField({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-0 border-b border-[color:var(--color-rule)] py-2.5 text-[15px] text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)]/70 focus:outline-none focus:border-[color:var(--color-accent-ink)] transition-colors"
      />
    </div>
  );
}

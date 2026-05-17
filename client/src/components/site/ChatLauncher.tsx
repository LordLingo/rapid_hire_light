/*
  §83 — ChatLauncher
  -------------------
  A floating "Chat with sales" launcher in the bottom-right that opens a
  small panel with a 3-field message form (name + email + message).
  Submits to the existing /api/candidate-contact endpoint with a
  topic="sales-chat" pre-filled in the message body so submissions
  route into the same inbox the candidate-care team already monitors.

  Why not Intercom / Drift / Zendesk?
   - Adds a paid-key dependency, blocks the deploy.
   - Adds 100KB+ of third-party JS at first paint.
   - Requires a privacy-policy update and a cookie-banner change.
  A self-hosted "leave us a message" panel matches the editorial-calm
  voice better and competes adequately with the top-5 live-chat surfaces
  for the volume this site sees today.

  UX:
   - Resting: 56x56 floating circle bottom-right with a chat-bubble
     icon and a small "Sales · 1h reply" eyebrow chip floating above it
     for one tap-target affordance.
   - Open: a 380px panel with rounded card, title row, the 3 fields,
     a submit button, and a small "We reply within 1 business hour"
     reassurance line. Esc / overlay / X all close.
   - On submit success: the panel swaps to a centered checkmark + "Got
     your note. We'll reach out within the hour." message.
   - Hidden on print and on /contact (already a contact form).

  Mobile: positioned with safe-area padding so it stays above iOS home
  bar. The panel is 100% width on screens < sm with 16px gutter.
*/
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MessageCircle, X, Send, Check, Loader2 } from "lucide-react";

const HIDDEN_PATHS = ["/contact", "/support"];

export default function ChatLauncher() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Hide on certain pages where a chat surface is redundant.
  if (HIDDEN_PATHS.some((p) => location.startsWith(p))) {
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (!fullName || !email || !message) {
      setError("Please fill in every field.");
      setSubmitting(false);
      return;
    }
    try {
      const resp = await fetch("/api/candidate-contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          reportId: "",
          message: `[sales-chat] ${message}`,
        }),
      });
      const data = (await resp.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error || "Could not send. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      setSubmitting(false);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="print:hidden fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50"
      data-testid="chat-launcher"
      style={{
        paddingBottom: "max(0px, env(safe-area-inset-bottom))",
      }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat with our sales team"
          className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-[380px] rounded-[16px] border border-border bg-white paper-shadow overflow-hidden"
          style={{
            boxShadow: "0 18px 48px -12px rgba(15,23,42,0.22)",
          }}
        >
          <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-[color:var(--color-paper)]">
            <div>
              <p className="font-display text-[16px] leading-tight text-[color:var(--color-ink)]">
                Talk to sales
              </p>
              <p className="mt-0.5 text-[11.5px] text-[color:var(--color-ink-soft)]">
                Replies within 1 business hour, M–F · 8am–6pm CT
              </p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-soft)]"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {submitted ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-[color:var(--color-tint)] grid place-items-center">
                <Check className="h-5 w-5 text-[color:var(--color-accent-ink)]" />
              </div>
              <p className="mt-4 font-display text-[18px] text-[color:var(--color-ink)]">
                Got your note.
              </p>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-[color:var(--color-ink-soft)]">
                A specialist will reach out within the hour. If you'd rather
                jump on a call, email{" "}
                <a
                  href="mailto:sales@rapidhiresolutions.com"
                  className="underline"
                >
                  sales@rapidhiresolutions.com
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                  Your name
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-[14px] outline-none focus:border-[color:var(--color-accent-ink)]"
                  placeholder="Alex Rivera"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-[14px] outline-none focus:border-[color:var(--color-accent-ink)]"
                  placeholder="alex@company.com"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                  How can we help?
                </label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  className="mt-1 w-full border-0 border-b border-border bg-transparent py-2 text-[14px] outline-none focus:border-[color:var(--color-accent-ink)] resize-none"
                  placeholder="Looking at packages for ~250 hires/yr…"
                />
              </div>
              {error && (
                <p className="text-[12px] text-red-600" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-[13.5px] font-medium text-white hover:opacity-95 disabled:opacity-60 transition"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="text-[10.5px] text-[color:var(--color-ink-muted)] text-center">
                We never share your details with third parties.
              </p>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat with sales"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        data-testid="chat-launcher-button"
        className="grid place-items-center h-14 w-14 rounded-full bg-[color:var(--color-brand-blue)] text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.35)] transition-transform hover:scale-[1.04] active:scale-[0.97]"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}

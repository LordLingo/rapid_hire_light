/*
  Formspree endpoint — single source of truth.

  Why this module exists:
  Every quote/contact form on the public site (Contact.tsx, GetAQuote.tsx,
  ComplianceAudit.tsx, and any future form) must post to the same Formspree
  endpoint so submissions land in one inbox and the endpoint cannot drift
  across files during refactors. Centralizing the literal here means a
  rotation only changes this file, and the §159 vitest spec keeps every
  consumer pinned to the constant.

  Audit history:
    §111 — introduced Formspree mvzyoyoz on /get-a-quote.
    §159 — extracted the literal into this module and rewired Contact +
           ComplianceAudit to consume it (previously xnjrqler and
           /api/contact respectively). CandidateContactForm intentionally
           remains on /api/candidate-contact: it routes to the candidate-care
           inbox, which is a structurally distinct channel from sales/quote
           submissions and uses different server-side validation.
*/

/** Live Formspree form ID. Rotate by replacing this single literal. */
export const FORMSPREE_FORM_ID = "mvzyoyoz";

/**
 * Full HTTPS endpoint for the Formspree form. All POSTs from quote/contact
 * forms on the public site must target this URL.
 */
export const FORMSPREE_ENDPOINT =
  `https://formspree.io/f/${FORMSPREE_FORM_ID}` as const;

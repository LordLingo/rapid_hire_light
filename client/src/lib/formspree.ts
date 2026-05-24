/*
  Formspree endpoints — single source of truth.

  Why this module exists:
  Every quote/contact/integration form on the public site must post through
  one of two named Formspree endpoints so submissions land in the right
  inbox and the IDs cannot drift across files during refactors.
  Centralizing the literals here means a rotation only changes this file,
  and the §159 / §161 vitest specs keep every consumer pinned to the
  named constants.

  Audit history:
    §111 — introduced Formspree mvzyoyoz on /get-a-quote.
    §159 — extracted the literal into this module and rewired Contact +
           ComplianceAudit to consume it (previously xnjrqler and
           /api/contact respectively). CandidateContactForm intentionally
           remains on /api/candidate-contact: it routes to the candidate-care
           inbox, which is a structurally distinct channel from sales/quote
           submissions and uses different server-side validation.
    §161 — split out a dedicated Integrations inbox (xgoqzprv) so partner /
           ATS integration requests don't dilute the sales pipeline. Only
           the /integrations request form posts to this endpoint; all other
           sales/contact forms continue to use mvzyoyoz.
*/

/**
 * Sales / quote / contact / compliance-audit inbox.
 * Used by Contact.tsx, GetAQuote.tsx, and ComplianceAudit.tsx.
 */
export const FORMSPREE_FORM_ID = "mvzyoyoz";

/**
 * Full HTTPS endpoint for the sales/quote/contact form. All POSTs from
 * those public-site forms must target this URL.
 */
export const FORMSPREE_ENDPOINT =
  `https://formspree.io/f/${FORMSPREE_FORM_ID}` as const;

/**
 * Dedicated Integrations / partner-API inbox.
 * Used by the Request-an-Integration form on /integrations only.
 * Keeping integration requests on a separate inbox prevents partner
 * questions from getting lost in sales-pipeline volume and lets us route
 * them straight to the engineering / partnerships side of the house.
 */
export const FORMSPREE_INTEGRATIONS_FORM_ID = "xgoqzprv";

/**
 * Full HTTPS endpoint for the Integrations request form.
 */
export const FORMSPREE_INTEGRATIONS_ENDPOINT =
  `https://formspree.io/f/${FORMSPREE_INTEGRATIONS_FORM_ID}` as const;

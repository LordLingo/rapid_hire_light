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
    §168 — added a third dedicated inbox (xdajwoqo) for newsletter signups
           on /subscribe. Newsletter opt-ins are passive and have a different
           downstream flow (export to mailing-list provider, send confirmation
           email) than the sales pipeline; tagging them at the inbox boundary
           keeps the sales team's signal-to-noise ratio intact and lets us
           route signups straight to whoever owns the newsletter.
    §233 — added a dedicated inbox (mwvdwqoa) for the nav-hidden /referral
           partner-program page. Referral partner sign-ups are a distinct
           pipeline (channel/agency partners, not end customers), so they get
           their own inbox and don't dilute the sales queue.
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

/**
 * Dedicated newsletter / mailing-list opt-in inbox.
 * Used by /subscribe only. Newsletter signups are passive opt-ins and need
 * a different downstream flow than sales (export to mailing-list provider,
 * send confirmation email), so they get their own inbox.
 */
export const FORMSPREE_NEWSLETTER_FORM_ID = "xdajwoqo";

/**
 * Full HTTPS endpoint for the newsletter signup form on /subscribe.
 */
export const FORMSPREE_NEWSLETTER_ENDPOINT =
  `https://formspree.io/f/${FORMSPREE_NEWSLETTER_FORM_ID}` as const;

/**
 * Dedicated referral partner program inbox.
 * Used by the nav-hidden /referral page only. Referral partner sign-ups are
 * a separate pipeline from customer sales, so they route to their own inbox.
 */
export const FORMSPREE_REFERRAL_FORM_ID = "mwvdwqoa";

/**
 * Full HTTPS endpoint for the referral partner program form on /referral.
 */
export const FORMSPREE_REFERRAL_ENDPOINT =
  `https://formspree.io/f/${FORMSPREE_REFERRAL_FORM_ID}` as const;

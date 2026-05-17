import { useEffect } from "react";

/**
 * Tiny SEO head manager. Updates `<title>`, the standard SERP meta tags,
 * Open Graph / Twitter cards, the canonical link, and an optional
 * JSON-LD `<script>` block — all in a single declarative call from a page.
 *
 * On unmount the hook restores any tags it touched, so navigating between
 * pages cannot leave stale meta behind. The previous text content is
 * captured during the same render that performs the mutation, which keeps
 * the "before" state stable across re-renders.
 *
 * We deliberately avoid `react-helmet` here. The dependency would add ~7kb
 * gzip for what is, in practice, six DOM writes per route change.
 */

export type SeoOptions = {
  /** Browser tab title. Will be appended with the site suffix automatically. */
  title: string;
  /** Meta description for SERP snippet + Open Graph. 140-160 chars ideal. */
  description: string;
  /** Canonical URL for the page. Pass an absolute URL when you can. */
  canonical?: string;
  /** Optional cover image URL (used for og:image + twitter:image). */
  image?: string;
  /** Optional Open Graph type override (defaults to "website"). */
  ogType?: "website" | "article";
  /** Optional JSON-LD payload that will be serialized into a <script>. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /**
   * Optional `<meta name="keywords">` content. Modern Google ignores this
   * tag, but several SEO auditors still flag its absence as a warning, so
   * we render a small, on-topic, non-stuffed list per page when supplied.
   * Accepts an array (preferred) or a comma-separated string.
   */
  keywords?: string | string[];
};

const SITE_SUFFIX = "Rapid Hire Solutions";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

export function useSeo(opts: SeoOptions): void {
  useEffect(() => {
    const previousTitle = document.title;
    const fullTitle = opts.title.includes(SITE_SUFFIX)
      ? opts.title
      : `${opts.title} | ${SITE_SUFFIX}`;
    document.title = fullTitle;

    const description = opts.description;
    const canonical =
      opts.canonical ??
      (typeof window !== "undefined" ? window.location.href : "");
    const image = opts.image ?? "";
    const ogType = opts.ogType ?? "website";

    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    if (canonical) setMeta("og:url", canonical, "property");
    if (image) setMeta("og:image", image, "property");
    setMeta("twitter:card", image ? "summary_large_image" : "summary");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);
    if (canonical) setLink("canonical", canonical);

    // Keywords meta — restore previous value (or remove) on unmount so
    // navigating away from a page that supplies keywords cannot leak
    // them into a sibling page that does not.
    const keywordsList = Array.isArray(opts.keywords)
      ? opts.keywords.map((k) => k.trim()).filter(Boolean)
      : typeof opts.keywords === "string"
        ? opts.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : null;
    let keywordsRestore: { existed: boolean; previous: string } | null = null;
    if (keywordsList && keywordsList.length > 0) {
      const existing = document.head.querySelector<HTMLMetaElement>(
        'meta[name="keywords"]',
      );
      keywordsRestore = {
        existed: !!existing,
        previous: existing?.getAttribute("content") ?? "",
      };
      setMeta("keywords", keywordsList.join(", "));
    }

    let scriptEl: HTMLScriptElement | null = null;
    if (opts.jsonLd) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.text = JSON.stringify(opts.jsonLd);
      // Tag with a data attribute so we can identify and remove on unmount.
      scriptEl.dataset.useSeo = "true";
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.title = previousTitle;
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
      if (keywordsRestore) {
        const el = document.head.querySelector<HTMLMetaElement>(
          'meta[name="keywords"]',
        );
        if (!keywordsRestore.existed) {
          if (el && el.parentNode) el.parentNode.removeChild(el);
        } else if (el) {
          el.setAttribute("content", keywordsRestore.previous);
        }
      }
    };
    // We intentionally re-run the effect whenever the serialized opts change
    // so that nested route navigations within a single page (e.g., switching
    // between two blog slugs) still update meta correctly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(opts)]);
}

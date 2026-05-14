/*
  ShareButtons — minimal, on-brand social share row for blog post pages.

  - Pure share-intent URLs (no third-party scripts, no trackers).
  - X (Twitter), LinkedIn, Facebook, plus a Copy-link button.
  - Uses navigator.clipboard when available; falls back to document.execCommand.
  - Visual language matches the existing tag-chip / hairline border treatment.
*/
import { useEffect, useState } from "react";
import { Linkedin, Facebook, Link2, Check } from "lucide-react";
import { toast } from "sonner";

export type ShareButtonsProps = {
  url: string;
  title: string;
};

// X / Twitter glyph (lucide doesn't ship the post-rebrand mark)
function XLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Reset the copied checkmark after 1.6s.
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const links = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`,
      Icon: XLogo,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
      Icon: Linkedin,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      Icon: Facebook,
    },
  ];

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older / restricted browsers.
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy. You can select the URL from your address bar.");
    }
  }

  return (
    <div className="mt-12 border-t border-border pt-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <p className="eyebrow text-[color:var(--color-ink-muted)]">
          Share this article
        </p>
        <div className="flex items-center gap-2">
          {links.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${name}`}
              title={`Share on ${name}`}
              className="btn-press inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-[color:var(--color-ink-soft)] transition-colors hover:border-[color:color-mix(in_oklch,var(--color-accent-ink)_45%,transparent)] hover:bg-[color:color-mix(in_oklch,var(--color-accent-ink)_8%,transparent)] hover:text-[color:var(--color-accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)]/40"
            >
              <Icon className="size-4" />
            </a>
          ))}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy link to this article"
            title={copied ? "Link copied" : "Copy link"}
            className="btn-press inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-[color:var(--color-ink-soft)] transition-colors hover:border-[color:color-mix(in_oklch,var(--color-accent-ink)_45%,transparent)] hover:bg-[color:color-mix(in_oklch,var(--color-accent-ink)_8%,transparent)] hover:text-[color:var(--color-accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent-ink)]/40"
          >
            {copied ? (
              <Check className="size-4 text-[color:var(--color-accent-ink)]" />
            ) : (
              <Link2 className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

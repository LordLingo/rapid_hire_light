/*
  /learn — companion video hub to /blog.

  Mirrors the /blog architecture (PageHero + tag pills + responsive grid +
  CtaBanner) but with a video-first card pattern: thumbnail-first 16:9
  frame, duration chip, hover lift, and a click-to-load YouTube facade
  (we render the lightweight thumbnail until the user explicitly opts in,
  matching the lite-youtube-embed pattern). The facade keeps the page
  weightless until the visitor actually wants to watch.

  Data flows through `lib/videos.ts` — never directly off the YouTube
  Data API — so the page renders deterministically at build time and
  works offline. Videos with placeholder IDs (`PENDING\d{4}`) are
  filtered out by `listReadyVideos()`, which means the page is safe
  to ship before any real videos exist: it just falls into a friendly
  "Channel coming soon" state with a CTA to /subscribe.
*/

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Play, Youtube } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  listReadyVideos,
  getAllReadyVideoTags,
  formatVideoTag,
  youtubeThumbnailUrl,
  youtubeEmbedUrl,
  youtubeWatchUrl,
  type VideoEntry,
} from "@/lib/videos";

export default function Learn() {
  const allVideos = useMemo(() => listReadyVideos(), []);
  const allTags = useMemo(() => getAllReadyVideoTags(), []);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visible = useMemo(
    () => (activeTag ? allVideos.filter((v) => v.tags.includes(activeTag)) : allVideos),
    [allVideos, activeTag],
  );

  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/learn`
      : "https://rapidhiresolutions.com/learn";

  useSeo({
    title: "Learn — short, plain-English videos on background-check compliance",
    description:
      "Short, plain-English videos walking through FCRA, K-12 compliance, ban-the-box, drug-testing rules, and the rest of the background-check stack. The four-minute version of every guide we publish.",
    canonical,
    ogType: "website",
    keywords: [
      "background check video guide",
      "FCRA compliance video",
      "K-12 background check explainer",
      "ban the box video",
      "rapid hire learn",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Rapid Hire Solutions — Learn",
      url: canonical,
      description:
        "Companion video hub to the Rapid Hire Solutions compliance blog. Short, plain-English explainers on FCRA, K-12 hiring, ban the box, drug testing, and the rest of the background-check stack.",
    },
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="10 — Learn"
        title={
          <>
            Plain-English video <em className="font-display italic text-[color:var(--color-accent-ink)]">explainers</em>.
          </>
        }
        lede="Short, plain-English videos walking compliance officers and HR directors through the same statutes our blog covers in long form. Four to six minutes each. No sales pitch in the first half. Watch one over coffee."
        afterLede={
          <div className="flex flex-wrap gap-3" data-testid="learn-hero-ctas">
            <a
              href="https://www.youtube.com/@rapidhiresolutions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-5 py-2.5 text-[14px] font-medium text-white shadow-sm transition-all duration-200 hover:scale-[0.98] active:scale-[0.96]"
              data-testid="learn-hero-youtube"
            >
              <Youtube className="h-4 w-4" aria-hidden />
              Subscribe on YouTube
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-[14px] font-medium text-[color:var(--color-ink)] shadow-sm transition-all duration-200 hover:scale-[0.98] active:scale-[0.96]"
              data-testid="learn-hero-newsletter"
            >
              Get the newsletter
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        }
      />

      <section className="bg-[color:var(--color-paper)] border-y border-border">
        <div className="container py-12 md:py-16">
          {allVideos.length === 0 ? (
            <EmptyChannelState />
          ) : (
            <>
              {allTags.length > 1 && (
                <div
                  className="mb-10 flex flex-wrap gap-2"
                  role="group"
                  aria-label="Filter videos by topic"
                  data-testid="learn-tag-pills"
                >
                  <TagPill
                    label="All topics"
                    active={activeTag === null}
                    onClick={() => setActiveTag(null)}
                    count={allVideos.length}
                  />
                  {allTags.map((t) => {
                    const count = allVideos.filter((v) => v.tags.includes(t)).length;
                    return (
                      <TagPill
                        key={t}
                        label={formatVideoTag(t)}
                        active={activeTag === t}
                        onClick={() => setActiveTag(t)}
                        count={count}
                      />
                    );
                  })}
                </div>
              )}

              {visible.length === 0 ? (
                <p className="text-[color:var(--color-ink-soft)]">
                  No videos under that topic yet — try another pill or hit{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    className="underline underline-offset-2 hover:text-[color:var(--color-accent-ink)]"
                  >
                    All topics
                  </button>
                  .
                </p>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
                  data-testid="learn-video-grid"
                >
                  {visible.map((v) => (
                    <VideoCard key={v.slug} video={v} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}

/* -------------------------------------------------------------------- */
/* Tag pill                                                              */
/* -------------------------------------------------------------------- */

function TagPill({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12.5px] uppercase tracking-[0.15em] transition-all duration-200 hover:scale-[0.98] active:scale-[0.96] ${
        active
          ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
          : "border-border bg-white text-[color:var(--color-ink-muted)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
      }`}
      aria-pressed={active}
    >
      {label}
      <span
        className={`text-[11px] tabular-nums ${
          active ? "text-white/85" : "text-[color:var(--color-ink-muted)]/70"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------- */
/* Video card with click-to-load lite-YouTube facade                     */
/* -------------------------------------------------------------------- */

function VideoCard({ video }: { video: VideoEntry }) {
  const [activated, setActivated] = useState(false);
  const thumbnail = youtubeThumbnailUrl(video.youtubeId);
  const watch = youtubeWatchUrl(video.youtubeId);
  const embed = youtubeEmbedUrl(video.youtubeId);

  return (
    <article
      className="reveal-on-scroll group flex flex-col"
      data-testid={`video-card-${video.slug}`}
    >
      <div className="relative overflow-hidden rounded-[16px] border border-border bg-black aspect-video paper-shadow">
        {activated ? (
          <iframe
            src={`${embed}&autoplay=1`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            data-testid={`video-iframe-${video.slug}`}
          />
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Play "${video.title}" on YouTube`}
            className="group/btn absolute inset-0 flex items-center justify-center"
            data-testid={`video-facade-${video.slug}`}
          >
            <img
              src={thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover/btn:scale-[1.02]"
            />
            <span
              className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[color:var(--color-accent-ink)] shadow-lg transition-transform duration-200 ease-out group-hover/btn:scale-110 group-active/btn:scale-95"
              aria-hidden
            >
              <Play className="h-6 w-6 translate-x-0.5 fill-current" />
            </span>
            <span className="absolute bottom-2 right-2 z-10 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white">
              {video.duration}
            </span>
          </button>
        )}
      </div>

      <div className="mt-4 flex-1">
        <p className="eyebrow">{formatVideoTag(video.tags[0] ?? "")}</p>
        <h3 className="mt-2 font-display text-[20px] leading-[1.25] text-[color:var(--color-ink)]">
          {video.title}
        </h3>
        <p className="mt-2 text-[14px] leading-[1.55] text-[color:var(--color-ink-soft)]">
          {video.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-4 text-[12.5px]">
          {video.blogSlug ? (
            <Link
              href={`/blog/${video.blogSlug}`}
              className="inline-flex items-center gap-1 text-[color:var(--color-accent-ink)] underline underline-offset-2 hover:no-underline"
              data-testid={`video-companion-link-${video.slug}`}
            >
              Read the full guide
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : null}
          <a
            href={watch}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-accent-ink)]"
            data-testid={`video-youtube-link-${video.slug}`}
          >
            Open on YouTube
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------- */
/* Empty state for pre-launch                                            */
/* -------------------------------------------------------------------- */

function EmptyChannelState() {
  return (
    <div
      className="rounded-[20px] border border-border bg-white px-8 py-16 text-center paper-shadow"
      data-testid="learn-empty-state"
    >
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-accent-ink)]/10 text-[color:var(--color-accent-ink)]">
        <Youtube className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="mt-6 font-display text-[28px] leading-[1.2] text-[color:var(--color-ink)]">
        Channel coming soon.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.6] text-[color:var(--color-ink-soft)]">
        We're shooting the first run of explainers right now — short, plain-English
        walkthroughs of FCRA, K-12, ban-the-box, and the rest. Drop your email
        below and we'll send you the first one as soon as it lands.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/subscribe"
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-5 py-2.5 text-[14px] font-medium text-white shadow-sm transition-all duration-200 hover:scale-[0.98] active:scale-[0.96]"
          data-testid="learn-empty-subscribe"
        >
          Get the newsletter
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-[14px] font-medium text-[color:var(--color-ink)] shadow-sm transition-all duration-200 hover:scale-[0.98] active:scale-[0.96]"
        >
          Read the blog
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

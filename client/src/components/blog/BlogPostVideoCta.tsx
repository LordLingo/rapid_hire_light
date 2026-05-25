/*
  <BlogPostVideoCta />

  Renders the "Watch the X-minute version" callout above the body of a
  blog post when a companion video exists. Pulls the mapping from
  `lib/videos.ts` — the source of truth lives on the video, not on the
  post, so a single registry edit propagates to both surfaces.

  Returns `null` when no companion video exists, which keeps BlogPost.tsx
  unconditionally simple — drop the component above the body and forget it.

  Uses the same lite-YouTube facade pattern as the /learn hub: a static
  thumbnail until the user clicks, then a real iframe. Zero embed cost
  for posts the visitor doesn't watch.

  Audit: §168 (YouTube readiness suite).
*/

import { useState } from "react";
import { Play } from "lucide-react";
import {
  getCompanionVideoForBlog,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
} from "@/lib/videos";

type Props = {
  /** Blog post slug. We look up the companion video by this. */
  blogSlug: string;
};

export default function BlogPostVideoCta({ blogSlug }: Props) {
  const video = getCompanionVideoForBlog(blogSlug);
  const [activated, setActivated] = useState(false);

  // No companion video? Render nothing — BlogPost.tsx can drop us in
  // unconditionally without checking.
  if (!video) return null;

  const thumbnail = youtubeThumbnailUrl(video.youtubeId);
  const embed = youtubeEmbedUrl(video.youtubeId);
  const watch = youtubeWatchUrl(video.youtubeId);

  return (
    <aside
      className="not-prose mb-10 overflow-hidden rounded-[18px] border border-border bg-[color:var(--color-paper)] paper-shadow"
      data-testid={`blog-video-cta-${video.slug}`}
      aria-label="Watch the companion video"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Video facade */}
        <div className="relative aspect-video bg-black md:aspect-auto md:min-h-[220px]">
          {activated ? (
            <iframe
              src={`${embed}&autoplay=1`}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              data-testid={`blog-video-iframe-${video.slug}`}
            />
          ) : (
            <button
              type="button"
              onClick={() => setActivated(true)}
              aria-label={`Play "${video.title}" on YouTube`}
              className="group/btn absolute inset-0 flex items-center justify-center"
              data-testid={`blog-video-facade-${video.slug}`}
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

        {/* Copy block */}
        <div className="flex flex-col justify-center gap-3 px-6 py-6 md:px-8 md:py-8">
          <p className="eyebrow">Watch the {video.duration} version</p>
          <h2 className="font-display text-[22px] leading-[1.25] text-[color:var(--color-ink)]">
            {video.title}
          </h2>
          <p className="text-[14px] leading-[1.55] text-[color:var(--color-ink-soft)]">
            {video.excerpt}
          </p>
          <a
            href={watch}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-1 text-[12.5px] text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-accent-ink)]"
            data-testid={`blog-video-youtube-link-${video.slug}`}
          >
            Open on YouTube ↗
          </a>
        </div>
      </div>
    </aside>
  );
}

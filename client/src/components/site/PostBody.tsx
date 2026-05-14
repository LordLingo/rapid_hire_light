/*
  PostBody — minimal Markdown-ish renderer for blog post bodies.

  We deliberately avoid a heavy markdown library (~30kb gzip) because the
  authored dialect in `client/src/content/blog/*.ts` is a tiny subset:

    - `## Heading` → <h2>
    - `### Heading` → <h3>
    - `- item`     → <ul><li>
    - blank line   → paragraph break
    - inline `[text](url)` → <a>; absolute URLs open in a new tab
    - inline `**bold**`    → <strong>

  Internal links (starting with "/") render with wouter's <Link> so they
  don't trigger a full page reload, preserving the SPA experience.
*/
import { Link } from "wouter";
import React from "react";

type Inline = string | React.ReactNode;

function renderInline(text: string, keyPrefix: string): Inline[] {
  // Match either a markdown link [text](url) or **bold** segments.
  const re = /(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)/g;
  const out: Inline[] = [];
  let lastIndex = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out.push(text.slice(lastIndex, m.index));
    }
    const token = m[0];
    if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isInternal = href.startsWith("/");
        out.push(
          isInternal ? (
            <Link
              key={`${keyPrefix}-l-${i++}`}
              href={href}
              className="text-[color:var(--color-accent-ink)] underline underline-offset-4 decoration-[color:var(--color-accent-ink)]/40 hover:decoration-[color:var(--color-accent-ink)]"
            >
              {label}
            </Link>
          ) : (
            <a
              key={`${keyPrefix}-a-${i++}`}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[color:var(--color-accent-ink)] underline underline-offset-4 decoration-[color:var(--color-accent-ink)]/40 hover:decoration-[color:var(--color-accent-ink)]"
            >
              {label}
            </a>
          ),
        );
      }
    } else if (token.startsWith("**")) {
      out.push(
        <strong
          key={`${keyPrefix}-b-${i++}`}
          className="font-medium text-[color:var(--color-ink)]"
        >
          {token.slice(2, -2)}
        </strong>,
      );
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex));
  }
  return out;
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "p"; text: string };

function parse(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let buffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (buffer.length) {
      blocks.push({ type: "p", text: buffer.join(" ").trim() });
      buffer = [];
    }
  };
  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ type: "ul", items: listBuffer });
      listBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      listBuffer.push(line.slice(2).trim());
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      buffer.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

export function PostBody({ markdown }: { markdown: string }) {
  const blocks = React.useMemo(() => parse(markdown), [markdown]);
  return (
    <div className="space-y-7 text-[17px] leading-[1.8] text-[color:var(--color-ink-soft)]">
      {blocks.map((b, idx) => {
        if (b.type === "h2") {
          return (
            <h2
              key={idx}
              className="font-display text-[28px] sm:text-[32px] leading-snug tracking-[-0.015em] text-[color:var(--color-ink)] mt-12 mb-1 scroll-mt-24"
            >
              {b.text}
            </h2>
          );
        }
        if (b.type === "h3") {
          return (
            <h3
              key={idx}
              className="font-display text-[22px] leading-snug tracking-[-0.01em] text-[color:var(--color-ink)] mt-6 mb-1"
            >
              {b.text}
            </h3>
          );
        }
        if (b.type === "ul") {
          return (
            <ul
              key={idx}
              className="list-disc pl-6 marker:text-[color:var(--color-ink-muted)] space-y-2"
            >
              {b.items.map((item, i) => (
                <li key={i}>{renderInline(item, `${idx}-${i}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={idx}>{renderInline(b.text, `${idx}`)}</p>;
      })}
    </div>
  );
}

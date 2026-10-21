import { createElement, type ReactNode } from "react";
import { parseBlocks, safeHref, type Block } from "@/lib/markdown";

/**
 * Renders the block list from `lib/markdown.ts`.
 *
 * Deliberately emits React elements rather than an HTML string — there is no
 * dangerouslySetInnerHTML anywhere, so a document containing markup cannot inject
 * anything: worst case it appears as literal text. Links are scheme-checked by
 * safeHref before they become an anchor.
 */

const LINK = /\[([^\]]*)\]\(([^)\s]+)\)/;
const INLINE =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(~~[^~]+~~)|(\*[^*\n]+\*)|(\[[^\]]*\]\([^)\s]+\))/;

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let n = 0;

  while (rest.length > 0) {
    const match = INLINE.exec(rest);
    if (!match) {
      nodes.push(rest);
      break;
    }

    if (match.index > 0) nodes.push(rest.slice(0, match.index));

    const token = match[0];
    const key = `${keyBase}-${n++}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[0.85em] text-signal-blue"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {renderInline(token.slice(2, -2), key)}
        </strong>
      );
    } else if (token.startsWith("~~")) {
      nodes.push(
        <s key={key} className="text-ink-muted">
          {renderInline(token.slice(2, -2), key)}
        </s>
      );
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{renderInline(token.slice(1, -1), key)}</em>);
    } else {
      const link = LINK.exec(token);
      const label = link ? renderInline(link[1], key) : token;
      const href = link ? safeHref(link[2]) : null;
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-signal-blue underline decoration-signal-blue/40 decoration-1 underline-offset-2 transition-colors hover:decoration-signal-blue"
          >
            {label}
          </a>
        ) : (
          <span key={key}>{label}</span>
        )
      );
    }

    rest = rest.slice(match.index + token.length);
  }

  return nodes;
}

const HEADING_STYLES: Record<number, string> = {
  1: "mt-2 text-3xl sm:text-4xl",
  2: "mt-10 text-2xl sm:text-3xl",
  3: "mt-8 text-xl sm:text-2xl",
  4: "mt-6 text-lg",
  5: "mt-6 text-base",
  6: "mt-6 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted",
};

function renderBlock(block: Block, key: string): ReactNode {
  switch (block.type) {
    case "heading": {
      // createElement rather than a dynamic JSX tag: JSX requires a literal or a
      // component identifier, and bailing to a component factory here is exactly
      // what the React Compiler's "Cannot create components during render" rule
      // rejects. createElement makes the element directly, which is allowed.
      return createElement(
        `h${block.depth}`,
        {
          key,
          className: `font-display font-semibold tracking-tight text-ink ${HEADING_STYLES[block.depth]}`,
        },
        renderInline(block.text, key)
      );
    }

    case "paragraph":
      return (
        <p key={key} className="text-[15px] leading-relaxed text-ink-muted">
          {renderInline(block.text, key)}
        </p>
      );

    case "code":
      return (
        <div key={key} className="space-y-2">
          {block.lang && (
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
              {block.lang}
            </p>
          )}
          <pre className="overflow-x-auto rounded-xl border border-border bg-surface-raised p-4">
            <code className="font-mono text-[13px] leading-relaxed text-ink">
              {block.code}
            </code>
          </pre>
        </div>
      );

    case "quote":
      return (
        <blockquote
          key={key}
          className="space-y-4 border-l-2 border-signal-blue pl-4 text-ink-muted"
        >
          {parseBlocks(block.source).map((inner, i) =>
            renderBlock(inner, `${key}-q${i}`)
          )}
        </blockquote>
      );

    case "list": {
      const className = `space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink-muted ${
        block.ordered ? "list-decimal" : "list-disc"
      }`;
      const items = block.items.map((item, i) => (
        <li key={`${key}-i${i}`}>{renderInline(item, `${key}-i${i}`)}</li>
      ));
      return block.ordered ? (
        <ol key={key} className={className}>
          {items}
        </ol>
      ) : (
        <ul key={key} className={className}>
          {items}
        </ul>
      );
    }

    case "hr":
      return <hr key={key} className="my-8 border-t border-border" />;

    case "table":
      return (
        <div key={key} className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {block.head.map((cell, i) => (
                  <th
                    key={`${key}-h${i}`}
                    className="border-b border-border pb-2 pr-4 font-display font-semibold text-ink"
                  >
                    {renderInline(cell, `${key}-h${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={`${key}-r${r}`}>
                  {row.map((cell, c) => (
                    <td
                      key={`${key}-r${r}c${c}`}
                      className="border-b border-border py-2 pr-4 align-top text-ink-muted"
                    >
                      {renderInline(cell, `${key}-r${r}c${c}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function Markdown({ source }: { source: string }) {
  const blocks = parseBlocks(source);
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => renderBlock(block, `b${i}`))}
    </div>
  );
}

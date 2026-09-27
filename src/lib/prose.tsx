import { Fragment, type ReactNode } from "react";

/** Renders `**bold**` and `` `code` `` spans plus newlines — enough for demo chat/assistant text, no markdown dep. */
export function Prose({ text }: { text: string }): ReactNode {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {renderInline(line)}
        </Fragment>
      ))}
    </>
  );
}

function renderInline(line: string): ReactNode {
  const tokenPattern = /\*\*(.+?)\*\*|`(.+?)`/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = tokenPattern.exec(line))) {
    if (m.index > lastIndex) nodes.push(line.slice(lastIndex, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={key++} className="font-semibold text-foreground">{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      nodes.push(
        <code key={key++} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          {m[2]}
        </code>,
      );
    }
    lastIndex = tokenPattern.lastIndex;
  }
  if (lastIndex < line.length) nodes.push(line.slice(lastIndex));
  return nodes;
}

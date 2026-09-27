const KEYWORDS: Record<string, string[]> = {
  python: [
    "def", "class", "import", "from", "return", "if", "elif", "else", "for", "while",
    "in", "is", "not", "and", "or", "try", "except", "finally", "async", "await",
    "with", "as", "True", "False", "None", "self", "pass", "raise", "lambda",
  ],
  tsx: [
    "import", "from", "export", "default", "const", "let", "var", "function", "return",
    "if", "else", "for", "while", "in", "of", "try", "catch", "finally", "async", "await",
    "new", "this", "class", "extends", "implements", "interface", "type", "void",
    "null", "undefined", "true", "false", "as", "typeof", "use client",
  ],
};
KEYWORDS.ts = KEYWORDS.tsx;
KEYWORDS.json = [];

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Small regex-based tokenizer — good enough for read-only demo code, no external dep. */
export function highlight(code: string, lang: string): string {
  const keywords = KEYWORDS[lang] ?? [];
  const commentPattern = lang === "python" ? "#.*" : "//.*";
  const stringPattern = String.raw`"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|` + "`(?:\\\\.|[^`\\\\])*`";
  const numberPattern = String.raw`\b\d+(?:\.\d+)?\b`;
  const kwPattern = keywords.length ? String.raw`\b(?:${keywords.join("|")})\b` : "(?!)";

  const combined = new RegExp(
    `(${commentPattern})|(${stringPattern})|(${kwPattern})|(${numberPattern})`,
    "gm",
  );

  let lastIndex = 0;
  let out = "";
  let m: RegExpExecArray | null;

  while ((m = combined.exec(code))) {
    out += escapeHtml(code.slice(lastIndex, m.index));
    if (m[1] !== undefined) {
      out += `<span class="text-muted-foreground italic">${escapeHtml(m[1])}</span>`;
    } else if (m[2] !== undefined) {
      out += `<span class="text-amber-600 dark:text-amber-300">${escapeHtml(m[2])}</span>`;
    } else if (m[3] !== undefined) {
      out += `<span class="text-sky-600 dark:text-sky-400 font-medium">${escapeHtml(m[3])}</span>`;
    } else if (m[4] !== undefined) {
      out += `<span class="text-fuchsia-600 dark:text-fuchsia-400">${escapeHtml(m[4])}</span>`;
    }
    lastIndex = combined.lastIndex;
  }
  out += escapeHtml(code.slice(lastIndex));
  return out;
}

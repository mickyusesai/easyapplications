import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

/**
 * Strip RTF control words and groups, returning plain text.
 * Uses a state-machine approach to correctly handle nested groups
 * and skip binary/image data that simple regex cannot handle.
 */
function stripRtf(rtf: string): string {
  const output: string[] = [];
  let i = 0;
  let depth = 0;
  /** Group names we want to skip entirely (and all their nested content). */
  let skipDepth = 0;
  const SKIP_GROUPS = /^\\(pict|fonttbl|colortbl|stylesheet|info|themedata|datastore|blipuid|object|objdata|fldinst)\b/;

  while (i < rtf.length) {
    const ch = rtf[i];

    if (ch === "{") {
      depth++;
      i++;
      // Check if this group should be skipped
      if (skipDepth > 0) {
        // Already inside a skipped group
        continue;
      }
      // Look ahead to see if this group starts with a skip keyword
      const lookahead = rtf.substring(i, i + 40);
      if (SKIP_GROUPS.test(lookahead)) {
        skipDepth = depth;
      }
      continue;
    }

    if (ch === "}") {
      if (skipDepth === depth) {
        skipDepth = 0;
      }
      depth--;
      i++;
      continue;
    }

    // If we're inside a skipped group, consume without emitting
    if (skipDepth > 0) {
      i++;
      continue;
    }

    // Backslash — control word or escape
    if (ch === "\\") {
      i++;
      if (i >= rtf.length) break;
      const next = rtf[i];

      // Hex escape \'xx
      if (next === "'") {
        const hex = rtf.substring(i + 1, i + 3);
        output.push(String.fromCharCode(parseInt(hex, 16)));
        i += 3;
        continue;
      }

      // Escaped literal characters: \\, \{, \}
      if (next === "\\" || next === "{" || next === "}") {
        output.push(next);
        i++;
        continue;
      }

      // Line break shortcuts
      if (next === "\n" || next === "\r") {
        output.push("\n");
        i++;
        continue;
      }

      // Read the control word
      let word = "";
      while (i < rtf.length && /[a-zA-Z]/.test(rtf[i])) {
        word += rtf[i];
        i++;
      }
      // Skip optional numeric parameter
      if (i < rtf.length && /[-\d]/.test(rtf[i])) {
        i++;
        while (i < rtf.length && /\d/.test(rtf[i])) i++;
      }
      // A single trailing space is part of the control word delimiter
      if (i < rtf.length && rtf[i] === " ") i++;

      // Convert meaningful control words to text
      if (word === "par" || word === "pard") output.push("\n");
      else if (word === "tab") output.push("\t");
      else if (word === "line") output.push("\n");
      else if (word === "lquote" || word === "rquote") output.push("'");
      else if (word === "ldblquote" || word === "rdblquote") output.push('"');
      else if (word === "bullet") output.push("*");
      else if (word === "endash") output.push("-");
      else if (word === "emdash") output.push("--");
      continue;
    }

    // Plain text character
    output.push(ch);
    i++;
  }

  let text = output.join("");
  // Clean up whitespace
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n /g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

/**
 * Approximate token count (1 token ≈ 4 chars for English text).
 * Conservative estimate to stay safely under the 200K API limit.
 */
const MAX_CHARS = 600_000; // ~150K tokens, leaving room for system prompt

export async function extractText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const ext = fileName.toLowerCase().split(".").pop();

  let text: string;

  if (ext === "pdf") {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    await parser.destroy();
    text = result.text;
  } else if (ext === "doc" || ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (ext === "rtf") {
    text = stripRtf(buffer.toString("latin1"));
  } else {
    throw new Error(`Unsupported file type: .${ext}`);
  }

  // Truncate to stay within Claude's context window
  if (text.length > MAX_CHARS) {
    console.warn(
      `[EasyApp] Document text truncated from ${text.length} to ${MAX_CHARS} chars`
    );
    text = text.substring(0, MAX_CHARS) + "\n\n[Document truncated due to length]";
  }

  return text;
}

import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

/** Strip RTF control words and groups, returning plain text. */
function stripRtf(rtf: string): string {
  // Remove binary/picture data groups
  let text = rtf.replace(/\{\\pict[^}]*\}/g, "");
  // Remove font tables, color tables, style sheets etc.
  text = text.replace(/\{\\fonttbl[^}]*\}/g, "");
  text = text.replace(/\{\\colortbl[^}]*\}/g, "");
  text = text.replace(/\{\\stylesheet[^}]*\}/g, "");
  text = text.replace(/\{\\info[^}]*\}/g, "");
  // Replace common RTF escapes
  text = text.replace(/\\par[d]?\b/g, "\n");
  text = text.replace(/\\tab\b/g, "\t");
  text = text.replace(/\\line\b/g, "\n");
  text = text.replace(/\\\n/g, "\n");
  // Replace unicode escapes like \'e9 → character
  text = text.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  // Remove remaining RTF control words and braces
  text = text.replace(/\\[a-z]+[-]?\d*\s?/gi, "");
  text = text.replace(/[{}]/g, "");
  // Clean up whitespace
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n /g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

export async function extractText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const ext = fileName.toLowerCase().split(".").pop();

  if (ext === "pdf") {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  if (ext === "doc" || ext === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (ext === "rtf") {
    return stripRtf(buffer.toString("latin1"));
  }

  throw new Error(`Unsupported file type: .${ext}`);
}

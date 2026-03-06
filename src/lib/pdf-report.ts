import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

// ── Brand constants ──────────────────────────────────────────────────
const BRAND = {
  primary: "#3C3CE6",
  secondary: "#66C7FF",
  heading: "#1A1A6E",
  subheading: "#4F5CE8",
  text: "#333333",
  muted: "#666666",
  light: "#999999",
  bgLight: "#EEF4FF",
  border: "#E5E7EB",
  white: "#FFFFFF",
} as const;

const RATING_COLORS: Record<string, string> = {
  vg: "#1A1A6E", // brand heading — dark navy for top rating
  g: "#3C3CE6",  // brand primary — indigo blue
  f: "#4F5CE8",  // brand subheading — medium blue-violet
  w: "#999999",  // brand muted — grey for weak
};

const RATING_LABELS: Record<string, string> = {
  vg: "Very Good",
  g: "Good",
  f: "Fair",
  w: "Weak",
};

// ── Helpers ──────────────────────────────────────────────────────────
function getRatingFromLine(line: string): string | null {
  const match = line.match(/\*\*Rating:\s*(vg|g|f|w)\*\*/i);
  return match ? match[1].toLowerCase() : null;
}

function isScoreLine(line: string): boolean {
  return /\*\*Section \d+ Score:|^\*\*Total Score:|^## Total Score:/i.test(
    line
  );
}

function isThresholdLine(line: string): boolean {
  return (
    /^[-*]\s*Minimum \d+\/\d+.*:\s*(MET|NOT MET)\s*$/i.test(line) ||
    /^\*\*Overall:.*(?:PASSES|DOES NOT PASS).*threshold\*\*$/i.test(line)
  );
}

function drawGradientBar(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const grad = doc.linearGradient(x, y, x + width, y);
  grad.stop(0, BRAND.primary).stop(1, BRAND.secondary);
  doc.rect(x, y, width, height).fill(grad);
}

// ── Logo loading ─────────────────────────────────────────────────────
let logoBuffer: Buffer | null = null;
try {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  logoBuffer = fs.readFileSync(logoPath);
} catch {
  // Logo not available — will skip in header
}

// ── Layout constants ─────────────────────────────────────────────────
const FOOTER_Y = 790;
const CONTENT_BOTTOM = FOOTER_Y - 20; // stop content before footer area
const CONTENT_TOP_FIRST_PAGE = 130;
const CONTENT_TOP_OTHER_PAGES = 46;

// ── Main report generator ────────────────────────────────────────────
export async function generateReport(
  markdownContent: string,
  fileName: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Use bufferPages so we can stamp headers/footers in a second pass
    const doc = new PDFDocument({
      size: "A4",
      bufferPages: true,
      margins: { top: 20, bottom: 60, left: 50, right: 50 },
      info: {
        Title: "Erasmus+ Application Evaluation Report",
        Author: "EasyApplications",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 100;

    // ── Pass 1: Render all content ──
    // Start content below where the first-page header will be stamped
    doc.y = CONTENT_TOP_FIRST_PAGE;
    doc.x = 50;

    const lines = markdownContent.split("\n");
    for (const line of lines) {
      // Check if we need a new page (leave room for footer area)
      if (doc.y > CONTENT_BOTTOM) {
        doc.addPage();
        doc.y = CONTENT_TOP_OTHER_PAGES;
        doc.x = 50;
      }

      // Rating lines: **Rating: vg** → colored badge
      const rating = getRatingFromLine(line);
      if (rating) {
        const color = RATING_COLORS[rating] || BRAND.text;
        const label = RATING_LABELS[rating] || rating;
        doc.moveDown(0.2);
        const badgeX = 50;
        const badgeY = doc.y;
        const badgeText = `${label.toUpperCase()} (${rating})`;
        doc.fontSize(9);
        const badgeWidth = doc.widthOfString(badgeText) + 16;
        doc.roundedRect(badgeX, badgeY, badgeWidth, 18, 4).fill(color);
        doc
          .fillColor(BRAND.white)
          .text(badgeText, badgeX + 8, badgeY + 4, { lineBreak: false });
        doc.y = badgeY + 24;
        doc.x = 50;
        continue;
      }

      // Score summary lines
      if (isScoreLine(line)) {
        doc.moveDown(0.5);
        const cleanLine = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
        const boxY = doc.y;
        doc.rect(50, boxY, contentWidth, 28).fill(BRAND.bgLight);
        doc
          .fontSize(12)
          .fillColor(BRAND.primary)
          .text(cleanLine, 60, boxY + 7, { width: contentWidth - 20 });
        doc.y = boxY + 34;
        doc.x = 50;
        continue;
      }

      // Threshold check lines (only the structured ones at the end)
      if (isThresholdLine(line)) {
        const cleanLine = line.replace(/\*\*/g, "").replace(/^[-*]\s*/, "");
        const passes =
          /:\s*MET\s*$/i.test(line) || /PASSES\s+funding/i.test(line);
        const color = passes ? BRAND.primary : "#dc2626";
        doc.fontSize(10).fillColor(color).text(cleanLine, { indent: 10 });
        continue;
      }

      // Headings
      if (line.startsWith("### ")) {
        doc.moveDown(0.3);
        doc
          .fontSize(12)
          .fillColor(BRAND.subheading)
          .text(line.replace("### ", ""));
        doc.moveDown(0.2);
      } else if (line.startsWith("## ")) {
        // Start each major section on a new page (unless near top of page already)
        if (doc.y > CONTENT_TOP_OTHER_PAGES + 40) {
          doc.addPage();
          doc.y = CONTENT_TOP_OTHER_PAGES;
          doc.x = 50;
        }
        doc.moveDown(0.5);
        doc
          .moveTo(50, doc.y)
          .lineTo(50 + contentWidth, doc.y)
          .strokeColor(BRAND.border)
          .lineWidth(0.5)
          .stroke();
        doc.moveDown(0.3);
        doc
          .fontSize(14)
          .fillColor(BRAND.primary)
          .text(line.replace("## ", ""));
        doc.moveDown(0.3);
      } else if (line.startsWith("# ")) {
        doc.moveDown(0.5);
        doc
          .fontSize(16)
          .fillColor(BRAND.heading)
          .text(line.replace("# ", ""));
        doc.moveDown(0.3);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const cleanBullet = line
          .replace(/^[-*] /, "")
          .replace(/\*\*(.*?)\*\*/g, "$1");
        doc
          .fontSize(10)
          .fillColor(BRAND.text)
          .text(`  \u2022  ${cleanBullet}`, { indent: 10 });
      } else if (line.match(/^\d+\./)) {
        const cleanLine = line.replace(/\*\*(.*?)\*\*/g, "$1");
        doc.fontSize(10).fillColor(BRAND.text).text(cleanLine, { indent: 10 });
      } else if (line.startsWith("**") && line.endsWith("**")) {
        doc
          .fontSize(10)
          .fillColor(BRAND.heading)
          .text(line.replace(/\*\*/g, ""));
      } else if (line.trim()) {
        const cleanLine = line
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1");
        doc.fontSize(10).fillColor(BRAND.text).text(cleanLine);
      } else {
        doc.moveDown(0.3);
      }
    }

    // ── Pass 2: Stamp headers and footers on every page ──
    const range = doc.bufferedPageRange(); // { start: 0, count: N }
    const totalPages = range.count;

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);

      // Disable bottom margin so text near page bottom doesn't trigger overflow
      const savedBottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;

      if (i === 0) {
        // ── First page: full branded header ──
        drawGradientBar(doc, 0, 0, pageWidth, 6);

        const logoSize = 36;
        const logoX = 50;
        const logoY = 16;
        if (logoBuffer) {
          doc.image(logoBuffer, logoX, logoY, {
            height: logoSize,
            width: logoSize,
          });
        }

        const titleX = logoBuffer ? logoX + logoSize + 12 : 50;
        doc
          .fontSize(18)
          .fillColor(BRAND.heading)
          .text("EasyApplications", titleX, 20, { lineBreak: false });
        doc
          .fontSize(9)
          .fillColor(BRAND.muted)
          .text("AI-Powered Erasmus+ Application Review", titleX, 40, {
            lineBreak: false,
          });

        // Separator
        doc
          .moveTo(50, 62)
          .lineTo(50 + contentWidth, 62)
          .strokeColor(BRAND.border)
          .lineWidth(0.5)
          .stroke();

        // Document info
        doc.fontSize(14).fillColor(BRAND.heading).text("Evaluation Report", 50, 72, { lineBreak: false });
        doc
          .fontSize(9)
          .fillColor(BRAND.light)
          .text(`Document: ${fileName}`, 50, 90, { lineBreak: false });
        doc.text(
          `Generated: ${new Date().toLocaleDateString("en-GB")}`,
          50,
          102,
          { lineBreak: false }
        );

        // Second separator
        doc
          .moveTo(50, 118)
          .lineTo(50 + contentWidth, 118)
          .strokeColor(BRAND.border)
          .lineWidth(0.5)
          .stroke();
      } else {
        // ── Subsequent pages: compact header ──
        drawGradientBar(doc, 0, 0, pageWidth, 3);

        doc
          .fontSize(8)
          .fillColor(BRAND.muted)
          .text("EasyApplications", 50, 10, { lineBreak: false });
        doc
          .fontSize(8)
          .fillColor(BRAND.light)
          .text("Erasmus+ Evaluation Report", 50, 10, {
            width: pageWidth - 100,
            align: "right",
            lineBreak: false,
          });

        doc
          .moveTo(50, 26)
          .lineTo(pageWidth - 50, 26)
          .strokeColor(BRAND.border)
          .lineWidth(0.5)
          .stroke();
      }

      // ── Footer on every page ──
      drawGradientBar(doc, 50, FOOTER_Y, pageWidth - 100, 2);

      doc
        .fontSize(7)
        .fillColor(BRAND.muted)
        .text("EasyApplications", 50, FOOTER_Y + 6, { lineBreak: false });
      doc
        .fontSize(7)
        .fillColor(BRAND.light)
        .text(`Page ${i + 1} of ${totalPages}`, 50, FOOTER_Y + 6, {
          width: pageWidth - 100,
          align: "right",
          lineBreak: false,
        });
      doc
        .fontSize(6.5)
        .fillColor(BRAND.light)
        .text(
          "Generated by EasyApplications AI \u00B7 For guidance only",
          50,
          FOOTER_Y + 18,
          { width: pageWidth - 100, align: "center", lineBreak: false }
        );

      doc.page.margins.bottom = savedBottom;
    }

    doc.end();
  });
}

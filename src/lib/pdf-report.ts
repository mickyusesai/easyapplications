import PDFDocument from "pdfkit";

const RATING_COLORS: Record<string, string> = {
  vg: "#16a34a", // green
  g: "#2563eb", // blue
  f: "#d97706", // amber
  w: "#dc2626", // red
};

const RATING_LABELS: Record<string, string> = {
  vg: "Very Good",
  g: "Good",
  f: "Fair",
  w: "Weak",
};

function getRatingFromLine(line: string): string | null {
  const match = line.match(/\*\*Rating:\s*(vg|g|f|w)\*\*/i);
  return match ? match[1].toLowerCase() : null;
}

function isScoreLine(line: string): boolean {
  return /\*\*Section \d+ Score:|^\*\*Total Score:|^## Total Score:/i.test(line);
}

function isThresholdLine(line: string): boolean {
  return /MET|NOT MET|PASSES|DOES NOT PASS/i.test(line);
}

export async function generateReport(
  markdownContent: string,
  fileName: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 50, right: 50 },
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
    const contentWidth = pageWidth - 100; // 50px margins each side

    // Header gradient bar
    doc.rect(0, 0, pageWidth, 8).fill("#3C3CE6");

    // Title
    doc.fontSize(22).fillColor("#3C3CE6").text("EasyApplications", 50, 30);
    doc
      .fontSize(10)
      .fillColor("#666666")
      .text("AI-Powered Erasmus+ Application Review", 50, 55);

    doc.moveDown(2);
    doc.fontSize(16).fillColor("#1A1A6E").text("Evaluation Report");
    doc.fontSize(10).fillColor("#999999").text(`Document: ${fileName}`);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`);

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(50 + contentWidth, doc.y).stroke("#CCCCCC");
    doc.moveDown(1);

    // Render markdown-like content
    const lines = markdownContent.split("\n");
    for (const line of lines) {
      // Check if we need a new page
      if (doc.y > doc.page.height - 100) {
        doc.addPage();
      }

      // Rating lines: **Rating: vg** → colored badge
      const rating = getRatingFromLine(line);
      if (rating) {
        const color = RATING_COLORS[rating] || "#333333";
        const label = RATING_LABELS[rating] || rating;
        doc.moveDown(0.2);
        // Draw a colored pill/badge
        const badgeX = 50;
        const badgeY = doc.y;
        const badgeText = `${label.toUpperCase()} (${rating})`;
        doc.fontSize(9);
        const badgeWidth = doc.widthOfString(badgeText) + 16;
        doc.roundedRect(badgeX, badgeY, badgeWidth, 18, 4).fill(color);
        doc.fillColor("#ffffff").text(badgeText, badgeX + 8, badgeY + 4, { lineBreak: false });
        doc.y = badgeY + 24;
        doc.x = 50;
        continue;
      }

      // Score summary lines: **Section 1 Score: 24/30**
      if (isScoreLine(line)) {
        doc.moveDown(0.5);
        const cleanLine = line.replace(/\*\*/g, "").replace(/^#+\s*/, "");
        // Draw a highlighted score box
        const boxY = doc.y;
        doc.rect(50, boxY, contentWidth, 28).fill("#EEF4FF");
        doc.fontSize(12).fillColor("#3C3CE6").text(cleanLine, 60, boxY + 7, { width: contentWidth - 20 });
        doc.y = boxY + 34;
        doc.x = 50;
        continue;
      }

      // Threshold / pass-fail lines
      if (isThresholdLine(line)) {
        const cleanLine = line.replace(/\*\*/g, "").replace(/^[-*]\s*/, "");
        const passes = /MET(?! )|\bPASSES\b/i.test(cleanLine) && !/NOT/i.test(cleanLine);
        const color = passes ? "#16a34a" : "#dc2626";
        doc.fontSize(10).fillColor(color).text(cleanLine, { indent: 10 });
        continue;
      }

      // Headings
      if (line.startsWith("### ")) {
        doc.moveDown(0.3);
        doc
          .fontSize(12)
          .fillColor("#4F5CE8")
          .text(line.replace("### ", ""));
        doc.moveDown(0.2);
      } else if (line.startsWith("## ")) {
        doc.moveDown(0.5);
        // Draw a subtle section divider
        doc.moveTo(50, doc.y).lineTo(50 + contentWidth, doc.y).stroke("#E5E7EB");
        doc.moveDown(0.3);
        doc
          .fontSize(14)
          .fillColor("#3C3CE6")
          .text(line.replace("## ", ""));
        doc.moveDown(0.3);
      } else if (line.startsWith("# ")) {
        doc.moveDown(0.5);
        doc
          .fontSize(16)
          .fillColor("#1A1A6E")
          .text(line.replace("# ", ""));
        doc.moveDown(0.3);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const cleanBullet = line.replace(/^[-*] /, "").replace(/\*\*(.*?)\*\*/g, "$1");
        doc
          .fontSize(10)
          .fillColor("#333333")
          .text(`  \u2022  ${cleanBullet}`, { indent: 10 });
      } else if (line.match(/^\d+\./)) {
        const cleanLine = line.replace(/\*\*(.*?)\*\*/g, "$1");
        doc.fontSize(10).fillColor("#333333").text(cleanLine, { indent: 10 });
      } else if (line.startsWith("**") && line.endsWith("**")) {
        doc
          .fontSize(10)
          .fillColor("#1A1A6E")
          .text(line.replace(/\*\*/g, ""));
      } else if (line.trim()) {
        // Strip inline markdown bold/italic for plain text rendering
        const cleanLine = line
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1");
        doc.fontSize(10).fillColor("#333333").text(cleanLine);
      } else {
        doc.moveDown(0.3);
      }
    }

    // Footer
    doc.moveDown(2);
    if (doc.y > doc.page.height - 80) {
      doc.addPage();
    }
    doc.moveTo(50, doc.y).lineTo(50 + contentWidth, doc.y).stroke("#CCCCCC");
    doc.moveDown(0.5);
    doc
      .fontSize(8)
      .fillColor("#999999")
      .text(
        "This report was generated by EasyApplications using AI analysis. " +
          "It is intended as guidance and does not guarantee application success.",
        { align: "center" }
      );

    doc.end();
  });
}

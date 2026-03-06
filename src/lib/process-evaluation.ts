import { extractText } from "./document-parser";
import { evaluateApplication, type ProjectType } from "./claude";
import { generateReport } from "./pdf-report";
import { sendReportEmail } from "./email";

interface EvaluationInput {
  email: string;
  buffer: Buffer;
  fileName: string;
  projectType: ProjectType;
}

/** Derive a clean project name from the uploaded filename for the PDF attachment. */
function deriveProjectName(fileName: string): string {
  // Strip extension
  const base = fileName.replace(/\.[^.]+$/, "");
  // Remove common duplicate markers like "(1)", " (2)" etc.
  const cleaned = base.replace(/\s*\(\d+\)/g, "").trim();
  // Replace spaces and special chars with hyphens, collapse multiples
  return cleaned.replace(/[^a-zA-Z0-9-]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
}

export async function processEvaluation({
  email,
  buffer,
  fileName,
  projectType,
}: EvaluationInput): Promise<void> {
  console.log(
    `[EasyApp] Starting evaluation for ${fileName} (${projectType}) (${email})`
  );

  // Step 1: Extract text from document
  console.log("[EasyApp] Parsing document...");
  const text = await extractText(buffer, fileName);

  if (!text || text.trim().length < 100) {
    throw new Error(
      "Document appears to be empty or too short to evaluate"
    );
  }

  // Step 2: Evaluate with Claude
  console.log("[EasyApp] Sending to Claude for evaluation...");
  const evaluation = await evaluateApplication(text, projectType);

  // Step 3: Generate PDF report
  console.log("[EasyApp] Generating PDF report...");
  const projectName = deriveProjectName(fileName);
  const reportPdf = await generateReport(evaluation.content, fileName);

  // Step 4: Send email
  console.log("[EasyApp] Sending email to", email);
  await sendReportEmail(email, reportPdf, fileName, projectName);

  console.log(
    `[EasyApp] Evaluation complete for ${fileName} (${email})`
  );
}

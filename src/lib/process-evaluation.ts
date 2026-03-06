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

/** Sanitise project name for use in a filename. */
function sanitiseForFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9 -]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80); // keep filename reasonable
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
  const projectName = sanitiseForFilename(evaluation.projectName);
  const reportPdf = await generateReport(evaluation.content, fileName);

  // Step 4: Send email
  console.log("[EasyApp] Sending email to", email);
  await sendReportEmail(email, reportPdf, fileName, projectName);

  console.log(
    `[EasyApp] Evaluation complete for ${fileName} (${email})`
  );
}

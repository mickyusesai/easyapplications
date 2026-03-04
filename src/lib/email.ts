import postmark from "postmark";

function getClient() {
  return new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN || "");
}

export async function sendReportEmail(
  to: string,
  reportPdf: Buffer,
  fileName: string
): Promise<void> {
  const client = getClient();
  await client.sendEmail({
    From: process.env.FROM_EMAIL || "hello@easyapplications.eu",
    To: to,
    Subject:
      "Your Erasmus+ Application Evaluation Report - EasyApplications",
    HtmlBody: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3C3CE6 0%, #66C7FF 100%); padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">EasyApplications</h1>
        </div>
        <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb;">
          <h2 style="color: #1A1A6E;">Your Evaluation Report is Ready</h2>
          <p style="color: #333; line-height: 1.6;">
            We've completed the AI-powered evaluation of your Erasmus+ application
            (<strong>${fileName}</strong>).
          </p>
          <p style="color: #333; line-height: 1.6;">
            Please find the detailed evaluation report attached as a PDF.
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This report is generated using AI and is intended as guidance to help improve
            your application. Good luck with your Erasmus+ project!
          </p>
        </div>
        <div style="padding: 20px; background: #f9fafb; border-radius: 0 0 8px 8px; text-align: center; border: 1px solid #e5e7eb; border-top: 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            &copy; ${new Date().getFullYear()} EasyApplications
          </p>
        </div>
      </div>
    `,
    TextBody:
      "Your Erasmus+ Application Evaluation Report is ready. Please see the attached PDF for details.",
    Attachments: [
      {
        Name: "EasyApplications-Report.pdf",
        Content: reportPdf.toString("base64"),
        ContentType: "application/pdf",
        ContentID: null as unknown as string,
      },
    ],
  });
}

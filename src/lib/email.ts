import postmark from "postmark";

function getClient() {
  return new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN || "");
}

export async function sendReportEmail(
  to: string,
  reportPdf: Buffer,
  fileName: string,
  projectName: string
): Promise<void> {
  const client = getClient();
  const year = new Date().getFullYear();
  const attachmentName = `EasyApplications-Report-${projectName}.pdf`;

  await client.sendEmail({
    From: process.env.FROM_EMAIL || "hello@easyapplications.eu",
    To: to,
    Subject:
      "Your Erasmus+ Application Evaluation Report - EasyApplications",
    HtmlBody: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f0f4ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #3C3CE6 0%, #4F5CE8 50%, #66C7FF 100%); padding: 40px 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 8px; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">EasyApplications</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 14px; font-weight: 400;">AI-Powered Erasmus+ Application Review</p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="background: #ffffff; padding: 40px;">
              <h2 style="color: #1A1A6E; margin: 0 0 20px; font-size: 22px; font-weight: 600;">Your Evaluation Report is Ready</h2>

              <p style="color: #333333; line-height: 1.7; font-size: 15px; margin: 0 0 16px;">
                We've completed the AI-powered evaluation of your Erasmus+ application.
              </p>

              <!-- File info box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="background: #EEF4FF; border-left: 4px solid #3C3CE6; padding: 16px 20px; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0 0 4px; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">Document evaluated</p>
                    <p style="margin: 0; font-size: 15px; color: #1A1A6E; font-weight: 600;">${fileName}</p>
                  </td>
                </tr>
              </table>

              <p style="color: #333333; line-height: 1.7; font-size: 15px; margin: 16px 0;">
                Please find the detailed evaluation report attached as a PDF. The report includes scores for each criterion, specific feedback, and recommendations to strengthen your application.
              </p>

              <!-- CTA-style notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #3C3CE6, #4F5CE8); padding: 14px 32px; border-radius: 8px;">
                          <span style="color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">📎 Report attached: ${attachmentName}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 20px 0 0; padding-top: 16px; border-top: 1px solid #E5E7EB;">
                This report is generated using AI and is intended as guidance to help improve your application. The scores and feedback are indicative and may differ from actual evaluator assessments. Good luck with your Erasmus+ project!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1A1A6E; padding: 24px 40px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0 0 8px; font-weight: 500;">EasyApplications</p>
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
                &copy; ${year} EasyApplications &middot; AI-powered evaluation for Erasmus+ applications
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    TextBody: `Your Erasmus+ Application Evaluation Report is ready.

Document evaluated: ${fileName}

Please see the attached PDF (${attachmentName}) for your detailed evaluation report with scores and feedback for each criterion.

This report is generated using AI and is intended as guidance. Good luck with your Erasmus+ project!

— EasyApplications`,
    Attachments: [
      {
        Name: attachmentName,
        Content: reportPdf.toString("base64"),
        ContentType: "application/pdf",
        ContentID: null as unknown as string,
      },
    ],
  });
}

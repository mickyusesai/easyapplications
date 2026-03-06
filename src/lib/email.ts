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
    HtmlBody: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EasyApplications Report</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Segoe UI, Helvetica, Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #EEF4FF; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #EEF4FF;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #3C3CE6; padding: 36px 40px 28px;">
              <h1 style="color: #ffffff; margin: 0 0 6px; font-size: 26px; font-weight: 700; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">EasyApplications</h1>
              <p style="color: #c7c7ff; margin: 0; font-size: 13px; font-weight: 400; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">AI-Powered Erasmus+ Application Review</p>
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="background-color: #66C7FF; height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="background-color: #ffffff; padding: 36px 40px 32px;">
              <h2 style="color: #1A1A6E; margin: 0 0 18px; font-size: 21px; font-weight: 600; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">Your Evaluation Report is Ready</h2>

              <p style="color: #333333; line-height: 1.65; font-size: 15px; margin: 0 0 20px; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">
                We've completed the AI-powered evaluation of your Erasmus+ application.
              </p>

              <!-- File info box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px;">
                <tr>
                  <td width="4" style="background-color: #3C3CE6;"></td>
                  <td style="background-color: #EEF4FF; padding: 14px 18px;">
                    <p style="margin: 0 0 3px; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">Document evaluated</p>
                    <p style="margin: 0; font-size: 15px; color: #1A1A6E; font-weight: 600; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">${fileName}</p>
                  </td>
                </tr>
              </table>

              <p style="color: #333333; line-height: 1.65; font-size: 15px; margin: 0 0 24px; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">
                Please find the detailed evaluation report attached as a PDF. The report includes scores for each criterion, specific feedback, and recommendations to strengthen your application.
              </p>

              <!-- Attachment callout -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 0 0 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: #3C3CE6; padding: 12px 28px;">
                          <span style="color: #ffffff; font-size: 13px; font-weight: 600; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">Report attached: ${attachmentName}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    <p style="color: #666666; font-size: 12px; line-height: 1.6; margin: 0; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">
                      This report is generated using AI and is intended as guidance to help improve your application. The scores and feedback are indicative and may differ from actual evaluator assessments. Good luck with your Erasmus+ project!
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #1A1A6E; padding: 22px 40px;">
              <p style="color: #b0b0d0; font-size: 13px; margin: 0 0 6px; font-weight: 500; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">EasyApplications</p>
              <p style="color: #7070a0; font-size: 11px; margin: 0; font-family: Segoe UI, -apple-system, Helvetica, Arial, sans-serif;">
                &copy; ${year} EasyApplications &middot; AI-powered evaluation for Erasmus+ applications
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    TextBody: `Your Erasmus+ Application Evaluation Report is ready.

Document evaluated: ${fileName}

Please see the attached PDF (${attachmentName}) for your detailed evaluation report with scores and feedback for each criterion.

This report is generated using AI and is intended as guidance. Good luck with your Erasmus+ project!

-- EasyApplications`,
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EasyApplications - AI-Powered Erasmus+ Application Feedback",
  description:
    "Get expert AI feedback on your Erasmus+ project application in minutes. Upload your document and receive a detailed evaluation report based on national agency criteria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}

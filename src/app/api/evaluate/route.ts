import { NextRequest, NextResponse } from "next/server";
import { processEvaluation } from "@/lib/process-evaluation";

export const maxDuration = 300;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const projectType = formData.get("projectType") as string;
    const file = formData.get("file") as File;

    if (!email || !file || !projectType) {
      return NextResponse.json(
        { error: "Email, project type, and file are required." },
        { status: 400 }
      );
    }

    if (!["youth_exchange", "training_course"].includes(projectType)) {
      return NextResponse.json(
        { error: "Invalid project type." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Only PDF and DOC/DOCX files are accepted." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be under 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;

    // Fire-and-forget: start processing in background
    processEvaluation({ email, buffer, fileName, projectType: projectType as "youth_exchange" | "training_course" }).catch((err) => {
      console.error("[EasyApp] Background processing failed:", err);
    });

    return NextResponse.json(
      {
        message:
          "Your application is being evaluated. Check your email in about 10 minutes.",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("[EasyApp] API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

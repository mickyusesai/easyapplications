import { NextRequest, NextResponse } from "next/server";
import { retrievePending } from "@/lib/pending-store";
import { processEvaluation } from "@/lib/process-evaluation";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { fileKey } = await request.json();
  if (!fileKey) {
    return NextResponse.json({ error: "fileKey is required." }, { status: 400 });
  }

  const pending = await retrievePending(fileKey);
  if (!pending) {
    return NextResponse.json(
      { error: "No pending evaluation found for this key. It may have been cleaned up." },
      { status: 404 }
    );
  }

  try {
    await processEvaluation({
      email: pending.email,
      buffer: pending.buffer,
      fileName: pending.fileName,
      projectType: pending.projectType,
    });

    return NextResponse.json({ success: true, email: pending.email });
  } catch (error) {
    console.error("[EasyApp] Retrigger failed:", error);
    return NextResponse.json(
      { error: "Evaluation failed.", details: String(error) },
      { status: 500 }
    );
  }
}

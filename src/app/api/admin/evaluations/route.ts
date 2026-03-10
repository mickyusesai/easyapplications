import { NextRequest, NextResponse } from "next/server";
import { listPending } from "@/lib/pending-store";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const entries = await listPending();
  return NextResponse.json(entries);
}

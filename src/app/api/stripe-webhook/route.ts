import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { retrievePending } from "@/lib/pending-store";
import { processEvaluation } from "@/lib/process-evaluation";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[EasyApp] Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { fileKey, email, projectType } = session.metadata || {};

    if (!fileKey || !email || !projectType) {
      // Not an EasyApplications checkout — ignore silently (e.g. EasyReimburse)
      return NextResponse.json({ received: true });
    }

    const pending = await retrievePending(fileKey);
    if (!pending) {
      console.error("[EasyApp] No pending evaluation found for key:", fileKey);
      return NextResponse.json(
        { error: "Evaluation data not found or expired." },
        { status: 404 }
      );
    }

    // Fire-and-forget: start evaluation in background
    processEvaluation({
      email: pending.email,
      buffer: pending.buffer,
      fileName: pending.fileName,
      projectType: pending.projectType,
    }).catch((err) => {
      console.error("[EasyApp] Background processing failed:", err);
    });
  }

  return NextResponse.json({ received: true });
}

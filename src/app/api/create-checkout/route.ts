import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { storePending } from "@/lib/pending-store";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

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

    // Store file data for retrieval after payment
    const fileKey = await storePending({
      email,
      projectType: projectType as "youth_exchange" | "training_course",
      buffer,
      fileName,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://easyapplications.eu";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Erasmus+ Application Evaluation",
              description:
                "Detailed evaluation report with section scores, criterion-by-criterion feedback, and improvement points.",
            },
            unit_amount: 900, // €9.00
          },
          quantity: 1,
        },
      ],
      metadata: {
        fileKey,
        email,
        projectType,
      },
      success_url: `${baseUrl}/success`,
      cancel_url: baseUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[EasyApp] Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}

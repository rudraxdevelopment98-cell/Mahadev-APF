import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Save a website contact-form enquiry as a Lead (shown in the admin). */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const message = String(body.message ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();

  if (!name || message.length < 3) {
    return NextResponse.json(
      { error: "Please enter your name and a message." },
      { status: 422 },
    );
  }

  try {
    await prisma.lead.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        message,
        source: "website",
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not submit right now. Please call or WhatsApp us." },
      { status: 500 },
    );
  }
}

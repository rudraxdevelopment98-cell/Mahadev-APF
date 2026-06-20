import { NextResponse } from "next/server";

/**
 * Lead capture endpoint for the marketing site forms.
 *
 * When BACKEND_API_URL is configured this forwards the lead to the NestJS
 * `/api/leads` endpoint (CRM pipeline). Without it, the route validates the
 * payload and returns success so the marketing site stays functional before
 * the backend is deployed.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || message.length < 5) {
    return NextResponse.json(
      { error: "Please provide a name, a valid email and a message." },
      { status: 422 },
    );
  }

  const payload = {
    name,
    email,
    message,
    company: body.company ? String(body.company) : undefined,
    phone: body.phone ? String(body.phone) : undefined,
    source: "website",
  };

  const backend = process.env.BACKEND_API_URL;
  if (backend) {
    try {
      const res = await fetch(`${backend.replace(/\/$/, "")}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Could not submit your request. Please try again." },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true }, { status: 201 });
    } catch {
      return NextResponse.json(
        { error: "Could not reach the server. Please try again." },
        { status: 502 },
      );
    }
  }

  // No backend configured — accept and acknowledge.
  return NextResponse.json({ ok: true, queued: false }, { status: 200 });
}

export type LeadInput = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
};

export type LeadResult = { ok: true } | { ok: false; error: string };

/**
 * Base URL of the Mahadev APF backend, baked in at build time.
 * Set NEXT_PUBLIC_API_URL (e.g. via a GitHub Actions secret) to forward
 * enquiries into the CRM. When unset, the static site validates and
 * acknowledges submissions locally so forms stay functional.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Submit a lead/RFQ from a marketing-site form. */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return {
      ok: false,
      error: "Please provide a name, a valid email and a message.",
    };
  }

  // No backend configured — accept gracefully so the static site stays usable.
  if (!API_BASE) return { ok: true };

  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, "")}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        company: input.company?.trim() || undefined,
        phone: input.phone?.trim() || undefined,
        source: "website",
      }),
    });
    if (!res.ok) {
      return {
        ok: false,
        error: "Could not submit your request. Please try again.",
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

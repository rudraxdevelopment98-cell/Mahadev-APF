export type LeadInput = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
};

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string };

/** Submit a lead/RFQ from a marketing-site form to our API route. */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return {
        ok: false,
        error: data?.error ?? "Something went wrong. Please try again.",
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

"use client";

import { useState } from "react";
import { submitLead } from "@/lib/leads";
import type { SiteSettings } from "@/lib/settings";
import Reveal from "./Reveal";

const inputCls =
  "w-full rounded-lg border border-white/12 bg-ink/60 px-4 py-3 text-sm outline-none focus:border-gold";

export default function Booking({ site }: { site: SiteSettings }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const phone = String(form.get("phone") ?? "");
    const service = String(form.get("service") ?? "").trim();
    const date = String(form.get("date") ?? "").trim();
    const note = String(form.get("note") ?? "").trim();
    const message =
      `Appointment request` +
      (service ? ` — ${service}` : "") +
      (date ? ` · preferred ${date}` : "") +
      (note ? ` · note: ${note}` : "");

    const result = await submitLead({ name, phone, email: "", message });
    setSubmitting(false);
    if (result.ok) setSent(true);
    else setError(result.error);
  }

  return (
    <section id="booking" className="container-px py-28 md:py-36">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-ink-soft/70 p-10 md:p-14">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Book</span>
        </Reveal>
        <Reveal index={1}>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
            Request an appointment
          </h2>
        </Reveal>
        <Reveal index={2}>
          <p className="mt-4 max-w-lg text-muted leading-relaxed">
            Pick a time that suits you and {site.name} will confirm your slot on WhatsApp or a call.
          </p>
        </Reveal>

        <Reveal index={3}>
          {sent ? (
            <div className="mt-10 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-8 text-center">
              <p className="font-heading text-xl font-bold text-emerald-300">Request received 🎉</p>
              <p className="mt-2 text-sm text-muted">We&rsquo;ll reach out shortly to confirm your appointment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="name" required placeholder="Your name *" className={inputCls} />
                <input name="phone" required placeholder="Phone / WhatsApp *" className={inputCls} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="service" placeholder="What do you need?" className={inputCls} />
                <input name="date" type="date" className={inputCls} aria-label="Preferred date" />
              </div>
              <textarea name="note" rows={3} placeholder="Anything else? (optional)" className={inputCls} />
              {error && <p className="text-sm text-red-300">{error}</p>}
              <button
                disabled={submitting}
                className="mt-2 w-full rounded-full bg-gold py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft disabled:opacity-60 sm:w-auto sm:self-start sm:px-10"
              >
                {submitting ? "Sending…" : "Request appointment"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

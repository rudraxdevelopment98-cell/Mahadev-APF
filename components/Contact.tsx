"use client";

import { useState } from "react";
import { submitLead } from "@/lib/leads";
import type { SiteSettings } from "@/lib/settings";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

export default function Contact({ site }: { site: SiteSettings }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const result = await submitLead({
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
    });
    setSubmitting(false);
    if (result.ok) {
      setSent(true);
    } else {
      setError(result.error);
    }
  }

  return (
    <section id="contact" className="container-px py-28 md:py-36">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-ink-soft/70">
        <div className="grid lg:grid-cols-2">
          {/* Left: invitation + details */}
          <div className="relative p-10 md:p-14">
            <div className="absolute inset-0 grid-lines opacity-40" />
            <div className="relative">
              <Reveal>
                <span className="text-xs uppercase tracking-[0.3em] text-gold">
                  Let&rsquo;s Build
                </span>
              </Reveal>
              <Reveal index={1}>
                <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-balance md:text-5xl">
                  Get a free estimate for your space
                </h2>
              </Reveal>
              <Reveal index={2}>
                <p className="mt-5 max-w-md text-muted leading-relaxed">
                  Tell us what you need and our team will respond within one
                  business day with a friendly, no-obligation quote.
                </p>
              </Reveal>

              <Reveal index={3}>
                <ul className="mt-10 space-y-5 text-sm">
                  <li className="flex items-start gap-4">
                    <span className="text-gold">✉</span>
                    <a href={`mailto:${site.email}`} className="hover:text-gold">
                      {site.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-gold">☎</span>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="hover:text-gold"
                    >
                      {site.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-gold">⌖</span>
                    <span className="text-muted">{site.address}</span>
                  </li>
                </ul>
              </Reveal>

              <Reveal index={4}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <MagneticButton
                    href={`https://wa.me/${site.whatsapp}`}
                    variant="outline"
                  >
                    WhatsApp
                  </MagneticButton>
                  <MagneticButton href="#" variant="outline">
                    Book a Call
                  </MagneticButton>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right: form */}
          <div className="border-t border-white/10 bg-panel/50 p-10 md:border-l md:border-t-0 md:p-14">
            {sent ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/50 text-2xl text-gold">
                  ✓
                </span>
                <h3 className="mt-6 font-heading text-2xl font-bold">
                  Thank you
                </h3>
                <p className="mt-2 max-w-xs text-muted">
                  Your request has been received. Our team will be in touch
                  shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Your name" name="name" placeholder="Your name" />
                <Field
                  label="Phone / WhatsApp"
                  name="phone"
                  type="tel"
                  placeholder="Your phone number"
                />
                <Field
                  label="Email (optional)"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required={false}
                />
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
                    Project details
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about your requirement…"
                    className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/30 focus:border-gold"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-gold py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/30 focus:border-gold"
      />
    </div>
  );
}

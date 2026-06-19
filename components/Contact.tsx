"use client";

import { useState } from "react";
import { company } from "@/lib/data";
import { submitLead } from "@/lib/leads";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";

export default function Contact() {
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
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
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
                  Request a quote or speak with our engineers
                </h2>
              </Reveal>
              <Reveal index={2}>
                <p className="mt-5 max-w-md text-muted leading-relaxed">
                  Share your specifications and our program team will respond
                  within one business day with a tailored proposal.
                </p>
              </Reveal>

              <Reveal index={3}>
                <ul className="mt-10 space-y-5 text-sm">
                  <li className="flex items-start gap-4">
                    <span className="text-gold">✉</span>
                    <a href={`mailto:${company.email}`} className="hover:text-gold">
                      {company.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-gold">☎</span>
                    <a
                      href={`tel:${company.phone.replace(/\s/g, "")}`}
                      className="hover:text-gold"
                    >
                      {company.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-gold">⌖</span>
                    <span className="text-muted">{company.address}</span>
                  </li>
                </ul>
              </Reveal>

              <Reveal index={4}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <MagneticButton
                    href={`https://wa.me/${company.whatsapp}`}
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
                <Field label="Full name" name="name" placeholder="Jane Doe" />
                <Field
                  label="Work email"
                  name="email"
                  type="email"
                  placeholder="jane@company.com"
                />
                <Field
                  label="Company"
                  name="company"
                  placeholder="Company name"
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
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/30 focus:border-gold"
      />
    </div>
  );
}

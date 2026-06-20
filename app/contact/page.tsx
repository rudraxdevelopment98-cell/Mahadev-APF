import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Contact from "@/components/Contact";
import { getSettings } from "@/lib/settings-server";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get a free estimate or visit our showroom. Call, WhatsApp or send us your requirement — we reply within one business day.",
};

export default async function ContactPage() {
  const site = await getSettings();
  return (
    <main>
      <PageHeader
        eyebrow="Get in Touch"
        title="Get a free estimate"
        description="Tell us what you need — windows, furniture or glass works — and we'll get back within one business day with a quote."
        crumbs={[{ label: "Contact" }]}
      />
      <Contact site={site} />
    </main>
  );
}

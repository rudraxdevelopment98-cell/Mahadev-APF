import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a quote or speak with the Mahadev APF engineering team. We respond within one business day.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Get in Touch"
        title="Let's engineer your next program"
        description="Share your specifications and our program team responds within one business day with a tailored proposal."
        crumbs={[{ label: "Contact" }]}
      />
      <Contact />
    </main>
  );
}

import type { Metadata } from "next";
import RudrOneLanding from "@/components/rudrone/RudrOneLanding";
import { PLATFORM } from "@/lib/platform";

export const metadata: Metadata = {
  title: `${PLATFORM.name} — ${PLATFORM.tagline}`,
  description: `${PLATFORM.name} by ${PLATFORM.company}: GST-ready billing, a customer list and a website for growing businesses — on your own address.`,
};

export default function RudrOnePortalPage() {
  return <RudrOneLanding />;
}

"use client";

import { usePathname } from "next/navigation";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import type { SiteSettings } from "@/lib/settings";

/**
 * Renders the public marketing chrome (cursor, scroll bar, nav, footer) on the
 * site, but NOT inside the /admin area, which has its own layout.
 */
export default function SiteFrame({
  site,
  children,
}: {
  site: SiteSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // The admin area and the public invoice/estimate document have their own
  // standalone layout — no marketing nav, footer or floating buttons.
  const bare =
    pathname?.startsWith("/admin") || pathname?.startsWith("/invoice");

  if (bare) return <>{children}</>;

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Navbar site={site} />
      {children}
      <Footer site={site} />
      {/* keeps the floating mobile nav from covering the footer */}
      <div className="h-24 lg:hidden" />
      <WhatsAppButton phone={site.whatsapp} />
      <MobileNav />
    </>
  );
}

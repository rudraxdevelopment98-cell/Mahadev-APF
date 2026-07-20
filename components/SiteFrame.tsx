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
  showBranding = false,
}: {
  site: SiteSettings;
  children: React.ReactNode;
  showBranding?: boolean;
}) {
  const pathname = usePathname();
  // The admin area, the public invoice document, and the RudrOne portal pages
  // (sign-up + landing) have their own standalone layout — no business-site
  // marketing nav, footer or floating buttons.
  const bare =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/invoice") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/rudrone");

  if (bare) return <>{children}</>;

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Navbar site={site} />
      {children}
      <Footer site={site} showBranding={showBranding} />
      {/* keeps the floating mobile nav from covering the footer */}
      <div className="h-24 lg:hidden" />
      <WhatsAppButton phone={site.whatsapp} />
      <MobileNav />
    </>
  );
}

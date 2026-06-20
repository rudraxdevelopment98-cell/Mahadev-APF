"use client";

import { usePathname } from "next/navigation";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Renders the public marketing chrome (cursor, scroll bar, nav, footer) on the
 * site, but NOT inside the /admin area, which has its own layout.
 */
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import SiteFrame from "@/components/SiteFrame";
import { getSettings } from "@/lib/settings-server";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: {
      default: `${s.name} — ${s.tagline}`,
      template: `%s | ${s.name}`,
    },
    description: s.intro,
    keywords: [
      "aluminium windows",
      "uPVC windows and doors",
      "modular furniture",
      "glass works",
      s.name,
    ],
    openGraph: {
      title: `${s.name} — ${s.tagline}`,
      description: s.intro,
      type: "website",
    },
    metadataBase: new URL("https://mahadevapf.com"),
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        {/* Map Tailwind font tokens to the next/font CSS variables */}
        <style>{`:root{--font-heading:var(--font-space-grotesk);--font-body:var(--font-inter);}`}</style>
      </head>
      <body>
        <SiteFrame site={settings}>{children}</SiteFrame>
      </body>
    </html>
  );
}

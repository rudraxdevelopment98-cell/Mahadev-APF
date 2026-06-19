import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { company } from "@/lib/data";
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

export const metadata: Metadata = {
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description: company.intro,
  keywords: [
    "industrial manufacturing",
    "infrastructure",
    "structural steel",
    "precision engineering",
    "Mahadev APF",
  ],
  openGraph: {
    title: `${company.name} — ${company.tagline}`,
    description: company.intro,
    type: "website",
  },
  metadataBase: new URL("https://mahadevapf.com"),
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        {/* Map Tailwind font tokens to the next/font CSS variables */}
        <style>{`:root{--font-heading:var(--font-space-grotesk);--font-body:var(--font-inter);}`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

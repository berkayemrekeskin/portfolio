import type { Metadata } from "next";
import { Silkscreen } from "next/font/google";
import { SITE } from "@/content/site";
import "./globals.css";
import { asset } from "@/lib/asset";

const pixel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const title = SITE.name ? `${SITE.name} — Portfolio` : "Portfolio";

export const metadata: Metadata = {
  title,
  description:
    SITE.tagline ||
    "An interactive pixel-art room. Every object opens something.",
  ...(SITE.url ? { metadataBase: new URL(SITE.url) } : {}),
  openGraph: { title, type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE.locale} className={pixel.variable}>
      <body className="antialiased">
        <a className="skip-link" href={asset("/text/")}>
          Skip the room — read this site as a text page
        </a>
        {children}
      </body>
    </html>
  );
}

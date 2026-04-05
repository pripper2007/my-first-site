import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { PT_Serif } from "next/font/google";
import "./globals.css";

/* Geist Sans — clean sans-serif for headings and UI elements */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/* PT Serif — warm, readable serif font for body text (inspired by seths.blog) */
const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/* Page metadata — shown in browser tabs and search results */
export const metadata: Metadata = {
  title: "Pedro Ripper",
  description:
    "Co-founder and CEO of Bemobi — a Brazilian public technology company with a global footprint spanning more than 50 countries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${ptSerif.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}

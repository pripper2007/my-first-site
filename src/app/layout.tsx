import type { Metadata } from "next";
import { GLOBAL_LD } from "@/lib/jsonld";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Pedro Ripper — Co-founder & CEO, Bemobi",
    template: "%s | Pedro Ripper",
  },
  description:
    "Building Bemobi, exploring AI, sharing what I read. Co-founder & CEO of Bemobi (BMOB3), a Brazilian public tech company operating in 50+ countries.",
  metadataBase: new URL("https://pedroripper.com"),
  alternates: {
    canonical: "https://pedroripper.com",
  },
  openGraph: {
    title: "Pedro Ripper — Co-founder & CEO, Bemobi",
    description:
      "Building Bemobi, exploring AI, sharing what I read. Co-founder & CEO of Bemobi (BMOB3), a Brazilian public tech company operating in 50+ countries.",
    url: "https://pedroripper.com",
    siteName: "Pedro Ripper",
    images: [
      {
        url: "/images/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Pedro Ripper — Co-founder & CEO, Bemobi",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pedro Ripper — Co-founder & CEO, Bemobi",
    description:
      "Building Bemobi, exploring AI, sharing what I read.",
    images: ["/images/og-preview.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
    >
      <head>
        {/* Preconnect to external image domains for faster loading */}
        <link rel="preconnect" href="https://covers.openlibrary.org" />
        <link rel="preconnect" href="https://books.google.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://m.media-amazon.com" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(GLOBAL_LD) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

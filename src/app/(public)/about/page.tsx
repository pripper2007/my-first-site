import { getBio } from "@/lib/content";
import BackToHome from "@/components/shared/BackToHome";
import AboutSection from "@/components/public/AboutSection";

export const metadata = {
  title: "About",
  description:
    "Pedro Ripper is co-founder and CEO of Bemobi (BMOB3), a Brazilian public technology company with operations in more than 50 countries.",
  alternates: { canonical: "https://pedroripper.com/about" },
  openGraph: {
    title: "About | Pedro Ripper",
    description: "Pedro Ripper is co-founder and CEO of Bemobi (BMOB3), a Brazilian public technology company with operations in more than 50 countries.",
    url: "https://pedroripper.com/about",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: "About | Pedro Ripper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Pedro Ripper",
    description: "Pedro Ripper is co-founder and CEO of Bemobi (BMOB3), a Brazilian public technology company with operations in more than 50 countries.",
    images: ["/images/og-preview.png"],
  },
};

/**
 * Dedicated About page — full bio, highlights, and stats.
 */
export default async function AboutPage() {
  const bio = await getBio();

  return (
    <div className="pt-[100px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 mb-[-40px]">
        <BackToHome />
      </div>
      <AboutSection bio={bio} />
    </div>
  );
}

import { getBio } from "@/lib/content";
import BackToHome from "@/components/shared/BackToHome";
import AboutSection from "@/components/public/AboutSection";

export const metadata = {
  title: "About",
  description: "Pedro Ripper is co-founder and CEO of Bemobi (BMOB3), a Brazilian public technology company with operations in more than 50 countries.",
  alternates: { canonical: "https://pedroripper.com/about" },
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

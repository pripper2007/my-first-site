import { getVideos } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import VideosPageList from "@/components/public/VideosPageList";

export const metadata = {
  title: "Talks & Interviews",
  description:
    "Video appearances, keynotes, panels, and podcast interviews featuring Pedro Ripper, CEO of Bemobi.",
  alternates: { canonical: "https://pedroripper.com/talks" },
  openGraph: {
    title: "Talks & Interviews | Pedro Ripper",
    description: "Video appearances, keynotes, panels, and podcast interviews featuring Pedro Ripper, CEO of Bemobi.",
    url: "https://pedroripper.com/talks",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: "Talks & Interviews | Pedro Ripper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talks & Interviews | Pedro Ripper",
    description: "Video appearances, keynotes, panels, and podcast interviews featuring Pedro Ripper, CEO of Bemobi.",
    images: ["/images/og-preview.png"],
  },
};

export default async function TalksPage() {
  const videos = await getVideos();

  return (
    <section className="pt-[120px] pb-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <BackToHome />
        <SectionHeader
          label="Talks"
          title="All Talks &amp; Interviews"
          subtitle="Keynotes, panel discussions, and interviews on technology, fintech, and leadership."
        />
        <VideosPageList items={videos} />
        {videos.length === 0 && (
          <p className="text-[var(--color-text-secondary)] text-center py-12">
            No talks yet.
          </p>
        )}
      </div>
    </section>
  );
}

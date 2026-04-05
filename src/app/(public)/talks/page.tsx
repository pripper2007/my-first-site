import { getVideos } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import VideosPageList from "@/components/public/VideosPageList";

export const metadata = {
  title: "Talks & Interviews",
  description: "Video appearances, keynotes, panels, and podcast interviews featuring Pedro Ripper, CEO of Bemobi.",
  alternates: { canonical: "https://pedroripper.com/talks" },
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

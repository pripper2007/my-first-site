import { getVideos } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import VideosPageList from "@/components/public/VideosPageList";

export const metadata = {
  title: "Palestras & Entrevistas",
  description:
    "Aparições em vídeo, palestras, painéis e entrevistas em podcasts com Pedro Ripper, CEO da Bemobi.",
  alternates: { canonical: "https://pedroripper.com/talks" },
  openGraph: {
    title: "Palestras & Entrevistas | Pedro Ripper",
    description: "Aparições em vídeo, palestras, painéis e entrevistas em podcasts com Pedro Ripper, CEO da Bemobi.",
    url: "https://pedroripper.com/talks",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: "Palestras & Entrevistas | Pedro Ripper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palestras & Entrevistas | Pedro Ripper",
    description: "Aparições em vídeo, palestras, painéis e entrevistas em podcasts com Pedro Ripper, CEO da Bemobi.",
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
          label="Palestras"
          title="Todas as Palestras &amp; Entrevistas"
          subtitle="Palestras, painéis e entrevistas sobre tecnologia, fintech e liderança."
        />
        <VideosPageList items={videos} />
        {videos.length === 0 && (
          <p className="text-[var(--color-text-secondary)] text-center py-12">
            Nada por aqui ainda.
          </p>
        )}
      </div>
    </section>
  );
}

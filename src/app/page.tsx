import ProfilePhoto from "@/components/ProfilePhoto";
import Bio from "@/components/Bio";
import SocialLinks from "@/components/SocialLinks";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      {/* Header: photo alongside name, inspired by seths.blog */}
      <div className="flex items-center gap-5 mb-10">
        <ProfilePhoto />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans">
            Pedro Ripper
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Co-founder &amp; CEO of Bemobi (BMOB3)
          </p>
        </div>
      </div>

      {/* Yellow accent divider */}
      <div className="w-12 h-1 bg-accent mb-8" />

      <div className="space-y-8">
        <Bio />
        <SocialLinks />
      </div>
    </main>
  );
}

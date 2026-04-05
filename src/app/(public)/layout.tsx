import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ParticleCanvas from "@/components/shared/ParticleCanvas";

/**
 * Public layout — particle canvas behind content, fixed nav, footer.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ParticleCanvas />
      <Navbar />
      <main className="relative z-[1]">{children}</main>
      <Footer />
    </>
  );
}

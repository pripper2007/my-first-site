import Link from "next/link";

/**
 * Streamlined hero — purpose-driven headline, minimal bio,
 * link to full About page. Vertical 9:16 portrait video with
 * edges blurred into the background.
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-[72px] relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 w-full relative z-[1]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text side */}
          <div className="z-[2] max-lg:text-center max-lg:order-2">
            <div className="flex items-center gap-3 mb-6 max-lg:justify-center">
              <span className="w-10 h-[1.5px] bg-[var(--color-accent)]" />
              <span className="text-[0.78rem] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)]">
                Tech Builder, Investor &amp; CEO
              </span>
            </div>

            <h1
              className="font-display font-[800] tracking-[-0.04em] leading-[1.05] mb-6"
              style={{ fontSize: "clamp(3rem, 5.5vw, 4.8rem)" }}
            >
              Building Bemobi, exploring AI, sharing what I read.
            </h1>

            <p className="text-[1.1rem] text-[var(--color-text-secondary)] font-light leading-[1.6] mb-4">
              Pedro Ripper: Co-founder &amp; CEO, Bemobi (BMOB3) &middot; Rio de Janeiro.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-[var(--color-accent)] hover:gap-3 transition-all duration-[400ms]"
            >
              See more...
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Portrait — vertical B&W video, edges dissolve into background */}
          <div className="relative z-[2] flex justify-center max-lg:order-1">
            <div
              className="w-[420px] max-lg:w-[300px] relative"
              style={{
                aspectRatio: "1076 / 1924",
                maskImage:
                  "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)," +
                  "linear-gradient(to bottom, transparent, black 80px, black calc(100% - 80px), transparent)",
                maskComposite: "intersect",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)," +
                  "linear-gradient(to bottom, transparent, black 80px, black calc(100% - 80px), transparent)",
                WebkitMaskComposite: "source-in",
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover grayscale"
                poster="/videos/portrait Pedro Ripper.jpg"
              >
                <source src="/videos/portrait Pedro Ripper.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

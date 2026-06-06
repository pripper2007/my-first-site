import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle the pre-converted article fragments with the dynamic insights route
  outputFileTracingIncludes: {
    "/insights/[slug]": ["./src/content/articles/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },
};

export default nextConfig;

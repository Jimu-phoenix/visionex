import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Project and gallery images are served from Convex file storage, which
       returns signed URLs on <deployment>.convex.cloud. Without this,
       next/image rejects them as an unconfigured remote host. */
    remotePatterns: [
      { protocol: "https", hostname: "**.convex.cloud" },
      { protocol: "https", hostname: "**.convex.site" },
    ],
  },
};

export default nextConfig;

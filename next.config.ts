import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prod.boo.dating",
      },
      {
        protocol: "https",
        hostname: "media.tenor.com",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      { hostname: "payhip.com" },
      { hostname: "www.thencahub.com" },
    ],
  },
};

export default nextConfig;

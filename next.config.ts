import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    // Car photos are served from Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://invalid.supabase.co").hostname,
        pathname: "/storage/v1/object/public/car-photos/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Admin uploads several car photos (max 5MB each) in one submission.
      bodySizeLimit: "40mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

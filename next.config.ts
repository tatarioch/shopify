import type { NextConfig } from "next";
// @ts-ignore: no declaration file for 'next-pwa'
import withPWA from "next-pwa";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ❌ Removed turbopack config — it causes build errors with next-pwa
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eazjdepovuobgwyaytkz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development", // disable PWA in dev
  },
});

import type { NextConfig } from "next";
// @ts-ignore: no declaration file for 'next-pwa'
import withPWA from "next-pwa";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
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

// Wrap with PWA only once, and keep nextConfig clean
const withPWAFunc = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPWAFunc(nextConfig);

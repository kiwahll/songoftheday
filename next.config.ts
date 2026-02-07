import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://i.scdn.co/image/**'),
      new URL('https://i1.sndcdn.com/**'),
    ],
  },
};

export default nextConfig;

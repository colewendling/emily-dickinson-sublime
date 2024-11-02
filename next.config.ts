import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
  },
};

export default nextConfig;

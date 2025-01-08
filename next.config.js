/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
  },
  eslint: {
    // skip all ESLint checks at build time
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      '/api/submit-simple': ['./node_modules/@sparticuz/chromium/**'],
    },
  },
}

module.exports = nextConfig

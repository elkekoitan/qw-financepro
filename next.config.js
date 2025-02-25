/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
}

// Sentry configuration only in production
if (process.env.NODE_ENV === 'production' && !process.env.SENTRY_DISABLED) {
  const { withSentryConfig } = require('@sentry/nextjs');
  
  module.exports = withSentryConfig(
    nextConfig,
    {
      org: "elkekoitan",
      project: "financepro",
      silent: true,
      widenClientFileUpload: true,
      transpileClientSDK: true,
      tunnelRoute: "/monitoring",
      hideSourceMaps: true,
      disableLogger: true,
    },
    {
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    }
  );
} else {
  module.exports = nextConfig;
}

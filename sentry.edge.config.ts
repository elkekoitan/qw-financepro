// Sentry edge configuration disabled for deployment
// This file is kept for reference but not actively used

import * as Sentry from "@sentry/nextjs";

// Dummy export to make this a valid module
export const sentryEdgeConfig = {
  enabled: false
};

/*
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
*/

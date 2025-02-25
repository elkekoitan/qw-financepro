// Sentry instrumentation - disabled for deployment
// import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Sentry configuration imports disabled to fix deployment issues
  /*
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
  */
}

// export const onRequestError = Sentry.captureRequestError;

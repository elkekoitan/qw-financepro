'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-dark text-white">
          <div className="max-w-md w-full p-6 space-y-4 text-center">
            <h2 className="text-2xl font-bold text-red-500">
              Bir şeyler yanlış gitti!
            </h2>
            <p className="text-gray-400">
              {error.message || 'Beklenmeyen bir hata oluştu.'}
            </p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 
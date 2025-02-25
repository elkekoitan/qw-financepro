'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white">
      <div className="max-w-md w-full p-6 space-y-4 text-center">
        <h2 className="text-4xl font-bold text-primary">404</h2>
        <h3 className="text-2xl font-semibold">Sayfa Bulunamadı</h3>
        <p className="text-gray-400">
          Aradığınız sayfa bulunamadı veya taşınmış olabilir.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 
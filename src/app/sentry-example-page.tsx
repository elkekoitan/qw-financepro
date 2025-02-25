'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold">FinancePro</h1>
            <p className="mt-2 text-gray-400">
              Finansal geleceğinizi şekillendirin
            </p>
          </div>

          <div className="bg-dark-surface rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold">İzleme Sistemi Testi</h2>
            <p className="mt-2 text-gray-400">
              İzleme sistemi geçici olarak devre dışı bırakılmıştır.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { useInvestment } from '@/contexts/InvestmentContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import InvestmentList from '@/components/investments/InvestmentList';
import InvestmentChart from '@/components/investments/InvestmentChart';
import InvestmentDetails from '@/components/investments/InvestmentDetails';

export default function InvestmentPage() {
  const { user, loading: authLoading } = useAuth();
  const { loading: investmentLoading, error } = useInvestment();
  const router = useRouter();
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || investmentLoading) {
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
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Başlık */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Yatırım Geçmişi</h1>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="p-4 bg-red-900/50 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Ana Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Taraf - Grafik ve Detaylar */}
          <div className="lg:col-span-1 space-y-6">
            <InvestmentChart />
            {selectedInvestmentId && (
              <InvestmentDetails
                investmentId={selectedInvestmentId}
                onClose={() => setSelectedInvestmentId(null)}
              />
            )}
          </div>

          {/* Sağ Taraf - Yatırım Listesi */}
          <div className="lg:col-span-2">
            <InvestmentList
              onSelectInvestment={setSelectedInvestmentId}
              selectedInvestmentId={selectedInvestmentId}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PortfolioWidget from '@/components/dashboard/PortfolioWidget';
import InvestmentSummary from '@/components/dashboard/InvestmentSummary';
import MarketOverview from '@/components/dashboard/MarketOverview';
import PerformanceChart from '@/components/dashboard/PerformanceChart';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
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
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Başlık ve Hoşgeldin Mesajı */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Hoş geldiniz, {user.email}
          </h1>
          <div className="text-sm text-gray-400">
            Son güncelleme: {new Date().toLocaleString('tr-TR')}
          </div>
        </div>

        {/* Ana Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Portföy Özeti */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <PortfolioWidget />
          </div>

          {/* Yatırım Özeti */}
          <div className="col-span-1">
            <InvestmentSummary />
          </div>

          {/* Performans Grafiği */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <PerformanceChart />
          </div>

          {/* Piyasa Genel Bakış */}
          <div className="col-span-1">
            <MarketOverview />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 
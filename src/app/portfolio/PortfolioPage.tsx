'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { usePortfolio } from '@/contexts/PortfolioContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AssetList from '@/components/portfolio/AssetList';
import AddAssetModal from '@/components/portfolio/AddAssetModal';
import PortfolioStats from '@/components/portfolio/PortfolioStats';
import AssetAllocation from '@/components/portfolio/AssetAllocation';

export default function PortfolioPage() {
  const { user, loading: authLoading } = useAuth();
  const { loading: portfolioLoading, error } = usePortfolio();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || portfolioLoading) {
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
        {/* Başlık ve Ekle Butonu */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Portföy Yönetimi</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center space-x-2 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Varlık Ekle</span>
          </button>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="p-4 bg-red-900/50 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Ana Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Taraf - İstatistikler ve Dağılım */}
          <div className="lg:col-span-1 space-y-6">
            <PortfolioStats />
            <AssetAllocation />
          </div>

          {/* Sağ Taraf - Varlık Listesi */}
          <div className="lg:col-span-2">
            <AssetList
              onSelectAsset={setSelectedAssetId}
              selectedAssetId={selectedAssetId}
            />
          </div>
        </div>

        {/* Varlık Ekleme Modalı */}
        <AddAssetModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
} 
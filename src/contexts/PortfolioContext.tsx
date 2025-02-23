'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { Money } from '@/domain/value-objects/Money';
import { Result } from '@/core/logic/Result';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';

export type AssetType = 'stock' | 'bond' | 'crypto' | 'commodity' | 'cash';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: Money;
  currentPrice: Money;
  type: AssetType;
  lastUpdate: Date;
}

interface PortfolioContextType {
  // Portfolio data
  assets: Asset[];
  totalValue: Money;
  totalCost: Money;
  totalProfitLoss: Money;
  totalProfitLossPercentage: number;
  loading: boolean;
  error: string | null;

  // Portfolio metrics
  dailyChange: Money;
  dailyChangePercentage: number;
  monthlyChange: Money;
  monthlyChangePercentage: number;
  yearlyChange: Money;
  yearlyChangePercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  diversificationScore: number;
  volatility: number;
  sharpeRatio: number;

  // Portfolio actions
  addAsset: (asset: Omit<Asset, 'id' | 'lastUpdate'>) => Promise<Result<void>>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<Result<void>>;
  removeAsset: (id: string) => Promise<Result<void>>;
  refreshPrices: () => Promise<Result<void>>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculated values
  const totalValue = assets.reduce(
    (sum, asset) => sum.add(asset.currentPrice.multiply(asset.quantity)).getValue(),
    Money.create(0, 'TRY').getValue()
  );

  const totalCost = assets.reduce(
    (sum, asset) => sum.add(asset.purchasePrice.multiply(asset.quantity)).getValue(),
    Money.create(0, 'TRY').getValue()
  );

  const totalProfitLoss = totalValue.subtract(totalCost).getValue();
  const totalProfitLossPercentage = totalCost.getValue().amount === 0 ? 0 :
    (totalProfitLoss.getValue().amount / totalCost.getValue().amount) * 100;

  // TODO: Bu değerler API'den gelecek
  const portfolioMetrics = {
    dailyChange: Money.create(2500, 'TRY').getValue(),
    dailyChangePercentage: 1.67,
    monthlyChange: Money.create(8500, 'TRY').getValue(),
    monthlyChangePercentage: 5.67,
    yearlyChange: Money.create(25000, 'TRY').getValue(),
    yearlyChangePercentage: 16.67,
    riskLevel: 'medium' as const,
    diversificationScore: 75,
    volatility: 12.5,
    sharpeRatio: 1.8
  };

  useEffect(() => {
    if (user) {
      loadPortfolio();
    }
  }, [user]);

  const loadPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: API'den portföy verilerini çek
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      // Örnek veri
      const sampleAssets: Asset[] = [
        {
          id: new UniqueEntityID().toString(),
          symbol: 'THYAO',
          name: 'Türk Hava Yolları',
          quantity: 100,
          purchasePrice: Money.create(150, 'TRY').getValue(),
          currentPrice: Money.create(170.50, 'TRY').getValue(),
          type: 'stock',
          lastUpdate: new Date()
        },
        {
          id: new UniqueEntityID().toString(),
          symbol: 'GARAN',
          name: 'Garanti Bankası',
          quantity: 200,
          purchasePrice: Money.create(44.50, 'TRY').getValue(),
          currentPrice: Money.create(42.80, 'TRY').getValue(),
          type: 'stock',
          lastUpdate: new Date()
        }
      ];

      setAssets(sampleAssets);
    } catch (err: any) {
      setError(err.message || 'Portföy yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (asset: Omit<Asset, 'id' | 'lastUpdate'>): Promise<Result<void>> => {
    try {
      // TODO: API'ye varlık ekleme isteği gönder
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      const newAsset: Asset = {
        ...asset,
        id: new UniqueEntityID().toString(),
        lastUpdate: new Date()
      };

      setAssets(prev => [...prev, newAsset]);
      return Result.ok<void>(undefined);
    } catch (err: any) {
      return Result.fail<void>(err.message || 'Varlık eklenirken bir hata oluştu');
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>): Promise<Result<void>> => {
    try {
      // TODO: API'ye varlık güncelleme isteği gönder
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      setAssets(prev => prev.map(asset => 
        asset.id === id ? { ...asset, ...updates, lastUpdate: new Date() } : asset
      ));
      return Result.ok<void>(undefined);
    } catch (err: any) {
      return Result.fail<void>(err.message || 'Varlık güncellenirken bir hata oluştu');
    }
  };

  const removeAsset = async (id: string): Promise<Result<void>> => {
    try {
      // TODO: API'ye varlık silme isteği gönder
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      setAssets(prev => prev.filter(asset => asset.id !== id));
      return Result.ok<void>(undefined);
    } catch (err: any) {
      return Result.fail<void>(err.message || 'Varlık silinirken bir hata oluştu');
    }
  };

  const refreshPrices = async (): Promise<Result<void>> => {
    try {
      // TODO: API'den güncel fiyatları çek
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      // Örnek güncelleme
      setAssets(prev => prev.map(asset => ({
        ...asset,
        currentPrice: Money.create(
          asset.currentPrice.getValue().amount * (1 + (Math.random() * 0.02 - 0.01)), // ±1% değişim
          'TRY'
        ).getValue(),
        lastUpdate: new Date()
      })));

      return Result.ok<void>(undefined);
    } catch (err: any) {
      return Result.fail<void>(err.message || 'Fiyatlar güncellenirken bir hata oluştu');
    }
  };

  return (
    <PortfolioContext.Provider value={{
      assets,
      totalValue,
      totalCost,
      totalProfitLoss,
      totalProfitLossPercentage,
      loading,
      error,
      ...portfolioMetrics,
      addAsset,
      updateAsset,
      removeAsset,
      refreshPrices
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
} 
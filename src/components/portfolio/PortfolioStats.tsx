'use client';

import { usePortfolio } from '@/contexts/PortfolioContext';
import { useState } from 'react';
import { Money } from '@/domain/value-objects/Money';

interface PortfolioStatistics {
  totalValue: Money;
  totalCost: Money;
  totalProfitLoss: Money;
  totalProfitLossPercentage: number;
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
}

export default function PortfolioStats() {
  const {
    loading,
    totalValue,
    totalCost,
    totalProfitLoss,
    totalProfitLossPercentage,
    dailyChange,
    dailyChangePercentage,
    monthlyChange,
    monthlyChangePercentage,
    yearlyChange,
    yearlyChangePercentage,
    riskLevel,
    diversificationScore,
    volatility,
    sharpeRatio
  } = usePortfolio();

  const StatCard = ({
    title,
    value,
    percentage,
    isPositive
  }: {
    title: string;
    value: Money;
    percentage: number;
    isPositive: boolean;
  }) => (
    <div className="bg-dark rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className={`text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {value.format()}
      </p>
      <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{percentage.toFixed(2)}%
      </p>
    </div>
  );

  const MetricCard = ({
    title,
    value,
    description,
    color = 'text-white'
  }: {
    title: string;
    value: string | number;
    description?: string;
    color?: string;
  }) => (
    <div className="bg-dark rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className={`text-lg font-semibold ${color}`}>
        {typeof value === 'number' ? value.toFixed(2) : value}
      </p>
      {description && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
    </div>
  );

  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Portföy İstatistikleri</h2>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-700 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Toplam Değer ve Kar/Zarar */}
          <div className="bg-dark rounded-lg p-4">
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-sm font-medium text-gray-400">Toplam Değer</h3>
              <p className="text-sm text-gray-400">Maliyet: {totalCost.format()}</p>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {totalValue.format()}
            </p>
            <div className={`text-sm ${totalProfitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProfitLoss.format()} ({totalProfitLossPercentage >= 0 ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%)
            </div>
          </div>

          {/* Değişim İstatistikleri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Günlük Değişim"
              value={dailyChange}
              percentage={dailyChangePercentage}
              isPositive={dailyChangePercentage >= 0}
            />
            <StatCard
              title="Aylık Değişim"
              value={monthlyChange}
              percentage={monthlyChangePercentage}
              isPositive={monthlyChangePercentage >= 0}
            />
            <StatCard
              title="Yıllık Değişim"
              value={yearlyChange}
              percentage={yearlyChangePercentage}
              isPositive={yearlyChangePercentage >= 0}
            />
          </div>

          {/* Risk ve Performans Metrikleri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Risk Seviyesi"
              value={riskLevel === 'low' ? 'Düşük' : riskLevel === 'medium' ? 'Orta' : 'Yüksek'}
              description="Portföy risk değerlendirmesi"
              color={riskLevel === 'low' ? 'text-green-400' : riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'}
            />
            <MetricCard
              title="Çeşitlendirme Skoru"
              value={diversificationScore}
              description="100 üzerinden değerlendirme"
              color={diversificationScore >= 70 ? 'text-green-400' : diversificationScore >= 40 ? 'text-yellow-400' : 'text-red-400'}
            />
            <MetricCard
              title="Volatilite"
              value={volatility}
              description="Yıllık volatilite (%)"
              color={volatility <= 15 ? 'text-green-400' : volatility <= 25 ? 'text-yellow-400' : 'text-red-400'}
            />
            <MetricCard
              title="Sharpe Oranı"
              value={sharpeRatio}
              description="Risk ayarlı getiri"
              color={sharpeRatio >= 1.5 ? 'text-green-400' : sharpeRatio >= 1 ? 'text-yellow-400' : 'text-red-400'}
            />
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { Money } from '@/domain/value-objects/Money';

export default function PortfolioWidget() {
  const [loading] = useState(false);

  // TODO: Bu değerler portfolio context'ten gelecek
  const totalValue = Money.create(150000, 'TRY').getValue();
  const dailyChange = Money.create(2500, 'TRY').getValue();
  const dailyChangePercentage = 1.67;
  const isPositiveChange = dailyChangePercentage > 0;

  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Portföy Özeti</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-white">
              {totalValue.format()}
            </span>
            <span className="ml-2 text-sm text-gray-400">Toplam Değer</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-semibold ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
              {isPositiveChange ? '+' : ''}{dailyChange.format()}
            </span>
            <span className={`text-sm ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
              ({isPositiveChange ? '+' : ''}{dailyChangePercentage.toFixed(2)}%)
            </span>
            <span className="text-sm text-gray-400">Günlük Değişim</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-dark rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400">En Yüksek Getiri</h3>
              <p className="text-lg font-semibold text-green-400">THYAO +5.23%</p>
            </div>
            <div className="bg-dark rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400">En Düşük Getiri</h3>
              <p className="text-lg font-semibold text-red-400">GARAN -2.15%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState } from 'react';

interface Investment {
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  change: number;
}

export default function InvestmentSummary() {
  const [loading] = useState(false);

  // TODO: Bu veriler investment context'ten gelecek
  const investments: Investment[] = [
    {
      symbol: 'THYAO',
      name: 'Türk Hava Yolları',
      quantity: 100,
      currentPrice: 170.50,
      change: 5.23
    },
    {
      symbol: 'GARAN',
      name: 'Garanti Bankası',
      quantity: 200,
      currentPrice: 42.80,
      change: -2.15
    },
    {
      symbol: 'ASELS',
      name: 'Aselsan',
      quantity: 150,
      currentPrice: 84.20,
      change: 1.75
    }
  ];

  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Yatırım Özeti</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((investment) => (
            <div
              key={investment.symbol}
              className="bg-dark rounded-lg p-4 hover:bg-dark-paper transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white">{investment.symbol}</h3>
                  <p className="text-sm text-gray-400">{investment.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">
                    {investment.currentPrice.toLocaleString('tr-TR', {
                      style: 'currency',
                      currency: 'TRY'
                    })}
                  </p>
                  <p className={`text-sm ${investment.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {investment.change > 0 ? '+' : ''}{investment.change}%
                  </p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {investment.quantity} adet
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState } from 'react';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export default function MarketOverview() {
  const [loading] = useState(false);

  // TODO: Bu veriler market context'ten gelecek
  const indices: MarketIndex[] = [
    {
      name: 'BIST 100',
      value: 9245.67,
      change: 1.23,
      trend: 'up'
    },
    {
      name: 'BIST 30',
      value: 10123.45,
      change: -0.45,
      trend: 'down'
    },
    {
      name: 'USD/TRY',
      value: 31.25,
      change: 0.15,
      trend: 'up'
    },
    {
      name: 'EUR/TRY',
      value: 33.80,
      change: -0.20,
      trend: 'down'
    },
    {
      name: 'Altın/TRY',
      value: 1875.30,
      change: 0.75,
      trend: 'up'
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Piyasa Genel Bakış</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {indices.map((index) => (
            <div
              key={index.name}
              className="flex items-center justify-between p-3 bg-dark rounded-lg hover:bg-dark-paper transition-colors duration-200"
            >
              <div>
                <h3 className="font-medium text-white">{index.name}</h3>
                <p className="text-sm text-gray-400">
                  {index.value.toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${index.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {index.change > 0 ? '+' : ''}{index.change}%
                </span>
                {getTrendIcon(index.trend)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
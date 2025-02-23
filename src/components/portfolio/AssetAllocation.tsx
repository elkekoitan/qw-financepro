'use client';

import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Money } from '@/domain/value-objects/Money';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetAllocation() {
  const { assets, loading } = usePortfolio();
  const [view, setView] = useState<'asset' | 'type'>('asset');

  // Varlık bazlı dağılım hesaplama
  const assetAllocation = assets.map(asset => {
    const value = asset.currentPrice.multiply(asset.quantity);
    return {
      symbol: asset.symbol,
      name: asset.name,
      value,
      type: asset.type,
      color: asset.type === 'stock' ? '#4FD1C5' :
             asset.type === 'bond' ? '#38A169' :
             asset.type === 'crypto' ? '#00B5D8' :
             asset.type === 'commodity' ? '#F6AD55' : '#A0AEC0'
    };
  });

  // Toplam portföy değeri
  const totalPortfolioValue = assetAllocation.reduce(
    (sum, asset) => sum.add(asset.value).getValue(),
    Money.create(0, 'TRY').getValue()
  );

  // Yüzdeleri hesaplama
  const allocationWithPercentages = assetAllocation.map(asset => ({
    ...asset,
    percentage: (asset.value.getValue().amount / totalPortfolioValue.getValue().amount) * 100
  }));

  // Tür bazlı dağılım hesaplama
  const typeAllocation = allocationWithPercentages.reduce((acc, item) => {
    const existingType = acc.find(t => t.type === item.type);
    if (existingType) {
      existingType.value = existingType.value.add(item.value).getValue();
      existingType.percentage += item.percentage;
    } else {
      acc.push({
        symbol: item.type.toUpperCase(),
        name: item.type === 'stock' ? 'Hisse Senedi' :
              item.type === 'bond' ? 'Tahvil' :
              item.type === 'crypto' ? 'Kripto' :
              item.type === 'commodity' ? 'Emtia' : 'Nakit',
        value: item.value,
        percentage: item.percentage,
        color: item.color,
        type: item.type
      });
    }
    return acc;
  }, [] as typeof allocationWithPercentages);

  const currentData = view === 'asset' ? allocationWithPercentages : typeAllocation;

  const chartData = {
    labels: currentData.map(item => item.symbol),
    datasets: [
      {
        data: currentData.map(item => item.percentage),
        backgroundColor: currentData.map(item => item.color),
        borderColor: currentData.map(item => item.color),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1A2C2C',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2D3748',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const data = currentData[context.dataIndex];
            return [
              `${data.symbol}: ${data.percentage.toFixed(1)}%`,
              `Değer: ${data.value.format()}`
            ];
          }
        }
      }
    }
  };

  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
        <h2 className="text-xl font-semibold text-white">Varlık Dağılımı</h2>
        
        <div className="bg-dark-surface rounded-md p-1">
          <button
            onClick={() => setView('asset')}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
              view === 'asset'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Varlık
          </button>
          <button
            onClick={() => setView('type')}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
              view === 'type'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tür
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pasta Grafiği */}
          <div className="h-64">
            <Pie data={chartData} options={chartOptions} />
          </div>

          {/* Dağılım Listesi */}
          <div className="space-y-3">
            {currentData.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center justify-between p-2 rounded-md hover:bg-dark transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.symbol}</p>
                    <p className="text-xs text-gray-400">{item.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{item.value.format()}</p>
                  <p className="text-xs text-gray-400">{item.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
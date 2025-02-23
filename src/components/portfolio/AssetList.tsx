'use client';

import { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Asset } from '@/contexts/PortfolioContext';
import { Money } from '@/domain/value-objects/Money';

interface AssetListProps {
  onSelectAsset: (id: string) => void;
  selectedAssetId: string | null;
}

export default function AssetList({ onSelectAsset, selectedAssetId }: AssetListProps) {
  const { assets, loading } = usePortfolio();
  const [sortBy, setSortBy] = useState<keyof Asset>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<'all' | 'profit' | 'loss'>('all');

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true;
    const profitLoss = asset.currentPrice.multiply(asset.quantity).subtract(
      asset.purchasePrice.multiply(asset.quantity)
    );
    if (profitLoss.isFailure()) return false;
    const profitLossValue = profitLoss.getValue().getValue();
    if (filter === 'profit') return profitLossValue.amount > 0;
    return profitLossValue.amount < 0;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (aValue instanceof Money) {
      aValue = aValue.getValue().amount;
      bValue = (bValue as Money).getValue().amount;
    }

    if (aValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = (bValue as Date).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column: keyof Asset) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }: { column: keyof Asset }) => {
    if (sortBy !== column) return null;
    return (
      <span className="ml-1">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
      {/* Filtreler */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('profit')}
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              filter === 'profit'
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Karda
          </button>
          <button
            onClick={() => setFilter('loss')}
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              filter === 'loss'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Zararda
          </button>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-dark-paper">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('symbol')}
                >
                  Sembol
                  <SortIcon column="symbol" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('quantity')}
                >
                  Adet
                  <SortIcon column="quantity" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('currentPrice')}
                >
                  Güncel Fiyat
                  <SortIcon column="currentPrice" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Toplam Değer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Kar/Zarar
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('lastUpdate')}
                >
                  Son Güncelleme
                  <SortIcon column="lastUpdate" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sortedAssets.map((asset) => {
                const totalValue = asset.currentPrice.multiply(asset.quantity);
                const totalCost = asset.purchasePrice.multiply(asset.quantity);
                const profitLossResult = totalValue.subtract(totalCost);
                
                if (profitLossResult.isFailure()) {
                  return null; // Skip rendering this row if calculation fails
                }

                const profitLoss = profitLossResult.getValue();
                const profitLossValue = profitLoss.getValue();
                const totalCostValue = totalCost.getValue();
                const profitLossPercentage = (profitLossValue.amount / totalCostValue.amount) * 100;

                return (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset.id)}
                    className={`hover:bg-dark-paper transition-colors duration-200 cursor-pointer ${
                      selectedAssetId === asset.id ? 'bg-dark-paper' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{asset.symbol}</div>
                        <div className="text-sm text-gray-400">{asset.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{asset.quantity}</div>
                      <div className="text-sm text-gray-400">
                        Ort. {asset.purchasePrice.format()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {asset.currentPrice.format()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {totalValue.format()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${profitLossValue.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profitLoss.format()}
                      </div>
                      <div className={`text-sm ${profitLossValue.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {asset.lastUpdate.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
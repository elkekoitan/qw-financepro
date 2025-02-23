'use client';

import { useState } from 'react';
import { useInvestment } from '@/contexts/InvestmentContext';
import { InvestmentType } from '@/domain/entities/Investment';

interface InvestmentListProps {
  onSelectInvestment: (id: string) => void;
  selectedInvestmentId: string | null;
}

export default function InvestmentList({ onSelectInvestment, selectedInvestmentId }: InvestmentListProps) {
  const { investments, loading } = useInvestment();
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'performance'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<InvestmentType | 'all'>('all');

  const handleSort = async (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }: { column: typeof sortBy }) => {
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
            onClick={() => setFilter(InvestmentType.STOCK)}
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              filter === InvestmentType.STOCK
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Hisse Senedi
          </button>
          <button
            onClick={() => setFilter(InvestmentType.BOND)}
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              filter === InvestmentType.BOND
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tahvil
          </button>
          <button
            onClick={() => setFilter(InvestmentType.CRYPTO)}
            className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
              filter === InvestmentType.CRYPTO
                ? 'bg-yellow-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Kripto
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
                  onClick={() => handleSort('date')}
                >
                  Tarih
                  <SortIcon column="date" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Tür
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Sembol
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Miktar
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('value')}
                >
                  Değer
                  <SortIcon column="value" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('performance')}
                >
                  Performans
                  <SortIcon column="performance" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {investments
                .filter(investment => filter === 'all' || investment.type === filter)
                .map((investment) => {
                  const value = investment.price.multiply(investment.quantity);

                  return (
                    <tr
                      key={investment.id.toString()}
                      onClick={() => onSelectInvestment(investment.id.toString())}
                      className={`hover:bg-dark-paper transition-colors duration-200 cursor-pointer ${
                        selectedInvestmentId === investment.id.toString() ? 'bg-dark-paper' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {investment.date.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          investment.type === InvestmentType.STOCK ? 'bg-green-900/50 text-green-400' :
                          investment.type === InvestmentType.BOND ? 'bg-blue-900/50 text-blue-400' :
                          investment.type === InvestmentType.CRYPTO ? 'bg-yellow-900/50 text-yellow-400' :
                          investment.type === InvestmentType.COMMODITY ? 'bg-orange-900/50 text-orange-400' :
                          'bg-gray-900/50 text-gray-400'
                        }`}>
                          {investment.type === InvestmentType.STOCK ? 'Hisse Senedi' :
                           investment.type === InvestmentType.BOND ? 'Tahvil' :
                           investment.type === InvestmentType.CRYPTO ? 'Kripto' :
                           investment.type === InvestmentType.COMMODITY ? 'Emtia' : 'Nakit'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{investment.symbol}</div>
                          <div className="text-sm text-gray-400">{investment.notes}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{investment.quantity}</div>
                        <div className="text-sm text-gray-400">
                          {investment.price.format()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {value.format()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-400">
                          +15.5%
                        </div>
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
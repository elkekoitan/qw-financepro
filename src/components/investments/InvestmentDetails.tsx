'use client';

import { useInvestment } from '@/contexts/InvestmentContext';
import { InvestmentType } from '@/domain/entities/Investment';

interface InvestmentDetailsProps {
  investmentId: string;
  onClose: () => void;
}

export default function InvestmentDetails({ investmentId, onClose }: InvestmentDetailsProps) {
  const { investments } = useInvestment();
  const investment = investments.find(i => i.id.toString() === investmentId);

  if (!investment) return null;

  const value = investment.price.multiply(investment.quantity);

  return (
    <div className="bg-dark-surface rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Yatırım Detayları</h2>
          <p className="text-sm text-gray-400">
            {investment.date.toLocaleString('tr-TR')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Temel Bilgiler */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
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
            <h3 className="text-lg font-medium text-white">{investment.symbol}</h3>
          </div>

          {investment.notes && (
            <p className="text-sm text-gray-400 mb-4">
              {investment.notes}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Miktar</p>
              <p className="text-lg font-medium text-white">{investment.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Birim Fiyat</p>
              <p className="text-lg font-medium text-white">{investment.price.format()}</p>
            </div>
          </div>
        </div>

        {/* Değer ve Performans */}
        <div className="border-t border-gray-800 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Toplam Değer</p>
              <p className="text-lg font-medium text-white">{value.format()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Performans</p>
              <p className="text-lg font-medium text-green-400">+15.5%</p>
            </div>
          </div>
        </div>

        {/* İşlemler */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex space-x-4">
            <button
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors duration-200"
            >
              Düzenle
            </button>
            <button
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
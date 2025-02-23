'use client';

import { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Money } from '@/domain/value-objects/Money';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AssetType = 'stock' | 'bond' | 'crypto' | 'commodity' | 'cash';

interface Asset {
  symbol: string;
  name: string;
  currentPrice: Money;
  type: AssetType;
}

export default function AddAssetModal({ isOpen, onClose }: AddAssetModalProps) {
  const { addAsset } = usePortfolio();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState<string | null>(null);

  // TODO: Bu veriler market context'ten gelecek
  const assets: Asset[] = [
    {
      symbol: 'THYAO',
      name: 'Türk Hava Yolları',
      currentPrice: Money.create(170.50, 'TRY').getValue(),
      type: 'stock' as const
    },
    {
      symbol: 'GARAN',
      name: 'Garanti Bankası',
      currentPrice: Money.create(42.80, 'TRY').getValue(),
      type: 'stock' as const
    },
    {
      symbol: 'ASELS',
      name: 'Aselsan',
      currentPrice: Money.create(84.20, 'TRY').getValue(),
      type: 'stock' as const
    }
  ];

  const searchResults = assets.filter(asset => 
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setError(null);
  };

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setStep(2);
  };

  const handleQuantityChange = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setQuantity(numValue);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedAsset) {
      setError('Lütfen bir varlık seçin');
      return;
    }

    const numQuantity = parseInt(quantity);
    if (!numQuantity || numQuantity <= 0) {
      setError('Lütfen geçerli bir miktar girin');
      return;
    }

    setLoading(true);
    try {
      const result = await addAsset({
        symbol: selectedAsset.symbol,
        name: selectedAsset.name,
        quantity: numQuantity,
        purchasePrice: selectedAsset.currentPrice,
        currentPrice: selectedAsset.currentPrice,
        type: selectedAsset.type
      });

      if (result.isFailure()) {
        setError(result.getError());
        return;
      }

      onClose();
      setStep(1);
      setSearchQuery('');
      setSelectedAsset(null);
      setQuantity('');
    } catch (err: any) {
      setError(err.message || 'Varlık eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-dark-surface rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">
              {step === 1 ? 'Varlık Seç' : 'Miktar Belirle'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Varlık ara (örn: THYAO)"
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {searchResults.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => handleSelectAsset(asset)}
                    className="w-full p-3 text-left bg-dark hover:bg-dark-paper rounded-md transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-white">{asset.symbol}</p>
                        <p className="text-xs text-gray-400">{asset.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{asset.currentPrice.format()}</p>
                        <p className="text-xs text-gray-400">
                          {asset.type === 'stock' ? 'Hisse Senedi' :
                           asset.type === 'bond' ? 'Tahvil' :
                           asset.type === 'crypto' ? 'Kripto' :
                           asset.type === 'commodity' ? 'Emtia' : 'Nakit'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedAsset && (
                <div className="p-3 bg-dark rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">{selectedAsset.symbol}</p>
                      <p className="text-xs text-gray-400">{selectedAsset.name}</p>
                    </div>
                    <p className="text-sm text-white">{selectedAsset.currentPrice.format()}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-400 mb-1">
                  Adet
                </label>
                <input
                  type="text"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {selectedAsset && quantity && (
                <div className="p-3 bg-dark rounded-md">
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Toplam Değer</span>
                    <span className="text-white font-medium">
                      {selectedAsset.currentPrice.multiply(parseInt(quantity) || 0).format()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 text-red-400 text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end space-x-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Geri
              </button>
            )}
            <button
              onClick={step === 1 ? onClose : handleSubmit}
              disabled={loading || (step === 2 && (!selectedAsset || !quantity))}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>İşleniyor...</span>
                </div>
              ) : step === 1 ? (
                'İptal'
              ) : (
                'Ekle'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
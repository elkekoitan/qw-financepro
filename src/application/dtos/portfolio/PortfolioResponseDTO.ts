export interface PortfolioAssetResponseDTO {
  id: string;
  symbol: string;
  quantity: number;
  purchasePrice: {
    amount: number;
    currency: string;
  };
  currentPrice: {
    amount: number;
    currency: string;
  };
  value: {
    amount: number;
    currency: string;
  };
  gainLoss: {
    amount: number;
    percentage: number;
  };
}

export interface PortfolioResponseDTO {
  id: string;
  userId: string;
  name: string;
  description?: string;
  assets: PortfolioAssetResponseDTO[];
  totalValue: {
    amount: number;
    currency: string;
  };
  totalGainLoss: {
    amount: number;
    percentage: number;
  };
  createdAt: Date;
  updatedAt: Date;
} 
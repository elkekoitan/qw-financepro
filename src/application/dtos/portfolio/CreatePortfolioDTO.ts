export interface CreatePortfolioAssetDTO {
  symbol: string;
  quantity: number;
  purchasePrice: {
    amount: number;
    currency: string;
  };
}

export interface CreatePortfolioDTO {
  userId: string;
  name: string;
  description?: string;
  assets?: CreatePortfolioAssetDTO[];
} 
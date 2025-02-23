import { CreatePortfolioAssetDTO } from './CreatePortfolioDTO';

export interface UpdatePortfolioDTO {
  name?: string;
  description?: string;
  assets?: CreatePortfolioAssetDTO[];
} 
export interface PortfolioData {
  name: string;
  value: number;
}

export interface Transaction {
  id: number;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
}

export interface AssetSummary {
  totalValue: number;
  dailyGain: number;
  dailyGainPercentage: number;
  activeInvestments: {
    stocks: number;
    crypto: number;
    funds: number;
  };
  riskScore: number;
}

export interface DashboardState {
  loading: boolean;
  error: string | null;
  portfolioData: PortfolioData[];
  recentTransactions: Transaction[];
  assetSummary: AssetSummary;
}

export interface DashboardProps {
  initialData?: {
    portfolioData?: PortfolioData[];
    recentTransactions?: Transaction[];
    assetSummary?: AssetSummary;
  };
} 
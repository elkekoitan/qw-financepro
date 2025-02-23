export interface RiskProfile {
  id: string;
  level: number;
  description: string;
  recommendedAllocation: {
    stocks: number;
    bonds: number;
    crypto: number;
    commodities: number;
    cash: number;
  };
}

export interface InvestmentGoal {
  id: string;
  type: 'retirement' | 'savings' | 'growth' | 'income';
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  monthlyContribution: number;
  expectedReturn: number;
}

export interface AssetAllocation {
  type: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface InvestmentProfileData {
  id: string;
  userId: string;
  riskProfile: RiskProfile;
  goals: InvestmentGoal[];
  currentAllocation: AssetAllocation[];
  recommendedAllocation: AssetAllocation[];
  monthlyIncome: number;
  monthlyExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
  lastUpdated: string;
}

export interface InvestmentProfileState {
  loading: boolean;
  error: string | null;
  success: string | null;
  data: InvestmentProfileData | null;
  isEditMode: boolean;
}

export interface InvestmentProfileFormData {
  monthlyIncome: number;
  monthlyExpenses: number;
  riskLevel: number;
  goals: Omit<InvestmentGoal, 'id'>[];
}

export interface InvestmentProfileProps {
  initialData?: InvestmentProfileData;
} 
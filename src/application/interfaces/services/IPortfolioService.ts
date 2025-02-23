import { Result } from '../../../core/logic/Result';
import { Money } from '../../../domain/value-objects/Money';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';

export interface PortfolioPerformance {
  totalValue: Money;
  totalGain: Money;
  totalGainPercentage: number;
  periodReturn: number;
  annualizedReturn: number;
}

export interface AssetAllocation {
  symbol: string;
  percentage: number;
  value: Money;
}

export interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  beta: number;
  alpha: number;
  maxDrawdown: number;
}

export interface IPortfolioService {
  calculatePerformance(
    portfolioId: UniqueEntityID,
    startDate: Date,
    endDate: Date
  ): Promise<Result<PortfolioPerformance, string>>;

  calculateAssetAllocation(
    portfolioId: UniqueEntityID
  ): Promise<Result<AssetAllocation[], string>>;

  calculateRiskMetrics(
    portfolioId: UniqueEntityID,
    startDate: Date,
    endDate: Date
  ): Promise<Result<RiskMetrics, string>>;

  rebalancePortfolio(
    portfolioId: UniqueEntityID,
    targetAllocations: Map<string, number>
  ): Promise<Result<void, string>>;

  generateInvestmentRecommendations(
    portfolioId: UniqueEntityID
  ): Promise<Result<string[], string>>;

  analyzeDiversification(
    portfolioId: UniqueEntityID
  ): Promise<Result<number, string>>;

  calculateDividendYield(
    portfolioId: UniqueEntityID
  ): Promise<Result<number, string>>;

  getTaxLotAnalysis(
    portfolioId: UniqueEntityID
  ): Promise<Result<Map<string, Money>, string>>;

  getFutureValueProjection(
    portfolioId: UniqueEntityID,
    years: number,
    expectedReturn: number
  ): Promise<Result<Money, string>>;
} 
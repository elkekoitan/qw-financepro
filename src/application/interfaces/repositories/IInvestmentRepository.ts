import { Investment, InvestmentType } from '@/domain/entities/Investment';
import { Result } from '@/core/logic/Result';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';

export interface IInvestmentRepository {
  exists(id: UniqueEntityID): Promise<boolean>;
  findById(id: UniqueEntityID): Promise<Result<Investment, string>>;
  findByPortfolioId(portfolioId: UniqueEntityID): Promise<Result<Investment[], string>>;
  findBySymbol(symbol: string): Promise<Result<Investment[], string>>;
  findByType(type: InvestmentType): Promise<Result<Investment[], string>>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Result<Investment[], string>>;
  findByPortfolioIdAndDateRange(
    portfolioId: UniqueEntityID,
    startDate: Date,
    endDate: Date
  ): Promise<Result<Investment[], string>>;
  findAll(): Promise<Result<Investment[], string>>;
  save(investment: Investment): Promise<Result<void, string>>;
  update(investment: Investment): Promise<Result<void, string>>;
  delete(id: UniqueEntityID): Promise<Result<void, string>>;
} 
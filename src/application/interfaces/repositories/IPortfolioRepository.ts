import { Portfolio } from '@/domain/entities/Portfolio';
import { Result } from '@/core/logic/Result';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';

export interface IPortfolioRepository {
  findByUserId(userId: UniqueEntityID): Promise<Result<Portfolio>>;
  save(portfolio: Portfolio): Promise<Result<void>>;
  update(portfolio: Portfolio): Promise<Result<void>>;
  delete(id: UniqueEntityID): Promise<Result<void>>;
} 
import { InvestmentType } from '../../../domain/entities/Investment';

export interface CreateInvestmentDTO {
  portfolioId: string;
  type: InvestmentType;
  symbol: string;
  quantity: number;
  price: {
    amount: number;
    currency: string;
  };
  date: Date;
  notes?: string;
} 
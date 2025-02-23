import { InvestmentType } from '../../../domain/entities/Investment';

export interface InvestmentResponseDTO {
  id: string;
  portfolioId: string;
  type: InvestmentType;
  symbol: string;
  quantity: number;
  price: {
    amount: number;
    currency: string;
  };
  currentValue: {
    amount: number;
    currency: string;
  };
  gainLoss: {
    amount: number;
    percentage: number;
  };
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 
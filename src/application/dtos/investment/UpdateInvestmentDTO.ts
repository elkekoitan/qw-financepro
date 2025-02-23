import { InvestmentType } from '../../../domain/entities/Investment';

export interface UpdateInvestmentDTO {
  type?: InvestmentType;
  quantity?: number;
  price?: {
    amount: number;
    currency: string;
  };
  date?: Date;
  notes?: string;
} 
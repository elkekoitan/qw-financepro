'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { Money } from '@/domain/value-objects/Money';
import { Result } from '@/core/logic/Result';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { Investment, InvestmentType } from '@/domain/entities/Investment';

interface InvestmentContextType {
  // Investment data
  investments: Investment[];
  loading: boolean;
  error: string | null;

  // Investment metrics
  totalInvestments: Money;
  totalReturn: Money;
  totalReturnPercentage: number;
  bestPerforming: Investment | null;
  worstPerforming: Investment | null;

  // Investment actions
  addInvestment: (investment: Omit<Investment, 'id' | 'lastUpdate'>) => Promise<Result<void>>;
  updateInvestment: (id: string, updates: Partial<Investment>) => Promise<Result<void>>;
  removeInvestment: (id: string) => Promise<Result<void>>;
  refreshPrices: () => Promise<Result<void>>;

  // Filters and sorting
  filterByType: (type: InvestmentType) => Promise<Result<Investment[]>>;
  filterByDateRange: (startDate: Date, endDate: Date) => Promise<Result<Investment[]>>;
  sortByPerformance: (ascending: boolean) => Promise<Result<Investment[]>>;
  sortByValue: (ascending: boolean) => Promise<Result<Investment[]>>;
  sortByDate: (ascending: boolean) => Promise<Result<Investment[]>>;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculated values
  const totalInvestments = investments.reduce(
    (sum, investment) => sum.add(investment.price.multiply(investment.quantity)).getValue(),
    Money.create(0, 'TRY').getValue()
  );

  const totalReturn = Money.create(25000, 'TRY').getValue(); // TODO: Hesapla
  const totalReturnPercentage = 15.5; // TODO: Hesapla

  const bestPerforming = investments.length > 0 ? investments[0] : null; // TODO: Hesapla
  const worstPerforming = investments.length > 0 ? investments[investments.length - 1] : null; // TODO: Hesapla

  useEffect(() => {
    if (user) {
      loadInvestments();
    }
  }, [user]);

  const loadInvestments = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: API'den yatırım verilerini çek
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      // Örnek veri
      const sampleInvestments: Investment[] = [
        Investment.create({
          portfolioId: new UniqueEntityID(),
          type: InvestmentType.STOCK,
          symbol: 'THYAO',
          quantity: 100,
          price: Money.create(150, 'TRY').getValue(),
          date: new Date(),
          notes: 'İlk alım'
        }).getValue(),
        Investment.create({
          portfolioId: new UniqueEntityID(),
          type: InvestmentType.STOCK,
          symbol: 'GARAN',
          quantity: 200,
          price: Money.create(44.50, 'TRY').getValue(),
          date: new Date(),
          notes: 'İlk alım'
        }).getValue()
      ];

      setInvestments(sampleInvestments);
    } catch (err: any) {
      setError(err.message || 'Yatırımlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addInvestment = async (investment: Omit<Investment, 'id' | 'lastUpdate'>): Promise<Result<void>> => {
    try {
      // TODO: API'ye yatırım ekleme isteği gönder
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      const investmentResult = Investment.create({
        ...investment,
        portfolioId: new UniqueEntityID(),
        date: new Date()
      });

      if (investmentResult.isFailure()) {
        return Result.fail<void>(investmentResult.getError());
      }

      setInvestments(prev => [...prev, investmentResult.getValue()]);
      return Result.ok<void>(undefined);
    } catch (err: any) {
      return Result.fail<void>(err.message || 'Yatırım eklenirken bir hata oluştu');
    }
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>): Promise<Result<void>> => {
    try {
      // TODO: API'ye yatırım güncelleme isteği gönder
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      setInvestments(prev => prev.map(investment => {
        if (investment.id.toString() !== id) return investment;
        
        const updatedProps = {
          ...investment.getProps(),
          ...updates
        };
        
        const updatedInvestment = Investment.create(updatedProps);
        return updatedInvestment.isSuccess() ? updatedInvestment.getValue() : investment;
      }));
      
      return Result.ok<void>(undefined);
    } catch (err: any) {
      return Result.fail<void>(err.message || 'Yatırım güncellenirken bir hata oluştu');
    }
  };

  const removeInvestment = async (id: string): Promise<Result<void>> => {
    try {
      // TODO: API'ye yatırım silme isteği gönder
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      setInvestments(prev => prev.filter(investment => investment.id.toString() !== id));
      return Result.ok<void>(undefined);
    } catch (err: any) {
      return Result.fail<void>(err.message || 'Yatırım silinirken bir hata oluştu');
    }
  };

  const refreshPrices = async (): Promise<Result<void>> => {
    try {
      // TODO: API'den güncel fiyatları çek
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş API çağrısı

      // Örnek güncelleme
      setInvestments(prev => prev.map(investment => {
        const currentPrice = investment.price.getValue().amount * (1 + (Math.random() * 0.02 - 0.01)); // ±1% değişim
        const priceResult = Money.create(currentPrice, 'TRY');
        if (priceResult.isFailure()) return investment;
        
        const updatedInvestment = Investment.create({
          ...investment.getProps(),
          price: priceResult.getValue()
        });
        
        return updatedInvestment.isSuccess() ? updatedInvestment.getValue() : investment;
      }));

      return Result.ok<void>(undefined);
    } catch (err: any) {
      return Result.fail<void>(err.message || 'Fiyatlar güncellenirken bir hata oluştu');
    }
  };

  const filterByType = async (type: InvestmentType): Promise<Result<Investment[]>> => {
    try {
      const filtered = investments.filter(investment => investment.type === type);
      return Result.ok<Investment[]>(filtered);
    } catch (err: any) {
      return Result.fail<Investment[]>(err.message || 'Yatırımlar filtrelenirken bir hata oluştu');
    }
  };

  const filterByDateRange = async (startDate: Date, endDate: Date): Promise<Result<Investment[]>> => {
    try {
      const filtered = investments.filter(investment => 
        investment.date >= startDate && investment.date <= endDate
      );
      return Result.ok<Investment[]>(filtered);
    } catch (err: any) {
      return Result.fail<Investment[]>(err.message || 'Yatırımlar filtrelenirken bir hata oluştu');
    }
  };

  const sortByPerformance = async (ascending: boolean): Promise<Result<Investment[]>> => {
    try {
      const sorted = [...investments].sort((a, b) => {
        // TODO: Performans hesaplama
        const aPerformance = 0;
        const bPerformance = 0;
        return ascending ? aPerformance - bPerformance : bPerformance - aPerformance;
      });
      return Result.ok<Investment[]>(sorted);
    } catch (err: any) {
      return Result.fail<Investment[]>(err.message || 'Yatırımlar sıralanırken bir hata oluştu');
    }
  };

  const sortByValue = async (ascending: boolean): Promise<Result<Investment[]>> => {
    try {
      const sorted = [...investments].sort((a, b) => {
        const aValue = a.price.multiply(a.quantity).getValue().amount;
        const bValue = b.price.multiply(b.quantity).getValue().amount;
        return ascending ? aValue - bValue : bValue - aValue;
      });
      return Result.ok<Investment[]>(sorted);
    } catch (err: any) {
      return Result.fail<Investment[]>(err.message || 'Yatırımlar sıralanırken bir hata oluştu');
    }
  };

  const sortByDate = async (ascending: boolean): Promise<Result<Investment[]>> => {
    try {
      const sorted = [...investments].sort((a, b) => {
        return ascending ? 
          a.date.getTime() - b.date.getTime() : 
          b.date.getTime() - a.date.getTime();
      });
      return Result.ok<Investment[]>(sorted);
    } catch (err: any) {
      return Result.fail<Investment[]>(err.message || 'Yatırımlar sıralanırken bir hata oluştu');
    }
  };

  return (
    <InvestmentContext.Provider value={{
      investments,
      loading,
      error,
      totalInvestments,
      totalReturn,
      totalReturnPercentage,
      bestPerforming,
      worstPerforming,
      addInvestment,
      updateInvestment,
      removeInvestment,
      refreshPrices,
      filterByType,
      filterByDateRange,
      sortByPerformance,
      sortByValue,
      sortByDate
    }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestment() {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
} 
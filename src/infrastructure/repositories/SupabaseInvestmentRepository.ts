import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IInvestmentRepository } from '@/application/interfaces/repositories/IInvestmentRepository';
import { Investment, InvestmentType } from '@/domain/entities/Investment';
import { Result } from '@/core/logic/Result';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { Money } from '@/domain/value-objects/Money';

export class SupabaseInvestmentRepository implements IInvestmentRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async exists(id: UniqueEntityID): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('id')
        .eq('id', id.toString())
        .single();

      if (error) {
        console.error('Error checking investment existence:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking investment existence:', error);
      return false;
    }
  }

  async save(investment: Investment): Promise<Result<void, string>> {
    try {
      const props = investment.getProps();
      
      const { error } = await this.supabase
        .from('investments')
        .insert({
          id: investment.id.toString(),
          portfolio_id: props.portfolioId.toString(),
          type: props.type,
          symbol: props.symbol,
          quantity: props.quantity,
          price: props.price.getValue().amount,
          currency: props.price.getValue().currency,
          date: props.date,
          notes: props.notes,
          created_at: new Date(),
          updated_at: new Date()
        });

      if (error) {
        console.error('Error saving investment:', error);
        return Result.fail('Failed to save investment');
      }

      return Result.ok(undefined);
    } catch (error) {
      console.error('Error saving investment:', error);
      return Result.fail('Error saving investment');
    }
  }

  async findById(id: UniqueEntityID): Promise<Result<Investment, string>> {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('*')
        .eq('id', id.toString())
        .single();

      if (error) {
        return Result.fail('Investment not found');
      }

      return this.mapToInvestment(data);
    } catch (error) {
      console.error('Error finding investment:', error);
      return Result.fail('Error finding investment');
    }
  }

  async findByPortfolioId(portfolioId: UniqueEntityID): Promise<Result<Investment[], string>> {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('*')
        .eq('portfolio_id', portfolioId.toString());

      if (error) {
        return Result.fail('Failed to fetch investments');
      }

      const investments: Investment[] = [];
      for (const investmentData of data) {
        const investmentResult = await this.mapToInvestment(investmentData);
        if (investmentResult.isSuccess()) {
          investments.push(investmentResult.getValue());
        }
      }

      return Result.ok(investments);
    } catch (error) {
      console.error('Error fetching investments:', error);
      return Result.fail('Error fetching investments');
    }
  }

  async update(investment: Investment): Promise<Result<void, string>> {
    try {
      const props = investment.getProps();
      
      const { error } = await this.supabase
        .from('investments')
        .update({
          type: props.type,
          symbol: props.symbol,
          quantity: props.quantity,
          price: props.price.getValue().amount,
          currency: props.price.getValue().currency,
          date: props.date,
          notes: props.notes,
          updated_at: new Date()
        })
        .eq('id', investment.id.toString());

      if (error) {
        console.error('Error updating investment:', error);
        return Result.fail('Failed to update investment');
      }

      return Result.ok(undefined);
    } catch (error) {
      console.error('Error updating investment:', error);
      return Result.fail('Error updating investment');
    }
  }

  async delete(id: UniqueEntityID): Promise<Result<void, string>> {
    try {
      const { error } = await this.supabase
        .from('investments')
        .delete()
        .eq('id', id.toString());

      if (error) {
        console.error('Error deleting investment:', error);
        return Result.fail('Failed to delete investment');
      }

      return Result.ok(undefined);
    } catch (error) {
      console.error('Error deleting investment:', error);
      return Result.fail('Error deleting investment');
    }
  }

  async findAll(): Promise<Result<Investment[], string>> {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('*');

      if (error) {
        return Result.fail('Failed to fetch investments');
      }

      const investments: Investment[] = [];
      for (const investmentData of data) {
        const investmentResult = await this.mapToInvestment(investmentData);
        if (investmentResult.isSuccess()) {
          investments.push(investmentResult.getValue());
        }
      }

      return Result.ok(investments);
    } catch (error) {
      console.error('Error fetching all investments:', error);
      return Result.fail('Error fetching investments');
    }
  }

  async findBySymbol(symbol: string): Promise<Result<Investment[], string>> {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('*')
        .eq('symbol', symbol);

      if (error) {
        return Result.fail('Failed to fetch investments');
      }

      const investments: Investment[] = [];
      for (const investmentData of data) {
        const investmentResult = await this.mapToInvestment(investmentData);
        if (investmentResult.isSuccess()) {
          investments.push(investmentResult.getValue());
        }
      }

      return Result.ok(investments);
    } catch (error) {
      console.error('Error fetching investments by symbol:', error);
      return Result.fail('Error fetching investments');
    }
  }

  async findByType(type: InvestmentType): Promise<Result<Investment[], string>> {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('*')
        .eq('type', type);

      if (error) {
        return Result.fail('Failed to fetch investments');
      }

      const investments: Investment[] = [];
      for (const investmentData of data) {
        const investmentResult = await this.mapToInvestment(investmentData);
        if (investmentResult.isSuccess()) {
          investments.push(investmentResult.getValue());
        }
      }

      return Result.ok(investments);
    } catch (error) {
      console.error('Error fetching investments by type:', error);
      return Result.fail('Error fetching investments');
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Result<Investment[], string>> {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString());

      if (error) {
        return Result.fail('Failed to fetch investments');
      }

      const investments: Investment[] = [];
      for (const investmentData of data) {
        const investmentResult = await this.mapToInvestment(investmentData);
        if (investmentResult.isSuccess()) {
          investments.push(investmentResult.getValue());
        }
      }

      return Result.ok(investments);
    } catch (error) {
      console.error('Error fetching investments by date range:', error);
      return Result.fail('Error fetching investments');
    }
  }

  async findByPortfolioIdAndDateRange(
    portfolioId: UniqueEntityID,
    startDate: Date,
    endDate: Date
  ): Promise<Result<Investment[], string>> {
    try {
      const { data, error } = await this.supabase
        .from('investments')
        .select('*')
        .eq('portfolio_id', portfolioId.toString())
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString());

      if (error) {
        return Result.fail('Failed to fetch investments');
      }

      const investments: Investment[] = [];
      for (const investmentData of data) {
        const investmentResult = await this.mapToInvestment(investmentData);
        if (investmentResult.isSuccess()) {
          investments.push(investmentResult.getValue());
        }
      }

      return Result.ok(investments);
    } catch (error) {
      console.error('Error fetching investments by portfolio and date range:', error);
      return Result.fail('Error fetching investments');
    }
  }

  private async mapToInvestment(data: any): Promise<Result<Investment, string>> {
    try {
      const priceOrError = Money.create(data.price, data.currency);
      if (priceOrError.isFailure()) {
        return Result.fail(priceOrError.getError());
      }

      const investmentOrError = Investment.create({
        portfolioId: new UniqueEntityID(data.portfolio_id),
        type: data.type as InvestmentType,
        symbol: data.symbol,
        quantity: data.quantity,
        price: priceOrError.getValue(),
        date: new Date(data.date),
        notes: data.notes
      }, new UniqueEntityID(data.id));

      if (investmentOrError.isFailure()) {
        return Result.fail(investmentOrError.getError());
      }

      return Result.ok(investmentOrError.getValue());
    } catch (error) {
      console.error('Error mapping investment data:', error);
      return Result.fail('Error mapping investment data');
    }
  }
} 
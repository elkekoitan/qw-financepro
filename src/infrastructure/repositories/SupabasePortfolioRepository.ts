import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IPortfolioRepository } from '@/application/interfaces/repositories/IPortfolioRepository';
import { Portfolio } from '@/domain/entities/Portfolio';
import { Result } from '@/core/logic/Result';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { Money } from '@/domain/value-objects/Money';

export class SupabasePortfolioRepository implements IPortfolioRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async findByUserId(userId: UniqueEntityID): Promise<Result<Portfolio>> {
    try {
      const { data, error } = await this.supabase
        .from('portfolios')
        .select(`
          *,
          assets:portfolio_assets(*)
        `)
        .eq('user_id', userId.toString())
        .single();

      if (error) {
        return Result.fail<Portfolio>('Portfolio not found');
      }

      return this.mapToPortfolio(data);
    } catch (error) {
      console.error('Error finding portfolio:', error);
      return Result.fail<Portfolio>('Error finding portfolio');
    }
  }

  async save(portfolio: Portfolio): Promise<Result<void>> {
    try {
      const props = portfolio.getProps();
      
      // Start a transaction
      const { error: transactionError } = await this.supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;

      try {
        // Save portfolio
        const { error: portfolioError } = await this.supabase
          .from('portfolios')
          .insert({
            id: portfolio.id.toString(),
            user_id: props.userId.toString(),
            created_at: new Date(),
            updated_at: new Date()
          });

        if (portfolioError) throw portfolioError;

        // Save assets
        if (props.assets.length > 0) {
          const assetsToInsert = props.assets.map(asset => ({
            id: asset.id.toString(),
            portfolio_id: portfolio.id.toString(),
            symbol: asset.symbol,
            quantity: asset.quantity,
            purchase_price: asset.purchasePrice.getValue().amount,
            purchase_currency: asset.purchasePrice.getValue().currency,
            current_price: asset.currentPrice.getValue().amount,
            current_currency: asset.currentPrice.getValue().currency
          }));

          const { error: assetsError } = await this.supabase
            .from('portfolio_assets')
            .insert(assetsToInsert);

          if (assetsError) throw assetsError;
        }

        // Commit transaction
        const { error: commitError } = await this.supabase.rpc('commit_transaction');
        if (commitError) throw commitError;

        return Result.ok<void>(undefined);
      } catch (error) {
        // Rollback transaction on error
        await this.supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      return Result.fail<void>('Failed to save portfolio');
    }
  }

  async update(portfolio: Portfolio): Promise<Result<void>> {
    try {
      const props = portfolio.getProps();
      
      // Start a transaction
      const { error: transactionError } = await this.supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;

      try {
        // Update portfolio
        const { error: portfolioError } = await this.supabase
          .from('portfolios')
          .update({
            updated_at: new Date()
          })
          .eq('id', portfolio.id.toString());

        if (portfolioError) throw portfolioError;

        // Delete existing assets
        const { error: deleteError } = await this.supabase
          .from('portfolio_assets')
          .delete()
          .eq('portfolio_id', portfolio.id.toString());

        if (deleteError) throw deleteError;

        // Insert updated assets
        if (props.assets.length > 0) {
          const assetsToInsert = props.assets.map(asset => ({
            id: asset.id.toString(),
            portfolio_id: portfolio.id.toString(),
            symbol: asset.symbol,
            quantity: asset.quantity,
            purchase_price: asset.purchasePrice.getValue().amount,
            purchase_currency: asset.purchasePrice.getValue().currency,
            current_price: asset.currentPrice.getValue().amount,
            current_currency: asset.currentPrice.getValue().currency
          }));

          const { error: assetsError } = await this.supabase
            .from('portfolio_assets')
            .insert(assetsToInsert);

          if (assetsError) throw assetsError;
        }

        // Commit transaction
        const { error: commitError } = await this.supabase.rpc('commit_transaction');
        if (commitError) throw commitError;

        return Result.ok<void>(undefined);
      } catch (error) {
        // Rollback transaction on error
        await this.supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      return Result.fail<void>('Failed to update portfolio');
    }
  }

  async delete(id: UniqueEntityID): Promise<Result<void>> {
    try {
      // Start a transaction
      const { error: transactionError } = await this.supabase.rpc('begin_transaction');
      if (transactionError) throw transactionError;

      try {
        // Delete assets first (foreign key constraint)
        const { error: assetsError } = await this.supabase
          .from('portfolio_assets')
          .delete()
          .eq('portfolio_id', id.toString());

        if (assetsError) throw assetsError;

        // Delete portfolio
        const { error: portfolioError } = await this.supabase
          .from('portfolios')
          .delete()
          .eq('id', id.toString());

        if (portfolioError) throw portfolioError;

        // Commit transaction
        const { error: commitError } = await this.supabase.rpc('commit_transaction');
        if (commitError) throw commitError;

        return Result.ok<void>(undefined);
      } catch (error) {
        // Rollback transaction on error
        await this.supabase.rpc('rollback_transaction');
        throw error;
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      return Result.fail<void>('Failed to delete portfolio');
    }
  }

  private async mapToPortfolio(data: any): Promise<Result<Portfolio>> {
    try {
      const assets = data.assets.map((asset: any) => ({
        id: new UniqueEntityID(asset.id),
        symbol: asset.symbol,
        quantity: asset.quantity,
        purchasePrice: Money.create(asset.purchase_price, asset.purchase_currency).getValue(),
        currentPrice: Money.create(asset.current_price, asset.current_currency).getValue()
      }));

      const portfolioOrError = Portfolio.create({
        userId: new UniqueEntityID(data.user_id),
        assets
      }, new UniqueEntityID(data.id));

      if (portfolioOrError.isFailure()) {
        return Result.fail<Portfolio>(portfolioOrError.getError());
      }

      return Result.ok<Portfolio>(portfolioOrError.getValue());
    } catch (error) {
      console.error('Error mapping portfolio data:', error);
      return Result.fail<Portfolio>('Error mapping portfolio data');
    }
  }
} 
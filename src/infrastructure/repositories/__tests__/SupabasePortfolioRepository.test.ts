import { SupabasePortfolioRepository } from '../SupabasePortfolioRepository';
import { Portfolio } from '@/domain/entities/Portfolio';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { Money } from '@/domain/value-objects/Money';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    })),
    rpc: jest.fn(() => Promise.resolve({ error: null }))
  }))
}));

describe('SupabasePortfolioRepository', () => {
  let repository: SupabasePortfolioRepository;
  let mockSupabase: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create new repository instance
    repository = new SupabasePortfolioRepository();
    mockSupabase = (createClient as jest.Mock).mock.results[0].value;
  });

  describe('findByUserId', () => {
    it('should return portfolio when found', async () => {
      // Arrange
      const userId = new UniqueEntityID();
      const portfolioData = {
        id: '123',
        user_id: userId.toString(),
        assets: [
          {
            id: '456',
            symbol: 'AAPL',
            quantity: 10,
            purchase_price: 150,
            purchase_currency: 'USD',
            current_price: 160,
            current_currency: 'USD'
          }
        ]
      };

      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: portfolioData,
        error: null
      });

      // Act
      const result = await repository.findByUserId(userId);

      // Assert
      expect(result.isSuccess()).toBe(true);
      const portfolio = result.getValue();
      expect(portfolio.getProps().userId.toString()).toBe(userId.toString());
      expect(portfolio.getProps().assets.length).toBe(1);
      expect(portfolio.getProps().assets[0].symbol).toBe('AAPL');
    });

    it('should return failure when portfolio not found', async () => {
      // Arrange
      const userId = new UniqueEntityID();
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' }
      });

      // Act
      const result = await repository.findByUserId(userId);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Portfolio not found');
    });
  });

  describe('save', () => {
    it('should save portfolio and assets successfully', async () => {
      // Arrange
      const userId = new UniqueEntityID();
      const portfolioOrError = Portfolio.create({
        userId,
        assets: [
          {
            id: new UniqueEntityID(),
            symbol: 'AAPL',
            quantity: 10,
            purchasePrice: Money.create(150, 'USD').getValue(),
            currentPrice: Money.create(160, 'USD').getValue()
          }
        ]
      });
      const portfolio = portfolioOrError.getValue();

      // Act
      const result = await repository.save(portfolio);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('begin_transaction');
      expect(mockSupabase.from().insert).toHaveBeenCalledTimes(2); // Once for portfolio, once for assets
      expect(mockSupabase.rpc).toHaveBeenCalledWith('commit_transaction');
    });

    it('should rollback transaction on error', async () => {
      // Arrange
      const userId = new UniqueEntityID();
      const portfolioOrError = Portfolio.create({
        userId,
        assets: [
          {
            id: new UniqueEntityID(),
            symbol: 'AAPL',
            quantity: 10,
            purchasePrice: Money.create(150, 'USD').getValue(),
            currentPrice: Money.create(160, 'USD').getValue()
          }
        ]
      });
      const portfolio = portfolioOrError.getValue();

      mockSupabase.from().insert.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      // Act
      const result = await repository.save(portfolio);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to save portfolio');
      expect(mockSupabase.rpc).toHaveBeenCalledWith('rollback_transaction');
    });
  });

  describe('update', () => {
    it('should update portfolio and assets successfully', async () => {
      // Arrange
      const userId = new UniqueEntityID();
      const portfolioOrError = Portfolio.create({
        userId,
        assets: [
          {
            id: new UniqueEntityID(),
            symbol: 'AAPL',
            quantity: 10,
            purchasePrice: Money.create(150, 'USD').getValue(),
            currentPrice: Money.create(160, 'USD').getValue()
          }
        ]
      });
      const portfolio = portfolioOrError.getValue();

      // Act
      const result = await repository.update(portfolio);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('begin_transaction');
      expect(mockSupabase.from().update().eq).toHaveBeenCalled();
      expect(mockSupabase.from().delete().eq).toHaveBeenCalled();
      expect(mockSupabase.from().insert).toHaveBeenCalled();
      expect(mockSupabase.rpc).toHaveBeenCalledWith('commit_transaction');
    });

    it('should rollback transaction on error', async () => {
      // Arrange
      const userId = new UniqueEntityID();
      const portfolioOrError = Portfolio.create({
        userId,
        assets: [
          {
            id: new UniqueEntityID(),
            symbol: 'AAPL',
            quantity: 10,
            purchasePrice: Money.create(150, 'USD').getValue(),
            currentPrice: Money.create(160, 'USD').getValue()
          }
        ]
      });
      const portfolio = portfolioOrError.getValue();

      mockSupabase.from().update().eq.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      // Act
      const result = await repository.update(portfolio);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to update portfolio');
      expect(mockSupabase.rpc).toHaveBeenCalledWith('rollback_transaction');
    });
  });

  describe('delete', () => {
    it('should delete portfolio and assets successfully', async () => {
      // Arrange
      const id = new UniqueEntityID();

      // Act
      const result = await repository.delete(id);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('begin_transaction');
      expect(mockSupabase.from().delete().eq).toHaveBeenCalledTimes(2); // Once for assets, once for portfolio
      expect(mockSupabase.rpc).toHaveBeenCalledWith('commit_transaction');
    });

    it('should rollback transaction on error', async () => {
      // Arrange
      const id = new UniqueEntityID();
      mockSupabase.from().delete().eq.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      // Act
      const result = await repository.delete(id);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to delete portfolio');
      expect(mockSupabase.rpc).toHaveBeenCalledWith('rollback_transaction');
    });
  });
}); 
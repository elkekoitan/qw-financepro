import { SupabaseInvestmentRepository } from '../SupabaseInvestmentRepository';
import { Investment, InvestmentType } from '@/domain/entities/Investment';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { Money } from '@/domain/value-objects/Money';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          gte: jest.fn(() => ({
            lte: jest.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        })),
        gte: jest.fn(() => ({
          lte: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }))
}));

describe('SupabaseInvestmentRepository', () => {
  let repository: SupabaseInvestmentRepository;
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new SupabaseInvestmentRepository();
    mockSupabase = (createClient as jest.Mock).mock.results[0].value;
  });

  describe('exists', () => {
    it('should return true when investment exists', async () => {
      const id = new UniqueEntityID();
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: { id: id.toString() },
        error: null
      });

      const result = await repository.exists(id);

      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('investments');
      expect(mockSupabase.from().select).toHaveBeenCalledWith('id');
    });

    it('should return false when investment does not exist', async () => {
      const id = new UniqueEntityID();
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' }
      });

      const result = await repository.exists(id);

      expect(result).toBe(false);
    });
  });

  describe('save', () => {
    it('should save investment successfully', async () => {
      const investment = Investment.create({
        portfolioId: new UniqueEntityID(),
        type: InvestmentType.STOCK,
        symbol: 'AAPL',
        quantity: 10,
        price: Money.create(150, 'USD').getValue(),
        date: new Date(),
        notes: 'Test investment'
      }).getValue();

      const result = await repository.save(investment);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('investments');
      expect(mockSupabase.from().insert).toHaveBeenCalled();
    });

    it('should return failure when save fails', async () => {
      const investment = Investment.create({
        portfolioId: new UniqueEntityID(),
        type: InvestmentType.STOCK,
        symbol: 'AAPL',
        quantity: 10,
        price: Money.create(150, 'USD').getValue(),
        date: new Date(),
        notes: 'Test investment'
      }).getValue();

      mockSupabase.from().insert.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      const result = await repository.save(investment);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to save investment');
    });
  });

  describe('findById', () => {
    it('should find investment by id', async () => {
      const id = new UniqueEntityID();
      const mockData = {
        id: id.toString(),
        portfolio_id: new UniqueEntityID().toString(),
        type: InvestmentType.STOCK,
        symbol: 'AAPL',
        quantity: 10,
        price: 150,
        currency: 'USD',
        date: new Date().toISOString(),
        notes: 'Test investment'
      };

      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: mockData,
        error: null
      });

      const result = await repository.findById(id);

      expect(result.isSuccess()).toBe(true);
      const investment = result.getValue();
      expect(investment.getProps().symbol).toBe('AAPL');
      expect(investment.getProps().quantity).toBe(10);
    });

    it('should return failure when investment not found', async () => {
      const id = new UniqueEntityID();
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' }
      });

      const result = await repository.findById(id);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Investment not found');
    });
  });

  describe('findByPortfolioId', () => {
    it('should find investments by portfolio id', async () => {
      const portfolioId = new UniqueEntityID();
      const mockData = [{
        id: new UniqueEntityID().toString(),
        portfolio_id: portfolioId.toString(),
        type: InvestmentType.STOCK,
        symbol: 'AAPL',
        quantity: 10,
        price: 150,
        currency: 'USD',
        date: new Date().toISOString(),
        notes: 'Test investment'
      }];

      mockSupabase.from().select().eq.mockResolvedValueOnce({
        data: mockData,
        error: null
      });

      const result = await repository.findByPortfolioId(portfolioId);

      expect(result.isSuccess()).toBe(true);
      const investments = result.getValue();
      expect(investments.length).toBe(1);
      expect(investments[0].getProps().symbol).toBe('AAPL');
    });

    it('should return empty array when no investments found', async () => {
      const portfolioId = new UniqueEntityID();
      mockSupabase.from().select().eq.mockResolvedValueOnce({
        data: [],
        error: null
      });

      const result = await repository.findByPortfolioId(portfolioId);

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update investment successfully', async () => {
      const investment = Investment.create({
        portfolioId: new UniqueEntityID(),
        type: InvestmentType.STOCK,
        symbol: 'AAPL',
        quantity: 10,
        price: Money.create(150, 'USD').getValue(),
        date: new Date(),
        notes: 'Test investment'
      }).getValue();

      const result = await repository.update(investment);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('investments');
      expect(mockSupabase.from().update().eq).toHaveBeenCalled();
    });

    it('should return failure when update fails', async () => {
      const investment = Investment.create({
        portfolioId: new UniqueEntityID(),
        type: InvestmentType.STOCK,
        symbol: 'AAPL',
        quantity: 10,
        price: Money.create(150, 'USD').getValue(),
        date: new Date(),
        notes: 'Test investment'
      }).getValue();

      mockSupabase.from().update().eq.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      const result = await repository.update(investment);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to update investment');
    });
  });

  describe('delete', () => {
    it('should delete investment successfully', async () => {
      const id = new UniqueEntityID();
      const result = await repository.delete(id);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('investments');
      expect(mockSupabase.from().delete().eq).toHaveBeenCalled();
    });

    it('should return failure when delete fails', async () => {
      const id = new UniqueEntityID();
      mockSupabase.from().delete().eq.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      const result = await repository.delete(id);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to delete investment');
    });
  });

  describe('findByDateRange', () => {
    it('should find investments within date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const mockData = [{
        id: new UniqueEntityID().toString(),
        portfolio_id: new UniqueEntityID().toString(),
        type: InvestmentType.STOCK,
        symbol: 'AAPL',
        quantity: 10,
        price: 150,
        currency: 'USD',
        date: new Date('2024-06-15').toISOString(),
        notes: 'Test investment'
      }];

      mockSupabase.from().select().gte().lte.mockResolvedValueOnce({
        data: mockData,
        error: null
      });

      const result = await repository.findByDateRange(startDate, endDate);

      expect(result.isSuccess()).toBe(true);
      const investments = result.getValue();
      expect(investments.length).toBe(1);
      expect(investments[0].getProps().symbol).toBe('AAPL');
    });

    it('should return empty array when no investments found in date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      mockSupabase.from().select().gte().lte.mockResolvedValueOnce({
        data: [],
        error: null
      });

      const result = await repository.findByDateRange(startDate, endDate);

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toHaveLength(0);
    });
  });

  describe('findBySymbol', () => {
    it('should find investments by symbol', async () => {
      const symbol = 'AAPL';
      const mockData = [{
        id: new UniqueEntityID().toString(),
        portfolio_id: new UniqueEntityID().toString(),
        type: InvestmentType.STOCK,
        symbol: 'AAPL',
        quantity: 10,
        price: 150,
        currency: 'USD',
        date: new Date().toISOString(),
        notes: 'Test investment'
      }];

      mockSupabase.from().select().eq.mockResolvedValueOnce({
        data: mockData,
        error: null
      });

      const result = await repository.findBySymbol(symbol);

      expect(result.isSuccess()).toBe(true);
      const investments = result.getValue();
      expect(investments.length).toBe(1);
      expect(investments[0].getProps().symbol).toBe('AAPL');
    });

    it('should return empty array when no investments found for symbol', async () => {
      const symbol = 'INVALID';
      mockSupabase.from().select().eq.mockResolvedValueOnce({
        data: [],
        error: null
      });

      const result = await repository.findBySymbol(symbol);

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toHaveLength(0);
    });
  });
}); 
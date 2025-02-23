import { PortfolioValuationService } from '../PortfolioValuation';
import { Money } from '../../value-objects/Money';

describe('PortfolioValuationService', () => {
  describe('calculateAssetValue', () => {
    it('should calculate single asset value correctly', () => {
      const asset = {
        symbol: 'AAPL',
        quantity: 10,
        currentPrice: Money.create(150.50, 'USD').getValue()
      };

      const result = PortfolioValuationService.calculateAssetValue(asset);
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toEqual({
        amount: 1505,
        currency: 'USD'
      });
    });
  });

  describe('calculateTotalValue', () => {
    it('should calculate total value for multiple assets', () => {
      const assets = [
        {
          symbol: 'AAPL',
          quantity: 10,
          currentPrice: Money.create(150, 'USD').getValue()
        },
        {
          symbol: 'GOOGL',
          quantity: 5,
          currentPrice: Money.create(200, 'USD').getValue()
        }
      ];

      const result = PortfolioValuationService.calculateTotalValue(assets);
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toEqual({
        amount: 2500, // (10 * 150) + (5 * 200)
        currency: 'USD'
      });
    });

    it('should return zero for empty portfolio', () => {
      const result = PortfolioValuationService.calculateTotalValue([]);
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toEqual({
        amount: 0,
        currency: 'USD'
      });
    });

    it('should fail for assets with different currencies', () => {
      const assets = [
        {
          symbol: 'AAPL',
          quantity: 10,
          currentPrice: Money.create(150, 'USD').getValue()
        },
        {
          symbol: 'SAP',
          quantity: 5,
          currentPrice: Money.create(200, 'EUR').getValue()
        }
      ];

      const result = PortfolioValuationService.calculateTotalValue(assets);
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Cannot calculate total value for assets with different currencies');
    });
  });

  describe('calculatePortfolioPerformance', () => {
    it('should calculate positive performance correctly', () => {
      const currentValue = Money.create(1500, 'USD').getValue();
      const initialValue = Money.create(1000, 'USD').getValue();

      const result = PortfolioValuationService.calculatePortfolioPerformance(
        currentValue,
        initialValue
      );

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBe(50); // 50% increase
    });

    it('should calculate negative performance correctly', () => {
      const currentValue = Money.create(800, 'USD').getValue();
      const initialValue = Money.create(1000, 'USD').getValue();

      const result = PortfolioValuationService.calculatePortfolioPerformance(
        currentValue,
        initialValue
      );

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBe(-20); // 20% decrease
    });

    it('should fail for different currencies', () => {
      const currentValue = Money.create(1500, 'USD').getValue();
      const initialValue = Money.create(1000, 'EUR').getValue();

      const result = PortfolioValuationService.calculatePortfolioPerformance(
        currentValue,
        initialValue
      );

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Cannot calculate performance for different currencies');
    });

    it('should fail for zero initial value', () => {
      const currentValue = Money.create(1500, 'USD').getValue();
      const initialValue = Money.create(0, 'USD').getValue();

      const result = PortfolioValuationService.calculatePortfolioPerformance(
        currentValue,
        initialValue
      );

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Initial value cannot be zero');
    });
  });
}); 
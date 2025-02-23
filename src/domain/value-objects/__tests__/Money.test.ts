import { Money } from '../Money';

describe('Money', () => {
  describe('create', () => {
    it('should create a valid money object', () => {
      const result = Money.create(100, 'USD');
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toEqual({
        amount: 100,
        currency: 'USD'
      });
    });

    it('should fail when amount is negative', () => {
      const result = Money.create(-100, 'USD');
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Amount cannot be negative');
    });

    it('should create money with zero amount', () => {
      const result = Money.create(0, 'USD');
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toEqual({
        amount: 0,
        currency: 'USD'
      });
    });
  });

  describe('add', () => {
    it('should add two money objects with same currency', () => {
      const money1 = Money.create(100, 'USD').getValue();
      const money2 = Money.create(200, 'USD').getValue();
      
      const result = money1.add(money2);
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toEqual({
        amount: 300,
        currency: 'USD'
      });
    });

    it('should fail when adding different currencies', () => {
      const money1 = Money.create(100, 'USD').getValue();
      const money2 = Money.create(200, 'EUR').getValue();
      
      const result = money1.add(money2);
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Cannot add money with different currencies');
    });

    it('should handle adding zero amounts', () => {
      const money1 = Money.create(100, 'USD').getValue();
      const money2 = Money.create(0, 'USD').getValue();
      
      const result = money1.add(money2);
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toEqual({
        amount: 100,
        currency: 'USD'
      });
    });

    it('should handle decimal amounts', () => {
      const money1 = Money.create(100.50, 'USD').getValue();
      const money2 = Money.create(200.75, 'USD').getValue();
      
      const result = money1.add(money2);
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toEqual({
        amount: 301.25,
        currency: 'USD'
      });
    });
  });

  describe('getValue', () => {
    it('should return the money object properties', () => {
      const money = Money.create(100, 'USD').getValue();
      expect(money.getValue()).toEqual({
        amount: 100,
        currency: 'USD'
      });
    });
  });
}); 
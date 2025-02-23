import { Portfolio } from '../Portfolio';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Money } from '../../value-objects/Money';

describe('Portfolio', () => {
  const userId = new UniqueEntityID();
  const validPortfolioProps = {
    userId,
    assets: []
  };

  describe('create', () => {
    it('should create a valid portfolio', () => {
      const result = Portfolio.create(validPortfolioProps);
      expect(result.isSuccess()).toBe(true);
      const portfolio = result.getValue();
      expect(portfolio.userId).toBe(userId);
      expect(portfolio.assets).toEqual([]);
    });

    it('should fail when userId is missing', () => {
      const result = Portfolio.create({ ...validPortfolioProps, userId: undefined as any });
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('User ID is required');
    });

    it('should initialize empty assets array when not provided', () => {
      const result = Portfolio.create({ userId, assets: undefined as any });
      expect(result.isSuccess()).toBe(true);
      const portfolio = result.getValue();
      expect(portfolio.assets).toEqual([]);
    });
  });

  describe('asset management', () => {
    const validAsset = {
      symbol: 'AAPL',
      quantity: 10,
      purchasePrice: Money.create(150, 'USD').getValue(),
      currentPrice: Money.create(160, 'USD').getValue()
    };

    it('should add a valid asset', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      const result = portfolio.addAsset(validAsset);
      expect(result.isSuccess()).toBe(true);
      expect(portfolio.assets.length).toBe(1);
      expect(portfolio.assets[0].symbol).toBe('AAPL');
    });

    it('should fail to add asset with zero quantity', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      const result = portfolio.addAsset({ ...validAsset, quantity: 0 });
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Asset quantity must be positive');
    });

    it('should fail to add asset with negative quantity', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      const result = portfolio.addAsset({ ...validAsset, quantity: -1 });
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Asset quantity must be positive');
    });

    it('should remove an existing asset', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      portfolio.addAsset(validAsset);
      const assetId = portfolio.assets[0].id;
      const result = portfolio.removeAsset(assetId);
      expect(result.isSuccess()).toBe(true);
      expect(portfolio.assets.length).toBe(0);
    });

    it('should fail to remove non-existent asset', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      const result = portfolio.removeAsset(new UniqueEntityID());
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Asset not found');
    });

    it('should update asset quantity', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      portfolio.addAsset(validAsset);
      const assetId = portfolio.assets[0].id;
      const result = portfolio.updateAssetQuantity(assetId, 20);
      expect(result.isSuccess()).toBe(true);
      expect(portfolio.assets[0].quantity).toBe(20);
    });

    it('should fail to update quantity to zero', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      portfolio.addAsset(validAsset);
      const assetId = portfolio.assets[0].id;
      const result = portfolio.updateAssetQuantity(assetId, 0);
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Asset quantity must be positive');
    });

    it('should update asset current price', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      portfolio.addAsset(validAsset);
      const assetId = portfolio.assets[0].id;
      const newPrice = Money.create(170, 'USD').getValue();
      const result = portfolio.updateAssetCurrentPrice(assetId, newPrice);
      expect(result.isSuccess()).toBe(true);
      expect(portfolio.assets[0].currentPrice).toBe(newPrice);
    });

    it('should fail to update price with different currency', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      portfolio.addAsset(validAsset);
      const assetId = portfolio.assets[0].id;
      const newPrice = Money.create(170, 'EUR').getValue();
      const result = portfolio.updateAssetCurrentPrice(assetId, newPrice);
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Current price currency must match purchase price currency');
    });

    it('should get an existing asset', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      portfolio.addAsset(validAsset);
      const assetId = portfolio.assets[0].id;
      const result = portfolio.getAsset(assetId);
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().symbol).toBe('AAPL');
    });

    it('should fail to get non-existent asset', () => {
      const portfolio = Portfolio.create(validPortfolioProps).getValue();
      const result = portfolio.getAsset(new UniqueEntityID());
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Asset not found');
    });
  });
}); 
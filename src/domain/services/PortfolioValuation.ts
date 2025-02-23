import { Money } from '../value-objects/Money';
import { Result } from '../../core/logic/Result';

interface Asset {
  symbol: string;
  quantity: number;
  currentPrice: Money;
}

export class PortfolioValuationService {
  public static calculateAssetValue(asset: Asset): Result<Money, string> {
    const value = asset.currentPrice.getValue().amount * asset.quantity;
    return Money.create(value, asset.currentPrice.getValue().currency);
  }

  public static calculateTotalValue(assets: Asset[]): Result<Money, string> {
    if (assets.length === 0) {
      return Money.create(0, 'USD'); // Default to USD for empty portfolios
    }

    const firstAsset = assets[0];
    let totalValue = Money.create(0, firstAsset.currentPrice.getValue().currency);

    for (const asset of assets) {
      // Check if currencies match
      if (asset.currentPrice.getValue().currency !== firstAsset.currentPrice.getValue().currency) {
        return Result.fail('Cannot calculate total value for assets with different currencies');
      }

      const assetValueResult = this.calculateAssetValue(asset);
      if (assetValueResult.isFailure()) {
        return Result.fail(assetValueResult.getError());
      }

      const currentTotal = totalValue.getValue();
      totalValue = currentTotal.add(assetValueResult.getValue());
      
      if (totalValue.isFailure()) {
        return Result.fail(totalValue.getError());
      }
    }

    return totalValue;
  }

  public static calculatePortfolioPerformance(
    currentValue: Money,
    initialValue: Money
  ): Result<number, string> {
    if (currentValue.getValue().currency !== initialValue.getValue().currency) {
      return Result.fail('Cannot calculate performance for different currencies');
    }

    if (initialValue.getValue().amount === 0) {
      return Result.fail('Initial value cannot be zero');
    }

    const performance = 
      ((currentValue.getValue().amount - initialValue.getValue().amount) / 
      initialValue.getValue().amount) * 100;

    return Result.ok(performance);
  }
} 
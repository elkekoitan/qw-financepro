import { AggregateRoot } from '@/core/domain/AggregateRoot';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { Result } from '@/core/logic/Result';
import { Money } from '@/domain/value-objects/Money';
import { User } from './User';

interface Asset {
  id: UniqueEntityID;
  symbol: string;
  quantity: number;
  purchasePrice: Money;
  currentPrice: Money;
}

interface PortfolioProps {
  userId: UniqueEntityID;
  assets: Asset[];
  totalValue?: Money;
}

export class Portfolio extends AggregateRoot<PortfolioProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(props: PortfolioProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: PortfolioProps, id?: UniqueEntityID): Result<Portfolio> {
    if (!props.userId) {
      return Result.fail<Portfolio>('User ID is required');
    }

    if (!props.assets) {
      props.assets = [];
    }

    return Result.ok<Portfolio>(new Portfolio(props, id));
  }

  public getProps(): PortfolioProps {
    return this.props;
  }

  public addAsset(asset: Omit<Asset, 'id'>): Result<void> {
    const newAsset: Asset = {
      ...asset,
      id: new UniqueEntityID()
    };

    if (asset.quantity <= 0) {
      return Result.fail<void>('Asset quantity must be positive');
    }

    if (asset.purchasePrice.getValue().amount <= 0) {
      return Result.fail<void>('Purchase price must be positive');
    }

    this.props.assets.push(newAsset);
    return Result.ok<void>(undefined);
  }

  public removeAsset(assetId: UniqueEntityID): Result<void> {
    const index = this.props.assets.findIndex(a => a.id.toString() === assetId.toString());
    if (index === -1) {
      return Result.fail<void>('Asset not found');
    }

    this.props.assets.splice(index, 1);
    return Result.ok<void>(undefined);
  }

  public updateAssetQuantity(assetId: UniqueEntityID, quantity: number): Result<void> {
    if (quantity <= 0) {
      return Result.fail<void>('Asset quantity must be positive');
    }

    const asset = this.props.assets.find(a => a.id.toString() === assetId.toString());
    if (!asset) {
      return Result.fail<void>('Asset not found');
    }

    asset.quantity = quantity;
    return Result.ok<void>(undefined);
  }

  public updateAssetCurrentPrice(assetId: UniqueEntityID, currentPrice: Money): Result<void> {
    const asset = this.props.assets.find(a => a.id.toString() === assetId.toString());
    if (!asset) {
      return Result.fail<void>('Asset not found');
    }

    if (currentPrice.getValue().currency !== asset.purchasePrice.getValue().currency) {
      return Result.fail<void>('Current price currency must match purchase price currency');
    }

    asset.currentPrice = currentPrice;
    return Result.ok<void>(undefined);
  }

  public getAsset(assetId: UniqueEntityID): Result<Asset> {
    const asset = this.props.assets.find(a => a.id.toString() === assetId.toString());
    if (!asset) {
      return Result.fail<Asset>('Asset not found');
    }

    return Result.ok<Asset>(asset);
  }

  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get assets(): Asset[] {
    return this.props.assets;
  }
} 
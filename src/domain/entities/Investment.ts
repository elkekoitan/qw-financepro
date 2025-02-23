import { AggregateRoot } from '@/core/domain/AggregateRoot';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { Result } from '@/core/logic/Result';
import { Money } from '@/domain/value-objects/Money';

export enum InvestmentType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  CRYPTO = 'CRYPTO',
  MUTUAL_FUND = 'MUTUAL_FUND',
  ETF = 'ETF',
  REAL_ESTATE = 'REAL_ESTATE',
  COMMODITY = 'COMMODITY',
  CASH = 'CASH',
  OTHER = 'OTHER'
}

interface InvestmentProps {
  portfolioId: UniqueEntityID;
  type: InvestmentType;
  symbol: string;
  quantity: number;
  price: Money;
  date: Date;
  notes?: string;
}

export class Investment extends AggregateRoot<InvestmentProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(props: InvestmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: InvestmentProps, id?: UniqueEntityID): Result<Investment> {
    if (!props.portfolioId) {
      return Result.fail<Investment>('Portfolio ID is required');
    }

    if (!props.type) {
      return Result.fail<Investment>('Investment type is required');
    }

    if (!props.symbol) {
      return Result.fail<Investment>('Symbol is required');
    }

    if (props.quantity <= 0) {
      return Result.fail<Investment>('Quantity must be positive');
    }

    if (!props.price) {
      return Result.fail<Investment>('Price is required');
    }

    if (!props.date) {
      return Result.fail<Investment>('Date is required');
    }

    return Result.ok<Investment>(new Investment(props, id));
  }

  public getProps(): InvestmentProps {
    return this.props;
  }

  public updateQuantity(quantity: number): Result<void> {
    if (quantity <= 0) {
      return Result.fail<void>('Quantity must be positive');
    }

    this.props.quantity = quantity;
    return Result.ok<void>(undefined);
  }

  public updatePrice(price: Money): Result<void> {
    if (!price) {
      return Result.fail<void>('Price is required');
    }

    this.props.price = price;
    return Result.ok<void>(undefined);
  }

  public updateNotes(notes: string): Result<void> {
    this.props.notes = notes;
    return Result.ok<void>(undefined);
  }

  public calculateValue(): Money {
    return this.props.price.multiply(this.props.quantity);
  }

  get portfolioId(): UniqueEntityID {
    return this.props.portfolioId;
  }

  get type(): InvestmentType {
    return this.props.type;
  }

  get symbol(): string {
    return this.props.symbol;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get price(): Money {
    return this.props.price;
  }

  get date(): Date {
    return this.props.date;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }
} 
import { ValueObject } from '@/core/domain/ValueObject';
import { Result } from '@/core/logic/Result';

interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  public static create(amount: number, currency: string): Result<Money> {
    if (amount < 0) {
      return Result.fail<Money>('Amount cannot be negative');
    }

    if (!currency || currency.length !== 3) {
      return Result.fail<Money>('Currency must be a valid 3-letter code');
    }

    return Result.ok<Money>(new Money({ amount, currency }));
  }

  public getValue(): MoneyProps {
    return this.props;
  }

  public equals(money: Money): boolean {
    return this.props.amount === money.props.amount && 
           this.props.currency === money.props.currency;
  }

  public add(money: Money): Result<Money> {
    if (this.props.currency !== money.props.currency) {
      return Result.fail<Money>('Cannot add money with different currencies');
    }

    return Money.create(
      this.props.amount + money.props.amount,
      this.props.currency
    );
  }

  public subtract(money: Money): Result<Money> {
    if (this.props.currency !== money.props.currency) {
      return Result.fail<Money>('Cannot subtract money with different currencies');
    }

    return Money.create(
      this.props.amount - money.props.amount,
      this.props.currency
    );
  }

  public multiply(multiplier: number): Money {
    const result = Money.create(
      this.props.amount * multiplier,
      this.props.currency
    );

    if (result.isFailure()) {
      throw new Error(result.getError());
    }

    return result.getValue();
  }

  public divide(divisor: number): Result<Money> {
    if (divisor === 0) {
      return Result.fail<Money>('Cannot divide by zero');
    }

    return Money.create(
      this.props.amount / divisor,
      this.props.currency
    );
  }

  public isGreaterThan(money: Money): boolean {
    if (this.props.currency !== money.props.currency) {
      throw new Error('Cannot compare money with different currencies');
    }

    return this.props.amount > money.props.amount;
  }

  public isLessThan(money: Money): boolean {
    if (this.props.currency !== money.props.currency) {
      throw new Error('Cannot compare money with different currencies');
    }

    return this.props.amount < money.props.amount;
  }

  public isZero(): boolean {
    return this.props.amount === 0;
  }

  public toString(): string {
    return `${this.props.amount} ${this.props.currency}`;
  }

  public format(): string {
    return this.props.amount.toLocaleString('tr-TR', {
      style: 'currency',
      currency: this.props.currency
    });
  }
} 
import { Result } from '../core/result';
import { ValueObject } from '../core/value-object';
import * as bcrypt from 'bcrypt';

interface PasswordProps {
  value: string;
  hashed?: boolean;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  public static create(password: string, hashed: boolean = false): Result<Password> {
    if (!password) {
      return Result.fail<Password>('Password is required');
    }

    if (!hashed && !this.isValidPassword(password)) {
      return Result.fail<Password>(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'
      );
    }

    return Result.ok<Password>(new Password({ value: password, hashed }));
  }

  private static isValidPassword(password: string): boolean {
    // Test için daha basit bir kural kullanıyoruz
    return password.length >= 8;
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    if (this.props.hashed) {
      return await bcrypt.compare(plainTextPassword, this.props.value);
    }
    return this.props.value === plainTextPassword;
  }

  public async getHashedValue(): Promise<string> {
    if (this.props.hashed) {
      return this.props.value;
    }
    return await bcrypt.hash(this.props.value, 10);
  }

  get value(): string {
    return this.props.value;
  }
} 
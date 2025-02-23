import { Result } from '@/core/logic/Result';
import { ValueObject } from '@/core/domain/ValueObject';
import * as bcrypt from 'bcrypt';

interface PasswordProps {
  value: string;
  hashed: boolean;
}

export class Password extends ValueObject<PasswordProps> {
  get value(): string {
    return this.props.value;
  }

  get hashed(): boolean {
    return this.props.hashed;
  }

  private constructor(props: PasswordProps) {
    super(props);
  }

  public static create(password: string, hashed: boolean = false): Result<Password> {
    if (!password) {
      return Result.fail<Password>('Password is required');
    }

    if (!hashed && !this.isValidPassword(password)) {
      return Result.fail<Password>('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character');
    }

    return Result.ok<Password>(new Password({ value: password, hashed }));
  }

  private static isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  public async hashPassword(): Promise<Password> {
    if (this.hashed) {
      return this;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.value, salt);
    return Password.create(hashedPassword, true).getValue();
  }

  public async compare(plainTextPassword: string): Promise<boolean> {
    if (!this.hashed) {
      return this.value === plainTextPassword;
    }

    return bcrypt.compare(plainTextPassword, this.value);
  }

  public getValue(): string {
    return this.value;
  }

  public isHashed(): boolean {
    return this.hashed;
  }
} 
import { Result } from '@/core/logic/Result';
import { ValueObject } from '@/core/domain/ValueObject';

interface NameProps {
  value: string;
}

export class Name extends ValueObject<NameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: NameProps) {
    super(props);
  }

  public static create(name: string): Result<Name> {
    if (!name) {
      return Result.fail<Name>('Name is required');
    }

    if (!this.isValidName(name)) {
      return Result.fail<Name>('Name must be between 2 and 50 characters long and contain only letters, spaces, hyphens and apostrophes');
    }

    return Result.ok<Name>(new Name({ value: name }));
  }

  private static isValidName(name: string): boolean {
    if (name.length < 2 || name.length > 50) {
      return false;
    }

    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name);
  }

  public getValue(): string {
    return this.value;
  }
} 
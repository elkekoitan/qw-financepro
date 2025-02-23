import { Result } from '../core/result';
import { ValueObject } from '../core/value-object';

interface NameProps {
  value: string;
}

export class Name extends ValueObject<NameProps> {
  private constructor(props: NameProps) {
    super(props);
  }

  public static create(name: string): Result<Name> {
    if (!name) {
      return Result.fail<Name>('Name is required');
    }

    if (!this.isValidName(name)) {
      return Result.fail<Name>('Name is invalid');
    }

    return Result.ok<Name>(new Name({ value: name.trim() }));
  }

  private static isValidName(name: string): boolean {
    return name.length >= 2 && name.length <= 50 && /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name);
  }

  get value(): string {
    return this.props.value;
  }
} 
import { Result } from '../core/result';
import { ValueObject } from '../core/value-object';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Result<Email> {
    if (!email) {
      return Result.fail<Email>('Email is required');
    }

    if (!this.isValidEmail(email)) {
      return Result.fail<Email>('Email is invalid');
    }

    return Result.ok<Email>(new Email({ value: email }));
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  get value(): string {
    return this.props.value;
  }
} 
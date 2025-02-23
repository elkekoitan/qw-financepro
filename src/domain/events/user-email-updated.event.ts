import { IDomainEvent } from '../core/domain-event.interface';
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.value-object';

export class UserEmailUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly user: User,
    public readonly oldEmail: Email,
    public readonly newEmail: Email
  ) {
    this.dateTimeOccurred = new Date();
  }
} 
import { IDomainEvent } from '../core/domain-event.interface';
import { User } from '../entities/user.entity';

export class UserCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly user: User) {
    this.dateTimeOccurred = new Date();
  }
} 
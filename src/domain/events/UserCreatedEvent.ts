import { User } from '../entities/User';
import { IDomainEvent } from '../../core/domain/events/IDomainEvent';

export class UserCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly user: User) {
    this.dateTimeOccurred = new Date();
  }
} 
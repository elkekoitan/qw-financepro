import { UniqueEntityID } from './unique-entity-id';
import { IDomainEvent } from './domain-event.interface';
import { Entity } from './entity';

export abstract class AggregateRoot extends Entity {
  private domainEvents: IDomainEvent[] = [];

  protected constructor(id?: UniqueEntityID) {
    super(id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  public addDomainEvent(event: IDomainEvent): void {
    this.domainEvents.push(event);
  }

  public clearEvents(): void {
    this.domainEvents = [];
  }

  public getDomainEvents(): IDomainEvent[] {
    return this.domainEvents;
  }
} 
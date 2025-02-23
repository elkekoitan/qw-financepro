import { v4 as uuid } from 'uuid';

export class UniqueEntityID {
  private readonly id: string;

  constructor(id?: string) {
    this.id = id ? id : uuid();
  }

  public toString(): string {
    return this.id;
  }
} 
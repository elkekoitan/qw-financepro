import { UniqueEntityID } from './unique-entity-id';

const isEntity = (v: any): v is Entity => {
  return v instanceof Entity;
};

export abstract class Entity {
  protected readonly _id: UniqueEntityID;

  protected constructor(id?: UniqueEntityID) {
    this._id = id || new UniqueEntityID();
  }

  public equals(object?: Entity): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
} 
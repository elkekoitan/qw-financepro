import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { Result } from '../../../core/logic/Result';

export interface IUserRepository {
  exists(email: Email): Promise<boolean>;
  save(user: User): Promise<Result<void, string>>;
  findByEmail(email: Email): Promise<Result<User, string>>;
  findById(id: UniqueEntityID): Promise<Result<User, string>>;
  update(user: User): Promise<Result<void, string>>;
  delete(id: UniqueEntityID): Promise<Result<void, string>>;
  findAll(): Promise<Result<User[], string>>;
} 
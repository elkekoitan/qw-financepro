import { Result } from '@/core/logic/Result';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';

export interface IAuthService {
  signUp(email: Email, password: Password, name: Name): Promise<Result<void>>;
  signIn(email: Email, password: Password): Promise<Result<void>>;
  signOut(): Promise<Result<void>>;
  resetPassword(email: Email): Promise<Result<void>>;
  updatePassword(password: Password): Promise<Result<void>>;
  getCurrentUser(): Promise<Result<{ id: string; email: string }>>;
} 
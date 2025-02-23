import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IUserRepository } from '@/application/interfaces/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { Result } from '@/core/logic/Result';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';
import { UserStatus } from '@/domain/enums/UserStatus';

export class SupabaseUserRepository implements IUserRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async exists(email: Email): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email.getValue())
        .single();

      if (error) {
        console.error('Error checking user existence:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  async findByEmail(email: Email): Promise<Result<User>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email.getValue())
        .single();

      if (error) {
        return Result.fail<User>('User not found');
      }

      return this.mapToUser(data);
    } catch (error) {
      console.error('Error finding user by email:', error);
      return Result.fail<User>('Error finding user');
    }
  }

  async findById(id: UniqueEntityID): Promise<Result<User>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id.toString())
        .single();

      if (error) {
        return Result.fail<User>('User not found');
      }

      return this.mapToUser(data);
    } catch (error) {
      console.error('Error finding user by id:', error);
      return Result.fail<User>('Error finding user');
    }
  }

  async findAll(): Promise<Result<User[]>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*');

      if (error) {
        return Result.fail<User[]>('Failed to fetch users');
      }

      const users: User[] = [];
      for (const userData of data) {
        const userResult = await this.mapToUser(userData);
        if (userResult.isSuccess()) {
          users.push(userResult.getValue());
        }
      }

      return Result.ok<User[]>(users);
    } catch (error) {
      console.error('Error fetching all users:', error);
      return Result.fail<User[]>('Error fetching users');
    }
  }

  async save(user: User): Promise<Result<void>> {
    try {
      const props = user.getProps();
      
      const { error } = await this.supabase
        .from('users')
        .insert({
          id: user.id.toString(),
          email: props.email.getValue(),
          password: props.password.getValue(),
          name: props.name.getValue(),
          status: props.status,
          created_at: props.createdAt,
          updated_at: props.updatedAt
        });

      if (error) {
        console.error('Error saving user:', error);
        return Result.fail<void>('Failed to save user');
      }

      return Result.ok<void>(undefined);
    } catch (error) {
      console.error('Error saving user:', error);
      return Result.fail<void>('Error saving user');
    }
  }

  async update(user: User): Promise<Result<void>> {
    try {
      const props = user.getProps();
      
      const { error } = await this.supabase
        .from('users')
        .update({
          email: props.email.getValue(),
          password: props.password.getValue(),
          name: props.name.getValue(),
          status: props.status,
          updated_at: props.updatedAt
        })
        .eq('id', user.id.toString());

      if (error) {
        console.error('Error updating user:', error);
        return Result.fail<void>('Failed to update user');
      }

      return Result.ok<void>(undefined);
    } catch (error) {
      console.error('Error updating user:', error);
      return Result.fail<void>('Error updating user');
    }
  }

  async delete(id: UniqueEntityID): Promise<Result<void>> {
    try {
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id', id.toString());

      if (error) {
        console.error('Error deleting user:', error);
        return Result.fail<void>('Failed to delete user');
      }

      return Result.ok<void>(undefined);
    } catch (error) {
      console.error('Error deleting user:', error);
      return Result.fail<void>('Error deleting user');
    }
  }

  private async mapToUser(data: any): Promise<Result<User>> {
    try {
      const emailOrError = Email.create(data.email);
      const passwordOrError = Password.create(data.password, true);
      const nameOrError = Name.create(data.name);

      const combinedPropsResult = Result.combine([
        emailOrError,
        passwordOrError,
        nameOrError
      ]);

      if (combinedPropsResult.isFailure()) {
        return Result.fail<User>('Invalid user data: ' + combinedPropsResult.getError());
      }

      const userOrError = User.create({
        email: emailOrError.getValue(),
        password: passwordOrError.getValue(),
        name: nameOrError.getValue(),
        status: data.status as UserStatus
      }, new UniqueEntityID(data.id));

      if (userOrError.isFailure()) {
        return Result.fail<User>(userOrError.getError());
      }

      return Result.ok<User>(userOrError.getValue());
    } catch (error) {
      console.error('Error mapping user data:', error);
      return Result.fail<User>('Error mapping user data');
    }
  }
} 
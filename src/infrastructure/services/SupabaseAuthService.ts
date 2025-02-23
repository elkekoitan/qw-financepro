import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IAuthService } from '@/application/interfaces/services/IAuthService';
import { Result } from '@/core/logic/Result';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';

export class SupabaseAuthService implements IAuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async signUp(email: Email, password: Password, name: Name): Promise<Result<void>> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: email.getValue(),
        password: password.getValue(),
        options: {
          data: {
            name: name.getValue()
          }
        }
      });

      if (error) {
        console.error('Error signing up:', error);
        return Result.fail<void>(error.message);
      }

      if (!data.user) {
        return Result.fail<void>('Failed to create user');
      }

      return Result.ok<void>(undefined);
    } catch (error: any) {
      console.error('Error signing up:', error);
      return Result.fail<void>(error.message || 'An unexpected error occurred');
    }
  }

  async signIn(email: Email, password: Password): Promise<Result<void>> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email.getValue(),
        password: password.getValue()
      });

      if (error) {
        console.error('Error signing in:', error);
        return Result.fail<void>(error.message);
      }

      if (!data.user) {
        return Result.fail<void>('Invalid credentials');
      }

      return Result.ok<void>(undefined);
    } catch (error: any) {
      console.error('Error signing in:', error);
      return Result.fail<void>(error.message || 'An unexpected error occurred');
    }
  }

  async signOut(): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        return Result.fail<void>(error.message);
      }

      return Result.ok<void>(undefined);
    } catch (error: any) {
      console.error('Error signing out:', error);
      return Result.fail<void>(error.message || 'An unexpected error occurred');
    }
  }

  async resetPassword(email: Email): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        email.getValue(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`
        }
      );

      if (error) {
        console.error('Error resetting password:', error);
        return Result.fail<void>(error.message);
      }

      return Result.ok<void>(undefined);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return Result.fail<void>(error.message || 'An unexpected error occurred');
    }
  }

  async updatePassword(password: Password): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: password.getValue()
      });

      if (error) {
        console.error('Error updating password:', error);
        return Result.fail<void>(error.message);
      }

      return Result.ok<void>(undefined);
    } catch (error: any) {
      console.error('Error updating password:', error);
      return Result.fail<void>(error.message || 'An unexpected error occurred');
    }
  }

  async getCurrentUser(): Promise<Result<{ id: string; email: string }>> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();

      if (error) {
        console.error('Error getting current user:', error);
        return Result.fail<{ id: string; email: string }>(error.message);
      }

      if (!user) {
        return Result.fail<{ id: string; email: string }>('No user is currently signed in');
      }

      if (!user.email) {
        return Result.fail<{ id: string; email: string }>('User email is missing');
      }

      return Result.ok<{ id: string; email: string }>({
        id: user.id,
        email: user.email
      });
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return Result.fail<{ id: string; email: string }>(error.message || 'An unexpected error occurred');
    }
  }

  async refreshSession(): Promise<Result<void>> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession();

      if (error) {
        console.error('Error refreshing session:', error);
        return Result.fail<void>(error.message);
      }

      if (!data.session) {
        return Result.fail<void>('No active session to refresh');
      }

      return Result.ok<void>(undefined);
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      return Result.fail<void>(error.message || 'An unexpected error occurred');
    }
  }

  async signInWithGoogle(): Promise<Result<void>> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        return Result.fail<void>(error.message);
      }

      return Result.ok<void>(undefined);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      return Result.fail<void>(error.message || 'An unexpected error occurred');
    }
  }
} 
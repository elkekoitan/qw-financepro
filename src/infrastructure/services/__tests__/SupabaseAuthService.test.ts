import { SupabaseAuthService } from '../SupabaseAuthService';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      getUser: jest.fn(),
      refreshSession: jest.fn(),
      signInWithOAuth: jest.fn()
    }
  }))
}));

describe('SupabaseAuthService', () => {
  let service: SupabaseAuthService;
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SupabaseAuthService();
    mockSupabase = (createClient as jest.Mock).mock.results[0].value;
  });

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const email = Email.create('test@example.com').getValue();
      const password = Password.create('Test1234!').getValue();
      const name = Name.create('John Doe').getValue();

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null
      });

      const result = await service.signUp(email, password, name);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: email.getValue(),
        password: password.getValue(),
        options: {
          data: {
            name: name.getValue()
          }
        }
      });
    });

    it('should fail when signup fails', async () => {
      const email = Email.create('test@example.com').getValue();
      const password = Password.create('Test1234!').getValue();
      const name = Name.create('John Doe').getValue();

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Email already exists' }
      });

      const result = await service.signUp(email, password, name);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Email already exists');
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const email = Email.create('test@example.com').getValue();
      const password = Password.create('Test1234!').getValue();

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null
      });

      const result = await service.signIn(email, password);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: email.getValue(),
        password: password.getValue()
      });
    });

    it('should fail when signin fails', async () => {
      const email = Email.create('test@example.com').getValue();
      const password = Password.create('Test1234!').getValue();

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid credentials' }
      });

      const result = await service.signIn(email, password);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: null
      });

      const result = await service.signOut();

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should fail when signout fails', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: { message: 'Session not found' }
      });

      const result = await service.signOut();

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Session not found');
    });
  });

  describe('resetPassword', () => {
    it('should send reset password email successfully', async () => {
      const email = Email.create('test@example.com').getValue();

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
        error: null
      });

      const result = await service.resetPassword(email);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        email.getValue(),
        {
          redirectTo: expect.stringContaining('/auth/reset-password')
        }
      );
    });

    it('should fail when reset password fails', async () => {
      const email = Email.create('test@example.com').getValue();

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
        error: { message: 'User not found' }
      });

      const result = await service.resetPassword(email);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('User not found');
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const password = Password.create('NewTest1234!').getValue();

      mockSupabase.auth.updateUser.mockResolvedValueOnce({
        data: { user: { id: '123' } },
        error: null
      });

      const result = await service.updatePassword(password);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: password.getValue()
      });
    });

    it('should fail when update password fails', async () => {
      const password = Password.create('NewTest1234!').getValue();

      mockSupabase.auth.updateUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid password format' }
      });

      const result = await service.updatePassword(password);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Invalid password format');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: {
          user: {
            id: '123',
            email: 'test@example.com'
          }
        },
        error: null
      });

      const result = await service.getCurrentUser();

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toEqual({
        id: '123',
        email: 'test@example.com'
      });
    });

    it('should fail when no user is signed in', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'No user found' }
      });

      const result = await service.getCurrentUser();

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('No user found');
    });

    it('should fail when user email is missing', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: {
          user: {
            id: '123',
            email: null
          }
        },
        error: null
      });

      const result = await service.getCurrentUser();

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('User email is missing');
    });
  });

  describe('refreshSession', () => {
    it('should refresh session successfully', async () => {
      mockSupabase.auth.refreshSession.mockResolvedValueOnce({
        data: {
          session: {
            access_token: 'new_token'
          }
        },
        error: null
      });

      const result = await service.refreshSession();

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.auth.refreshSession).toHaveBeenCalled();
    });

    it('should fail when refresh session fails', async () => {
      mockSupabase.auth.refreshSession.mockResolvedValueOnce({
        data: { session: null },
        error: { message: 'Session expired' }
      });

      const result = await service.refreshSession();

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Session expired');
    });
  });

  describe('signInWithGoogle', () => {
    it('should initiate Google sign in successfully', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
        error: null
      });

      const result = await service.signInWithGoogle();

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback')
        }
      });
    });

    it('should fail when Google sign in fails', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
        error: { message: 'Google auth failed' }
      });

      const result = await service.signInWithGoogle();

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Google auth failed');
    });
  });
}); 
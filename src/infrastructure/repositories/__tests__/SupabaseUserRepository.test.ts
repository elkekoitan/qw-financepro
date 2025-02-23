import { SupabaseUserRepository } from '../SupabaseUserRepository';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';
import { UserStatus } from '@/domain/enums/UserStatus';
import { User } from '@/domain/entities/User';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        })),
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }))
}));

describe('SupabaseUserRepository', () => {
  let repository: SupabaseUserRepository;
  let mockSupabase: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create new repository instance
    repository = new SupabaseUserRepository();
    mockSupabase = (createClient as jest.Mock).mock.results[0].value;
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: { id: '123' },
        error: null
      });

      // Act
      const result = await repository.exists(email);

      // Assert
      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('users');
      expect(mockSupabase.from().select).toHaveBeenCalledWith('id');
      expect(mockSupabase.from().select().eq).toHaveBeenCalledWith('email', email.getValue());
    });

    it('should return false when user does not exist', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      // Act
      const result = await repository.exists(email);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when error occurs', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });

      // Act
      const result = await repository.exists(email);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      const userData = {
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        status: UserStatus.Active
      };
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: userData,
        error: null
      });

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(result.isSuccess()).toBe(true);
      const user = result.getValue();
      expect(user.getProps().email.getValue()).toBe(userData.email);
      expect(user.getProps().name.getValue()).toBe(userData.name);
      expect(user.getProps().status).toBe(userData.status);
    });

    it('should return failure when user not found', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' }
      });

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('User not found');
    });
  });

  describe('save', () => {
    it('should save user successfully', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      const password = Password.create('Test1234!', true).getValue();
      const name = Name.create('Test User').getValue();
      const userOrError = User.create({
        email,
        password,
        name,
        status: UserStatus.Active
      });
      const user = userOrError.getValue();

      mockSupabase.from().insert.mockResolvedValueOnce({
        error: null
      });

      // Act
      const result = await repository.save(user);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        id: user.id.toString(),
        email: email.getValue(),
        password: password.getValue(),
        name: name.getValue(),
        status: UserStatus.Active,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should return failure when save fails', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      const password = Password.create('Test1234!', true).getValue();
      const name = Name.create('Test User').getValue();
      const userOrError = User.create({
        email,
        password,
        name,
        status: UserStatus.Active
      });
      const user = userOrError.getValue();

      mockSupabase.from().insert.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      // Act
      const result = await repository.save(user);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to save user');
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      const password = Password.create('Test1234!', true).getValue();
      const name = Name.create('Test User').getValue();
      const userOrError = User.create({
        email,
        password,
        name,
        status: UserStatus.Active
      });
      const user = userOrError.getValue();

      mockSupabase.from().update().eq.mockResolvedValueOnce({
        error: null
      });

      // Act
      const result = await repository.update(user);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.from().update).toHaveBeenCalledWith({
        email: email.getValue(),
        password: password.getValue(),
        name: name.getValue(),
        status: UserStatus.Active,
        updated_at: expect.any(Date)
      });
      expect(mockSupabase.from().update().eq).toHaveBeenCalledWith('id', user.id.toString());
    });

    it('should return failure when update fails', async () => {
      // Arrange
      const email = Email.create('test@example.com').getValue();
      const password = Password.create('Test1234!', true).getValue();
      const name = Name.create('Test User').getValue();
      const userOrError = User.create({
        email,
        password,
        name,
        status: UserStatus.Active
      });
      const user = userOrError.getValue();

      mockSupabase.from().update().eq.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      // Act
      const result = await repository.update(user);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to update user');
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const id = new UniqueEntityID();
      mockSupabase.from().delete().eq.mockResolvedValueOnce({
        error: null
      });

      // Act
      const result = await repository.delete(id);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.from().delete().eq).toHaveBeenCalledWith('id', id.toString());
    });

    it('should return failure when delete fails', async () => {
      // Arrange
      const id = new UniqueEntityID();
      mockSupabase.from().delete().eq.mockResolvedValueOnce({
        error: { message: 'Database error' }
      });

      // Act
      const result = await repository.delete(id);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to delete user');
    });
  });
}); 
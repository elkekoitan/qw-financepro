import { UpdateUserUseCase } from '../UpdateUserUseCase';
import { IUserRepository } from '@/application/interfaces/repositories/IUserRepository';
import { IEmailService } from '@/application/interfaces/services/IEmailService';
import { Result } from '@/core/logic/Result';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';
import { UserStatus } from '@/domain/enums/UserStatus';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';

describe('UpdateUserUseCase', () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockEmailService: jest.Mocked<IEmailService>;
  let updateUserUseCase: UpdateUserUseCase;
  let existingUser: User;

  beforeEach(() => {
    mockUserRepository = {
      exists: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    mockEmailService = {
      sendEmail: jest.fn(),
      sendVerificationEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      sendWelcomeEmail: jest.fn(),
      sendPortfolioSummary: jest.fn(),
      sendInvestmentConfirmation: jest.fn(),
      sendMarketAlert: jest.fn(),
      sendPerformanceReport: jest.fn(),
    };

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository, mockEmailService);

    // Create a mock existing user
    const emailOrError = Email.create('existing@example.com');
    const passwordOrError = Password.create('ExistingPass123!', true);
    const nameOrError = Name.create('Existing User');

    const userOrError = User.create({
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      name: nameOrError.getValue(),
      status: UserStatus.Active
    });

    existingUser = userOrError.getValue();
  });

  it('should update user successfully with all fields', async () => {
    // Arrange
    const userId = 'test-user-id';
    const request = {
      email: 'new@example.com',
      password: 'NewPass123!',
      name: 'New Name',
      status: UserStatus.Inactive
    };

    mockUserRepository.findById.mockResolvedValue(Result.ok<User>(existingUser));
    mockUserRepository.exists.mockResolvedValue(false);
    mockUserRepository.update.mockResolvedValue(Result.ok<void>(undefined));
    mockEmailService.sendEmail.mockResolvedValue(Result.ok<void>(undefined));

    // Act
    const result = await updateUserUseCase.execute(userId, request);

    // Assert
    expect(result.isSuccess()).toBeTruthy();
    expect(mockUserRepository.findById).toHaveBeenCalledWith(new UniqueEntityID(userId));
    expect(mockUserRepository.exists).toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(mockEmailService.sendEmail).toHaveBeenCalled();
  });

  it('should fail if user is not found', async () => {
    // Arrange
    const userId = 'non-existent-id';
    const request = {
      name: 'New Name'
    };

    mockUserRepository.findById.mockResolvedValue(Result.fail<User>('User not found'));

    // Act
    const result = await updateUserUseCase.execute(userId, request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toBe('User not found');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should fail if new email is already in use', async () => {
    // Arrange
    const userId = 'test-user-id';
    const request = {
      email: 'existing@example.com'
    };

    mockUserRepository.findById.mockResolvedValue(Result.ok<User>(existingUser));
    mockUserRepository.exists.mockResolvedValue(true);

    // Act
    const result = await updateUserUseCase.execute(userId, request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toBe('Email is already in use');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should fail if new password is invalid', async () => {
    // Arrange
    const userId = 'test-user-id';
    const request = {
      password: 'weak'
    };

    mockUserRepository.findById.mockResolvedValue(Result.ok<User>(existingUser));

    // Act
    const result = await updateUserUseCase.execute(userId, request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toContain('Password must be');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should fail if new name is invalid', async () => {
    // Arrange
    const userId = 'test-user-id';
    const request = {
      name: 'A'
    };

    mockUserRepository.findById.mockResolvedValue(Result.ok<User>(existingUser));

    // Act
    const result = await updateUserUseCase.execute(userId, request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toContain('Name must be');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should succeed even if email notification fails', async () => {
    // Arrange
    const userId = 'test-user-id';
    const request = {
      email: 'new@example.com'
    };

    mockUserRepository.findById.mockResolvedValue(Result.ok<User>(existingUser));
    mockUserRepository.exists.mockResolvedValue(false);
    mockUserRepository.update.mockResolvedValue(Result.ok<void>(undefined));
    mockEmailService.sendEmail.mockResolvedValue(Result.fail<void>('Failed to send email'));

    // Act
    const result = await updateUserUseCase.execute(userId, request);

    // Assert
    expect(result.isSuccess()).toBeTruthy();
    expect(mockUserRepository.update).toHaveBeenCalled();
  });
}); 
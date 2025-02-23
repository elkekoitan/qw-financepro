import { CreateUserUseCase } from '../CreateUserUseCase';
import { IUserRepository } from '@/application/interfaces/repositories/IUserRepository';
import { IEmailService } from '@/application/interfaces/services/IEmailService';
import { Result } from '@/core/logic/Result';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';
import { UserStatus } from '@/domain/enums/UserStatus';

describe('CreateUserUseCase', () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockEmailService: jest.Mocked<IEmailService>;
  let createUserUseCase: CreateUserUseCase;

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

    createUserUseCase = new CreateUserUseCase(mockUserRepository, mockEmailService);
  });

  it('should create a user successfully', async () => {
    // Arrange
    const request = {
      email: 'test@example.com',
      password: 'Test1234!',
      name: 'John Doe',
      status: UserStatus.Active
    };

    mockUserRepository.exists.mockResolvedValue(false);
    mockUserRepository.save.mockResolvedValue(Result.ok<void>(undefined));
    mockEmailService.sendWelcomeEmail.mockResolvedValue(Result.ok<void>(undefined));

    // Act
    const result = await createUserUseCase.execute(request);

    // Assert
    expect(result.isSuccess()).toBeTruthy();
    expect(mockUserRepository.exists).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'John Doe');
  });

  it('should fail if user already exists', async () => {
    // Arrange
    const request = {
      email: 'test@example.com',
      password: 'Test1234!',
      name: 'John Doe',
      status: UserStatus.Active
    };

    mockUserRepository.exists.mockResolvedValue(true);

    // Act
    const result = await createUserUseCase.execute(request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toBe('User already exists');
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it('should fail if email is invalid', async () => {
    // Arrange
    const request = {
      email: 'invalid-email',
      password: 'Test1234!',
      name: 'John Doe',
      status: UserStatus.Active
    };

    // Act
    const result = await createUserUseCase.execute(request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toBe('Invalid email format');
    expect(mockUserRepository.exists).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it('should fail if password is invalid', async () => {
    // Arrange
    const request = {
      email: 'test@example.com',
      password: 'weak',
      name: 'John Doe',
      status: UserStatus.Active
    };

    // Act
    const result = await createUserUseCase.execute(request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toBe('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character');
    expect(mockUserRepository.exists).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it('should fail if name is invalid', async () => {
    // Arrange
    const request = {
      email: 'test@example.com',
      password: 'Test1234!',
      name: 'J',
      status: UserStatus.Active
    };

    // Act
    const result = await createUserUseCase.execute(request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toBe('Name must be between 2 and 50 characters long and contain only letters, spaces, hyphens and apostrophes');
    expect(mockUserRepository.exists).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it('should fail if saving user fails', async () => {
    // Arrange
    const request = {
      email: 'test@example.com',
      password: 'Test1234!',
      name: 'John Doe',
      status: UserStatus.Active
    };

    mockUserRepository.exists.mockResolvedValue(false);
    mockUserRepository.save.mockResolvedValue(Result.fail<void>('Failed to save user'));

    // Act
    const result = await createUserUseCase.execute(request);

    // Assert
    expect(result.isFailure()).toBeTruthy();
    expect(result.getError()).toBe('Failed to save user');
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });
}); 
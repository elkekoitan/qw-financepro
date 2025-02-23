import { Result } from '@/core/logic/Result';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';
import { UserStatus } from '@/domain/enums/UserStatus';
import { IUserRepository } from '@/application/interfaces/repositories/IUserRepository';
import { IEmailService } from '@/application/interfaces/services/IEmailService';
import { CreateUserDTO } from '@/application/dtos/user/CreateUserDTO';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  public async execute(request: CreateUserDTO): Promise<Result<void>> {
    try {
      // Create value objects
      const emailOrError = Email.create(request.email);
      const passwordOrError = Password.create(request.password);
      const nameOrError = Name.create(request.name);

      // Check if all value objects are valid
      const combinedPropsResult = Result.combine([
        emailOrError,
        passwordOrError,
        nameOrError
      ]);

      if (combinedPropsResult.isFailure()) {
        return Result.fail<void>(combinedPropsResult.getError());
      }

      const email = emailOrError.getValue();
      const password = passwordOrError.getValue();
      const name = nameOrError.getValue();

      // Check if user already exists
      const userExists = await this.userRepository.exists(email);
      if (userExists) {
        return Result.fail<void>('User already exists');
      }

      // Hash password
      const hashedPassword = await password.hashPassword();

      // Create user
      const userOrError = User.create({
        email,
        password: hashedPassword,
        name,
        status: request.status || UserStatus.Active
      });

      if (userOrError.isFailure()) {
        return Result.fail<void>(userOrError.getError());
      }

      const user = userOrError.getValue();

      // Save user
      const saveResult = await this.userRepository.save(user);
      if (saveResult.isFailure()) {
        return Result.fail<void>(saveResult.getError());
      }

      // Send welcome email
      await this.emailService.sendWelcomeEmail(email.getValue(), name.getValue());

      return Result.ok<void>(undefined);
    } catch (error) {
      return Result.fail<void>('An unexpected error occurred while creating the user');
    }
  }
} 
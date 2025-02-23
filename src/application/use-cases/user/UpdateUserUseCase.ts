import { Result } from '@/core/logic/Result';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';
import { Name } from '@/domain/value-objects/Name';
import { UserStatus } from '@/domain/enums/UserStatus';
import { IUserRepository } from '@/application/interfaces/repositories/IUserRepository';
import { IEmailService } from '@/application/interfaces/services/IEmailService';
import { UpdateUserDTO } from '@/application/dtos/user/UpdateUserDTO';
import { UniqueEntityID } from '@/core/domain/UniqueEntityID';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  public async execute(userId: string, request: UpdateUserDTO): Promise<Result<void>> {
    try {
      // Find existing user
      const userResult = await this.userRepository.findById(new UniqueEntityID(userId));
      if (userResult.isFailure()) {
        return Result.fail<void>('User not found');
      }

      const user = userResult.getValue();

      // Handle email update
      if (request.email) {
        const emailOrError = Email.create(request.email);
        if (emailOrError.isFailure()) {
          return Result.fail<void>(emailOrError.getError());
        }

        // Check if new email is already in use by another user
        const emailExists = await this.userRepository.exists(emailOrError.getValue());
        if (emailExists) {
          return Result.fail<void>('Email is already in use');
        }

        user.updateEmail(emailOrError.getValue());
      }

      // Handle password update
      if (request.password) {
        const passwordOrError = Password.create(request.password);
        if (passwordOrError.isFailure()) {
          return Result.fail<void>(passwordOrError.getError());
        }

        const hashedPassword = await passwordOrError.getValue().hashPassword();
        user.updatePassword(hashedPassword);
      }

      // Handle name update
      if (request.name) {
        const nameOrError = Name.create(request.name);
        if (nameOrError.isFailure()) {
          return Result.fail<void>(nameOrError.getError());
        }

        user.updateName(nameOrError.getValue());
      }

      // Handle status update
      if (request.status) {
        user.updateStatus(request.status);
      }

      // Update user
      const updateResult = await this.userRepository.update(user);
      if (updateResult.isFailure()) {
        return Result.fail<void>(updateResult.getError());
      }

      // If email was updated, send confirmation email
      if (request.email) {
        const emailResult = await this.emailService.sendEmail({
          to: request.email,
          subject: 'Email Update Confirmation',
          text: 'Your email has been successfully updated.'
        });

        if (emailResult.isFailure()) {
          // Log the error but don't fail the update
          console.error('Failed to send email update confirmation:', emailResult.getError());
        }
      }

      return Result.ok<void>(undefined);
    } catch (error) {
      return Result.fail<void>('An unexpected error occurred while updating the user');
    }
  }
}
import { User } from '../User';
import { Email } from '../../value-objects/Email';
import { Password } from '../../value-objects/Password';
import { Name } from '../../value-objects/Name';
import { UserStatus } from '../../enums/UserStatus';

describe('User', () => {
  it('should create a valid user', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test1234!');
    const nameOrError = Name.create('John Doe');

    expect(emailOrError.isSuccess()).toBeTruthy();
    expect(passwordOrError.isSuccess()).toBeTruthy();
    expect(nameOrError.isSuccess()).toBeTruthy();

    const email = emailOrError.getValue();
    const password = passwordOrError.getValue();
    const name = nameOrError.getValue();

    const userOrError = User.create({
      email,
      password,
      name,
      status: UserStatus.Active
    });

    expect(userOrError.isSuccess()).toBeTruthy();
    const user = userOrError.getValue();
    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
    expect(user.status).toBe(UserStatus.Active);
  });

  it('should fail when email is invalid', () => {
    const emailOrError = Email.create('invalid-email');
    const passwordOrError = Password.create('Test1234!');
    const nameOrError = Name.create('John Doe');

    expect(emailOrError.isFailure()).toBeTruthy();
    expect(emailOrError.getError()).toBe('Invalid email format');
  });

  it('should fail when password is invalid', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('weak');
    const nameOrError = Name.create('John Doe');

    expect(passwordOrError.isFailure()).toBeTruthy();
    expect(passwordOrError.getError()).toBe('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character');
  });

  it('should fail when name is invalid', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test1234!');
    const nameOrError = Name.create('J');

    expect(nameOrError.isFailure()).toBeTruthy();
    expect(nameOrError.getError()).toBe('Name must be between 2 and 50 characters long and contain only letters, spaces, hyphens and apostrophes');
  });

  it('should validate password correctly', async () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test1234!');
    const nameOrError = Name.create('John Doe');

    expect(emailOrError.isSuccess()).toBeTruthy();
    expect(passwordOrError.isSuccess()).toBeTruthy();
    expect(nameOrError.isSuccess()).toBeTruthy();

    const email = emailOrError.getValue();
    const password = passwordOrError.getValue();
    const name = nameOrError.getValue();

    const userOrError = User.create({
      email,
      password,
      name,
      status: UserStatus.Active
    });

    expect(userOrError.isSuccess()).toBeTruthy();
    const user = userOrError.getValue();
    
    const isValidPassword = await user.validatePassword('Test1234!');
    expect(isValidPassword).toBeTruthy();

    const isInvalidPassword = await user.validatePassword('WrongPassword123!');
    expect(isInvalidPassword).toBeFalsy();
  });

  it('should update status correctly', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test1234!');
    const nameOrError = Name.create('John Doe');

    const email = emailOrError.getValue();
    const password = passwordOrError.getValue();
    const name = nameOrError.getValue();

    const userOrError = User.create({
      email,
      password,
      name,
      status: UserStatus.Active
    });

    const user = userOrError.getValue();
    user.updateStatus(UserStatus.Inactive);
    expect(user.status).toBe(UserStatus.Inactive);
  });
}); 
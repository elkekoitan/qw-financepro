import { User } from '../user.entity';
import { Email } from '../../value-objects/email.value-object';
import { Password } from '../../value-objects/password.value-object';
import { Name } from '../../value-objects/name.value-object';
import { UserStatus } from '../../enums/user-status.enum';

describe('User Entity', () => {
  it('should create a valid user', async () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test123!@#');
    const nameOrError = Name.create('John Doe');

    expect(emailOrError.isSuccess).toBe(true);
    expect(passwordOrError.isSuccess).toBe(true);
    expect(nameOrError.isSuccess).toBe(true);

    const userOrError = User.create({
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      name: nameOrError.getValue(),
      status: UserStatus.ACTIVE
    });

    expect(userOrError.isSuccess).toBe(true);
    const user = userOrError.getValue();
    expect(user.email.value).toBe('test@example.com');
    expect(user.name.value).toBe('John Doe');
    expect(user.status).toBe(UserStatus.ACTIVE);
  });

  it('should validate password correctly', async () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test123!@#');
    const nameOrError = Name.create('John Doe');
    const userOrError = User.create({
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      name: nameOrError.getValue(),
      status: UserStatus.ACTIVE
    });

    const user = userOrError.getValue();
    const isValid = await user.validatePassword('Test123!@#');
    expect(isValid).toBe(true);
  });

  it('should fail when creating user with invalid email', () => {
    const emailOrError = Email.create('invalid-email');
    const passwordOrError = Password.create('Test123!@#');
    const nameOrError = Name.create('John Doe');

    expect(emailOrError.isSuccess).toBe(false);
    expect(passwordOrError.isSuccess).toBe(true);
    expect(nameOrError.isSuccess).toBe(true);

    if (emailOrError.isSuccess) {
      const userOrError = User.create({
        email: emailOrError.getValue(),
        password: passwordOrError.getValue(),
        name: nameOrError.getValue(),
        status: UserStatus.ACTIVE
      });
      expect(userOrError.isSuccess).toBe(false);
    }
  });

  it('should fail when creating user with invalid password', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('weak');
    const nameOrError = Name.create('John Doe');

    expect(emailOrError.isSuccess).toBe(true);
    expect(passwordOrError.isSuccess).toBe(false);
    expect(nameOrError.isSuccess).toBe(true);

    if (passwordOrError.isSuccess) {
      const userOrError = User.create({
        email: emailOrError.getValue(),
        password: passwordOrError.getValue(),
        name: nameOrError.getValue(),
        status: UserStatus.ACTIVE
      });
      expect(userOrError.isSuccess).toBe(false);
    }
  });

  it('should fail when creating user with invalid name', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test123!@#');
    const nameOrError = Name.create('');

    expect(emailOrError.isSuccess).toBe(true);
    expect(passwordOrError.isSuccess).toBe(true);
    expect(nameOrError.isSuccess).toBe(false);

    if (nameOrError.isSuccess) {
      const userOrError = User.create({
        email: emailOrError.getValue(),
        password: passwordOrError.getValue(),
        name: nameOrError.getValue(),
        status: UserStatus.ACTIVE
      });
      expect(userOrError.isSuccess).toBe(false);
    }
  });

  it('should update email successfully', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test123!@#');
    const nameOrError = Name.create('John Doe');
    const userOrError = User.create({
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      name: nameOrError.getValue(),
      status: UserStatus.ACTIVE
    });

    const user = userOrError.getValue();
    const newEmailOrError = Email.create('new@example.com');
    const result = user.updateEmail(newEmailOrError.getValue());

    expect(result.isSuccess).toBe(true);
    expect(user.email.value).toBe('new@example.com');
  });

  it('should deactivate user successfully', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test123!@#');
    const nameOrError = Name.create('John Doe');
    const userOrError = User.create({
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      name: nameOrError.getValue(),
      status: UserStatus.ACTIVE
    });

    const user = userOrError.getValue();
    const result = user.deactivate();

    expect(result.isSuccess).toBe(true);
    expect(user.status).toBe(UserStatus.INACTIVE);
  });

  it('should fail when deactivating already inactive user', () => {
    const emailOrError = Email.create('test@example.com');
    const passwordOrError = Password.create('Test123!@#');
    const nameOrError = Name.create('John Doe');
    const userOrError = User.create({
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      name: nameOrError.getValue()
    });

    const user = userOrError.getValue();
    user.deactivate();
    const result = user.deactivate();

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe('User is already inactive');
  });
}); 
import { AggregateRoot } from '../core/aggregate-root';
import { UniqueEntityID } from '../core/unique-entity-id';
import { Result } from '../core/result';
import { Email } from '../value-objects/email.value-object';
import { Password } from '../value-objects/password.value-object';
import { Name } from '../value-objects/name.value-object';
import { UserStatus } from '../enums/user-status.enum';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserEmailUpdatedEvent } from '../events/user-email-updated.event';

interface UserProps {
  email: Email;
  password: Password;
  name: Name;
  status?: UserStatus;
}

export class User extends AggregateRoot {
  private constructor(
    id: UniqueEntityID,
    private props: UserProps
  ) {
    super(id);
    this.props.status = this.props.status || UserStatus.ACTIVE;
  }

  get email(): Email {
    return this.props.email;
  }

  get name(): Name {
    return this.props.name;
  }

  get status(): UserStatus {
    return this.props.status || UserStatus.ACTIVE;
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    if (!props.email || !props.password || !props.name) {
      return Result.fail('Email, password and name are required');
    }

    const user = new User(id || new UniqueEntityID(), {
      ...props,
      status: props.status || UserStatus.ACTIVE
    });
    user.addDomainEvent(new UserCreatedEvent(user));

    return Result.ok(user);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await this.props.password.comparePassword(password);
  }

  public updateEmail(email: Email): Result<void> {
    const oldEmail = this.props.email;
    this.props.email = email;
    this.addDomainEvent(new UserEmailUpdatedEvent(this, oldEmail, email));
    return Result.ok();
  }

  public updateName(name: Name): Result<void> {
    this.props.name = name;
    return Result.ok();
  }

  public deactivate(): Result<void> {
    if (this.props.status === UserStatus.INACTIVE) {
      return Result.fail('User is already inactive');
    }
    this.props.status = UserStatus.INACTIVE;
    return Result.ok();
  }

  public activate(): Result<void> {
    if (this.props.status === UserStatus.ACTIVE) {
      return Result.fail('User is already active');
    }
    this.props.status = UserStatus.ACTIVE;
    return Result.ok();
  }
} 
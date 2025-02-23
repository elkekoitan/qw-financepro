import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Result } from '../../core/logic/Result';
import { UserStatus } from '../enums/UserStatus';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';
import { Name } from '../value-objects/Name';

interface UserProps {
  email: Email;
  password: Password;
  name: Name;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: {
    email: Email;
    password: Password;
    name: Name;
    status?: UserStatus;
  }, id?: UniqueEntityID): Result<User> {
    if (!props.email || !props.password || !props.name) {
      return Result.fail<User>('Email, password and name are required');
    }

    const user = new User({
      ...props,
      status: props.status || UserStatus.Active,
      createdAt: new Date(),
      updatedAt: new Date()
    }, id);

    return Result.ok<User>(user);
  }

  public getProps(): UserProps {
    return this.props;
  }

  get email(): Email {
    return this.props.email;
  }

  get name(): Name {
    return this.props.name;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return this.props.password.compare(password);
  }

  public updateStatus(status: UserStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  public updateEmail(email: Email): void {
    this.props.email = email;
    this.props.updatedAt = new Date();
  }

  public updatePassword(password: Password): void {
    this.props.password = password;
    this.props.updatedAt = new Date();
  }

  public updateName(name: Name): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }
} 
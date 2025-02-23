import { UserStatus } from '../../../domain/enums/UserStatus';

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  status?: UserStatus;
} 
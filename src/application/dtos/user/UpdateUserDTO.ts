import { UserStatus } from '../../../domain/enums/UserStatus';

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  status?: UserStatus;
} 
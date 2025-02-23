import { UserStatus } from '../../../domain/enums/UserStatus';

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
} 
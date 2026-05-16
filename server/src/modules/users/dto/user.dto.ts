import { UserRole } from '../../../common/enums/user-role.enum';

export class UserDto {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  lastLoginAt?: Date;
}

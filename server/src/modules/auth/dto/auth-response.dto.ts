import { UserRole } from '../../../common/enums/user-role.enum';

export class AuthUserDto {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  avatarUrl?: string;
}

export class AuthResponseDto {
  user: AuthUserDto;
  message: string;
}

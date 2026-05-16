import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { AuthResponseDto, AuthUserDto } from '../dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AuthResponseDto> {
    const authUser: AuthUserDto = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    return {
      user: authUser,
      message: 'User authenticated successfully',
    };
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyToken(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ valid: boolean; userId: string }> {
    return {
      valid: true,
      userId: user.id,
    };
  }
}

import { Module, Global } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { SupabaseService } from './services/supabase.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Global()
@Module({
  controllers: [AuthController],
  providers: [SupabaseService, JwtAuthGuard, RolesGuard],
  exports: [SupabaseService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    const supabaseAnonKey =
      this.configService.get<string>('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAdminClient(): SupabaseClient {
    return this.supabaseAdmin;
  }

  async verifyToken(token: string): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !user) {
      return null;
    }

    return user;
  }

  async updateUserMetadata(
    userId: string,
    metadata: Record<string, any>,
  ): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: metadata,
    });

    if (error || !user) {
      return null;
    }

    return user;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserOrmEntity } from '../entities/user.orm.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { UserRole } from '../../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOrCreateUser(userData: {
    id: string;
    email: string;
    fullName?: string;
    role?: UserRole;
  }): Promise<UserOrmEntity> {
    let user = await this.userRepository.findById(userData.id);

    if (!user) {
      user = await this.userRepository.create(userData);
    }

    await this.userRepository.updateLastLogin(userData.id);
    return user;
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToDto(user);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? this.mapToDto(user) : null;
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.userRepository.update(id, {
      fullName: updateData.fullName,
      avatarUrl: updateData.avatarUrl,
      phone: updateData.phone,
      dateOfBirth: updateData.dateOfBirth
        ? new Date(updateData.dateOfBirth)
        : undefined,
    });

    return this.mapToDto(updatedUser!);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    role?: UserRole;
  }): Promise<{ users: UserDto[]; total: number; page: number; limit: number }> {
    const { users, total } = await this.userRepository.findAll(options);
    return {
      users: users.map((u) => this.mapToDto(u)),
      total,
      page: options?.page || 1,
      limit: options?.limit || 10,
    };
  }

  private mapToDto(user: UserOrmEntity): UserDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<UserOrmEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(userData: {
    id: string;
    email: string;
    fullName?: string;
    role?: UserRole;
  }): Promise<UserOrmEntity> {
    const user = this.repository.create({
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role || UserRole.USER,
    });
    return this.repository.save(user);
  }

  async update(
    id: string,
    updateData: Partial<UserOrmEntity>,
  ): Promise<UserOrmEntity | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repository.update(id, { lastLoginAt: new Date() });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    role?: UserRole;
  }): Promise<{ users: UserOrmEntity[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('user');

    if (options?.role) {
      queryBuilder.where('user.role = :role', { role: options.role });
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return { users, total };
  }
}

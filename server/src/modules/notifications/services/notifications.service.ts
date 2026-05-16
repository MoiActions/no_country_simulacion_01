import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotificationOrmEntity,
  NotificationType,
} from '../entities/notification.orm.entity';
import {
  NotificationDto,
  CreateNotificationDto,
  NotificationCountDto,
} from '../dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly notificationRepository: Repository<NotificationOrmEntity>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<NotificationDto> {
    const notification = this.notificationRepository.create({
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      metadata: dto.metadata,
      actionUrl: dto.actionUrl,
    });

    const saved = await this.notificationRepository.save(notification);
    return this.mapToDto(saved);
  }

  async getUserNotifications(
    userId: string,
    options?: { page?: number; limit?: number; unreadOnly?: boolean },
  ): Promise<{ notifications: NotificationDto[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId });

    if (options?.unreadOnly) {
      queryBuilder.andWhere('notification.read = :read', { read: false });
    }

    const [notifications, total] = await queryBuilder
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      notifications: notifications.map((n) => this.mapToDto(n)),
      total,
    };
  }

  async getUnreadCount(userId: string): Promise<NotificationCountDto> {
    const total = await this.notificationRepository.count({
      where: { userId },
    });

    const unread = await this.notificationRepository.count({
      where: { userId, read: false },
    });

    return { total, unread };
  }

  async markAsRead(userId: string, notificationId: string): Promise<NotificationDto> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    notification.readAt = new Date();

    const saved = await this.notificationRepository.save(notification);
    return this.mapToDto(saved);
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await this.notificationRepository.update(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );

    return { count: result.affected || 0 };
  }

  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepository.delete({ id: notificationId, userId });
  }

  async notifyProfileViewed(userId: string, viewerName: string): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.PROFILE_VIEWED,
      title: 'Tu perfil fue visto',
      message: `${viewerName} ha visto tu perfil profesional`,
      actionUrl: '/profile',
    });
  }

  async notifyApplicationStatusChanged(
    userId: string,
    jobTitle: string,
    newStatus: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.APPLICATION_STATUS_CHANGED,
      title: 'Estado de postulación actualizado',
      message: `Tu postulación a "${jobTitle}" cambió a: ${newStatus}`,
      metadata: { jobTitle, status: newStatus },
      actionUrl: '/applications',
    });
  }

  async notifyFeedbackReceived(
    userId: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.FEEDBACK_RECEIVED,
      title: 'Nuevo feedback recibido',
      message: `${companyName} te ha enviado feedback sobre tu postulación a "${jobTitle}"`,
      metadata: { jobTitle, companyName },
      actionUrl: '/applications',
    });
  }

  async notifySkillValidated(
    userId: string,
    skillName: string,
    moduleName: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.SKILL_VALIDATED,
      title: 'Nueva habilidad validada',
      message: `Has obtenido la habilidad "${skillName}" al completar el módulo "${moduleName}"`,
      metadata: { skillName, moduleName },
      actionUrl: '/learning/skills',
    });
  }

  async notifyModuleCompleted(userId: string, moduleName: string): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.MODULE_COMPLETED,
      title: 'Módulo completado',
      message: `Has completado el módulo "${moduleName}"`,
      metadata: { moduleName },
      actionUrl: '/learning/progress',
    });
  }

  async notifyShortlisted(
    userId: string,
    companyName: string,
  ): Promise<void> {
    await this.create({
      userId,
      type: NotificationType.SHORTLISTED,
      title: 'Has sido preseleccionado',
      message: `${companyName} te ha agregado a su lista de candidatos preseleccionados`,
      metadata: { companyName },
      actionUrl: '/profile',
    });
  }

  private mapToDto(notification: NotificationOrmEntity): NotificationDto {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      metadata: notification.metadata,
      actionUrl: notification.actionUrl,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    };
  }
}

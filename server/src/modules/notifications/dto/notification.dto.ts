import { NotificationType } from '../entities/notification.orm.entity';

export class NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, any>;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export class CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  actionUrl?: string;
}

export class NotificationCountDto {
  total: number;
  unread: number;
}

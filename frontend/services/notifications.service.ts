import { api } from "@/lib/api";
import type { Notification } from "@/types";

export const notificationsService = {
  getAll: () => api.get<Notification[]>("/notifications"),

  getUnreadCount: () =>
    api.get<{ count: number }>("/notifications/unread-count"),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`, {}),

  markAllAsRead: () => api.patch("/notifications/read-all", {}),
};

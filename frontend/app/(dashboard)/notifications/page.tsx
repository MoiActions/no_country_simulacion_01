"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  CheckCheck,
  GraduationCap,
  Briefcase,
  Award,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: "1",
    type: "learning",
    title: "Nuevo curso disponible",
    message: 'El curso "AWS Advanced" ya está disponible para ti.',
    isRead: false,
    createdAt: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    type: "job",
    title: "Nueva oferta de empleo",
    message:
      "TechCorp ha publicado una oferta que coincide con tu perfil: Senior Frontend Developer.",
    isRead: false,
    createdAt: "2024-01-15T09:15:00",
  },
  {
    id: "3",
    type: "achievement",
    title: "¡Nueva insignia desbloqueada!",
    message: 'Has obtenido la insignia "Quick Learner" por completar 5 cursos.',
    isRead: true,
    createdAt: "2024-01-14T16:45:00",
  },
  {
    id: "4",
    type: "message",
    title: "Mensaje de reclutador",
    message:
      "María García de CloudSolutions te ha enviado un mensaje sobre una oportunidad.",
    isRead: true,
    createdAt: "2024-01-14T14:20:00",
  },
  {
    id: "5",
    type: "system",
    title: "Completa tu perfil",
    message:
      "Añade tu experiencia laboral para aumentar tus posibilidades de ser contactado.",
    isRead: true,
    createdAt: "2024-01-13T11:00:00",
  },
];

const typeIcons = {
  learning: GraduationCap,
  job: Briefcase,
  achievement: Award,
  message: MessageSquare,
  system: AlertCircle,
};

const typeColors = {
  learning: "text-blue-500",
  job: "text-green-500",
  achievement: "text-yellow-500",
  message: "text-purple-500",
  system: "text-gray-500",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Hace unos minutos";
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return "Ayer";
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} nuevas</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifs.map((notification) => {
          const Icon = typeIcons[notification.type as keyof typeof typeIcons];
          const iconColor =
            typeColors[notification.type as keyof typeof typeColors];

          return (
            <Card
              key={notification.id}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                !notification.isRead && "bg-primary/5 border-primary/20"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted",
                      iconColor
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            !notification.isRead && "text-primary"
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {notifs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tienes notificaciones</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock, ChevronRight } from "lucide-react";

const badges = [
  {
    id: "1",
    name: "Frontend Expert",
    description: "Dominio avanzado de React y TypeScript",
    icon: "🚀",
    earnedAt: "2024-01-15",
    isLocked: false,
  },
  {
    id: "2",
    name: "UI/UX Designer",
    description: "Diseño de interfaces centradas en usuario",
    icon: "🎨",
    earnedAt: "2024-01-10",
    isLocked: false,
  },
  {
    id: "3",
    name: "Quick Learner",
    description: "Completaste 5 cursos en un mes",
    icon: "⚡",
    earnedAt: "2024-01-05",
    isLocked: false,
  },
  {
    id: "4",
    name: "Cloud Master",
    description: "Certificación en AWS o Azure",
    icon: "☁️",
    earnedAt: null,
    isLocked: true,
  },
  {
    id: "5",
    name: "Data Analyst",
    description: "Análisis de datos y visualización",
    icon: "📊",
    earnedAt: null,
    isLocked: true,
  },
  {
    id: "6",
    name: "Team Leader",
    description: "Liderazgo y gestión de equipos",
    icon: "👥",
    earnedAt: null,
    isLocked: true,
  },
];

export function BadgesGrid() {
  const unlockedBadges = badges.filter((b) => !b.isLocked);
  const lockedBadges = badges.filter((b) => b.isLocked);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Insignias Obtenidas
        </CardTitle>
        <Link
          href="/profile#achievements"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Ver todos los logros
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-start gap-3 rounded-lg border p-4 bg-gradient-to-br from-background to-muted/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{badge.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {new Date(badge.earnedAt!).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </Badge>
              </div>
            </div>
          ))}

          {lockedBadges.slice(0, 3).map((badge) => (
            <div
              key={badge.id}
              className="flex items-start gap-3 rounded-lg border border-dashed p-4 opacity-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl grayscale">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate text-muted-foreground">
                  {badge.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  Bloqueado
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

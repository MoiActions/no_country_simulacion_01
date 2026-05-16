"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ChevronRight } from "lucide-react";

interface AchievementsProps {
  achievements: Array<{
    id: string;
    name: string;
    icon: string;
    earnedAt: string;
  }>;
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <Card id="achievements">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Logros Recientes
        </CardTitle>
        <Link
          href="/achievements"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Ver galería de insignias
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{achievement.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(achievement.earnedAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

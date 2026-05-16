"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface XpCardProps {
  xp: {
    current: number;
    nextLevel: number;
    level: number;
    title: string;
  };
}

export function XpCard({ xp }: XpCardProps) {
  const progress = (xp.current / xp.nextLevel) * 100;
  const remaining = xp.nextLevel - xp.current;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Nivel de Usuario
          </span>
          <Zap className="h-5 w-5 text-yellow-500" />
        </div>
        <p className="text-lg font-bold">{xp.title}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold">{xp.current.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">XP Total</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Nivel {xp.level}</span>
            <span>Nivel {xp.level + 1}</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            {remaining.toLocaleString()} XP para el siguiente nivel
          </p>
        </div>

        <p className="text-sm text-center text-muted-foreground italic">
          «Cada día de aprendizaje te acerca más a tus metas profesionales»
        </p>
      </CardContent>
    </Card>
  );
}

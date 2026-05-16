"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface SkillLevelBarProps {
  className?: string;
  currentXP?: number;
  maxXP?: number;
  level?: number;
}

export function SkillLevelBar({
  className,
  currentXP = 2450,
  maxXP = 3000,
  level = 12,
}: SkillLevelBarProps) {
  const progress = (currentXP / maxXP) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium flex items-center gap-1">
          <Zap className="h-4 w-4 text-yellow-500" />
          Skill Level
        </span>
        <span className="text-muted-foreground">Nivel {level}</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-muted-foreground text-center">
        {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
      </p>
    </div>
  );
}

"use client";

import { Progress } from "@/components/ui/progress";

interface DiagnosisProgressBarProps {
  current: number;
  total: number;
}

export function DiagnosisProgressBar({
  current,
  total,
}: DiagnosisProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>
          Pregunta {current} de {total}
        </span>
        <span>{Math.round(progress)}% completado</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

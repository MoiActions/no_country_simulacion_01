"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface SkillsGridProps {
  skills: Array<{
    name: string;
    level: string;
    validated: boolean;
  }>;
}

const levelLabels: Record<string, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  expert: "Experto",
};

const levelColors: Record<string, string> = {
  basic: "bg-gray-100 text-gray-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-purple-100 text-purple-800",
  expert: "bg-green-100 text-green-800",
};

export function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Habilidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-2">
                {skill.validated && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                <span className="font-medium">{skill.name}</span>
              </div>
              <Badge className={levelColors[skill.level]} variant="secondary">
                {levelLabels[skill.level]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Award, Lock } from "lucide-react";

interface BadgePreviewProps {
  badgeName: string;
  description: string;
  isUnlocked?: boolean;
}

export function BadgePreview({
  badgeName,
  description,
  isUnlocked = false,
}: BadgePreviewProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isUnlocked ? "bg-yellow-100" : "bg-muted"
            }`}
          >
            {isUnlocked ? (
              <Award className="h-6 w-6 text-yellow-600" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{badgeName}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

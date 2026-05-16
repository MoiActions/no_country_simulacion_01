"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressSidebarProps {
  moduleTitle: string;
  contents: Array<{
    id: string;
    title: string;
    type: "video" | "exercise" | "quiz" | "reading";
    duration: number;
    completed: boolean;
    current?: boolean;
  }>;
  progress: {
    completed: number;
    total: number;
    xp: number;
    nextLevelXp: number;
  };
}

const typeIcons = {
  video: PlayCircle,
  exercise: FileText,
  quiz: HelpCircle,
  reading: FileText,
};

export function ProgressSidebar({
  moduleTitle,
  contents,
  progress,
}: ProgressSidebarProps) {
  const progressPercent = (progress.completed / progress.total) * 100;
  const xpPercent = (progress.xp / progress.nextLevelXp) * 100;

  return (
    <div className="w-full lg:w-80 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Tu Progreso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">XP del módulo</span>
              <span className="font-medium">
                {progress.xp} / {progress.nextLevelXp}
              </span>
            </div>
            <Progress value={xpPercent} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Lecciones</span>
              <span className="font-medium">
                {progress.completed} / {progress.total}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Contenido del módulo</CardTitle>
          <p className="text-xs text-muted-foreground">{moduleTitle}</p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-4 pt-0">
              {contents.map((content, index) => {
                const Icon = typeIcons[content.type];
                return (
                  <button
                    key={content.id}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left hover:bg-muted transition-colors",
                      content.current && "bg-muted"
                    )}
                  >
                    <div className="shrink-0 mt-0.5">
                      {content.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : content.current ? (
                        <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium line-clamp-2",
                          content.completed && "text-muted-foreground"
                        )}
                      >
                        {content.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {content.duration} min
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" asChild>
        <Link href="/learning">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al catálogo
        </Link>
      </Button>
    </div>
  );
}

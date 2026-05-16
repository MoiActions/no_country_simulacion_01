"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Clock, BookOpen } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    level: "beginner" | "intermediate" | "advanced";
    duration: number;
    modules: number;
    progress?: number;
    skills: string[];
    image?: string;
    isEnrolled?: boolean;
  };
  showMatch?: boolean;
}

const levelLabels = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const levelColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export function CourseCard({ course, showMatch }: CourseCardProps) {
  const matchPercent = showMatch ? Math.floor(Math.random() * 20) + 80 : null;

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="relative aspect-video bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <GraduationCap className="h-12 w-12 text-primary/40" />
        </div>
        <Badge
          className={`absolute top-2 left-2 ${levelColors[course.level]}`}
          variant="secondary"
        >
          {levelLabels[course.level]}
        </Badge>
        {matchPercent && (
          <Badge variant="success" className="absolute top-2 right-2">
            {matchPercent}% Match
          </Badge>
        )}
      </div>

      <CardContent className="flex-1 p-4 space-y-3">
        <div className="flex flex-wrap gap-1">
          {course.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div>
          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {course.description}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">{course.instructor}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(course.duration)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course.modules} módulos
          </span>
        </div>

        {course.isEnrolled && typeof course.progress === "number" && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1.5" />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant={course.isEnrolled && course.progress ? "default" : "outline"}>
          <Link href={`/learning/${course.id}`}>
            {course.isEnrolled && course.progress
              ? "Continuar"
              : course.isEnrolled
              ? "Ver curso"
              : "Comenzar"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

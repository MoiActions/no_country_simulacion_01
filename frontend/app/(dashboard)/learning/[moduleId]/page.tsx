"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LessonPlayer } from "@/components/learning/lesson-player";
import { ProgressSidebar } from "@/components/learning/progress-sidebar";
import {
  ArrowLeft,
  Clock,
  Star,
  CheckCircle2,
  MessageSquare,
  Share2,
  Download,
  FileText,
  Github,
  User,
} from "lucide-react";

const moduleData = {
  id: "1",
  title: "AWS Cloud Practitioner",
  currentLesson: {
    id: "lesson-3",
    title: "Introducción a EC2 - Instancias y Tipos",
    duration: 25,
    videoUrl: "https://example.com/video.mp4",
    description:
      "En esta lección aprenderás sobre Amazon EC2, el servicio de computación en la nube de AWS. Cubriremos los diferentes tipos de instancias, casos de uso y mejores prácticas.",
    notes: `
## Puntos Clave

- **EC2** (Elastic Compute Cloud) es el servicio de computación de AWS
- Los **tipos de instancia** determinan CPU, memoria y networking
- Las **familias de instancias**: General Purpose (t3, m5), Compute Optimized (c5), Memory Optimized (r5)

## Mejores Prácticas

1. Elegir el tipo de instancia según la carga de trabajo
2. Usar Auto Scaling para optimizar costos
3. Implementar grupos de seguridad correctamente
    `,
    resources: [
      { type: "pdf", title: "Guía de Tipos de Instancia", url: "#" },
      { type: "github", title: "Ejemplos de CloudFormation", url: "#" },
    ],
  },
  instructor: {
    name: "María García",
    title: "AWS Solutions Architect",
    avatar: "/images/instructors/maria.jpg",
  },
  contents: [
    {
      id: "1",
      title: "Fundamentos de Cloud Computing",
      type: "video" as const,
      duration: 20,
      completed: true,
    },
    {
      id: "2",
      title: "Introducción a AWS",
      type: "video" as const,
      duration: 15,
      completed: true,
    },
    {
      id: "3",
      title: "Introducción a EC2",
      type: "video" as const,
      duration: 25,
      completed: false,
      current: true,
    },
    {
      id: "4",
      title: "Práctica: Lanzar tu primera instancia",
      type: "exercise" as const,
      duration: 30,
      completed: false,
    },
    {
      id: "5",
      title: "S3 - Almacenamiento en la nube",
      type: "video" as const,
      duration: 20,
      completed: false,
    },
    {
      id: "6",
      title: "Quiz: EC2 y S3",
      type: "quiz" as const,
      duration: 15,
      completed: false,
    },
  ],
  progress: {
    completed: 2,
    total: 6,
    xp: 450,
    nextLevelXp: 600,
  },
};

export default function LessonPage({
  params,
}: {
  params: { moduleId: string };
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleMarkComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      <div className="flex-1 space-y-6 overflow-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/learning">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al catálogo
            </Link>
          </Button>
        </div>

        <LessonPlayer />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {moduleData.currentLesson.title}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {moduleData.currentLesson.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  4.8
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleMarkComplete}
                disabled={isCompleted}
                variant={isCompleted ? "secondary" : "default"}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isCompleted ? "Completada" : "Marcar completada"}
              </Button>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notas de la clase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p>{moduleData.currentLesson.description}</p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: moduleData.currentLesson.notes
                          .replace(/\n/g, "<br/>")
                          .replace(/##\s(.+)/g, "<h3>$1</h3>")
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recursos descargables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {moduleData.currentLesson.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.url}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                      >
                        {resource.type === "pdf" ? (
                          <FileText className="h-5 w-5 text-red-500" />
                        ) : (
                          <Github className="h-5 w-5" />
                        )}
                        <span className="flex-1 font-medium">
                          {resource.title}
                        </span>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {moduleData.instructor.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {moduleData.instructor.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ProgressSidebar
        moduleTitle={moduleData.title}
        contents={moduleData.contents}
        progress={moduleData.progress}
      />
    </div>
  );
}

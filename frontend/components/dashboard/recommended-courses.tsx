"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, BookOpen, ChevronRight } from "lucide-react";

const courses = [
  {
    id: "1",
    title: "AWS Cloud Practitioner",
    instructor: "María García",
    level: "Intermedio",
    duration: "8 horas",
    modules: 12,
    matchPercent: 95,
    image: "/images/courses/aws.jpg",
  },
  {
    id: "2",
    title: "Análisis de Datos con Python",
    instructor: "Carlos López",
    level: "Principiante",
    duration: "6 horas",
    modules: 8,
    matchPercent: 92,
    image: "/images/courses/python.jpg",
  },
  {
    id: "3",
    title: "Liderazgo y Gestión de Equipos",
    instructor: "Ana Martínez",
    level: "Avanzado",
    duration: "4 horas",
    modules: 6,
    matchPercent: 88,
    image: "/images/courses/leadership.jpg",
  },
];

export function RecommendedCourses() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Cursos para Cerrar Brechas
        </CardTitle>
        <Link
          href="/learning"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Ver catálogo completo
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video bg-muted">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <GraduationCap className="h-12 w-12 text-primary/40" />
                </div>
                <Badge
                  variant="success"
                  className="absolute top-2 right-2 gap-1"
                >
                  {course.matchPercent}% Match
                </Badge>
                <Badge variant="secondary" className="absolute top-2 left-2">
                  {course.level}
                </Badge>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.modules} módulos
                  </span>
                </div>

                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/learning/${course.id}`}>Ver Detalles</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

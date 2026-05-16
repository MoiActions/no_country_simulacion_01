"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseCard } from "@/components/learning/course-card";
import { Search, Filter } from "lucide-react";

const courses = [
  {
    id: "1",
    title: "AWS Cloud Practitioner",
    description:
      "Aprende los fundamentos de AWS y obtén tu primera certificación cloud.",
    instructor: "María García",
    level: "intermediate" as const,
    duration: 480,
    modules: 12,
    progress: 65,
    skills: ["AWS", "Cloud", "DevOps"],
    image: "/images/courses/aws.jpg",
    isEnrolled: true,
  },
  {
    id: "2",
    title: "Análisis de Datos con Python",
    description:
      "Domina pandas, numpy y matplotlib para análisis de datos profesional.",
    instructor: "Carlos López",
    level: "beginner" as const,
    duration: 360,
    modules: 8,
    progress: 30,
    skills: ["Python", "Data Analysis", "Pandas"],
    image: "/images/courses/python.jpg",
    isEnrolled: true,
  },
  {
    id: "3",
    title: "React Avanzado con TypeScript",
    description:
      "Patrones avanzados, testing y arquitectura de aplicaciones React.",
    instructor: "Juan Pérez",
    level: "advanced" as const,
    duration: 600,
    modules: 15,
    progress: 0,
    skills: ["React", "TypeScript", "Testing"],
    image: "/images/courses/react.jpg",
    isEnrolled: false,
  },
  {
    id: "4",
    title: "Liderazgo y Gestión de Equipos",
    description:
      "Desarrolla habilidades de liderazgo efectivo para equipos tech.",
    instructor: "Ana Martínez",
    level: "intermediate" as const,
    duration: 240,
    modules: 6,
    progress: 0,
    skills: ["Leadership", "Management", "Soft Skills"],
    image: "/images/courses/leadership.jpg",
    isEnrolled: false,
  },
  {
    id: "5",
    title: "Docker y Kubernetes",
    description: "Containerización y orquestación de aplicaciones modernas.",
    instructor: "Pedro Sánchez",
    level: "advanced" as const,
    duration: 540,
    modules: 10,
    progress: 0,
    skills: ["Docker", "Kubernetes", "DevOps"],
    image: "/images/courses/docker.jpg",
    isEnrolled: false,
  },
  {
    id: "6",
    title: "UX/UI Design Fundamentals",
    description:
      "Principios de diseño centrado en el usuario y prototipado.",
    instructor: "Laura González",
    level: "beginner" as const,
    duration: 300,
    modules: 7,
    progress: 0,
    skills: ["UX", "UI", "Figma"],
    image: "/images/courses/ux.jpg",
    isEnrolled: false,
  },
];

export default function LearningPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");

  const enrolledCourses = courses.filter((c) => c.isEnrolled);
  const inProgressCourses = enrolledCourses.filter((c) => c.progress > 0);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesLevel =
      levelFilter === "all" || course.level === levelFilter;

    const matchesDuration =
      durationFilter === "all" ||
      (durationFilter === "short" && course.duration <= 300) ||
      (durationFilter === "medium" &&
        course.duration > 300 &&
        course.duration <= 480) ||
      (durationFilter === "long" && course.duration > 480);

    return matchesSearch && matchesLevel && matchesDuration;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Catálogo de Aprendizaje
        </h1>
        <p className="text-muted-foreground">
          Explora cursos diseñados para impulsar tu carrera profesional
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">Todos los Cursos</TabsTrigger>
            <TabsTrigger value="enrolled">Mis Cursos</TabsTrigger>
            <TabsTrigger value="recommended">Recomendados</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="beginner">Principiante</SelectItem>
                <SelectItem value="intermediate">Intermedio</SelectItem>
                <SelectItem value="advanced">Avanzado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Duración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="short">{"< 5 horas"}</SelectItem>
                <SelectItem value="medium">5-8 horas</SelectItem>
                <SelectItem value="long">{"> 8 horas"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-6">
          {inProgressCourses.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Continuar Aprendiendo</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {inProgressCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {inProgressCourses.length > 0
                ? "Recomendados para ti"
                : "Todos los cursos"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses
                .filter((c) => !c.isEnrolled || c.progress === 0)
                .map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="enrolled">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {enrolledCourses.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No estás inscrito en ningún curso todavía.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommended">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} showMatch />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

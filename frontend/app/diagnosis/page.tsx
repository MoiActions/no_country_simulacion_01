"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Clock, Target, ArrowRight } from "lucide-react";

const tests = [
  {
    id: "skills-digital",
    name: "Habilidades Digitales",
    description:
      "Evalúa tus competencias en herramientas digitales, programación y tecnologías modernas.",
    category: "Técnico",
    questions: 15,
    duration: 20,
    icon: "💻",
  },
  {
    id: "soft-skills",
    name: "Habilidades Blandas",
    description:
      "Mide tus capacidades de comunicación, liderazgo, trabajo en equipo y resolución de problemas.",
    category: "Personal",
    questions: 12,
    duration: 15,
    icon: "🤝",
  },
  {
    id: "career-fit",
    name: "Perfil de Carrera",
    description:
      "Descubre qué roles y trayectorias profesionales se alinean mejor con tus fortalezas.",
    category: "Orientación",
    questions: 20,
    duration: 25,
    icon: "🎯",
  },
];

export default function DiagnosisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container max-w-4xl py-12">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ClipboardCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Test de Diagnóstico
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre tus fortalezas, identifica áreas de mejora y recibe
            recomendaciones personalizadas para impulsar tu carrera.
          </p>
        </div>

        <div className="grid gap-6">
          {tests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-3xl shrink-0">
                    {test.icon}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{test.name}</h3>
                      <Badge variant="secondary">{test.category}</Badge>
                    </div>
                    <p className="text-muted-foreground">{test.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {test.questions} preguntas
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        ~{test.duration} min
                      </span>
                    </div>
                  </div>

                  <Button asChild>
                    <Link href={`/diagnosis/${test.id}`}>
                      Comenzar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Tus respuestas son confidenciales y se utilizan únicamente para
            generar recomendaciones personalizadas.
          </p>
        </div>
      </div>
    </div>
  );
}

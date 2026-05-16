"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "@/components/diagnosis/question-card";
import { BadgePreview } from "@/components/diagnosis/badge-preview";
import { AlertCircle, ChevronLeft, ChevronRight, Save } from "lucide-react";

const questions = [
  {
    id: "1",
    questionText:
      "¿Cuál es tu nivel de experiencia con frameworks de JavaScript modernos (React, Vue, Angular)?",
    category: "HABILIDADES DIGITALES",
    options: [
      { id: "1a", optionText: "Sin experiencia", value: 0 },
      { id: "1b", optionText: "Conocimientos básicos", value: 25 },
      { id: "1c", optionText: "Nivel intermedio - proyectos personales", value: 50 },
      { id: "1d", optionText: "Nivel avanzado - experiencia profesional", value: 75 },
      { id: "1e", optionText: "Experto - arquitectura y liderazgo técnico", value: 100 },
    ],
  },
  {
    id: "2",
    questionText:
      "¿Cómo describirías tu capacidad para trabajar con servicios en la nube (AWS, Azure, GCP)?",
    category: "HABILIDADES DIGITALES",
    options: [
      { id: "2a", optionText: "No tengo experiencia", value: 0 },
      { id: "2b", optionText: "Conozco los conceptos básicos", value: 25 },
      { id: "2c", optionText: "He desplegado aplicaciones simples", value: 50 },
      { id: "2d", optionText: "Manejo arquitecturas multi-servicio", value: 75 },
      { id: "2e", optionText: "Diseño soluciones cloud-native complejas", value: 100 },
    ],
  },
  {
    id: "3",
    questionText:
      "¿Cómo manejas situaciones de conflicto en un equipo de trabajo?",
    category: "SOFT SKILLS",
    options: [
      { id: "3a", optionText: "Evito los conflictos", value: 20 },
      { id: "3b", optionText: "Busco que alguien más los resuelva", value: 40 },
      { id: "3c", optionText: "Intento mediar y encontrar compromiso", value: 60 },
      { id: "3d", optionText: "Facilito discusiones constructivas", value: 80 },
      { id: "3e", optionText: "Lidero la resolución y prevengo futuros conflictos", value: 100 },
    ],
  },
  {
    id: "4",
    questionText:
      "¿Cuál es tu experiencia con metodologías ágiles (Scrum, Kanban)?",
    category: "MANAGEMENT",
    options: [
      { id: "4a", optionText: "No las conozco", value: 0 },
      { id: "4b", optionText: "Las he estudiado teóricamente", value: 25 },
      { id: "4c", optionText: "He participado en equipos ágiles", value: 50 },
      { id: "4d", optionText: "He liderado ceremonias y sprints", value: 75 },
      { id: "4e", optionText: "Soy Scrum Master o Agile Coach certificado", value: 100 },
    ],
  },
  {
    id: "5",
    questionText: "¿Cómo evalúas tus habilidades de análisis de datos?",
    category: "DATA ANALYSIS",
    options: [
      { id: "5a", optionText: "No tengo experiencia en análisis de datos", value: 0 },
      { id: "5b", optionText: "Uso Excel para análisis básicos", value: 25 },
      { id: "5c", optionText: "Manejo SQL y herramientas de BI", value: 50 },
      { id: "5d", optionText: "Trabajo con Python/R para análisis avanzado", value: 75 },
      { id: "5e", optionText: "Implemento modelos de ML y visualizaciones complejas", value: 100 },
    ],
  },
];

export default function DiagnosisTestPage({
  params,
}: {
  params: { testId: string };
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = () => {
    router.push("/dashboard");
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8">
      <div className="container max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                <p className="text-sm text-yellow-800">
                  Tómate tu tiempo para responder. No hay respuestas correctas
                  o incorrectas, solo queremos conocer tu perfil actual.
                </p>
              </div>
            </CardContent>
          </Card>

          <QuestionCard
            question={currentQuestion}
            selectedOption={answers[currentQuestion.id]}
            onSelect={handleSelect}
          />

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Save className="h-4 w-4" />
                Auto-guardado
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                Saltar
              </Button>
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={answeredCount < questions.length}
                >
                  Finalizar Test
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <BadgePreview
            badgeName="Frontend Developer"
            description="Completa el test para desbloquear esta insignia"
          />
        </div>
      </div>
    </div>
  );
}

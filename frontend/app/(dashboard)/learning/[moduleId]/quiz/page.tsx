"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizQuestion } from "@/components/learning/quiz-question";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  AlertTriangle,
  HelpCircle,
  Flag,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const quizData = {
  title: "Quiz: EC2 y S3",
  timeLimit: 600,
  questions: [
    {
      id: "1",
      questionText:
        "¿Cuál de las siguientes NO es una familia de instancias de EC2?",
      options: [
        { id: "a", label: "A", text: "t3 - General Purpose" },
        { id: "b", label: "B", text: "c5 - Compute Optimized" },
        { id: "c", label: "C", text: "s3 - Storage Optimized" },
        { id: "d", label: "D", text: "r5 - Memory Optimized" },
      ],
      correctAnswer: "c",
    },
    {
      id: "2",
      questionText:
        "¿Qué servicio de AWS utilizarías para almacenar objetos de forma escalable?",
      options: [
        { id: "a", label: "A", text: "Amazon EC2" },
        { id: "b", label: "B", text: "Amazon S3" },
        { id: "c", label: "C", text: "Amazon RDS" },
        { id: "d", label: "D", text: "Amazon VPC" },
      ],
      correctAnswer: "b",
    },
    {
      id: "3",
      questionText:
        "¿Cuál es la durabilidad prometida por Amazon S3 Standard?",
      options: [
        { id: "a", label: "A", text: "99.9%" },
        { id: "b", label: "B", text: "99.99%" },
        { id: "c", label: "C", text: "99.999999999% (11 nueves)" },
        { id: "d", label: "D", text: "99.95%" },
      ],
      correctAnswer: "c",
    },
    {
      id: "4",
      questionText:
        "¿Qué característica de EC2 permite ajustar automáticamente la capacidad según la demanda?",
      options: [
        { id: "a", label: "A", text: "Elastic IP" },
        { id: "b", label: "B", text: "Auto Scaling" },
        { id: "c", label: "C", text: "Security Groups" },
        { id: "d", label: "D", text: "AMI" },
      ],
      correctAnswer: "b",
    },
  ],
};

export default function QuizPage({ params }: { params: { moduleId: string } }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    correct: number;
    total: number;
    passed: boolean;
  } | null>(null);

  const handleSubmit = useCallback(() => {
    let correct = 0;
    quizData.questions.forEach((q) => {
      if (answersRef.current[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const total = quizData.questions.length;
    const passed = correct / total >= 0.7;

    setResults({ correct, total, passed });
    setShowResults(true);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const isLowTime = timeLeft < 60;

  const currentQuestion = quizData.questions[currentIndex];

  if (showResults && results) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div
              className={`inline-flex h-20 w-20 items-center justify-center rounded-full ${
                results.passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {results.passed ? (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {results.passed ? "¡Felicitaciones!" : "Sigue practicando"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {results.passed
                  ? "Has aprobado el quiz exitosamente."
                  : "No alcanzaste el puntaje mínimo requerido."}
              </p>
            </div>

            <div className="text-4xl font-bold">
              {results.correct} / {results.total}
            </div>

            <p className="text-sm text-muted-foreground">
              Puntaje: {Math.round((results.correct / results.total) * 100)}%
              {results.passed
                ? " - Has ganado 150 XP"
                : " - Necesitas 70% para aprobar"}
            </p>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/learning/${params.moduleId}`}>
                  Volver al módulo
                </Link>
              </Button>
              {!results.passed && (
                <Button
                  className="flex-1"
                  onClick={() => {
                    setAnswers({});
                    setCurrentIndex(0);
                    setTimeLeft(quizData.timeLimit);
                    setShowResults(false);
                    setResults(null);
                  }}
                >
                  Reintentar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{quizData.title}</h1>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isLowTime ? "bg-red-100 text-red-700" : "bg-muted"
          }`}
        >
          <Clock className={`h-5 w-5 ${isLowTime ? "animate-pulse" : ""}`} />
          <span className="font-mono text-lg font-medium">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {quizData.questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 flex-1 rounded-full transition-colors ${
              answers[q.id]
                ? "bg-primary"
                : i === currentIndex
                ? "bg-primary/50"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={answers[currentQuestion.id]}
        onSelect={(optionId) => handleSelect(currentQuestion.id, optionId)}
        questionNumber={currentIndex + 1}
        totalQuestions={quizData.questions.length}
      />

      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => setShowExitDialog(true)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Abandonar
          </button>
          <button className="text-muted-foreground hover:text-foreground flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            Ayuda
          </button>
          <button className="text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Flag className="h-4 w-4" />
            Reportar
          </button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            Anterior
          </Button>
          {currentIndex === quizData.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < quizData.questions.length}
            >
              Finalizar Quiz
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentIndex(
                  Math.min(quizData.questions.length - 1, currentIndex + 1)
                )
              }
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ¿Abandonar el quiz?
            </DialogTitle>
            <DialogDescription>
              Si abandonas ahora, perderás todo tu progreso y tendrás que
              comenzar de nuevo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Continuar quiz
            </Button>
            <Button
              variant="destructive"
              onClick={() => router.push(`/learning/${params.moduleId}`)}
            >
              Abandonar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

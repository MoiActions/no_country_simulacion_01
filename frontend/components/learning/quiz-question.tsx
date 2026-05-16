"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: {
    id: string;
    questionText: string;
    options: Array<{
      id: string;
      label: string;
      text: string;
    }>;
  };
  selectedAnswer?: string;
  onSelect: (optionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onSelect,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <p className="text-sm text-muted-foreground">
          Pregunta {questionNumber} de {totalQuestions}
        </p>
        <h2 className="text-xl font-semibold">{question.questionText}</h2>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border text-left transition-all hover:border-primary/50",
                selectedAnswer === option.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                  : "border-border"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm",
                  selectedAnswer === option.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                )}
              >
                {option.label}
              </span>
              <span className="pt-1">{option.text}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

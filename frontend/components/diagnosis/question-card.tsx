"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: {
    id: string;
    questionText: string;
    category: string;
    options: Array<{
      id: string;
      optionText: string;
      value: number;
    }>;
  };
  selectedOption?: string;
  onSelect: (optionId: string) => void;
}

export function QuestionCard({
  question,
  selectedOption,
  onSelect,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <Badge variant="secondary" className="w-fit">
          {question.category}
        </Badge>
        <h2 className="text-xl font-semibold mt-2">{question.questionText}</h2>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={onSelect}>
          <div className="space-y-3">
            {question.options.map((option) => (
              <Label
                key={option.id}
                htmlFor={option.id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                  selectedOption === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <span className="flex-1">{option.optionText}</span>
              </Label>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { MatchBadge } from "./match-badge";
import { Calendar, MessageSquare, Star, CheckCircle2 } from "lucide-react";

interface CandidateDetailProps {
  candidate: {
    id: string;
    name: string;
    headline: string;
    avatar: string | null;
    matchPercent: number;
    skills: string[];
    experience: number;
    availability: string;
    location: string;
    workType: "remote" | "on_site" | "hybrid";
  };
  onClose: () => void;
}

const technicalSkills = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 75 },
  { name: "AWS", level: 60 },
];

export function CandidateDetail({ candidate, onClose }: CandidateDetailProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSaveFeedback = () => {
    console.log({ rating, feedback });
  };

  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={candidate.avatar || undefined} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <SheetTitle>{candidate.name}</SheetTitle>
            <SheetDescription>{candidate.headline}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="flex gap-2">
        <Button className="flex-1">
          <Calendar className="mr-2 h-4 w-4" />
          Agendar Entrevista
        </Button>
        <Button variant="outline" className="flex-1">
          <MessageSquare className="mr-2 h-4 w-4" />
          Mensaje
        </Button>
      </div>

      <MatchBadge percent={candidate.matchPercent} size="lg" />

      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          Habilidades Validadas
        </h4>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold mb-3">Dominio Técnico</h4>
        <div className="space-y-3">
          {technicalSkills.map((skill) => (
            <div key={skill.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{skill.name}</span>
                <span className="text-muted-foreground">{skill.level}%</span>
              </div>
              <Progress value={skill.level} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold mb-3">Información Adicional</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Experiencia</span>
            <span>{candidate.experience} años</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Disponibilidad</span>
            <span>{candidate.availability}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ubicación</span>
            <span>{candidate.location}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-semibold">Feedback de Entrevista</h4>

        <div className="space-y-2">
          <Label>Puntuación</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback">Notas de la entrevista</Label>
          <Textarea
            id="feedback"
            placeholder="Escribe tus observaciones sobre el candidato..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handleSaveFeedback} className="w-full">
          Guardar Evaluación
        </Button>
      </div>
    </div>
  );
}

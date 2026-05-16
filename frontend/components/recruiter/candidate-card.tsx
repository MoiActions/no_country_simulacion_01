"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchBadge } from "./match-badge";
import { MoreHorizontal, MapPin, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CandidateCardProps {
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
  onClick: () => void;
}

const workTypeLabels = {
  remote: "Remoto",
  on_site: "Presencial",
  hybrid: "Híbrido",
};

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.avatar || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">
                {candidate.headline}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ver perfil completo</DropdownMenuItem>
              <DropdownMenuItem>Agregar a shortlist</DropdownMenuItem>
              <DropdownMenuItem>Enviar mensaje</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <MatchBadge percent={candidate.matchPercent} className="mb-3" />

        <div className="flex flex-wrap gap-1 mb-3">
          {candidate.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{candidate.skills.length - 4}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{candidate.experience} años exp.</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {candidate.availability}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{candidate.location}</span>
          <Badge variant="outline" className="text-xs ml-auto">
            {workTypeLabels[candidate.workType]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

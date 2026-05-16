"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandidateCard } from "@/components/recruiter/candidate-card";
import { CandidateDetail } from "@/components/recruiter/candidate-detail";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, Award, Clock, X } from "lucide-react";

const candidates = [
  {
    id: "1",
    name: "María García",
    headline: "Senior Frontend Developer",
    avatar: null,
    matchPercent: 95,
    skills: ["React", "TypeScript", "Next.js", "Tailwind"],
    experience: 5,
    availability: "Inmediata",
    location: "Madrid, España",
    workType: "remote" as const,
  },
  {
    id: "2",
    name: "Carlos López",
    headline: "Full Stack Developer",
    avatar: null,
    matchPercent: 88,
    skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    experience: 4,
    availability: "2 semanas",
    location: "Barcelona, España",
    workType: "hybrid" as const,
  },
  {
    id: "3",
    name: "Ana Martínez",
    headline: "Cloud Engineer",
    avatar: null,
    matchPercent: 82,
    skills: ["AWS", "Terraform", "Kubernetes", "Python"],
    experience: 6,
    availability: "1 mes",
    location: "Valencia, España",
    workType: "remote" as const,
  },
  {
    id: "4",
    name: "Pedro Sánchez",
    headline: "Data Analyst",
    avatar: null,
    matchPercent: 78,
    skills: ["Python", "SQL", "Tableau", "Machine Learning"],
    experience: 3,
    availability: "Inmediata",
    location: "Sevilla, España",
    workType: "on_site" as const,
  },
  {
    id: "5",
    name: "Laura González",
    headline: "UX/UI Designer",
    avatar: null,
    matchPercent: 75,
    skills: ["Figma", "UI Design", "User Research", "Prototyping"],
    experience: 4,
    availability: "2 semanas",
    location: "Málaga, España",
    workType: "hybrid" as const,
  },
  {
    id: "6",
    name: "Juan Pérez",
    headline: "Backend Developer",
    avatar: null,
    matchPercent: 72,
    skills: ["Java", "Spring Boot", "Microservices", "Docker"],
    experience: 7,
    availability: "Inmediata",
    location: "Bilbao, España",
    workType: "remote" as const,
  },
];

export default function RecruiterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<
    (typeof candidates)[0] | null
  >(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "React",
    "Remoto",
  ]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [badgeFilter, setBadgeFilter] = useState<string>("all");

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Panel de Reclutamiento
          </h1>
          <p className="text-muted-foreground">
            {filteredCandidates.length} candidatos encontrados
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar candidatos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={badgeFilter} onValueChange={setBadgeFilter}>
          <SelectTrigger className="w-40">
            <Award className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Insignias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="frontend">Frontend Expert</SelectItem>
            <SelectItem value="cloud">Cloud Certified</SelectItem>
            <SelectItem value="data">Data Analyst</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={availabilityFilter}
          onValueChange={setAvailabilityFilter}
        >
          <SelectTrigger className="w-44">
            <Clock className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Disponibilidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="immediate">Inmediata</SelectItem>
            <SelectItem value="2weeks">2 semanas</SelectItem>
            <SelectItem value="1month">1 mes</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros Avanzados
        </Button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => removeFilter(filter)}
            >
              {filter}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilters([])}
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onClick={() => setSelectedCandidate(candidate)}
          />
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron candidatos con los filtros seleccionados
          </p>
        </div>
      )}

      <Sheet
        open={!!selectedCandidate}
        onOpenChange={() => setSelectedCandidate(null)}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCandidate && (
            <CandidateDetail
              candidate={selectedCandidate}
              onClose={() => setSelectedCandidate(null)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

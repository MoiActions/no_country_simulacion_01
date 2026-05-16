"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JobCard } from "@/components/marketplace/job-card";
import { Footer } from "@/components/layout/footer";
import { Search, Filter, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

const jobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Madrid, España",
    workType: "remote" as const,
    employmentType: "full_time" as const,
    salaryMin: 45000,
    salaryMax: 65000,
    skills: ["React", "TypeScript", "Next.js"],
    description:
      "Buscamos un desarrollador frontend con experiencia en React y TypeScript para liderar el desarrollo de nuestra plataforma SaaS.",
    isUrgent: true,
    createdAt: "2024-01-14",
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Barcelona, España",
    workType: "hybrid" as const,
    employmentType: "full_time" as const,
    salaryMin: 40000,
    salaryMax: 55000,
    skills: ["Node.js", "React", "PostgreSQL"],
    description:
      "Únete a nuestro equipo de desarrollo para construir productos innovadores en el sector fintech.",
    isUrgent: false,
    createdAt: "2024-01-13",
  },
  {
    id: "3",
    title: "Cloud Engineer",
    company: "CloudSolutions",
    location: "Remoto",
    workType: "remote" as const,
    employmentType: "full_time" as const,
    salaryMin: 50000,
    salaryMax: 70000,
    skills: ["AWS", "Terraform", "Kubernetes"],
    description:
      "Diseña y mantén infraestructura cloud escalable para clientes enterprise.",
    isUrgent: true,
    createdAt: "2024-01-12",
  },
  {
    id: "4",
    title: "Data Analyst",
    company: "DataCorp",
    location: "Valencia, España",
    workType: "on_site" as const,
    employmentType: "full_time" as const,
    salaryMin: 35000,
    salaryMax: 45000,
    skills: ["Python", "SQL", "Tableau"],
    description:
      "Analiza datos de negocio y crea dashboards para la toma de decisiones estratégicas.",
    isUrgent: false,
    createdAt: "2024-01-11",
  },
  {
    id: "5",
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Madrid, España",
    workType: "hybrid" as const,
    employmentType: "part_time" as const,
    salaryMin: 25000,
    salaryMax: 35000,
    skills: ["Figma", "UI Design", "User Research"],
    description:
      "Crea experiencias de usuario excepcionales para productos digitales innovadores.",
    isUrgent: false,
    createdAt: "2024-01-10",
  },
];

const skillFilters = [
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "AWS",
  "SQL",
  "Figma",
];

const availabilityFilters = [
  { id: "full_time", label: "Jornada Completa" },
  { id: "part_time", label: "Media Jornada" },
  { id: "freelance", label: "Freelance" },
];

export default function JobMarketPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesRemote = !remoteOnly || job.workType === "remote";

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => job.skills.includes(skill));

    const matchesAvailability =
      selectedAvailability.length === 0 ||
      selectedAvailability.includes(job.employmentType);

    return matchesSearch && matchesRemote && matchesSkills && matchesAvailability;
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleAvailability = (id: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mercado de Empleo</h1>
        <p className="text-muted-foreground">
          Encuentra oportunidades que se ajusten a tu perfil y habilidades
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, empresa o habilidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtros avanzados
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="remote-only" className="font-normal">
                  Solo Remoto
                </Label>
                <Switch
                  id="remote-only"
                  checked={remoteOnly}
                  onCheckedChange={setRemoteOnly}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Habilidades</h4>
                {skillFilters.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => toggleSkill(skill)}
                    />
                    <Label
                      htmlFor={`skill-${skill}`}
                      className="text-sm font-normal"
                    >
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Disponibilidad</h4>
                {availabilityFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`availability-${filter.id}`}
                      checked={selectedAvailability.includes(filter.id)}
                      onCheckedChange={() => toggleAvailability(filter.id)}
                    />
                    <Label
                      htmlFor={`availability-${filter.id}`}
                      className="text-sm font-normal"
                    >
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Búsquedas Guardadas
                </h4>
                <p className="text-sm text-muted-foreground">
                  No tienes búsquedas guardadas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length} ofertas encontradas
            </p>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No se encontraron ofertas con los filtros seleccionados
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">Página {currentPage} de 1</span>
            <Button
              variant="outline"
              size="icon"
              disabled
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

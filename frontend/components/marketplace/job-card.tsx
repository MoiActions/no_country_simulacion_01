"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Briefcase } from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    workType: "remote" | "on_site" | "hybrid";
    employmentType: "full_time" | "part_time" | "freelance" | "internship";
    salaryMin?: number;
    salaryMax?: number;
    skills: string[];
    description: string;
    isUrgent: boolean;
    createdAt: string;
  };
}

const workTypeLabels = {
  remote: "Remoto",
  on_site: "Presencial",
  hybrid: "Híbrido",
};

const employmentTypeLabels = {
  full_time: "Tiempo completo",
  part_time: "Media jornada",
  freelance: "Freelance",
  internship: "Prácticas",
};

export function JobCard({ job }: JobCardProps) {
  const timeAgo = getTimeAgo(job.createdAt);
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k €`
      : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  {job.isUrgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgente
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{job.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              {salaryRange && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {salaryRange}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {workTypeLabels[job.workType]}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {timeAgo}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 sm:justify-center">
            <Button asChild className="flex-1 sm:flex-none">
              <Link href={`/job-market/${job.id}`}>Ver detalles</Link>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              Candidatura rápida
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return `Hace ${Math.floor(diffDays / 30)} meses`;
}

"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompetencyRadar } from "@/components/dashboard/competency-radar";
import { CareerInsights } from "@/components/dashboard/career-insights";
import { BadgesGrid } from "@/components/dashboard/badges-grid";
import { RecommendedCourses } from "@/components/dashboard/recommended-courses";
import { Download, RotateCcw, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tu Panel de Competencias
          </h1>
          <p className="text-muted-foreground">
            Bienvenido, {user?.fullName}. Aquí puedes ver tu progreso y
            recomendaciones.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Repetir Test
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Perfil de Competencias</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              IA Insights Activos
            </Badge>
          </CardHeader>
          <CardContent>
            <CompetencyRadar />
          </CardContent>
        </Card>

        <CareerInsights />
      </div>

      <BadgesGrid />

      <RecommendedCourses />
    </div>
  );
}

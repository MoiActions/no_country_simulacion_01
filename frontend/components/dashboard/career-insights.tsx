"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp, Star, AlertCircle } from "lucide-react";

export function CareerInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Insights de Carrera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tu puntuación</span>
            <span className="font-medium">75/100</span>
          </div>
          <Progress value={75} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Estás por encima del 68% de los profesionales en tu área
          </p>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">
                Recomendación prioritaria
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                Mejorar tus habilidades en <strong>Cloud Computing</strong> te
                posicionaría un 35% mejor en el mercado actual.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Tus fortalezas</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              Soft Skills - Excelente
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              Frontend - Sobresaliente
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              UI/UX - Notable
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/learning">
            Comenzar mi ruta de aprendizaje
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

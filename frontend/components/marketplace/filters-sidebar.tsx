"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bookmark } from "lucide-react";

interface FiltersSidebarProps {
  remoteOnly: boolean;
  onRemoteOnlyChange: (value: boolean) => void;
  selectedSkills: string[];
  onSkillToggle: (skill: string) => void;
  selectedAvailability: string[];
  onAvailabilityToggle: (id: string) => void;
  skillFilters: string[];
  availabilityFilters: Array<{ id: string; label: string }>;
}

export function FiltersSidebar({
  remoteOnly,
  onRemoteOnlyChange,
  selectedSkills,
  onSkillToggle,
  selectedAvailability,
  onAvailabilityToggle,
  skillFilters,
  availabilityFilters,
}: FiltersSidebarProps) {
  return (
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
            onCheckedChange={onRemoteOnlyChange}
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
                onCheckedChange={() => onSkillToggle(skill)}
              />
              <Label htmlFor={`skill-${skill}`} className="text-sm font-normal">
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
                onCheckedChange={() => onAvailabilityToggle(filter.id)}
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
  );
}

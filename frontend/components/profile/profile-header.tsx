"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Pencil } from "lucide-react";
import type { User } from "@/types";

interface ProfileHeaderProps {
  user: User | null;
  headline?: string;
  location?: string;
  joinedAt?: string;
}

export function ProfileHeader({
  user,
  headline,
  location,
  joinedAt,
}: ProfileHeaderProps) {
  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinDate = joinedAt
    ? new Date(joinedAt).toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-24 w-24 shrink-0">
            <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
            <AvatarFallback className="text-2xl">{initials || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{user?.fullName}</h1>
                {headline && (
                  <p className="text-muted-foreground">{headline}</p>
                )}
              </div>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              )}
              {joinDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Miembro desde {joinDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

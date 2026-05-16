"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SkillsGrid } from "@/components/profile/skills-grid";
import { Achievements } from "@/components/profile/achievements";
import { XpCard } from "@/components/profile/xp-card";
import { Github, Globe, Linkedin, Mail, MapPin, Calendar } from "lucide-react";

const profileData = {
  headline: "Full Stack Developer | React & Node.js",
  bio: "Desarrollador apasionado con más de 5 años de experiencia en tecnologías web modernas. Enfocado en crear soluciones escalables y experiencias de usuario excepcionales.",
  location: "Madrid, España",
  joinedAt: "2024-01-15",
  links: {
    github: "https://github.com/usuario",
    portfolio: "https://miportfolio.com",
    linkedin: "https://linkedin.com/in/usuario",
  },
  skills: [
    { name: "React", level: "expert", validated: true },
    { name: "TypeScript", level: "advanced", validated: true },
    { name: "Node.js", level: "advanced", validated: true },
    { name: "AWS", level: "intermediate", validated: false },
    { name: "Python", level: "intermediate", validated: false },
    { name: "SQL", level: "advanced", validated: true },
  ],
  xp: {
    current: 2450,
    nextLevel: 3000,
    level: 12,
    title: "PROFESIONAL",
  },
  achievements: [
    {
      id: "1",
      name: "Frontend Expert",
      icon: "🚀",
      earnedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Quick Learner",
      icon: "⚡",
      earnedAt: "2024-01-10",
    },
    {
      id: "3",
      name: "First Course",
      icon: "🎓",
      earnedAt: "2024-01-05",
    },
    {
      id: "4",
      name: "Profile Complete",
      icon: "✅",
      earnedAt: "2024-01-01",
    },
  ],
};

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={user}
        headline={profileData.headline}
        location={profileData.location}
        joinedAt={profileData.joinedAt}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre mí</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{profileData.bio}</p>
            </CardContent>
          </Card>

          <SkillsGrid skills={profileData.skills} />

          <Achievements achievements={profileData.achievements} />

          <Card>
            <CardHeader>
              <CardTitle>Enlaces Profesionales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {profileData.links.github && (
                  <a
                    href={profileData.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                {profileData.links.portfolio && (
                  <a
                    href={profileData.links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Portafolio
                  </a>
                )}
                {profileData.links.linkedin && (
                  <a
                    href={profileData.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <XpCard xp={profileData.xp} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cursos completados</span>
                <span className="font-medium">8</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skills validadas</span>
                <span className="font-medium">4</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tests realizados</span>
                <span className="font-medium">3</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aplicaciones</span>
                <span className="font-medium">12</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

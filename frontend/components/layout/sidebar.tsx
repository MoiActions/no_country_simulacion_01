"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui.store";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SkillLevelBar } from "./skill-level-bar";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  User,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Diagnóstico",
    href: "/diagnosis",
    icon: ClipboardCheck,
  },
  {
    title: "Learning",
    href: "/learning",
    icon: GraduationCap,
  },
  {
    title: "Job Market",
    href: "/job-market",
    icon: Briefcase,
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: User,
  },
];

const recruiterNavItems = [
  {
    title: "Recruiter",
    href: "/recruiter",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, signOut } = useAuth();

  const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r bg-background transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {sidebarOpen && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              P
            </div>
            <span className="font-semibold text-lg">ProgresoPro</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(!sidebarOpen && "mx-auto")}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-1 py-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    !sidebarOpen && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}

          {isRecruiter && (
            <>
              <Separator className="my-2" />
              {recruiterNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        !sidebarOpen && "justify-center px-2"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {sidebarOpen && <span>{item.title}</span>}
                    </Button>
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t p-3">
        {sidebarOpen && <SkillLevelBar className="mb-3" />}

        <div className="flex flex-col gap-1">
          <Link href="/settings">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3",
                !sidebarOpen && "justify-center px-2"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>Settings</span>}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-destructive hover:text-destructive",
              !sidebarOpen && "justify-center px-2"
            )}
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}

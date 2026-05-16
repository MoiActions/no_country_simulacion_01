"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { supabase } from "@/lib/supabase";
import { api, isNetworkError } from "@/lib/api";
import type { User } from "@/types";
import type { Session } from "@supabase/supabase-js";

let warnedBackendDown = false;

function userFromSupabaseSession(session: Session): User {
  const meta = session.user.user_metadata as Record<string, unknown> | undefined;
  const fromMeta =
    typeof meta?.full_name === "string" ? meta.full_name : undefined;
  const fullName =
    fromMeta || session.user.email?.split("@")[0] || "Usuario";

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    fullName,
    role: "professional",
    createdAt: session.user.created_at ?? new Date().toISOString(),
  };
}

export function useAuth() {
  const { user, isLoading, setUser, setAccessToken, setLoading, logout } =
    useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setAccessToken(session.access_token);
          try {
            const userData = await api.get<User>("/auth/me");
            setUser(userData);
          } catch (err) {
            if (isNetworkError(err)) {
              if (!warnedBackendDown) {
                warnedBackendDown = true;
                console.warn(
                  "[ProgresoPro] El backend no responde (¿está Nest en el puerto 3008?). Ejecuta en /server: npm run start:dev"
                );
              }
              setUser(userFromSupabaseSession(session));
            } else {
              console.error("Auth init error:", err);
              logout();
            }
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setAccessToken(session.access_token);
        try {
          const userData = await api.get<User>("/auth/me");
          setUser(userData);
        } catch (error) {
          if (isNetworkError(error)) {
            if (!warnedBackendDown) {
              warnedBackendDown = true;
              console.warn(
                "[ProgresoPro] El backend no responde (¿está Nest en el puerto 3008?). Ejecuta en /server: npm run start:dev"
              );
            }
            setUser(userFromSupabaseSession(session));
          } else {
            console.error("Failed to fetch user:", error);
          }
        }
      } else if (event === "SIGNED_OUT") {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setAccessToken, setLoading, logout]);

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
  };
}

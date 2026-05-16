"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Loader2, Zap, Award, Users } from "lucide-react";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      await signUpWithEmail(data.email, data.password, data.fullName);
      toast({
        title: "Cuenta creada",
        description: "Revisa tu email para verificar tu cuenta",
      });
      router.push("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            P
          </div>
          <CardTitle className="text-2xl">Impulsa tu carrera hoy</CardTitle>
          <CardDescription>
            Únete a miles de profesionales que ya están mejorando sus habilidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SocialButtons />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continúa con email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                placeholder="Juan Pérez"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setValue("acceptTerms", checked as boolean)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los términos de servicio
                </label>
                <p className="text-sm text-muted-foreground">
                  Al registrarte aceptas nuestros{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    términos
                  </Link>{" "}
                  y{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    política de privacidad
                  </Link>
                </p>
              </div>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive">
                {errors.acceptTerms.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Regístrate"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border">
          <Zap className="h-6 w-6 text-yellow-500" />
          <span className="text-xs font-medium">Acceso Instantáneo</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border">
          <Award className="h-6 w-6 text-green-500" />
          <span className="text-xs font-medium">Certificación Real</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border">
          <Users className="h-6 w-6 text-blue-500" />
          <span className="text-xs font-medium">Red de Reclutadores</span>
        </div>
      </div>
    </div>
  );
}

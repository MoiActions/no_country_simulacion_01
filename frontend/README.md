# ProgresoPro Frontend

Frontend de la plataforma de upskilling y empleabilidad para profesionales +45.

## Stack Tecnológico

- **Framework:** Next.js 14 con App Router
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS 3.4
- **Componentes:** shadcn/ui (estilo OpenAI/Vercel/Claude)
- **Primitivos:** Radix UI
- **Auth:** Supabase JS Client
- **Data Fetching:** TanStack Query v5
- **Estado Global:** Zustand
- **Gráficos:** Recharts
- **Iconos:** Lucide React
- **Formularios:** React Hook Form + Zod
- **Animaciones:** Framer Motion

## Estructura del Proyecto

```
frontend/
├── app/                    # App Router (páginas)
│   ├── (auth)/            # Layout sin sidebar (login, register)
│   ├── (dashboard)/       # Layout con sidebar (dashboard, learning, etc.)
│   └── diagnosis/         # Flujo de diagnóstico
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── layout/            # Sidebar, Header, Footer
│   ├── auth/              # Formularios de autenticación
│   ├── dashboard/         # Componentes del dashboard
│   ├── learning/          # Catálogo y vista de lecciones
│   ├── diagnosis/         # Componentes de test
│   ├── profile/           # Componentes de perfil
│   ├── marketplace/       # Mercado de empleo
│   └── recruiter/         # Panel de reclutador
├── hooks/                 # Custom hooks (auth, queries)
├── lib/                   # Utilidades (api, supabase, utils)
├── services/              # Servicios de API
├── stores/                # Zustand stores
└── types/                 # Tipos TypeScript
```

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3008
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Páginas Implementadas

1. **Autenticación**
   - `/login` - Inicio de sesión
   - `/register` - Registro con OAuth (Google, GitHub)

2. **Dashboard**
   - `/dashboard` - Panel principal con gráfico radar, insights y cursos

3. **Learning**
   - `/learning` - Catálogo de cursos
   - `/learning/[moduleId]` - Vista de lección
   - `/learning/[moduleId]/quiz` - Quiz de evaluación

4. **Diagnóstico**
   - `/diagnosis` - Selección de test
   - `/diagnosis/[testId]` - Test en progreso

5. **Perfil**
   - `/profile` - Perfil con skills, XP y logros

6. **Mercado de Empleo**
   - `/job-market` - Ofertas de trabajo con filtros

7. **Panel Reclutador**
   - `/recruiter` - Búsqueda de candidatos

8. **Notificaciones**
   - `/notifications` - Centro de notificaciones

## Conexión con Backend

El frontend se conecta con el backend NestJS en `http://localhost:3008`. Los servicios están configurados en `/services/` y utilizan React Query para caché y sincronización.

### Endpoints Principales

| Servicio | Endpoints |
|----------|-----------|
| auth | `/auth/me`, `/auth/verify` |
| users | `/users/me` |
| diagnosis | `/diagnosis/tests`, `/diagnosis/submit` |
| learning | `/learning/paths`, `/learning/modules/:id` |
| profile | `/professional-profile/full` |
| marketplace | `/marketplace/opportunities` |
| recruiter | `/marketplace/talent/search` |
| notifications | `/notifications` |

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Iniciar producción
npm run lint     # Linter
```

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  plataforma: [
    { label: "Cursos", href: "/learning" },
    { label: "Diagnóstico", href: "/diagnosis" },
    { label: "Empleos", href: "/job-market" },
  ],
  empresa: [
    { label: "Sobre Nosotros", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contact" },
  ],
  legal: [
    { label: "Términos de Servicio", href: "/terms" },
    { label: "Política de Privacidad", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                P
              </div>
              <span className="font-semibold text-lg">ProgresoPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Impulsa tu carrera profesional con certificaciones validadas y
              conexiones con empresas líderes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2">
              {footerLinks.plataforma.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProgresoPro. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://twitter.com"
              target="_blank"
              className="text-muted-foreground hover:text-foreground"
            >
              Twitter
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="text-muted-foreground hover:text-foreground"
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="text-muted-foreground hover:text-foreground"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

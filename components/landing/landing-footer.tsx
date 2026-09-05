import Link from "next/link"
import { Mail, ArrowUpRight } from "lucide-react"
import { LINK_CONTATO } from "@/components/landing/contato"
import { ScissorMark } from "@/components/scissor-mark"

const NAVEGACAO = [
  { href: "#sistema", label: "O sistema" },
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#contato", label: "Contato" },
]

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {/* Marca */}
          <div className="col-span-2 md:col-span-2">
            <p className="flex items-center gap-2.5 font-serif text-2xl tracking-[0.2em]">
              <ScissorMark className="h-6 w-6 shrink-0 text-primary" />
              kairos
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sistema de agendamento para barbearias. Seus clientes marcam sozinhos, sua equipe
              trabalha com a agenda em dia.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <p className="texto-dourado text-sm font-bold">Navegar</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAVEGACAO.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Acesso e contato */}
          <div>
            <p className="texto-dourado text-sm font-bold">Acesso</p>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Área da equipe
                </Link>
              </li>
              <li>
                <a
                  href={LINK_CONTATO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <Mail className="h-3.5 w-3.5 transition-colors group-hover:text-primary" />
                  <span className="texto-dourado-interativo">Falar com a gente</span>
                  <ArrowUpRight className="h-3 w-3 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* marca d'água: o nome ocupando a largura, cortado pela borda inferior */}
        <p
          aria-hidden
          className="pointer-events-none mt-14 select-none text-center font-serif text-[18vw] leading-[0.75] tracking-[0.08em] text-foreground/[0.035] md:text-[13rem]"
        >
          kairos
        </p>
      </div>

      <div className="relative border-t border-border/40 py-5">
        <p className="text-center text-[11px] text-muted-foreground/70">
          © {new Date().getFullYear()} kairos · Feito para barbearias
        </p>
      </div>
    </footer>
  )
}

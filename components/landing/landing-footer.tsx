import Link from "next/link"
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
      {/* tesoura gigante sangrando pelo canto — a marca como assinatura do
          rodapé, no lugar do nome repetido em texto */}
      <ScissorMark
        className="pointer-events-none absolute -right-16 -top-24 h-[380px] w-[380px] rotate-[18deg] text-primary/[0.06] md:h-[460px] md:w-[460px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-12">
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
            <p className="texto-dourado font-accent mt-5 text-lg italic">
              Bom corte começa com boa agenda.
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

          {/* Acesso */}
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
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border/40 py-5">
        <p className="text-center text-[11px] text-muted-foreground/70">
          © {new Date().getFullYear()} kairos · Feito para barbearias
        </p>
      </div>
    </footer>
  )
}

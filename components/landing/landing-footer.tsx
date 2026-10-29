import Link from "next/link"
import { KairosMark } from "@/components/kairos-mark"

const NAVEGACAO = [
  { href: "#sistema", label: "O sistema" },
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#contato", label: "Contato" },
]

export function LandingFooter() {
  return (
    <footer className="tema-escuro relative overflow-hidden px-5 pt-16 md:px-8">
      <div className="relative mx-auto max-w-[92rem]">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          <div className="col-span-2">
            <p className="flex items-center gap-2.5 text-2xl font-light tracking-[0.04em]">
              <KairosMark className="h-7 w-7 shrink-0 text-primary" />
              kairos
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Sistema de agendamento para barbearias. Seus clientes marcam sozinhos, sua equipe
              trabalha com a agenda em dia.
            </p>
            <p className="mt-5 font-accent text-xl font-medium italic text-primary">
              Bom corte começa com boa agenda.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">Navegar</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAVEGACAO.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">Acesso</p>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link href="/auth/login" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Área da equipe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* nome gigante sangrando pela base da página */}
        <p
          aria-hidden
          className="titulo-fino mt-14 select-none text-center text-[clamp(8rem,31vw,34rem)] leading-[0.8] tracking-[-0.05em] text-foreground/[0.06]"
        >
          kairos
        </p>
      </div>

      <div className="relative border-t border-border py-5">
        <p className="text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} kairos · Feito para barbearias
        </p>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { KairosMark } from "@/components/kairos-mark"

const NAVEGAR = [
  { href: "#o-nome", rotulo: "O nome" },
  { href: "#por-dentro", rotulo: "Por dentro" },
  { href: "#tabela", rotulo: "Tabela da casa" },
  { href: "#como-comeca", rotulo: "Como começa" },
  { href: "#perguntas", rotulo: "Perguntas" },
]

/** Rodapé: a marca, os links e, embaixo, o chão de ladrilho sumindo no escuro. */
export function Rodape() {
  return (
    <footer className="kairos-noite relative overflow-hidden">
      <div className="meandro" aria-hidden />
      <div className="mx-auto grid max-w-[90rem] grid-cols-2 gap-10 px-5 py-16 md:grid-cols-12 md:px-10">
        <div className="col-span-2 md:col-span-6">
          <p className="flex items-center gap-3">
            <KairosMark className="h-11 w-11 text-[#d4aa55]" />
            <span className="letreiro ouro-folha text-lg">Kairos</span>
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sistema de agendamento para barbearias. O cliente marca sozinho e a equipe trabalha com a agenda em dia.
          </p>
          <p className="titulo mt-6 text-2xl italic text-primary">O momento certo, pela mecha.</p>
        </div>
        <div className="md:col-span-3">
          <p className="letreiro text-[11px] text-primary">Navegar</p>
          <ul className="mt-5 space-y-3 text-sm">
            {NAVEGAR.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {n.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="letreiro text-[11px] text-primary">Acesso</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/auth/login" className="text-muted-foreground transition-colors hover:text-foreground">
                Área da equipe
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="text-muted-foreground transition-colors hover:text-foreground">
                Privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos" className="text-muted-foreground transition-colors hover:text-foreground">
                Termos
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* chão de ladrilho em perspectiva */}
      <div aria-hidden className="relative h-40 overflow-hidden [perspective:420px] md:h-56">
        <div className="ladrilho absolute -inset-x-1/4 bottom-[-40%] top-0 origin-bottom opacity-40 [transform:rotateX(62deg)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0a09] via-[#0b0a09]/50 to-[#0b0a09]/80" />
        <p className="absolute inset-x-0 bottom-5 text-center text-[11px] text-[#efe6d2]/45">
          © {new Date().getFullYear()} kairos · Feito para barbearias
        </p>
      </div>
    </footer>
  )
}

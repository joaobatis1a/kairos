import Link from "next/link"
import type { BarbeariaConfig, HorariosConfig } from "@/app/actions/config"

const NOMES_DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

function gerarFuncionamento(horarios: HorariosConfig) {
  const { dias_abertos, horarios: hrs } = horarios
  if (!dias_abertos.length || !hrs.length) return []

  const sorted = [...hrs].sort()
  const abertura = sorted[0]
  const fechamento = sorted[sorted.length - 1]

  const grupos: string[] = []
  let inicio = -1
  for (let i = 0; i <= 6; i++) {
    const aberto = dias_abertos.includes(i)
    if (aberto && inicio === -1) inicio = i
    if (!aberto && inicio !== -1) {
      grupos.push(inicio === i - 1 ? NOMES_DIAS[inicio] : `${NOMES_DIAS[inicio]} a ${NOMES_DIAS[i - 1]}`)
      inicio = -1
    }
  }
  if (inicio !== -1) {
    grupos.push(inicio === 6 ? NOMES_DIAS[6] : `${NOMES_DIAS[inicio]} a ${NOMES_DIAS[6]}`)
  }

  const result = grupos.map((g) => ({ dia: g, horas: `${abertura} - ${fechamento}` }))

  const fechados = [0, 1, 2, 3, 4, 5, 6].filter((d) => !dias_abertos.includes(d))
  if (fechados.length) {
    result.push({ dia: fechados.map((d) => NOMES_DIAS[d]).join(", "), horas: "Fechado" })
  }
  return result
}

export function StorefrontFooter({
  config,
  horarios,
}: {
  config: BarbeariaConfig
  horarios: HorariosConfig
}) {
  const funcionamento = gerarFuncionamento(horarios)
  const contatos = [config.endereco, config.telefone, config.instagram].filter(Boolean)

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 md:col-span-2">
            <p className="font-serif text-2xl">{config.nome}</p>
            {config.slogan && <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{config.slogan}</p>}
          </div>

          {funcionamento.length > 0 && (
            <div id="horarios" className="scroll-mt-24">
              <p className="texto-dourado text-sm font-bold">Horário</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {funcionamento.map((f) => (
                  <li key={f.dia} className="flex justify-between gap-4 text-sm text-muted-foreground">
                    <span>{f.dia}</span>
                    <span>{f.horas}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contatos.length > 0 && (
            <div>
              <p className="texto-dourado text-sm font-bold">Contato</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {contatos.map((c) => (
                  <li key={c} className="text-sm text-muted-foreground">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* saiu daqui o nome da barbearia em 16vw como marca d'água: ocupava
            meia tela de rodapé sem dizer nada que o topo já não dissesse */}
        <div
          className="listra-poste listra-poste-animada mt-12 h-1.5 w-full rounded-full opacity-70"
          aria-hidden
        />
      </div>

      <div className="relative border-t border-border/40 py-5">
        <p className="text-center text-[11px] text-muted-foreground/70">
          © {new Date().getFullYear()} {config.nome} ·{" "}
          <Link href="/auth/login" className="transition-colors hover:text-foreground">
            Área da equipe
          </Link>
        </p>
      </div>
    </footer>
  )
}

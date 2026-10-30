import { Plus } from "lucide-react"
import { Revelar } from "@/components/landing/revelar"

const PERGUNTAS = [
  {
    p: "Meus clientes precisam instalar algum app?",
    r: "Não. Eles marcam pelo link da sua barbearia, direto no navegador do celular. Se quiserem, podem salvar como atalho na tela inicial.",
  },
  {
    p: "Como eu começo?",
    r: "A gente configura a barbearia junto com você: serviços, equipe e horários. Depois você recebe um código de convite que libera o painel como dono.",
  },
  {
    p: "O barbeiro vê o faturamento da casa?",
    r: "Só se você quiser. O acesso é separado por cargo: o barbeiro vê os próprios atendimentos e você decide o que cada cargo pode ver.",
  },
  {
    p: "Os dados da minha barbearia ficam misturados com os de outras?",
    r: "Não. Cada barbearia tem o seu espaço, e ninguém enxerga o que é de outra.",
  },
  {
    p: "O cliente recebe algum aviso?",
    r: "Sim: a confirmação do agendamento, o lembrete na véspera e um agradecimento depois do corte, tudo automático por e-mail.",
  },
  {
    p: "Funciona no celular?",
    r: "Sim. A página de agendamento e o painel foram feitos pro celular, e dá pra instalar o painel como app.",
  },
]

export function Perguntas() {
  return (
    <section id="perguntas" className="kairos-osso relative scroll-mt-16 px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <Revelar className="lg:col-span-4">
          <p className="letreiro flex items-center gap-3 text-[11px] text-primary md:text-xs">
            <span className="h-px w-8 bg-primary" />
            Perguntas
          </p>
          <h2 className="titulo mt-6 text-[clamp(2.6rem,4.6vw,4.4rem)]">
            O que sempre <em className="italic text-primary">perguntam</em> no balcão.
          </h2>
        </Revelar>

        <Revelar atraso={0.08} className="lg:col-span-8">
          <div className="border-t border-foreground/20">
            {PERGUNTAS.map((q) => (
              <details key={q.p} className="group border-b border-foreground/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="titulo text-2xl leading-tight md:text-[1.9rem]">{q.p}</span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-foreground/30 transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-foreground group-open:text-background">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 text-base leading-relaxed text-muted-foreground">{q.r}</p>
              </details>
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  )
}

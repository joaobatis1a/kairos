import { Revelar } from "@/components/landing/revelar"

const ITENS = [
  { nome: "Link próprio da barbearia", nota: "Pronto pra colar na bio do Instagram." },
  { nome: "Agenda online 24 horas", nota: "O cliente vê só o horário livre e marca sozinho." },
  { nome: "Painel da equipe", nota: "Cada barbeiro vê os próprios atendimentos." },
  { nome: "Cargos e permissões", nota: "Você decide o que cada um pode ver e mexer." },
  { nome: "Avisos por e-mail", nota: "Confirmação, lembrete na véspera e agradecimento." },
  { nome: "Avaliação após o corte", nota: "A média de cada barbeiro fica no seu painel." },
  { nome: "Caixa do mês", nota: "Faturamento, comissão e serviços mais pedidos." },
  { nome: "Vitrine de produtos", nota: "Pomada, óleo e o que mais você vende no balcão." },
]

/**
 * "Tabela da casa": os recursos como a tabela de preços pendurada na parede
 * da barbearia, com pontilhado entre o nome e o valor. A graça é que todo
 * valor diz "incluso".
 */
export function Tabela() {
  return (
    <section id="tabela" className="kairos-noite relative scroll-mt-16 px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-5xl">
        <Revelar className="text-center">
          <p className="letreiro text-[11px] text-primary md:text-xs">O que vem no kairos</p>
          <h2 className="titulo mt-6 text-[clamp(2.6rem,5.4vw,5.2rem)]">
            Tabela <em className="ouro-folha pr-1 italic">da casa.</em>
          </h2>
        </Revelar>

        <Revelar atraso={0.1}>
          {/* a placa: madeira laqueada com moldura dupla em ouro */}
          <div className="mt-14 rounded-[1.6rem] border border-[#d4aa55]/70 p-2 md:mt-20">
            <div className="relative rounded-[1.2rem] border border-[#d4aa55]/25 bg-gradient-to-b from-[#16120e] to-[#0e0c0a] px-6 py-10 md:px-16 md:py-14">
              <div className="flex items-center justify-center gap-4">
                <span className="h-px flex-1 bg-[#d4aa55]/30" />
                <p className="letreiro ouro-folha text-sm md:text-base">Serviços do sistema</p>
                <span className="h-px flex-1 bg-[#d4aa55]/30" />
              </div>

              <ul className="mt-10 md:mt-12">
                {ITENS.map((item) => (
                  <li key={item.nome} className="group py-4 md:py-5">
                    <div className="flex items-end gap-3">
                      <span className="titulo text-2xl transition-colors duration-300 group-hover:text-[#e7c878] md:text-[2rem]">
                        {item.nome}
                      </span>
                      <span aria-hidden className="pontilhado mb-2 h-[3px] flex-1 text-[#d4aa55]/40 transition-colors duration-300 group-hover:text-[#d4aa55]/80" />
                      <span className="letreiro mb-1 text-[11px] text-[#d4aa55] md:text-xs">Incluso</span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.nota}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-10 text-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                Tudo isso já chega configurado com você
              </p>
            </div>
          </div>
        </Revelar>
      </div>
    </section>
  )
}

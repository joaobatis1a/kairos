"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"
import { MockupAgendamento, MockupAgenda, MockupNumeros } from "@/components/landing/sistema-mockups"
import { cn } from "@/lib/utils"

/**
 * Coluna do mockup: entra subindo e, depois disso, deriva devagar contra o
 * texto conforme a página rola — é o que dá sensação de profundidade.
 */
function ColunaMockup({ children, invertido }: { children: React.ReactNode; invertido: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"])

  return (
    <div ref={ref} className={cn("revelar relative", invertido && "md:order-1")}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

const BLOCOS = [
  {
    n: "01",
    titulo: "A página da sua barbearia",
    texto:
      "Cada barbearia ganha um link próprio. O cliente entra, escolhe o serviço, o profissional e o horário livre, sem app pra instalar e sem conversa por mensagem.",
    itens: ["Horários ocupados somem em tempo real", "Escolha de barbeiro e forma de pagamento", "Confirmação por e-mail automática"],
    Mockup: MockupAgendamento,
  },
  {
    n: "02",
    titulo: "A agenda que a equipe usa",
    texto:
      "Todo mundo abre o painel e vê o dia. O barbeiro enxerga só os próprios atendimentos; o dono vê a casa inteira e move o que precisar.",
    itens: ["Confirmar, finalizar ou cancelar em um clique", "Acesso separado por cargo", "Atualiza sozinho, sem recarregar"],
    Mockup: MockupAgenda,
  },
  {
    n: "03",
    titulo: "Os números, sem planilha",
    texto:
      "Faturamento do dia, da semana e do mês. Quanto cada barbeiro rendeu, quais serviços saem mais e o que os clientes acharam do atendimento.",
    itens: ["Ranking de barbeiros por receita", "Serviços mais pedidos", "Avaliações do cliente após cada corte"],
    Mockup: MockupNumeros,
  },
]

export function SistemaSection() {
  return (
    <section id="sistema" className="relative scroll-mt-20 border-y border-border/60 bg-card/20 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Por dentro</Eyebrow>
          </Reveal>
          <h2 className="mt-6 font-serif text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em]">
            <TextReveal delay={0.1} lines={["Três telas.", <em key="2" className="texto-dourado font-accent italic">Uma barbearia inteira.</em>]} />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Do agendamento do cliente ao fechamento do mês, é isso que você e sua equipe usam
              todo dia.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-16 md:gap-20">
          {BLOCOS.map((b, i) => {
            const invertido = i % 2 === 1
            return (
              <div
                key={b.n}
                className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20"
              >
                <Reveal className={cn(invertido && "md:order-2")} y={36}>
                  <div className="text-sm">
                    <span className="font-serif text-xs tracking-[0.3em] text-primary/50">{b.n}</span>
                    <h3 className="mt-4 font-serif text-2xl leading-tight md:text-3xl">{b.titulo}</h3>
                    <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{b.texto}</p>
                    <ul className="mt-7 flex flex-col gap-3">
                      {b.itens.map((item) => (
                        <li key={item} className="revelar flex items-start gap-3 text-muted-foreground">
                          <span className="mt-[0.6em] h-px w-4 shrink-0 bg-primary/60" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <ColunaMockup invertido={invertido}>
                  <b.Mockup />
                </ColunaMockup>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

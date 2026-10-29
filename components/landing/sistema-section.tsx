"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion"
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
    quem: "O cliente",
    titulo: "Agenda sozinho, no link da sua barbearia",
    texto:
      "Ele entra, escolhe o serviço, o profissional e o horário livre, sem app pra instalar e sem conversa por mensagem.",
    itens: ["Horários ocupados somem em tempo real", "Escolha de barbeiro e forma de pagamento", "Confirmação por e-mail automática"],
    Mockup: MockupAgendamento,
  },
  {
    quem: "A equipe",
    titulo: "Abre o painel e já sabe o dia inteiro",
    texto:
      "O barbeiro enxerga só os próprios atendimentos; o dono vê a casa inteira e move o que precisar.",
    itens: ["Confirmar, finalizar ou cancelar em um clique", "Acesso separado por cargo", "Atualiza sozinho, sem recarregar"],
    Mockup: MockupAgenda,
  },
  {
    quem: "Você",
    titulo: "Fecha o mês sem abrir uma planilha",
    texto:
      "Faturamento do dia, da semana e do mês. Quanto cada barbeiro rendeu e o que os clientes acharam do atendimento.",
    itens: ["Ranking de barbeiros por receita", "Serviços mais pedidos", "Avaliações do cliente após cada corte"],
    Mockup: MockupNumeros,
  },
]

function Texto({ b }: { b: (typeof BLOCOS)[number] }) {
  return (
    <div className="text-sm">
      <span className="inline-block bg-primary px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-primary-foreground uppercase">{b.quem}</span>
      <h3 className="mt-5 text-3xl font-extrabold leading-[1.05] tracking-tight md:text-4xl">{b.titulo}</h3>
      <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{b.texto}</p>
      <ul className="mt-7 flex flex-col gap-3">
        {b.itens.map((item) => (
          <li key={item} className="flex items-start gap-3 text-muted-foreground">
            <span className="mt-[0.55em] h-0.5 w-4 shrink-0 bg-primary" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Desktop: o mockup fica fixo na tela enquanto o texto de cada ponto de
 * vista rola ao lado; o mockup troca (fade + leve subida) quando o passo
 * correspondente cruza o meio da tela. No celular a lista empilhada abaixo
 * assume, porque sticky de meia tela não cabe.
 */
function PalcoSticky() {
  const [ativo, setAtivo] = useState(0)
  const passos = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setAtivo(Number((e.target as HTMLElement).dataset.i))
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    passos.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const Ativo = BLOCOS[ativo].Mockup

  return (
    <div className="mt-16 hidden grid-cols-2 gap-20 md:grid">
      <div>
        {BLOCOS.map((b, i) => (
          <div
            key={b.quem}
            data-i={i}
            ref={(el) => {
              passos.current[i] = el
            }}
            className={cn(
              "flex min-h-[78vh] items-center transition-opacity duration-500",
              ativo === i ? "opacity-100" : "opacity-35",
            )}
          >
            <Texto b={b} />
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="sticky top-[18vh] flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={ativo}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Ativo />
            </motion.div>
          </AnimatePresence>
          {/* indicador dos 3 pontos de vista */}
          <div className="flex items-center justify-center gap-2">
            {BLOCOS.map((b, i) => (
              <span
                key={b.quem}
                className={cn(
                  "h-1 rounded-full bg-primary transition-all duration-500",
                  ativo === i ? "w-8 opacity-100" : "w-2 opacity-30",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SistemaSection() {
  return (
    <section id="sistema" className="tema-escuro relative scroll-mt-20 px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[92rem]">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Três pontos de vista</Eyebrow>
          </Reveal>
          <h2 className="titulo-fino mt-6 text-[clamp(2.8rem,6.6vw,6.6rem)]">
            <TextReveal delay={0.1} lines={["Uma tela pra cada um,", <em key="2" className="font-accent text-[0.92em] font-medium italic text-primary">sem se atropelar.</em>]} />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Cliente, equipe e dono usam o kairos ao mesmo tempo, cada um vendo só o que
              precisa ver.
            </p>
          </Reveal>
        </div>

        <PalcoSticky />

        <div className="mt-16 flex flex-col gap-16 md:hidden">
          {BLOCOS.map((b, i) => {
            const invertido = i % 2 === 1
            return (
              <div
                key={b.quem}
                className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20"
              >
                <Reveal className={cn(invertido && "md:order-2")} y={36}>
                  <div className="text-sm">
                    <span className="inline-block bg-primary px-2.5 py-1 text-xs font-bold tracking-[0.22em] text-primary-foreground uppercase">{b.quem}</span>
                    <h3 className="mt-5 text-3xl font-extrabold leading-[1.05] tracking-tight md:text-4xl">{b.titulo}</h3>
                    <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{b.texto}</p>
                    <ul className="mt-7 flex flex-col gap-3">
                      {b.itens.map((item) => (
                        <li key={item} className="revelar flex items-start gap-3 text-muted-foreground">
                          <span className="mt-[0.55em] h-0.5 w-4 shrink-0 bg-primary" aria-hidden />
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

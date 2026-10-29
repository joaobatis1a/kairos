"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"
import { MockupAgendamento, MockupAgenda, MockupNumeros } from "@/components/landing/sistema-mockups"
import { cn } from "@/lib/utils"

const BLOCOS = [
  {
    quem: "O cliente",
    titulo: "Agenda sozinho, no link da sua barbearia",
    texto: "Ele entra, escolhe o serviço, o profissional e o horário livre, sem app pra instalar e sem conversa por mensagem.",
    itens: ["Horários ocupados somem em tempo real", "Escolha de barbeiro e forma de pagamento", "Confirmação por e-mail automática"],
    Mockup: MockupAgendamento,
  },
  {
    quem: "A equipe",
    titulo: "Abre o painel e já sabe o dia inteiro",
    texto: "O barbeiro enxerga só os próprios atendimentos; o dono vê a casa inteira e move o que precisar.",
    itens: ["Confirmar, finalizar ou cancelar em um clique", "Acesso separado por cargo", "Atualiza sozinho, sem recarregar"],
    Mockup: MockupAgenda,
  },
  {
    quem: "Você",
    titulo: "Fecha o mês sem abrir uma planilha",
    texto: "Faturamento do dia, da semana e do mês. Quanto cada barbeiro rendeu e o que os clientes acharam do atendimento.",
    itens: ["Ranking de barbeiros por receita", "Serviços mais pedidos", "Avaliações do cliente após cada corte"],
    Mockup: MockupNumeros,
  },
]

function Cabecalho() {
  return (
    <div>
      <Reveal>
        <Eyebrow>Três pontos de vista</Eyebrow>
      </Reveal>
      <h2 className="titulo-fino mt-6 text-[clamp(2.6rem,5.2vw,5.6rem)]">
        <TextReveal
          delay={0.1}
          lines={[
            "Uma tela pra cada um,",
            <em key="2" className="font-accent font-medium italic text-primary">
              sem se atropelar.
            </em>,
          ]}
        />
      </h2>
    </div>
  )
}

/** Moldura de vidro em volta do mockup. */
function Vidro({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-foreground/15 bg-foreground/[0.04] p-2 shadow-[0_50px_140px_-40px_rgb(201_162_75/0.35)] backdrop-blur-sm md:p-3">
      {children}
    </div>
  )
}

/**
 * Desktop: o palco fica fixo na tela durante 3 telas de rolagem. À esquerda,
 * a lista dos pontos de vista (o ativo abre e fica dourado); à direita, o
 * mockup correspondente troca com fade. A rolagem decide quem está ativo.
 * No celular sticky de tela cheia não cabe: vale a lista empilhada.
 */
function PalcoDesktop() {
  const ref = useRef<HTMLDivElement>(null)
  const [ativo, setAtivo] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAtivo(Math.min(BLOCOS.length - 1, Math.max(0, Math.floor(v * BLOCOS.length))))
  })
  const Ativo = BLOCOS[ativo].Mockup

  return (
    <div ref={ref} className="relative hidden h-[330vh] md:block">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-[92rem] grid-cols-12 items-center gap-14 px-8 pt-16">
          <div className="col-span-5">
            <Cabecalho />

            <ul className="mt-10">
              {BLOCOS.map((b, i) => {
                const aberto = ativo === i
                return (
                  <li key={b.quem} className="border-t border-foreground/15 last:border-b">
                    <div className="flex items-center justify-between gap-4 py-4">
                      <span
                        className={cn(
                          "text-lg transition-colors duration-500",
                          aberto ? "text-primary" : "text-foreground/45",
                        )}
                      >
                        <span className="mr-4 text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        {b.quem}
                      </span>
                      <ArrowUpRight
                        className={cn(
                          "h-4 w-4 transition-all duration-500",
                          aberto ? "rotate-45 text-primary" : "text-foreground/30",
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500",
                        aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-md pb-3 text-xl font-light leading-snug tracking-tight">{b.titulo}</p>
                        <p className="max-w-md pb-5 text-sm leading-relaxed text-muted-foreground">{b.texto}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="col-span-7">
            <Vidro>
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
            </Vidro>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              {BLOCOS[ativo].itens.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ListaMobile() {
  return (
    <div className="mt-14 flex flex-col gap-20 md:hidden">
      {BLOCOS.map((b, i) => (
        <Reveal key={b.quem}>
          <div>
            <p className="flex items-center gap-3 text-sm text-primary">
              <span className="text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              {b.quem}
            </p>
            <h3 className="mt-4 text-3xl font-light leading-[1.1] tracking-tight">{b.titulo}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{b.texto}</p>
            <div className="mt-8">
              <Vidro>
                <b.Mockup />
              </Vidro>
            </div>
            <ul className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              {b.itens.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export function SistemaSection() {
  return (
    <section id="sistema" className="tema-escuro relative scroll-mt-20 px-5 pt-28 md:px-0 md:pt-24">
      {/* luz dourada que atravessa o palco */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_75%_40%,rgb(201_162_75/0.1),transparent_70%)]"
      />
      <div className="relative">
        <div className="md:hidden">
          <Cabecalho />
        </div>
        <ListaMobile />
        <PalcoDesktop />
      </div>
      <div className="pb-24 md:hidden" />
    </section>
  )
}

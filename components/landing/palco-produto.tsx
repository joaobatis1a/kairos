"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Bell, CalendarDays, Scissors, Star, TrendingUp, Users } from "lucide-react"
import { Contador } from "@/components/landing/contador"
import { ScissorMark } from "@/components/scissor-mark"

const AGENDA = [
  { hora: "09:00", nome: "Rafael M.", servico: "Corte + barba", status: "Finalizado" },
  { hora: "10:30", nome: "Bruno A.", servico: "Corte degradê", status: "Confirmado" },
  { hora: "11:30", nome: "Thiago L.", servico: "Barba", status: "Confirmado" },
  { hora: "14:00", nome: "Diego S.", servico: "Corte", status: "Pendente" },
]

const BARRAS = [38, 52, 44, 68, 60, 82, 74]

function Selo({ status }: { status: string }) {
  const tom =
    status === "Finalizado"
      ? "bg-muted-foreground/15 text-muted-foreground"
      : status === "Confirmado"
        ? "bg-primary/15 text-primary"
        : "bg-foreground/10 text-foreground/70"
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tom}`}>{status}</span>
}

/**
 * Vitrine do produto sob o hero: o painel inteiro, inclinado em perspectiva,
 * que se endireita e cresce conforme a página rola. Dois avisos flutuam ao
 * redor como se o sistema estivesse trabalhando de verdade. O conteúdo é
 * ilustrativo (nomes e valores de exemplo), igual aos mockups da seção seguinte.
 */
export function PalcoProduto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 25%"] })
  const rotacao = useTransform(scrollYProgress, [0, 1], [24, 0])
  const escala = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const subida = useTransform(scrollYProgress, [0, 1], [40, 0])

  return (
    <div ref={ref} className="relative mx-auto mt-16 w-full max-w-5xl px-4 [perspective:1600px] md:mt-20">
      <motion.div
        style={{ rotateX: rotacao, scale: escala, y: subida, transformOrigin: "50% 100%" }}
        className="relative"
      >
        {/* brilho dourado sob o painel */}
        <div
          aria-hidden
          className="absolute -inset-x-10 -bottom-10 top-1/3 -z-10 rounded-[3rem] bg-primary/15 blur-3xl"
        />

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)]">
          {/* barra do navegador */}
          <div className="flex items-center gap-1.5 border-b border-border/60 bg-black/20 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
            <span className="mx-auto rounded-full bg-background/60 px-4 py-1 text-[10px] text-muted-foreground/70">
              kairos.app/painel
            </span>
          </div>

          <div className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[11rem_1fr]">
            {/* menu lateral */}
            <aside className="flex flex-col gap-1 border-r border-border/50 bg-background/40 p-2.5 md:p-4">
              <div className="mb-3 hidden items-center gap-2 px-2 font-serif text-sm tracking-[0.18em] md:flex">
                <ScissorMark className="h-4 w-4 text-primary" /> kairos
              </div>
              <ScissorMark className="mx-auto mb-3 h-5 w-5 text-primary md:hidden" />
              {[
                { icon: CalendarDays, nome: "Agenda", ativo: true },
                { icon: Users, nome: "Equipe" },
                { icon: Scissors, nome: "Serviços" },
                { icon: TrendingUp, nome: "Números" },
              ].map(({ icon: Icon, nome, ativo }) => (
                <span
                  key={nome}
                  className={`flex items-center justify-center gap-2.5 rounded-lg px-2.5 py-2 text-xs md:justify-start ${
                    ativo ? "bg-primary/12 text-primary ring-1 ring-primary/25" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">{nome}</span>
                </span>
              ))}
            </aside>

            {/* conteúdo */}
            <div className="min-w-0 p-4 md:p-6">
              <div className="grid grid-cols-3 gap-2.5 md:gap-4">
                {[
                  { rotulo: "Hoje", valor: 12, sufixo: " cortes" },
                  { rotulo: "Faturamento", valor: 1840, prefixo: "R$ " },
                  { rotulo: "Avaliação", valor: 5, sufixo: ",0", estrela: true },
                ].map((k) => (
                  <div key={k.rotulo} className="rounded-xl border border-border/60 bg-background/40 p-3 md:p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{k.rotulo}</p>
                    <p className="mt-1.5 flex items-center gap-1 font-serif text-lg md:text-2xl">
                      <Contador valor={k.valor} prefixo={k.prefixo} sufixo={k.sufixo} />
                      {k.estrela && <Star className="h-3.5 w-3.5 fill-primary text-primary" />}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-3 md:mt-4 md:grid-cols-[1.5fr_1fr] md:gap-4">
                <div className="rounded-xl border border-border/60 bg-background/40 p-3 md:p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Agenda de hoje</p>
                  <ul className="mt-3 flex flex-col divide-y divide-border/50">
                    {AGENDA.map((a) => (
                      <li key={a.hora} className="flex items-center gap-3 py-2 text-xs">
                        <span className="w-11 font-serif text-sm text-primary">{a.hora}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-foreground">{a.nome}</span>
                          <span className="block truncate text-[11px] text-muted-foreground">{a.servico}</span>
                        </span>
                        <Selo status={a.status} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden rounded-xl border border-border/60 bg-background/40 p-4 md:block">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Semana</p>
                  <div className="mt-4 flex h-28 items-end gap-2">
                    {BARRAS.map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`flex-1 rounded-t-md ${i === 5 ? "bg-primary" : "bg-primary/25"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* avisos flutuantes */}
        <div className="anim-flutuar absolute -left-2 top-24 hidden items-center gap-3 rounded-xl border border-primary/30 bg-background/90 px-4 py-3 shadow-2xl backdrop-blur md:flex lg:-left-10">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Bell className="h-4 w-4" />
          </span>
          <span className="text-xs">
            <span className="block font-medium">Novo agendamento</span>
            <span className="text-muted-foreground">Bruno A. · hoje, 10:30</span>
          </span>
        </div>
        <div
          className="anim-flutuar absolute -right-2 bottom-20 hidden items-center gap-3 rounded-xl border border-primary/30 bg-background/90 px-4 py-3 shadow-2xl backdrop-blur md:flex lg:-right-10"
          style={{ animationDelay: "-2.5s" }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Star className="h-4 w-4 fill-primary" />
          </span>
          <span className="text-xs">
            <span className="block font-medium">Avaliação 5,0</span>
            <span className="text-muted-foreground">&ldquo;Corte perfeito&rdquo;</span>
          </span>
        </div>
      </motion.div>
    </div>
  )
}

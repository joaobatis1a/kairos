"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Link2, CalendarCheck, Users, Bell, Star, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useSemCursor } from "@/components/landing/hooks"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"
import { cn } from "@/lib/utils"

const RECURSOS = [
  {
    icon: Link2,
    titulo: "Link próprio",
    texto: "Endereço exclusivo da sua barbearia, pronto pra colar na bio do Instagram.",
  },
  {
    icon: CalendarCheck,
    titulo: "Horários sob controle",
    texto: "Dias de funcionamento, intervalos e duração de cada serviço.",
  },
  {
    icon: Users,
    titulo: "Equipe organizada",
    texto: "Cadastre barbeiros, ative e desative quem atende na semana.",
  },
  {
    icon: Bell,
    titulo: "Avisos automáticos",
    texto: "Confirmação, lembrete na véspera e agradecimento, sozinhos.",
  },
  {
    icon: Star,
    titulo: "Avaliação após o corte",
    texto: "O cliente avalia; a média fica no seu painel.",
  },
  {
    icon: ShieldCheck,
    titulo: "Cada um no seu lugar",
    texto: "Sem dado trocado entre barbearias diferentes.",
  },
]

function CardRecurso({
  icon: Icon,
  titulo,
  texto,
  indice,
  largo,
}: {
  icon: LucideIcon
  titulo: string
  texto: string
  indice: number
  largo?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const semCursor = useSemCursor()
  const noCentro = useInView(ref, { margin: "-45% 0px -45% 0px" })
  const ativo = semCursor && noCentro

  return (
    <Reveal delay={0.06 * indice} className={largo ? "lg:col-span-2" : undefined}>
      <div
        ref={ref}
        data-ativo={ativo}
        className={cn(
          "group relative flex h-full min-h-56 flex-col justify-between border-2 border-foreground bg-card p-6 transition-all duration-300 md:p-7",
          "hover:-translate-x-1 hover:-translate-y-1 hover:bg-primary hover:shadow-[8px_8px_0_0_var(--foreground)]",
          "data-[ativo=true]:-translate-x-1 data-[ativo=true]:-translate-y-1 data-[ativo=true]:bg-primary data-[ativo=true]:shadow-[8px_8px_0_0_var(--foreground)]",
        )}
      >
        <div className="flex items-start justify-between">
          <Icon
            className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-data-[ativo=true]:rotate-[-8deg] group-data-[ativo=true]:scale-110"
            strokeWidth={1.6}
          />
          <span className="text-xs font-bold tabular-nums text-muted-foreground group-hover:text-primary-foreground group-data-[ativo=true]:text-primary-foreground">
            {String(indice + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-10">
          <h3 className="titulo-gigante text-4xl md:text-5xl">{titulo}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground group-hover:text-primary-foreground/80 group-data-[ativo=true]:text-primary-foreground/80">
            {texto}
          </p>
        </div>
      </div>
    </Reveal>
  )
}

export function RecursosSection() {
  return (
    <section id="recursos" className="tema-claro relative scroll-mt-20 px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[92rem]">
        <Reveal>
          <Eyebrow>Também vem junto</Eyebrow>
        </Reveal>
        <h2 className="titulo-gigante mt-6 text-[clamp(3rem,8vw,8rem)]">
          <TextReveal
            delay={0.1}
            lines={[
              "O resto que",
              <em key="2" className="marca-texto font-accent text-[0.92em] font-semibold normal-case italic tracking-[-0.02em]">
                faz falta.
              </em>,
            ]}
          />
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RECURSOS.map((r, i) => (
            <CardRecurso
              key={r.titulo}
              icon={r.icon}
              titulo={r.titulo}
              texto={r.texto}
              indice={i}
              largo={i === 0 || i === 5}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

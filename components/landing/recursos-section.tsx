"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Link2, CalendarCheck, Users, Bell, Star, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useSemCursor } from "@/components/landing/hooks"
import { Reveal, Eyebrow } from "@/components/landing/reveal"
import { cn } from "@/lib/utils"

const RECURSOS = [
  {
    icon: Link2,
    titulo: "Link próprio",
    texto: "Endereço exclusivo, pronto pra colar na bio do Instagram.",
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
        onPointerMove={(e) => {
          // o brilho segue o cursor via variáveis CSS: sem re-render por movimento
          const r = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
        }}
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-primary/[0.05] p-7 transition-all duration-500",
          "hover:border-primary/40 hover:bg-primary/[0.09] data-[ativo=true]:border-primary/40 data-[ativo=true]:bg-primary/[0.09]",
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--primary) 20%, transparent), transparent 70%)",
          }}
        />
        <Icon
          className="relative h-8 w-8 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 group-data-[ativo=true]:scale-110 group-data-[ativo=true]:-rotate-6"
          strokeWidth={1.5}
        />
        <h3 className="relative mt-5 font-serif text-xl leading-snug">{titulo}</h3>
        <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{texto}</p>
      </div>
    </Reveal>
  )
}

export function RecursosSection() {
  return (
    <section id="recursos" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-28 md:py-36">
      <div className="max-w-xl">
        <Reveal>
          <Eyebrow>Também vem junto</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.02em]">
            O resto que faz falta<span className="texto-dourado">.</span>
          </h2>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {RECURSOS.map((r, i) => (
          <CardRecurso key={r.titulo} icon={r.icon} titulo={r.titulo} texto={r.texto} indice={i} largo={i === 0 || i === 5} />
        ))}
      </div>
    </section>
  )
}

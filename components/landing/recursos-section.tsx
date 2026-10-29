"use client"

import { useRef } from "react"
import { ArrowUpRight, Link2, CalendarCheck, Users, Bell, Star, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"

const RECURSOS: { icon: LucideIcon; titulo: string; texto: string }[] = [
  { icon: Link2, titulo: "Link próprio", texto: "Endereço exclusivo da sua barbearia, pronto pra colar na bio do Instagram." },
  { icon: CalendarCheck, titulo: "Horários sob controle", texto: "Dias de funcionamento, intervalos e duração de cada serviço." },
  { icon: Users, titulo: "Equipe organizada", texto: "Cadastre barbeiros, ative e desative quem atende na semana." },
  { icon: Bell, titulo: "Avisos automáticos", texto: "Confirmação, lembrete na véspera e agradecimento, sozinhos." },
  { icon: Star, titulo: "Avaliação após o corte", texto: "O cliente avalia; a média fica no seu painel." },
  { icon: ShieldCheck, titulo: "Cada um no seu lugar", texto: "Sem dado trocado entre barbearias diferentes." },
]

/**
 * Linha da lista: título grande e fino; no hover a linha desliza, o título
 * vira ouro e a descrição abre. No celular (sem hover) a descrição já vem
 * aberta, então nada fica escondido.
 */
function Linha({ r, indice }: { r: (typeof RECURSOS)[number]; indice: number }) {
  const Icon = r.icon
  return (
    <Reveal delay={0.05 * indice}>
      <div className="group relative border-b border-foreground/15 py-6 md:py-8">
        <div className="flex items-center gap-5 md:gap-10">
          <span className="w-8 shrink-0 text-xs tabular-nums text-muted-foreground">{String(indice + 1).padStart(2, "0")}</span>
          <h3 className="titulo-fino flex-1 text-[clamp(1.8rem,4.2vw,4rem)] transition-all duration-500 group-hover:translate-x-3 group-hover:text-primary">
            {r.titulo}
          </h3>
          <Icon className="hidden h-6 w-6 shrink-0 text-muted-foreground transition-colors duration-300 group-hover:text-primary md:block" strokeWidth={1.4} />
          <ArrowUpRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
        {/* descrição: aberta por padrão no celular, abre no hover no desktop */}
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="max-w-lg pl-[3.25rem] pt-3 text-sm leading-relaxed text-muted-foreground md:pl-[5.5rem] md:pt-4 md:text-base">
              {r.texto}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export function RecursosSection() {
  const ref = useRef<HTMLElement>(null)

  /** A luz dourada acompanha o cursor pela seção (variáveis CSS, sem re-render). */
  const aoMover = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }

  return (
    <section
      id="recursos"
      ref={ref}
      onPointerMove={aoMover}
      className="tema-claro relative scroll-mt-20 overflow-hidden px-5 py-28 md:px-8 md:py-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 70%) var(--my, 20%), rgb(201 162 75 / 0.14), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[92rem]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <Eyebrow>Também vem junto</Eyebrow>
            </Reveal>
            <h2 className="titulo-fino mt-8 text-[clamp(2.8rem,7vw,7rem)]">
              <TextReveal
                delay={0.1}
                lines={[
                  "O resto que",
                  <em key="2" className="font-accent font-medium italic text-primary">
                    faz falta.
                  </em>,
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.2} className="md:col-span-4">
            <p className="max-w-xs text-base leading-relaxed text-muted-foreground md:ml-auto">
              Tudo que uma barbearia precisa pra funcionar sem você ficar de olho no celular.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 border-t border-foreground/15 md:mt-24">
          {RECURSOS.map((r, i) => (
            <Linha key={r.titulo} r={r} indice={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

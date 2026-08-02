"use client"

import { CalendarCheck, Users, Star, Bell, Link2, ShieldCheck } from "lucide-react"
import { CelulaRecurso } from "@/components/landing/card-recurso"
import { Reveal, Eyebrow } from "@/components/landing/reveal"

const RECURSOS = [
  {
    icon: Link2,
    titulo: "Link próprio",
    texto: "Sua barbearia com endereço exclusivo, pronto pra colar na bio do Instagram.",
  },
  {
    icon: CalendarCheck,
    titulo: "Horários sob controle",
    texto: "Você define dias de funcionamento, intervalos e a duração de cada serviço.",
  },
  {
    icon: Users,
    titulo: "Equipe organizada",
    texto: "Cadastre barbeiros, ative e desative quem está atendendo na semana.",
  },
  {
    icon: Bell,
    titulo: "Avisos automáticos",
    texto: "Confirmação, lembrete na véspera e agradecimento saem sem você lembrar.",
  },
  {
    icon: Star,
    titulo: "Avaliação após o corte",
    texto: "O cliente avalia o serviço e o profissional; a média fica no seu painel.",
  },
  {
    icon: ShieldCheck,
    titulo: "Cada um no seu lugar",
    texto: "Dono vê tudo, barbeiro vê a própria agenda. Sem dado trocado entre barbearias.",
  },
]

export function RecursosSection() {
  return (
    <section id="recursos" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-28 md:py-36">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <Eyebrow>Também vem junto</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-tight tracking-[-0.02em]">
              O resto que faz falta<span className="texto-dourado">.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.16}>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Detalhes pequenos que somem da sua cabeça e passam a acontecer sozinhos.
          </p>
        </Reveal>
      </div>

      {/* -mr-px + overflow-hidden apara a borda direita da última coluna,
          então a grade fecha certo em 1, 2 ou 3 colunas sem regra de nth-child */}
      <div
        className="relative -mr-px mt-16 grid grid-cols-1 overflow-hidden border-t border-border/60 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* foco de luz que acompanha o cursor por trás das células (que são
            transparentes), acendendo o card sob o mouse e os vizinhos */}

        {RECURSOS.map((r, i) => (
          <CelulaRecurso key={r.titulo} icon={r.icon} titulo={r.titulo} texto={r.texto} indice={i} />
        ))}
      </div>
    </section>
  )
}

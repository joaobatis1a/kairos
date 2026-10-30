"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { KairosMark } from "@/components/kairos-mark"
import { Revelar } from "@/components/landing/revelar"

const PASSOS = [
  { titulo: "Você fala com a gente", texto: "Conta como a barbearia funciona hoje: serviços, equipe e horários." },
  { titulo: "A gente monta a casa", texto: "Sua barbearia entra no kairos já configurada, com link próprio." },
  { titulo: "Você recebe a chave", texto: "Um código de convite libera o painel como dono da barbearia." },
  { titulo: "A agenda abre", texto: "A equipe entra, o link vai pra bio e os clientes começam a marcar." },
]

/** Inclinação de cada comanda quando ainda está "jogada" no balcão. */
const GIRO = [-7, 4, -3, 6]

/**
 * Uma comanda de papel: picotada em cima e embaixo, numerada, com a marca
 * carimbada. Chega inclinada e se endireita conforme a seção rola.
 */
function Comanda({ p, i, progresso }: { p: (typeof PASSOS)[number]; i: number; progresso: MotionValue<number> }) {
  const ini = i * 0.12
  const rotate = useTransform(progresso, [ini, ini + 0.45], [GIRO[i], 0])
  const y = useTransform(progresso, [ini, ini + 0.45], [60, 0])

  return (
    <motion.article
      style={{ rotate, y }}
      className="kairos-osso picote relative flex min-h-[19rem] flex-col justify-between px-6 py-9 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] transition-transform duration-300 hover:-translate-y-2"
    >
      <div className="flex items-start justify-between">
        <p className="letreiro text-[11px] text-muted-foreground">Comanda</p>
        <p className="titulo text-4xl text-primary">Nº {String(i + 1).padStart(2, "0")}</p>
      </div>
      <div>
        <div className="mb-5 border-t border-dashed border-foreground/25" />
        <h3 className="titulo text-[1.9rem] leading-[1.05]">{p.titulo}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
      </div>
      {/* carimbo */}
      <KairosMark className="absolute bottom-7 right-6 h-9 w-9 -rotate-12 text-primary/25" />
    </motion.article>
  )
}

export function Comandas() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "center 55%"] })

  return (
    <section id="como-comeca" className="kairos-noite relative scroll-mt-16 overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgb(212_170_85/0.1),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[90rem]">
        <Revelar className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="letreiro flex items-center gap-3 text-[11px] text-primary md:text-xs">
              <span className="h-px w-8 bg-primary" />
              Como começa
            </p>
            <h2 className="titulo mt-6 text-[clamp(2.6rem,5.4vw,5.2rem)]">
              Do primeiro contato <em className="ouro-folha pr-1 italic">à cadeira cheia.</em>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground lg:col-span-4 lg:ml-auto">
            Não tem cadastro solto no site: a gente monta a sua barbearia junto com você, do jeito que ela já funciona.
          </p>
        </Revelar>

        <div ref={ref} className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-24 lg:grid-cols-4 lg:gap-6">
          {PASSOS.map((p, i) => (
            <Comanda key={p.titulo} p={p} i={i} progresso={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Mail, ArrowRight, Clock3, Wrench, MonitorSmartphone } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"
import { Magnetico } from "@/components/landing/magnetico"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"
import { cn } from "@/lib/utils"

const GARANTIAS = [
  {
    icon: Clock3,
    titulo: "Resposta no mesmo dia",
    texto: "Você manda a mensagem e a gente retorna em até um dia útil.",
    giro: "-3deg",
  },
  {
    icon: Wrench,
    titulo: "A gente configura",
    texto: "Serviços, horários e equipe entram prontos. Você não monta nada sozinho.",
    giro: "2deg",
  },
  {
    icon: MonitorSmartphone,
    titulo: "Nada pra instalar",
    texto: "Funciona no navegador, no celular do cliente e no computador da loja.",
    giro: "-2deg",
  },
]

/** Selo (carimbo) de garantia — o círculo tracejado e o leve giro imitam um
 * carimbo de borracha batido à mão, no lugar do card com ícone genérico. */
function SeloGarantia({
  icon: Icon,
  titulo,
  texto,
  giro,
}: {
  icon: LucideIcon
  titulo: string
  texto: string
  giro: string
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 text-center">
      <div
        style={{ transform: `rotate(${giro})` }}
        className={cn(
          "flex h-24 w-24 shrink-0 items-center justify-center rounded-full",
          "border-[1.5px] border-dashed border-primary/50 text-primary",
        )}
      >
        <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden />
      </div>
      <div>
        <h3 className="font-serif text-base">{titulo}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{texto}</p>
      </div>
    </div>
  )
}

export function FinalCtaSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const fotoY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])


  return (
    <section id="contato" ref={ref} className="relative scroll-mt-20 overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          style={{ y: fotoY }}
          src="/images/hero-barbearia.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-[124%] w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="kairos-grain absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-32 md:py-40">
        <div className="text-center">
          <Reveal>
            <Eyebrow>A cadeira está livre</Eyebrow>
          </Reveal>

          <h2 className="mt-7 font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            <TextReveal delay={0.1} lines={["Vamos colocar sua", <em key="2" className="texto-dourado font-accent italic">barbearia no kairos?</em>]} />
          </h2>

          <Reveal delay={0.28}>
            <p className="mx-auto mt-7 max-w-md leading-relaxed text-muted-foreground">
              Conte da sua barbearia no e-mail. Já deixamos o roteiro pronto pra você só preencher,
              e devolvemos o acesso configurado.
            </p>
          </Reveal>
        </div>

        {/* o que esperar depois de enviar, antes do botão */}
        <Reveal delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
            {GARANTIAS.map((g) => (
              <SeloGarantia key={g.titulo} icon={g.icon} titulo={g.titulo} texto={g.texto} giro={g.giro} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col items-center gap-5">
            <Magnetico forca={0.35}>
              <Button
                size="lg"
                asChild
                className="h-13 rounded-full px-8 text-base font-bold"
              >
                <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
                  <Mail className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
                  Falar com a gente
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </Magnetico>

            <p className="text-xs text-muted-foreground/70">
              Sem cadastro automático e sem cobrança nenhuma pra conversar.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

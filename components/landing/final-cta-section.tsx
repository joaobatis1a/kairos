"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"
import { Magnetico } from "@/components/landing/magnetico"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"
import { ScissorMark } from "@/components/scissor-mark"

export function FinalCtaSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const fotoY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section id="contato" ref={ref} className="relative scroll-mt-20 overflow-hidden px-6 py-28 md:py-36">
      <div className="absolute inset-0">
        <motion.img
          style={{ y: fotoY }}
          src="/images/hero-barbearia.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-[124%] w-full object-cover object-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background" />
        <div className="kairos-grain absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-xl rounded-3xl border border-primary/20 bg-background/70 px-8 py-14 text-center shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm md:px-14 md:py-16">
        <Reveal>
          <ScissorMark className="mx-auto h-8 w-8 text-primary/70" />
        </Reveal>

        <Reveal delay={0.1}>
          <Eyebrow className="mt-6 inline-block">A cadeira está livre</Eyebrow>
        </Reveal>

        <h2 className="mt-5 font-serif text-[clamp(1.9rem,4.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          <TextReveal delay={0.15} lines={["Vamos colocar sua", <em key="2" className="texto-dourado font-accent italic">barbearia no kairos?</em>]} />
        </h2>

        <Reveal delay={0.32}>
          <p className="mx-auto mt-6 max-w-sm leading-relaxed text-muted-foreground">
            Conte da sua barbearia no e-mail. Devolvemos o acesso já configurado.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Magnetico forca={0.3}>
              <Button size="lg" asChild className="h-13 rounded-full px-8 text-base font-bold">
                <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
                  <Mail className="h-4 w-4" />
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

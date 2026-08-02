"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Mail, ArrowRight, Clock3, Wrench, MonitorSmartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LINK_CONTATO } from "@/components/landing/contato"
import { CelulaRecurso } from "@/components/landing/card-recurso"
import { Magnetico } from "@/components/landing/magnetico"
import { Reveal, TextReveal, Eyebrow } from "@/components/landing/reveal"

const GARANTIAS = [
  {
    icon: Clock3,
    titulo: "Resposta no mesmo dia",
    texto: "Você manda a mensagem e a gente retorna em até um dia útil.",
  },
  {
    icon: Wrench,
    titulo: "A gente configura",
    texto: "Serviços, horários e equipe entram prontos. Você não monta nada sozinho.",
  },
  {
    icon: MonitorSmartphone,
    titulo: "Nada pra instalar",
    texto: "Funciona no navegador, no celular do cliente e no computador da loja.",
  },
]

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
            <TextReveal delay={0.1} lines={["Vamos colocar sua", <em key="2" className="italic text-primary">barbearia no kairos?</em>]} />
          </h2>

          <Reveal delay={0.28}>
            <p className="mx-auto mt-7 max-w-md leading-relaxed text-muted-foreground">
              Conte da sua barbearia no e-mail. Já deixamos o roteiro pronto pra você só preencher,
              e devolvemos o acesso configurado.
            </p>
          </Reveal>
        </div>

        {/* o que esperar depois de enviar, antes do botão */}
        <div
                className="relative -mr-px mt-16 grid grid-cols-1 overflow-hidden border-y border-border/60 sm:grid-cols-3"
        >

          {GARANTIAS.map((g, i) => (
            <CelulaRecurso
              key={g.titulo}
              icon={g.icon}
              titulo={g.titulo}
              texto={g.texto}
              indice={i}
              className="text-left last:border-b-0 sm:border-b-0"
            />
          ))}
        </div>

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

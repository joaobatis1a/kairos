"use client"

import { useEffect, useRef, useState } from "react"
import { BotaoOuro } from "@/components/landing/botoes"

/**
 * Fechamento: a placa "ABERTO" pendurada na porta, em neon dourado. Ela
 * começa apagada e acende (com a piscada de lâmpada esquentando) quando
 * entra na tela. Sem JS ou com movimento reduzido, já aparece acesa.
 */
export function Aberto() {
  const ref = useRef<HTMLDivElement>(null)
  const [aceso, setAceso] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return
    setAceso(false)
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAceso(true)
          obs.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="contato" className="kairos-noite relative isolate scroll-mt-16 overflow-hidden px-5 pb-28 pt-10 md:px-10 md:pb-40">
      {/* o brilho do neon na parede */}
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-24 -z-10 h-[30rem] w-[min(60rem,120vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(212_170_85/0.22),transparent)] transition-opacity duration-1000 ${aceso ? "opacity-100" : "opacity-0"}`}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* correntinhas e a placa */}
        <div ref={ref} className="balanco flex flex-col items-center" style={{ animationDuration: "9s" }}>
          <div className="flex w-[min(78vw,30rem)] justify-between px-10" aria-hidden>
            <span className="h-16 w-px bg-gradient-to-b from-transparent to-[#d4aa55]/60 md:h-24" />
            <span className="h-16 w-px bg-gradient-to-b from-transparent to-[#d4aa55]/60 md:h-24" />
          </div>
          <div className="relative w-[min(78vw,30rem)] rounded-2xl border border-[#d4aa55]/50 bg-[#0e0c0a] px-6 py-8 shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)] md:py-10">
            <p
              className={`letreiro text-[clamp(2.6rem,9vw,5rem)] leading-none tracking-[0.2em] ${aceso ? "neon" : "neon-apagado"}`}
            >
              Aberto
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#efe6d2]/45">Agenda 24 horas</p>
          </div>
        </div>

        <h2 className="titulo mt-20 text-[clamp(2.6rem,6vw,5.8rem)]">
          A cadeira está livre.
          <br />
          <em className="ouro-folha pr-1 italic">Vamos abrir a sua agenda?</em>
        </h2>
        <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
          Conta da sua barbearia por e-mail. A gente devolve o acesso já configurado, e conversar não custa nada.
        </p>
        <div className="mt-10">
          <BotaoOuro grande>Quero o kairos na minha barbearia</BotaoOuro>
        </div>
      </div>
    </section>
  )
}

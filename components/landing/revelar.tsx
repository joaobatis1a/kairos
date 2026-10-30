"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Entrada ao rolar. O estado base é VISÍVEL (HTML do servidor, sem JS e com
 * movimento reduzido): só depois de montar, e só se o bloco estiver abaixo
 * da dobra, ele é escondido e volta a aparecer ao entrar na tela.
 */
export function Revelar({
  children,
  className,
  atraso = 0,
}: {
  children: React.ReactNode
  className?: string
  atraso?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [estado, setEstado] = useState<"visivel" | "oculto" | "entrou">("visivel")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return

    setEstado("oculto")
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEstado("entrou")
          obs.disconnect()
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        className,
        estado === "oculto" && "translate-y-6 opacity-0",
        estado !== "visivel" && "transition-[opacity,transform] duration-700 ease-out",
      )}
      style={estado === "entrou" && atraso ? { transitionDelay: `${atraso}s` } : undefined}
    >
      {children}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Detecta aparelho sem cursor (toque), onde nenhum efeito de hover acontece. */
export function useSemCursor() {
  const [semCursor, setSemCursor] = useState(false)

  useEffect(() => {
    const consulta = window.matchMedia("(hover: none)")
    const atualizar = () => setSemCursor(consulta.matches)
    atualizar()
    consulta.addEventListener("change", atualizar)
    return () => consulta.removeEventListener("change", atualizar)
  }, [])

  return semCursor
}

/**
 * Célula de card usada em "Recursos" e no contato.
 *
 * No desktop os destaques vêm do hover. No celular, onde hover não existe,
 * o mesmo estado é ligado quando o card cruza o meio da tela — assim o
 * brilho vai caminhando de card em card conforme a pessoa rola.
 */
export function CelulaRecurso({
  icon: Icon,
  titulo,
  texto,
  indice,
  className,
}: {
  icon: LucideIcon
  titulo: string
  texto: string
  indice: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const semCursor = useSemCursor()
  const noCentro = useInView(ref, { margin: "-45% 0px -45% 0px" })
  const ativo = semCursor && noCentro

  return (
    <div
      ref={ref}
      data-ativo={ativo}
      className={cn("revelar group relative border-b border-r border-border/60 p-7", className)}
    >
      {/* no toque, substitui o foco de luz que no desktop segue o cursor */}
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-data-[ativo=true]:opacity-100">
        <span className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.09] blur-3xl" />
      </span>

      <motion.div
        animate={ativo ? { y: -4 } : { y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div className="relative inline-flex">
          <span className="absolute -inset-2 rounded-full bg-primary/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 group-data-[ativo=true]:opacity-100" />
          <Icon className="relative h-5 w-5 text-primary/70 transition-all duration-500 group-hover:scale-110 group-hover:text-primary group-data-[ativo=true]:scale-110 group-data-[ativo=true]:text-primary" />
        </div>
        <h3 className="texto-dourado-interativo mt-5 font-serif text-lg">
          {titulo}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{texto}</p>
      </motion.div>
    </div>
  )
}

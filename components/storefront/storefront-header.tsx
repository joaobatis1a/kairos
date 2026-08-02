"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion"
import { CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MenuConta } from "@/components/conta/menu-conta"
import { Magnetico } from "@/components/landing/magnetico"
import { cn } from "@/lib/utils"
import type { Cliente } from "@/lib/types"

const LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#equipe", label: "Quem corta" },
  { href: "#contato", label: "Contato" },
]

export function StorefrontHeader({
  nome,
  cliente,
  isEquipe,
  onAgendar,
}: {
  nome: string
  cliente: Cliente | null
  isEquipe: boolean
  onAgendar: () => void
}) {
  const { scrollY } = useScroll()
  const [solido, setSolido] = useState(false)
  const [aberto, setAberto] = useState(false)

  useMotionValueEvent(scrollY, "change", (y) => setSolido(y > 40))

  useEffect(() => {
    setSolido(window.scrollY > 40)
  }, [])

  useEffect(() => {
    if (!aberto) return
    document.body.style.overflow = "hidden"
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false)
    window.addEventListener("keydown", aoTeclar)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", aoTeclar)
    }
  }, [aberto])

  function irPara(e: React.MouseEvent, href: string) {
    e.preventDefault()
    setAberto(false)
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 120)
  }

  function agendarMobile() {
    setAberto(false)
    setTimeout(onAgendar, 120)
  }

  return (
    <>
      {/* entrada em CSS: com framer-motion partindo de opacity:0 a navegação
          do site inteiro sumia se a animação não rodasse */}
      <header
        className={cn(
          "surgir fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          solido && !aberto
            ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-6">
          <a href="#top" className="min-w-0 truncate font-serif text-lg tracking-wide">
            {nome}
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onAgendar}
              className="cta-dourado hidden h-9 rounded-full font-bold md:inline-flex"
            >
              <CalendarCheck className="h-4 w-4" />
              Agendar
            </Button>
            <div className="hidden sm:block">
              <MenuConta cliente={cliente} isEquipe={isEquipe} />
            </div>

            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={aberto}
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:hidden"
            >
              <span className="relative block h-3 w-6">
                <motion.span
                  animate={{ rotate: aberto ? 45 : 0, y: aberto ? 6 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-0 block h-px w-full bg-foreground"
                />
                <motion.span
                  animate={{ rotate: aberto ? -45 : 0, y: aberto ? -5 : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-0 left-0 block h-px w-full bg-foreground"
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-background/97 pt-[72px] backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => irPara(e, l.href)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97, x: 6 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-baseline gap-4 border-b border-border/50 py-5 active:text-primary"
                >
                  <span className="font-serif text-xs tracking-[0.3em] text-primary/40">0{i + 1}</span>
                  <span className="texto-dourado-interativo font-serif text-3xl">
                    {l.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 px-8 pb-12"
            >
              <Button onClick={agendarMobile} size="lg" className="cta-dourado h-12 rounded-full text-base font-bold">
                <CalendarCheck className="h-4 w-4" /> Agendar horário
              </Button>
              <div className="flex justify-center sm:hidden">
                <MenuConta cliente={cliente} isEquipe={isEquipe} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

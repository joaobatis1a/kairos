"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarCheck, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MenuConta } from "@/components/conta/menu-conta"
import { Magnetico } from "@/components/landing/magnetico"
import { cn } from "@/lib/utils"
import type { Cliente } from "@/lib/types"

const LINKS_BASE = [
  { href: "#servicos", label: "Serviços" },
  { href: "#equipe", label: "Quem corta" },
  { href: "#contato", label: "Contato" },
]

/** Mesmo tratamento de "ilhas" flutuantes da landing de vendas — cápsulas
 * separadas em vez de uma barra única. Aqui é o site da barbearia de
 * verdade (onde cliente agenda e a equipe também navega), então faz
 * sentido carregar a mesma identidade visual. */
const ILHA = "rounded-full border border-border/50 bg-background/70 backdrop-blur-xl"

export function StorefrontHeader({
  nome,
  logoUrl,
  cliente,
  isEquipe,
  temProdutos = false,
  onAgendar,
}: {
  nome: string
  logoUrl?: string
  cliente: Cliente | null
  isEquipe: boolean
  temProdutos?: boolean
  onAgendar: () => void
}) {
  const [aberto, setAberto] = useState(false)

  const LINKS = temProdutos
    ? [...LINKS_BASE.slice(0, 1), { href: "#produtos", label: "Produtos" }, ...LINKS_BASE.slice(1)]
    : LINKS_BASE

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
          do site inteiro sumia se a animação não rodasse. position:relative
          (não fixed) de propósito — o wrapper pai (sticky, em
          landing-page.tsx) já cuida de fixar no topo do scroll, e assim o
          header continua empilhando corretamente abaixo do banner de modo
          demo quando ele existe. */}
      <header className="surgir relative z-50 flex items-center justify-center gap-2.5 px-4 py-4 sm:gap-3">
        {/* ilha 1: marca */}
        <a
          href="#top"
          className={cn(
            ILHA,
            "flex min-w-0 shrink items-center gap-2 px-4 py-2.5 font-serif text-base tracking-wide transition-colors hover:bg-background/90",
          )}
        >
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-6 w-6 shrink-0 rounded-md object-cover" />
          )}
          <span className="truncate">{nome}</span>
        </a>

        {/* ilha 2: navegação — só desktop */}
        <nav className={cn(ILHA, "hidden items-center gap-1 px-2 py-2 md:flex")}>
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

        {/* ilha 3: ações — só desktop */}
        <div className={cn(ILHA, "hidden items-center gap-1.5 py-1.5 pl-1.5 pr-1.5 md:flex")}>
          <MenuConta cliente={cliente} isEquipe={isEquipe} />
          <Magnetico forca={0.2}>
            <Button size="sm" onClick={onAgendar} className="cta-dourado h-9 rounded-full font-bold">
              <CalendarCheck className="h-4 w-4" />
              Agendar
            </Button>
          </Magnetico>
        </div>

        {/* ilha do hambúrguer — só mobile */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          className={cn(ILHA, "flex h-11 w-11 shrink-0 items-center justify-center md:hidden")}
        >
          {aberto ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </header>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-background/97 pt-24 backdrop-blur-xl md:hidden"
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
              <div className="flex justify-center">
                <MenuConta cliente={cliente} isEquipe={isEquipe} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

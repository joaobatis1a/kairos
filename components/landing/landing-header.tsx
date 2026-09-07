"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Mail, ArrowUpRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetico } from "@/components/landing/magnetico"
import { LINK_CONTATO } from "@/components/landing/contato"
import { ScissorMark } from "@/components/scissor-mark"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "#sistema", label: "O sistema" },
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#contato", label: "Contato" },
]

/** Classe compartilhada por cada "ilha" flutuante (logo, nav, ações) —
 * mesmo tratamento visual, cápsulas separadas em vez de uma barra única. */
const ILHA = "rounded-full border border-border/50 bg-background/65 backdrop-blur-xl"

export function LandingHeader() {
  const [ativo, setAtivo] = useState<string | null>(null)
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    // marca como ativa a seção que estiver cruzando o meio da tela
    const secoes = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[]
    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.find((e) => e.isIntersecting)
        if (visivel) setAtivo(`#${visivel.target.id}`)
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    secoes.forEach((s) => observador.observe(s))
    return () => observador.disconnect()
  }, [])

  // trava a rolagem do fundo e permite fechar com Esc enquanto o menu está aberto
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

  /** Fecha o menu antes de rolar: com a rolagem travada o salto do link não funcionaria. */
  function irPara(e: React.MouseEvent, href: string) {
    e.preventDefault()
    setAberto(false)
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 120)
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex items-center justify-center gap-2.5 px-4 sm:gap-3"
      >
        {/* ilha 1: marca */}
        <Link
          href="/"
          className={cn(
            ILHA,
            "flex shrink-0 items-center gap-2 px-4 py-2.5 font-serif text-base tracking-[0.16em] transition-colors hover:bg-background/85 sm:px-5",
          )}
        >
          <ScissorMark className="h-4.5 w-4.5 shrink-0 text-primary" />
          kairos
        </Link>

        {/* ilha 2: navegação — só desktop */}
        <nav className={cn(ILHA, "hidden items-center gap-1 px-2 py-2 md:flex")}>
          {LINKS.map((l) => {
            const estaAtivo = ativo === l.href
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "group relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
                  estaAtivo ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* pastilha que desliza entre os itens ao trocar de seção */}
                {estaAtivo && (
                  <motion.span
                    layoutId="nav-ativo"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-primary/12 ring-1 ring-primary/25"
                  />
                )}
                {/* traço que cresce a partir do centro no hover dos itens ainda não ativos */}
                {!estaAtivo && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 -bottom-0.5 h-px origin-center scale-x-0 bg-primary/50 transition-transform duration-300 group-hover:scale-x-100"
                  />
                )}
                {l.label}
              </a>
            )
          })}
        </nav>

        {/* ilha 3: ações — só desktop (Entrar fica dentro dela, sem cápsula própria) */}
        <div className={cn(ILHA, "hidden items-center gap-1 py-1.5 pl-1.5 pr-1.5 md:flex")}>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <Link href="/auth/login">Entrar</Link>
          </Button>

          <Magnetico forca={0.2}>
            <Button size="sm" asChild className="h-9 rounded-full font-bold">
              <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
                <Mail className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-12" />
                Falar com a gente
              </a>
            </Button>
          </Magnetico>
        </div>

        {/* ilha do CTA compacta — só mobile: a ação principal fica a um toque,
            sem precisar abrir o menu inteiro só pra falar com a gente */}
        <a
          href={LINK_CONTATO}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a gente"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_6px_20px_-6px_var(--primary)] md:hidden"
        >
          <Mail className="h-4.5 w-4.5" />
        </a>

        {/* ilha do hambúrguer — só mobile, cápsula própria como as outras */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          className={cn(ILHA, "flex h-11 w-11 shrink-0 items-center justify-center md:hidden")}
        >
          {aberto ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </motion.header>

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
                  <ScissorMark className="h-4 w-4 shrink-0 self-center text-primary/40" />
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
              <Button asChild size="lg" className="h-12 rounded-full text-base font-bold">
                <a href={LINK_CONTATO} target="_blank" rel="noopener noreferrer">
                  <Mail className="h-4 w-4" /> Falar com a gente
                </a>
              </Button>
              <Link
                href="/auth/login"
                onClick={() => setAberto(false)}
                className="group inline-flex items-center justify-center gap-1.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Área da equipe
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { KairosMark } from "@/components/kairos-mark"
import { BotaoOuro } from "@/components/landing/botoes"
import { LINK_CONTATO } from "@/components/landing/contato"
import { cn } from "@/lib/utils"

const ITENS = [
  { href: "#o-nome", rotulo: "O nome" },
  { href: "#por-dentro", rotulo: "Por dentro" },
  { href: "#tabela", rotulo: "Tabela da casa" },
  { href: "#como-comeca", rotulo: "Como começa" },
  { href: "#perguntas", rotulo: "Perguntas" },
]

/**
 * Cabeçalho: transparente no topo, vira vidro preto ao rolar. No celular o
 * menu abre em tela cheia, com os itens em letra grande.
 */
export function Cabecalho() {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40)
    aoRolar()
    window.addEventListener("scroll", aoRolar, { passive: true })
    return () => window.removeEventListener("scroll", aoRolar)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = aberto ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [aberto])

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          rolou ? "border-b border-[#efe6d2]/10 bg-[#0b0a09]/75 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <a href="#topo" className="flex items-center gap-3" aria-label="kairos, voltar ao início">
            <KairosMark className="h-9 w-9 text-[#d4aa55] md:h-10 md:w-10" />
            <span className="letreiro ouro-folha text-[15px] md:text-base">Kairos</span>
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
            {ITENS.map((i) => (
              <a
                key={i.href}
                href={i.href}
                className="group relative py-1 text-[12px] uppercase tracking-[0.2em] text-[#efe6d2]/70 transition-colors hover:text-[#efe6d2]"
              >
                {i.rotulo}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-[#d4aa55] transition-transform duration-500 group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <BotaoOuro>Quero o kairos</BotaoOuro>
            </div>
            <button
              type="button"
              onClick={() => setAberto(true)}
              aria-label="Abrir menu"
              aria-expanded={aberto}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#efe6d2]/20 text-[#efe6d2] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* menu do celular */}
      <div
        className={cn(
          "kairos-noite fixed inset-0 z-[60] flex flex-col px-6 pb-10 pt-5 transition-[opacity,visibility] duration-500 lg:hidden",
          aberto ? "visible opacity-100" : "invisible opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-3">
            <KairosMark className="h-9 w-9 text-primary" />
            <span className="letreiro ouro-folha text-[15px]">Kairos</span>
          </span>
          <button
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="meandro mt-6" aria-hidden />
        <nav aria-label="Menu" className="mt-8 flex flex-col">
          {ITENS.map((i, n) => (
            <a
              key={i.href}
              href={i.href}
              onClick={() => setAberto(false)}
              className={cn(
                "titulo flex items-baseline gap-4 border-b border-border py-4 text-4xl transition-[opacity,transform] duration-500",
                aberto ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
              style={{ transitionDelay: aberto ? `${0.08 + n * 0.05}s` : "0s" }}
            >
              <span className="font-sans text-xs tabular-nums text-primary">{String(n + 1).padStart(2, "0")}</span>
              {i.rotulo}
            </a>
          ))}
        </nav>
        <a
          href={LINK_CONTATO}
          target="_blank"
          rel="noopener noreferrer"
          className="fundo-ouro mt-auto rounded-full py-4 text-center font-medium tracking-wide"
        >
          Quero o kairos na minha barbearia
        </a>
      </div>
    </>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const SORTEIO = "ABCDEFGHIJKLMNOPRSTUVZ0123456789"

/**
 * Uma palheta do quadro. Quando o caractere muda, ela passa por alguns
 * caracteres sorteados antes de parar no certo, como um quadro de verdade:
 * a metade de cima cai (palheta-cai) e a de baixo sobe com a letra nova
 * (palheta-sobe). No servidor e com movimento reduzido, mostra direto.
 */
function Palheta({ alvo, atraso = 0 }: { alvo: string; atraso?: number }) {
  const [par, setPar] = useState({ de: alvo, para: alvo, giro: 0 })
  const mostrado = useRef(alvo)

  useEffect(() => {
    if (alvo === mostrado.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      mostrado.current = alvo
      setPar((p) => ({ de: alvo, para: alvo, giro: p.giro + 1 }))
      return
    }
    const voltas = 2 + Math.floor(Math.random() * 3)
    const fila = [
      ...Array.from({ length: voltas }, () => SORTEIO[Math.floor(Math.random() * SORTEIO.length)]),
      alvo,
    ]
    const timers: ReturnType<typeof setTimeout>[] = []
    fila.forEach((c, i) => {
      timers.push(
        setTimeout(() => {
          setPar((p) => ({ de: mostrado.current, para: c, giro: p.giro + 1 }))
          mostrado.current = c
        }, atraso + i * 150),
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [alvo, atraso])

  const meia = "absolute inset-x-0 h-1/2 overflow-hidden bg-[#16130f]"
  const letra = "absolute inset-x-0 h-[200%] text-center leading-[1.7em]"
  const animando = par.giro > 0 && par.de !== par.para

  return (
    <span className="relative inline-block h-[1.7em] w-[1.12em] rounded-[3px] [perspective:300px]" aria-hidden>
      {/* metade de cima: já a letra nova */}
      <span className={cn(meia, "top-0 rounded-t-[3px]")}>
        <span className={cn(letra, "top-0")}>{par.para}</span>
      </span>
      {/* metade de baixo: ainda a letra velha, até a palheta cobrir */}
      <span className={cn(meia, "bottom-0 rounded-b-[3px] bg-[#13100d]")}>
        <span className={cn(letra, "bottom-0")}>{animando ? par.de : par.para}</span>
      </span>
      {animando && (
        <>
          <span key={`c${par.giro}`} className={cn(meia, "palheta-cai top-0 z-10 rounded-t-[3px]")}>
            <span className={cn(letra, "top-0")}>{par.de}</span>
          </span>
          <span key={`s${par.giro}`} className={cn(meia, "palheta-sobe bottom-0 z-10 rounded-b-[3px] bg-[#13100d]")}>
            <span className={cn(letra, "bottom-0")}>{par.para}</span>
          </span>
        </>
      )}
      {/* o vão entre as metades */}
      <span className="absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-black/80" />
    </span>
  )
}

function Campo({ texto, largura, atraso = 0 }: { texto: string; largura: number; atraso?: number }) {
  const cheio = texto.toUpperCase().padEnd(largura, " ").slice(0, largura)
  return (
    <span className="inline-flex gap-[2px]" aria-label={texto.trim()}>
      {cheio.split("").map((c, i) => (
        <Palheta key={i} alvo={c} atraso={atraso + i * 28} />
      ))}
    </span>
  )
}

type Linha = { hora: string; nome: string; servico: string; status: "ok" | "novo" | "livre" }

const DIA: Linha[][] = [
  [
    { hora: "09:00", nome: "Rafael M", servico: "Corte+barba", status: "ok" },
    { hora: "10:30", nome: "Bruno A", servico: "Degrade", status: "ok" },
    { hora: "11:30", nome: "Thiago L", servico: "Barba", status: "ok" },
    { hora: "14:00", nome: "Diego S", servico: "Corte", status: "novo" },
  ],
  [
    { hora: "14:30", nome: "Lucas P", servico: "Pigmentacao", status: "ok" },
    { hora: "15:00", nome: "Andre R", servico: "Corte", status: "ok" },
    { hora: "16:00", nome: "Mateus V", servico: "Navalhado", status: "novo" },
    { hora: "17:30", nome: "Caio F", servico: "Corte+barba", status: "ok" },
  ],
  [
    { hora: "18:00", nome: "Gabriel T", servico: "Sobrancelha", status: "ok" },
    { hora: "18:30", nome: "Pedro H", servico: "Degrade", status: "ok" },
    { hora: "19:00", nome: "Joao V", servico: "Corte", status: "novo" },
    { hora: "19:30", nome: "", servico: "", status: "livre" },
  ],
]

const ROTULO = { ok: "Confirmado", novo: "Novo", livre: "Livre" }

function Situacao({ s }: { s: Linha["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-[5.6rem] items-center justify-center gap-1.5 rounded-full text-[10px] uppercase tracking-[0.16em] transition-colors duration-500",
        s === "ok" && "border border-[#efe6d2]/20 text-[#efe6d2]/60",
        s === "novo" && "fundo-ouro font-semibold",
        s === "livre" && "border border-[#d4aa55]/60 text-[#d4aa55]",
      )}
    >
      {s === "novo" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0b0a09]" />}
      {ROTULO[s]}
    </span>
  )
}

/** Relógio de quem está vendo, em palhetas. Começa em "--:--" pra não divergir do servidor. */
function Relogio() {
  const [hora, setHora] = useState("--:--")
  useEffect(() => {
    const marcar = () =>
      setHora(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))
    marcar()
    const id = setInterval(marcar, 15000)
    return () => clearInterval(id)
  }, [])
  return <Campo texto={hora} largura={5} />
}

/**
 * O quadro de horários do dia: madeira laqueada, moldura dourada e palhetas.
 * A cada poucos segundos o dia "anda" e as linhas trocam; só gira quando
 * está na tela.
 */
export function Placar({ className }: { className?: string }) {
  const [pagina, setPagina] = useState(0)
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let visivel = true
    const obs = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
    })
    if (raiz.current) obs.observe(raiz.current)
    const id = setInterval(() => {
      if (visivel) setPagina((p) => (p + 1) % DIA.length)
    }, 5200)
    return () => {
      clearInterval(id)
      obs.disconnect()
    }
  }, [])

  const linhas = DIA[pagina]

  return (
    <div
      ref={raiz}
      className={cn(
        "relative rounded-[1.4rem] bg-gradient-to-b from-[#1b1611] to-[#0f0c0a] p-[3px] shadow-[0_60px_140px_-40px_rgb(212_170_85/0.45)]",
        className,
      )}
    >
      {/* moldura dupla em ouro */}
      <div className="rounded-[1.25rem] border border-[#d4aa55]/70 p-1.5">
        <div className="rounded-[1rem] border border-[#d4aa55]/25 bg-[#0d0b09] px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
          <div className="flex items-center justify-between gap-4">
            <p className="letreiro text-[11px] text-[#d4aa55] md:text-xs">Quadro de hoje</p>
            <div className="text-[13px] font-medium text-[#efe6d2] md:text-[15px]">
              <Relogio />
            </div>
          </div>
          <div className="meandro mt-3" aria-hidden />

          <div role="table" aria-label="Agendamentos de hoje" className="mt-4 flex flex-col gap-2.5 text-[13px] font-medium text-[#efe6d2] md:text-[15px]">
            {linhas.map((l, i) => (
              <div role="row" key={i} className="flex items-center gap-3 md:gap-4">
                <span role="cell" className="text-[#e7c878]">
                  <Campo texto={l.hora} largura={5} atraso={i * 90} />
                </span>
                <span role="cell">
                  <Campo texto={l.nome} largura={9} atraso={120 + i * 90} />
                </span>
                <span role="cell" className="hidden text-[#efe6d2]/75 xl:inline">
                  <Campo texto={l.servico} largura={11} atraso={260 + i * 90} />
                </span>
                <span role="cell" className="ml-auto">
                  <Situacao s={l.status} />
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#efe6d2]/40">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d4aa55]" />
              Ao vivo
            </span>
            <span>kairos.app/sua-barbearia</span>
          </p>
        </div>
      </div>
    </div>
  )
}

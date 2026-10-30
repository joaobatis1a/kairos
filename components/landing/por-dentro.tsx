"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"
import { Revelar } from "@/components/landing/revelar"
import { cn } from "@/lib/utils"

const DURACAO = 7000

const ABAS = [
  {
    rotulo: "O cliente",
    titulo: "Agenda sozinho, no link da sua barbearia.",
    texto: "Ele escolhe o serviço, o profissional e o horário livre, sem app para instalar e sem conversa por mensagem.",
    itens: ["Horário ocupado some em tempo real", "Escolha do barbeiro e da forma de pagamento", "Confirmação automática por e-mail"],
  },
  {
    rotulo: "A equipe",
    titulo: "Abre o painel e já sabe o dia inteiro.",
    texto: "O barbeiro enxerga só os próprios atendimentos. O dono vê a casa inteira e move o que precisar.",
    itens: ["Confirmar, finalizar ou cancelar em um clique", "Acesso separado por cargo", "Atualiza sozinho, sem recarregar"],
  },
  {
    rotulo: "Você",
    titulo: "Fecha o mês sem abrir uma planilha.",
    texto: "Faturamento do dia, da semana e do mês, quanto cada barbeiro rendeu e o que os clientes acharam.",
    itens: ["Ranking de barbeiros por receita", "Serviços mais pedidos", "Avaliação do cliente após cada corte"],
  },
]

/** Número que sobe até o valor quando o mockup entra. */
function useContagem(alvo: number, ms = 1300) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduzido) {
      setV(alvo)
      return
    }
    let raf = 0
    const ini = performance.now()
    const passo = (t: number) => {
      const p = Math.min(1, (t - ini) / ms)
      setV(Math.round(alvo * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [alvo, ms])
  return v
}

/**
 * Espelho de barbearia: moldura dupla em ouro com quatro cravos nos cantos,
 * e a tela do sistema como o "reflexo" lá dentro.
 */
function Janela({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-[1.6rem] border border-[#d4aa55]/70 p-2 shadow-[0_60px_140px_-50px_rgb(212_170_85/0.4)]">
      {["left-2 top-2", "right-2 top-2", "bottom-2 left-2", "bottom-2 right-2"].map((c) => (
        <span key={c} aria-hidden className={`absolute ${c} z-10 h-1.5 w-1.5 rounded-full bg-[#e7c878] shadow-[0_0_6px_rgb(231_200_120/0.8)]`} />
      ))}
      <div className="relative overflow-hidden rounded-[1.2rem] border border-[#d4aa55]/25 bg-card">
        {/* brilho de vidro passando na diagonal */}
        <span aria-hidden className="pointer-events-none absolute -inset-y-10 left-[-30%] z-10 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-[#efe6d2]/[0.05] to-transparent" />
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2 w-2 rounded-full bg-foreground/20" />
          <i className="h-2 w-2 rounded-full bg-foreground/20" />
          <i className="h-2 w-2 rounded-full bg-foreground/20" />
        </span>
        <span className="text-[11px] text-muted-foreground">{url}</span>
      </div>
      <div className="min-h-[21rem] p-5 md:min-h-[24rem] md:p-6">{children}</div>
      </div>
    </div>
  )
}

const HORARIOS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30"]
const OCUPADOS = new Set(["10:00", "11:30", "14:00"])

function MockCliente() {
  const livres = HORARIOS.filter((h) => !OCUPADOS.has(h))
  const [sel, setSel] = useState(-1)
  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduzido) {
      setSel(2)
      return
    }
    const ids = [setTimeout(() => setSel(0), 700), setTimeout(() => setSel(1), 1700), setTimeout(() => setSel(3), 2700)]
    return () => ids.forEach(clearTimeout)
  }, [])
  const escolhido = sel >= 0 ? livres[sel] : null

  return (
    <Janela url="kairos.app/sua-barbearia">
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Escolha o horário</p>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
        <div>
          <p className="text-sm font-medium">Corte + Barba</p>
          <p className="text-[11px] text-muted-foreground">com Marcos · 40 min</p>
        </div>
        <p className="text-sm font-medium text-primary">R$ 70</p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {HORARIOS.map((h) => {
          const ocupado = OCUPADOS.has(h)
          const ativo = h === escolhido
          return (
            <span
              key={h}
              className={cn(
                "rounded-lg border py-2.5 text-center text-xs tabular-nums transition-all duration-300",
                ocupado && "border-transparent text-foreground/25 line-through",
                !ocupado && !ativo && "border-border text-foreground/80",
                ativo && "scale-[1.04] border-primary bg-primary font-semibold text-primary-foreground",
              )}
            >
              {h}
            </span>
          )
        })}
      </div>
      <div
        className={cn(
          "mt-5 flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-xs text-primary transition-all duration-500",
          escolhido ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <Check className="h-4 w-4" />
        {escolhido ? `Agendado para hoje, ${escolhido}` : "Agendado"}
      </div>
    </Janela>
  )
}

const AGENDA = [
  { h: "09:00", n: "Rafael M.", s: "Corte + barba", st: "Finalizado" },
  { h: "10:30", n: "Bruno A.", s: "Corte degradê", st: "Confirmado" },
  { h: "11:30", n: "Thiago L.", s: "Barba", st: "Confirmado" },
]

function MockEquipe() {
  const [novo, setNovo] = useState(false)
  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduzido) {
      setNovo(true)
      return
    }
    const id = setTimeout(() => setNovo(true), 1500)
    return () => clearTimeout(id)
  }, [])

  return (
    <Janela url="kairos.app/painel/agenda">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Agenda de hoje</p>
        <p className="text-[11px] tabular-nums text-muted-foreground">{novo ? 4 : 3} atendimentos</p>
      </div>
      <ul className="mt-4 divide-y divide-border">
        {AGENDA.map((a) => (
          <li key={a.h} className="flex items-center gap-4 py-3.5">
            <span className="w-12 text-sm tabular-nums text-primary">{a.h}</span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{a.n}</span>
              <span className="block text-[11px] text-muted-foreground">{a.s}</span>
            </span>
            <span className="rounded-md border border-border px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {a.st}
            </span>
          </li>
        ))}
        <AnimatePresence>
          {novo && (
            <motion.li
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="-mx-2 flex items-center gap-4 rounded-lg bg-primary/10 px-2 py-3.5 ring-1 ring-primary/40">
                <span className="w-12 text-sm tabular-nums text-primary">14:00</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">Diego S.</span>
                  <span className="block text-[11px] text-muted-foreground">Corte · novo agendamento</span>
                </span>
                <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Novo
                </span>
              </div>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>
    </Janela>
  )
}

const BARRAS = [38, 54, 44, 70, 62, 92, 76]
const RANKING = [
  { n: "Marcos", c: 32, v: "R$ 1.180" },
  { n: "Ana", c: 24, v: "R$ 860" },
  { n: "João", c: 18, v: "R$ 610" },
]

function MockDono() {
  const total = useContagem(3240)
  return (
    <Janela url="kairos.app/painel">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Faturamento do mês</p>
          <p className="titulo mt-2 text-5xl tabular-nums [font-variant-numeric:lining-nums_tabular-nums]">R$ {total.toLocaleString("pt-BR")}</p>
        </div>
        <span className="rounded-md bg-primary/15 px-2 py-1 text-[11px] text-primary">+16%</span>
      </div>
      <div className="mt-5 flex h-24 items-end gap-2">
        {BARRAS.map((b, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${b}%` }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className={cn("flex-1 rounded-t-md", i === 5 ? "bg-primary" : "bg-foreground/15")}
          />
        ))}
      </div>
      <ul className="mt-5 divide-y divide-border text-xs">
        {RANKING.map((r, i) => (
          <li key={r.n} className="flex items-center gap-3 py-2.5">
            <span className="w-4 text-muted-foreground">{i + 1}</span>
            <span className="flex-1 font-medium">{r.n}</span>
            <span className="text-muted-foreground">{r.c} cortes</span>
            <span className="w-20 text-right tabular-nums">{r.v}</span>
          </li>
        ))}
      </ul>
    </Janela>
  )
}

const MOCKS = [MockCliente, MockEquipe, MockDono]

export function PorDentro() {
  const [ativo, setAtivo] = useState(0)
  const [manual, setManual] = useState(false)
  const [visivel, setVisivel] = useState(false)
  const raiz = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = raiz.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.35 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // passa sozinho de aba em aba, até a pessoa escolher uma
  useEffect(() => {
    if (manual || !visivel) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setTimeout(() => setAtivo((a) => (a + 1) % ABAS.length), DURACAO)
    return () => clearTimeout(id)
  }, [ativo, manual, visivel])

  const Mock = MOCKS[ativo]
  const aba = ABAS[ativo]

  return (
    <section id="por-dentro" ref={raiz} className="kairos-noite relative scroll-mt-16 overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_80%_45%,rgb(212_170_85/0.1),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Revelar>
            <p className="letreiro flex items-center gap-3 text-[11px] text-primary md:text-xs">
              <span className="h-px w-8 bg-primary" />
              Por dentro da casa
            </p>
            <h2 className="titulo mt-6 text-[clamp(2.6rem,4.6vw,4.6rem)]">
              Uma tela para cada um, <em className="ouro-folha pr-1 italic">sem se atropelar.</em>
            </h2>
          </Revelar>

          <ul className="mt-12" role="tablist" aria-label="Pontos de vista">
            {ABAS.map((a, i) => {
              const aberto = ativo === i
              return (
                <li key={a.rotulo} className="relative border-t border-border last:border-b">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={aberto}
                    onClick={() => {
                      setAtivo(i)
                      setManual(true)
                    }}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className={cn("titulo text-2xl transition-colors duration-300 md:text-3xl", aberto ? "text-primary" : "text-foreground/45 hover:text-foreground/80")}>
                      <span className="mr-4 text-[11px] tabular-nums tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                      {a.rotulo}
                    </span>
                  </button>
                  <div className={cn("grid transition-[grid-template-rows] duration-500", aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="max-w-md pb-2 text-base font-medium leading-snug">{a.titulo}</p>
                      <p className="max-w-md pb-6 text-sm leading-relaxed text-muted-foreground">{a.texto}</p>
                    </div>
                  </div>
                  {aberto && !manual && (
                    <span
                      key={`${ativo}-${visivel}`}
                      aria-hidden
                      className="barra-aba absolute -top-px left-0 h-px bg-primary"
                      style={{ animationDuration: `${DURACAO}ms` }}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={ativo}
              role="tabpanel"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Mock />
            </motion.div>
          </AnimatePresence>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 text-[11px] text-muted-foreground">
            {aba.itens.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

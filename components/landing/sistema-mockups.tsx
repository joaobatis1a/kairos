"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Check, Scissors, TrendingUp } from "lucide-react"
import { Contador } from "@/components/landing/contador"
import { useSemCursor } from "@/components/landing/card-recurso"
import { cn } from "@/lib/utils"

/**
 * Moldura comum dos mockups. No desktop reage ao cursor; no celular, onde
 * hover não existe, levanta sozinha ao cruzar o meio da tela.
 */
function Painel({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const semCursor = useSemCursor()
  const noCentro = useInView(ref, { margin: "-40% 0px -40% 0px" })
  const ativo = semCursor && noCentro

  return (
    <motion.div
      ref={ref}
      data-ativo={ativo}
      animate={ativo ? { y: -6 } : { y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "rounded-xl border border-border/80 bg-card/80 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-colors duration-500 hover:border-primary/30 data-[ativo=true]:border-primary/30",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

const HORARIOS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30"]
const OCUPADOS = new Set(["10:00", "11:30", "14:00"])
const ESCOLHIDO = "10:30"

/**
 * 01 — a página pública da barbearia. Encena o agendamento: os horários
 * aparecem, um é escolhido e a confirmação entra. Conta a história do
 * produto em ~2s, sem precisar de vídeo.
 */
export function MockupAgendamento() {
  const ref = useRef<HTMLDivElement>(null)
  const emVista = useInView(ref, { once: true, margin: "-80px" })
  const [selecionado, setSelecionado] = useState(false)
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    if (!emVista) return
    const t1 = setTimeout(() => setSelecionado(true), 900)
    const t2 = setTimeout(() => setConfirmado(true), 1500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [emVista])

  return (
    <div ref={ref}>
      <Painel>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Escolha o horário</p>

        <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/25 bg-primary/[0.06] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Scissors className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Corte + Barba</p>
            <p className="text-xs text-muted-foreground">com Marcos · 40 min</p>
          </div>
          <span className="font-serif text-base text-primary">R$ 70</span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {HORARIOS.map((h, i) => {
            const ocupado = OCUPADOS.has(h)
            const ativo = selecionado && h === ESCOLHIDO
            return (
              <motion.div
                key={h}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.045, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative rounded-md border py-2 text-center text-xs transition-colors duration-500",
                  ativo
                    ? "border-primary bg-primary text-primary-foreground"
                    : ocupado
                      ? "border-border/60 bg-muted/30 text-muted-foreground/35 line-through"
                      : "border-border text-muted-foreground",
                )}
              >
                {h}
                {ativo && (
                  <motion.span
                    initial={{ opacity: 0.9, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.45 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="pointer-events-none absolute -inset-px rounded-md ring-2 ring-primary"
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={false}
          animate={confirmado ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 flex items-center justify-center gap-2 rounded-md bg-emerald-500/10 py-2.5 text-xs font-medium text-emerald-400"
        >
          <motion.span
            initial={false}
            animate={confirmado ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.1 }}
            className="flex"
          >
            <Check className="h-3.5 w-3.5" />
          </motion.span>
          Agendamento confirmado
        </motion.div>
      </Painel>
    </div>
  )
}

const AGENDA = [
  { hora: "09:00", servico: "Corte clássico", cliente: "Carlos Menezes", status: "Finalizado" },
  { hora: "10:30", servico: "Corte + Barba", cliente: "João Silva", status: "Confirmado" },
  { hora: "11:30", servico: "Barba na navalha", cliente: "Pedro Souza", status: "Pendente" },
  { hora: "14:30", servico: "Pezinho", cliente: "Rafael Lima", status: "Confirmado" },
]

const CORES_STATUS: Record<string, string> = {
  Finalizado: "bg-muted text-muted-foreground",
  Confirmado: "bg-emerald-500/12 text-emerald-400",
  Pendente: "bg-primary/12 text-primary",
}

/** 02 — a agenda do dia, do ponto de vista da equipe. */
export function MockupAgenda() {
  return (
    <Painel>
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Agenda de hoje</p>
        <p className="text-xs text-muted-foreground">4 atendimentos</p>
      </div>

      <div className="mt-4 flex flex-col">
        {AGENDA.map((a, i) => (
          <motion.div
            key={a.hora}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ x: 4 }}
            className="group flex items-center gap-4 border-t border-border/60 py-3 first:border-t-0"
          >
            <span className="font-serif text-sm text-primary">{a.hora}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{a.servico}</p>
              <p className="truncate text-xs text-muted-foreground">{a.cliente}</p>
            </div>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", CORES_STATUS[a.status])}>
              {a.status}
            </span>
          </motion.div>
        ))}
      </div>
    </Painel>
  )
}

const BARRAS = [42, 58, 47, 71, 63, 88, 76]
const RANKING = [
  { nome: "Marcos", cortes: 32, valor: 1180 },
  { nome: "Ana", cortes: 24, valor: 860 },
  { nome: "João", cortes: 18, valor: 610 },
]

/** 03 — os números do mês, do ponto de vista do dono. */
export function MockupNumeros() {
  return (
    <Painel>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Faturamento do mês</p>
          <p className="mt-1 font-serif text-3xl text-primary">
            <Contador valor={3240} prefixo="R$ " />
          </p>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, type: "spring", stiffness: 360, damping: 20 }}
          className="mt-1 flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-1 text-[10px] font-medium text-emerald-400"
        >
          <TrendingUp className="h-3 w-3" /> +18%
        </motion.span>
      </div>

      <div className="mt-5 flex h-16 items-end gap-1.5">
        {BARRAS.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/25 to-primary/70"
          />
        ))}
      </div>

      <div className="mt-5 flex flex-col border-t border-border/60 pt-3">
        {RANKING.map((r, i) => (
          <motion.div
            key={r.nome}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
            className="flex items-center justify-between py-1.5 text-xs"
          >
            <span className="text-muted-foreground">
              <span className="mr-2 font-serif text-primary/60">{i + 1}</span>
              {r.nome}
            </span>
            <span className="text-muted-foreground">{r.cortes} cortes</span>
            <span className="font-medium">
              <Contador valor={r.valor} prefixo="R$ " duracao={1.2} />
            </span>
          </motion.div>
        ))}
      </div>
    </Painel>
  )
}

"use client"

import { useTransition } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dispensarOnboarding, type OnboardingStatus } from "@/app/actions/config"
import { CheckCircle2, Circle, X, Scissors, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const PASSOS = [
  { chave: "temServico" as const, label: "Cadastre um serviço", href: "/painel/gerenciamento", icon: Scissors },
  { chave: "temHorario" as const, label: "Defina o horário de funcionamento", href: "/painel/gerenciamento", icon: Clock },
  { chave: "temBarbeiro" as const, label: "Adicione um barbeiro", href: "/painel/equipe", icon: Users },
]

export function OnboardingChecklist({ status }: { status: OnboardingStatus }) {
  const [pending, startTransition] = useTransition()

  if (status.dispensado) return null

  const feitos = PASSOS.filter((p) => status[p.chave]).length
  const completo = feitos === PASSOS.length

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="cartao-interativo relative overflow-hidden border-primary/20">
        <button
          type="button"
          onClick={() => startTransition(() => { void dispensarOnboarding() })}
          disabled={pending}
          aria-label="Dispensar checklist"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <CardContent className="flex flex-col gap-4 pt-1">
          <div>
            <h2 className="font-serif text-lg font-semibold">
              {completo ? "Tudo pronto! 🎉" : "Primeiros passos"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {completo
                ? "Sua barbearia já está configurada e pronta para receber agendamentos."
                : `${feitos} de ${PASSOS.length} concluídos — falta pouco para sua barbearia ficar pronta.`}
            </p>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(feitos / PASSOS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {!completo && (
            <div className="flex flex-col gap-2">
              {PASSOS.map((passo) => {
                const feito = status[passo.chave]
                return (
                  <div
                    key={passo.chave}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                      feito ? "border-border/50 bg-muted/20" : "border-border bg-card",
                    )}
                  >
                    {feito ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <passo.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className={cn("flex-1 text-sm", feito && "text-muted-foreground line-through")}>
                      {passo.label}
                    </span>
                    {!feito && (
                      <Button asChild size="sm">
                        <Link href={passo.href}>Configurar</Link>
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

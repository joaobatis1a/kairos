"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { stagger, item } from "@/lib/motion"
import { Loader2, CalendarDays, DollarSign, ShieldCheck, Scissors, Lock } from "lucide-react"
import { salvarPermissoesEquipe, type PermissoesEquipe } from "@/app/actions/permissoes"
import { cn } from "@/lib/utils"

const OPCOES: {
  chave: keyof PermissoesEquipe
  titulo: string
  descricao: string
  icon: React.ElementType
}[] = [
  {
    chave: "ver_agendamentos_todos",
    titulo: "Ver agendamentos de todos os barbeiros",
    descricao: "Sem isso, cada barbeiro só vê os próprios atendimentos na agenda.",
    icon: CalendarDays,
  },
  {
    chave: "ver_faturamento",
    titulo: "Ver faturamento da barbearia",
    descricao: "Mostra receita de hoje, da semana e do mês na agenda do barbeiro.",
    icon: DollarSign,
  },
]

export function CargosView({
  permissoesIniciais,
  totalBarbeiros,
}: {
  permissoesIniciais: PermissoesEquipe
  totalBarbeiros: number
}) {
  const [permissoes, setPermissoes] = useState(permissoesIniciais)
  const [pending, startTransition] = useTransition()

  function alternar(chave: keyof PermissoesEquipe, valor: boolean) {
    const atualizado = { ...permissoes, [chave]: valor }
    setPermissoes(atualizado)
    startTransition(async () => {
      const res = await salvarPermissoesEquipe(atualizado)
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao salvar.")
        setPermissoes(permissoes)
        return
      }
      toast.success("Permissões atualizadas.")
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Cargos e permissões</h1>
        <p className="text-muted-foreground">O que os barbeiros da sua equipe podem ver no painel.</p>
      </div>

      {/* Os dois cargos que existem no sistema — dono é fixo (sempre vê
          tudo, não configurável) e barbeiro é o único cargo com permissões
          ajustáveis. Mesmo tratamento visual de cargos-como-cartão do
          práxis, só que sem seletor: aqui só tem um cargo pra configurar,
          então o cartão do barbeiro já mostra o painel de permissões
          embaixo direto, sem precisar clicar. */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2">
        <motion.div
          variants={item}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-serif text-base font-semibold">Dono</h3>
          <p className="mt-1 text-sm text-muted-foreground">Acesso total à barbearia.</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Lock className="h-3 w-3" />
            Sempre liberado, não editável
          </span>
        </motion.div>

        <motion.div
          variants={item}
          className="cartao-interativo rounded-xl border border-primary/40 bg-card p-5 ring-1 ring-primary/20"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Scissors className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-serif text-base font-semibold">Barbeiro</h3>
          <p className="mt-1 text-sm text-muted-foreground">Vale pra toda a equipe — configurável abaixo.</p>
          <p className="mt-3 text-xs font-medium text-muted-foreground">
            {totalBarbeiros} {totalBarbeiros === 1 ? "pessoa" : "pessoas"} nesse cargo
          </p>
        </motion.div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Permissões do barbeiro</CardTitle>
          <CardDescription>Ative ou desative o que o cargo pode ver no painel.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border p-0">
          {OPCOES.map((op, i) => (
            <motion.div
              key={op.chave}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/40",
                i === 0 && "pt-2",
                i === OPCOES.length - 1 && "pb-2",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <op.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{op.titulo}</p>
                  <p className="text-xs text-muted-foreground">{op.descricao}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                <Switch
                  checked={permissoes[op.chave]}
                  onCheckedChange={(v) => alternar(op.chave, v)}
                  disabled={pending}
                  aria-label={op.titulo}
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

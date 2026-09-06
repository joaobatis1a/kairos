"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Loader2, KeyRound, CalendarDays, DollarSign } from "lucide-react"
import { salvarPermissoesEquipe, type PermissoesEquipe } from "@/app/actions/permissoes"

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

export function CargosView({ permissoesIniciais }: { permissoesIniciais: PermissoesEquipe }) {
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <KeyRound className="h-4 w-4 text-primary" /> Barbeiro
          </CardTitle>
          <CardDescription>
            Vale pra toda a equipe. Dono sempre vê tudo, não precisa configurar nada pra ele.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {OPCOES.map((op) => (
            <div
              key={op.chave}
              className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-4"
            >
              <div className="flex items-start gap-3">
                <op.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
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
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

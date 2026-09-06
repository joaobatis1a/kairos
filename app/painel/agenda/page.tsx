import { listarAgendamentos } from "@/app/actions/painel"
import { getFaturamentoResumo } from "@/app/actions/dashboard"
import { ListaAgendamentos } from "@/components/painel/lista-agendamentos"
import { formatarPreco } from "@/lib/format"
import { CalendarCheck } from "lucide-react"

export default async function AgendaBarbeiroPage() {
  const [agendamentos, faturamento] = await Promise.all([listarAgendamentos(), getFaturamentoResumo()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">Minha agenda</h1>
        <p className="text-sm text-muted-foreground">
          Todos os agendamentos atribuídos a você. Atualiza em tempo real.
        </p>
      </div>

      {faturamento && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">Hoje</p>
            <p className="font-serif text-lg font-semibold text-primary">{formatarPreco(faturamento.receitaHoje)}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">Semana</p>
            <p className="font-serif text-lg font-semibold text-primary">{formatarPreco(faturamento.receitaSemana)}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <p className="text-xs text-muted-foreground">Mês</p>
            <p className="font-serif text-lg font-semibold text-primary">{formatarPreco(faturamento.receitaMes)}</p>
          </div>
        </div>
      )}

      {agendamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <CalendarCheck className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Você ainda não tem agendamentos.</p>
        </div>
      ) : (
        <ListaAgendamentos agendamentosIniciais={agendamentos} mostrarBarbeiro={false} />
      )}
    </div>
  )
}

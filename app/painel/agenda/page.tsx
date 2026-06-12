import { listarAgendamentos } from "@/app/actions/painel"
import { ListaAgendamentos } from "@/components/painel/lista-agendamentos"
import { CalendarCheck } from "lucide-react"

export default async function AgendaBarbeiroPage() {
  const agendamentos = await listarAgendamentos()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold md:text-3xl">Minha agenda</h1>
        <p className="text-sm text-muted-foreground">
          Todos os agendamentos atribuídos a você. Atualiza em tempo real.
        </p>
      </div>

      {agendamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <CalendarCheck className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Você ainda não tem agendamentos.</p>
        </div>
      ) : (
        <ListaAgendamentos inicial={agendamentos} mostrarBarbeiro={false} />
      )}
    </div>
  )
}

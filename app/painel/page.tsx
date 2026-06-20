import { getPerfilOuRedirect } from "@/lib/auth"
import { listarAgendamentos } from "@/app/actions/painel"
import { formatarPreco } from "@/config/barbearia"
import { ListaAgendamentos } from "@/components/painel/lista-agendamentos"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, CheckCircle2, DollarSign } from "lucide-react"
import { formatarDataExtenso } from "@/lib/datas"

export const dynamic = "force-dynamic"

function hojeIso() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export default async function PainelHome() {
  const perfil = await getPerfilOuRedirect()
  const isOwner = perfil.role === "owner"
  const hoje = hojeIso()

  const todos = await listarAgendamentos()
  const deHoje = todos.filter((a) => a.data === hoje && a.status !== "cancelado")
  const pendentes = todos.filter((a) => a.status === "pendente")
  const concluidosHoje = deHoje.filter((a) => a.status === "confirmado" || a.status === "finalizado")
  const finalizadosHoje = deHoje.filter((a) => a.status === "finalizado")
  const faturamentoHoje = finalizadosHoje.reduce((sum, a) => sum + Number(a.servico_preco), 0)

  const stats = [
    { label: "Hoje", valor: deHoje.length, icon: CalendarDays },
    { label: "Pendentes", valor: pendentes.length, icon: Clock },
    { label: "Confirmados hoje", valor: concluidosHoje.length, icon: CheckCircle2 },
    {
      label: "Faturamento (finalizados)",
      valor: formatarPreco(faturamentoHoje),
      icon: DollarSign,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">
          Olá, {perfil.nome?.split(" ")[0] || "bem-vindo"}
        </h1>
        <p className="capitalize text-muted-foreground">{formatarDataExtenso(hoje)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold leading-tight">{s.valor}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl font-semibold">Agendamentos de hoje</h2>
        <ListaAgendamentos
          agendamentosIniciais={deHoje}
          mostrarBarbeiro={isOwner}
          vazioTexto="Nenhum agendamento para hoje ainda."
        />
      </div>
    </div>
  )
}

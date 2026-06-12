"use client"

import { useState, useMemo } from "react"
import type { AgendamentoComBarbeiro, StatusAgendamento } from "@/lib/types"
import { ListaAgendamentos } from "@/components/painel/lista-agendamentos"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDiasDisponiveis } from "@/lib/datas"
import { cn } from "@/lib/utils"

const filtrosStatus: { value: StatusAgendamento | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendentes" },
  { value: "confirmado", label: "Confirmados" },
  { value: "cancelado", label: "Cancelados" },
]

export function AgendamentosView({ agendamentos }: { agendamentos: AgendamentoComBarbeiro[] }) {
  const [status, setStatus] = useState<StatusAgendamento | "todos">("todos")
  const [data, setData] = useState<string>("todos")

  const dias = useMemo(() => getDiasDisponiveis(14), [])

  const filtrados = useMemo(() => {
    return agendamentos.filter((a) => {
      if (status !== "todos" && a.status !== status) return false
      if (data !== "todos" && a.data !== data) return false
      return true
    })
  }, [agendamentos, status, data])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Agendamentos</h1>
        <p className="text-muted-foreground">Gerencie todos os horários da barbearia.</p>
      </div>

      <Tabs value={status} onValueChange={(v) => setStatus(v as StatusAgendamento | "todos")}>
        <TabsList>
          {filtrosStatus.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setData("todos")}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
            data === "todos"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-primary/60",
          )}
        >
          Todas as datas
        </button>
        {dias.map((d) => (
          <button
            key={d.value}
            onClick={() => setData(d.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
              data === d.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/60",
            )}
          >
            {d.diaSemana} {d.label}
          </button>
        ))}
      </div>

      <ListaAgendamentos
        agendamentosIniciais={filtrados}
        mostrarBarbeiro
        vazioTexto="Nenhum agendamento com esses filtros."
      />
    </div>
  )
}

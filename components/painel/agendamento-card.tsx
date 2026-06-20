"use client"

import { useState, useTransition } from "react"
import type { AgendamentoComBarbeiro, StatusAgendamento } from "@/lib/types"
import { formatarPreco } from "@/config/barbearia"
import { formatarDataExtenso } from "@/lib/datas"
import { atualizarStatusAgendamento, excluirAgendamento } from "@/app/actions/painel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  Clock,
  User,
  Phone,
  Scissors,
  Check,
  X,
  Trash2,
  MessageCircle,
  Loader2,
  CheckCheck,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig: Record<StatusAgendamento, { label: string; classe: string }> = {
  pendente: { label: "Pendente", classe: "bg-primary/15 text-primary border-primary/30" },
  confirmado: { label: "Confirmado", classe: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  finalizado: { label: "Finalizado", classe: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  cancelado: { label: "Cancelado", classe: "bg-destructive/15 text-destructive border-destructive/30" },
}

const LABELS_PAGAMENTO: Record<string, string> = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  debito: "Cartão de débito",
  credito: "Cartão de crédito",
}

export function AgendamentoCard({
  ag,
  mostrarBarbeiro,
}: {
  ag: AgendamentoComBarbeiro
  mostrarBarbeiro?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)

  function mudarStatus(status: StatusAgendamento) {
    startTransition(async () => {
      const res = await atualizarStatusAgendamento(ag.id, status)
      if (!res.ok) toast.error(res.error ?? "Erro ao atualizar")
      else toast.success(`Agendamento ${statusConfig[status].label.toLowerCase()}.`)
    })
  }

  function excluir() {
    startTransition(async () => {
      const res = await excluirAgendamento(ag.id)
      if (!res.ok) toast.error(res.error ?? "Erro ao excluir")
      else toast.success("Agendamento excluído.")
      setConfirmarExclusao(false)
    })
  }

  const whatsappLink = `https://wa.me/55${ag.cliente_whatsapp.replace(/\D/g, "")}`

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors",
        ag.status === "cancelado" && "border-border opacity-60",
        ag.status === "finalizado" && "border-emerald-500/20",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold leading-tight">{ag.horario.slice(0, 5)}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {formatarDataExtenso(ag.data)}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={statusConfig[ag.status].classe}>
          {statusConfig[ag.status].label}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{ag.cliente_nome}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Scissors className="h-3.5 w-3.5" />
          <span>{ag.servico_nome}</span>
          <span className="text-primary">· {formatarPreco(Number(ag.servico_preco))}</span>
        </div>
        {ag.forma_pagamento && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" />
            <span>{LABELS_PAGAMENTO[ag.forma_pagamento] ?? ag.forma_pagamento}</span>
          </div>
        )}
        {mostrarBarbeiro && ag.barbeiro?.nome && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>Barbeiro: {ag.barbeiro.nome}</span>
          </div>
        )}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>{ag.cliente_whatsapp}</span>
        </a>
        {ag.observacoes && (
          <p className="mt-1 rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
            {ag.observacoes}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
        {/* Pendente → Confirmar */}
        {ag.status === "pendente" && (
          <Button size="sm" disabled={pending} onClick={() => mudarStatus("confirmado")}>
            <Check className="h-3.5 w-3.5" /> Confirmar
          </Button>
        )}
        {/* Confirmado → Finalizar */}
        {ag.status === "confirmado" && (
          <Button size="sm" disabled={pending} onClick={() => mudarStatus("finalizado")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <CheckCheck className="h-3.5 w-3.5" /> Finalizar
          </Button>
        )}
        {/* Qualquer status não-cancelado → Cancelar */}
        {ag.status !== "cancelado" && ag.status !== "finalizado" && (
          <Button size="sm" variant="outline" disabled={pending} onClick={() => mudarStatus("cancelado")}>
            <X className="h-3.5 w-3.5" /> Cancelar
          </Button>
        )}
        <Button size="sm" variant="outline" asChild>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto text-muted-foreground hover:text-destructive"
          disabled={pending}
          onClick={() => setConfirmarExclusao(true)}
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <Dialog open={confirmarExclusao} onOpenChange={setConfirmarExclusao}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir agendamento?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O registro de {ag.cliente_nome} será removido.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmarExclusao(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={excluir} disabled={pending}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

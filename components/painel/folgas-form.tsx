"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { criarBloqueio, excluirBloqueio, listarBloqueios, type Bloqueio } from "@/app/actions/bloqueios"
import { toast } from "sonner"
import { Plus, Trash2, Loader2, CalendarOff } from "lucide-react"

function formatar(dt: string) {
  return new Date(dt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

export function FolgasForm({
  bloqueios: bloqueiosIniciais,
  barbeiros,
}: {
  bloqueios: Bloqueio[]
  barbeiros: { id: string; nome: string }[]
}) {
  const [bloqueios, setBloqueios] = useState(bloqueiosIniciais)
  const [barbeiro, setBarbeiro] = useState("todos")
  const [inicio, setInicio] = useState("")
  const [fim, setFim] = useState("")
  const [motivo, setMotivo] = useState("")
  const [pending, startTransition] = useTransition()

  function adicionar() {
    if (!inicio || !fim) {
      toast.error("Preencha início e fim.")
      return
    }
    startTransition(async () => {
      const res = await criarBloqueio({
        barbeiroId: barbeiro === "todos" ? null : barbeiro,
        inicio,
        fim,
        motivo,
      })
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Folga adicionada.")
      setInicio("")
      setFim("")
      setMotivo("")
      setBarbeiro("todos")
      setBloqueios(await listarBloqueios())
    })
  }

  function remover(id: string) {
    startTransition(async () => {
      const res = await excluirBloqueio(id)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setBloqueios((prev) => prev.filter((b) => b.id !== id))
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Quem</Label>
          <Select value={barbeiro} onValueChange={(v) => setBarbeiro(v ?? "todos")}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {barbeiro === "todos" ? "Barbearia inteira" : barbeiros.find((b) => b.id === barbeiro)?.nome}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Barbearia inteira</SelectItem>
              {barbeiros.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="folga-motivo">Motivo (opcional)</Label>
          <Input id="folga-motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex: feriado, férias" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="folga-inicio">Início</Label>
          <Input id="folga-inicio" type="datetime-local" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="folga-fim">Fim</Label>
          <Input id="folga-fim" type="datetime-local" value={fim} onChange={(e) => setFim(e.target.value)} />
        </div>
      </div>
      <Button onClick={adicionar} disabled={pending} className="self-start">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Adicionar folga
      </Button>

      {bloqueios.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarOff className="h-4 w-4" /> Nenhuma folga cadastrada.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {bloqueios.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <div>
                <p className="font-medium">
                  {b.barbeiro_nome ?? "Barbearia inteira"}
                  {b.motivo && <span className="text-muted-foreground"> · {b.motivo}</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatar(b.inicio)} → {formatar(b.fim)}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => remover(b.id)}
                disabled={pending}
                aria-label="Remover folga"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

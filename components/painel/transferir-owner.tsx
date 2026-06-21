"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { transferirOwner } from "@/app/actions/conta"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { ShieldAlert, Loader2 } from "lucide-react"

export function TransferirOwner({ usuarios }: { usuarios: { id: string; nome: string; role: string }[] }) {
  const [aberto, setAberto] = useState(false)
  const [confirmacao, setConfirmacao] = useState("")
  const [selecionado, setSelecionado] = useState<string>("")
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const usuarioSelecionado = usuarios.find((u) => u.id === selecionado)

  function confirmar() {
    if (confirmacao !== "TRANSFERIR") {
      toast.error('Digite "TRANSFERIR" para confirmar.')
      return
    }
    startTransition(async () => {
      const res = await transferirOwner(selecionado)
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao transferir.")
        return
      }
      toast.success("Cargo transferido. Você virou cliente.")
      router.push("/")
    })
  }

  return (
    <>
      <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setAberto(true)}>
        <ShieldAlert className="h-4 w-4" /> Transferir cargo de administrador
      </Button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Transferir administrador</DialogTitle>
            <DialogDescription>
              Ao transferir, sua conta vira cliente e você perde acesso ao painel.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid gap-2">
              <Label>Escolha o novo administrador</Label>
              <select
                value={selecionado}
                onChange={(e) => setSelecionado(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Selecione...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} ({u.role === "barber" ? "Barbeiro" : "Cliente"})
                  </option>
                ))}
              </select>
            </div>
            {selecionado && (
              <div className="grid gap-2">
                <Label>Digite <strong>TRANSFERIR</strong> para confirmar</Label>
                <Input
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value)}
                  placeholder="TRANSFERIR"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={!selecionado || confirmacao !== "TRANSFERIR" || pending}
              onClick={confirmar}
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar transferência"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

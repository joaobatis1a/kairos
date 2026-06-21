"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deletarConta } from "@/app/actions/conta"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Trash2, Loader2 } from "lucide-react"

export function DeletarConta() {
  const [aberto, setAberto] = useState(false)
  const [confirmacao, setConfirmacao] = useState("")
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function confirmar() {
    if (confirmacao !== "DELETAR") {
      toast.error('Digite "DELETAR" para confirmar.')
      return
    }
    startTransition(async () => {
      const res = await deletarConta()
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao deletar conta.")
        return
      }
      toast.success("Conta deletada.")
      router.push("/")
    })
  }

  return (
    <>
      <Button
        variant="outline"
        className="text-destructive border-destructive/30 hover:bg-destructive/10"
        onClick={() => { setConfirmacao(""); setAberto(true) }}
      >
        <Trash2 className="h-4 w-4" /> Deletar minha conta
      </Button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Deletar conta</DialogTitle>
            <DialogDescription>
              Esta ação é permanente. Todos os seus dados serão removidos e não poderão ser recuperados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Digite <strong>DELETAR</strong> para confirmar</Label>
            <Input
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="DELETAR"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={confirmacao !== "DELETAR" || pending}
              onClick={confirmar}
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deletar conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

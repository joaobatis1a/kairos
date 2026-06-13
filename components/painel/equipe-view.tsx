"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { Profile } from "@/lib/types"
import {
  criarBarbeiro,
  alternarAtivoBarbeiro,
  removerBarbeiro,
} from "@/app/actions/equipe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { UserPlus, User, Trash2, Loader2, ShieldCheck } from "lucide-react"

export function EquipeView({ equipe, ownerId }: { equipe: Profile[]; ownerId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [pending, startTransition] = useTransition()
  const [removendo, setRemovendo] = useState<string | null>(null)

  function handleCriar() {
    startTransition(async () => {
      const res = await criarBarbeiro({ nome, email, senha })
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao criar barbeiro.")
        return
      }
      toast.success("Barbeiro adicionado com sucesso!")
      setNome("")
      setEmail("")
      setSenha("")
      setOpen(false)
      router.refresh()
    })
  }

  function alternar(id: string, ativo: boolean) {
    startTransition(async () => {
      const res = await alternarAtivoBarbeiro(id, ativo)
      if (!res.ok) toast.error(res.error ?? "Erro ao atualizar.")
      else router.refresh()
    })
  }

  function remover(id: string) {
    startTransition(async () => {
      const res = await removerBarbeiro(id)
      if (!res.ok) toast.error(res.error ?? "Erro ao remover.")
      else {
        toast.success("Barbeiro removido.")
        router.refresh()
      }
      setRemovendo(null)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os barbeiros da sua barbearia.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <UserPlus className="h-4 w-4" /> Adicionar barbeiro
              </Button>
          }
        />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Novo barbeiro</DialogTitle>
              <DialogDescription>
                Crie o acesso do barbeiro. Ele entrará com este e-mail e senha.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha provisória</Label>
                <Input
                  id="senha"
                  type="text"
                  required
                  minLength={6}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCriar} disabled={pending} className="w-full">
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Criando...
                  </>
                ) : (
                  "Criar barbeiro"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipe.map((membro) => {
          const isOwner = membro.role === "owner"
          return (
            <div
              key={membro.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                  {isOwner ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{membro.nome || "Sem nome"}</p>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {isOwner ? "Administrador" : "Barbeiro"}
                  </Badge>
                </div>
              </div>

              {!isOwner && (
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={membro.ativo}
                      onCheckedChange={(v) => alternar(membro.id, v)}
                      disabled={pending}
                      aria-label="Ativo"
                    />
                    <span className="text-sm text-muted-foreground">
                      {membro.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setRemovendo(membro.id)}
                    disabled={pending || membro.id === ownerId}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Dialog open={!!removendo} onOpenChange={(o) => !o && setRemovendo(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover barbeiro?</DialogTitle>
            <DialogDescription>
              O acesso será excluído permanentemente. Os agendamentos existentes serão mantidos sem
              barbeiro associado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemovendo(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => removendo && remover(removendo)}
              disabled={pending}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
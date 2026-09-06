"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { stagger, item } from "@/lib/motion"
import type { Profile } from "@/lib/types"
import {
  obterConviteBarbeiro,
  alternarAtivoBarbeiro,
  removerBarbeiro,
} from "@/app/actions/equipe"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ContadorCodigo } from "@/components/contador-codigo"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { UserPlus, User, Trash2, Loader2, ShieldCheck, Copy } from "lucide-react"

export function EquipeView({ equipe, ownerId }: { equipe: Profile[]; ownerId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [removendo, setRemovendo] = useState<string | null>(null)
  const [codigoGerado, setCodigoGerado] = useState<{ code: string; expiresAt: string } | null>(null)

  function abrirConvite() {
    startTransition(async () => {
      const res = await obterConviteBarbeiro()
      if (!res.ok) {
        toast.error(res.error ?? "Erro ao gerar convite.")
        return
      }
      setCodigoGerado({ code: res.code, expiresAt: res.expiresAt })
    })
  }

  // onExpirar do contador chama de novo — obterConviteBarbeiro já gera um
  // código novo sozinho quando o vigente expirou.
  function refrescarConvite() {
    startTransition(async () => {
      const res = await obterConviteBarbeiro()
      if (res.ok) setCodigoGerado({ code: res.code, expiresAt: res.expiresAt })
    })
  }

  function copiarCodigo() {
    if (!codigoGerado) return
    navigator.clipboard.writeText(codigoGerado.code)
    toast.success("Código copiado!")
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
        <Button onClick={abrirConvite} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Convidar barbeiro
        </Button>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {equipe.map((membro) => {
          const isOwner = membro.role === "owner"
          return (
            <motion.div
              key={membro.id}
              variants={item}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
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
            </motion.div>
          )
        })}
      </motion.div>

      <Dialog open={!!codigoGerado} onOpenChange={(o) => !o && setCodigoGerado(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Código de convite gerado</DialogTitle>
            <DialogDescription>
              Envie esse código pro barbeiro. Ele entra em "Tem um código de convite?" na tela de
              login e escolhe a própria senha.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
            <span className="flex-1 text-center font-mono text-lg tracking-widest">{codigoGerado?.code}</span>
            <Button size="icon" variant="ghost" onClick={copiarCodigo} aria-label="Copiar código">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {codigoGerado && <ContadorCodigo expiresAt={codigoGerado.expiresAt} onExpirar={refrescarConvite} />}
        </DialogContent>
      </Dialog>

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
